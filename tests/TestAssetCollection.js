/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, 
         bitwise:true, strict:true, undef:false, unused:true, 
         curly:true, browser:true, indent:4, maxerr:50 */

/*global $:true, node_unit:true, Stapes:true, 
         Logger:true, LocalStorage:true, Asset:true,
         require:false, window:true, exports:false*/

/**
 * Node Unit Test file for Asset Collection
 * 
 * @fileoverview Class definition of a collection of Assets
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
User = require('../Android/Besiktning/assets/www/js/app/models/user.js').User;

//Environment SetUp
req = new Request(Config.url, Config.client_id);

usr = new User(req);
usr.set('username', Config.username);
usr.set('password', Config.password);

exports.assetcollection = {
    "has properties" : function(test){

        "use strict";

        var astc = new AssetCollection();
        var allassets = true;
        var assets = astc.getAllAsArray();

        test.expect(1);

        for (var index in assets) {
            if (!(assets[index] instanceof Asset)) {
                allassets = false;
            }
        }
        
        test.ok(allassets, "Assets is not defined / properly");
        
        test.done();
    },
    "has method" : function(test) {

        "use strict";

        var astc = new AssetCollection();
        var ast = new Asset();

        astc.push(ast);

        var astc_attr = astc.getAll();

        test.expect(1 + astc.size());

        test.ok(typeof astc.getAssets === 'function' , "getAssetsByType not defined");

        for (var index in astc_attr) {
            if (astc_attr.hasOwnProperty(index)) {
                test.ok(astc_attr[index] instanceof Asset , "Collection item not of type Asset " + index);
            }
        }

        test.done();
    },
    "got assets list" : function(test){

        "use strict";

        var ac = new AssetCollection(usr);
        var trailertype = 'Hyrtrailer';

        var success = function(){

            var ac_f = ac.filter(function(item, key){
                key = undefined;
                return (item.get('trailertype') === trailertype);
            });

            for (var index in ac_f) {
                if (ac_f[index].get('trailertype') !== trailertype) {
                    test.ok(false, 'Unable to filter out ' + trailertype);
                    test.done();
                }
            }

            test.ok(true);
            test.done();
        };

        var error = function(jqxhr, status, er){
            var data = JSON.parse(jqxhr.responseText);
            status = er = undefined;
            test.ok(false, "Unable to fetch assetlist : " + data.error.trace_id + " : " + data.error.vtresponse);
            test.done();
        };

        ac.getAssets(success, error);
    }
};