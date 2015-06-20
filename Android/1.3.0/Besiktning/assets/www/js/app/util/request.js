/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, 
 bitwise:true, strict:true, undef:false, unused:true, 
 curly:true, browser:true, indent:4, maxerr:50 */

/*global node_unit:true, Stapes:true, 
 Logger:true, window:true, exports:false*/
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
     * @param {string} aClientId the client id
     * @param {object} aLogConfig object containing the log configuration     
     */

    constructor: function(aBaseUrl, aClientId, aLogConfig) {

        "use strict";

        /**
         * Set pseudo private vars
         * please dont change this using <objname>._privatevarname
         * method from outside of here.
         * Arggghh Stapes!!!!
         */

        if (typeof aLogConfig === 'undefined') {
            aLogConfig = {
                level: 'FATAL',
                type: 'console',
                config: {}
            };
        } else {
            if (typeof aLogConfig.level === 'undefined') {
                aLogConfig.level = 'FATAL';
            }

            if (typeof aLogConfig.level === 'undefined') {
                aLogConfig.type = 'console';
            }

            if (typeof aLogConfig.config === 'undefined') {
                aLogConfig.config = {};
            }
        }

        this.extend({
            _lg: new Logger(aLogConfig.level, aLogConfig.type, aLogConfig.config),
            _storage: window.localStorage,
            _base_url: aBaseUrl,
            _client_id: aClientId
        });

        var attrs = this._storage.getItem('request');

        if (attrs !== null) {
            attrs = JSON.parse(attrs);
            if (typeof aBaseUrl === 'undefined') {
                this._base_url = attrs.base_url;
            }

            if (typeof aClientId === 'undefined') {
                this._client_id = attrs.client_id;
            }
        }

        this._storage.setItem('request', JSON.stringify({
            "base_url": this._base_url,
            "client_id": this._client_id
        }));

    },
    /**
     * Sets the client id and also save it to the cache
     *
     * @param {string} aClientId the gizur client it
     */

    setClientId: function(aClientId) {

        "use strict";

        this._client_id = aClientId;
        this._lg.log('DEBUG', 'js/util/request', ' setClientId aClientId ' + aClientId);

        this._storage.setItem('request', JSON.stringify({
            "base_url": this._base_url,
            "client_id": this._client_id
        }));

        var attrs = JSON.parse(this._storage.getItem('request'));

        this._lg.log('DEBUG', 'js/util/request', ' setClientId attrs.client_id ' + attrs.client_id);

    },
    /**
     * Gets the client id and also save it to the cache
     *
     */

    getClientId: function() {

        "use strict";

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
     * @param {boolean}  silent    checks if internet connection error message has to be shown or not
     */

    send: function(method, url, headers, body, successCb, errorCb, files, silent) {

        "use strict";

        var that = this;

        if (typeof silent === 'undefined') {
            silent = false;
        }

        try {

            var successCbWrapper = function(data) {
                that._lg.log('DEBUG', 'js/util/request', 'Request#send#successCbWrapper : ' + JSON.stringify(data));

                //$.mobile.loading('hide');

                if (typeof successCb === 'function') {
                    successCb(data);
                }
            };

            var errorCbWrapper = function(jqxhr, status, er) {
                try {

                    that._lg.log('DEBUG', 'js/util/request', 'Request#send#errorCbWrapper : ' + jqxhr.status + ' status ' + status + ' er ' + er);
                    that._lg.log('DEBUG', 'js/util/request', 'Request#send#errorCbWrapper : jqxhr.responseText ' + jqxhr.responseText);

                    /**
                     * Hide the loading GIF animation
                     */

                    //$.mobile.loading('hide');
                    if ((jqxhr.status === 0 || status === null) && !silent) {
                    	$('.modal').modal('hide');
                    	
                    	$('#errorDialogHeader').empty().html(app._lang.translate('Connection Error'));
                    	$('#errorDialogBody').empty().html(app._lang.translate('Please check your internet connection and try again') + '.');
                    	
                    	$('#errorDialog').modal('show');

                    } else {
                      if(jqxhr.status === 0 && jqxhr.statusText == "timeout") {
                        $('.modal').modal('hide');
                    	
                    	$('#errorDialogHeader').empty().html(app._lang.translate('Timeout Error'));
                    	$('#errorDialogBody').empty().html(app._lang.translate('Request timeout, please check your internet connection') + '.');
                    	$('#errorDialog').modal('show');
                      }

                        var data;
                        
                        try {
                            data = JSON.parse(jqxhr.responseText);
                        } catch (err) {
                            data = null;
                        }
                        
                        if (data !== null &&
                                typeof data.error !== 'undefined' &&
                                typeof data.error.message !== 'undefined' &&
                                data.error.message === 'Client ID not found') {

                        	$('.modal').modal('hide');
                        	
                        	$('#errorDialogHeader').empty().html(app._lang.translate('Error'));
                        	$('#errorDialogBody').empty().html(app._lang.translate('Provided client ID is not valid') + '.');
                        	
                        	$('#errorDialog').modal('show');

                        } else {

                            if (typeof errorCb === 'function') {
                                errorCb(jqxhr, status, er);
                            }

                        }
                    }

                } catch (err) {

                    that._lg.log('FATAL', 'js/util/request', JSON.stringify(err));

                }

            };

            //$.mobile.loading('show', {theme: "b", text: "Please wait...", textonly: false});

            this._lg.log('DEBUG', 'js/util/request', 'Request#send : url ' + this._base_url + url);
            this._lg.log('DEBUG', 'js/util/request', 'Request#send : body ' + JSON.stringify(body));

            this._lg.log('DEBUG', 'js/util/request', 'Request#send : headers ' + JSON.stringify(headers));
            this._lg.log('DEBUG', 'js/util/request', 'Request#send : client_id ' + this._client_id);

            if (files === undefined ||
                    !(files instanceof Array) ||
                    files.length === 0) {

                this._lg.log('TRACE', 'js/util/request', 'Request#send : no files ');

                $.ajax({
                    type: method,
                    dataType: 'json',
                    url: this._base_url + url,
                    data: body,
                    cache: false,
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('X_CLIENTID', that._client_id);
                        for (var key in headers) {
                            if (headers.hasOwnProperty(key)) {
                                xhr.setRequestHeader(key, headers[key]);
                            }
                        }
                    },
                    success: successCbWrapper,
                    error: errorCbWrapper,
                    timeout: 60000
                });
            } else {

                this._lg.log('TRACE', 'js/util/request', 'Request#send : with files ');

                var ft = new FileTransfer();
                var options = new FileUploadOptions();

                options.fileKey = "file";
                options.fileName = files[0].substr(files[0].lastIndexOf('/') + 1);
                options.mimeType = "image/jpeg";

                options.params = body;

                headers.X_CLIENTID = this._client_id;
                headers.ACCEPT = "application/json";

                options.headers = headers;

                // A hack to solve next image upload
                // issue.
                
                options.headers.Connection = "close";

                var successCbWrapperF = function(r) {
                    var data = JSON.parse(r.response);
                    successCbWrapper(data);
                };

                var errorCbWrapperF = function(r) {
                    that._lg.log('DEBUG', 'js/util/request', 'Request#send errorCbWrapperF ' + JSON.stringify(r));
                    errorCbWrapper({'responseText': r.body, 'status': r.code}, r.http_status, r.code);
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
        } catch (err) {

            this._lg.log('FATAL', 'js/util/request', err.message + " : " + JSON.stringify(err));

        }
    }
});

/**
 * For node-unit test
 */
if (typeof node_unit !== 'undefined') {
    exports.Request = Request;
}
