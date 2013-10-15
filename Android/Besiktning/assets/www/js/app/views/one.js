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
        
        this.validate = function() {
        	var valid = true;
            
        	valid = valid && this._wrapper.checkLength($('#one #trailertype option:selected'), 0, this._language.translate('Please select Trailer Type'), this._language.translate('Error'));
            
            if(valid)
            valid = valid && this._wrapper.checkLength($('#one #trailerid option:selected'), 0, this._language.translate('Please select a Trailer'), this._language.translate('Error'));

            if(valid)
            valid = valid && this._wrapper.checkLength($('#one #place option:selected'), 0, this._language.translate('Please select a Place'), this._language.translate('Error'));

            if(valid)
            valid = valid && this._wrapper.checkUndefined($('#one input[name=sealed]:checked'), this._language.translate('Please select if sealed or not'), this._language.translate('Error'));
            
            return valid;
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
         * OnChange Event for trailer type
         * load matching assets into trailerid select menu
         */

        $('#one select#trailertype').unbind('change').change(function() {
            that._lg.log('TRACE', '#one select#trailertype', 'trailertype change event start');

            /**
             * Update the existing damage slider to default state
             */
            $('#one #troubleticketlist').html("<li><center><div style='height:60px;'>" + that._language.translate('No Damages Reported') + "</div></center></li>");
            window.slider_one.reloadSlider();

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
            $('#one select#trailerid').selectmenu('refresh');
            $('#one select#trailertype').selectmenu('refresh');

            that._lg.log('TRACE', '#one select#trailertype', 'trailertype change event end');
        });

        /**
         * OnChange Event for trailer id
         * get Damaged trouble tickets of the given trailer id
         */

        $('#one select#trailerid').unbind('change').change(function() {
            that._lg.log('TRACE', '#one select#trailerid', 'trailerid change event start');

            /**
             * Update the existing damage slider to default state
             */
            $('#one #troubleticketlist').html("<li><center><div style='height:60px;'>" + that._language.translate('No Damages Reported') + "</div></center></li>");
            window.slider_one.reloadSlider();

            /**
             * Create the assetcollection object
             * this object automatically loads the cached
             * list of assets
             */

            var ttc = new TroubleTicketCollection(that._usr, Config.log);

            $('#one select#trailerid').selectmenu('refresh');

            var success = function(data) {

                data = undefined;

                /**
                 * Enable the page back
                 */

                that.enable();

                that._lg.log('TRACE', '#one select#trailerid', ' fetch tt success : start ');
                var tts = ttc.getAll();

                //A memory issue is encountered when the following 
                //line is uncommented
                //that._lg.log('DEBUG', ' tts ' + JSON.stringify(tts));
                that._lg.log('DEBUG', '#one select#trailerid', ' typeof tts ' + (typeof tts));
                that._lg.log('DEBUG', '#one select#trailerid', ' tts.length ' + tts.length);
                if (ttc.size() === 0) {
                    $('#one #troubleticketlist').html("<li><center><div style='height:60px;'>" + that._language.translate('No Damages Reported') + "</div></center></li>");
                } else {
                    $('#one #troubleticketlist').html('');
                }

                that._tt_list = {};
                var tt_list_html = '';
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

                        var li_tt = "<li><center><div style='height:60px;'><a id='" + clipped_tt.id + "' href='javascript:void(0);'>" + tts[index].get('damageposition') + '<br/>' + tts[index].get('damagetype') + "</a></div></center></li>";

                        tt_list_html += li_tt;

                        $('#one #troubleticketlist').append(li_tt);
                        window.localStorage.setItem(tts[index].get('id') + '_tt', JSON.stringify(clipped_tt));
                    }
                }

                /**
                 * Save the downloaded trouble ticket collection
                 */

                that._tt_list.html = tt_list_html;
                that._tt_list.position = 0;
                window.localStorage.setItem('tt_list', '#one select#trailerid', JSON.stringify(that._tt_list));

                window.slider_one.reloadSlider();
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

            ttc.getDamagedTroubleTicketsByAsset($('#one select#trailerid option:selected').text(), success, error);

            that._lg.log('TRACE', '#one select#trailerid', 'trailerid change event end');
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

            window.changeInPage = false;

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
            	/**
            	 * Save the current TT
            	 */
            	that._current_tt.trailertype = escapeHtmlEntities($('#one #trailertype option:selected').text());
                that._current_tt.trailerid = escapeHtmlEntities($('#one #trailerid option:selected').text());
                that._current_tt.place = escapeHtmlEntities($('#one #place option:selected').text());
                that._current_tt.sealed = escapeHtmlEntities($('#one input[name=sealed]:checked').val());

                window.localStorage.setItem('current_tt', JSON.stringify(that._current_tt));

		        /**
		         * Create the assetcollection object
		         * this object automatically loads the cached
		         * list of assets
		         */
		
		        var tt = new TroubleTicket(that._usr, Config.log);
		
		        var success = function(data) {
		
		        	resetFormOne();
		            data = undefined;
		
		            /**
		             * Clear the cache
		             */
		
		            window.localStorage.removeItem('current_tt');
		
		            /**
		             * Removed History
		             */
		
		            $.mobile.urlHistory.stack = [];
		
		            that._wrapper.clearNavigatorHistory();
		
		            /**
		             * Show success message
		             */
		
		            $('#a_dialog_survey_success').click();
		        };
		
		        var error = function(jqxhr, status, er) {
		
		            jqxhr = status = er = undefined;
		
		            //Show error pop up
		            $('#a_dialog_survey_error').click();
		        };
		
		        var ast = new Asset(undefined, Config.log);
		        ast.set('assetname', escapeHtmlEntities($('#one #trailerid option:selected').text()));
		
		        tt.set({
		            'asset': ast,
		            'place': escapeHtmlEntities($('#one #place option:selected').text()),
		            'sealed': escapeHtmlEntities($('#one input[name=sealed]:checked').val())
		        });
		
		        tt.save(success, error);
		
		        that._lg.log('TRACE', '#one #reportsurvey', 'reportsurvey click END');
		    }
        });

        /**
         * Report damage
         * get Damaged trouble tickets of the given trailer id
         */

        $('#one #reportdamage').unbind('click').click(function() {

            if ($(this).data('disabled')) {
                $(this).removeClass('ui-btn-active');
                return false;
            }

            that._lg.log('TRACE', '#one #reportsurvey', 'reportdamage click START');

            window.changeInPage = false;
            
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
            	that._current_tt.trailertype = escapeHtmlEntities($('#one #trailertype option:selected').text());
                that._current_tt.trailerid = escapeHtmlEntities($('#one #trailerid option:selected').text());
                that._current_tt.place = escapeHtmlEntities($('#one #place option:selected').text());
                that._current_tt.sealed = escapeHtmlEntities($('#one input[name=sealed]:checked').val());

                window.localStorage.setItem('current_tt', JSON.stringify(that._current_tt));

                that._lg.log('TRACE', '#one #reportsurvey', 'reportdamage current tt saved : ' + JSON.stringify(that._current_tt));

            	$.mobile.changePage('#four');
            }

            that._lg.log('TRACE', '#one #reportsurvey', 'reportdamage click END');
        });

        /**
         * OnClick of a trouble ticket in widget list
         * 
         */

        $('.bxslider-one li a').die('click').live('click', function(e) {

            if ($(this).data('disabled')) {
                $(this).removeClass('ui-btn-active');
                return false;
            }

            e.preventDefault();
            e.stopPropagation();

            window.changeInPage = true;
            
            var tt = new TroubleTicket(that._usr, Config.log);

            that._lg.log('TRACE', '.bxslider-one li a', '.bxslider-one li a click start');
            that._lg.log('DEBUG', '.bxslider-one li a', " $(this).attr('id') " + $(this).attr('id'));

            // Save the position

            that._tt_list = JSON.parse(window.localStorage.getItem('tt_list'));
            that._tt_list.position = window.slider_one.getCurrentSlide();
            window.localStorage.setItem('tt_list', JSON.stringify(that._tt_list));
            
            var id = $(this).attr('id');
            window.localStorage.setItem('details_tt_id', id);
            console.log(JSON.stringify(window.localStorage.getItem(id + '_tt')));
            
            /**
             * Save the page state
             */

            if (that._current_tt === null) {
                that._current_tt = {};
            }

            that._current_tt.trailertype = escapeHtmlEntities($('#one #trailertype option:selected').text());
            that._current_tt.trailerid = escapeHtmlEntities($('#one #trailerid option:selected').text());
            that._current_tt.place = escapeHtmlEntities($('#one #place option:selected').text());
            that._current_tt.sealed = escapeHtmlEntities($('#one input[name=sealed]:checked').val());

            window.localStorage.setItem('current_tt', JSON.stringify(that._current_tt));
            that._lg.log('TRACE', '.bxslider-one li a', 'completedCb saved current tt state');
            
            $('#two a[data-icon="back"]').attr('href', '#one');
            $.mobile.changePage('#two');
       });
    },
    /**
     * Disable Current page
     *   
     * @return {void} 
     */

    disable: function() {

        "use strict";

        /*$('#one select#trailertype').selectmenu('disable');
        $('#one select#trailerid').selectmenu('disable');
        $('#one select#place').selectmenu('disable');
        $('#one a[data-role=button]').data('disabled', true);
        $('#one a[data-role=button]').addClass('ui-disabled');
        $('.bxslider-one li a').data('disabled', true);*/

    },
    /**
     * Enable Current page
     *   
     * @return {void} 
     */

    enable: function() {

        "use strict";

        /*$('#one select#trailertype').selectmenu('enable');
        $('#one select#trailerid').selectmenu('enable');
        $('#one select#place').selectmenu('enable');
        $('#one a[data-role=button]').data('disabled', false);
        $('#one a[data-role=button]').removeClass('ui-disabled');
        $('.bxslider-one li a').data('disabled', false);*/

    },
    /**
     * Render page
     *   
     * @return {void} 
     */

    render: function() {

        "use strict";
        
        this._wrapper.clearNavigatorCache();
        this._wrapper.clearNavigatorHistory();
        
        if (window.changeInPage === false) {
            /**
             * Load from cache if available
             * this cache is cleared when the Troubleticket is submitted successfully
             */

            var selected; //text to save selected attr 

            this._lg.log('DEBUG', '#one$render', 'from cache current_tt : ' + JSON.stringify(this._current_tt));

            /**
             * Create a new Asset object this object should have a cached
             * enum list of trailer types
             */
            var ast = new Asset(this._usr, Config.log);
            var enum_trailertype = ast.get('enum_trailertype');

            $('#one select#trailerid').html('');

            this._lg.log('DEBUG', '#one$render', 'enum_trailertype : ' + JSON.stringify(enum_trailertype));

            /**
             * Load the trailer types into the select menu
             * and refresh UI.
             */

            $('#one select#trailertype').html('');
            $('#one select#trailertype').append('<option value=""> - ' + this._language.translate('Select One') + ' - </option>');
            for (var index in enum_trailertype) {

                if (enum_trailertype.hasOwnProperty(index)) {

                    //Load value from cache
                    selected = '';
                    if (this._current_tt !== null && enum_trailertype[index].value === this._current_tt.trailertype) {
                        selected = 'selected="selected"';
                        this._lg.log('DEBUG', '#one$render', 'selected trailer type : ' + enum_trailertype[index].value);
                    }

                    $('#one select#trailertype').append('<option ' + selected + ' value="' + enum_trailertype[index].value + '">' + enum_trailertype[index].label + '</option>');
                }
            }
            $('#one select#trailertype').selectmenu('refresh');

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

                    //Load value from cache
                    selected = '';
                    this._lg.log('DEBUG', '#one$render', 'loop  preload trailer id : ' + assets[index].get('assetname'));
                    this._lg.log('DEBUG', '#one$render', 'loop  preload trailer id : ' + this._current_tt.trailerid);
                    this._lg.log('DEBUG', '#one$render', 'loop  preload are they equal : ' + (assets[index].get('assetname') === this._current_tt.trailerid));

                    if (this._current_tt !== null && assets[index].get('assetname') === this._current_tt.trailerid) {
                        selected = 'selected="selected"';
                        this._lg.log('DEBUG', '#one$render', 'selected trailer id : ' + assets[index].get('assetname'));
                    }

                    $('#trailerid').append('<option ' + selected + ' value="' + assets[index].get('assetname') + '">' + assets[index].get('assetname') + '</option>');

                }
            }
            $('#one select#trailerid').selectmenu('refresh');

            /**
             * Create a new TroubleTicket object this object should have a cached
             * enum sealed
             */

            var tt = new TroubleTicket(this._usr, Config.log);
            
            var enum_sealed = tt.get('enum_sealed');
            var enum_place = tt.get('enum_place');

            this._lg.log('DEBUG', '#one$render', 'enum_sealed : ' + JSON.stringify(enum_sealed));

            /**
             * Load the sealed into the select menu
             * and refresh UI.
             */

            $('#one #sealed').html('');
            $('#one #sealed').append('<legend>' + this._language.translate('Sealed') + ' :</legend>');

            for (index in enum_sealed) {

                if (enum_sealed.hasOwnProperty(index)) {

                    //Load value from cache
                    selected = '';
                    if (this._current_tt !== null && enum_sealed[index].value === this._current_tt.sealed) {
                        selected = 'checked="checked"';
                        this._lg.log('DEBUG', '#one$render', 'selected sealed : ' + enum_sealed[index].value);
                    }

                    $('#one #sealed').append('<input ' + selected + ' id="radio' + index + '" name="sealed" value="' + enum_sealed[index].value + '" type="radio">');
                    $('#one #sealed').append('<label for="radio' + index + '">' + this._language.translate(enum_sealed[index].label) + '</label>');

                }
            }
            $('#one #sealed').trigger('create');
            $('#one #sealed').controlgroup();

            this._lg.log('DEBUG', '#one$render', 'enum_place : ' + JSON.stringify(enum_place));

            /**
             * Load the place into the select menu
             * and refresh UI.
             */
            $('#one select#place').html('');
            $('#one select#place').append('<option value=""> - ' + this._language.translate('Select One') + ' - </option>');

            for (index in enum_place) {

                if (enum_place.hasOwnProperty(index)) {

                    //this._lg.log('DEBUG', 'enum_place value : ' + enum_place[index].value);        

                    //Load value from cache
                    selected = '';
                    if (this._current_tt !== null && enum_place[index].value === this._current_tt.place) {
                        selected = 'selected="selected"';
                        this._lg.log('DEBUG', '#one$render', 'selected place : ' + enum_place[index].value);
                    }

                    $('#one select#place').append('<option ' + selected + ' value="' + enum_place[index].value + '">' + enum_place[index].label + '</option>');
                }
            }

            this._lg.log('DEBUG', '#one$render', '#one select#place html : ' + $('#one select#place').html());

            $('#one select#place').selectmenu('refresh');

            /**
             * Load the perviously fetched tt list from cache
             * to slider
             * 
             */

            this._tt_list = JSON.parse(window.localStorage.getItem('tt_list'));

            this._lg.log('DEBUG', '#one$render', 'tt_list : ' + JSON.stringify(this._tt_list));

            var empty = ($('#one select#trailerid').val().length > 0) && ($('#one select#trailertype').val().length > 0);
            if (empty && this._tt_list !== null && this._current_tt !== null && this._tt_list.html !== '') {
                this._lg.log('DEBUG', 'reloading slider for troubleticketlist  to position ' + this._tt_list.position);

                $('#one #troubleticketlist').html(this._tt_list.html);
                window.slider_one.reloadSlider();
                window.slider_one.goToSlide(this._tt_list.position);
            } else {
            	window.localStorage.removeItem('tt_list');
                $('#one #troubleticketlist').html("<li><center><div style='height:60px;'>" + this._language.translate('No Damages Reported') + "</div></center></li>");
                window.slider_one.reloadSlider();
            }

            /**
             * Current Object is used to 
             * verify if user has modified anything
             * on the page.
             */
            window.currentObj = {
                trailertype: $('#one #trailertype option:selected').text(),
                trailerid: $('#one #trailerid option:selected').text(),
                place: $('#one #place option:selected').text(),
                sealed: $('#one input[name=sealed]:checked').val()
            };
        } 
        window.changeInPage = false;
    }
});