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
 	'url': 'http://c2.gizur.com/api/', //'https://api.gizur.com/api/'
 	'client_id' : 'clab',
 	'log_type' : 'console',
 	'username' : 'mobile_user@gizur.com',
 	'password' : 'ivry34aq'
 }

 /**
 * For node-unit test
 */

if (typeof node_unit != 'undefined') {
    exports.Config = Config;
}