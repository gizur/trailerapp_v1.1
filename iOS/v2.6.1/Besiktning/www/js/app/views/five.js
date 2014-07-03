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
        
        if(typeof app.slider_five_a.reloadSlider === "undefined") {
            app.slider_five_a = $('.bxslider-five-a').bxSlider({
                infiniteLoop: false,
                hideControlOnEnd: true,
                pager: true,
                pagerSelector: '#pager-five-a',
                pagerType: 'short',
                useCSS: false,
                swipeThreshold: 10,
    		    responsive: false,
                adaptiveHeight: true,
    		    onSliderLoad: function(ci) {
    		    	window.localStorage.setItem('details_tt_id', $( ".bxslider-five-a li:nth-child(" + (ci + 1) + ") a" ).attr('id'));
    		    },
    		    onSlideAfter: function(se, oi, ci){
    		    	window.localStorage.setItem('details_tt_id', $( ".bxslider-five-a li:nth-child(" + (ci + 1) + ") a" ).attr('id'));
    		    }
            });
        }
        
        if(typeof app.slider_five_b.reloadSlider === "undefined") {
            app.slider_five_b = $('.bxslider-five-b').bxSlider({
                infiniteLoop: false,
                hideControlOnEnd: true,
                pager: true,
                pagerSelector: '#pager-five-b',
                pagerType: 'short',
                useCSS: false,
                swipeThreshold: 10,
    		    responsive: false,
                adaptiveHeight: true,
    		    onSliderLoad: function(ci) {
    		    	window.localStorage.setItem('latest_damage_index', $( ".bxslider-five-b li:nth-child(" + (ci + 1) + ") a" ).attr('id'));
    		    },
    		    onSlideAfter: function(se, oi, ci){
    		    	window.localStorage.setItem('latest_damage_index', $( ".bxslider-five-b li:nth-child(" + (ci + 1) + ") a" ).attr('id'));
    		    }
            });
        }
        
        this.extend({
            _lg : aLog,
            _language : aLanguage,
            _usr : aUsr,
            _current_tt : current_tt,
            _wrapper: aWrapper
        });

        this.showPageOne = function(){
        	app.surveyPage = "one";
        	app.prevPage = "one";
        	
        	$('.page-surveys').hide();
        	$('#one').show();
        	
        	$('#pages-tab a[href="#survey"]').click();
        };
        
        this.showPageFour = function(){
        	var pageOne = new ScreenOneView(app._usr,
					app._lg, app._lang, app._wrapper);
        	pageOne.showPageFour();
        };
        
        this.resetFormFour = function() {
        	var pageFour = new ScreenFourView(app._usr, app._lg, app._lang, app._wrapper);
        	pageFour.reset();
        };
        
        this.resetFormOne = function() {
        	var pageOne = new ScreenOneView(app._usr,
					app._lg, app._lang, app._wrapper);
        	pageOne.reset();
        };
        
        this.resetCurrentTT = function() {
        	var pageOne = new ScreenOneView(app._usr,
					app._lg, app._lang, app._wrapper);
        	pageOne.resetCache();
        };
        
        this.showPageTwo = function(){
        	var pageTwo = new ScreenTwoView(app._lg, app._lang, app._wrapper);
            pageTwo.show();
        };
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

        $('.bxslider-five-a').unbind('click').click(function(e){
            try {

                if ($(this).data('disabled')) {
                    $(this).removeClass('ui-btn-active');
                    return false;
                }

                e.preventDefault();
                e.stopPropagation();

                var tt = new TroubleTicket(that._usr, Config.log);

                that._lg.log('TRACE', '.bxslider-five-a li a', '.bxslider-one li a click start');

                // Save the position

                that._tt_list = JSON.parse(window.localStorage.getItem('tt_list'));
                that._tt_list.position = app.slider_five_a.getCurrentSlide();
                
                window.localStorage.setItem('tt_list', JSON.stringify(that._tt_list));
                
                var id = window.localStorage.getItem('details_tt_id');
                
                that.showPageTwo();
                
            } catch (err) {

                /**
                 * Uncaught error catching and log it as FATAL
                 */

                that._lg.log('FATAL', '.bxslider-five-a li a', err.message + " : " + JSON.stringify(err));

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

                    $('.modal').modal('hide');
                    $('#damageReportSuccessDialog').modal('show');

                } else {

                    /**
                     * Attach events for retry and cancel
                     */

                    $('#unsentFilesRetryYesButton').unbind('click').bind('click', function(e){

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

                                $('.modal').modal('hide');
                                $('#a_dialog_success_damagereported_unsentfiles').modal("show");

                            } else {
                            	$('.modal').modal('hide');
                                $('#a_dialog_success_unsentfiles').modal("show");
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

                                $('#dialog_success_damagereported_unsentfiles[class="modal-body"] p span').html(new_unsent_files.length);                                

                                $('.modal').modal('hide');
                                $('#a_dialog_success_damagereported_unsentfiles').modal("show");

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

                    $('#unsentFilesRetryNoButton').unbind('click').bind('click', function(e){

                        that._lg.log('TRACE', '#five #sendalldamages', '#five #sendalldamages success #dialog_success_damagereported_unsentfiles a:contains(No) START ');                    

                        e.preventDefault();

                        window.localStorage.removeItem('unsent_files');

                        that.resetFormOne();
                        that.resetFormFour();
                        
                    	that.showPageOne();

                        that._lg.log('TRACE', '#five #sendalldamages', '#five #sendalldamages success #dialog_success_damagereported_unsentfiles a:contains(No) END ');

                    });

                    $('#dialog_success_damagereported_unsentfiles[class="modal-body"] p span').empty().html(unsent_files.length);

                    $('.modal').modal('hide');
                    $('#dialog_success_damagereported_unsentfiles').modal('show');
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

                    that._wrapper.clearNavigatorHistory();

                    $('#errorDialogHeader').empty().html(that._language.translate('Error'));
                    $('#errorDialogBody').empty().html(that._language.translate('Error while reporting damages. Please try again, If the problem persists please contact the Gizur Saas Account holders') + '.');
                    
                    $('.modal').modal('hide');
                    $('#errorDialog').modal("show");

                } else {

                    var unsent_files = window.localStorage.getItem('unsent_files');

                    console.log(JSON.stringify(unsent_files));
                    
                    if (unsent_files === null || !(unsent_files instanceof Array)) {
                        unsent_files = [];
                    }
                    
                    if (unsent_files.length === 0) {

                        that._lg.log('TRACE', '#five #sendalldamages', '#five #sendalldamages error no unsent_files');

                        $('.modal').modal('hide');
                        $('#a_dialog_partialsuccess_damagereported').modal('show');

                    } else {

                        that._lg.log('DEBUG', '#five #sendalldamages', '#five #sendalldamages error unsent_files ' + unsent_files.length);

                        /**
                         * Attach events for retry and cancel
                         */

                        $('#partialSuccessRetryYesButton').unbind('click').bind('click', function(e){

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

                                    $('.modal').modal('hide');
                                    $('#dialog_partialsuccess_damagereported_unsentfiles').modal('show');

                                } else {

                                	$('.modal').modal('hide');
                                    $('#dialog_success_unsentfiles').modal("show");

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

                                    $('#dialog_partialsuccess_damagereported_unsentfiles[class="modal-body"] p span').html(new_unsent_files.length);                                

                                    $('.modal').modal('hide');
                                    $('#dialog_partialsuccess_damagereported_unsentfiles').model("show");

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

                        $('#partialSuccessRetryNoButton').unbind('click').bind('click', function(e){

                            that._lg.log('TRACE', '#five #sendalldamages', '#five #sendalldamages error #dialog_partialsuccess_damagereported_unsentfiles a:contains(No) START');                        

                            e.preventDefault();

                            window.localStorage.removeItem('unsent_files');

                            $('.modal').modal('hide');

                            that._lg.log('TRACE', '#five #sendalldamages', '#five #sendalldamages error #dialog_partialsuccess_damagereported_unsentfiles a:contains(No) END');                                                

                        });

                        $('#dialog_partialsuccess_damagereported_unsentfiles[class="modal-body"] p span').html(unsent_files.length);

                        $('.modal').modal('hide');
                        $('#dialog_partialsuccess_damagereported_unsentfiles').modal('show');
                    
                    }

                }

                that._lg.log('TRACE', '#five #sendalldamages', '#five #sendalldamages error end');
            };

            var status = function(aAttemptCount, aTotalCount){
            	
            	if (typeof window.retry_count === 'undefined')
            		$('#damageReportSendingDialogBody p').empty().html(that._language.translate('Completed') + ' ... ' + aAttemptCount + ' ' + that._language.translate('of') + ' ' + aTotalCount);
            	else
            		$('#damageReportSendingDialogBody p').empty().html(that._language.translate('Network Error: Retrying') + ' ' + (window.retry_count) + '/2 ...<br/><br/>' +
            				that._language.translate('Completed') + ' ... ' + aAttemptCount + ' ' + that._language.translate('of') + ' ' + aTotalCount);
            };

            /**
             * Show success message
             */

            $('.modal').modal('hide');
            $('#damageReportSendingDialogBody p').empty().html(that._language.translate('Completed') + ' ... 0 ' + that._language.translate('of') + ' ' + ttc.size());
            $('#damageReportSendingDialog').modal('show');

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

            if(typeof that._current_tt.damages === "undefined")
            	that._current_tt.damages = [];
            
            that._current_tt.damages.push({});

            window.localStorage.setItem('current_tt', JSON.stringify(that._current_tt));
            
            window.localStorage.removeItem('latest_damage_index');

            that.enable();

            that.showPageFour(); 

            that._lg.log('TRACE', '#five #reportanotherdamage', '#five #savedamage click end');   
        });

        $('#five .bxslider-five-b').unbind('click').click(function(e){
        	that.showPageFour();
        });
        
        $('#showSurveyPageOneAndResetBtn').unbind('click').click(function(e){
        	e.preventDefault();
        	/**
             * Reset Forms
             */
            that.resetFormOne();
            that.resetCurrentTT();
            that.resetFormFour();
            
            app.changeInPage = false;
            app.pageOneLoaded = false;
        	that.showPageOne();
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
        $('#two #pageTwoBackButton').attr('back-page', 'five');
        
        this._wrapper.clearNavigatorCache();
        this._wrapper.clearNavigatorHistory();
        
        //this._lg.log('DEBUG', '#five render', ' number of damages ' + this._current_tt.damages.length);        

        if ( this._current_tt !== null ) {

            var html = "";

            if ( this._current_tt.damages instanceof Array && 
            		this._current_tt.damages.length > 0 ) {
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
	                	html += "<li><a id='" + index + "' href='javascript:void(0);'>" + this._current_tt.damages[index].damageposition + '<br/>' + this._current_tt.damages[index].damagetype + "</a></li>";
	                }
	            }
            } else {
            	html = "<li>" + this._language.translate('No Damages Reported') + "</li>";
            }
            $('#five .bxslider-five-b').empty().html(html);
            app.slider_five_b.reloadSlider();  
        } 

        var tt_list = JSON.parse(window.localStorage.getItem('tt_list'));
        if (tt_list !== null && this._current_tt !== null && tt_list.html !== '') {
            this._lg.log('DEBUG', '#five render', 'reloading slider for troubleticketlist  to position ' + tt_list.position);        

            $('.bxslider-five-a').html(tt_list.html);
            app.slider_five_a.reloadSlider();
            app.slider_five_a.goToSlide(tt_list.position);
        } else {
            $('#one #troubleticketlist').html("<li>" + this._language.translate('No Damages Reported') + "</li>");
            app.slider_five_a.reloadSlider();       
        }
        
        /**
         * Current Object is used to 
         * verify if user has modified anything
         * on the page.
         */
        app.changeInPage = false;
        app.currentObj = {};
    }
});