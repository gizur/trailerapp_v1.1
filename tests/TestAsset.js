/* jshint undef: true, unused: true, strict: true, vars: true */

/**
 * Node Unit Test file for Doc
 * 
 * @fileoverview Class definition of a collection of Docs
 * @author anshuk.kumar@essindia.co.in (Anshuk Kumar)
 * @license Commercial - Copyright 2013 Gizur AB
 * @see http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml
 */

node_unit = true;

Stapes = require('../Android/Besiktning/assets/www/js/lib/stapes.js').Stapes;
Asset = require('../Android/Besiktning/assets/www/js/app/models/asset.js').Asset;

exports.Asset = {
    "has properties" : function(test){
        var a = new Asset();

        test.expect(3);
        
        test.ok(typeof a.get('id') == 'string', "id is not defined / properly");
        test.ok(typeof a.get('assetname') == 'string', "asset_name is not defined / properly");
        test.ok(typeof a.get('trailertype') == 'string', "trailertype is not defined / properly");

        test.done();
    }
};