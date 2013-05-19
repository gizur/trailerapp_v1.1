/* jshint undef: true, unused: true, strict: true, vars: true */

/**
 * Utility Class Request
 * 
 * @fileoverview Sends request to Gizur REST API
 * @author anshuk.kumar@essindia.co.in (Anshuk Kumar)
 * @license Commercial - Copyright 2013 Gizur AB
 * @see http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml
 */

var Request = (function() {

    /**
     * Private Variables
     */
    var base_url;
    var client_id;
    var storage;

    var lg;

    /**
     * Class Definition
     */
    var Request = Stapes.subclass({
        constructor : function(aBaseUrl, aClientId) {

            lg = new Logger('DEBUG', 'request');

            storage = window.localStorage;

            var attrs = storage.getItem('request');
            
            if (attrs) {
                base_url = attrs.base_url;
                client_id = attrs.client_id;
            }

            if (aBaseUrl != undefined && aClientId != undefined) {
                base_url = aBaseUrl;
                client_id = aClientId;
            }            
        },
        setClientId : function(aClientId) {
            client_id = aClientId;

            storage.setItem('request', {
                "base_url" : base_url,
                "client_id" : client_id
            });
        },
        getClientId : function() {
            return client_id;
        },        
        send : function(method, url, headers, body, successCb, errorCb, files) {

            var successCbWrapper = function(data){
                //Login to handle special cases should be here
                //...
                lg.log('DEBUG', 'Request#send#successCbWrapper : ' + JSON.stringify(data));

                $.mobile.loading( 'hide' );

                successCb(data);
            };

            var errorCbWrapper = function(jqxhr, status, er){
                //Login to handle special cases should be here
                //...
                lg.log('DEBUG', 'Request#send#errorCbWrapper : ' + jqxhr.status + ' ' +  jqxhr.responseText + ' status ' + status + ' er ' + er);

                $.mobile.loading( 'hide' );

                if (jqxhr.status == 0) {
                    $('#dialog div[data-role=header]').html('<h3>Error</h3>');
                    $('#dialog div[data-role=content]').children().first().html('Please check your internet connection and try again.');
                    $('#a_dialog').click();
                } else {
                    errorCb(jqxhr, status, er);
                }
                
            };

            $.mobile.loading( 'show', { theme: "b", text: "Please wait...", textonly: false});

            lg.log('DEBUG', 'Request#send : url ' + base_url +  url);

            if (files == undefined || 
                !(files instanceof Array) ||
                files.length == 0) {

                $.ajax({
                    type: method,
                    dataType: 'json',
                    url: base_url + url,
                    data: body,
                    beforeSend: function(xhr){
                        xhr.setRequestHeader('X_CLIENTID', client_id);
                        for (key in headers) {
                            xhr.setRequestHeader(key, headers[key]);
                        }
                    },          
                    success: successCbWrapper,
                    error: errorCbWrapper
                });
            } else {

                var ft = new FileTransfer();
                var options = new FileUploadOptions();

                options.fileKey="file";
                options.fileName=files[0].substr(files[0].lastIndexOf('/')+1);
                options.mimeType="image/jpeg";                

                options.params = data;

                options.headers = {
                    'X_CLIENTID' : client_id
                };

                var successCbWrapperF = function(r) {
                    var data = JSON.stringify(r.response);
                    successCbWrapper(data);
                };

                var errorCbWrapperF = function(r) {
                    errorCbWrapper({'responseText':'{"success":"false"}'}, r.http_status, r.code);
                };
                
                /**
                 * Limitation in Apache Cordova allows sending only one file
                 * so sending only the first one
                 */
                
                ft.upload(
                    files[0], 
                    (base_url + url), 
                    successCbWrapperF, 
                    errorCbWrapperF, 
                    options
                );
            }
        }
    });

    return Request;
})();

/**
 * For node-unit test
 */
if (node_unit) {
    exports.Request = Request;
}