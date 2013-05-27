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
 *  |-TroubleTicket Class
 *  |-Object usr (instanceof User Class)
 *  |-Object req (instanceof Request Class)
 */

var TroubleTicket = Stapes.subclass({

    /**
     * Creates Object of TroubleTicket Class
     *
     * @param aReq Request Class instance, the API and client to make request to
     * @param aUsr User Class instance, the user who is making the request
     *
     * @return {TroubleTicket} new object
     */   

    constructor : function(aUsr) {

        this.extend({
            _lg : new Logger('FATAL', 'js/models/troubleticket'),
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

        if (this._storage.getItem('enum_place') !=  false && this._storage.getItem('enum_place')!=null) {
            this.set('enum_place', JSON.parse(this._storage.getItem('enum_place')));
        }

        if (this._storage.getItem('enum_sealed') !=  false && this._storage.getItem('enum_sealed')!=null) {
            this.set('enum_sealed', JSON.parse(this._storage.getItem('enum_sealed')));
        }            

    },

    /**
     * Gets trouble ticket by id
     * @return {TroubleTicket} new object similar to this one
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
     * @return {TroubleTicket} new object similar to this one
     */  

    getById : function(Id, successCb, errorCb) {
        var that = this;

        var successCbWrapper = function(data){
            that.set(data.result);

            that._lg.log('DEBUG', ' received data ' + JSON.stringify(data.result))

            if (successCb != undefined && typeof successCb == 'function')
                successCb(data);
        };

        var errorCbWrapper = function(jqxhr, status, er){
            if (errorCb != undefined && typeof errorCb == 'function')
                errorCb(jqxhr, status, er);              
        };

        this._usr.send(
            'GET', 
            'HelpDesk/' + Id,
            {
                'X_USERNAME': this._usr.get('username'),
                'X_PASSWORD': this._usr.get('password')
            },
            '',
            successCbWrapper,
            errorCbWrapper
        );
    },

    /**
     * Fetches data picklist of Place also caches it in 
     * local storage.
     * @return {object} key value pairs of lists
     */

    getEnumPlace: function(successCb, errorCb) {
        var that = this;

        var successCbWrapper = function(data){
            that.set('enum_place', data.result);
            that._storage.setItem('enum_place', JSON.stringify(data.result));

            if (successCb != undefined && typeof successCb == 'function')
                successCb(data, 'place');
        };

        var errorCbWrapper = function(jqxhr, status, er){
            if (errorCb != undefined && typeof errorCb == 'function')
                errorCb(jqxhr, status, er, 'place');              
        };

        this._usr.send(
            'GET', 
            'HelpDesk/damagereportlocation',
            {
                'X_USERNAME': this._usr.get('username'),
                'X_PASSWORD': this._usr.get('password')
            },
            '',
            successCbWrapper,
            errorCbWrapper
        );
    },

    /**
     * Fetches data picklist of Sealed also caches it in 
     * local storage.
     * @return {object} key value pairs of lists
     */

    getEnumSealed: function(successCb, errorCb) {
        var that = this;

        var successCbWrapper = function(data){
            that.set('enum_sealed', data.result);
            that._storage.setItem('enum_sealed', JSON.stringify(data.result));

            if (successCb != undefined && typeof successCb == 'function')
                successCb(data, 'sealed');
        };

        var errorCbWrapper = function(jqxhr, status, er){
            if (errorCb != undefined && typeof errorCb == 'function')
                errorCb(jqxhr, status, er, 'sealed');
        };

        this._usr.send(
            'GET', 
            'HelpDesk/sealed',
            {
                'X_USERNAME': this._usr.get('username'),
                'X_PASSWORD': this._usr.get('password')
            },
            '',
            successCbWrapper,
            errorCbWrapper
        );
    },

    /**
     * Saves 'this' object to server
     * @return {object} key value pairs of lists
     */
    save: function(successCb, errorCb) {
        var that = this;

        var successCbWrapper = function(data){
            if (successCb != undefined && typeof successCb == 'function')
                successCb(data);
        };

        var errorCbWrapper = function(jqxhr, status, er){
            if (errorCb != undefined && typeof errorCb == 'function')
                errorCb(jqxhr, status, er);              
        };

        var ast = this.get('asset');

        this._lg.log('DEBUG', ' ast instanceof Asset ' + (ast instanceof Asset));
        this._lg.log('DEBUG', ' ast.get(assetname) ' + ast.get('assetname'));

        data = {
            'trailerid' : ast.get('assetname'),
            'damagereportlocation' : $('<div/>').html(this.get('place')).text(),
            'sealed' : this.get('sealed'),
        };

        if (this.get('damage') == false) {
            data['ticket_title'] = 'Survey Reported for ' + this.get('trailerid'),
            data['ticketstatus'] = 'Closed';
            data['reportdamage'] = 'No';

            this._usr.send(
                'POST', 
                'HelpDesk',
                {
                    'X_USERNAME': this._usr.get('username'),
                    'X_PASSWORD': this._usr.get('password')
                },
                data,
                successCbWrapper,
                errorCbWrapper
            );

        } else {
            var docs = this.get('damage').get('docs').getAll();
            var files = Array();

            for (var index in docs) {
                files.push(docs[index].get('path'));
            }

            data['ticket_title'] = 'Damage Reported for ' + data['trailerid'],
            data['ticketstatus'] = 'Open';
            data['reportdamage'] = 'Yes';
            data['damageposition'] = $('<div/>').html(this.get('damage').get('damageposition')).text();
            data['damagetype'] = $('<div/>').html(this.get('damage').get('damagetype')).text();
            data['drivercauseddamage'] = $('<div/>').html(this.get('damage').get('drivercauseddamage')).text();

            this._usr.send(
                'POST',
                'HelpDesk',
                {
                    'X_USERNAME': this._usr.get('username'),
                    'X_PASSWORD': this._usr.get('password')
                },
                data,
                successCbWrapper,
                errorCbWrapper,
                files                
            );                
        }
    }   
});

/**
 * For node-unit test
 */
if (node_unit) {
    exports.TroubleTicket = TroubleTicket;
}