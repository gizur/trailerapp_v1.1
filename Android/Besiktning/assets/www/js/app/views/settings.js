/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, 
         bitwise:true, strict:true, undef:false, unused:true, 
         curly:true, browser:true, indent:4, maxerr:50 */

/*global Stapes:true, window:true*/
/*exported ScreenSettingsView*/

/**
 * View Class for screen Settings
 * 
 * @fileoverview Class definition of a View of screen Settings
 * @author anshuk.kumar@essindia.co.in (Anshuk Kumar)
 * @license Commercial - Copyright 2013 Gizur AB
 * @see http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml
 */

var ScreenSettingsView = Stapes.subclass({

    /**
     * @constructor
     *
     * @param {user}     aUsr       the user who is making calls to server
     * @param {logger}   aLog       object containing the log configuration
     * @param {language} aLanguage  the language object
     * @param {request}  aReq       the request object
     */

    constructor : function(aUsr, aLog, aLanguage, aReq) {

        "use strict";

        /**
         * Set pseudo private vars
         * please dont change this using <objname>._privatevarname
         * method from outside of here.
         * Arggghh Stapes!!!!
         */

        this.extend({
            _lg : aLog,
            _language : aLanguage,
            _usr : aUsr,
            _req : aReq
        });

    },

    /**
     * Binds events to various elements of the page
     *   
     * @return {void} 
     */ 
          
    bindEventHandlers : function() {

        "use strict";

        var that = this;

        /**
         * Saving the username, password and client id 
         * and authenticating it
         */

        $('#settings_save').unbind('click').bind('click', function() {
            try {

                /**
                 * Some basic validation
                 */

                if ($('#settings_username').val() === '' ||
                    $('#settings_password').val() === '' ||
                    $('#settings_client_id').val() === '') {

                    $('#a_dialog_success_login').click();                    

                }
                
                /**
                 * Storage place for the list of cache items which
                 * were cache and which werent.
                 */

                var cacheSuccessList = [];
                var cacheErrorList = [];

                /**
                 * Log it
                 */

                that._lg.log('TRACE', ' username: ' + $('#settings_username').val());
                that._lg.log('TRACE', ' password: ' + $('#settings_password').val());
                that._lg.log('TRACE', ' client_id: ' + $('#settings_client_id').val());

                /**
                 * Show popup right away
                 */

                $('#a_dialog_authenticating').click();

                /**
                 * Clear back button history so that if the user clicks on 
                 * device's back button the app exits
                 */

                if (typeof navigator.app !== 'undefined') {
                    navigator.app.clearHistory();
                }

                /**
                 * Clear All cache
                 * except language and trace id
                 */

                var temp_trace_id = window.localStorage.getItem('trace_id');
                var temp_language = window.localStorage.getItem('language');
                window.localStorage.clear();
                window.localStorage.setItem('trace_id', temp_trace_id);
                window.localStorage.setItem('language', temp_language);

                that._lg.log('DEBUG', ' language preserved ' + JSON.stringify(temp_language));
 
                /**
                 * Create event handler for cache complete
                 */

                that._usr.on('cache complete', function(status){
                    if (status.success) {
                        cacheSuccessList.push(status.name);
                        $('#dialog_success_login div[data-role=content]').children().eq(2).html(that._language.translate('Completed') + ' ' + cacheSuccessList.length  + ' ' + that._language.translate('of') + ' 7');                                          
                    } else {
                        cacheErrorList.push(status.name);
                    }

                    /**
                     * Check if all cache calls have completed
                     */

                    if ((cacheSuccessList.length + cacheErrorList.length) === 7) {

                        if (cacheErrorList.length === 0) { 
                            $('#a_dialog_success_cache').click();

                            if (typeof navigator.app !== 'undefined') {
                                navigator.app.clearHistory();
                            }

                        } else {
                            that._usr.setAuthenticated(false);
                            $('#a_dialog_error_cache').click();

                            if (typeof navigator.app !== 'undefined') {
                                navigator.app.clearHistory();          
                            }        
                        }
                        cacheSuccessList = cacheErrorList = [];
                    }
                });
                

                var success = function(data){

                    data = undefined;

                    that._lg.log('TRACE', ' successfully authenticated');

                    var tt = new TroubleTicket(that._usr, Config.log);
                    var dmg = new Damage(that._usr, Config.log);
                    var ast = new Asset(that._usr, Config.log);
                    var ac = new AssetCollection(that._usr, Config.log);

                    that._lg.log('TRACE', ' starting to cache');

                    var successCb = function (data, name) {
                        that._usr.emit("cache complete", {success: true, name: name});
                    };

                    var errorCb = function (j, s, e, name) {
                        that._usr.emit("cache complete", {success: false, name: name});
                    };            

                    /**
                     * start caching picklists
                     */
                    $('#dialog_success_login div[data-role=content]').children().eq(2).html(that._language.translate('Completed') + ' 0 ' + that._language.translate('of') + ' 7');
                    //cacheSuccessList = cacheErrorList = [];
                    tt.getEnumPlace(successCb, errorCb);
                    tt.getEnumSealed(successCb, errorCb);

                    dmg.getEnumDamageType(successCb, errorCb);
                    dmg.getEnumDamagePosition(successCb, errorCb);
                    dmg.getEnumDriverCausedDamage(successCb, errorCb);

                    that._lg.log('TRACE', ' type of ast ' + (typeof ast));

                    ast.getEnumTrailerType(successCb, errorCb);
                    ac.getAssets(successCb, errorCb);

                    /**
                     * Show success message
                     */

                    $('#a_dialog_success_login').click();                        
                };

                var error = function( jqxhr, status, er ){

                    status = er = undefined;

                    that._lg.log('TRACE', ' error start');

                    try {

                        that._lg.log('TRACE', ' jqxhr ' + jqxhr.responseText);
                        var data = JSON.parse(jqxhr.responseText);

                        if (typeof navigator.app !== 'undefined') {                  
                            navigator.app.clearHistory();
                        }

                        if (data.error.message === 'Invalid Username and Password') {
                            $('#a_dialog_error_invalidcredentials').click();
                        } else {
                            $('#a_dialog_error_general').click();
                        }

                    } catch (err) {

                        that._lg.log('FATAL', JSON.stringify(err));

                    }

                    that._lg.log('TRACE', ' error end');
                };

                /**
                 * Saving the client id to cache
                 */

                that._req.setClientId($('#settings_client_id').val());

                /**
                 * Seting username and password for authentication
                 */

                that._usr.set('username', $('#settings_username').val());
                that._usr.set('password', $('#settings_password').val());

                /**
                 * Set return point if no internet connection is found
                 */

                $('#dialog_nointernet a[data-role=button]').attr('href', '#settings');                

                /**
                 * This caches both the username, password and 
                 * authenticated flag before and after authenticating
                 */

                that._usr.authenticate(success, error);

            } catch (err) {

                that._lg.log('FATAL', JSON.stringify(err));

            }            
        });

        $('#forgot_password').unbind('click').bind('click', function (){
            
            try {

                $('#a_dialog_resetpassword_confirm').click();

            } catch (err) {

                that._lg.log('FATAL', JSON.stringify(err));

            }            
        });

        $('#dialog_resetpassword_confirm #resetpassword').unbind('click').bind('click', function ( e ){
            
            try {

                e.preventDefault();

                if (typeof navigator.app !== 'undefined') {
                    navigator.app.clearHistory();
                }

                var success = function( data ){

                    that._lg.log('TRACE', ' password reset successfully ' + JSON.stringify(data));
                    
                    if (typeof navigator.app !== 'undefined') {
                        navigator.app.clearHistory();
                    }

                    $('#a_dialog_resetpassword_success').click();

                };

                var error = function( jqxhr, status, er ){

                    jqxhr = status = er = undefined;

                    that._lg.log('TRACE', ' error reset password ' + jqxhr.responseText);

                    if (typeof navigator.app !== 'undefined') {
                        navigator.app.clearHistory();
                    }

                    $('#a_dialog_resetpassword_error').click();                    

                };                

                that._usr.resetPassword(success, error);

            } catch (err) {

                that._lg.log('FATAL', JSON.stringify(err));

            }            
        });        

        /**
         * Change password call
         */

        $('#change_password').unbind('click').bind( 'click', function () {

            try {

                $('#dialog_changepassword input').val('');
                $('#dialog_changepassword #message').html('');
                $('#a_dialog_changepassword').click();

            } catch (err) {

                that._lg.log('FATAL', JSON.stringify(err));

            }

        });

        $('#dialog_changepassword input').unbind('keyup').bind('keyup', function(){
            if ($('#dialog_changepassword input').val() !== '') {
                $('#dialog_changepassword #message').html('');
            }            
        });

        $('#dialog_changepassword #change').unbind('click').bind('click', function(e){

            try {

                e.preventDefault();

                if (typeof navigator.app !== 'undefined') {
                    navigator.app.clearHistory();
                }

                if ($('#dialog_changepassword input').val() === '') {
                    $('#dialog_changepassword #message').html('New Password cannot be blank');
                    return false;
                }


                var success = function( data ){

                    that._lg.log('TRACE', ' password changed successfully ' + JSON.stringify(data));

                    if (typeof navigator.app !== 'undefined') {
                        navigator.app.clearHistory();
                    }

                    $('#dialog_changepassword #newpassword').val('');
                    $('#a_dialog_changepassword_success').click();

                };

                var error = function( jqxhr, status, er ){

                    jqxhr = status = er = undefined;

                    that._lg.log('TRACE', ' error changing password ' + jqxhr.responseText);

                    if (typeof navigator.app !== 'undefined') {
                        navigator.app.clearHistory();
                    }

                    $('#dialog_changepassword #newpassword').val('');
                    $('#a_dialog_changepassword_error').click();                    

                };

                usr.changePassword($('#dialog_changepassword #newpassword').val(), success, error);

            } catch (err) {

                that._lg.log('FATAL', JSON.stringify(err));

            }    

        });        
  
        $('#settings_username').unbind('keyup').bind('keyup', function(){

            that._lg.log('DEBUG', "$('#settings #settings_username').bind('change')");

            if ($(this).val() === '') {
                that.disableForgotPasswordButton();
            } else {
                that.enableForgotPasswordButton();
            }
        });

    },

    /**
     * Disable Change Password Button
     *   
     * @return {void} 
     */

    disableChangePasswordButton : function() {

        "use strict";

        $('#settings #change_password').data('disabled', true);
        $('#settings #change_password').addClass('ui-disabled');

    },

    /**
     * Enable Change Password Button
     *   
     * @return {void} 
     */

    enableChangePasswordButton : function() {

        "use strict";

        $('#settings #change_password').data('disabled', false);
        $('#settings #change_password').removeClass('ui-disabled');

    }, 

    /**
     * Disable Change Password Button
     *   
     * @return {void} 
     */

    disableForgotPasswordButton : function() {

        "use strict";

        $('#settings #forgot_password').data('disabled', true);
        $('#settings #forgot_password').addClass('ui-disabled');

    },

    /**
     * Enable Change Password Button
     *   
     * @return {void} 
     */

    enableForgotPasswordButton : function() {

        "use strict";

        $('#settings #forgot_password').data('disabled', false);
        $('#settings #forgot_password').removeClass('ui-disabled');

    },     

    /**
     * Render page
     *   
     * @return {void} 
     */ 

    render : function() {

        "use strict";

        if (this._usr.get('authenticated')) {
            this.enableChangePasswordButton();
        } else {
            this.disableChangePasswordButton();
        }

        $('#settings_username').val(this._usr.get('username'));
        $('#settings_password').val(this._usr.get('password'));
        $('#settings_client_id').val(this._req.getClientId());

        if ($('#settings_username').val() === '') {
            this.disableForgotPasswordButton();
        } else {
            this.enableForgotPasswordButton();
        }

    }
});