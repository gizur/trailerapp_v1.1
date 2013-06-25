/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, 
         bitwise:true, strict:true, undef:false, unused:true, 
         curly:true, browser:true, indent:4, maxerr:50 */

/*global $:true, node_unit:true, Stapes:true, 
         Logger:true, LocalStorage:true, Asset:true,
         require:false, window:true, exports:false*/

/**
 * Node Unit Test file for TroubleTicket Collection
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
AssetCollection = require('../Android/Besiktning/assets/www/js/app/models/assetcollection.js').AssetCollection;
TroubleTicket = require('../Android/Besiktning/assets/www/js/app/models/troubleticket.js').TroubleTicket;
TroubleTicketCollection = require('../Android/Besiktning/assets/www/js/app/models/troubleticketcollection.js').TroubleTicketCollection;
User = require('../Android/Besiktning/assets/www/js/app/models/user.js').User;

//Environment SetUp
req = new Request(Config.url, Config.client_id);

usr = new User(req);
usr.set('username', Config.username);
usr.set('password', Config.password);

exports.troubleticketcollection = {
    "has properties" : function(test){

        "use strict";

        var ttc = new TroubleTicketCollection();

        test.expect(1);
        
        test.ok(ttc.size() === 0, "TroubleTickets is not defined / properly");
        
        test.done();
    },
    "has method" : function(test) {

        "use strict";

        var ttc = new TroubleTicketCollection();
        var tt = new TroubleTicket();

        ttc.push(tt);

        var ttc_attr = ttc.getAll();

        test.expect(1 + ttc.size());

        test.ok(typeof ttc.getDamagedTroubleTicketsByAsset === 'function' , "getDamagedTroubleTicketsByAsset not defined");

        for (var index in ttc_attr) {
            if (ttc_attr.hasOwnProperty(index)) {
                test.ok(ttc_attr[index] instanceof TroubleTicket , "Collection item not of type TroubleTicket " + index);
            }
        }

        test.done();
    },
    "got Trouble Ticket by Asset" : function(test) {

        "use strict";

        var ac = new AssetCollection(usr);
        var ttc = new TroubleTicketCollection(usr);

        test.expect(1);

        var success = function(data){

            data = undefined;

            var asts = ac.getAllAsArray();

            if (asts.length > 0){
                var scb = function(data){

                    data = undefined;

                    test.ok(true);
                    test.done();
                };

                var ecb = function(jqxhr, status, er){

                    jqxhr = status = er = undefined;

                    var data = JSON.parse(jqxhr.responseText);
                    test.ok(false, "Unable to fetch troubleticket list : " + data.error.trace_id + " : " + data.error.message);
                    test.done();
                };

                ttc.getDamagedTroubleTicketsByAsset(asts[0], scb, ecb);

            } else {
                test.ok(true);
                test.done();
            }

        };
 
        var error = function(jqxhr, status, er){

            jqxhr = status = er = undefined;

            test.ok(false, "problem fetching asset list");
            test.done();
        };

        ac.getAssets(success, error);
    }
};