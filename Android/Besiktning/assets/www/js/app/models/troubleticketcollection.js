/* jshint undef: true, unused: true, strict: true, vars: true */

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
     */ 

    constructor : function(aUsr) {
        this.extend({
            _usr : aUsr,
            _lg : new Logger('FATAL', 'js/models/troubleticketcollection')
        });
    }, 

    /**
     * Fetches troubletickets from server and populates 'this' object
     * with all the received troubletickets
     *
     * @param {asset} ast filter for fetching trouble tickets
     * @return {object} key value pairs of lists
     */       

    getDamagedTroubleTicketsByAsset : function(ast, successCb, errorCb) {
        
        var that = this;

        this._lg.log('TRACE', 'getDamagedTroubleTicketsByAsset START');
        this._lg.log('DEBUG', 'typof usr ' + (typeof this._usr));

        var assetname;

        if (typeof ast == 'object') {
            assetname = ast.get('assetname');
        } else {
            assetname = ast;
        }

        var successCbWrapper = function(data){

            that._lg.log('DEBUG', 'received TroubleTickets ' + data.result.length);
            that._lg.log('DEBUG', ' received TroubleTickets ' + JSON.stringify(data.result));

            $.each(data.result, function(index, item){
                var tt = new TroubleTicket();
                tt.set(item);
                that.push(tt);
            });

            if (successCb != undefined && (typeof successCb) == 'function')
                successCb(data);
        };

        var errorCbWrapper = function(jqxhr, status, er){
            if (errorCb != undefined && (typeof errorCb) == 'function')
                errorCb(jqxhr, status, er);
        };

        this._lg.log('DEBUG', 'typeof usr ' + (typeof this._usr));
        this._lg.log('DEBUG', '(usr instanceof User) ' + (this._usr instanceof User));

        this._usr.send(
            'GET', 
            'HelpDesk/damaged/0000/00/' + assetname + '/all',
            '',
            successCbWrapper,
            errorCbWrapper
        );

        this._lg.log('TRACE', 'getDamagedTroubleTicketsByAsset END');
    },

    /**
     * Save
     *
     * @param successCb function Executed on successful completion of all damages
     * @param errorCb   function Executed on error completion of damages
     * @param statusCb  function Executed on completion of every damage
     * @param aCount    integer  Number of damages reported
     * @param aKeys     array    list of tt keys which are erroneously reported
     */

    save : function(successCb, errorCb, statusCb, aAttemptCount, aKeys, aTotalCount) {
        var that = this;
        var keys = aKeys;
        var current_key = '';
        var attempt_count = aAttemptCount;
        var total_count = aTotalCount;
        var that = this;

        if (total_count == undefined) {
            total_count = this.size();
        }

        //Number of times this save function has been called
        if (attempt_count == undefined) {
            attempt_count = 0;
        }

        //Number of times this save function has been called
        if (keys == undefined || !(keys instanceof Array)) {
            keys = Array();
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
        if (attempt_count == total_count) {

            this._lg.log('DEBUG', ' attempt_count : total_count -> ' + attempt_count + ' : ' + total_count);            

            this._lg.log('DEBUG', ' attempt_count == total_count : keys.length ' + keys.length);

            if (keys.length == 0) {
                newSuccessCb();
            } else {
                newErrorCb();
            }

            return;
        }

        /**
         * Callback called when damage is successfully reported.
         */
        var success = function() {
            that.remove(current_key);
            ++attempt_count;
            newStatusCb(attempt_count, total_count);
            that.save(newSuccessCb, newErrorCb, newStatusCb, attempt_count, keys, total_count);
        };

        /**
         * Callback called when error is received during reporting.
         */
        var error = function(jqxhr, status, er) {
            keys.push(current_key);            
            ++attempt_count;
            newStatusCb(attempt_count, total_count);            
            that.save(newSuccessCb, newErrorCb, newStatusCb, attempt_count, keys, total_count);
        };

        /**
         * Pop the tt which is not yet reported
         */
        var attrs = this.getAll();
        this._lg.log('DEBUG', 'attrs ' + JSON.stringify(attrs));        
        for (current_key in attrs) {
            this._lg.log('DEBUG', 'attrs[current_key] instanceof TroubleTicket ' + (attrs[current_key] instanceof TroubleTicket));            
            this._lg.log('DEBUG', 'attrs[current_key].constructor ' + (attrs[current_key].constructor));            

            if (keys.indexOf(current_key) == -1) {
                attrs[current_key].save(success, error);
                break;
            }
        }
    }

});

/**
 * For node-unit test
 */
if (typeof node_unit != 'undefined') {
    exports.TroubleTicketCollection = TroubleTicketCollection;
}