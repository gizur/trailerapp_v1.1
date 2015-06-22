/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, 
         bitwise:true, strict:true, undef:false, unused:true, 
         curly:true, browser:true, indent:4, maxerr:50 */

/*global node_unit:true, Stapes:true, 
         Logger:true, exports:false*/

/**
 * Model Class for Trouble ticket collection, fetches 
 * troubletickets
 * 
 * @fileoverview Class definition of a collection of TroubleTickets
 * @author anshuk.kumar@essindia.co.in (Anshuk Kumar)
 * @license Commercial - Copyright 2013 Gizur AB
 * @see http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml
 */

var TroubleTicketCollection = Stapes.subclass({ 

    /**
     * @constructor
     *
     * @param {user} aUsr the user who will send the requests
     * @param {object} aLogConfig object containing the log configuration     
     */ 

    constructor : function(aUsr, aLogConfig) {

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
            _usr : aUsr,
            _lg : new Logger(aLogConfig.level, aLogConfig.type, aLogConfig.config)
        });
    }, 

    /**
     * Fetches troubletickets from server and populates 'this' object
     * with all the received troubletickets
     *
     * @param  {asset}    ast       filter for fetching trouble tickets
     * @param  {function} successCb success callback executed in case of success
     * @param  {function} errorCb   executed in case of error     
     * @return {void} 
     */       

    getDamagedTroubleTicketsByAsset : function(ast, successCb, errorCb) {

        "use strict";        
        
        var that = this;

        this._lg.log('TRACE', 'js/models/troubleticketcollection', 'getDamagedTroubleTicketsByAsset START');
        this._lg.log('DEBUG', 'js/models/troubleticketcollection', 'typof usr ' + (typeof this._usr));

        var assetname;

        if (typeof ast === 'object') {
            assetname = ast.get('assetname');
        } else {
            assetname = ast;
        }

        var successCbWrapper = function(data){

            that._lg.log('DEBUG', 'js/models/troubleticketcollection', 'received TroubleTickets ' + data.result.length);
            
            $.each(data.result, function(index, item){
                var tt = new TroubleTicket();
                tt.set(item);
                that.push(tt);
            });

            if (typeof successCb === 'function') {
                successCb(data);
            }
        };

        var errorCbWrapper = function(jqxhr, status, er){
            if (typeof errorCb === 'function') {
                errorCb(jqxhr, status, er);
            }
        };

        this._lg.log('DEBUG', 'js/models/troubleticketcollection', 'typeof usr ' + (typeof this._usr));
        this._lg.log('DEBUG', 'js/models/troubleticketcollection', '(usr instanceof User) ' + (this._usr instanceof User));

        this._usr.send(
            'GET', 
            'ExistingDamages/damaged/0000/00/' + assetname + '/all',
            '',
            successCbWrapper,
            errorCbWrapper,
            undefined,
            true
        );

        this._lg.log('TRACE', 'js/models/troubleticketcollection', 'getDamagedTroubleTicketsByAsset END');
    },

    /**
     * Save current trouble ticket collection
     *
     * @param {function} successCb   Executed on successful completion of all damages
     * @param {function} errorCb     Executed on error completion of damages
     * @param {function} statusCb    Executed on completion of every damage
     * @param {integer}  aCount      Number of damages reported
     * @param {array}    aKeys       list of tt keys which are erroneously reported
     * @param {integer}  aTotalCount total count of items in collection to be saved
     */

    save : function(successCb, errorCb, statusCb, aAttemptCount, aKeys, aTotalCount) {

        "use strict";        

        var that = this;
        var keys = aKeys;
        var current_key = '';
        var attempt_count = aAttemptCount;
        var total_count = aTotalCount;

        if (typeof total_count === 'undefined') {
            total_count = this.size();
        }

        /**
         * Number of times this save function has been called
         */

        if (typeof attempt_count === 'undefined') {
            attempt_count = 0;
        }

        /**
         * List of unsuccessfully sent troubletickets
         */

        if (!(keys instanceof Array)) {
            keys = [];
        }        

        var newSuccessCb = successCb;
        var newErrorCb = errorCb;
        var newStatusCb = statusCb;

        /**
         * Check if the last damage have been reported 
         * if yes call the callbacks error / success
         * If there is a single error in during the submittion
         * error callback is called
         */

        if (attempt_count === total_count) {

            this._lg.log('DEBUG', 'js/models/troubleticketcollection', ' attempt_count : total_count -> ' + attempt_count + ' : ' + total_count);
            this._lg.log('DEBUG', 'js/models/troubleticketcollection', ' attempt_count == total_count : keys.length ' + keys.length);

            if (keys.length === 0) {
                if (typeof newSuccessCb === 'function') {
                    newSuccessCb();
                }
            } else {
                if (typeof newErrorCb === 'function') {
                    newErrorCb(keys.length, total_count);
                }
            }

            this._lg.log('TRACE', 'js/models/troubleticketcollection', ' save called parent callbacks ');

            return;
        }

        /**
         * Callback called when damage is successfully reported.
         */

        var success = function() {
            that.remove(current_key);
            ++attempt_count;

            if (typeof newStatusCb === 'function') {
                newStatusCb(attempt_count, total_count);
            }

            that.save(newSuccessCb, newErrorCb, newStatusCb, attempt_count, keys, total_count);
        };

        /**
         * Callback called when error is received during reporting.
         */

        var error = function(jqxhr, status, er) {

            jqxhr = status = er = undefined;

            keys.push(current_key);            
            ++attempt_count;

            if (typeof newStatusCb === 'function') {
                newStatusCb(attempt_count, total_count);
            }

            that.save(newSuccessCb, newErrorCb, newStatusCb, attempt_count, keys, total_count);
        };

        /**
         * Pop the tt which is not yet reported
         */

        var attrs = this.getAll();

        //Uncommenting the following line crashes the app
        //memory issue
        //this._lg.log('DEBUG', 'attrs ' + JSON.stringify(attrs));        

        for (var index in attrs) {
            if (attrs.hasOwnProperty(index)) {
                this._lg.log('DEBUG', 'js/models/troubleticketcollection', 'attrs[index] instanceof TroubleTicket ' + (attrs[index] instanceof TroubleTicket));            

                if (keys.indexOf(index) === -1) {
                    attrs[index].save(success, error, true); //boolean true for silent
                    current_key = index;
                    break;
                }
            }
        }
    }

});

/**
 * For node-unit test
 */

if (typeof node_unit !== 'undefined') {
    exports.TroubleTicketCollection = TroubleTicketCollection;
}