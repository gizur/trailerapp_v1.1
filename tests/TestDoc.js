/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, 
         bitwise:true, strict:true, undef:false, unused:true, 
         curly:true, browser:true, indent:4, maxerr:50 */

/*global node_unit:true, Stapes:true, 
         Logger:true, LocalStorage:true,
         require:false, window:true, exports:false*/

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
Logger = require('../Android/Besiktning/assets/www/js/app/util/logger.js').Logger;
LocalStorage = require('node-localstorage').LocalStorage;
window = {
    localStorage : new LocalStorage('./tmp')
};

Doc = require('../Android/Besiktning/assets/www/js/app/models/doc.js').Doc;

exports.Doc = {
    "has properties" : function(test){

        "use strict";

        var d = new Doc();

        test.expect(2);
        
        test.ok(typeof d.get('id') === 'string', "id is not defined / properly");
        test.ok(typeof d.get('path') === 'string', "path is not defined / properly");

        test.done();
    }
};