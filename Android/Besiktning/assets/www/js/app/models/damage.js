/* jshint undef: true, unused: true, strict: true, vars: true */

/**
 * Model Class for Damage
 * 
 * @fileoverview Class definition of Damage
 * @author anshuk.kumar@essindia.co.in (Anshuk Kumar)
 * @license Commercial - Copyright 2013 Gizur AB
 * @see http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml
 */

var Damage = (function() {

    /**
     * Private Variables
     */
    var usr; //instance of User Class
    var storage;

    /**
     * Class Definition
     */
    var Damage = Stapes.subclass({

        /**
         * @constructor
         */ 
        constructor : function(aUsr) {
      
            usr = aUsr;

            storage = window.localStorage;

            this.set({
                'damagetype' : '',
                'damageposition' : '',
                'drivercauseddamage' : '',
                'enum_damagetype' : {},
                'enum_damageposition' : {},
                'enum_drivercauseddamage' : {},
                'docs' : new DocCollection()
            });

            if (storage.getItem('enum_damagetype') !=  false) {
                this.set('enum_damagetype', JSON.parse(storage.getItem('enum_damagetype')));
            }

            if (storage.getItem('enum_damageposition') !=  false) {
                this.set('enum_damageposition', JSON.parse(storage.getItem('enum_damageposition')));
            }   
            
            if (storage.getItem('enum_drivercauseddamage') !=  false) {
                this.set('enum_drivercauseddamage', JSON.parse(storage.getItem('enum_drivercauseddamage')));
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
                storage.setItem('enum_damagetype', JSON.stringify(data.result));

                if (successCb != undefined && typeof successCb == 'function')                
                    successCb(data);
            };

            var errorCbWrapper = function(jqxhr, status, er){
                if (errorCb != undefined && typeof errorCb == 'function')
                    errorCb(jqxhr, status, er);
            };

            usr.send(
                'GET', 
                'HelpDesk/damagetype',
                {
                    'X_USERNAME': usr.get('username'),
                    'X_PASSWORD': usr.get('password')
                },
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
                storage.setItem('enum_damageposition', JSON.stringify(data.result));

                if (successCb != undefined && typeof successCb == 'function')                  
                    successCb(data);
            };

            var errorCbWrapper = function(jqxhr, status, er){
                if (errorCb != undefined && typeof errorCb == 'function')
                    errorCb(jqxhr, status, er);
            };

            usr.send(
                'GET', 
                'HelpDesk/damageposition',
                {
                    'X_USERNAME': usr.get('username'),
                    'X_PASSWORD': usr.get('password')
                },
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
                storage.setItem('enum_drivercauseddamage', JSON.stringify(data.result));

                if (successCb != undefined && typeof successCb == 'function')                          
                    successCb(data);
            };

            var errorCbWrapper = function(jqxhr, status, er){
                if (errorCb != undefined && typeof errorCb == 'function')
                    errorCb(jqxhr, status, er);
            };

            usr.send(
                'GET', 
                'HelpDesk/drivercauseddamage',
                {
                    'X_USERNAME': usr.get('username'),
                    'X_PASSWORD': usr.get('password')
                },
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

    return Damage;
})();

/**
 * For node-unit test
 */
if (node_unit) {
    exports.Damage = Damage;
}