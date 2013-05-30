/* jshint undef: true, unused: true, strict: true, vars: true */

/**
 * Model Class for Damage
 * 
 * @fileoverview Class definition of Damage
 * @author anshuk.kumar@essindia.co.in (Anshuk Kumar)
 * @license Commercial - Copyright 2013 Gizur AB
 * @see http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml
 */

var Damage = Stapes.subclass({

    /**
     * @constructor
     *
     * @param {user} aUsr the user who will send requests
     */ 

    constructor : function(aUsr) {

        /**
         * Set pseudo private vars
         * please dont change this using <objname>._privatevarname
         * method from outside of here.
         * Arggghh Stapes!!!!
         */        

        this.extend({
            _lg: new Logger('FATAL', 'app/model/damage'),
            _usr: aUsr,
            _storage: window.localStorage
        });

        this.set({
            'damagetype' : '',
            'damageposition' : '',
            'drivercauseddamage' : '',
            'enum_damagetype' : {},
            'enum_damageposition' : {},
            'enum_drivercauseddamage' : {},
            'docs' : new DocCollection()
        });

        if (this._storage.getItem('enum_damagetype')) {
            this.set('enum_damagetype', JSON.parse(this._storage.getItem('enum_damagetype')));
        }

        if (this._storage.getItem('enum_damageposition')) {
            this.set('enum_damageposition', JSON.parse(this._storage.getItem('enum_damageposition')));
        }   
        
        if (this._storage.getItem('enum_drivercauseddamage')) {
            this.set('enum_drivercauseddamage', JSON.parse(this._storage.getItem('enum_drivercauseddamage')));
        }                       
    },

    /**
     * Fetches data picklist of Type Of Damage also caches it in 
     * local storage.
     *
     * @param  {function} successCb success callback executed in case of success
     * @param  {function} errorCb   executed in case of error
     * @return {void}     
     */

    getEnumDamageType : function(successCb, errorCb) {
        var that = this;

        var successCbWrapper = function(data){
            that.set('enum_damagetype', data.result);
            that._storage.setItem('enum_damagetype', JSON.stringify(data.result));

            if (typeof successCb == 'function')                
                successCb(data, 'damagetype');
        };

        var errorCbWrapper = function(jqxhr, status, er){
            if (typeof errorCb == 'function')
                errorCb(jqxhr, status, er, 'damagetype');
        };

        this._usr.send(
            'GET', 
            'HelpDesk/damagetype',
            '',
            successCbWrapper,
            errorCbWrapper
        );
    },

    /**
     * Fetches picklist for Damage Position
     * 
     * @param  {function} successCb success callback executed in case of success
     * @param  {function} errorCb   executed in case of error
     * @return {void}
     */ 

    getEnumDamagePosition : function(successCb, errorCb) {
        var that = this;

        var successCbWrapper = function(data){
            that.set('enum_damageposition', data.result);
            that._storage.setItem('enum_damageposition', JSON.stringify(data.result));

            if (typeof successCb == 'function')                  
                successCb(data, 'damageposition');
        };

        var errorCbWrapper = function(jqxhr, status, er){
            if (typeof errorCb == 'function')
                errorCb(jqxhr, status, er, 'damageposition');
        };

        this._usr.send(
            'GET', 
            'HelpDesk/damageposition',
            '',
            successCbWrapper,
            errorCbWrapper
        );
    },

    /**
     * Fetches picklist for Driver Caused Damage
     * 
     * @param  {function} successCb success callback executed in case of success
     * @param  {function} errorCb   executed in case of error
     * @return {void}
     */ 

    getEnumDriverCausedDamage : function(successCb, errorCb) {
        var that = this;

        var successCbWrapper = function(data){
            that.set('enum_drivercauseddamage', data.result);  
            that._storage.setItem('enum_drivercauseddamage', JSON.stringify(data.result));

            if (typeof successCb == 'function')                          
                successCb(data, 'drivercauseddamage');
        };

        var errorCbWrapper = function(jqxhr, status, er){
            if (typeof errorCb == 'function')
                errorCb(jqxhr, status, er, 'drivercauseddamage');
        };

        this._usr.send(
            'GET', 
            'HelpDesk/drivercauseddamage',
            '',
            successCbWrapper,
            errorCbWrapper
        );
    },

    /**
     * Serialize the damage
     *
     * @return {string} json string of current objects attributes  
     */

    serialize : function() {
        var sdmg = this.getAll();
        sdmg.docs = sdmg.docs.getAllAsArray();

        for (var index in dmg.docs) {
            sdmg.docs[index] = dmg.docs[index].getAll();
        }

        delete dmg.enum_drivercauseddamage;
        delete dmg.enum_damageposition;
        delete dmg.enum_damagetype;

        return JSON.stringify(sdmg);
    }
});

/**
 * For node-unit test
 */

if (typeof node_unit != 'undefined') {
    exports.Damage = Damage;
}