/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, 
         bitwise:true, strict:true, undef:false, unused:true, 
         curly:true, browser:true, indent:4, maxerr:50 */

/*global node_unit:true, exports:false*/

/**
 * Object App
 * 
 * @fileoverview Application file 
 * @author prabhat.khera@essindia.co.in (Prabhat Khera)
 * @license Commercial - Copyright 2013 Gizur AB
 * @see http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml
 */

var App = {
    _lg : new Logger(Config.log.level, Config.log.type, Config.log.config)
};

 /**
 * For node-unit test
 */
if (typeof node_unit !== 'undefined') {
    exports.App = App;
}
