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
DocCollection = require('../Android/Besiktning/assets/www/js/app/models/doccollection.js').DocCollection;
Damage = require('../Android/Besiktning/assets/www/js/app/models/damage.js').Damage;
User = require('../Android/Besiktning/assets/www/js/app/models/user.js').User;

//Environment SetUp
req = new Request(Config.url, Config.client_id);

usr = new User(req);
usr.set('username', Config.username);
usr.set('password', Config.password);

exports.Damage = {
    "has properties" : function(test){

        "use strict";

        var d = new Damage();

        test.expect(4);
        
        test.ok(typeof d.get('damagetype') === 'string', "damagetype is not defined / properly");
        test.ok(typeof d.get('damageposition') === 'string', "damageposition is not defined / properly");
        test.ok(typeof d.get('drivercauseddamage') === 'string', "drivercauseddamage is not defined / properly");
        test.ok(d.get('docs') instanceof DocCollection, "docs is not defined / properly");

        test.done();
    },
    "has method" : function(test) {

        "use strict";

        var dmg = new Damage();

        test.expect(3);

        test.ok(typeof dmg.getEnumDamageType === 'function' , "getEnumDamageType not defined");
        test.ok(typeof dmg.getEnumDamagePosition === 'function' , "getEnumDamagePosition not defined");
        test.ok(typeof dmg.getEnumDriverCausedDamage === 'function' , "getEnumDriverCausedDamage not defined");

        test.done();
    },
    "got enum damage type" : function(test) {

        "use strict";

        var dmg = new Damage(usr);

        var success = function(data){

            data = undefined;

            test.ok(true);
            test.done();
        };

        var error = function(jqxhr, status, er){
            status = er = undefined;
            var data = JSON.parse(jqxhr.responseText);
            test.ok(false, "Unable to fetch picklist of damagetype : " + data.error.trace_id + " : " + data.error.vtresponse);
            test.done();
        };

        dmg.getEnumDamageType(success, error);
    },
    "got enum damage position" : function(test) {

        "use strict";

        var dmg = new Damage(usr);

        var success = function(data){

            data = undefined;

            test.ok(true);
            test.done();
        };

        var error = function(jqxhr, status, er){

            status = er = undefined;

            var data = JSON.parse(jqxhr.responseText);
            test.ok(false, "Unable to fetch picklist of damageposition : " + data.error.trace_id + " : " + data.error.vtresponse);
            test.done();
        };

        dmg.getEnumDamagePosition(success, error);
    }, 
    "got enum drivercauseddamage" : function(test) {

        "use strict";

        var dmg = new Damage(usr);

        var success = function(data){

            data = undefined;

            test.ok(true);
            test.done();
        };

        var error = function(jqxhr, status, er){

            status = er = undefined;

            var data = JSON.parse(jqxhr.responseText);
            test.ok(false, "Unable to fetch picklist of drivercauseddamage : " + data.error.trace_id + " : " + data.error.vtresponse);
            test.done();
        };

        dmg.getEnumDriverCausedDamage(success, error);
    }      
};