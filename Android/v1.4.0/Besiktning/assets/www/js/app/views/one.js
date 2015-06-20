/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, 
 bitwise:true, strict:true, undef:false, unused:true, 
 curly:true, browser:true, indent:4, maxerr:50 */

/*global Stapes:true, window:true*/
/*exported ScreenOneView*/

/**
 * View Class for screen One
 * 
 * @fileoverview Class definition of a View of screen one
 * @author anshuk.kumar@essindia.co.in (Anshuk Kumar)
 * @license Commercial - Copyright 2013 Gizur AB
 * @see http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml
 */

var ScreenOneView = Stapes.subclass({
    /**
     * @constructor
     *
     * @param {user}     aUsr       the user who is making calls to server
     * @param {logger}   aLog       object containing the log configuration
     * @param {language} aLanguage  the language object
     * @param {wrapper}  aWrapper   the wrapper object
     */

    constructor: function(aUsr, aLog, aLanguage, aWrapper) {

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
            _lg: aLog,
            _language: aLanguage,
            _usr: aUsr,
            _current_tt: current_tt,
            _tt_list: {},
            _wrapper: aWrapper
        });
           
        /**
         * IF app.slider_one does not have reloadSlider function
         */
        this.bxSettings = {
                infiniteLoop: false,
                hideControlOnEnd: true,
                pager: true,
                pagerSelector: '#pager-one',
                pagerType: 'short',
                useCSS: false,
                swipeThreshold: 10,
                adaptiveHeight: true,
    		    onSliderLoad: function(ci) {
    		    	window.localStorage.setItem('details_tt_id', $( ".bxslider-one li:nth-child(" + (ci + 1) + ") a" ).attr('id'));
    		    },
    		    onSlideAfter: function(se, oi, ci){
    		    	window.localStorage.setItem('details_tt_id', $( ".bxslider-one li:nth-child(" + (ci + 1) + ") a" ).attr('id'));
    		    }
            };
        if(typeof app.slider_one.reloadSlider === "undefined") {
            app.slider_one = $('.bxslider-one').bxSlider(this.bxSettings);
        }
    
        this.validate = function() {
        	var valid = true;
            valid = valid && this._wrapper.checkLength($('#one #trailertype option:selected'), 0, this._language.translate('Please select Trailer Type'), this._language.translate('Error'));
            
            if(valid)
            valid = valid && this._wrapper.checkLength($('#one #trailerid option:selected'), 0, this._language.translate('Please select a Trailer'), this._language.translate('Error'));

            if(valid)
            valid = valid && this._wrapper.checkLength($('#one #place option:selected'), 0, this._language.translate('Please select a Place'), this._language.translate('Error'));

            if(valid)
            valid = valid && this._wrapper.checkUndefinedValue($('.sealed-radio.btn-success').attr('btn-value'), this._language.translate('Please select if sealed or not'), this._language.translate('Error'));
            
            return valid;
        };
        
        this.reset = function() {
        	app.changeInPage = false;
        	
        	$('#one #trailertype').val('');
            $('#one #trailerid').val('');
            $('#one #place').val('');
            
            $('.sealed-radio').removeClass('btn-success');
            
            $('#one #troubleticketlist').empty().html("<li>" + app._lang.translate('No Damages Reported') + "</li>");
            app.slider_one.reloadSlider();
        };

        this.show = function(){
        	app.surveyPage = "one";
        	app.prevPage = "one";
        	
        	$('.page-surveys').hide();
        	$('#one').show();

        	$('html, body').animate({scrollTop: '0px'}, 1500);
        };
        
        this.resetCache = function(){
        	window.localStorage.removeItem('tt_list');
            window.localStorage.removeItem('current_tt');
        };
        
        this.openBasicDialog = function(header, body){
        	$('.modal').modal('hide');
        	
        	$('#basicDialogHeader').empty().html(header);
        	$('#basicDialogBody p').empty().html(body);
        	
        	$('#basicDialog').modal('show');
        };
        
        this.showPageFour = function(){
        	
        	$('.page-surveys').hide();
        	$('#four').show();
        	
        	app.prevPage = 'four';
            app.surveyPage = 'four';

            this.reset();
            
            var pageFour = new ScreenFourView(app._usr, app._lg, app._lang, app._wrapper);
            
            if(!app.pageFourLoaded) {
                pageFour.render();
                pageFour.bindEventHandlers();
                
                app.pageFourLoaded = true;
            }
            
            pageFour.setValues();

            $('html, body').animate({scrollTop: '0px'}, 1500);
        };
        
        this.showPageTwo = function(){
        	var pageTwo = new ScreenTwoView(app._lg, app._lang, app._wrapper);
            pageTwo.show();        	
        };
        
        this.showViewMoreSurverypage = function() {
        	$('.page-surveys').hide();
        	$("#viewMoreDamages").show();
        };
        this.minLimits = 0;
        this.maxLimits = 4;
    },
    /**
     * Binds events to various elements of the page
     *   
     * @return {void} 
     */

    bindEventHandlers: function() {

        "use strict";

        var that = this;
        
        $('.sealed-radio').unbind('click').bind('click', function(e){
        	e.preventDefault();
        	$('.sealed-radio').removeClass('btn-success');
        	$(this).addClass('btn-success');
        }),
        
        $('#showSurveyPageAndResetBtn').unbind('click').bind('click', function(e){
        	e.preventDefault();
        	that.reset();
        	that.resetCache();
        	$('#pages-tab a[href="#survey"]').tab('show');
        }),
        
        /**
         * OnChange Event for trailer type
         * load matching assets into trailerid select menu
         */

        $('#one select#trailertype').unbind('change').change(function() {
            that._lg.log('TRACE', '#one select#trailertype', 'trailertype change event start');
            /**
             * Update the existing damage slider to default state
             */
            $('#one #troubleticketlist').empty().html("<li>" + app._lang.translate('No Damages Reported') + "</li>");
            app.slider_one.reloadSlider();
                                                             
                                                             
            /**
             * Create the assetcollection object
             * this object automatically loads the cached
             * list of assets
             */

            var ac = new AssetCollection(that._usr, Config.log);

            that._lg.log('TRACE', 'assets filtered START');

            /**
             * Use stapes method to filter out related trailer ids
             */

            var assets = ac.filter(function(item, key) {

                key = undefined;

                return item.get('trailertype') === $('#one select#trailertype option:selected').html();
            });

            that._lg.log('DEBUG', '#one select#trailertype', 'assets filtered list : ' + JSON.stringify(assets));

            that._lg.log('TRACE', '#one select#trailertype', 'assets filtered END');

            /**
             * Load the filtered trailer ids into the select menu
             * and refresh both trailer id and trailer type select menu
             * as jquery mobile needs this, else it does not reflect 
             * on the UI.
             */

            $('#one select#trailerid').html('');

            $('#trailerid').append('<option value=""> - ' + that._language.translate('Select One') + ' - </option>');

            for (var index in assets) {
                if (assets.hasOwnProperty(index)) {
                    $('#trailerid').append('<option value="' + assets[index].get('assetname') + '">' + assets[index].get('assetname') + '</option>');
                }
            }

            that._lg.log('TRACE', '#one select#trailertype', 'trailertype change event end');
        });

        /**
         * OnChange Event for trailer id
         * get Damaged trouble tickets of the given trailer id
         */
        
       
        
        var extDmg = function(tp, cur, minLimits, maxLimits) {
            that._lg.log('TRACE', '#one select#trailerid', 'trailerid change event start');
             
            /**
             * Update the existing damage slider to default state
             */
            if(tp!='mr') {
            
             $('#one #troubleticketlist').empty().html("<li>" + that._language.translate('Loading...') + "</li>");
             app.slider_one.reloadSlider($.extend(that.bxSettings,{startSlide:0}));
            }
           

            /**
             * Create the assetcollection object
             * this object automatically loads the cached
             * list of assets
             */
            
            
            that.arrDmg = [];
            var ttc = new TroubleTicketCollection(that._usr, Config.log);

            var success = function(data) {
            	
                data = undefined;

                /**
                 * Enable the page back
                 */
                
                that.enable();
                
                if(cur!=null) {
                 $(cur).parent().remove();
                } else {
                 var arrDmg = [];
                }
                
                
                that._lg.log('TRACE', '#one select#trailerid', ' fetch tt success : start ');
                var tts = ttc.getAll();
                
                //A memory issue is encountered when the following 
                //line is uncommented
                //that._lg.log('DEBUG', ' tts ' + JSON.stringify(tts));
                that._lg.log('DEBUG', '#one select#trailerid', ' typeof tts ' + (typeof tts));
                that._lg.log('DEBUG', '#one select#trailerid', ' tts.length ' + tts.length);
                if (ttc.size() === 0) {
                	if(tp!='mr') {
                    $('#one #troubleticketlist').empty().html("<li>" + that._language.translate('No Damages Reported') + "</li>");
                	} else {	
                		$("#existingSuccessDialog").modal("show");
                		$(cur).parent().remove();
                		app.slider_one.reloadSlider($.extend(that.bxSettings,{startSlide:app.slider_one.getCurrentSlide()-1}));
                		
                	}
                } else {
                	 if(tp!='mr') {
                      $('#one #troubleticketlist').empty();
                	 }
                }
                if(tp!='mr') {
                that._tt_list = {};
                var tt_list_html = '';
                }
                for (var index in tts) {
                    if (tts.hasOwnProperty(index)) {

                        that._lg.log('DEBUG', '#one select#trailerid', ' tts[index].get(id) ' + tts[index].get('id'));

                        var clipped_tt = tts[index].getAll();
                      

                        that._lg.log('DEBUG', '#one select#trailerid', ' tts[index].asset instanceof Asset ' + (tts[index].get('asset') instanceof Asset));
                        that._lg.log('DEBUG', '#one select#trailerid', "tts[index].get('damageposition') " + tts[index].get('damageposition'));
                        that._lg.log('DEBUG', '#one select#trailerid', "tts[index].get('damagetype') " + tts[index].get('damagetype'));

                        clipped_tt.trailerid = tts[index].get('asset').get('assetname');
                      
                        delete clipped_tt.asset;
                        delete clipped_tt.enum_place;
                        delete clipped_tt.enum_sealed;
                      
                        var li_tt = "<li><a id='" + clipped_tt.id + "' href='javascript:void(0);'>" + tts[index].get('damageposition') + '<br/>' + tts[index].get('damagetype') + "</a></li>";

                        tt_list_html += li_tt;
                        that.arrDmg.push(li_tt);
                       
                       
                        window.localStorage.setItem(tts[index].get('id') + '_tt', JSON.stringify(clipped_tt));
                       
                        $('#one #troubleticketlist').append(li_tt);
                        if (ttc.size() > 0) {
                        	 that.minLimits = minLimits+ttc.size(); 
                        } else {
                        	alert("No more damages found!"); 
                        }
                    }
                }
               
                
                /**
                 * Save the downloaded trouble ticket collection
                 */
               
               
             
            	   tt_list_html += "<li><a href='javascript:void(0)' id='vmore'>View More</a></li>";
            	   that._tt_list.html = tt_list_html;
                   that._tt_list.position = 0;       
                window.localStorage.setItem('tt_list', JSON.stringify(that._tt_list));
               
               if (ttc.size() > 0) { 
               $('#one #troubleticketlist').append("<li><a href='javascript:void(0)' id='vmore'>View More</a></li>");
               }
                if(tp!='mr') {
                 app.slider_one.reloadSlider();
                } else{
                 app.slider_one.reloadSlider($.extend(that.bxSettings,{startSlide:app.slider_one.getCurrentSlide()}));
                } 
                
                
                that._lg.log('TRACE', '#one select#trailerid', ' fetch tt success : end ');
            }; 

            var error = function(jqxhr, status, er) {

                er = undefined;

                if (jqxhr.status === 0 || status === null) {

                    $('#a_dialog_nointernet').click();

                }

                that.enable();
            };
            

            $('#dialog_nointernet a[data-role=button]').attr('href', '#one');

            /**
             * Disable the page
             */
             
            that.disable();
            var assetsObj = {assetname:$('#one select#trailerid option:selected').text(),
            		         minLimit:that.minLimits,
            		         maxLimit:maxLimits};
            ttc.getDamagedTroubleTicketsByAsset(assetsObj, success, error);

            that._lg.log('TRACE', '#one select#trailerid', 'trailerid change event end');
        
        }
        
        /** 
         * View more damages
         */
       
        $(document).on('click',"#vmore",function(e) { 
        	e.preventDefault();
        	$(this).html("loading more..");
        	extDmg('mr', this, that.minLimits, that.maxLimits);
        });
       
        $('#one select#trailerid').unbind('change').change(function() {
        	that.minLimits=0;
        	extDmg('chg', null, that.minLimits, that.maxLimits); 
        });

        /**
         * OnChange Event for trailer id
         * get Damaged trouble tickets of the given trailer id
         */

        $('#one #reportsurvey').unbind('click').click(function() {

            if ($(this).data('disabled')) {
                $(this).removeClass('ui-btn-active');
                return false;
            }

            that._lg.log('TRACE', '#one #reportsurvey', 'reportsurvey click START');

            app.changeInPage = false;

            /**
             * Save the state of page one
             */

            if (that._current_tt === null) {
                that._current_tt = {};
            }

            /**
             * Validate
             */
            
            if(that.validate()) {
            	
            	that.openBasicDialog(that._language.translate('Processing'), that._language.translate('Please wait') +  ' ...');
            	
            	/**
            	 * Save the current TT
            	 */
            	that._current_tt.trailertype = escapeHtmlEntities($('#one #trailertype option:selected').val());
                that._current_tt.trailerid = escapeHtmlEntities($('#one #trailerid option:selected').val());
                that._current_tt.place = escapeHtmlEntities($('#one #place option:selected').val());
                that._current_tt.sealed = escapeHtmlEntities($('.sealed-radio.btn-success').attr('btn-value'));

                window.localStorage.setItem('current_tt', JSON.stringify(that._current_tt));

		        /**
		         * Create the assetcollection object
		         * this object automatically loads the cached
		         * list of assets
		         */
		
		        var tt = new TroubleTicket(that._usr, Config.log);
		
		        var success = function(data) {
		
		        	that.reset();
		        	that.resetCache();		        	
		        	
		        	data = undefined;
		
		            /**
		             * Clear the cache
		             */
		
		            window.localStorage.removeItem('current_tt');
		
		            /**
		             * Removed History
		             */
		
		            that._wrapper.clearNavigatorHistory();
		
		            /**
		             * Show success message
		             */
		
		            $('.modal').modal('hide');
		            $('#surveySuccessDialog').modal('show');
		        };
		
		        var error = function(jqxhr, status, er) {
		
		            jqxhr = status = er = undefined;
		
		            //Show error pop up
		            $('.modal').modal('hide');
		            $('#surveyErrorDialog').modal('show');
		        };
		
		        var ast = new Asset(undefined, Config.log);
		        ast.set('assetname', escapeHtmlEntities($('#one #trailerid option:selected').val()));
		
		        tt.set({
		            'asset': ast,
		            'place': escapeHtmlEntities($('#one #place option:selected').val()),
		            'sealed': escapeHtmlEntities($('.sealed-radio.btn-success').attr('btn-value'))
		        });
		
		        tt.save(success, error);
		
		        that._lg.log('TRACE', '#one #reportsurvey', 'reportsurvey click END');
		    }
        });

        /**
         * Report damage
         * get Damaged trouble tickets of the given trailer id
         */

        $('#one #reportdamage').unbind('click').click(function(e) {
        	e.preventDefault();
        	
            if ($(this).data('disabled')) {
                $(this).removeClass('ui-btn-active');
                return false;
            }

            that._lg.log('TRACE', '#one #reportsurvey', 'reportdamage click START');

            app.changeInPage = false;
            
            if (that._current_tt === null) {
                that._current_tt = {};
            }

            /**
             * Validate
             */
            
            if(that.validate()) {            	
            	/**
            	 * Save the current TT
            	 */
            	that._current_tt.trailertype = escapeHtmlEntities($('#one #trailertype option:selected').val());
                that._current_tt.trailerid = escapeHtmlEntities($('#one #trailerid option:selected').val());
                that._current_tt.place = escapeHtmlEntities($('#one #place option:selected').val());
                that._current_tt.sealed = escapeHtmlEntities($('.sealed-radio.btn-success').attr('btn-value'));

                window.localStorage.setItem('current_tt', JSON.stringify(that._current_tt));

                that._lg.log('TRACE', '#one #reportsurvey', 'reportdamage current tt saved : ' + JSON.stringify(that._current_tt));

                that.showPageFour();
            }

            that._lg.log('TRACE', '#one #reportsurvey', 'reportdamage click END');
        });

        /**
         * OnClick of a trouble ticket in widget list
         * 
         */

        $('.bxslider-one').unbind('click').click(function(e) {
        	if ($(this).data('disabled')) {
                $(this).removeClass('ui-btn-active');
                return false;
            }

           e.preventDefault();

            app.changeInPage = true;
            
            var tt = new TroubleTicket(that._usr, Config.log);

            that._lg.log('TRACE', '.bxslider-one li a', '.bxslider-one li click start');
            that._lg.log('DEBUG', '.bxslider-one li a', " $(this).attr('id') " + $(this).attr('id'));

            // Save the position

            that._tt_list = JSON.parse(window.localStorage.getItem('tt_list'));
            that._tt_list.position = app.slider_one.getCurrentSlide();
            window.localStorage.setItem('tt_list', JSON.stringify(that._tt_list));
            
            var id = window.localStorage.getItem('details_tt_id');
            
            console.log(JSON.stringify(window.localStorage.getItem(id + '_tt')));
            
            /**
             * Save the page state
             */

            if (that._current_tt === null) {
                that._current_tt = {};
            }

            that._current_tt.trailertype = escapeHtmlEntities($('#one #trailertype option:selected').val());
            that._current_tt.trailerid = escapeHtmlEntities($('#one #trailerid option:selected').val());
            that._current_tt.place = escapeHtmlEntities($('#one #place option:selected').val());
            that._current_tt.sealed = escapeHtmlEntities($('.sealed-radio.btn-success').attr('btn-value'));

            window.localStorage.setItem('current_tt', JSON.stringify(that._current_tt));
            that._lg.log('TRACE', '.bxslider-one li', 'completedCb saved current tt state');
            
            that.showPageTwo();
       });
    },
    /**
     * Disable Current page
     *   
     * @return {void} 
     */

    disable: function() {

        "use strict";

    },
    /**
     * Enable Current page
     *   
     * @return {void} 
     */

    enable: function() {

        "use strict";

    },
    
    htmlDecode: function(value){ 
	  return $('<div/>').html(value).text(); 
	},
    
    setValues: function() {
    	"use strict";   	
        try{
        	$('#two #pageTwoBackButton').attr('back-page', 'one');
        	
	        this._wrapper.clearNavigatorCache();
	        this._wrapper.clearNavigatorHistory();
	        
	        if (app.changeInPage === false) {
	        	if (this._current_tt !== null){	
	        		
	        		$('#one select#trailertype').val(this.htmlDecode(this._current_tt.trailertype));
	        		
	        		$('#one select#trailertype').trigger("change");
	                
	        		$('#one select#trailerid').val(this.htmlDecode(this._current_tt.trailerid));
	        		
	        		$('#one select#place').val(this.htmlDecode(this._current_tt.place));
	        		
	        		$('.sealed-radio').removeClass('btn-success');
	        		
	        		$('button.sealed-radio[btn-value=' + this.htmlDecode(this._current_tt.sealed) + ']').addClass('btn-success');
	        		
	        		this._tt_list = JSON.parse(window.localStorage.getItem('tt_list'));
	        		var empty = ($('#one select#trailerid').val().length > 0) && ($('#one select#trailertype').val().length > 0);
	                
	        		if (empty && this._tt_list !== null && this._current_tt !== null && this._tt_list.html !== '') {
	                    this._lg.log('DEBUG', 'reloading slider for troubleticketlist to position ' + this._tt_list.position);
	
	                    $('#one #troubleticketlist').empty().html(this._tt_list.html);
	                    app.slider_one.goToSlide(this._tt_list.position);
	                    app.slider_one.reloadSlider();
	                } else {
	                    window.localStorage.removeItem('tt_list');
	                    $('#one #troubleticketlist').empty().html("<li>" + this._language.translate('No Damages Reported') + "</li>");
	                    app.slider_one.reloadSlider();
	                }
	            } else {
	                window.localStorage.removeItem('tt_list');
	                $('#one #troubleticketlist').empty().html("<li>" + this._language.translate('No Damages Reported') + "</li>");
	                app.slider_one.reloadSlider();
	            }
	                            
	        	var se = $('.sealed-radio.btn-success').attr('btn-value');
            	
	        	app.currentObj = {
	                trailertype: $('#one #trailertype option:selected').val(),
	                trailerid: $('#one #trailerid option:selected').val(),
	                place: $('#one #place option:selected').val(),
	                sealed: se ? se : ""
	            };
	        } 
        }catch(err){
            this._lg.log('FATAL', '#one$setValues', err.message);
        }
        app.changeInPage = false;
    },
    /**
     * Render page
     *   
     * @return {void}
     */

    render: function() {

        "use strict";
        try{
        
        /**
         * Load from cache if available
         * this cache is cleared when the Troubleticket is submitted successfully
         */

        /**
         * Create a new Asset object this object should have a cached
         * enum list of trailer types
         */
        var ast = new Asset(this._usr, Config.log);
        var enum_trailertype = ast.get('enum_trailertype');

        $('#one select#trailerid').empty();

        this._lg.log('DEBUG', '#one$render', 'enum_trailertype : ' + JSON.stringify(enum_trailertype));

        /**
         * Load the trailer types into the select menu
         * and refresh UI.
         */

        $('#one select#trailertype').html('');
        $('#one select#trailertype').append('<option value=""> - ' + this._language.translate('Select One') + ' - </option>');
        for (var index in enum_trailertype) {
            if (enum_trailertype.hasOwnProperty(index)) {
            	$('#one select#trailertype').append('<option value="' + enum_trailertype[index].value + '">' + enum_trailertype[index].label + '</option>');
            }
        }

        /**
         * Load the trailerids based on the trailer typ
         *
         */

        var ac = new AssetCollection(this._usr, Config.log);
        var assets = ac.filter(function(item, key) {

            key = undefined;

            return item.get('trailertype') === $('#one select#trailertype option:selected').text();
        });

        $('#trailerid').append('<option value=""> - ' + this._language.translate('Select One') + ' - </option>');

        for (index in assets) {
            if (assets.hasOwnProperty(index)) {
                $('#trailerid').append('<option value="' + assets[index].get('assetname') + '">' + assets[index].get('assetname') + '</option>');
            }
        }

        /**
         * Create a new TroubleTicket object this object should have a cached
         * enum sealed
         */

        var tt = new TroubleTicket(this._usr, Config.log);
        
        var enum_sealed = tt.get('enum_sealed');
        var enum_place = tt.get('enum_place');

        this._lg.log('DEBUG', '#one$render', 'enum_sealed : ' + JSON.stringify(enum_sealed));

        /**
         * Load the place into the select menu
         * and refresh UI.
         */
        
        $('#one select#place').html('');
        $('#one select#place').append('<option value=""> - ' + this._language.translate('Select One') + ' - </option>');

        for (index in enum_place) {
            if (enum_place.hasOwnProperty(index)) {
            	$('#one select#place').append('<option value="' + enum_place[index].value + '">' + enum_place[index].label + '</option>');
            }
        }

        this._lg.log('DEBUG', '#one$render', '#one select#place html : ' + $('#one select#place').html());
                                    
        }catch(err){
            this._lg.log('FATAL', '#one$render', err.message);
        }
    }
});
/*
 * Static Vars and Methods
 */
ScreenOneView.extend({
	_resetAndShow: function(){
		app.surveyPage = "one";
    	app.prevPage = "one";
    	
    	app.currentObj = {
            trailertype: "",
            trailerid: "",
            place: "",
            sealed: ""
        };
    	
		var pageOne = new ScreenOneView(app._usr,
				app._lg, app._lang, app._wrapper);
		
		app.pageFourLoaded = false;
    	pageOne.reset();
    	pageOne.resetCache();
    	pageOne.show();
    }
});
