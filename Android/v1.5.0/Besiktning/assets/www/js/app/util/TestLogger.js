/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, 
         bitwise:true, strict:true, undef:false, unused:true, 
         curly:true, browser:true, indent:4, maxerr:50 */

/*global $:true, node_unit:true, Stapes:true, 
         Logger:true, LocalStorage:true, Asset:true,
         require:false, window:true, exports:false*/

/**
 * Node Unit Test file for Asset Model
 * 
 * @fileoverview testing asset model
 * @author anshuk.kumar@essindia.co.in (Anshuk Kumar)
 * @license Commercial - Copyright 2013 Gizur AB
 * @see http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml
 */

node_unit = true;

Stapes = require('../Android/Besiktning/assets/www/js/lib/stapes.js').Stapes;
$ = require('jquery');
$.mobile = {
    loading : function(){}
};
Logger = require('../Android/Besiktning/assets/www/js/app/util/logger.js').Logger;

exports.Logger = {
    "has properties" : function(test){

        "use strict";

        var a = new Logger();
        var b = new Logger();

        test.expect(3);
        
        test.ok(typeof a.get('id') === 'string', "id is not defined / properly");
        test.ok(typeof a.get('assetname') === 'string', "asset_name is not defined / properly");
        test.ok(typeof a.get('trailertype') === 'string', "trailertype is not defined / properly");

        test.done();
    }
};
