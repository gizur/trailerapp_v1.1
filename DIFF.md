Differences between iOS and Android
===================================

List the files that differ: ` diff -qr Android/v2.3/assets/www iOS/v2.6.3/Besiktning/www`

Result 2015-10-11:

```
Only in iOS/v2.6.3/Besiktning/www: ._index.html
Only in iOS/v2.6.3/Besiktning/www: config.xml
Files Android/v2.3/assets/www/cordova.js and iOS/v2.6.3/Besiktning/www/cordova.js differ
Only in iOS/v2.6.3/Besiktning/www: cordova_plugins.js
Files Android/v2.3/assets/www/img/splash.png and iOS/v2.6.3/Besiktning/www/img/splash.png differ
Files Android/v2.3/assets/www/index.html and iOS/v2.6.3/Besiktning/www/index.html differ
Only in iOS/v2.6.3/Besiktning/www/js/app: ._config.js
Files Android/v2.3/assets/www/js/app/config.js and iOS/v2.6.3/Besiktning/www/js/app/config.js differ
Files Android/v2.3/assets/www/js/app/models/assetcollection.js and iOS/v2.6.3/Besiktning/www/js/app/models/assetcollection.js differ
Files Android/v2.3/assets/www/js/app/models/troubleticket.js and iOS/v2.6.3/Besiktning/www/js/app/models/troubleticket.js differ
Files Android/v2.3/assets/www/js/app/models/troubleticketcollection.js and iOS/v2.6.3/Besiktning/www/js/app/models/troubleticketcollection.js differ
Files Android/v2.3/assets/www/js/app/models/user.js and iOS/v2.6.3/Besiktning/www/js/app/models/user.js differ
Only in iOS/v2.6.3/Besiktning/www/js/app/util: ._language.js
Only in iOS/v2.6.3/Besiktning/www/js/app/util: ._request.js
Files Android/v2.3/assets/www/js/app/util/language.js and iOS/v2.6.3/Besiktning/www/js/app/util/language.js differ
Files Android/v2.3/assets/www/js/app/util/request.js and iOS/v2.6.3/Besiktning/www/js/app/util/request.js differ
Files Android/v2.3/assets/www/js/app/util/wrapper.js and iOS/v2.6.3/Besiktning/www/js/app/util/wrapper.js differ
Only in iOS/v2.6.3/Besiktning/www: plugins
Only in Android/v2.3/assets/www/res/icon: android
Only in iOS/v2.6.3/Besiktning/www/res/icon: ios
Only in Android/v2.3/assets/www/res/screen: android
Only in iOS/v2.6.3/Besiktning/www/res/screen: ios
Files Android/v2.3/assets/www/tmpl/settings.tmpl.htm and iOS/v2.6.3/Besiktning/www/tmpl/settings.tmpl.htm differ
Files Android/v2.3/assets/www/tmpl/survey.tmpl.htm and iOS/v2.6.3/Besiktning/www/tmpl/survey.tmpl.htm differ
```

Review of differences
---------------------

These files can likely be ignored:

```
Only in iOS/v2.6.3/Besiktning/www: config.xml
Only in iOS/v2.6.3/Besiktning/www: cordova_plugins.js

Only in iOS/v2.6.3/Besiktning/www: ._index.html
Only in iOS/v2.6.3/Besiktning/www/js/app: ._config.js
Only in iOS/v2.6.3/Besiktning/www/js/app/util: ._language.js
Only in iOS/v2.6.3/Besiktning/www/js/app/util: ._request.js

Files Android/v2.3/assets/www/cordova.js and iOS/v2.6.3/Besiktning/www/cordova.js differ
Files Android/v2.3/assets/www/img/splash.png and iOS/v2.6.3/Besiktning/www/img/splash.png differ

Only in iOS/v2.6.3/Besiktning/www: plugins
Only in iOS/v2.6.3/Besiktning/www/res/screen: ios
Only in iOS/v2.6.3/Besiktning/www/res/icon: ios
Only in Android/v2.3/assets/www/res/icon: android
Only in Android/v2.3/assets/www/res/screen: android
```

Only small differences that likely don't matter:

```
NOTHING RELEVANT - Files Android/v2.3/assets/www/js/app/models/assetcollection.js and iOS/v2.6.3/Besiktning/www/js/app/models/assetcollection.js differ
NOTHING RELEVANT - Files Android/v2.3/assets/www/js/app/models/troubleticket.js and iOS/v2.6.3/Besiktning/www/js/app/models/troubleticket.js differ
NOTHING RELEVANT - Files Android/v2.3/assets/www/js/app/models/user.js and iOS/v2.6.3/Besiktning/www/js/app/models/user.js differ
NOTHING RELEVANT - Files Android/v2.3/assets/www/js/app/util/request.js and iOS/v2.6.3/Besiktning/www/js/app/util/request.js differ
SOME LINES HAS BEEN COMMENTED OUT - Files Android/v2.3/assets/www/js/app/util/wrapper.js and iOS/v2.6.3/Besiktning/www/js/app/util/wrapper.js differ
NOTHING RELEVANT - Files Android/v2.3/assets/www/tmpl/settings.tmpl.htm and iOS/v2.6.3/Besiktning/www/tmpl/settings.tmpl.htm differ
```

These files should probably be investigated:

```
ADDED existingDmgLimit - Files Android/v2.3/assets/www/js/app/config.js and iOS/v2.6.3/Besiktning/www/js/app/config.js differ
MANY SMALL DIFFERENCES - Files Android/v2.3/assets/www/index.html and iOS/v2.6.3/Besiktning/www/index.html differ
ONE LINE, SOME LIMIT - Files Android/v2.3/assets/www/js/app/models/troubleticketcollection.js and iOS/v2.6.3/Besiktning/www/js/app/models/troubleticketcollection.js differ
A FEW DIFFERENCES - Files Android/v2.3/assets/www/tmpl/survey.tmpl.htm and iOS/v2.6.3/Besiktning/www/tmpl/survey.tmpl.htm differ
A NUMBER OF NEW TRANSLATIONS - Files Android/v2.3/assets/www/js/app/util/language.js and iOS/v2.6.3/Besiktning/www/js/app/util/language.js differ
```
