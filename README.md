### OpenFB Cordova InAppBrowser Facebook Plugin

This plugin has no dependency: You don't need (and shouldn't use) the Facebook SDK with this library.

OpenFB allows you to login to Facebook and execute any Facebook Graph API request.

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

To Test Facebook login sample on your own system:

[fb_apps]: https://developers.facebook.com/apps

- Create a Facebook app [here][fb_apps], in the app sidebar under > PRODUCTS click on FACEBOOK LOGIN.
<img width = "100%" align = "left" hspace = "19" vspace = "12" src = "images/fblogin.png" />

- on FACEBOOK LOGIN page scroll down enter https: //www.facebook.com/connect/login_success.html  and  http://localhost:8888/cordova-open-fb/www/oauthcallback.html as Valid OAuth redirect URIs - [Required]

<img width = "100%" align = "left" hspace = "39" vspace = "12" src = "images/ValidOAuth.png" />


For example,
if during development you access your application from `http://localhost/YOUR-APP/www/index.html` (If testing from localhost) you must declare `http://localhost/YOUR-APP/www/index.html` as a valid redirect URI.

### Quick Example 
```js

// Int
openFB.init({appId: 'YOUR_FACEBOOK_APP_ID'});


// Facebook Login
openFB.login(
   function(res) {
        if (res.status === 'connected') {
		// Login Successfull...
         getUsersData();
        } else {
	     // Cancelled by the user.
            alert('Login With Facebook Cancelled');
        }
    }, {
        scope: 'email'
});

// Get user data after user is logged in
function getUsersData(){
openFB.api({
    path: '/me',
    success: function(f) {
// f is an object
{
    id: "123456789", // Facebook User Id
    birthday: "06/10/1394",
    email: "useremail@gmail.com", // Facebook User Email
    first_name: "Mark", // Firstname
    gender: "male", // Gender
    last_name: "Openfb", // Last name
    link: "https://www.facebook.com/app_scoped_user_id/123456789/",
    locale: "en_US",
    name: "Mark Openfb",
    timezone: 1,
    updated_time: "2014-04-15T60:48:21+0000",
    verified: true, // If user is verified
    website: "openfb.com"
}
console.log(f.name) // Mark Openfb
   },
    error: function(e) {
        alert(e.message);
    }
});
}
```

### Get Current User Photo with name

```js
    var pic = f.name;
    var picUrl = pic.replace(/\s+/g, '');
    $('#myphoto').attr('src', 'https://avatars.io/facebook/'+picUrl);
	<img src="" id="myphoto" />
```

    See https://avatars.io For Image sizes.
    
    
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
