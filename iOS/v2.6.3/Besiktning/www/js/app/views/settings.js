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

        
        this.openBasicDialog = function(header, body){
        	$('.modal').modal('hide');
        	
        	$('#basicDialogButtonHeader').empty().html(header);
        	$('#basicDialogButtonBody p').empty().html(body);
        	
        	$('#basicDialogButton').modal('show');
        };
        
        this.openBasicDialogWithoutBtn = function(header, body){
        	$('.modal').modal('hide');
        	
        	$('#basicDialogHeader').empty().html(header);
        	$('#basicDialogBody p').empty().html(body);
        	
        	$('#basicDialog').modal('show');
        };

    },

    /**
     * Binds events to various elements of the page
     *   
     * @return {void} 
     */ 
          
    bindEventHandlers : function() {

        "use strict";

        var that = this;

        $('#showSurveyPageBtn').unbind('click').bind('click', function(){
        	
        	app.currentObj = {
	        	'settings_username' : $('#settings_username').val(),
	        	'settings_password' : $('#settings_password').val(),
	        	'settings_client_id' : $('#settings_client_id').val()
    	    };
        	
        	//alert("page 1");
        	$('#pages-tab a[href="#survey"]').click();
        });
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
  if($('#settings_client_id').val() != 'clab'){
   	that._wrapper.showAlert(that._language.translate("Please enter a valid client id") + ".", that._language.translate("Error"));
       return false;	
    	
    }            
                app.changeInPage = false;
                
                /**
                 * Storage place for the list of cache items which
                 * were cache and which weren't.
                 */

                var cacheSuccessList = {};
                var cacheErrorList = {};

                /**
                 * Log it
                 */

                that._lg.log('TRACE', '#settings_save', ' username: ' + $('#settings_username').val());
                that._lg.log('TRACE', '#settings_save', ' password: ' + $('#settings_password').val());
                that._lg.log('TRACE', '#settings_save', ' client_id: ' + $('#settings_client_id').val());

                /**
                 * Show popup right away
                 */

                $('#authDialogHeader').empty().html(app._lang.translate('Authenticating'));
               
            	$('#authDialogBody').empty().html(app._lang.translate('Please wait') + " ...");
            	
            	$('#authDialog').modal('show');
                //$('#a_dialog_authenticating').click();

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
                	//cacheSuccessList = cacheErrorList = {};
                    if (status.success === true) {
                        cacheSuccessList[status.name] = true;
                        var keys = Object.keys(cacheSuccessList);
                        $('#authDialogBody').empty().html(that._language.translate('Completed') + ' ' + keys.length  + ' ' + that._language.translate('of') + ' 7');
                    } else {
                        cacheErrorList[status.name] = false;
                    }

                    /**
                     * Check if all cache calls have completed
                     */

                    var skeys = Object.keys(cacheSuccessList);
                    var ekeys = Object.keys(cacheErrorList);
              //   alert(ekeys.length);alert(skeys.length);
                    if ((skeys.length + ekeys.length) === 7) {
                       // alert(ekeys.length);
                        if (ekeys.length === 0) { 
                        	
                        	app.refreshCache = false;
                        	 
                        	$('.modal').modal('hide');
                        	
                        	//$('#authDialogBody').empty();
                        	$('#authSuccessDialogHeader').empty().html(app._lang.translate('Success'));
                        	$('#authSuccessDialogBody').empty().html(app._lang.translate('Authenticated successfully and Cache built successfully') + '.');
                 // alert("last moment");      
                        	
                        	$('#authSuccessDialog').modal('show');
                        	$('#authDialogHeader').empty();
                        //	alert("going to page 1");
                        	

                        } else {
                        	
                        	that._usr.setAuthenticated(false);
                        	
                        	$('.modal').modal('hide');
                        	
                        	$('#errorDialogHeader').empty().html(app._lang.translate('Unable to build cache'));
                        	$('#errorDialogBody').empty().html(app._lang.translate('Please try again, If the problem persists please contact the Gizur Saas Account holders') + '.');
                        	
                        	$('#errorDialog').modal('show');
                        	
                        }
                 cacheSuccessList = cacheErrorList = {};
                    }
                  //  cacheSuccessList = cacheErrorList = {};
                });
                

                var success = function(data){
//alert("success");
                    data = undefined;

                    that._lg.log('TRACE', '#settings_save', ' successfully authenticated');

                    var tt = new TroubleTicket(that._usr, Config.log);
                    var dmg = new Damage(that._usr, Config.log);
                    var ast = new Asset(that._usr, Config.log);
                    var ac = new AssetCollection(that._usr, Config.log);

                    that._lg.log('TRACE', '#settings_save', ' starting to cache');

                    var successCb = function (data, name) {
                    //	alert("success cb");
                        that._usr.emit("cache complete", {success: true, name: name});
                    };

                    var errorCb = function (j, s, e, name) {
                    //	alert("error cb");
                        that._usr.emit("cache complete", {success: false, name: name});
                    };            

                    /**
                     * start caching picklists
                     */
                    
                    tt.getEnumPlace(successCb, errorCb);
                    tt.getEnumSealed(successCb, errorCb);

                    dmg.getEnumDamageType(successCb, errorCb);
                    dmg.getEnumDamagePosition(successCb, errorCb);
                    dmg.getEnumDriverCausedDamage(successCb, errorCb);

                    that._lg.log('TRACE', '#settings_save', ' type of ast ' + (typeof ast));

                    ast.getEnumTrailerType(successCb, errorCb);
                    ac.getAssets(successCb, errorCb);
//alert("success login click");
                    /**
                     * Show success message
                     */

                    $('#a_dialog_success_login').click();                        
                };

                var error = function( jqxhr, status, er ){
//alert("Error")
                    status = er = undefined;

                    that._lg.log('TRACE', '#settings_save', ' error start');

                    try {

                        that._lg.log('TRACE', ' jqxhr ' + jqxhr.responseText);
                        var data = JSON.parse(jqxhr.responseText);

                        that._wrapper.clearNavigatorHistory();
                         //alert(data.error.message);
                        if (data.error.message === 'Invalid Username and Password') {
                        	$('.modal').modal('hide');
                        	
                        	$('#errorDialogHeader').empty().html(app._lang.translate('Error'));
                        	$('#errorDialogBody').empty().html(app._lang.translate('Your username and password settings are invalid. Please enter valid settings and try again.'));
                        	
                        
                        	$('#errorDialog').modal('show');
                        } else {
                        	$('.modal').modal('hide');
                        	$('#errorDialogHeader').empty().html(app._lang.translate('Error'));
                        	$('#errorDialogBody').empty().html(app._lang.translate('Contact Gizur Saas Account holders, details are available under Contact tab') + '.');
                        	
                        	$('#errorDialog').modal('show');
                        }
                        cacheSuccessList = cacheErrorList = {};

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
                 * This caches both the username, password and 
                 * authenticated flag before and after authenticating
                 */
                //alert("at last");
                //$('#authDialogHeader').empty();
                that._usr.authenticate(success, error);

            } catch (err) {
                 
                that._lg.log('FATAL', '#settings_save', JSON.stringify(err));

            }            
        });

        $('#forgot_password').unbind('click').bind('click', function (){
            
            try {

            	var attr = $(this).attr('disabled');
        		
        		if(attr === true || attr === 'disabled')
        			return false;
        		
            	$('.modal').modal('hide');
                $('#dialog_resetpassword_confirm').modal('show');

            } catch (err) {

                that._lg.log('FATAL', '#forgot_password', JSON.stringify(err));

            }            
        });

        $('#dialog_resetpassword_confirm #resetpassword').unbind('click').bind('click', function ( e ){
            
            try {

                e.preventDefault();

                that._wrapper.clearNavigatorHistory();
                
                // Set Authenticated = false
                that._usr.setAuthenticated(false);

                that.openBasicDialogWithoutBtn(app._lang.translate("Processing"), app._lang.translate("Please wait") + " ...");
                
                var success = function( data ){
                	
                	$('#settings_password').val('');
                	
                	that.disableChangePasswordButton();
                	
                	app.currentObj = {
        	        	'settings_username' : $('#settings_username').val(),
        	        	'settings_password' : $('#settings_password').val(),
        	        	'settings_client_id' : $('#settings_client_id').val()
        	        };

                	that._lg.log('TRACE', '#dialog_resetpassword_confirm #resetpassword', ' password reset successfully ' + JSON.stringify(data));
                    
                    that._wrapper.clearNavigatorHistory();

                    that.openBasicDialog(app._lang.translate("Forget Password"), app._lang.translate("Password has been reset successfully. Please check your mail for the new password."))

                };

                var error = function( jqxhr, status, er ){
                	//alert("error");

                    //jqxhr = status = er = undefined;

                    that._lg.log('TRACE', '#dialog_resetpassword_confirm #resetpassword', ' error reset password ' + jqxhr.responseText);

                    that._wrapper.clearNavigatorHistory();
                    that.openBasicDialog(app._lang.translate("Forget Password"), app._lang.translate("Please provide a valid username and try again."))

                   // that.openBasicDialog(app._lang.translate("Forget Password"), app._lang.translate("Unable to reset password. Please try again, If the problem persists please contact the Gizur Saas Account holders."))

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
        	var attr = $(this).attr('disabled');
        		
        	if(attr === true || attr === 'disabled')
        		return false;

           $('#dialog_changepassword input').val('');
             
               $('#dialog_changepassword #message').html('').removeClass('alert');
                
                
                $('.modal').modal('hide');
                $('#dialog_changepassword').modal('show');
                

            } catch (err) {

                that._lg.log('FATAL', '#change_password', JSON.stringify(err));

            }

        });

        $('#dialog_changepassword input').unbind('keyup').bind('keyup', function(){
            if ($('#dialog_changepassword input').val() !== '') {
                $('#dialog_changepassword #message').html('').removeClass('alert');
            }            
        });

        $('#dialog_changepassword #change_cancel').unbind('click').bind('click', function(e){
        	//alert("vivek");
        	e.preventDefault();
            
           // var attr = $(this).attr('disabled');
    		
    		//if(attr === true || attr === 'disabled')
    		//	return false;
    		
    		$('.modal').modal('hide');
        });
        
        $('#dialog_changepassword #change').unbind('click').bind('click', function(e){
        	//alert("vivek");

            try {

                e.preventDefault();
                
                //var attr = $(this).attr('disabled');
        		
        		//if(attr === true || attr === 'disabled')
        		//	return false;
        		
        		//$(this).attr('disabled', 'disabled');
        		//$("#dialog_changepassword .dialog_changepassword_btn").attr('disabled', 'disabled');
//alert("vivek1");
                that._wrapper.clearNavigatorHistory();

                if (($('#dialog_changepassword input').val()).trim() === '') {
                
                    $('#dialog_changepassword #message').html(app._lang.translate('New Password cannot be blank') + ".").addClass('alert');
                    return false;
                }
              //  alert("test");
                that.openBasicDialogWithoutBtn(app._lang.translate("Processing"), app._lang.translate("Please wait") + " ...");

                var success = function( data ){
                //	alert("sucess");

                    that._lg.log('TRACE', '#dialog_changepassword #change', ' password changed successfully ' + JSON.stringify(data));

                    that._wrapper.clearNavigatorHistory();

                    app.currentObj = {
        	        	'settings_username' : $('#settings_username').val(),
        	        	'settings_password' : $('#dialog_changepassword #newpassword').val().trim(),
        	        	'settings_client_id' : $('#settings_client_id').val()
        	        };
                    
                    $('#settings_password').val($('#dialog_changepassword #newpassword').val().trim());
                    $('#dialog_changepassword #newpassword').val('');
                    
                    $("#dialog_changepassword .dialog_changepassword_btn").removeAttr('disabled');
                    
                    that.openBasicDialog(app._lang.translate("Success"), app._lang.translate("Password Changed successfully") + ".");

                };

                var error = function( jqxhr, status, er ){

                    jqxhr = status = er = undefined;

                    that._wrapper.clearNavigatorHistory();

                    $('#dialog_changepassword #newpassword').val('');
                    
                    $("#dialog_changepassword .dialog_changepassword_btn").removeAttr('disabled');
                    
                    that.openBasicDialog(app._lang.translate("Error"), app._lang.translate("Unable to change password. Please try again, If the problem persists please contact the Gizur Saas Account holders."));                    

                };
                
                that._usr.changePassword($('#dialog_changepassword #newpassword').val().trim(), success, error);

            } catch (err) {

                that._lg.log('FATAL', '#dialog_changepassword #change', JSON.stringify(err));

            }    

        });        
  
        $('#settings_username').unbind('keyup').bind('keyup', function(){

            app._lg.log('DEBUG', '#settings_username', "$('#settings #settings_username').bind('change')");

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
//alert("disable");
        "use strict";
      //  $('#settings #change_password').unbind('click');
        $('#settings #change_password').attr('disabled', 'disabled');
        $('#settings #change_password').removeClass('btn-primary');

    },

    /**
     * Enable Change Password Button
     *   
     * @return {void} 
     */

    enableChangePasswordButton : function() {
//alert("enable");
        "use strict";

        $('#settings #change_password').removeAttr('disabled');
        $('#settings #change_password').addClass('btn-primary');

    }, 

    /**
     * Disable Change Password Button
     *   
     * @return {void} 
     */

    disableForgotPasswordButton : function() {

        "use strict";

        $('#settings #forgot_password').attr('disabled', 'disabled');
        $('#settings #forgot_password').removeClass('btn-primary');

    },

    /**
     * Enable Change Password Button
     *   
     * @return {void} 
     */

    enableForgotPasswordButton : function() {

        "use strict";

        $('#settings #forgot_password').removeAttr('disabled');
        $('#settings #forgot_password').addClass('btn-primary');

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
        	//alert("authenticated");
            this.enableChangePasswordButton();
        } else {
        //	alert("notauthenticated");
            this.disableChangePasswordButton();
        }

        if (app.changeInPage === false) {
        	$('#settings_username').val(this._usr.get('username'));
	        $('#settings_password').val(this._usr.get('password'));
	        $('#settings_client_id').val(this._req.getClientId());

	        app.currentObj = {
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
        $("#settings_password").attr('Placeholder',app._lang.translate('Password'));
    }
});