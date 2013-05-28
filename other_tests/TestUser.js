/* jshint undef: true, unused: true, strict: true, vars: true */

/**
 * Node Unit Test file for Damage
 * 
 * @fileoverview Class definition of a collection of Damages
 * @author anshuk.kumar@essindia.co.in (Anshuk Kumar)
 * @license Commercial - Copyright 2013 Gizur AB
 * @see http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml
 */

node_unit = true;

//Lib
Stapes = require('../Android/Besiktning/assets/www/js/lib/stapes.js').Stapes;
$ = require('jquery');

//Config
Config = require('../Android/Besiktning/assets/www/js/app/config.js').Config;

//Util
Request = require('../Android/Besiktning/assets/www/js/app/util/request.js').Request;

//Models
User = require('../Android/Besiktning/assets/www/js/app/models/user.js').User;

//Environment SetUp
req = new Request(Config.url, Config.client_id);

exports.User = {
    "has properties" : function(test){
        var u = new User(req);

        test.expect(4);
        
        test.ok(typeof u.get('id') == 'string', "id is not defined / properly");
        test.ok(typeof u.get('username') == 'string', "email is not defined / properly");
        test.ok(typeof u.get('password') == 'string', "password is not defined / properly");
        test.ok(typeof u.get('authenticated') == 'boolean', "authenticated is not defined / properly");

        test.done();
    },
    "has method" : function(test) {
        var u = new User(req);

        test.expect(2);

        test.ok(typeof u.authenticate == 'function' , "authenticate not defined");
        test.ok(typeof u.setNewPassword == 'function' , "setNewPassword not defined");

        test.done();
    },
    "authenticated" : function(test) {
        var u = new User(req);       

        test.expect(1);

        var success = function(r) {
            test.ok(true);
            test.done();
        };
        var error = function (jqxhr, e, t) {
            var data = JSON.parse(jqxhr.responseText);
            test.ok(false, "Unable to authenticate user : " + data.error.trace_id + " : " + data.error.vtresponse);
            test.done();
        };      

        u.set('username', 'mobile_user@gizur.com');
        u.set('password', 'ivry34aq');

        u.authenticate(success, error);

    }    
};