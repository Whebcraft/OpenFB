var fbAppId, loginCallback, runningInCordova;
module.exports = {
    init: function (params) {

        if (params.appId) {
            fbAppId = params.appId;
        } else {
            throw 'appId parameter not set in init()';
        }

        if (params.tokenStore) {
            tokenStore = params.tokenStore;
        }

    },
    getLoginStatus: function (callback) {
		var tokenStore = window.localStorage;
        var token = tokenStore.fbAccessToken,
            loginStatus = {};
        if (token) {
            loginStatus.status = 'connected';
            loginStatus.authResponse = {accessToken: token};
        } else {
            loginStatus.status = 'unknown';
        }
        if (callback) callback(loginStatus);
    },
    login: function (callback, options) {
        var cordovaOAuthRedirectURL = "https://www.facebook.com/connect/login_success.html",
        context = window.location.pathname.substring(0, window.location.pathname.lastIndexOf("/")),
        baseURL = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '') + context,
		oauthRedirectURL = baseURL + '/oauthcallback.html';
		
        var loginWindow,
            startTime,
            scope = '',
            redirectURL = runningInCordova ? cordovaOAuthRedirectURL : oauthRedirectURL;

        if (!fbAppId) {
            return callback({status: 'unknown', error: 'Facebook App Id not set.'});
        }
        function loginWindow_loadStartHandler(event) {
            var url = event.url;
            if (url.indexOf("access_token=") > 0 || url.indexOf("error=") > 0) {
                var timeout = 600 - (new Date().getTime() - startTime);
                setTimeout(function () {
                    loginWindow.close();
                }, timeout > 0 ? timeout : 0);
                openfb.oauthCallback(url);
            }
        }
        function loginWindow_exitHandler() {
			var loginProcessed;
            console.log('exit and remove listeners');
            if (loginCallback && !loginProcessed) loginCallback({status: 'user_cancelled'});
            loginWindow.removeEventListener('loadstop', loginWindow_loadStopHandler);
            loginWindow.removeEventListener('exit', loginWindow_exitHandler);
            loginWindow = null;
            console.log('done removing listeners');
        }

        if (options && options.scope) {
            scope = options.scope;
        }
        var loginProcessed;
        loginCallback = callback;
        loginProcessed = false;

        startTime = new Date().getTime();
        loginWindow = window.open('https://www.facebook.com/dialog/oauth?client_id=' + fbAppId + '&redirect_uri=' + redirectURL +
            '&response_type=token&scope=' + scope, '_blank', 'location=no,clearcache=yes');
        if (runningInCordova) {
            loginWindow.addEventListener('loadstart', loginWindow_loadStartHandler);
            loginWindow.addEventListener('exit', loginWindow_exitHandler);
        }
    },
    oauthCallback: function (url) {
		var loginProcessed;
        var queryString,
            obj;
        var tokenStore = window.localStorage;
        loginProcessed = true;
        if (url.indexOf("access_token=") > 0) {
            queryString = url.substr(url.indexOf('#') + 1);
            obj = openfb.parseQueryString(queryString);
            tokenStore.fbAccessToken = obj['access_token'];
            if (loginCallback) loginCallback({status: 'connected', authResponse: {accessToken: obj['access_token']}});
        } else if (url.indexOf("error=") > 0) {
            queryString = url.substring(url.indexOf('?') + 1, url.indexOf('#'));
            obj = openfb.parseQueryString(queryString);
            if (loginCallback) loginCallback({status: 'not_authorized', error: obj.error});
        } else {
            if (loginCallback) loginCallback({status: 'not_authorized'});
        }
    },
    logout: function (callback) {
		var tokenStore = window.localStorage;
		var context = window.location.pathname.substring(0, window.location.pathname.lastIndexOf("/")),
        baseURL = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '') + context,
        logoutRedirectURL = baseURL + '/logoutcallback.html';
        var logoutWindow,
            token = tokenStore.fbAccessToken;
            tokenStore.removeItem('fbtoken');
        if (token) {
            logoutWindow = window.open('https://www.facebook.com/logout.php?access_token=' + token + '&next=' + logoutRedirectURL, '_blank', 'location=no,clearcache=yes');
            if (runningInCordova) {
                setTimeout(function() {
                    logoutWindow.close();
                }, 700);
            }
        }

        if (callback) {
            callback();
        }

    },
    img: function (obj) {
        var tokenStore = window.localStorage;
        var method = obj.method || 'GET',
            params = obj.params || {},
            xhr = new XMLHttpRequest(),
            url;

        params['access_token'] = tokenStore.fbAccessToken;

        url = 'https://graph.facebook.com/v2.7' + obj.path + '?' + openfb.toQueryString(params) +'&fields=id,birthday,email,first_name,gender,last_name,link,locale,name,timezone,updated_time,verified,website&format=json';

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    if (obj.success) obj.success(xhr.responseURL);
                } else {
                    var error = xhr.responseText ? JSON.parse(xhr.responseText).error : {message: 'An error has occurred'};
                    if (obj.error) obj.error(error);
                }
            }
        };

        xhr.open(method, url, true);
        xhr.send();
    },

    api: function (obj) {
        var tokenStore = window.localStorage;
        var method = obj.method || 'GET',
            params = obj.params || {},
            xhr = new XMLHttpRequest(),
            url;

        params['access_token'] = tokenStore.fbAccessToken;

        url = 'https://graph.facebook.com/v2.7' + obj.path + '?' + openfb.toQueryString(params) +'&fields=id,birthday,email,first_name,gender,last_name,link,locale,name,timezone,updated_time,verified,website&format=json';

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    if (obj.success) obj.success(JSON.parse(xhr.responseText));
                } else {
                    var error = xhr.responseText ? JSON.parse(xhr.responseText).error : {message: 'An error has occurred'};
                    if (obj.error) obj.error(error);
                }
            }
        };

        xhr.open(method, url, true);
        xhr.send();
    },
    revokePermissions: function (success, error) {
        return openfb.api({method: 'DELETE',
            path: '/me/permissions',
            success: function () {
                success();
            },
            error: error});
    },

    parseQueryString: function (queryString) {
        var qs = decodeURIComponent(queryString),
            obj = {},
            params = qs.split('&');
        params.forEach(function (param) {
            var splitter = param.split('=');
            obj[splitter[0]] = splitter[1];
        });
        return obj;
    },

    toQueryString: function (obj) {
        var parts = [];
        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                parts.push(encodeURIComponent(i) + "=" + encodeURIComponent(obj[i]));
            }
        }
        return parts.join("&");
    }

};
