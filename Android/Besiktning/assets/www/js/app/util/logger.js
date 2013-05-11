/* jshint undef: true, unused: true, strict: true, vars: true */

/**
 * Utility Class Logger
 * 
 * @fileoverview Logs
 * @author anshuk.kumar@essindia.co.in (Anshuk Kumar)
 * @license Commercial - Copyright 2013 Gizur AB
 * @see http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml
 */

var Logger = (function() {

    /**
     * Private Variables
     */
     var level;
     var trace_id;
     var prefix;
     var enum_level = {
        "DEBUG": 1,
        "TRACE": 2,
        "FATAL": 3
     };

    /**
     * Class Definition
     */
    var Logger = Stapes.subclass({
        constructor : function(aLevel, aPrefix) {
            level = enum_level[aLevel];
            prefix =  aPrefix;

            //thanks to 
            //http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
            trace_id = 'xxxxxxxy-xxxx-4xxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            });
        },
        log : function(loglevel, message) {
            if (enum_level[loglevel] >= level)
                console.log(loglevel + ' : ' + prefix + ' : ' + trace_id + ' : ' + message);
        }
    });

    return Logger;
})();

/**
 * For node-unit test
 */
if (node_unit) {
    exports.Logger = Logger;
}