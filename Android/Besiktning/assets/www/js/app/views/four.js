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
        
        this.validate = function() {
        	var valid = true;
            
        	valid = valid && this._wrapper.checkLength($('#four #damagetype option:selected'), 0, this._language.translate('Please select a damage type'), this._language.translate('Error'));
            
            if(valid)
            valid = valid && this._wrapper.checkLength($('#four #damageposition option:selected'), 0, this._language.translate('Please select a damage position'), this._language.translate('Error'));

            if(valid)
            valid = valid && this._wrapper.checkLength($('#four #drivercauseddamage option:selected'), 0, this._language.translate('Please select, if damage was caused by driver or not'), this._language.translate('Error'));

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
         * ------------------
         * Event Bindings
         * ------------------
         */

        /**
         * Click event for saving damage report
         */

        $('#four #savedamage').unbind('click').click(function(e) {

            var current_tt;
            var damage;
            var documents;

            e.preventDefault();

            that._lg.log('TRACE', '#four #savedamage', '#four #savedamage click start');

            that._lg.log('TRACE', '#four #savedamage', '#four #damagetype option:selected' + $('#four #damagetype option:selected').text());

            that._lg.log('TRACE', '#four #savedamage', '#four #damageposition option:selected' + $('#four #damageposition option:selected').text());

            that._lg.log('DEBUG', '#four #savedamage', '#four #drivercauseddamage option:selected' + $('#four #drivercauseddamage option:selected').attr('value'));
            
            
            if(that.validate()) {
	            current_tt = JSON.parse(window.localStorage.getItem('current_tt'));
	
	            damage = {
	                'damagetype': escapeHtmlEntities($('#four #damagetype option:selected').text()),
	                'damageposition': escapeHtmlEntities($('#four #damageposition option:selected').text()),
	                'drivercauseddamage': escapeHtmlEntities($('#four #drivercauseddamage option:selected').attr('value'))
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
	                if (that._latest_damage_index !== -1) {
	                    current_tt.damages[that._latest_damage_index] = damage;
	                } else {
	                    current_tt.damages.push(damage);
	                }
	            }
	
	            that._lg.log('TRACE', '#four #savedamage', '#four #savedamage current_tt' + JSON.stringify(current_tt));
	
	            window.localStorage.setItem('current_tt', JSON.stringify(current_tt));
	
	            $.mobile.changePage('#five');
            }
            
            that._lg.log('TRACE', '#four #savedamage', '#four #savedamage click end');            
        });

        $('#four #deletedamage').unbind('click').click(function(e) {

            that._lg.log('TRACE', '#four #deletedamage', '#four #deletedamage start');

            e.preventDefault();

            var current_tt = JSON.parse(window.localStorage.getItem('current_tt'));

            if (current_tt !== null && that._latest_damage_index !== -1) {

                that._lg.log('DEBUG', '#four #deletedamage', '#four #deletedamage that._latest_damage_index ' + that._latest_damage_index);

                current_tt.damages.splice(that._latest_damage_index, 1);

                window.localStorage.setItem('current_tt', JSON.stringify(current_tt));

                if (current_tt.damages.length === 0) {

                    that._lg.log('TRACE', '#four #deletedamage', '#four #deletedamage refresh current page ');

                    $.mobile.changePage('#five');
                    //Jonas Email 11-10-2013
                    //$.mobile.changePage('#four', {allowSamePageTransition: true, transition: 'none', showLoadMsg: false, reloadPage: false});

                } else {

                    that._lg.log('TRACE', '#four #deletedamage', '#four #deletedamage redirect to screen five ');
                    
                    $.mobile.changePage('#five');
                }
            } else {
            	$.mobile.changePage('#four', {allowSamePageTransition: true, transition: 'none', showLoadMsg: false, reloadPage: false});
            }

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
                window.slider_four.reloadSlider();
                that._lg.log('DEBUG', '#four #takephoto', '#four #takephoto success $(.bxslider-four).html()' + $('.bxslider-four').html());
            };

            var fail = function(message) {

                //Log
                that._lg.log('DEBUG', '#four #takephoto', '#four #takephoto fail' + message);
                that._lg.log('DEBUG', '#four #takephoto', '#four #takephoto success $(.bxslider-four).html()' + $('.bxslider-four').html());

            };

            that._wrapper.getPicture(success, fail, {quality: Config.imageQuality,
                destinationType: Camera.DestinationType.FILE_URI,
                targetWidth: Config.imageTargetWidth
            });
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

                        $('#four select#damageposition').selectmenu('refresh');
                    }
                }

            }

            $('#four select#damagetype').selectmenu('refresh');
            that._lg.log('TRACE', '#four select#damagetype', ' end loading dependency');
        });

    },
    /**
     * Render page
     *   
     * @return {void} 
     */

    render: function() {

        "use strict";

        /**
         * Clear browser cache if any
         */

        this._wrapper.clearNavigatorCache();
        this._wrapper.clearNavigatorHistory();

        if (window.changeInPage === false) {
            var current_tt = JSON.parse(window.localStorage.getItem('current_tt'));

            this._lg.log('DEBUG', '#four$render', '#four current_tt ' + window.localStorage.getItem('current_tt'));

            /**
             * The index of the last damage added
             */

            this._latest_damage_index = -1;

            /**
             * Check if already present in cache
             */

            if (window.localStorage.getItem('latest_damage_index') === null) {
                if (current_tt !== null && current_tt.damages instanceof Array) {
                    this._latest_damage_index = current_tt.damages.length - 1;
                    this._lg.log('DEBUG', '#four$render', ' latest damage index from last index : ' + this._latest_damage_index);
                }
            } else {
                this._latest_damage_index = window.localStorage.getItem('latest_damage_index');
                this._lg.log('DEBUG', '#four$render', ' latest damage index from cache : ' + this._latest_damage_index);
                window.localStorage.removeItem('latest_damage_index');
            }

            this._lg.log('DEBUG', '#four$render', ' current_tt.damages instanceof Array : ' + (current_tt.damages instanceof Array));

            /**
             * string var to store the selected status
             */

            var selected;



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

                    //Load value from cache
                    selected = '';

                    if (current_tt !== null && this._latest_damage_index !== -1) {
                        this._lg.log('DEBUG', '#four$render', ' selected check damagetype : enum_damagetype[index].value ' + enum_damagetype[index].value);
                        this._lg.log('DEBUG', '#four$render', ' selected check damagetype- : current_tt.damages[this._latest_damage_index].damagetype ' + current_tt.damages[this._latest_damage_index].damagetype);
                    }

                    if (current_tt !== null &&
                            this._latest_damage_index !== -1 &&
                            enum_damagetype[index].value === current_tt.damages[this._latest_damage_index].damagetype) {
                        selected = 'selected="selected"';

                        this._lg.log('DEBUG', '#four$render', ' typeof enum_damagetype[index].dependency.damageposition ' + typeof enum_damagetype[index].dependency.damageposition);

                        if (typeof enum_damagetype[index].dependency !== 'undefined' &&
                                typeof enum_damagetype[index].dependency.damageposition !== 'undefined') {

                            this._lg.log('DEBUG', '#four$render', ' JSON.stringify(enum_damagetype[index].dependency.damageposition) ' + JSON.stringify(enum_damagetype[index].dependency.damageposition));

                            enum_damageposition = enum_damagetype[index].dependency.damageposition;
                        }

                        this._lg.log('DEBUG', '#four$render', 'selected damagetype : ' + enum_damagetype[index].value);
                    }

                    $('#four select#damagetype').append('<option ' + selected + ' value="' + enum_damagetype[index].value + '">' + enum_damagetype[index].label + '</option>');
                }
            }

            $('#four select#damagetype').selectmenu('refresh');

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

                    /**
                     * Load value from cache
                     */

                    selected = '';

                    if (current_tt !== null &&
                            this._latest_damage_index !== -1 &&
                            enum_damageposition[index].value === current_tt.damages[this._latest_damage_index].damageposition) {
                        selected = 'selected="selected"';
                        this._lg.log('DEBUG', '#four$render', 'selected damageposition : ' + enum_damageposition[index].value);
                    }

                    $('#four select#damageposition').append('<option ' + selected + ' value="' + enum_damageposition[index].value + '">' + enum_damageposition[index].label + '</option>');

                }

            }

            $('#four select#damageposition').selectmenu('refresh');

            /**
             * Show the delete button or not
             */

            if (this._latest_damage_index === -1) {

                this._lg.log('DEBUG', '#four$render', ' this._latest_damage_index ' + this._latest_damage_index);

                if (typeof current_tt.damages !== 'undefined') {
                    this._lg.log('DEBUG', '#four$render', ' current_tt.damages.length ' + current_tt.damages.length);
                }
            }

            if (this._latest_damage_index !== -1) {

                this._lg.log('DEBUG', '#four$render', '(current_tt.damages[this._latest_damage_index].documents instanceof Array) ' + (current_tt.damages[this._latest_damage_index].documents instanceof Array));

                if ((current_tt.damages[this._latest_damage_index].documents instanceof Array)) {
                    this._lg.log('DEBUG', '#four$render', 'current_tt.damages[this._latest_damage_index].documents.length ' + current_tt.damages[this._latest_damage_index].documents.length);
                }
            }

            $('.bxslider-four').html("<li><center><div style='height:60px;width:200px;'>" + this._language.translate('No Picture(s) Attached') + "</div></center></li>");

            /**
             * Document pictures enum loading
             */

            if (this._latest_damage_index !== -1 &&
                    (current_tt.damages[this._latest_damage_index].documents instanceof Array)) {

                if (current_tt.damages[this._latest_damage_index].documents.length > 0) {

                    $('.bxslider-four').html('');
                    for (index in current_tt.damages[this._latest_damage_index].documents) {

                        if (current_tt.damages[this._latest_damage_index].documents.hasOwnProperty(index)) {
                            this._lg.log('DEBUG', '#four$render', ' document path ' + current_tt.damages[this._latest_damage_index].documents[index].path);
                            $('.bxslider-four').append('<li><img style="width:100%;height:auto;" src="' + current_tt.damages[this._latest_damage_index].documents[index].path + '"/></li>');
                        }

                    }

                } else {

                    this._lg.log('DEBUG', '#four$render', ' no documents found ');

                }
            }

            window.slider_four.reloadSlider();

            //Driver caused enum loading to select menu
            this._lg.log('TRACE', '#four$render', 'damage caused damage start ');
            var enum_drivercauseddamage = dmg.get('enum_drivercauseddamage');

            this._lg.log('DEBUG', '#four$render', 'enum_drivercauseddamage : ' + JSON.stringify(enum_drivercauseddamage));

            $('#four select#drivercauseddamage').html('');
            $('#four select#drivercauseddamage').append('<option value=""> - ' + this._language.translate('Select One') + ' - </option>');
            for (index in enum_drivercauseddamage) {
                if (enum_drivercauseddamage.hasOwnProperty(index)) {
                    $('#four select#drivercauseddamage').append('<option value="' + enum_drivercauseddamage[index].value + '">' + this._language.translate(enum_drivercauseddamage[index].label) + '</option>');
                }
            }

            if (this._latest_damage_index !== -1) {

                this._lg.log('DEBUG', '#four$render', 'drivercauseddamage ' + current_tt.damages[this._latest_damage_index].drivercauseddamage);
                $("#four select#drivercauseddamage option[value='" + current_tt.damages[this._latest_damage_index].drivercauseddamage + "']").attr("selected", "selected");

            }

            $('#four select#drivercauseddamage').selectmenu('refresh');

            this._lg.log('TRACE', '#four$render', 'end loading values to select menu');

            /**
             * Current Object is used to 
             * verify if user has modified anything
             * on the page.
             */
            window.currentObj = {
                'damagetype': $('#four #damagetype option:selected').text(),
                'damageposition': $('#four #damageposition option:selected').text(),
                'drivercauseddamage': $('#four #drivercauseddamage option:selected').text()
            };

        }
        window.changeInPage = false;
    }
});