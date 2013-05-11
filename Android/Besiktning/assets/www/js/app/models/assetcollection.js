/* jshint undef: true, unused: true, strict: true, vars: true */

/**
 * Model Class for Asset collection, fetches 
 * assets
 * 
 * @fileoverview Class definition of a collection of Assets
 * @author anshuk.kumar@essindia.co.in (Anshuk Kumar)
 * @license Commercial - Copyright 2013 Gizur AB
 * @see http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml
 */

var AssetCollection = (function() {

    /**
     * Private Variables
     */
    var usr; //instance of User Class

    /**
     * Class Definition
     */
    var AssetCollection = Stapes.subclass({

        /**
         * @constructor
         */ 
        constructor : function(aUsr) {
            usr = aUsr;
        },

        /**
         * Fetches troubletickets from server and populates 'this' object
         * with all the received troubletickets
         *
         * @param {string} asset_type filter for fetching trouble tickets
         * @return {object} key value pairs of lists
         */       
        getAssets : function(successCb, errorCb) {
            var that = this;

            var successCbWrapper = function(data){
                $.each(data.result, function(index, item){
                    var ast = new Asset();
                    ast.set(item);
                    that.push(ast);
                });
                successCb(data);
            };

            var errorCbWrapper = function(jqxhr, status, er){
                errorCb(jqxhr, status, er);
            };


            usr.send(
                'GET', 
                'Assets',
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

    return AssetCollection;
})();

/**
 * For node-unit test
 */
if (node_unit) {
    exports.AssetCollection = AssetCollection;
}