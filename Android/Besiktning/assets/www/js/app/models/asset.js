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
    var lg;

    /**
     * Class Definition
     */
    var Asset = Stapes.subclass({
        constructor : function(aUsr) {

            lg = new Logger('DEBUG','js/model/asset');

            storage = window.localStorage;

            usr = aUsr;

            lg.log('DEBUG', 'typeof aUsr = ' + (typeof aUsr));

            this.set({
                'id' : '',
                'assetname' : '',
                'trailertype' : '',
                'enum_trailertype' : {}
            });

            if (storage.getItem('enum_trailertype') !=  false && storage.getItem('enum_trailertype') !=  null) {
                this.set('enum_trailertype', JSON.parse(storage.getItem('enum_trailertype')));
            }            
        },

        /**
         * Fetches data picklist of Type Of Damage also caches it in 
         * local storage.
         */       
        getEnumTrailerType : function(successCb, errorCb) {

            lg.log('DEBUG', 'getEnumTrailerType start');  

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

            lg.log('DEBUG', 'typeof usr = ' + (typeof usr));

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
            
            lg.log('DEBUG', 'getEnumTrailerType end'); 
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