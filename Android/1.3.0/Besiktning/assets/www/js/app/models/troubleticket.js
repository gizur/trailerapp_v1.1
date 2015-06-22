/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, 
         bitwise:true, strict:true, undef:false, unused:true, 
         curly:true, browser:true, indent:4, maxerr:50 */

/*global node_unit:true, Stapes:true, 
         Logger:true, window:true, exports:false*/

/**
 * Model Class for Trouble ticket
 * 
 * @fileoverview Class definition of a TroubleTickets
 * @author anshuk.kumar@essindia.co.in (Anshuk Kumar)
 * @license Commercial - Copyright 2013 Gizur AB
 * @see http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml
 */

/**
 * 
 * Dependency (should be globally available)
 *  |
 *  |-Asset Class
 *  |-Object usr (instanceof User Class)
 */

var TroubleTicket = Stapes.subclass({

    /**
     * Creates Object of TroubleTicket Class
     *
     * @param aUsr User Class instance, the user who is making the request
     * @param {object} aLogConfig object containing the log configuration     
     */   

    constructor : function(aUsr, aLogConfig) {

        "use strict";

        /**
         * Set pseudo private vars
         * please dont change this using <objname>._privatevarname
         * method from outside of here.
         * Arggghh Stapes!!!!
         */

        if (typeof aLogConfig === 'undefined') {
            aLogConfig = {
                level  : 'FATAL',
                type   : 'console',
                config : {}
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
            _lg : new Logger(aLogConfig.level, aLogConfig.type, aLogConfig.config),
            _storage : window.localStorage,
            _usr : aUsr
        });
        
        this.set({
            'asset' : new Asset(this._usr),
            'sealed' : '',
            'damage' : false,
            'place' : '',
            'enum_place' : {},
            'enum_sealed' : {}
        });

        if (this._storage.getItem('enum_place') && this._storage.getItem('enum_place') !== null) {
            this.set('enum_place', JSON.parse(this._storage.getItem('enum_place')));
        }

        if (this._storage.getItem('enum_sealed') && this._storage.getItem('enum_sealed') !== null) {
            this.set('enum_sealed', JSON.parse(this._storage.getItem('enum_sealed')));
        }            

    },

    /**
     * Removes all objects from attributes and returns key value pairs
     *
     * @return {object} key value pair of the attributes
     */  

    getAllSanitized :  function() {

        "use strict";

        var gas;

        gas = this.getAll();

        gas.trailerid = this.get('asset').get('assetname');

        delete gas.enum_sealed;
        delete gas.enum_place;
        delete gas.asset;

        return gas;
    },

    /**
     * Gets trouble ticket by id
     *
     * @param  {string}   id        id of the troubleticket to be fetched
     * @param  {function} successCb success callback executed in case of success
     * @param  {function} errorCb   executed in case of error     
     * @return {void}
     */  

    getById : function(Id, successCb, errorCb) {

        "use strict";

        var that = this;

        var successCbWrapper = function(data){
            that.set(data.result);

            that._lg.log('DEBUG', 'js/models/troubleticket', ' received data ' + JSON.stringify(data.result));

            if (typeof successCb === 'function') {
                successCb(data);
            }
        };

        var errorCbWrapper = function(jqxhr, status, er){
            if (typeof errorCb === 'function') {
                errorCb(jqxhr, status, er);
            }
        };

        this._usr.send(
            'GET', 
            'HelpDesk/' + Id,
            '',
            successCbWrapper,
            errorCbWrapper
        );
    },

    /**
     * Fetches data picklist of Place also caches it in 
     * local storage.
     *
     * @param  {function} successCb success callback executed in case of success
     * @param  {function} errorCb   executed in case of error     
     * @return {void} 
     */

    getEnumPlace: function(successCb, errorCb) {

        "use strict";

        var that = this;

        var successCbWrapper = function(data){
            that.set('enum_place', data.result);
            that._storage.setItem('enum_place', JSON.stringify(data.result));

            if (typeof successCb === 'function') {
                successCb(data, 'place');
            }
        };

        var errorCbWrapper = function(jqxhr, status, er){
            if (typeof errorCb === 'function') {
                errorCb(jqxhr, status, er, 'place');              
            }
        };

        this._usr.send(
            'GET', 
            'HelpDesk/damagereportlocation',
            '',
            successCbWrapper,
            errorCbWrapper
        );
    },

    /**
     * Fetches data picklist of Sealed also caches it in 
     * local storage.
     *
     * @param  {function} successCb success callback executed in case of success
     * @param  {function} errorCb   executed in case of error     
     * @return {void}
     */

    getEnumSealed: function(successCb, errorCb) {

        "use strict";

        var that = this;

        var successCbWrapper = function(data){
            that.set('enum_sealed', data.result);
            that._storage.setItem('enum_sealed', JSON.stringify(data.result));

            if (typeof successCb === 'function') {
                successCb(data, 'sealed');
            }
        };

        var errorCbWrapper = function(jqxhr, status, er){
            if (typeof errorCb === 'function') {
                errorCb(jqxhr, status, er, 'sealed');
            }
        };

        this._usr.send(
            'GET', 
            'HelpDesk/sealed',
            '',
            successCbWrapper,
            errorCbWrapper
        );
    },

    /**
     * Saves 'this' object to server
     *
     * @param  {function} successCb success callback executed in case of success
     * @param  {function} errorCb   executed in case of error   
     * @param  {boolean}  silent    checks if internet connection error message has to be shown or not       
     * @return {void}
     */

    save: function(successCb, errorCb, silent) {

        "use strict";        

        var that = this;
        var files = [];
        var new_tt_id = 0;
        var new_tt_no = '';

        var successCbWrapper = function(data){

            that._lg.log('TRACE', 'js/models/troubleticket', 'successCbWrapper : start');            

            new_tt_id = data.result.id;
            new_tt_no = data.result.ticket_no;

            that._lg.log('DEBUG', 'js/models/troubleticket', 'successCbWrapper : new_tt_id ' + new_tt_id);  
            that._lg.log('DEBUG', 'js/models/troubleticket', 'successCbWrapper : files.length ' + files.length);  

            if (files.length <= 1) {
                if (typeof successCb === 'function') {
                    successCb(data);
                }
            } else {
                that._lg.log('TRACE', 'js/models/troubleticket', 'successCbWrapper : calling successCbWrapperMultipleFile'); 
                successCbWrapperMultipleFile(data);
            }

            that._lg.log('TRACE', 'js/models/troubleticket', 'successCbWrapper : end');

        };

        var errorCbWrapper = function(jqxhr, status, er){

            that._lg.log('TRACE', 'js/models/troubleticket', 'errorCbWrapper : start');

            if (typeof errorCb === 'function') {
                errorCb(jqxhr, status, er);
            }

            that._lg.log('TRACE', 'js/models/troubleticket', 'errorCbWrapper : end');           
        };

        /**
         * In case there are more than one file to be attached
         * (max 3). The following callbacks should be used.
         */

        var successCbWrapperMultipleFile = function(data){

            that._lg.log('TRACE', 'js/models/troubleticket', 'successCbWrapperMultipleFile : start');

            files.splice(0,1);

            if (files.length === 0) {
                if (typeof successCb === 'function') {
                    successCb(data);
                }
            } else {

                that._lg.log('DEBUG', 'js/models/troubleticket', 'successCbWrapperMultipleFile : new_tt_id ' + new_tt_id);

                that._usr.send(
                    'POST',
                    'DocumentAttachment/' + new_tt_id,
                    {"ticket_no":new_tt_no},
                    successCbWrapperMultipleFile,
                    errorCbWrapperMultipleFile,
                    files,
                    silent                
                );
            }

            that._lg.log('TRACE', 'js/models/troubleticket', 'successCbWrapperMultipleFile : end');
        };

        var errorCbWrapperMultipleFile = function(jqxhr, status, er){

            that._lg.log('TRACE', 'js/models/troubleticket', 'errorCbWrapperMultipleFile : start');

            /**
             * Store unsent files
             */

            var unsent_files = window.localStorage.getItem('unsent_files');

            if (unsent_files === null) {
                unsent_files = [];
            } else {
                unsent_files = JSON.parse(unsent_files);
            }

            unsent_files.push({tt_id : new_tt_id, path : files.splice(0,1)[0]});

            window.localStorage.setItem('unsent_files', JSON.stringify(unsent_files));

            that._lg.log('DEBUG', 'js/models/troubleticket', 'errorCbWrapperMultipleFile : unsent_files.length ' + unsent_files.length);

            /**
             * Check if files are left to be sent
             * if no call parent callback
             * if yes send the file to server for
             * attachment
             */

            if (files.length === 0){
                if (typeof successCb === 'function') {
                    successCb(jqxhr, status, er);    
                }          
            } else {
                that._usr.send(
                    'POST',
                    'DocumentAttachment/' + new_tt_id,
                    {},
                    successCbWrapperMultipleFile,
                    errorCbWrapperMultipleFile,
                    files,
                    silent                
                );
            }

            that._lg.log('TRACE', 'js/models/troubleticket', 'errorCbWrapperMultipleFile : end');
        };       

        var ast = this.get('asset');

        this._lg.log('DEBUG', 'js/models/troubleticket', ' ast instanceof Asset ' + (ast instanceof Asset));
        this._lg.log('DEBUG', 'js/models/troubleticket', ' ast.get(assetname) ' + ast.get('assetname'));

        var data = {
            'trailerid' : ast.get('assetname'),
            'damagereportlocation' : $('<div/>').html(this.get('place')).text(),
            'sealed' : this.get('sealed')
        };

        if (!this.get('damage')) {
            data.ticket_title = 'Survey Reported for ' + data.trailerid; //this.get('trailerid'),
            data.ticketstatus = 'Closed';
            data.reportdamage = 'No';
            this._usr.send(
                'POST', 
                'HelpDesk',
                data,
                successCbWrapper,
                errorCbWrapper,
                undefined,
                silent
            );

        } else {
            var docs = this.get('damage').get('docs').getAll();
            for (var index in docs) {
                if (docs.hasOwnProperty(index)) {
                    files.push(docs[index].get('path'));
                }
            }
            

            data.ticket_title = 'Damage Reported for ' + data.trailerid;
            data.ticketstatus = 'Open';
            data.reportdamage = 'Yes';
            data.damageposition = $('<div/>').html(this.get('damage').get('damageposition')).text();
            data.damagetype = $('<div/>').html(this.get('damage').get('damagetype')).text();
            data.drivercauseddamage = $('<div/>').html(this.get('damage').get('drivercauseddamage')).text();

            this._usr.send(
                'POST',
                'HelpDesk',
                data,
                successCbWrapper,
                errorCbWrapper,
                files,
                silent
            );       
        }
    }   
});

/**
 * For node-unit test
 */

if (typeof node_unit !== 'undefined') {
    exports.TroubleTicket = TroubleTicket;
}
