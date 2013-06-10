/* jshint undef: true, unused: true, strict: true, vars: true */

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
     */ 
    constructor : function() {

        this.extend({
            _lg : new Logger('TRACE', 'app/model/DocCollection')
        });

    },

    download : function(completedCb) {

        this._lg.log('TRACE', 'download : start');

        var that = this;
        var dcc = this.getAllAsArray();
        var dc_success = Array();
        var dc;

        var successCb = function(data) {

            that._lg.log('TRACE', 'download successCb : start');
            that._lg.log('DEBUG', ' download successCb dcc.length : ' + dcc.length);

            if (dc_success.length != 0)
                that._lg.log('DEBUG', ' download successCb dc_success[dc_success.length-1].get(path) : ' + dc_success[dc_success.length-1].get('path'));
            else
                that._lg.log('DEBUG', ' download successCb dc_success.length : ' + dc_success.length);
            /**
             * Start downloading first document in the stack
             */

            if (dcc.length == 0) {
                if (typeof completedCb != 'undefined')
                    completedCb(dc_success);            
            }              

            while (dcc.length != 0) {
                dc = dcc.splice(0,1);
                if ( dc[0] instanceof Doc ) {
                    dc_success.push(dc[0]);
                    that._lg.log('DEBUG', ' successCb downloading file id : ' + dc[0].get('id'));
                    dc[0].download(successCb, errorCb);
                    break;
                } else {
                    if (dcc.length == 0) {
                        if (typeof completedCb != 'undefined')
                            completedCb(dc_success);            
                    }                     
                }
            }           

            that._lg.log('TRACE', 'download successCb : end');

        };

        var errorCb = function(jqxhr, status, er) {

            that._lg.log('TRACE', 'download errorCb : start');

            dc_success.splice(0,1);

            /**
             * Start downloading first document in the stack
             */

            while (dcc.length != 0) {
                dc = dcc.splice(0,1);
                if ( dc[0] instanceof Doc ) {
                    dc_success.push(dc[0]);
                    that._lg.log('DEBUG', ' errorCb downloading file id : ' + dc[0].get('id'));                    
                    dc[0].download(successCb, errorCb);
                    break;
                }
            }

            if (dcc.length == 0) {
                if (typeof completedCb != 'undefined')
                    completedCb(dc_success);            
            }

            that._lg.log('TRACE', 'download errorCb : end');

        };

        /**
         * Start downloading first document in the stack
         */

        this._lg.log('DEBUG', 'download dcc.length ' + dcc.length);

        if (dcc.length == 0) {
            if (typeof completedCb != 'undefined')
                completedCb(dc_success);            
        }        

        while (dcc.length != 0) {
            dc = dcc.splice(0,1);
            if ( dc[0] instanceof Doc ) {
                dc_success.push(dc[0]);
                that._lg.log('DEBUG', ' download downloading file id : ' + dc[0].get('id'));                                    
                dc[0].download(successCb, errorCb);
                break;
            } else {
                if (dcc.length == 0) {
                    if (typeof completedCb != 'undefined')
                        completedCb(dc_success);            
                }                    
            }
        }

        this._lg.log('DEBUG', 'download dc_success.length ' + dc_success.length);

        this._lg.log('TRACE', 'download : end');

    }
});

/**
 * For node-unit test
 */
if (typeof node_unit != 'undefined') {
    exports.DocCollection = DocCollection;
}