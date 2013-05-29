/* jshint undef: true, unused: true, strict: true, vars: true */

/**
 * Utility Class Logger
 * 
 * @fileoverview Logs
 * @author anshuk.kumar@essindia.co.in (Anshuk Kumar)
 * @license Commercial - Copyright 2013 Gizur AB
 * @see http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml
 */

var Logger = Stapes.subclass({
    constructor : function(aLevel, aPrefix, aType, aTypeConfig) {

        // Set pseudo private vars
        // please dont change this using <objname>._privatevarname
        // method from outside of here.
        // Arggghh Stapes!!!!
        this.extend({
             _level : 1,
             _type : (typeof Config.log_type == 'undefined')?'console':Config.log_type,
             _type_config : {
                loggly : {
                    key : 'a631e820-9cec-418e-950b-1a3132c6b03a',
                    buffer_size : (10 * 1024) //10kB
                }
             },
             _trace_id : '',
             _prefix : aPrefix,
             _enum_level : {
                "DEBUG": 1,
                "TRACE": 2,
                "FATAL": 3
             },
             _mutex_lock : false              
        });

        if (aType != undefined) 
            this._type = aType;

        if (aTypeConfig != undefined)
            this._type_config = aTypeConfig;

        this._level = this._enum_level[aLevel]

        if (window.localStorage == undefined) {
            //thanks to 
            //http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
            this._trace_id = 'xxxxxxxy-xxxx-4xxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            });
        } else {
            this._trace_id = window.localStorage.getItem('trace_id');
            if (this._trace_id == null) {
                this._trace_id = 'xxxxxxxy-xxxx-4xxx'.replace(/[xy]/g, function(c) {
                    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                    return v.toString(16);
                }); 
                window.localStorage.setItem('trace_id', this._trace_id);               
            }
        }
    },
    log : function(loglevel, message) {
        if (this._enum_level[loglevel] >= this._level) {
            switch(this._type) {
                case 'console':
                  this._logConsole(loglevel, message);
                  break;
                case 'loggly':
                  this._logLoggly(loglevel, message);
                  break;
                default:
            }
        }
    },
    _logConsole : function(loglevel, message) {
        console.log(loglevel + ' : ' + (new Date()).toString()  + ' : ' + this._trace_id);                  
        console.log((new Error()).stack.split("\n")[4]); 
        if (typeof message == 'object') 
            message = JSON.stringify(message);                 
        console.log(this._prefix + ' : ' + message);
    },

    /**
     * Loggly way of sending logs
     */

    _logLoggly : function(loglevel, message) {
        console.log(loglevel + ' : ' + (new Date()).toString()  + ' : ' + this._trace_id);            
        console.log($.trim((new Error()).stack.split("\n")[4]).replace('at ',''));

        /**
         * Check if message is an object or a string
         */

        if (typeof message == 'object') 
            console.log(this._prefix + ' : ' + JSON.stringify(message));
        else
            console.log(this._prefix + ' : ' + message);

        /**
         * Create the body which needs to be sent; teh Payload
         */

        var that = this;
        var body = {
            loglevel : loglevel,
            timestamp : (new Date()).toString(),
            trace : this._trace_id,
            prefix : this._prefix,
            callee : $.trim((new Error()).stack.split("\n")[4]).replace('at ',''),
            message : message
        };

        var error_log = JSON.parse(window.localStorage.getItem('error_log'));

        if (error_log == null || !(error_log instanceof Array))
            error_log = Array();

        error_log.push(body);

        var error_log_stringify = JSON.stringify(error_log);

        if (error_log_stringify.length > this._type_config.loggly.buffer_size && 
            !this._mutex_lock) {

            console.log('<< send logs to loggly server >>');

            this._mutex_lock = true;
            window.localStorage.setItem('error_log', '[]');
            var error_log_stringify_temp = error_log_stringify;
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
                    that._mutex_lock = false;
                }
            });
        } else {
            window.localStorage.setItem('error_log', error_log_stringify);            
        }
    }    
});

/**
 * For node-unit test
 */
if (typeof node_unit != 'undefined') {
    exports.Logger = Logger;
}