/* jshint undef: true, unused: true, strict: true, vars: true */

/**
 * Model Class for Documents ie pictures
 * 
 * @fileoverview Class definition Documents
 * @author anshuk.kumar@essindia.co.in (Anshuk Kumar)
 * @license Commercial - Copyright 2013 Gizur AB
 * @see http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml
 */
var User = Stapes.subclass({

    /**
     * @constructor
     */ 
    constructor : function(aReq) {

        this.extend({
            _lg : new Logger('FATAL','js/models/user'),
            _req : aReq,
            _storage : window.localStorage
        });

        var attrs = this._storage.getItem('user');

        this._lg.log('DEBUG', 'stored attrs: ' + attrs);

        if (attrs) {

            attrs = JSON.parse(attrs);

            this.set({
                'id' : '',
                'username' : attrs.username,
                'password' : attrs.password,
                'authenticated' : attrs.authenticated,
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
     *  Send the request
     */ 
    send : function(method, url, body, successCb, errorCb, files) {
        var headers = {
            'X_USERNAME': this.get('username'),
            'X_PASSWORD': this.get('password')
        };

        this._req.send(method, url, headers, body, successCb, errorCb, files);
    },

    setAuthenticated :  function (status) {
        this.set('authenticated', status);
        this._storage.setItem('user', JSON.stringify(that.getAll()));             
    },

    /**
     * Authenticates the current user
     */       
    authenticate : function(success, error) {
        var that = this;

        var successWrapper = function(data){

            that._lg.log('TRACE', 'authenticate#successWrapper# enter');                                

            // Set flag authenticated to true
            that.set('authenticated', true);

            //Saving user attr to cache
            that._storage.setItem('user', JSON.stringify(that.getAll()));            

            that._lg.log('DEBUG', 'authenticate#successWrapper#attributes saved to cache: ' + JSON.stringify(that.getAll()));                

            //execute caller's callback
            success(data);

            that._lg.log('TRACE', 'authenticate#successWrapper# exit');
        };

        var errorWrapper = function(jqxhr, status, er){

            that._lg.log('TRACE', 'authenticate#errorWrapper# enter');                                

            // Set flag authenticated to true
            that.set('authenticated', false);

            //Saving user attr to cache
            that._storage.setItem('user', JSON.stringify(that.getAll()));            

            that._lg.log('DEBUG', 'authenticate#errorWrapper#attributes saved to cache: ' + JSON.stringify(that.getAll()));                

            //execute caller's callback
            error(jqxhr, status, er);

            that._lg.log('TRACE', 'authenticate#errorWrapper# exit');
        };            

        //Saving user attr to cache
        this._storage.setItem('user', JSON.stringify(that.getAll()));            

        this._lg.log('DEBUG', 'authenticate#attributes saved to cache: ' + JSON.stringify(this.getAll()));

        //Send the request to authenticate
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
     * Changes the password
     */       
    setNewPassword : function() {

    }
});

/**
 * For node-unit test
 */
if (typeof node_unit != 'undefined') {
    exports.User = User;
}