/* jshint undef: true, unused: true, strict: true, vars: true */

/**
 * Model Class Asset
 * 
 * @fileoverview Class definition of a collection of TroubleTickets
 * @author anshuk.kumar@essindia.co.in (Anshuk Kumar)
 * @license Commercial - Copyright 2013 Gizur AB
 * @see http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml
 */

var Asset = (function() {

    /**
     * Private Variables
     */
    var usr; //instance of User Class
    var storage; 

    /**
     * Class Definition
     */
    var Asset = Stapes.subclass({
        constructor : function(aUsr) {

            storage = window.localStorage;

            usr = aUsr;

            this.set({
                'id' : '',
                'assetname' : '',
                'trailertype' : '',
                'enum_trailertype' : {}
            });

            if (storage.getItem('enum_trailertype') !=  false) {
                this.set('enum_trailertype', JSON.parse(storage.getItem('enum_trailertype')));
            }            
        },

        /**
         * Fetches data picklist of Type Of Damage also caches it in 
         * local storage.
         */       
        getEnumTrailerType : function(successCb, errorCb) {
            var that = this;

            var successCbWrapper = function(data){
                that.set('enum_trailertype', data.result);
                storage.setItem('enum_trailertype', JSON.stringify(data.result));

                if (successCb != undefined && typeof successCb == 'function')                
                    successCb(data);
            };

            var errorCbWrapper = function(jqxhr, status, er){
                if (errorCb != undefined && typeof errorCb == 'function')
                    errorCb(jqxhr, status, er);
            };

            usr.send(
                'GET', 
                'Assets/trailertype',
                {
                    'X_USERNAME': usr.get('username'),
                    'X_PASSWORD': usr.get('password')
                },
                '',
                successCbWrapper,
                errorCbWrapper
            );
        }
    });

    return Asset;
})();

/**
 * For node-unit test
 */
if (node_unit) {
    exports.Asset = Asset;
}