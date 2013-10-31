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

    constructor : function(aUsr, aLog, aLanguage, aReq, aWrapper) {

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
            _req : aReq,
            _wrapper: aWrapper
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

                	that._wrapper.showAlert(that._language.translate("All fields (Email, Password and Gizur Saas ClientID) must be filled") + ".", that._language.translate("Error"));
                    return false;

                }
                
                App.changeInPage = false;
                
                /**
                 * Storage place for the list of cache items which
                 * were cache and which weren't.
                 */

                var cacheSuccessList = [];
                var cacheErrorList = [];

                /**
                 * Log it
                 */

                that._lg.log('TRACE', '#settings_save', ' username: ' + $('#settings_username').val());
                that._lg.log('TRACE', '#settings_save', ' password: ' + $('#settings_password').val());
                that._lg.log('TRACE', '#settings_save', ' client_id: ' + $('#settings_client_id').val());

                /**
                 * Show popup right away
                 */

                $('#a_dialog_authenticating').click();

                /**
                 * Clear back button history so that if the user clicks on 
                 * device's back button the app exits
                 */

                that._wrapper.clearNavigatorHistory();

                /**
                 * Clear All cache
                 * except language and trace id
                 */

                var temp_trace_id = window.localStorage.getItem('trace_id');
                var temp_language = window.localStorage.getItem('language');
                
                //window.localStorage.clear();
                
                // Set Authenticated = false
                that._usr.setAuthenticated(false);
                
                window.localStorage.setItem('trace_id', temp_trace_id);
                window.localStorage.setItem('language', temp_language);

                that._lg.log('DEBUG', '#settings_save', ' language preserved ' + JSON.stringify(temp_language));
 
                /**
                 * Create event handler for cache complete
                 */

                that._usr.on('cache complete', function(status){
                    if (status.success) {
                        cacheSuccessList.push(status.name);
                        $('#dialog_success_login div[data-role=content]').children().eq(2).html(that._language.translate('Completed') + ' ' + cacheSuccessList.length  + ' ' + that._language.translate('of') + ' 7');
                        $('#dialog_success_login').page();
                    } else {
                        cacheErrorList.push(status.name);
                    }

                    /**
                     * Check if all cache calls have completed
                     */

                    if ((cacheSuccessList.length + cacheErrorList.length) === 7) {

                        if (cacheErrorList.length === 0) { 
                        	
                        	App.refreshCache = false;
                            
                        	$('#a_dialog_success_cache').click();
                            that._wrapper.clearNavigatorHistory();

                        } else {
                        	
                        	that._usr.setAuthenticated(false);
                            $('#a_dialog_error_cache').click();

                            that._wrapper.clearNavigatorHistory();
                        }
                        cacheSuccessList = cacheErrorList = [];
                    }
                });
                

                var success = function(data){

                    data = undefined;

                    that._lg.log('TRACE', '#settings_save', ' successfully authenticated');

                    var tt = new TroubleTicket(that._usr, Config.log);
                    var dmg = new Damage(that._usr, Config.log);
                    var ast = new Asset(that._usr, Config.log);
                    var ac = new AssetCollection(that._usr, Config.log);

                    that._lg.log('TRACE', '#settings_save', ' starting to cache');

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

                    that._lg.log('TRACE', '#settings_save', ' type of ast ' + (typeof ast));

                    ast.getEnumTrailerType(successCb, errorCb);
                    ac.getAssets(successCb, errorCb);

                    /**
                     * Show success message
                     */

                    $('#a_dialog_success_login').click();                        
                };

                var error = function( jqxhr, status, er ){

                    status = er = undefined;

                    that._lg.log('TRACE', '#settings_save', ' error start');

                    try {

                        that._lg.log('TRACE', ' jqxhr ' + jqxhr.responseText);
                        var data = JSON.parse(jqxhr.responseText);

                        that._wrapper.clearNavigatorHistory();

                        if (data.error.message === 'Invalid Username and Password') {
                            $('#a_dialog_error_invalidcredentials').click();
                        } else {
                            $('#a_dialog_error_general').click();
                        }

                    } catch (err) {

                        that._lg.log('FATAL', '#settings_save', JSON.stringify(err));

                    }

                    that._lg.log('TRACE', '#settings_save', ' error end');
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

                that._lg.log('FATAL', '#settings_save', JSON.stringify(err));

            }            
        });

        $('#forgot_password').unbind('click').bind('click', function (){
            
            try {

                $('#a_dialog_resetpassword_confirm').click();

            } catch (err) {

                that._lg.log('FATAL', '#forgot_password', JSON.stringify(err));

            }            
        });

        $('#dialog_resetpassword_confirm #resetpassword').unbind('click').bind('click', function ( e ){
            
            try {

                e.preventDefault();

                that._wrapper.clearNavigatorHistory();

                var success = function( data ){

                	// Set Authenticated = false
                    that._usr.setAuthenticated(false);
                    
                    that._lg.log('TRACE', '#dialog_resetpassword_confirm #resetpassword', ' password reset successfully ' + JSON.stringify(data));
                    
                    that._wrapper.clearNavigatorHistory();

                    $('#a_dialog_resetpassword_success').click();

                };

                var error = function( jqxhr, status, er ){

                    jqxhr = status = er = undefined;

                    that._lg.log('TRACE', '#dialog_resetpassword_confirm #resetpassword', ' error reset password ' + jqxhr.responseText);

                    that._wrapper.clearNavigatorHistory();

                    $('#a_dialog_resetpassword_error').click();                    

                };                

                that._usr.resetPassword(success, error);

            } catch (err) {

                that._lg.log('FATAL', '#dialog_resetpassword_confirm #resetpassword', JSON.stringify(err));

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

                that._lg.log('FATAL', '#change_password', JSON.stringify(err));

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

                that._wrapper.clearNavigatorHistory();

                if ($('#dialog_changepassword input').val() === '') {
                    $('#dialog_changepassword #message').html('New Password cannot be blank');
                    return false;
                }


                var success = function( data ){

                    that._lg.log('TRACE', '#dialog_changepassword #change', ' password changed successfully ' + JSON.stringify(data));

                    that._wrapper.clearNavigatorHistory();

                    $('#dialog_changepassword #newpassword').val('');
                    $('#a_dialog_changepassword_success').click();

                };

                var error = function( jqxhr, status, er ){

                    jqxhr = status = er = undefined;

                    that._lg.log('TRACE', '#dialog_changepassword #change', ' error changing password ' + jqxhr.responseText);

                    that._wrapper.clearNavigatorHistory();

                    $('#dialog_changepassword #newpassword').val('');
                    $('#a_dialog_changepassword_error').click();                    

                };
                
                that._usr.changePassword($('#dialog_changepassword #newpassword').val(), success, error);

            } catch (err) {

                that._lg.log('FATAL', '#dialog_changepassword #change', JSON.stringify(err));

            }    

        });        
  
        $('#settings_username').unbind('keyup').bind('keyup', function(){

            App._lg.log('DEBUG', '#settings_username', "$('#settings #settings_username').bind('change')");

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

        this._wrapper.clearNavigatorCache();
        this._wrapper.clearNavigatorHistory();
        
        if (this._usr.get('authenticated')) {
            this.enableChangePasswordButton();
        } else {
            this.disableChangePasswordButton();
        }
        
        //alert(App.changeInPage);

        if (App.changeInPage === false) {
	        $('#settings_username').val(this._usr.get('username'));
	        $('#settings_password').val(this._usr.get('password'));
	        $('#settings_client_id').val(this._req.getClientId());

	        App.currentObj = {
	        	'settings_username' : $('#settings_username').val(),
	        	'settings_password' : $('#settings_password').val(),
	        	'settings_client_id' : $('#settings_client_id').val()
	        };
        }
        
        if ($('#settings_username').val() === '') {
            this.disableForgotPasswordButton();
        } else {
            this.enableForgotPasswordButton();
        }

    }
});