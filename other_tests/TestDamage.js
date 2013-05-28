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
DocCollection = require('../Android/Besiktning/assets/www/js/app/models/doccollection.js').DocCollection;
Damage = require('../Android/Besiktning/assets/www/js/app/models/damage.js').Damage;
User = require('../Android/Besiktning/assets/www/js/app/models/user.js').User;

//Environment SetUp
req = new Request(Config.url, Config.client_id);

usr = new User(req);
usr.set('username', 'mobile_user@gizur.com');
usr.set('password', 'ivry34aq');

exports.Damage = {
    "has properties" : function(test){
        var d = new Damage();

        test.expect(4);
        
        test.ok(typeof d.get('damagetype') == 'string', "damagetype is not defined / properly");
        test.ok(typeof d.get('damageposition') == 'string', "damageposition is not defined / properly");
        test.ok(typeof d.get('drivercauseddamage') == 'string', "drivercauseddamage is not defined / properly");
        test.ok(d.get('docs') instanceof DocCollection, "docs is not defined / properly");

        test.done();
    },
    "has method" : function(test) {
        var dmg = new Damage();

        test.expect(3);

        test.ok(typeof dmg.getEnumDamageType == 'function' , "getEnumDamageType not defined");
        test.ok(typeof dmg.getEnumDamagePosition == 'function' , "getEnumDamagePosition not defined");
        test.ok(typeof dmg.getEnumDriverCausedDamage == 'function' , "getEnumDriverCausedDamage not defined");

        test.done();
    },
    "got enum damage type" : function(test) {
        var dmg = new Damage(usr);

        var success = function(data){

            test.ok(true);
            test.done();
        };

        var error = function(jqxhr, status, er){
            var data = JSON.parse(jqxhr.responseText);
            test.ok(false, "Unable to fetch picklist of damagetype : " + data.error.trace_id + " : " + data.error.vtresponse);
            test.done();
        };

        dmg.getEnumDamageType(success, error);
    },
    "got enum damage position" : function(test) {
        var dmg = new Damage(usr);

        var success = function(data){

            test.ok(true);
            test.done();
        };

        var error = function(jqxhr, status, er){
            var data = JSON.parse(jqxhr.responseText);
            test.ok(false, "Unable to fetch picklist of damageposition : " + data.error.trace_id + " : " + data.error.vtresponse);
            test.done();
        };

        dmg.getEnumDamagePosition(success, error);
    }, 
    "got enum drivercauseddamage" : function(test) {
        var dmg = new Damage(usr);

        var success = function(data){

            test.ok(true);
            test.done();
        };

        var error = function(jqxhr, status, er){
            var data = JSON.parse(jqxhr.responseText);
            test.ok(false, "Unable to fetch picklist of drivercauseddamage : " + data.error.trace_id + " : " + data.error.vtresponse);
            test.done();
        };

        dmg.getEnumDriverCausedDamage(success, error);
    },       
};