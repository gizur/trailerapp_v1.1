/* jshint undef: true, unused: true, strict: true, vars: true */

/**
 * Node Unit Test file for TroubleTicket
 * 
 * @fileoverview Class definition of a collection of TroubleTickets
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
Asset = require('../Android/Besiktning/assets/www/js/app/models/asset.js').Asset;
Damage = require('../Android/Besiktning/assets/www/js/app/models/damage.js').Damage;
TroubleTicket = require('../Android/Besiktning/assets/www/js/app/models/troubleticket.js').TroubleTicket;
User = require('../Android/Besiktning/assets/www/js/app/models/user.js').User;

//Environment SetUp
req = new Request(Config.url, Config.client_id);

usr = new User(req);
usr.set('username', 'mobile_user@gizur.com');
usr.set('password', 'ivry34aq');

exports.troubleticket = {
    "has properties" : function(test){
        var snd_tt = new TroubleTicket();

        test.expect(4);
        
        test.ok(snd_tt.get('asset') instanceof Asset, "Asset is not defined / properly");
        test.ok(typeof snd_tt.get('place') === 'string', "Place is not defined / properly");
        test.ok(typeof snd_tt.get('sealed') === 'string', "Sealed is not defined / properly");
        test.ok(typeof snd_tt.get('damage') === 'boolean', "Damage is not defined / properly");
        
        test.done();
    },
    "got picklist sealed" : function(test) {
        var tt = new TroubleTicket(usr);

        var success = function(data){
            test.ok(true);
            test.done();
        };

        var error = function(jqxhr, status, er){
            test.ok(false, "Unable to fetch picklist sealed : " + data.error.trace_id + " : " + data.error.message);
            test.done();
        };

        tt.getEnumSealed(success, error);
    },
    "got picklist place" : function(test) {
        var tt = new TroubleTicket(usr);

        var success = function(data){
            test.ok(true);
            test.done();
        };

        var error = function(jqxhr, status, er){
            test.ok(false, "Unable to fetch picklist place : " + data.error.trace_id + " : " + data.error.message);
            test.done();
        };

        tt.getEnumPlace(success, error);
    }    
};