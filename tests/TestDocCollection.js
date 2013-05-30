/* jshint undef: true, unused: true, strict: true, vars: true */

/**
 * Node Unit Test file for Doc Collection
 * 
 * @fileoverview Test definition of a collection of Doc
 * @author anshuk.kumar@essindia.co.in (Anshuk Kumar)
 * @license Commercial - Copyright 2013 Gizur AB
 * @see http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml
 */

node_unit = true;

Stapes = require('../Android/Besiktning/assets/www/js/lib/stapes.js').Stapes;
Logger = require('../Android/Besiktning/assets/www/js/app/util/logger.js').Logger;
LocalStorage = require('node-localstorage').LocalStorage;
window = {
    localStorage : new LocalStorage('./tmp')
};

Doc = require('../Android/Besiktning/assets/www/js/app/models/doc.js').Doc;
DocCollection = require('../Android/Besiktning/assets/www/js/app/models/doccollection.js').DocCollection;

exports.doccollection = {
    "has properties" : function(test){
        var dc = new DocCollection();

        test.expect(1);
        
        test.ok(dc.size() === 0, "Documents is not defined / properly");
        
        test.done();
    },
    "has method" : function(test) {
        var dc = new DocCollection();
        var d = new Doc();

        dc.push(d);

        var dc_attr = dc.getAll();

        test.expect(dc.size());

        for (var index in dc_attr) {
            test.ok(dc_attr[index] instanceof Doc , "Collection item not of type Doc " + index);
        }

        test.done();
    }
};