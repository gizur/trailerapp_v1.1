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
 	'url': 'https://api.gizur.com/api/', //'http://c2.gizur.com/api/'
 	'client_id' : 'clab',
 	'log_type' : 'loggly' // 'console'
 }

 /**
 * For node-unit test
 */
if (typeof node_unit != 'undefined') {
    exports.Config = Config;
}