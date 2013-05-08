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
    constructor : function() {
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

        $.ajax({
            type: 'GET',
            url: usr.get('_url') + 'HelpDesk/damagetype',
            beforeSend: function(xhr){
                xhr.setRequestHeader('X_USERNAME', usr.get('username'));
                xhr.setRequestHeader('X_PASSWORD', usr.get('password'));
                xhr.setRequestHeader('X_CLIENTID', usr.get('client_id'));
            },          
            success: successCbWrapper,
            error: errorCbWrapper
        });
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

        $.ajax({
            type: 'GET',
            url: usr.get('_url') + 'HelpDesk/damageposition',
            beforeSend: function(xhr){
                xhr.setRequestHeader('X_USERNAME', usr.get('username'));
                xhr.setRequestHeader('X_PASSWORD', usr.get('password'));
                xhr.setRequestHeader('X_CLIENTID', usr.get('client_id'));
            },          
            success: successCbWrapper,
            error: errorCbWrapper
        });
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

        $.ajax({
            type: 'GET',
            url: usr.get('_url') + 'HelpDesk/drivercauseddamage',
            beforeSend: function(xhr){
                xhr.setRequestHeader('X_USERNAME', usr.get('username'));
                xhr.setRequestHeader('X_PASSWORD', usr.get('password'));
                xhr.setRequestHeader('X_CLIENTID', usr.get('client_id'));
            },          
            success: successCbWrapper,
            error: errorCbWrapper
        });
    },
});

/**
 * For node-unit test
 */
if (node_unit) {
    exports.Damage = Damage;
}