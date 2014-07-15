/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, 
         bitwise:false, strict:true, undef:false, unused:true, 
         curly:true, browser:true, indent:4, maxerr:50 */

/*global node_unit:true, Stapes:true, 
         Logger:true, window:true, exports:false*/


/**
 * Utility Class Logger
 * 
 * @fileoverview Logs
 * @author anshuk.kumar@essindia.co.in (Anshuk Kumar)
 * @license Commercial - Copyright 2013 Gizur AB
 * @see http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml
 */

var Logger = (function() {

    "use strict";

    /**
     * Private Static var
     * Yeahhh using a bug as a feature!
     */

    var _mutex_lock = false;
    var _is_loading = true;

    return Stapes.subclass({

        /**
         * @constructor
         *
         * @param {string} aLevel      a string one of the _enum_level
         * @param {string} aPrefix     common prefix before all log outputs
         * @param {string} aType       destination of log could be 'console' / 'loggly'
         * @param {string} aTypeConfig any configuration associated with the type mentioned above
         */

        constructor : function(aLevel, aType, aTypeConfig) {

            /**
             * Set pseudo private vars
             * please dont change this using <objname>._privatevarname
             * method from outside of here.
             * Arggghh Stapes!!!!
             */

            this.extend({
                _level : 1,
                _type : (typeof aType === 'undefined')?'console':aType,
                _type_config : aTypeConfig,
                _trace_id : '',
                _enum_level : {
                    "DEBUG": 1,
                    "TRACE": 2,
                    "FATAL": 3
                }             
            });

            /**
             * set the current level of log
             */            

            this._level = this._enum_level[aLevel];

            if (typeof window.localStorage === 'undefined') {
                
                /**
                 * Generate a trace id, a unique number to identify the device
                 * thanks to 
                 * http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
                 */

                this._trace_id = this._generateTraceId();

            } else {

                /**
                 * Fetch trace_id from cache 
                 */

                this._trace_id = window.localStorage.getItem('trace_id');

                /**
                 * if no cache is present generate unique trace id
                 */

                if (this._trace_id === null) {
                    this._trace_id = this._generateTraceId(); 
                    window.localStorage.setItem('trace_id', this._trace_id);               
                }
            }
        },

        /**
         * Generates a new unique trace id
         * this id is used to identify a device specially in the case of remove logging
         */

        _generateTraceId : function(){
            return 'xxxxxxxy-xxxx-4xxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            });
        },

        /**
         * Sets the _is_loading log to false 
         * this ensures that the logs are not being posted to remote server
         * while the app is being loaded. Else the app loads slow and sometimes
         * even fails to load.
         */

        appLoadingComplete : function(){
            _is_loading = false;
        },

        /**
         * logs the message based on the level provided
         *
         * @param {string} loglevel the level of log see _enum_level
         * @param {string} message  the message to be logged 
         */

        log : function(loglevel, prefix, message) {
            if (this._enum_level[loglevel] >= this._level) {

                switch(this._type) {
                case 'console':
                    this._logConsole(loglevel, prefix, message);
                    break;

                case 'loggly':
                    this._logLoggly(loglevel, prefix, message);
                    break;

                default:
                }

            }
        },

        /**
         * Show logs over console
         *
         * @param {string} loglevel the level of log see _enum_level
         * @param {string} message  the message to be logged 
         */

        _logConsole : function(loglevel, prefix, message) {
            console.log(loglevel + ' : ' + (new Date()).toString()  + ' : ' + this._trace_id);  
            
            if (typeof (new Error()).stack !== 'undefined') {              
                console.log((new Error()).stack); 
            }

            if (typeof message === 'object') {
                message = JSON.stringify(message);                 
            }
            console.log(prefix + ' : ' + message);
        },

        /**
         * Loggly way of sending logs
         *
         * @param {string} loglevel the level of log see _enum_level
         * @param {string} message  the message to be logged 
         */

        _logLoggly : function(loglevel, prefix, message) {
        	
        	// CONSOLE LOG ONLY IN CASE OF DEBUG AND TRACE
        	if(this._enum_level[loglevel] < 3) {
	            console.log(loglevel + ' : ' + (new Date()).toString()  + ' : ' + this._trace_id); 
	
	            if (typeof (new Error()).stack !== 'undefined') {           
	                console.log($.trim((new Error()).stack.split("\n")[4]).replace('at ',''));
	            }
	
	            /**
	             * Check if message is an object or a string
	             */
	
	            if (typeof message === 'object') {
	                console.log(prefix + ' : ' + JSON.stringify(message));
	            } else {
	                console.log(prefix + ' : ' + message);
	            }
        	}
            /**
             * Create the body which needs to be sent; teh Payload
             */

            var error_info = '';

            if (typeof (new Error()).stack !== 'undefined') {
                error_info = $.trim((new Error()).stack.split("\n")[4]).replace('at ','');
            }

            var body = {
                loglevel : loglevel,
                timestamp : (new Date()).toString(),
                trace : this._trace_id,
                prefix : prefix,
                callee : error_info,
                message : message
            };

            /**
             * Error log generation for saving the cache
             */

            var error_log = JSON.parse(window.localStorage.getItem('error_log'));

            if (error_log === null || !(error_log instanceof Array)) {
                error_log = [];
            }

            /**
             * Add new error to the error_log stack
             */             

            error_log.push(body);

            /**
             * Error log buffer
             */             

            var error_log_stringify = JSON.stringify(error_log); 

            /**
             * The following block is only executed by one of the Logger
             * instances. For this we use private static var _mutex_lock.
             * buffer_size is the threshold which crossed allows errors to 
             * be reported to loggly server.
             */           

            if (error_log_stringify.length > this._type_config.loggly.buffer_size && 
                !_mutex_lock &&
                !_is_loading) {

                console.log('<< send logs to loggly server >>');

                /**
                 * Lock the mutually exclusive lock; so that other instances
                 * donot enter this section
                 */

                _mutex_lock = true;

                /**
                 * clear the error log buffer on disk
                 */

                window.localStorage.setItem('error_log', '[]');

                /**
                 * copy the error logs to a safe place
                 */

                var error_log_stringify_temp = error_log_stringify;

                /**
                 * send the request
                 */

                $.ajax({
                    type: 'POST',
                    dataType: 'json',
                    url: 'https://logs.loggly.com/inputs/' + this._type_config.loggly.key,
                    data: error_log_stringify,
                    success : function(){
                        console.log('<< ' + Math.floor(error_log_stringify_temp.length/1024) + 'kB sent succesfully to loggly server >>');
                    },
                    error : function(jqxhr, status, error){
                        console.log('<< could not send to loggly server ' + jqxhr.responseText + ' ' + status + ' ' + error + ' >>');
                        var old_error_log = JSON.parse(error_log_stringify_temp);
                        var new_error_log = JSON.parse(window.localStorage.getItem('error_log'));
                        window.localStorage.setItem('error_log', JSON.stringify(old_error_log.concat(new_error_log)));
                    },
                    complete : function () {
                        _mutex_lock = false;
                    }
                });

            } else {

                /**
                 * copy the error logs to a safe place
                 */

                window.localStorage.setItem('error_log', error_log_stringify);            
            }
        }    
    });
})();

/**
 * For node-unit test
 */
if (typeof node_unit !== 'undefined') {
    exports.Logger = Logger;
}