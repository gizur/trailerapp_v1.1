/* jshint undef: true, unused: true, strict: true, vars: true */

/**
 * Model Class for User
 * 
 * @fileoverview Class definition user. This class need to be defined as singleton
 *               but I have not been able to figure of how to implement singleton
 *               pattern in stapes.
 * @author anshuk.kumar@essindia.co.in (Anshuk Kumar)
 * @license Commercial - Copyright 2013 Gizur AB
 * @see http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml
 */

var User = Stapes.subclass({

    /**
     * @constructor
     *
     * @param {request} aReq request class object which the user with use to send
     *                       requests to the API.
     */

    constructor : function(aReq) {

        /**
         * Set pseudo private vars
         * please dont change this using <objname>._privatevarname
         * method from outside of here.
         * Arggghh Stapes!!!!
         */

        this.extend({
            _lg : new Logger('FATAL','js/models/user'),
            _req : aReq,
            _storage : window.localStorage
        });

        /**
         * Fetch the current user if they are available in
         * cache. Else init var as blank.
         */

        var attrs = this._storage.getItem('user');

        this._lg.log('DEBUG', 'stored attrs: ' + attrs);

        if (attrs) {

            attrs = JSON.parse(attrs);

            this.set({
                'id' : '',
                'username' : attrs.username,
                'password' : attrs.password,
                'authenticated' : attrs.authenticated
            }); 
        } else {
            this.set({
                'id' : '',
                'username' : '',
                'password' : '',
                'authenticated' : ''
            }); 
        }

        this._lg.log('DEBUG', 'effective attrs: ' + JSON.stringify(this.getAll()));
    },

    /**
     * Send the request
     *
     * @param {string}   method    HTTP method to send the request with
     * @param {string}   url       the gizur api API path
     * @param {string}   body      request body
     * @param {function} successCb success callback function
     * @param {function} errorCb   error callback function
     * @param {array}    files     array of files to be sent 
     * @param {boolean}  silent    checks if internet connection error message has to be shown or not
     */ 

    send : function(method, url, body, successCb, errorCb, files, silent) {
        var that = this;

        var headers = {
            'X_USERNAME': this.get('username'),
            'X_PASSWORD': this.get('password')
        };

        var successCbWrapper = function(data) {
            if (typeof successCb == 'function') {
                successCb(data);
            }
        };

        var errorCbWrapper = function(jqxhr, status, er) {

            try {

                try {
                    var data = JSON.parse(jqxhr.responseText);
                } catch (err) {
                    data = null;
                }

                if (data != null &&
                    typeof data.error !== 'undefined' &&
                    typeof data.error.message !== 'undefined' &&
                    data.error.message == 'Invalid Username and Password') {

                    if (typeof navigator.app !== 'undefined')
                        navigator.app.clearHistory();

                    /**
                     * Set authenticated flag off
                     */

                    that.setAuthenticated(false);

                    $('#a_dialog_error_invalidcredentials').click();
                    return;
                }

            } catch (err) {
                that._lg.log('FATAL', JSON.stringify(err))
            }

            if (typeof errorCb == 'function') {
                errorCb(jqxhr, status, er);
            }
        };

        this._req.send(method, url, headers, body, successCbWrapper, errorCbWrapper, files, silent);
    },

    setAuthenticated :  function (status) {
        this.set('authenticated', status);
        this._storage.setItem('user', JSON.stringify(this.getAll()));             
    },

    /**
     * Authenticates the current user
     *
     * @param {function} success success callback function
     * @param {function} error   error callback function     
     */

    authenticate : function(success, error) {
        var that = this;

        var successWrapper = function(data){

            that._lg.log('TRACE', 'authenticate#successWrapper# enter');                                

            /**
             * Set flag authenticated to true
             */

            that.set('authenticated', true);

            /**
             * Saving user attr to cache
             */

            that._storage.setItem('user', JSON.stringify(that.getAll()));  

            if (typeof data.contactinfo != 'undefined') {
                that._lg.log('DEBUG', 'authenticate#successWrapper#attributes saved to cache data.contactinfo : ' + data.contactinfo);                
                window.localStorage.setItem('contact', data.contactinfo);
            }          

            that._lg.log('DEBUG', 'authenticate#successWrapper#attributes saved to cache: ' + JSON.stringify(that.getAll()));                

            /**
             * Execute caller's callback
             */

            success(data);

            that._lg.log('TRACE', 'authenticate#successWrapper# exit');
        };

        var errorWrapper = function(jqxhr, status, er){

            that._lg.log('TRACE', 'authenticate#errorWrapper# enter');                                

            /**
             * Set flag authenticated to true
             */

            that.set('authenticated', false);
            window.localStorage.removeItem('contact');

            /**
             * Saving user attr to cache
             */

            that._storage.setItem('user', JSON.stringify(that.getAll()));            

            that._lg.log('DEBUG', 'authenticate#errorWrapper#attributes saved to cache: ' + JSON.stringify(that.getAll()));                

            /**
             * execute caller's callback
             */

            error(jqxhr, status, er);

            that._lg.log('TRACE', 'authenticate#errorWrapper# exit');
        };            

        /**
         * Saving user attr to cache
         */

        this._storage.setItem('user', JSON.stringify(that.getAll()));            

        this._lg.log('DEBUG', 'authenticate#attributes saved to cache: ' + JSON.stringify(this.getAll()));

        /**
         * Send the request to authenticate
         */

        this._req.send(
            'POST',
            'Authenticate/login',
            {
                'X_USERNAME': this.get('username'),
                'X_PASSWORD': this.get('password')
            },
            '',
            successWrapper,
            errorWrapper
        );  
    },

    /**
     * Reset the password
     */

    resetPassword : function(success, error) {
        var that = this;

        var successWrapper = function(data){

            that._lg.log('TRACE', 'reset#successWrapper# enter');

            that.set('password', '');
            that._storage.setItem('user', JSON.stringify(that.getAll())); 

            if (typeof success == 'function')
                success(data);

            that._lg.log('TRACE', 'reset#successWrapper# exit');
        };

        var errorWrapper = function(jqxhr, status, er){

            that._lg.log('TRACE', 'reset#errorWrapper# enter');                                

            if (typeof success == 'function')
                error(jqxhr, status, er);

            that._lg.log('TRACE', 'reset#errorWrapper# exit');
        };                     

        that._lg.log('TRACE', 'resetPassword send call');

        /**
         * Send the request to reset
         */

        this._req.send(
            'PUT',
            'Authenticate/reset',
            {
                'X_USERNAME': this.get('username')
            },
            '',
            successWrapper,
            errorWrapper
        );
    },

    /**
     * Change the password
     *
     * @param {string}   newpassword  password to be changed to  
     * @param {function} success      success callback function
     * @param {function} error        error callback function        
     */       

    changePassword : function( newpassword, success, error ) {

        var that = this;

        that._lg.log('DEBUG', 'got new password ' + newpassword);


        var successWrapper = function( data ){

            that._lg.log('TRACE', 'changepassword#successWrapper# enter');

            that._lg.log('DEBUG', 'changepassword#successWrapper# new password ' + newpassword);

            that.set('password', newpassword);
            that._storage.setItem('user', JSON.stringify(that.getAll()));  

            if (typeof success == 'function')
                success(data);

            that._lg.log('TRACE', 'changepassword#successWrapper# exit');
        };

        var errorWrapper = function( jqxhr, status, er ){

            that._lg.log('TRACE', 'changepassword#errorWrapper# enter');                                

            if (typeof success == 'function')
                error(jqxhr, status, er);

            that._lg.log('TRACE', 'changepassword#errorWrapper# exit');
        };                     

        that._lg.log('TRACE', 'changepassword send call');

        /**
         * Send the request to reset
         */

        this._req.send(
            'PUT',
            'Authenticate/changepw',
            {
                'X_USERNAME' : this.get('username'),
                'X_PASSWORD' : this.get('password')
            },
            'newpassword=' + newpassword,
            successWrapper,
            errorWrapper
        );
    }    
});

/**
 * For node-unit test
 */

if (typeof node_unit != 'undefined') {
    exports.User = User;
}