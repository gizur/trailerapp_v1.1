/* jshint undef: true, unused: true, strict: true, vars: true */

/**
 * Object Config
 * 
 * @fileoverview Configuration file 
 * @author anshuk.kumar@essindia.co.in (Anshuk Kumar)
 * @license Commercial - Copyright 2013 Gizur AB
 * @see http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml
 */

 var Config = {
 	'url': 'https://c2.gizur.com/api/',
 	'client_id': 'clab'
 }

 /**
 * For node-unit test
 */
if (node_unit) {
    exports.Config = Config;
}