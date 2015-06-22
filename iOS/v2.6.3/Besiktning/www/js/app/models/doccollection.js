/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, 
         bitwise:true, strict:true, undef:false, unused:true, 
         curly:true, browser:true, indent:4, maxerr:50 */

/*global node_unit:true, Stapes:true, 
         Logger:true, exports:false*/

/**
 * Model Class DocCollection
 * 
 * @fileoverview Class definition of a collection of Documents
 * @author anshuk.kumar@essindia.co.in (Anshuk Kumar)
 * @license Commercial - Copyright 2013 Gizur AB
 * @see http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml
 */

var DocCollection = Stapes.subclass({

    /**
     * @constructor
     * @param {object} aLogConfig object containing the log configuration     
     */ 
    constructor : function(aLogConfig) {

        "use strict";

        if (typeof aLogConfig === 'undefined') {
            aLogConfig = {
                level  : 'FATAL',
                type   : 'console',
                config : {}
            };
        } else {
            if (typeof aLogConfig.level === 'undefined') {
                aLogConfig.level = 'FATAL';
            }

            if (typeof aLogConfig.level === 'undefined') {
                aLogConfig.type = 'console';
            }

            if (typeof aLogConfig.config === 'undefined') {
                aLogConfig.config = {};
            }
        }

        this.extend({
            _lg : new Logger(aLogConfig.level, aLogConfig.type, aLogConfig.config)
        });

    },

    download : function(completedCb) {

        "use strict";        

        this._lg.log('TRACE', 'js/models/doccollection', 'download : start');

        var that = this;
        var dcc = this.getAllAsArray();
        var dc_success = [];
        var dc;

        var successCb = function(data) {

            data = undefined;

            that._lg.log('TRACE', 'js/models/doccollection', 'download successCb : start');
            that._lg.log('DEBUG', 'js/models/doccollection', ' download successCb dcc.length : ' + dcc.length);

            if (dc_success.length !== 0) {
                that._lg.log('DEBUG', 'js/models/doccollection', ' download successCb dc_success[dc_success.length-1].get(path) : ' + dc_success[dc_success.length-1].get('path'));
            } else {
                that._lg.log('DEBUG', 'js/models/doccollection', ' download successCb dc_success.length : ' + dc_success.length);
            }

            /**
             * Start downloading first document in the stack
             */

            if (dcc.length === 0) {
                if (typeof completedCb !== 'undefined') {
                    completedCb(dc_success);            
                }
            }              

            while (dcc.length !== 0) {
                dc = dcc.splice(0,1);
                if ( dc[0] instanceof Doc ) {
                    dc_success.push(dc[0]);
                    that._lg.log('DEBUG', 'js/models/doccollection', ' successCb downloading file id : ' + dc[0].get('id'));
                    successCb();
                    //dc[0].download(successCb, errorCb);
                    break;
                } else {
                    if (dcc.length === 0) {
                        if (typeof completedCb !== 'undefined') {
                            completedCb(dc_success);            
                        }
                    }                     
                }
            }           

            that._lg.log('TRACE', 'js/models/doccollection', 'download successCb : end');

        };

        /**
         * Start downloading first document in the stack
         */

        this._lg.log('DEBUG', 'js/models/doccollection', 'download dcc.length ' + dcc.length);

        if (dcc.length === 0) {
            if (typeof completedCb !== 'undefined') {
                completedCb(dc_success);           
            }
        }        

        while (dcc.length !== 0) {
            dc = dcc.splice(0,1);
            if ( dc[0] instanceof Doc ) {
                dc_success.push(dc[0]);
                that._lg.log('DEBUG', 'js/models/doccollection', ' download downloading file id : ' + dc[0].get('id'));
                successCb();
                //dc[0].download(successCb, errorCb);
                break;
            } else {
                if (dcc.length === 0) {
                    if (typeof completedCb !== 'undefined') {
                        completedCb(dc_success);            
                    }
                }                    
            }
        }

        this._lg.log('DEBUG', 'js/models/doccollection', 'download dc_success.length ' + dc_success.length);

        this._lg.log('TRACE', 'js/models/doccollection', 'download : end');

    }
});

/**
 * For node-unit test
 */
if (typeof node_unit !== 'undefined') {
    exports.DocCollection = DocCollection;
}