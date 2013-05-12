/* jshint undef: true, unused: true, strict: true, vars: true */

/**
 * Model Class for Trouble ticket
 * 
 * @fileoverview Class definition of a collection of TroubleTickets
 * @author anshuk.kumar@essindia.co.in (Anshuk Kumar)
 * @license Commercial - Copyright 2013 Gizur AB
 * @see http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml
 */

/**
 * 
 * Dependency (should be globally available)
 *  |
 *  |-Asset Class
 *  |-TroubleTicket Class
 *  |-Object usr (instanceof User Class)
 *  |-Object req (instanceof Request Class)
 */

var TroubleTicket = (function() {

    /**
     * Private Variables
     */
    var usr; //instance of User Class
    var storage; 

    /**
     * Class Definition
     */
    var TroubleTicket = Stapes.subclass({
        /**
         * Creates Object of TroubleTicket Class
         *
         * @param aReq Request Class instance, the API and client to make request to
         * @param aUsr User Class instance, the user who is making the request
         *
         * @return {TroubleTicket} new object
         */         
        constructor : function(aUsr) {

            storage = window.localStorage;

            usr = aUsr;

            this.set({
                'asset' : new Asset(),
                'sealed' : '',
                'damage' : false,
                'place' : '',
                'enum_place' : {},
                'enum_sealed' : {}
            });

            if (storage.getItem('enum_place') !=  false) {
                this.set('enum_place', JSON.parse(storage.getItem('enum_place')));
            }

            if (storage.getItem('enum_sealed') !=  false) {
                this.set('enum_sealed', JSON.parse(storage.getItem('enum_damage')));
            }            

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
                storage.setItem('enum_place', JSON.stringify(data.result));

                if (successCb != undefined && typeof successCb == 'function')
                    successCb(data);
            };

            var errorCbWrapper = function(jqxhr, status, er){
                if (errorCb != undefined && typeof errorCb == 'function')
                    errorCb(jqxhr, status, er);              
            };

            usr.send(
                'GET', 
                'HelpDesk/damagereportlocation',
                {
                    'X_USERNAME': usr.get('username'),
                    'X_PASSWORD': usr.get('password')
                },
                '',
                successCbWrapper,
                errorCbWrapper
            );
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
                storage.setItem('enum_sealed', JSON.stringify(data.result));

                if (successCb != undefined && typeof successCb == 'function')
                    successCb(data);
            };

            var errorCbWrapper = function(jqxhr, status, er){
                if (errorCb != undefined && typeof errorCb == 'function')
                    errorCb(jqxhr, status, er);
            };

            usr.send(
                'GET', 
                'HelpDesk/sealed',
                {
                    'X_USERNAME': usr.get('username'),
                    'X_PASSWORD': usr.get('password')
                },
                '',
                successCbWrapper,
                errorCbWrapper
            );
        },

        /**
         * Saves 'this' object to server
         * @return {object} key value pairs of lists
         */
        save: function() {

        }   
    });

    return TroubleTicket;
})();

/**
 * For node-unit test
 */
if (node_unit) {
    exports.TroubleTicket = TroubleTicket;
}