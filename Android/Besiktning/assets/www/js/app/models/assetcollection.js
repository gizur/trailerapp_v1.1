/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, 
         bitwise:true, strict:true, undef:false, unused:true, 
         curly:true, browser:true, indent:4, maxerr:50 */

/*global $:true, node_unit:true, Stapes:true, 
         Logger:true, window:true, exports:false*/

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
     * @param {object} aLogConfig object containing the log configuration     
     */ 

    constructor : function(aUsr, aLogConfig) {

        "use strict";

        /**
         * Set pseudo private vars
         * please dont change this using <objname>._privatevarname
         * method from outside of here.
         * Arggghh Stapes!!!!
         */        

        if (typeof aLogConfig === 'undefined') {
            aLogConfig = {
                level  : 'FATAL',
                type   : 'console',
                config : {}
            };
        } else {
            if (typeof aLogConfig.level === 'undefined') {
                aLogConfig.level = 'FATAL';
            }

            if (typeof aLogConfig.level === 'undefined') {
                aLogConfig.type = 'console';
            }

            if (typeof aLogConfig.config === 'undefined') {
                aLogConfig.config = {};            
            }
        }

        this.extend({
            _usr : aUsr,
            _storage : window.localStorage,
            _lg : new Logger(aLogConfig.level, 'js/models/assetcollection', aLogConfig.type, aLogConfig.config)
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

        "use strict";

        this._lg.log('TRACE', '#getAssets');

        var that = this;

        var successCbWrapper = function(data){

            that._storage.setItem('assets', JSON.stringify(data.result));

            $.each(data.result, function(index, item){
                var ast = new Asset(that._usr);
                ast.set(item);
                that.push(ast);
            });

            if (typeof successCb === 'function') {
                successCb(data, 'assets');
            }
        };

        var errorCbWrapper = function(jqxhr, status, er){
            if (typeof errorCb === 'function') {
                errorCb(jqxhr, status, er, 'assets');
            }
        };

        this._usr.send(
            'GET', 
            'Assets',
            'inoperation',
            successCbWrapper,
            errorCbWrapper
        );
    }
});

/**
 * For node-unit test
 */
if (typeof node_unit !== 'undefined') {
    exports.AssetCollection = AssetCollection;
}