/* jshint undef: true, unused: true, strict: true, vars: true */

/**
 * Model Class for Trouble ticket
 * 
 * @fileoverview Class definition of a collection of TroubleTickets
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
     * @param aReq Request Class instance, the API and client to make request to
     * @param aUsr User Class instance, the user who is making the request
     */   

    constructor : function(aUsr) {

        /**
         * Set pseudo private vars
         * please dont change this using <objname>._privatevarname
         * method from outside of here.
         * Arggghh Stapes!!!!
         */        

        this.extend({
            _lg : new Logger('DEBUG', 'js/models/troubleticket'),
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
        var that = this;

        var successCbWrapper = function(data){
            that.set(data.result);

            that._lg.log('DEBUG', ' received data ' + JSON.stringify(data.result));

            if (typeof successCb == 'function')
                successCb(data);
        };

        var errorCbWrapper = function(jqxhr, status, er){
            if (typeof errorCb == 'function')
                errorCb(jqxhr, status, er);              
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
        var that = this;

        var successCbWrapper = function(data){
            that.set('enum_place', data.result);
            that._storage.setItem('enum_place', JSON.stringify(data.result));

            if (typeof successCb == 'function')
                successCb(data, 'place');
        };

        var errorCbWrapper = function(jqxhr, status, er){
            if (typeof errorCb == 'function')
                errorCb(jqxhr, status, er, 'place');              
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
        var that = this;

        var successCbWrapper = function(data){
            that.set('enum_sealed', data.result);
            that._storage.setItem('enum_sealed', JSON.stringify(data.result));

            if (typeof successCb == 'function')
                successCb(data, 'sealed');
        };

        var errorCbWrapper = function(jqxhr, status, er){
            if (typeof errorCb == 'function')
                errorCb(jqxhr, status, er, 'sealed');
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

        var that = this;
        var files = Array();
        var new_tt_id = 0;

        var successCbWrapper = function(data){

            that._lg.log('TRACE', 'successCbWrapper : start');            

            new_tt_id = data.result.id;

            that._lg.log('DEBUG', 'successCbWrapper : new_tt_id ' + new_tt_id);  
            that._lg.log('DEBUG', 'successCbWrapper : files.length ' + files.length);  

            if (files.length <= 1) {
                if (typeof successCb == 'function')
                    successCb(data);
            } else {
                that._lg.log('TRACE', 'successCbWrapper : calling successCbWrapperMultipleFile'); 
                successCbWrapperMultipleFile(data);
            }

            that._lg.log('TRACE', 'successCbWrapper : end');

        };

        var errorCbWrapper = function(jqxhr, status, er){

            that._lg.log('TRACE', 'errorCbWrapper : start');

            if (typeof errorCb == 'function')
                errorCb(jqxhr, status, er);   

            that._lg.log('TRACE', 'errorCbWrapper : end');           
        };

        /**
         * In case there are more than one file to be attached
         * (max 3). The following callbacks should be used.
         */

        var successCbWrapperMultipleFile = function(data){

            that._lg.log('TRACE', 'successCbWrapperMultipleFile : start');

            files.splice(0,1);

            if (files.length === 0) {
                if (typeof successCb == 'function')
                    successCb(data);
            } else {

                that._lg.log('DEBUG', 'successCbWrapperMultipleFile : new_tt_id ' + new_tt_id);

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

            that._lg.log('TRACE', 'successCbWrapperMultipleFile : end');
        };

        var errorCbWrapperMultipleFile = function(jqxhr, status, er){

            that._lg.log('TRACE', 'errorCbWrapperMultipleFile : start');

            /**
             * Store unsent files
             */

            var unsent_files = window.localStorage.getItem('unsent_files');

            if (unsent_files == null) {
                unsent_files = [];
            } else {
                unsent_files = JSON.parse(unsent_files);
            }

            unsent_files.push({tt_id : new_tt_id, path : files.splice(0,1)[0]});

            window.localStorage.setItem('unsent_files', JSON.stringify(unsent_files));

            /**
             * Check if files are left to be sent
             * if no call parent callback
             * if yes send the file to server for
             * attachment
             */

            if (files.length === 0){
                if (typeof errorCb == 'function')
                    errorCb(jqxhr, status, er);              
            } else {
                this._usr.send(
                    'POST',
                    'DocumentAttachment/' + new_tt_id,
                    {},
                    successCbWrapperMultipleFile,
                    errorCbWrapperMultipleFile,
                    files,
                    silent                
                );
            }

            that._lg.log('TRACE', 'errorCbWrapperMultipleFile : end');
        };       

        var ast = this.get('asset');

        this._lg.log('DEBUG', ' ast instanceof Asset ' + (ast instanceof Asset));
        this._lg.log('DEBUG', ' ast.get(assetname) ' + ast.get('assetname'));

        data = {
            'trailerid' : ast.get('assetname'),
            'damagereportlocation' : $('<div/>').html(this.get('place')).text(),
            'sealed' : this.get('sealed')
        };

        if (!this.get('damage')) {
            data.ticket_title = 'Survey Reported for ' + data.trailerid, //this.get('trailerid'),
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
                files.push(docs[index].get('path'));
            }

            data.ticket_title = 'Damage Reported for ' + data.trailerid,
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

if (typeof node_unit != 'undefined') {
    exports.TroubleTicket = TroubleTicket;
}