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
             _type : 'console',
             _type_config : {},
             _trace_id : '',
             _prefix : aPrefix,
             _enum_level : {
                "DEBUG": 1,
                "TRACE": 2,
                "FATAL": 3
             }               
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
        console.log(this._prefix + ' : ' + message);
    },
    _logLoggly : function(loglevel, message) {
        console.log(loglevel + ' : ' + (new Date()).toString()  + ' : ' + this._trace_id);            
        console.log(this._prefix + ' : ' + message);

        var body = {
            loglevel : loglevel,
            timestamp : (new Date()).toString(),
            trace : this._trace_id,
            prefix : this._prefix,
            message : message
        };

        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: 'https://logs.loggly.com/inputs/' + this._type_config.key,
            data: JSON.stringify(body)
        });
    }    
});

/**
 * For node-unit test
 */
if (node_unit) {
    exports.Logger = Logger;
}