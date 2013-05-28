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
     */ 
    constructor : function(aUsr) {

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

        if (this._storage.getItem('enum_damagetype') !=  false) {
            this.set('enum_damagetype', JSON.parse(this._storage.getItem('enum_damagetype')));
        }

        if (this._storage.getItem('enum_damageposition') !=  false) {
            this.set('enum_damageposition', JSON.parse(this._storage.getItem('enum_damageposition')));
        }   
        
        if (this._storage.getItem('enum_drivercauseddamage') !=  false) {
            this.set('enum_drivercauseddamage', JSON.parse(this._storage.getItem('enum_drivercauseddamage')));
        }                       
    },

    /**
     * Fetches data picklist of Type Of Damage also caches it in 
     * local storage.
     */       
    getEnumDamageType : function(successCb, errorCb) {
        var that = this;

        var successCbWrapper = function(data){
            that.set('enum_damagetype', data.result);
            that._storage.setItem('enum_damagetype', JSON.stringify(data.result));

            if (successCb != undefined && typeof successCb == 'function')                
                successCb(data, 'damagetype');
        };

        var errorCbWrapper = function(jqxhr, status, er){
            if (errorCb != undefined && typeof errorCb == 'function')
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
     * Changes the password
     */       
    getEnumDamagePosition : function(successCb, errorCb) {
        var that = this;

        var successCbWrapper = function(data){
            that.set('enum_damageposition', data.result);
            that._storage.setItem('enum_damageposition', JSON.stringify(data.result));

            if (successCb != undefined && typeof successCb == 'function')                  
                successCb(data, 'damageposition');
        };

        var errorCbWrapper = function(jqxhr, status, er){
            if (errorCb != undefined && typeof errorCb == 'function')
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
     * Changes the password
     */       
    getEnumDriverCausedDamage : function(successCb, errorCb) {
        var that = this;

        var successCbWrapper = function(data){
            that.set('enum_drivercauseddamage', data.result);  
            that._storage.setItem('enum_drivercauseddamage', JSON.stringify(data.result));

            if (successCb != undefined && typeof successCb == 'function')                          
                successCb(data, 'drivercauseddamage');
        };

        var errorCbWrapper = function(jqxhr, status, er){
            if (errorCb != undefined && typeof errorCb == 'function')
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