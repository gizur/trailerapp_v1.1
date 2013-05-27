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
    var storage;
    var lg;

    /**
     * Class Definition
     */
    var AssetCollection = Stapes.subclass({

        /**
         * @constructor
         */ 
        constructor : function(aUsr) {

            lg = new Logger('FATAL', 'AssetCollection');
            lg.log('TRACE', '#constructor start');

            usr = aUsr;

            storage  = window.localStorage;

            var assets = storage.getItem('assets');
            var that = this;

            if (assets != false && assets !=null) {

                lg.log('DEBUG', 'assets from cache ' + assets);

                var assets = JSON.parse(assets);

                $.each(assets, function(index, item){
                    var ast = new Asset(usr);
                    ast.set(item);
                    that.push(ast);
                });                
            }
            lg.log('TRACE', '#constructor end');
        },

        /**
         * Fetches troubletickets from server and populates 'this' object
         * with all the received troubletickets
         *
         * @param {string} asset_type filter for fetching trouble tickets
         * @return {object} key value pairs of lists
         */       
        getAssets : function(successCb, errorCb) {
            lg.log('TRACE', '#getAssets');

            var that = this;

            var successCbWrapper = function(data){

                storage.setItem('assets', JSON.stringify(data.result));

                $.each(data.result, function(index, item){
                    var ast = new Asset();
                    ast.set(item);
                    that.push(ast);
                });

                if (successCb != undefined && typeof successCb == 'function')
                    successCb(data, 'assets');
            };

            var errorCbWrapper = function(jqxhr, status, er){
                if (errorCb != undefined && typeof errorCb == 'function')
                    errorCb(jqxhr, status, er, 'assets');
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