/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, 
 bitwise:true, strict:true, undef:false, unused:true, 
 curly:true, browser:true, indent:4, maxerr:50 */

/*global Stapes:true, window:true*/
/*exported ScreenFourView*/

/**
 * View Class for screen Four
 * 
 * @fileoverview Class definition of a View of screen four
 * @author anshuk.kumar@essindia.co.in (Anshuk Kumar)
 * @license Commercial - Copyright 2013 Gizur AB
 * @see http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml
 */

var ScreenFourView = Stapes.subclass({
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

        this.extend({
            _lg: aLog,
            _language: aLanguage,
            _usr: aUsr,
            _latest_damage_index: -1,
            _wrapper: aWrapper
        });
        
        if(typeof app.slider_four.reloadSlider === "undefined") {
            app.slider_four = $('.bxslider-four').bxSlider({
                infiniteLoop: false,
                hideControlOnEnd: true,
                pager: true,
                pagerSelector: '#pager-four',
                pagerType: 'short',
                useCSS: false,
                swipeThreshold: 10,
                adaptiveHeight: true
            });
        }
        
        this.validate = function() {
        	var valid = true;
            
        	valid = valid && this._wrapper.checkLength($('#four #damagetype option:selected'), 0, this._language.translate('Please select a damage type'), this._language.translate('Error'));
            
            if(valid)
            valid = valid && this._wrapper.checkLength($('#four #damageposition option:selected'), 0, this._language.translate('Please select a damage position'), this._language.translate('Error'));

            if(valid)
            valid = valid && this._wrapper.checkUndefinedValue($('.drivercauseddamage-radio.btn-success').attr('btn-value'), this._language.translate('Please select, if damage was caused by driver or not'), this._language.translate('Error'));
       
            return valid;
        };

        this.reset = function() {
        	app.changeInPage = false;
        	
        	$('#four #damagetype').val('');
            $('#four #damageposition').val('');
            //$('#four #drivercauseddamage').val('');
            $('.drivercauseddamage-radio').removeClass('btn-success');
        };
        
        this.showPageFive = function(){
        	$('.page-surveys').hide();
        	$('#five').show();
        	
	    	app.prevPage = 'five';
	    	app.surveyPage = 'five';

    	    this.reset();
    	    
    	    var pageFive = new ScreenFiveView(app._usr, app._lg, app._lang, app._wrapper);
    	    pageFive.bindEventHandlers();
    	    pageFive.render();

    	    /**
    	     * Only once this page is completed logger should be allowed 
    	     * to send logs to server
    	     */
    	    app._lg.appLoadingComplete();
    	    
    	    setTimeout(function(){
    			$('html, body').animate({scrollTop: '0px'}, 1500);
    	    }, 1000);
        };
        
        this.getLatestDamageIndex = function() {
        	var latest_damage_index = -1;
        	var current_tt = JSON.parse(window.localStorage.getItem('current_tt'));
        	if (window.localStorage.getItem('latest_damage_index') === null) {
                if (current_tt !== null && current_tt.damages instanceof Array) {
                	latest_damage_index = current_tt.damages.length - 1;
                    this._lg.log('DEBUG', '#four$render', ' latest damage index from last index : ' + latest_damage_index);
                }
            } else {
            	latest_damage_index = window.localStorage.getItem('latest_damage_index');
                this._lg.log('DEBUG', '#four$render', ' latest damage index from cache : ' + latest_damage_index);
            }
        	return latest_damage_index;
        };
    },
    /**
     * Binds events to various elements of the page
     *   
     * @return {void} 
     */

    bindEventHandlers: function() {

        "use strict";

        var that = this;

        /**
         * ------------------
         * Event Bindings
         * ------------------
         */
        
        $('.drivercauseddamage-radio').unbind('click').bind('click', function(e){
        	e.preventDefault();
        	$('.drivercauseddamage-radio').removeClass('btn-success');
        	$(this).addClass('btn-success');
        }),

        /**
         * Click event for saving damage report
         */
        
        

        $('#four #savedamage').unbind('click').click(function(e) {

            var current_tt;
            var damage;
            var documents;

            e.preventDefault();

            that._lg.log('TRACE', '#four #savedamage', '#four #savedamage click start');

            that._lg.log('TRACE', '#four #savedamage', '#four #damagetype option:selected' + $('#four #damagetype option:selected').val());

            that._lg.log('TRACE', '#four #savedamage', '#four #damageposition option:selected' + $('#four #damageposition option:selected').val());

            that._lg.log('DEBUG', '#four #savedamage', '#four .drivercauseddamage-radio.btn-success' + $('.drivercauseddamage-radio.btn-success').attr('btn-value'));
            
            if(that.validate()) {
	            current_tt = JSON.parse(window.localStorage.getItem('current_tt'));
	
	            var latest_damage_index = that.getLatestDamageIndex();
	            
	            damage = {
	                'damagetype': escapeHtmlEntities($('#four #damagetype').val()),
	                'damageposition': escapeHtmlEntities($('#four #damageposition').val()),
	                'drivercauseddamage': escapeHtmlEntities($('.drivercauseddamage-radio.btn-success').attr('btn-value'))
	            };
	            
	            documents = [];
	
	            $('.bxslider-four img').each(function() {
	                that._lg.log('DEBUG', '#four #savedamage found image ' + $(this).attr('src'));
	                documents.push({path: $(this).attr('src')});
	            });
	
	            damage.documents = documents;
	
	            if (!(current_tt.damages instanceof Array)) {
	
	                that._lg.log('TRACE', '#four #savedamage', '#four current_tt.damages not instanceof Array');
	
	                current_tt.damages = [];
	                current_tt.damages.push(damage);
	            } else {
	            	that._lg.log('TRACE', '#four #savedamage', '#four current_tt.damages instanceof Array');
	                if (latest_damage_index !== -1) {
	                    current_tt.damages[latest_damage_index] = damage;
	                } else {
	                    current_tt.damages.push(damage);
	                }
	            }
	
	            that._lg.log('TRACE', '#four #savedamage', '#four #savedamage current_tt' + JSON.stringify(current_tt));
	
	            window.localStorage.setItem('current_tt', JSON.stringify(current_tt));
	
	            that.showPageFive();
            }
            
            that._lg.log('TRACE', '#four #savedamage', '#four #savedamage click end');            
        });

        $('#four #deletedamage').unbind('click').click(function(e) {

            that._lg.log('TRACE', '#four #deletedamage', '#four #deletedamage start');

            e.preventDefault();

            var current_tt = JSON.parse(window.localStorage.getItem('current_tt'));
            var latest_damage_index = that.getLatestDamageIndex();

            // Confirm you want to delete the damage
            
            var confirm = function(button){
            	
            	if(button === 1){
		            if (current_tt !== null && typeof current_tt.damages !== "undefined" && latest_damage_index !== -1) {
		
		                that._lg.log('DEBUG', '#four #deletedamage', '#four #deletedamage latest_damage_index ' + latest_damage_index);
		
		                /**
		                 * Delete the current damage & save back the current ticket
		                 * in the local storage
		                 */
		                current_tt.damages.splice(latest_damage_index, 1);
		                
		
		                window.localStorage.setItem('current_tt', JSON.stringify(current_tt));
		              
		
		                if (current_tt.damages.length === 0) {
		                       
		                    that._lg.log('TRACE', '#four #deletedamage', '#four #deletedamage refresh current page ');
		                  
		                    that.showPageFive();
		                } else {
		
		                    that._lg.log('TRACE', '#four #deletedamage', '#four #deletedamage redirect to screen five ');
		                    
		                    that.showPageFive();
		                }
		            } else {
		            	that.showPageFive();
		            }
            	} else {
            		return false;
            	}
            };
            
        //    if (current_tt !== null && typeof current_tt.damages !== "undefined" && latest_damage_index !== -1)
            	app._wrapper.showConfirm(app._lang.translate("Do you really want to delete the damage")  + '?', confirm, app._lang.translate("Warning"), app._lang.translate("Continue,Cancel"));
            
            that._lg.log('TRACE', '#four #deletedamage', '#four #deletedamage end');
        });

        $('#four #takephoto').unbind('click').click(function() {

            that._lg.log('TRACE', '#four #takephoto', '#four #takephoto click start');

            that._lg.log('DEBUG', '#four #takephoto', '#four #takephoto success $(.bxslider-four).html()' + $('.bxslider-four').html());

            if ($('.bxslider-four img').length > 2) {
            	that._wrapper.showAlert(that._language.translate("You cannot add more than 3 pictures."), that._language.translate("Error"));
                return false;
            }

            var success = function(imageURL) {
            	//Log
                
            	that._lg.log('DEBUG', '#four #takephoto', '#four #takephoto success' + imageURL);

                if ($('.bxslider-four img').length === 0) {
                    $('.bxslider-four').html('');
                }

                $('.bxslider-four').prepend('<li><img style="width:100%;height:auto;" src="' + imageURL + '"/></li>');
                app.slider_four.reloadSlider();
                that._lg.log('DEBUG', '#four #takephoto', '#four #takephoto success $(.bxslider-four).html()' + $('.bxslider-four').html());
            };

            var fail = function(message) {

                //Log
                that._lg.log('DEBUG', '#four #takephoto', '#four #takephoto fail' + message);
                that._lg.log('DEBUG', '#four #takephoto', '#four #takephoto success $(.bxslider-four).html()' + $('.bxslider-four').html());

            };

            try {
	            that._wrapper.getPicture(success, fail, {quality: Config.imageQuality,
	                destinationType: Camera.DestinationType.FILE_URI,
	                targetWidth: Config.imageTargetWidth,
	                correctOrientation: true
	            });
            } catch (err) {
            	that._lg.log('FATAL', '#four #takephoto', 'Fail : ' + JSON.stringify(err));
            }
        });

        $('#four select#damagetype').unbind('change').bind('change', function() {

            that._lg.log('TRACE', '#four select#damagetype', ' start loading dependency');

            var dmg = new Damage(undefined, Config.log);
            var picklist = dmg.get('enum_damagetype');

            for (var index in picklist) {

                if (picklist.hasOwnProperty(index)) {

                    that._lg.log('DEBUG', '#four select#damagetype', ' picklist[index].value ' + picklist[index].value);

                    if (picklist[index].value === escapeHtmlEntities($('#four #damagetype option:selected').attr('value'))) {
                        $('#four select#damageposition').html('');
                        $('#four select#damageposition').append('<option value=""> - ' + that._language.translate('Select One') + ' - </option>');

                        that._lg.log('DEBUG', '#four select#damagetype', ' MATCH ' + picklist[index].value);

                        if (typeof picklist[index].dependency !== 'undefined') {

                            that._lg.log('DEBUG', '#four select#damagetype', ' picklist[index].dependency ' + JSON.stringify(picklist[index].dependency));

                            for (var depindex in picklist[index].dependency.damageposition) {
                                if (picklist[index].dependency.damageposition.hasOwnProperty(depindex)) {
                                    $('#four select#damageposition').append('<option value="' + picklist[index].dependency.damageposition[depindex].value + '">' + picklist[index].dependency.damageposition[depindex].label + '</option>');
                                }
                            }
                        }
                    }
                }

            }

            that._lg.log('TRACE', '#four select#damagetype', ' end loading dependency');
        });

    },
    
    htmlDecode: function(value){ 
	  return $('<div/>').html(value).text(); 
	},
	
    setValues: function(){
    	
    	var that = this;
    	
    	this._wrapper.clearNavigatorCache();
        this._wrapper.clearNavigatorHistory();
        	
        if (app.changeInPage === false) {
        	var current_tt = JSON.parse(window.localStorage.getItem('current_tt'));
        	
        	/**
             * The index of the last damage added
             */
        	
        	var latest_damage_index = this.getLatestDamageIndex();
        	if (current_tt !== null && current_tt.damages instanceof Array && 
        			latest_damage_index !== -1) {
	            
            	$('#four select#damagetype').val(this.htmlDecode(current_tt.damages[latest_damage_index].damagetype));
	            
	            $('#four select#damagetype').change();
	            
	            $('#four select#damageposition').val(this.htmlDecode(current_tt.damages[latest_damage_index].damageposition));
	          
	            $('.drivercauseddamage-radio').removeClass('btn-success');
	           
	            $('.drivercauseddamage-radio[btn-value=' + this.htmlDecode(current_tt.damages[latest_damage_index].drivercauseddamage) + ']').addClass('btn-success');
	            
	            $('.bxslider-four').empty().html("<li>" + this._language.translate('No Picture(s) Attached') + "</li>");

	            /**
	             * Document pictures enum loading
	             */

	            if (latest_damage_index !== -1 &&
	                    (current_tt.damages[latest_damage_index].documents instanceof Array)) {
	                if (current_tt.damages[latest_damage_index].documents.length > 0) {

	                    $('.bxslider-four').html('');
	                    for (index in current_tt.damages[latest_damage_index].documents) {

	                        if (current_tt.damages[latest_damage_index].documents.hasOwnProperty(index)) {
	                            this._lg.log('DEBUG', '#four$render', ' document path ' + current_tt.damages[latest_damage_index].documents[index].path);
	                            $('.bxslider-four').append('<li><img style="width:100%;height:auto;" src="' + current_tt.damages[latest_damage_index].documents[index].path + '"/></li>');
	                        }
	                    }
	                } else {
	                    this._lg.log('DEBUG', '#four$render', ' no documents found ');
	                }
	            }

	            app.slider_four.reloadSlider();
            } else {
            	
            	window.localStorage.setItem('latest_damage_index', -1);
                
            	$('.bxslider-four').empty().html("<li>" + this._language.translate('No Picture(s) Attached') + "</li>");
            	app.slider_four.reloadSlider();
            }
        	
            app.currentObj = {
                'damagetype': $('#four #damagetype option:selected').val(),
                'damageposition': $('#four #damageposition option:selected').val(),
                'drivercauseddamage': $('.drivercauseddamage-radio.btn-success').attr('btn-value')
            };
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
        /**
         * Load the filtered enum_damagetype / enum_damageposition into the select menu
         * and refresh both damagetype and damageposition select menu
         * as jquery mobile needs this, else it does not reflect 
         * on the UI.
         */

        this._lg.log('TRACE', '#four$render', 'start loading values to select menu');

        var dmg = new Damage(this._usr, Config.log);
        var enum_damagetype = dmg.get('enum_damagetype');
        var enum_damageposition;

        this._lg.log('DEBUG', '#four$render', 'enum_damagetype : ' + JSON.stringify(enum_damagetype));

        $('#four select#damagetype').html('');
        $('#four select#damagetype').append('<option value=""> - ' + this._language.translate('Select One') + ' - </option>');
        for (var index in enum_damagetype) {

            if (enum_damagetype.hasOwnProperty(index)) {
                $('#four select#damagetype').append('<option value="' + enum_damagetype[index].value + '">' + this._language.translate(enum_damagetype[index].label) + '</option>');
            }
        }

        /**
         * Damge position enum loading to select menu
         */

        if (typeof enum_damageposition === 'undefined') {
            enum_damageposition = dmg.get('enum_damageposition');
        }

        this._lg.log('DEBUG', '#four$render', 'enum_damageposition : ' + JSON.stringify(enum_damageposition));

        $('#four select#damageposition').html('');
        $('#four select#damageposition').append('<option value=""> - ' + this._language.translate('Select One') + ' - </option>');

        for (index in enum_damageposition) {

            if (enum_damageposition.hasOwnProperty(index)) {
                $('#four select#damageposition').append('<option value="' + enum_damageposition[index].value + '">' + enum_damageposition[index].label + '</option>');
            }
        }

        //Driver caused enum loading to select menu
        this._lg.log('TRACE', '#four$render', 'damage caused damage start ');
        var enum_drivercauseddamage = dmg.get('enum_drivercauseddamage');

        this._lg.log('DEBUG', '#four$render', 'enum_drivercauseddamage : ' + JSON.stringify(enum_drivercauseddamage));

        for (index in enum_drivercauseddamage) {
            if (enum_drivercauseddamage.hasOwnProperty(index)) {
                $('#four select#drivercauseddamage').append('<option value="' + enum_drivercauseddamage[index].value + '">' + this._language.translate(enum_drivercauseddamage[index].label) + '</option>');
            }
        }

        this._lg.log('TRACE', '#four$render', 'end loading values to select menu');
        
        $('.bxslider-four').empty().html("<li>" + this._language.translate('No Picture(s) Attached') + "</li>");

        app.slider_four.reloadSlider();
    }
});

/*
 * Static Vars and Methods
 */
ScreenFourView.extend({
	_reset: function(){    	
    	$('#four #damagetype').val('');
        $('#four #damageposition').val('');
        //$('#four #drivercauseddamage').val('');
        $('.drivercauseddamage-radio').removeClass('btn-success');
    }
});