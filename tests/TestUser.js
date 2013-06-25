/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, 
         bitwise:true, strict:true, undef:false, unused:true, 
         curly:true, browser:true, indent:4, maxerr:50 */

/*global $:true, node_unit:true, Stapes:true, 
         Logger:true, LocalStorage:true,
         require:false, window:true, exports:false*/

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
$.mobile = {
    loading : function(){}
};
Logger = require('../Android/Besiktning/assets/www/js/app/util/logger.js').Logger;
LocalStorage = require('node-localstorage').LocalStorage;
window = {
    localStorage : new LocalStorage('./tmp')
};

//Config
Config = require('../config.test.js').Config;

//Util
Request = require('../Android/Besiktning/assets/www/js/app/util/request.js').Request;

//Models
User = require('../Android/Besiktning/assets/www/js/app/models/user.js').User;

//Environment SetUp
req = new Request(Config.url);
req.setClientId(Config.client_id);

exports.User = {
    "has properties" : function(test){

        "use strict";

        var u = new User(req);

        test.expect(4);
        
        test.ok(typeof u.get('id') === 'string', "id is not defined / properly");
        test.ok(typeof u.get('username') === 'string', "email is not defined / properly");
        test.ok(typeof u.get('password') === 'string', "password is not defined / properly");
        test.ok(typeof u.get('authenticated') === 'boolean', "authenticated is not defined / properly");

        test.done();
    },
    "has method" : function(test) {

        "use strict";

        var u = new User(req);

        test.expect(5);

        test.ok(typeof u.authenticate === 'function' , "authenticate not defined");
        test.ok(typeof u.send === 'function' , "send not defined");
        test.ok(typeof u.resetPassword === 'function' , "resetPassword not defined");
        test.ok(typeof u.changePassword === 'function' , "changePassword not defined");
        test.ok(typeof u.setAuthenticated === 'function' , "setAuthenticated not defined");

        test.done();
    },
    "authenticated" : function(test) {

        "use strict";

        var u = new User(req);       

        test.expect(1);

        var success = function(r) {

            r = undefined;

            test.ok(true);
            test.done();
        };
        var error = function (jqxhr, e, t) {

            e = t = undefined;

            var data = JSON.parse(jqxhr.responseText);
            test.ok(false, "Unable to authenticate user : " + data.error.trace_id + " : " + data.error.message);
            test.done();
        };      

        u.set('username', Config.username);
        u.set('password', Config.password);

        u.authenticate(success, error);

    },
    "change password" : function(test) {

        "use strict";

        var u = new User(req);       

        test.expect(2);

        var successFirstPass = function() {
            test.ok(true);

            var successSecondPass = function() {
                test.ok(true);
                test.done();
            };

            var errorSecondPass = function (jqxhr, e, t) {

                e = t = undefined;

                var data = JSON.parse(jqxhr.responseText);
                test.ok(false, "Unable to change password in second pass: " + data.error.trace_id + " : " + data.error.message);
                test.done();
            };            

            u.set('password', 'thenewpassword');
            u.changePassword(Config.password, successSecondPass, errorSecondPass);
        };

        var errorFirstPass = function (jqxhr, e, t) {

            e = t = undefined;

            var data = JSON.parse(jqxhr.responseText);
            test.ok(false, "Unable to change password in first pass: " + data.error.trace_id + " : " + data.error.message);
            test.done();
        };      

        u.set('username', Config.username);
        u.set('password', Config.password);

        u.changePassword('thenewpassword', successFirstPass, errorFirstPass);

    }        

};