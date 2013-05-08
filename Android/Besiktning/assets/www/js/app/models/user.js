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
    constructor : function() {
        this.set({
            'id' : '',
            'email' : '',
            'password' : '',
            'client_id' : 'clab',
            'authenticated' : false,
            '_url' : 'https://c2.gizur.com/api/',//http://freegeoip.net/json/115.184.41.74',
        });
    },

    /**
     * Authenticates the current user
     */       
    authenticate : function(success, error) {
        var that = this;

        $.ajax({
            type: 'POST',
            url: this.get('_url') + 'Authenticate/login',
            beforeSend: function(xhr){
                xhr.setRequestHeader('X_USERNAME', that.get('username'));
                xhr.setRequestHeader('X_PASSWORD', that.get('password'));
                xhr.setRequestHeader('X_CLIENTID', that.get('client_id'));
            },          
            success: success,
            error: error
        });  
    },

    /**
     * Changes the password
     */       
    setNewPassword : function() {

    },
});

/**
 * For node-unit test
 */
if (node_unit) {
    exports.User = User;
}