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

var AssetCollection = Stapes.subclass({

    /**
     * @constructor
     *
     * @param {user} aUsr the user who will send the requests
     */ 

    constructor : function(aUsr) {

        /**
         * Set pseudo private vars
         * please dont change this using <objname>._privatevarname
         * method from outside of here.
         * Arggghh Stapes!!!!
         */        

        this.extend({
            _usr : aUsr,
            _storage : window.localStorage,
            _lg : new Logger('TRACE', 'AssetCollection')
        });

        this._lg.log('TRACE', '#constructor start');

        var assets = this._storage.getItem('assets');
        var that = this;

        if (assets && assets !== null) {

            this._lg.log('DEBUG', 'assets from cache ' + assets);

            assets = JSON.parse(assets);

            $.each(assets, function(index, item){
                var ast = new Asset(this._usr);
                ast.set(item);
                that.push(ast);
            });                
        }
        this._lg.log('TRACE', '#constructor end');
    },

    /**
     * Fetches troubletickets from server and populates 'this' object
     * with all the received assets
     *
     * @param  {function} successCb success callback executed in case of success
     * @param  {function} errorCb   executed in case of error
     * @return {void}
     */  

    getAssets : function(successCb, errorCb) {
        this._lg.log('TRACE', '#getAssets');

        var that = this;

        var successCbWrapper = function(data){

            that._storage.setItem('assets', JSON.stringify(data.result));

            $.each(data.result, function(index, item){
                var ast = new Asset(that._usr);
                ast.set(item);
                that.push(ast);
            });

            if (typeof successCb == 'function')
                successCb(data, 'assets');
        };

        var errorCbWrapper = function(jqxhr, status, er){
            if (typeof errorCb == 'function')
                errorCb(jqxhr, status, er, 'assets');
        };

        this._usr.send(
            'GET', 
            'Assets',
            '',
            successCbWrapper,
            errorCbWrapper
        );
    }
});

/**
 * For node-unit test
 */
if (typeof node_unit != 'undefined') {
    exports.AssetCollection = AssetCollection;
}