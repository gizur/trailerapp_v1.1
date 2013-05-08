/* jshint undef: true, unused: true, strict: true, vars: true */

/**
 * Model Class for Trouble ticket
 * 
 * @fileoverview Class definition of a collection of TroubleTickets
 * @author anshuk.kumar@essindia.co.in (Anshuk Kumar)
 * @license Commercial - Copyright 2013 Gizur AB
 * @see http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml
 */

var TroubleTicket = Stapes.subclass({
    constructor : function() {
        this.set({
            'asset' : new Asset(),
            'sealed' : '',
            'damage' : false,
            'place' : '',
            'enum_place' : {},
            'enum_damage' : {}
        });
    },

    /**
     * Clones 'this' object and returns a new one
     * @return {TroubleTicket} new object similar to this one
     */    
    clone : function() {
        var tt = new TroubleTicket();
        var tt_attrs = this.getAll();
        tt_attrs.damage = false;  
        tt.set(tt_attrs);
        return tt;
    },

    /**
     * Fetches data picklist of Place also caches it in 
     * local storage.
     * @return {object} key value pairs of lists
     */
    getEnumPlace: function(successCb, errorCb) {
        var that = this;

        var successCbWrapper = function(data){
            that.set('enum_place', data.result);
            successCb(data);
        };

        var errorCbWrapper = function(jqxhr, status, er){
            errorCb(jqxhr, status, er);
        };

        $.ajax({
            type: 'GET',
            url: usr.get('_url') + 'HelpDesk/damagereportlocation',
            beforeSend: function(xhr){
                xhr.setRequestHeader('X_USERNAME', usr.get('username'));
                xhr.setRequestHeader('X_PASSWORD', usr.get('password'));
                xhr.setRequestHeader('X_CLIENTID', usr.get('client_id'));
            },          
            success: successCbWrapper,
            error: errorCbWrapper
        }); 
    },

    /**
     * Fetches data picklist of Sealed also caches it in 
     * local storage.
     * @return {object} key value pairs of lists
     */
    getEnumSealed: function(successCb, errorCb) {
        var that = this;

        var successCbWrapper = function(data){
            that.set('enum_sealed', data.result);
            successCb(data);
        };

        var errorCbWrapper = function(jqxhr, status, er){
            errorCb(jqxhr, status, er);
        };

        $.ajax({
            type: 'GET',
            url: usr.get('_url') + 'HelpDesk/sealed',
            beforeSend: function(xhr){
                xhr.setRequestHeader('X_USERNAME', usr.get('username'));
                xhr.setRequestHeader('X_PASSWORD', usr.get('password'));
                xhr.setRequestHeader('X_CLIENTID', usr.get('client_id'));
            },          
            success: successCbWrapper,
            error: errorCbWrapper
        });
    },

    /**
     * Saves 'this' object to server
     * @return {object} key value pairs of lists
     */
    save: function() {

    }   
});


/**
 * For node-unit test
 */
if (node_unit) {
    exports.TroubleTicket = TroubleTicket;
}