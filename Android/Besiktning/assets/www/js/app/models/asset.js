/* jshint undef: true, unused: true, strict: true, vars: true */

/**
 * Model Class Asset
 * 
 * @fileoverview Class definition of a collection of TroubleTickets
 * @author anshuk.kumar@essindia.co.in (Anshuk Kumar)
 * @license Commercial - Copyright 2013 Gizur AB
 * @see http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml
 */

var Asset = Stapes.subclass({
    constructor : function(aUsr) {

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

        if (this._storage.getItem('enum_trailertype') !=  false && this._storage.getItem('enum_trailertype') !=  null) {
            this.set('enum_trailertype', JSON.parse(this._storage.getItem('enum_trailertype')));
        }            
    },

    /**
     * Fetches data picklist of Type Of Damage also caches it in 
     * local storage.
     */       
    getEnumTrailerType : function(successCb, errorCb) {
        var lg = this._lg;

        lg.log('DEBUG', 'getEnumTrailerType start');  

        var that = this;

        var successCbWrapper = function(data){
            that.set('enum_trailertype', data.result);
            that._storage.setItem('enum_trailertype', JSON.stringify(data.result));

            if (successCb != undefined && typeof successCb == 'function')                
                successCb(data, 'trailertype');
        };

        var errorCbWrapper = function(jqxhr, status, er){
            if (errorCb != undefined && typeof errorCb == 'function')
                errorCb(jqxhr, status, er, 'trailertype');
        };

        lg.log('DEBUG', 'typeof usr = ' + (typeof this._usr));

        this._usr.send(
            'GET', 
            'Assets/trailertype',
            {
                'X_USERNAME': this._usr.get('username'),
                'X_PASSWORD': this._usr.get('password')
            },
            '',
            successCbWrapper,
            errorCbWrapper
        );
        
        lg.log('DEBUG', 'getEnumTrailerType end'); 
    }
});

/**
 * For node-unit test
 */
if (node_unit) {
    exports.Asset = Asset;
}