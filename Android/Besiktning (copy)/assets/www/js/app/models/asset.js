/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, 
         bitwise:true, strict:true, undef:false, unused:true, 
         curly:true, browser:true, indent:4, maxerr:50 */

/*global node_unit:true, Stapes:true, 
         Logger:true, window:true, exports:false*/

/**
 * Model Class Asset
 * 
 * @fileoverview Class definition of a Asset
 * @author anshuk.kumar@essindia.co.in (Anshuk Kumar)
 * @license Commercial - Copyright 2013 Gizur AB
 * @see http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml
 */

var Asset = Stapes.subclass({

    /**
     * @constructor
     *
     * @param {user}   aUsr       the user who is making calls to server
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
            _lg : new Logger(aLogConfig.level, aLogConfig.type, aLogConfig.config),
            _storage : window.localStorage,
            _usr : aUsr
        });

        this._lg.log('DEBUG', 'js/models/asset', 'typeof aUsr = ' + (typeof aUsr));

        this.set({
            'id' : '',
            'assetname' : '',
            'trailertype' : '',
            'enum_trailertype' : {}
        });

        if (this._storage.getItem('enum_trailertype') && 
            this._storage.getItem('enum_trailertype') !==  null) {
            this.set('enum_trailertype', JSON.parse(this._storage.getItem('enum_trailertype')));
        }
    },

    /**
     * Fetches data picklist of Type Of Damage also caches it in 
     * local storage.
     *
     * @param  {function} successCb success callback
     * @param  {function} errorCb   error callback   
     * @return {void} 
     */ 
          
    getEnumTrailerType : function(successCb, errorCb) {

        "use strict";

        this._lg.log('DEBUG', 'js/models/asset', 'getEnumTrailerType start');  

        var that = this;

        var successCbWrapper = function(data){
            that.set('enum_trailertype', data.result);
            that._storage.setItem('enum_trailertype', JSON.stringify(data.result));

            if (typeof successCb === 'function') {               
                successCb(data, 'trailertype');
            }
        };

        var errorCbWrapper = function(jqxhr, status, er){
            if (typeof errorCb === 'function') {
                errorCb(jqxhr, status, er, 'trailertype');
            }
        };

        this._lg.log('DEBUG', 'js/models/asset', 'typeof usr = ' + (typeof this._usr));

        this._usr.send(
            'GET', 
            'Assets/trailertype',
            '',
            successCbWrapper,
            errorCbWrapper
        );
        
        this._lg.log('DEBUG', 'js/models/asset', 'getEnumTrailerType end'); 
    }
});

/**
 * For node-unit test
 */

if (typeof node_unit !== 'undefined') {
    exports.Asset = Asset;
}