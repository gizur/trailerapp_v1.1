/* jshint undef: true, unused: true, strict: true, vars: true */

/**
 * Model Class for Documents ie pictures
 * 
 * @fileoverview Class definition Documents
 * @author anshuk.kumar@essindia.co.in (Anshuk Kumar)
 * @license Commercial - Copyright 2013 Gizur AB
 * @see http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml
 */
var User = (function(){

    /**
     * Private Variables
     */
    var req; //request object
    var storage;  //cache object
    var lg_user; //Logger object

    var User = Stapes.subclass({

        /**
         * @constructor
         */ 
        constructor : function(aReq) {

            lg_user = new Logger('DEBUG','js/models/user'); 

            req = aReq;

            storage = window.localStorage;

            var attrs = storage.getItem('user');

            lg_user.log('DEBUG', 'stored attrs: ' + attrs);

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
                    'authenticated' : '',
                }); 
            }

            lg_user.log('DEBUG', 'effective attrs: ' + JSON.stringify(this.getAll()));
        },

        /**
         *  Send the request
         */ 
        send : function(method, url, headers, body, successCb, errorCb) {
            req.send(method, url, headers, body, successCb, errorCb);
        },

        /**
         * Authenticates the current user
         */       
        authenticate : function(success, error) {
            var that = this;

            var successWrapper = function(data){

                lg_user.log('TRACE', 'authenticate#successWrapper# enter');                                

                // Set flag authenticated to true
                that.set('authenticated', true);

                //Saving user attr to cache
                storage.setItem('user', JSON.stringify(that.getAll()));            

                lg_user.log('DEBUG', 'authenticate#successWrapper#attributes saved to cache: ' + JSON.stringify(that.getAll()));                

                //execute caller's callback
                success(data);

                lg_user.log('TRACE', 'authenticate#successWrapper# exit');
            };

            var errorWrapper = function(jqxhr, status, er){

                lg_user.log('TRACE', 'authenticate#errorWrapper# enter');                                

                // Set flag authenticated to true
                that.set('authenticated', false);

                //Saving user attr to cache
                storage.setItem('user', JSON.stringify(that.getAll()));            

                lg_user.log('DEBUG', 'authenticate#errorWrapper#attributes saved to cache: ' + JSON.stringify(that.getAll()));                

                //execute caller's callback
                error(jqxhr, status, er);

                lg_user.log('TRACE', 'authenticate#errorWrapper# exit');
            };            

            //Saving user attr to cache
            storage.setItem('user', JSON.stringify(that.getAll()));            

            lg_user.log('DEBUG', 'authenticate#attributes saved to cache: ' + JSON.stringify(this.getAll()));

            //Send the request to authenticate
            req.send(
                'POST',
                'Authenticate/login',
                {
                    'X_USERNAME': that.get('username'),
                    'X_PASSWORD': that.get('password')
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

        },
    });

return User;

})();

/**
 * For node-unit test
 */
if (node_unit) {
    exports.User = User;
}