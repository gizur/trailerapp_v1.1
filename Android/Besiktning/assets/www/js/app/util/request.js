/* jshint undef: true, unused: true, strict: true, vars: true */

/**
 * Utility Class Request
 * 
 * @fileoverview Sends request to Gizur REST API
 * @author anshuk.kumar@essindia.co.in (Anshuk Kumar)
 * @license Commercial - Copyright 2013 Gizur AB
 * @see http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml
 */

var Request = Stapes.subclass({

    /**
     * @constructor
     *
     * @param {string} aBaseUrl base url for the api
     */

    constructor : function(aBaseUrl, aClientId) {

        /**
         * Set pseudo private vars
         * please dont change this using <objname>._privatevarname
         * method from outside of here.
         * Arggghh Stapes!!!!
         */

        this.extend({
            _lg : new Logger('FATAL', 'request'),
            _storage : window.localStorage,
            _base_url : aBaseUrl,
            _client_id : aClientId
        });

        var attrs = this._storage.getItem('request');

        if (attrs != null) {
            attrs = JSON.parse(attrs);
            if (typeof aBaseUrl == 'undefined')
                this._base_url = attrs.base_url;

            if (typeof aClientId == 'undefined')            
                this._client_id = attrs.client_id;
        }

        this._storage.setItem('request', JSON.stringify({
            "base_url" : this._base_url,
            "client_id" : this._client_id
        }));        

    },

    /**
     * Sets the client id and also save it to the cache
     *
     * @param {string} aClientId the gizur client it
     */

    setClientId : function(aClientId) {
        this._client_id = aClientId;
        this._lg.log('DEBUG', ' setClientId aClientId ' + aClientId);

        this._storage.setItem('request', JSON.stringify({
            "base_url" : this._base_url,
            "client_id" : this._client_id
        }));

        var attrs = JSON.parse(this._storage.getItem('request'));

        this._lg.log('DEBUG', ' setClientId attrs.client_id ' + attrs.client_id);

    },

    /**
     * Gets the client id and also save it to the cache
     *
     */

    getClientId : function() {
        return this._client_id;
    },

    /**
     * Send the request to Gizur API
     *
     * @param {string}   method    HTTP method to send the request with
     * @param {string}   url       the gizur api url
     * @param {object}   headers   lists of headers to be sent with the request
     * @param {string}   body      request body
     * @param {function} successCb success callback function
     * @param {function} errorCb   error callback function
     * @param {array}    files     array of files to be sent
     */

    send : function(method, url, headers, body, successCb, errorCb, files) {
        
        var that = this;

        var successCbWrapper = function(data){

            that._lg.log('DEBUG', 'Request#send#successCbWrapper : ' + JSON.stringify(data));

            $.mobile.loading( 'hide' );

            successCb(data);
        };

        var errorCbWrapper = function(jqxhr, status, er){

            try {

                that._lg.log('DEBUG', 'Request#send#errorCbWrapper : ' + jqxhr.status + ' status ' + status + ' er ' + er);
                that._lg.log('DEBUG', 'Request#send#errorCbWrapper : jqxhr.responseText ' + jqxhr.responseText);

                /**
                 * Hide the loading GIF animation
                 */

                $.mobile.loading( 'hide' );

                if (jqxhr.status == 0) {

                    $('#a_dialog_nointernet').click();

                } else {

                    var data = JSON.parse(jqxhr.responseText);

                    if (typeof data.error !== 'undefined' && 
                        typeof data.error.message !== 'undefined' && 
                        data.error.message === 'Client ID not found') {

                        $('#a_dialog_error_clientid').click();

                    } else {

                        errorCb(jqxhr, status, er);

                    }
                }

            } catch (err) {

                that._lg.log('FATAL', JSON.stringify(err));

            }
            
        };

        $.mobile.loading( 'show', { theme: "b", text: "Please wait...", textonly: false});

        this._lg.log('DEBUG', 'Request#send : url ' + this._base_url +  url);
        this._lg.log('DEBUG', 'Request#send : body ' + JSON.stringify(body));

        this._lg.log('DEBUG', 'Request#send : headers ' + JSON.stringify(headers));
        this._lg.log('DEBUG', 'Request#send : client_id ' + this._client_id);

        if (files == undefined || 
            !(files instanceof Array) ||
            files.length == 0) {

            this._lg.log('TRACE', 'Request#send : no files ');

            $.ajax({
                type: method,
                dataType: 'json',
                url: this._base_url + url,
                data: body,
                cache: false,
                beforeSend: function(xhr){
                    xhr.setRequestHeader('X_CLIENTID', that._client_id);
                    for (key in headers) {
                        xhr.setRequestHeader(key, headers[key]);
                    }
                },          
                success: successCbWrapper,
                error: errorCbWrapper
            });
        } else {

            this._lg.log('TRACE', 'Request#send : with files ');

            var ft = new FileTransfer();
            var options = new FileUploadOptions();

            options.fileKey="file";
            options.fileName=files[0].substr(files[0].lastIndexOf('/')+1);
            options.mimeType="image/jpeg";                

            options.params = body;               

            headers.X_CLIENTID = this._client_id;

            options.headers = headers;

            var successCbWrapperF = function(r) {
                var data = JSON.parse(r.response);
                successCbWrapper(data);
            };

            var errorCbWrapperF = function(r) {
                errorCbWrapper({'responseText':'{"success":"false"}','status':'none'}, r.http_status, r.code);
            };
            
            /**
             * Limitation in Apache Cordova allows sending only one file
             * so sending only the first one
             */
            
            ft.upload(
                files[0], 
                (this._base_url + url), 
                successCbWrapperF, 
                errorCbWrapperF, 
                options
            );
        }
    }
});

/**
 * For node-unit test
 */
if (typeof node_unit != 'undefined') {
    exports.Request = Request;
}