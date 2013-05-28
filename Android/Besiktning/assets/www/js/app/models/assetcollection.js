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
     */ 
    constructor : function(aUsr) {

        this.extend({
            _usr : aUsr,
            _storage : window.localStorage,
            _lg : new Logger('FATAL', 'AssetCollection')
        });

        this._lg.log('TRACE', '#constructor start');

        var assets = this._storage.getItem('assets');
        var that = this;

        if (assets != false && assets !=null) {

            this._lg.log('DEBUG', 'assets from cache ' + assets);

            var assets = JSON.parse(assets);

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
     * with all the received troubletickets
     *
     * @param {string} asset_type filter for fetching trouble tickets
     * @return {object} key value pairs of lists
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

            if (successCb != undefined && typeof successCb == 'function')
                successCb(data, 'assets');
        };

        var errorCbWrapper = function(jqxhr, status, er){
            if (errorCb != undefined && typeof errorCb == 'function')
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