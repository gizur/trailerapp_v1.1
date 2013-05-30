/* jshint undef: true, unused: true, strict: true, vars: true */

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
     * @param {user} aUsr the user who is making calls to server
     */

    constructor : function(aUsr) {

        /**
         * Set pseudo private vars
         * please dont change this using <objname>._privatevarname
         * method from outside of here.
         * Arggghh Stapes!!!!
         */        

        this.extend({
            _lg : new Logger('DEBUG','js/model/asset'),
            _storage : window.localStorage,
            _usr : aUsr
        });

        this._lg.log('DEBUG', 'typeof aUsr = ' + (typeof aUsr));

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
        this._lg.log('DEBUG', 'getEnumTrailerType start');  

        var that = this;

        var successCbWrapper = function(data){
            that.set('enum_trailertype', data.result);
            that._storage.setItem('enum_trailertype', JSON.stringify(data.result));

            if (typeof successCb == 'function')                
                successCb(data, 'trailertype');
        };

        var errorCbWrapper = function(jqxhr, status, er){
            if (typeof errorCb == 'function')
                errorCb(jqxhr, status, er, 'trailertype');
        };

        this._lg.log('DEBUG', 'typeof usr = ' + (typeof this._usr));

        this._usr.send(
            'GET', 
            'Assets/trailertype',
            '',
            successCbWrapper,
            errorCbWrapper
        );
        
        this._lg.log('DEBUG', 'getEnumTrailerType end'); 
    }
});

/**
 * For node-unit test
 */

if (typeof node_unit != 'undefined') {
    exports.Asset = Asset;
}