/* jshint undef: true, unused: true, strict: true, vars: true */

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

//Config
Config = require('../Android/Besiktning/assets/www/js/app/config.js').Config;

//Util
Request = require('../Android/Besiktning/assets/www/js/app/util/request.js').Request;

//Models
Asset = require('../Android/Besiktning/assets/www/js/app/models/asset.js').Asset;
AssetCollection = require('../Android/Besiktning/assets/www/js/app/models/assetcollection.js').AssetCollection;
User = require('../Android/Besiktning/assets/www/js/app/models/user.js').User;

//Environment SetUp
req = new Request(Config.url, Config.client_id);

usr = new User(req);
usr.set('username', 'mobile_user@gizur.com');
usr.set('password', 'ivry34aq');

exports.assetcollection = {
    "has properties" : function(test){
        var astc = new AssetCollection();

        test.expect(1);
        
        test.ok(astc.size() == 0, "Assets is not defined / properly");
        
        test.done();
    },
    "has method" : function(test) {
        var astc = new AssetCollection();
        var ast = new Asset();

        astc.push(ast);

        var astc_attr = astc.getAll();

        test.expect(1 + astc.size());

        test.ok(typeof astc.getAssets == 'function' , "getAssetsByType not defined");

        for (var index in astc_attr) {
            test.ok(astc_attr[index] instanceof Asset , "Collection item not of type Asset " + index);
        }

        test.done();
    },
    "got assets list" : function(test){
        var ac = new AssetCollection(usr);
        var trailertype = 'Hyrtrailer';

        var success = function(data){

            var ac_f = ac.filter(function(item, key){
                return (item.get('trailertype') == trailertype);
            });

            for (var index in ac_f) {
                if (ac_f[index].get('trailertype') != trailertype) {
                    test.ok(false, 'Unable to filter out ' + trailertype);
                    test.done();
                }
            }

            test.ok(true);
            test.done();
        };

        var error = function(jqxhr, status, er){
            var data = JSON.parse(jqxhr.responseText);
            test.ok(false, "Unable to fetch assetlist : " + data.error.trace_id + " : " + data.error.vtresponse);
            test.done();
        };

        ac.getAssets(success, error);
    }
};