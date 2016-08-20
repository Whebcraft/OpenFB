### OpenFB Cordova Facebook Plugin

This plugin has no dependency: You don't need (and shouldn't use) the Facebook SDK with this library.

OpenFB allows you login to Facebook with the Cordova InAppBrowser and execute any Facebook Graph API request.

### Supported Platforms

- Android
- iOS

### Installation

This requires Phonegap / Cordova CLI 3.0 +

- Cordova CLI

```sh
cordova plugin add https://github.com/whebcraft/openfb
```


- Phonegap Build

```sh
    <plugin spec="https://github.com/whebcraft/openfb.git" source="git" />
```

### Getting Started

[fb_apps]: https://developers.facebook.com/apps

- Create html file `oauthcallback.html` in your app `www` folder.
```
<html>
<body>
<script>
    window.opener.openfb.oauthCallback(window.location.href);
    window.close();
</script>
</body>
</html>
```

- Create a Facebook app [here][fb_apps], in the app sidebar under > `PRODUCTS` click on `FACEBOOK LOGIN`.
<img width = "100%" align = "left" hspace = "19" vspace = "12" src = "images/fblogin.png" />


- on FACEBOOK LOGIN page scroll down enter `https://www.facebook.com/connect/login_success.html` and `http://localhost:8888/cordova-open-fb/www/oauthcallback.html` as Valid OAuth redirect URIs - [Required]

<img width = "100%" align = "left" hspace = "39" vspace = "12" src = "images/ValidOAuth.png" />


To Test Facebook login sample on your own system for example:

if during development you access your application from `http://localhost/YOUR-APP/www/index.html` (If testing from localhost) you must also declare `http://localhost/YOUR-APP/www/index.html` as a valid redirect URI.


### Quick Example 
```js

// Int

var fbAppId, loginCallback, runningInCordova = true; // add this to your deviceready function..

openfb.init({appId: 'YOUR_FACEBOOK_APP_ID'});


// Facebook Login
openfb.login(
   function(res) {
        if (res.status === 'connected') {
	   // Login Successfull...
         getUsersData();
        } else {
	  // Login cancelled by the user.
         alert('Login With Facebook Cancelled');
        }
    }, {
        scope: 'email' // for more permissions see https://developers.facebook.com/docs/facebook-login/permissions
});


// Get user data after user is logged in
function getUsersData(){
openfb.api({
    path: '/me',
    success: function(f) {
        // f is an object
        {
                id: "123456789", // Facebook User Id
                birthday: "06/10/1394",
                email: "useremail@gmail.com", // Facebook User Email
                first_name: "Mark", // Firstname
                gender: "male", // Gender
                last_name: "openfb", // Last name
                link: "https://www.facebook.com/app_scoped_user_id/123456789/",
                locale: "en_US",
                name: "Mark openfb",
                timezone: 1,
                updated_time: "2014-04-15T60:48:21+0000",
                verified: true, // If user is verified
                website: "openfb.com"
        }
       console.log(f.name) // Mark openfb
   },
    error: function(e) {
        console.log(e);
    }
});
}
```


### Get user facebook token after logged in
Facebook access token is saved to localstorage.

```js
    localStorage.getItem('fbAccessToken'); // returns user token
```


### Get current user photo

```js
    var id = f.id;
    $('#myphoto').attr('src', 'https://avatars.io/facebook/'+id);
    <img src="" id="myphoto" />
```


See https://avatars.io for image sizes.
    
    
License
--------

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
