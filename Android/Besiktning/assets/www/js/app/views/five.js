/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, 
         bitwise:true, strict:true, undef:false, unused:true, 
         curly:true, browser:true, indent:4, maxerr:50 */

/*global Stapes:true, window:true*/
/*exported ScreenFiveView*/

/**
 * View Class for screen Five
 * 
 * @fileoverview Class definition of a View of screen Five
 * @author anshuk.kumar@essindia.co.in (Anshuk Kumar)
 * @license Commercial - Copyright 2013 Gizur AB
 * @see http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml
 */

var ScreenFiveView = Stapes.subclass({

    /**
     * @constructor
     *
     * @param {user}     aUsr       the user who is making calls to server
     * @param {logger}   aLog       object containing the log configuration
     * @param {language} aLanguage  the language object
     * @param {wrapper}  aWrapper   the wrapper object
     */

    constructor : function(aUsr, aLog, aLanguage, aWrapper) {

        "use strict";

        /**
         * Set pseudo private vars
         * please dont change this using <objname>._privatevarname
         * method from outside of here.
         * Arggghh Stapes!!!!
         */   

        var current_tt;

        try {

            current_tt = JSON.parse(window.localStorage.getItem('current_tt'));

        } catch (e) {

            current_tt = null;

        }  

        this.extend({
            _lg : aLog,
            _language : aLanguage,
            _usr : aUsr,
            _current_tt : current_tt,
            _wrapper: aWrapper
        });

    },

    /**
     * Binds events to various elements of the page
     *   
     * @return {void} 
     */ 
          
    bindEventHandlers : function() {

        "use strict";

        var that = this;

        /**
         * ------------------
         * Event Bindings
         * ------------------
         */

        /**
         * Click event for report all damages
         */  

        $('.bxslider-five-a li a').die('click').live('click', function(e){
            try {

                if ($(this).data('disabled')) {
                    $(this).removeClass('ui-btn-active');
                    return false;
                }

                e.preventDefault();
                e.stopPropagation();

                var tt = new TroubleTicket(that._usr, Config.log);

                that._lg.log('TRACE', '.bxslider-five-a li a', '.bxslider-one li a click start');
                that._lg.log('DEBUG', '.bxslider-five-a li a', " $(this).attr('id') " + $(this).attr('id'));

                // Save the position

                that._tt_list = JSON.parse(window.localStorage.getItem('tt_list'));
                that._tt_list.position = window.slider_five_a.getCurrentSlide();
                window.localStorage.setItem('tt_list', JSON.stringify(that._tt_list));
                
                var id = $(this).attr('id');
                window.localStorage.setItem('details_tt_id', id);
                console.log(JSON.stringify(window.localStorage.getItem(id + '_tt')));

                $('#two a[data-icon="back"]').attr('href', '#five');
                
                /**
                 * Set return point if no internet connection is found
                 */

                $('#dialog_nointernet a[data-role=button]').attr('href', '#five');
                
                $.mobile.changePage('#two');                
                
            } catch (err) {

                /**
                 * Uncaught error catching and log it as FATAL
                 */

                that._lg.log('FATAL', '.bxslider-five-a li a', JSON.stringify(err));

            }        
        });

        $('#five #sendalldamages').unbind('click').click(function(){

        	if ($(this).data('disabled')) {
                $(this).removeClass('ui-btn-active');
                return false;
            }            

            that._lg.log('TRACE', '#five #sendalldamages', '#five #sendalldamages click start');

            var ttc = new TroubleTicketCollection(that._usr, Config.log);
            
            /**
             * De-serialize current_tt to its object
             * Since window.localStorage does not support
             * saving objects. We need serialize and deserialize
             * objects. The following is not so good solution.
             */

            for ( var index in that._current_tt.damages ) {
                if (that._current_tt.damages.hasOwnProperty(index)) {
                    var tt = new TroubleTicket(that._usr, Config.log);
                    var dmg = new Damage(undefined, Config.log);
                    var ast = new Asset(undefined, Config.log);
                    var dc = new DocCollection(Config.log);

                    for ( var docindex in that._current_tt.damages[index].documents) {
                        if (that._current_tt.damages[index].documents.hasOwnProperty(docindex)){
                            var doc = new Doc(undefined, Config.log);
                            doc.set('path', that._current_tt.damages[index].documents[docindex].path);
                            dc.push(doc);
                        }
                    }

                    ast.set('assetname', that._current_tt.trailerid);

                    dmg.set('damageposition', that._current_tt.damages[index].damageposition);
                    dmg.set('damagetype', that._current_tt.damages[index].damagetype);
                    dmg.set('drivercauseddamage', that._current_tt.damages[index].drivercauseddamage);
                    dmg.set('docs', dc);

                    tt.set('sealed', that._current_tt.sealed);
                    tt.set('sealed', that._current_tt.sealed);
                    tt.set('place', that._current_tt.place);
                    tt.set('damage', dmg);
                    tt.set('asset', ast);

                    that._lg.log('DEBUG', '#five #sendalldamages', 'trouble ticket');   

                    ttc.push(tt);
                }
            }

            /**
             * Success callback
             */

            var success = function(){

                delete window.retry_count;                        

                that._lg.log('TRACE', '#five #sendalldamages', '#five #sendalldamages success start');

                /**
                 * Clear history in jqMobile and Android's 
                 * WebView object's history
                 * This way the user will not be able to go back
                 * to the previous page.
                 */

                $.mobile.urlHistory.stack = [];

                that._wrapper.clearNavigatorHistory();

                var unsent_files = window.localStorage.getItem('unsent_files');

                if (unsent_files instanceof Array) {
                    that._lg.log('DEBUG', '#five #sendalldamages', '#five #sendalldamages success unsent_files ' + unsent_files.length);
                }

                if (unsent_files === null || !(unsent_files instanceof Array)) {
                    unsent_files = [];  
                }
                
                if (unsent_files.length === 0) {

                    that._lg.log('TRACE', '#five #sendalldamages', '#five #sendalldamages success no unsent_files ');

                    /**
                     * Reset Forms
                     */
                    resetFormOne();
                    resetFormFour();
                    
                    $('#a_dialog_success_damagereported').click();

                } else {

                    /**
                     * Attach events for retry and cancel
                     */

                    $('#dialog_success_damagereported_unsentfiles a:contains(Retry)').unbind('click').bind('click', function(e){

                        that._lg.log('TRACE', '#five #sendalldamages', '#five #sendalldamages success #dialog_success_damagereported_unsentfiles a:contains(Retry) START ');
                        
                        e.preventDefault();

                        var new_unsent_files = [];

                        var successCbMultipleFile = function() {

                            that._lg.log('TRACE', '#five #sendalldamages', '#five #sendalldamages success #dialog_success_damagereported_unsentfiles a:contains(Retry) successCbMultipleFile START ');

                            unsent_files.splice(0,1);

                            if (unsent_files.length !== 0) {

                                that._usr.send(
                                    'POST',
                                    'DocumentAttachment/' + unsent_files[0].tt_id,
                                    {},
                                    successCbMultipleFile,
                                    errorCbMultipleFile,
                                    [unsent_files[0].path]                
                                );      

                            } else if (new_unsent_files.length !== 0) {

                                window.localStorage.setItem('unsent_files', JSON.stringify(new_unsent_files));

                                $('#a_dialog_success_damagereported_unsentfiles').click();

                            } else {

                                $('#a_dialog_success_unsentfiles').click();

                            }

                            that._lg.log('TRACE', '#five #sendalldamages', '#five #sendalldamages success #dialog_success_damagereported_unsentfiles a:contains(Retry) successCbMultipleFile END ');                        

                        };

                        var errorCbMultipleFile = function() {

                            that._lg.log('TRACE', '#five #sendalldamages', '#five #sendalldamages success #dialog_success_damagereported_unsentfiles a:contains(Retry) errorCbMultipleFile START ');                        

                            new_unsent_files.push(unsent_files.splice(0,1)[0]);

                            if (unsent_files.length !== 0) {
                                
                                that._usr.send(
                                    'POST',
                                    'DocumentAttachment/' + unsent_files[0].tt_id,
                                    {},
                                    successCbMultipleFile,
                                    errorCbMultipleFile,
                                    [unsent_files[0].path]                
                                );      

                            } else {

                                window.localStorage.setItem('unsent_files', JSON.stringify(new_unsent_files));

                                $('#dialog_success_damagereported_unsentfiles[data-role=content] p span').html(new_unsent_files.length);                                

                                $('#a_dialog_success_damagereported_unsentfiles').click();

                            }

                            that._lg.log('TRACE', '#five #sendalldamages', '#five #sendalldamages success #dialog_success_damagereported_unsentfiles a:contains(Retry) errorCbMultipleFile END ');                        

                        };

                        that._usr.send(
                            'POST',
                            'DocumentAttachment/' + unsent_files[0].tt_id,
                            {},
                            successCbMultipleFile,
                            errorCbMultipleFile,
                            [unsent_files[0].path]                
                        );

                        that._lg.log('TRACE', '#five #sendalldamages', '#five #sendalldamages success #dialog_success_damagereported_unsentfiles a:contains(Retry) END ');                    

                    });

                    $('#dialog_success_damagereported_unsentfiles a:contains(No)').unbind('click').bind('click', function(e){

                        that._lg.log('TRACE', '#five #sendalldamages', '#five #sendalldamages success #dialog_success_damagereported_unsentfiles a:contains(No) START ');                    

                        e.preventDefault();

                        window.localStorage.removeItem('unsent_files');

                        $.mobile.changePage('#one');

                        that._lg.log('TRACE', '#five #sendalldamages', '#five #sendalldamages success #dialog_success_damagereported_unsentfiles a:contains(No) END ');

                    });

                    $('#dialog_success_damagereported_unsentfiles[data-role=content] p span').html(unsent_files.length);

                    $('#a_dialog_success_damagereported_unsentfiles').click();
                }          

                window.localStorage.removeItem('current_tt');

                that._lg.log('TRACE', '#five #sendalldamages', '#five #sendalldamages success end');

            };

            /**
             * Error callback
             */

            var error = function(error_count, total_count) {

                that._lg.log('TRACE', '#five #sendalldamages', '#five #sendalldamages error start');

                /**
                 * This section need to be tested thoroughly
                 */

                var stt = ttc.getAllAsArray();

                that._current_tt.damages = [];
                
                for (var index in stt) {

                    if (stt.hasOwnProperty(index)) {

                        that._lg.log('DEBUG', '#five #sendalldamages', ' stt[index] instanceof TroubleTicket ' + (stt[index] instanceof TroubleTicket));
                        that._lg.log('DEBUG', '#five #sendalldamages', ' stt[index].damage instanceof Damage ' + (stt[index].get('damage') instanceof Damage));


                        if (stt[index] instanceof TroubleTicket &&
                            stt[index].get('damage') instanceof Damage) {
                            that._current_tt.damages.push(
                                JSON.parse(
                                    stt[index].get('damage').serialize()
                                )
                            );
                        }
                    }
                }

                that._lg.log('DEBUG', '#five #sendalldamages', ' that._current_tt ' + JSON.stringify(that._current_tt));

                window.localStorage.setItem('current_tt', JSON.stringify(that._current_tt));            

                /**
                 * If Number of errors equals total number of damages
                 * which were sent, that means none of the damage report succeded
                 * so we show the user the 'All Error Page' else show the 'Partial Success page'
                 */
                
                if (error_count === total_count) {

                    that._lg.log('TRACE', '#five #sendalldamages', '#five #sendalldamages error launching popup for a_dialog_error_damagereported');

                    $.mobile.urlHistory.stack = [];

                    that._wrapper.clearNavigatorHistory();

                    $('#a_dialog_error_damagereported').click();

                } else {

                    var unsent_files = window.localStorage.getItem('unsent_files');

                    console.log(JSON.stringify(unsent_files));
                    
                    if (unsent_files === null || !(unsent_files instanceof Array)) {
                        unsent_files = [];
                    }
                    
                    if (unsent_files.length === 0) {

                        that._lg.log('TRACE', '#five #sendalldamages', '#five #sendalldamages error no unsent_files');

                        if(typeof window.retry_count === 'undefined')
                        	window.retry_count = 0;
                        
                        if (window.retry_count < 2) {
                        	window.retry_count++;
                        	$('#five #sendalldamages').click();
                        } else {
                            delete window.retry_count;
                        	$('#a_dialog_partialsuccess_damagereported').click();
                        }

                    } else {

                        that._lg.log('DEBUG', '#five #sendalldamages', '#five #sendalldamages error unsent_files ' + unsent_files.length);

                        /**
                         * Attach events for retry and cancel
                         */

                        $('#dialog_partialsuccess_damagereported_unsentfiles a:contains(Retry)').unbind('click').bind('click', function(e){

                            that._lg.log('TRACE', '#five #sendalldamages', '#five #sendalldamages error #dialog_partialsuccess_damagereported_unsentfiles a:contains(Retry) START');

                            e.preventDefault();

                            var new_unsent_files = [];

                            var successCbMultipleFile = function() {

                                that._lg.log('TRACE', '#five #sendalldamages', '#five #sendalldamages error #dialog_partialsuccess_damagereported_unsentfiles a:contains(Retry) successCbMultipleFile START');                            

                                unsent_files.splice(0,1);

                                if (unsent_files.length !== 0) {

                                    that._usr.send(
                                        'POST',
                                        'DocumentAttachment/' + unsent_files[0].tt_id,
                                        {},
                                        successCbMultipleFile,
                                        errorCbMultipleFile,
                                        [unsent_files[0].path]                
                                    );      

                                } else if (new_unsent_files.length !== 0) {

                                    window.localStorage.setItem('unsent_files', JSON.stringify(new_unsent_files));

                                    $('#a_dialog_partialsuccess_damagereported_unsentfiles').click();

                                } else {

                                    $('#a_dialog_success_unsentfiles').click();

                                }

                                that._lg.log('TRACE', '#five #sendalldamages', '#five #sendalldamages error #dialog_partialsuccess_damagereported_unsentfiles a:contains(Retry) successCbMultipleFile END');                                                        

                            };

                            var errorCbMultipleFile = function() {

                                that._lg.log('TRACE', '#five #sendalldamages', '#five #sendalldamages error #dialog_partialsuccess_damagereported_unsentfiles a:contains(Retry) errorCbMultipleFile START');

                                new_unsent_files.push(unsent_files.splice(0,1)[0]);

                                if (unsent_files.length !== 0) {
                                    
                                    that._usr.send(
                                        'POST',
                                        'DocumentAttachment/' + unsent_files[0].tt_id,
                                        {},
                                        successCbMultipleFile,
                                        errorCbMultipleFile,
                                        [unsent_files[0].path]                
                                    );      

                                } else {

                                    window.localStorage.setItem('unsent_files', JSON.stringify(new_unsent_files));

                                    $('#dialog_partialsuccess_damagereported_unsentfiles[data-role=content] p span').html(new_unsent_files.length);                                

                                    $('#a_dialog_partialsuccess_damagereported_unsentfiles').click();

                                }

                                that._lg.log('TRACE', '#five #sendalldamages', '#five #sendalldamages error #dialog_partialsuccess_damagereported_unsentfiles a:contains(Retry) errorCbMultipleFile END');                            

                            };

                            that._usr.send(
                                'POST',
                                'DocumentAttachment/' + unsent_files[0].tt_id,
                                {},
                                successCbMultipleFile,
                                errorCbMultipleFile,
                                [unsent_files[0].path]                
                            );

                            that._lg.log('TRACE', '#five #sendalldamages', '#five #sendalldamages error #dialog_partialsuccess_damagereported_unsentfiles a:contains(Retry) END');                        

                        });

                        $('#dialog_partialsuccess_damagereported_unsentfiles a:contains(No)').unbind('click').bind('click', function(e){

                            that._lg.log('TRACE', '#five #sendalldamages', '#five #sendalldamages error #dialog_partialsuccess_damagereported_unsentfiles a:contains(No) START');                        

                            e.preventDefault();

                            window.localStorage.removeItem('unsent_files');

                            $.mobile.changePage('#five');

                            that._lg.log('TRACE', '#five #sendalldamages', '#five #sendalldamages error #dialog_partialsuccess_damagereported_unsentfiles a:contains(No) END');                                                

                        });

                        $('#dialog_partialsuccess_damagereported_unsentfiles[data-role=content] p span').html(unsent_files.length);

                        $('#a_dialog_partialsuccess_damagereported_unsentfiles').click();
                    
                    }

                }

                that._lg.log('TRACE', '#five #sendalldamages', '#five #sendalldamages error end');
            };

            var status = function(aAttemptCount, aTotalCount){
            	
            	if (typeof window.retry_count === 'undefined')
            		$('#dialog_damage_sending div[data-role=content]').children().first().html(that._language.translate('Completed') + ' ... ' + aAttemptCount + ' ' + that._language.translate('of') + ' ' + aTotalCount);
            	else
            		$('#dialog_damage_sending div[data-role=content]').children().first().html(that._language.translate('Network Error: Retrying') + ' ' + (window.retry_count) + '/2 ...<br/><br/>' +
            				that._language.translate('Completed') + ' ... ' + aAttemptCount + ' ' + that._language.translate('of') + ' ' + aTotalCount);
            };

            /**
             * Show success message
             */

            $('#dialog_damage_sending div[data-role=content]').children().first().html(that._language.translate('Completed') + ' ... 0 ' + that._language.translate('of') + ' ' + ttc.size());
            $('#a_dialog_damage_sending').click(); 

            that._lg.log('TRACE', '#five #sendalldamages', '#five #sendalldamages click end'); 

            ttc.save(success, error, status, 0);
        });

        /**
         * Click event for report another damage
         */    

        $('#five #reportanotherdamage').unbind('click').click(function(){

            if ($(this).data('disabled')) {
                $(this).removeClass('ui-btn-active');
                return false;
            }            

            that._lg.log('TRACE', '#five #reportanotherdamage', '#five #savedamage click start');

            that._current_tt.damages.push({});

            window.localStorage.setItem('current_tt', JSON.stringify(that._current_tt));

            that.enable();

            $.mobile.changePage('#four');  

            that._lg.log('TRACE', '#five #reportanotherdamage', '#five #savedamage click end');   
        }); 

        /**
         * Click event for widget link
         */   

        $('#five .bxslider-five-b li a').die('click').live('click',function(e){

            if ($(this).data('disabled')) {
                $(this).removeClass('ui-btn-active');
                return false;
            }            

            that._lg.log('TRACE', '#five .bxslider-five-b li a', '#five .bxslider-five-b li a click start');

            e.preventDefault();
            window.localStorage.setItem('latest_damage_index', $(this).attr('id'));

            that.enable();

            $.mobile.changePage('#four');

            that._lg.log('TRACE', '#five .bxslider-five-b li a', '#five .bxslider-five-b li a click end');        
        });        
  
    },

    /**
     * Disable Current page
     *   
     * @return {void} 
     */

    disable : function() {

        "use strict";

        $('.bxslider-five-a li a').data('disabled', true);
        $('.bxslider-five-b li a').data('disabled', true);
        $('#five a[data-role=button]').data('disabled', true);
        $('#five a[data-role=button]').addClass('ui-disabled');

    },

    /**
     * Enable Current page
     *   
     * @return {void} 
     */

    enable : function() {

        "use strict";

        $('.bxslider-five-a li a').data('disabled', false);
        $('.bxslider-five-b li a').data('disabled', false);
        $('#five a[data-role=button]').data('disabled', false);
        $('#five a[data-role=button]').removeClass('ui-disabled');

    }, 

    /**
     * Render page
     *   
     * @return {void} 
     */ 

    render : function() {

        "use strict";

        /**
         * -----------------
         * Page Inititialize
         * -----------------
         */

        this._wrapper.clearNavigatorCache();
        this._wrapper.clearNavigatorHistory();
        
        this._lg.log('DEBUG', '#five render', ' number of damages ' + this._current_tt.damages.length);        

        if ( this._current_tt !== null &&
                this._current_tt.damages instanceof Array && 
                this._current_tt.damages.length > 0) {

            $('#five .bxslider-five-b').html('');

            /**
             * Remove blank saved damages
             */
            for (var index in this._current_tt.damages) {
                if (this._current_tt.damages.hasOwnProperty(index)){
                	var str = ' - ' + this._language.translate('Select One') + ' - ';
                	if (this._current_tt.damages[index].damageposition === str || 
                			this._current_tt.damages[index].damagetype === str ||
                			this._current_tt.damages[index].drivercauseddamage === '' ||
                			typeof this._current_tt.damages[index].damageposition === 'undefined' ||
                			typeof this._current_tt.damages[index].damagetype === 'undefined') {
                		this._current_tt.damages.splice(index,1);
                	}
                }
            }
            
            for (var index in this._current_tt.damages) {
                if (this._current_tt.damages.hasOwnProperty(index)){
                    $('#five .bxslider-five-b').append("<li><center><div style='height:60px;'><a id='" + index + "' href='javascript:void(0);'>" + this._current_tt.damages[index].damageposition + '<br/>' + this._current_tt.damages[index].damagetype + "</a></div></center></li>");
                }
            }
            window.slider_five_b.reloadSlider();  
        } 

        var tt_list = JSON.parse(window.localStorage.getItem('tt_list'));
        if (tt_list !== null && this._current_tt !== null && tt_list.html !== '') {
            this._lg.log('DEBUG', '#five render', 'reloading slider for troubleticketlist  to position ' + tt_list.position);        

            $('.bxslider-five-a').html(tt_list.html);
            console.log(tt_list.html);
            window.slider_five_a.reloadSlider();
            window.slider_five_a.goToSlide(tt_list.position);
        } else {
            $('#one #troubleticketlist').html("<li><center><div style='height:60px;'>" + this._language.translate('No Damages Reported') + "</div></center></li>");
            window.slider_five_a.reloadSlider();       
        }
        
        /**
         * Current Object is used to 
         * verify if user has modified anything
         * on the page.
         */
        window.changeInPage = false;
        window.currentObj = {};
    }
});