/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, 
         bitwise:true, strict:true, undef:false, unused:true, 
         curly:true, browser:true, indent:4, maxerr:50 */

/*global node_unit:true, exports:false*/

/**
 * Object Config
 * 
 * @fileoverview Configuration file 
 * @author anshuk.kumar@essindia.co.in (Anshuk Kumar)
 * @license Commercial - Copyright 2013 Gizur AB
 * @see http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml
 */

var Config = {
    url : 'https://gizur.com/api/', //'https://c2.gizur.com/api/',//'http://phpapplications-env-sixmtjkbzs.elasticbeanstalk.com/api/',
    log : {
        type : 'loggly',
        config : {
            loggly : {
                key : 'a631e820-9cec-418e-950b-1a3132c6b03a',
                buffer_size : (10 * 1024) //10kB
            }
        },
        level : 'TRACE'
    }
};

 /**
 * For node-unit test
 */
if (typeof node_unit !== 'undefined') {
    exports.Config = Config;
}
