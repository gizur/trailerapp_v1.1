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
    constructor : function() {

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

        var successCbWrapper = function(data){
            $.each(data.result, function(index, item){
                var tt = new TroubleTicket();
                tt.set(item);
                that.push(tt);
            });
            successCb(data);
        };

        var errorCbWrapper = function(jqxhr, status, er){
            errorCb(jqxhr, status, er);
        };

        $.ajax({
            type: 'GET',
            url: usr.get('_url') + 'HelpDesk/damaged/0000/00/' + ast.get('assetname') + '/all',
            beforeSend: function(xhr){
                xhr.setRequestHeader('X_USERNAME', usr.get('username'));
                xhr.setRequestHeader('X_PASSWORD', usr.get('password'));
                xhr.setRequestHeader('X_CLIENTID', usr.get('client_id'));
            },          
            success: successCbWrapper,
            error: errorCbWrapper
        });        
    }
});

/**
 * For node-unit test
 */
if (node_unit) {
    exports.TroubleTicketCollection = TroubleTicketCollection;
}