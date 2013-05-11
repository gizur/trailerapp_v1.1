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

    /**
     * Class Definition
     */
    var Damage = Stapes.subclass({

        /**
         * @constructor
         */ 
        constructor : function(aUsr) {
      
            usr = aUsr;

            this.set({
                'damagetype' : '',
                'damageposition' : '',
                'drivercauseddamage' : '',
                'enum_damagetype' : '',
                'enum_damageposition' : '',
                'enum_drivercauseddamage' : '',
                'docs' : new DocCollection()
            });
        },

        /**
         * Fetches data picklist of Type Of Damage also caches it in 
         * local storage.
         */       
        getEnumDamageType : function(successCb, errorCb) {
            var that = this;

            var successCbWrapper = function(data){
                that.set('enum_damagetype', data.result);
                successCb(data);
            };

            var errorCbWrapper = function(jqxhr, status, er){
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
                successCb(data);
            };

            var errorCbWrapper = function(jqxhr, status, er){
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
                successCb(data);
            };

            var errorCbWrapper = function(jqxhr, status, er){
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
    });

    return Damage;
})();

/**
 * For node-unit test
 */
if (node_unit) {
    exports.Damage = Damage;
}