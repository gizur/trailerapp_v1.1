/* jshint undef: true, unused: true, strict: true, vars: true */

/**
 * Model Class for Documents ie pictures
 * 
 * @fileoverview Class definition Documents
 * @author anshuk.kumar@essindia.co.in (Anshuk Kumar)
 * @license Commercial - Copyright 2013 Gizur AB
 * @see http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml
 */

var Doc = Stapes.subclass({

    /**
     * @constructor
     */ 
    constructor : function(aUsr) {

        this.extend({
            _usr :  aUsr,
            _lg : new Logger('FATAL', 'js/models/doc')
        });

        this.set({
            'id' : '',
            'path' : ''
        });
    },

    /**
     * Download file from server
     */ 
    download : function(successCb, errorCb) {
        var that = this;
        var thatSuccessCb = successCb; 
        var thatErrorCb = errorCb;
        var fullpath;

        that._lg.log('DEBUG', ' doc getAll ' + JSON.stringify(this.getAll()));


        var successCbWrapper = function(data){
            that._lg.log('TRACE', ' download successCbWrapper start');

            window.localStorage.setItem(data.result.filename, data.result.filecontent); 
            that._lg.log('TRACE', 'Finished downloading image');
            that._lg.log('DEBUG', ' full path of file : ' + data.result.filename);
            that.set('path', data.result.filename);

            if (thatSuccessCb != undefined && typeof thatSuccessCb == 'function')
                thatSuccessCb(data);          
        };

        var errorCbWrapper = function(jqxhr, status, er){
            if (errorCb != undefined && typeof errorCb == 'function')
                errorCb(jqxhr, status, er);              
        };

        this._usr.send(
            'GET', 
            'DocumentAttachments/' + this.get('id'),
            '',
            successCbWrapper,
            errorCbWrapper
        );        
    }
});

/**
 * For node-unit test
 */
if (typeof node_unit != 'undefined') {
    exports.Doc = Doc;
}