/* jshint undef: true, unused: true, strict: true, vars: true */

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

//Models
Asset = require('../Android/Besiktning/assets/www/js/app/models/asset.js').Asset;
AssetCollection = require('../Android/Besiktning/assets/www/js/app/models/assetcollection.js').AssetCollection;
TroubleTicket = require('../Android/Besiktning/assets/www/js/app/models/troubleticket.js').TroubleTicket;
TroubleTicketCollection = require('../Android/Besiktning/assets/www/js/app/models/troubleticketcollection.js').TroubleTicketCollection;
User = require('../Android/Besiktning/assets/www/js/app/models/user.js').User;

//SetUp User
usr = new User();
usr.set('username', 'mobile_user@gizur.com');
usr.set('password', 'ivry34aq');

exports.troubleticketcollection = {
    "has properties" : function(test){
        var ttc = new TroubleTicketCollection();

        test.expect(1);
        
        test.ok(ttc.size() == 0, "TroubleTickets is not defined / properly");
        
        test.done();
    },
    "has method" : function(test) {
        var ttc = new TroubleTicketCollection();
        var tt = new TroubleTicket();

        ttc.push(tt);

        var ttc_attr = ttc.getAll();

        test.expect(1 + ttc.size());

        test.ok(typeof ttc.getDamagedTroubleTicketsByAsset == 'function' , "getDamagedTroubleTicketsByAsset not defined");

        for (var index in ttc_attr) {
            test.ok(ttc_attr[index] instanceof TroubleTicket , "Collection item not of type TroubleTicket " + index);
        }

        test.done();
    },
    "got Trouble Ticket by Asset" : function(test) {
        var ac = new AssetCollection();
        var ttc = new TroubleTicketCollection();

        test.expect(1);

        var success = function(data){
            var asts = ac.getAllAsArray();

            if (asts.length > 0){
                var scb = function(data){
                    test.ok(true);
                    test.done();
                };

                var ecb = function(jqxhr, status, er){
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
                test.ok(false, "problem fetching asset list");
                test.done();
        };

        ac.getAssets(success, error);
    }
};