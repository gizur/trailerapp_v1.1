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
Doc = require('../Android/Besiktning/assets/www/js/app/models/doc.js').Doc;

exports.Asset = {
    "has properties" : function(test){
        var d = new Doc();

        test.expect(2);
        
        test.ok(typeof d.get('id') == 'string', "id is not defined / properly");
        test.ok(typeof d.get('path') == 'string', "path is not defined / properly");

        test.done();
    }
};