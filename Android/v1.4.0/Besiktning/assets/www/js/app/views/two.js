/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, 
         bitwise:true, strict:true, undef:false, unused:true, 
         curly:true, browser:true, indent:4, maxerr:50 */

/*global Stapes:true, window:true*/
/*exported ScreenTwoView*/

/**
 * View Class for screen Two
 * 
 * @fileoverview Class definition of a View of screen two
 * @author anshuk.kumar@essindia.co.in (Anshuk Kumar)
 * @license Commercial - Copyright 2013 Gizur AB
 * @see http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml
 */

var ScreenTwoView = Stapes.subclass({

    /**
     * @constructor
     *
     * @param {logger}   aLog       object containing the log configuration
     * @param {language} aLanguage  the language object
     * @param {wrapper}  aWrapper   the wrapper object
     */

    constructor : function(aLog, aLanguage, aWrapper) {

        "use strict";

        /**
         * Set pseudo private vars
         * please dont change this using <objname>._privatevarname
         * method from outside of here.
         * Arggghh Stapes!!!!
         */
        if(typeof app.slider_two.reloadSlider === "undefined") {
            app.slider_two = $('.bxslider-two').bxSlider({
                infiniteLoop: false,
                hideControlOnEnd: true,
                pager: true,
                pagerSelector: '#pager-two',
                pagerType: 'short',
                useCSS: false,
                swipeThreshold: 10,
                adaptiveHeight: true
            });
        }
        
        this.extend({
            _lg : aLog,
            _language : aLanguage,
            _wrapper: aWrapper
        });
        
        this.show = function(){
        	app.prevPage = 'two';
        	app.surveyPage = "two";
        	

            this.bindEventHandlers();
            this.render();
            
            $('.page-surveys').hide();
        	$('#two').show();
        	
        	setTimeout(function(){
    			$('html, body').animate({scrollTop: '0px'}, 1500);
        	}, 1000);
        };
        
        this.showPageOne = function(){
        	$('.page-surveys').hide();
        	$('#one').show();
        	$("#viewMoreDamages").hide();
        	
        	//$('#pages-tab a[href="#survey"]').click();
        };
        
        
        this.showPageFive = function(){
        	$('.page-surveys').hide();
        	$('#five').show();
        	
        	//$('#pages-tab a[href="#survey"]').click();
        };
        
        this.reset = function(){
        	$('#damagetype').val('');
        	$('#damagetype').val('');
        	$('.bxslider-two').empty().html("<li>" + 
                    this._language.translate('No Picture(s) Attached') + 
                    "</li>");
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
        
        $('#pageTwoBackButton').unbind('click').click(function(e){
        	app.changeInPage = true;
        	e.preventDefault();
        	that.reset();
        	
        	var page = $(this).attr('back-page');
        	if(page === 'five')
        		that.showPageFive();
        	else
        		that.showPageOne();
        });
        
    },	

    /**
     * Render page
     *   
     * @return {void} 
     */ 

    render : function() {

        "use strict";

        /** Check if device is Android **/

        this._wrapper.clearNavigatorCache();
        this._wrapper.clearNavigatorHistory();
        
        /**
         * Initialize Page
         */

        this._lg.log('DEBUG', '#two$render', " tt details id " + window.localStorage.getItem('details_tt_id'));     

        var tt = JSON.parse(window.localStorage.getItem(
            window.localStorage.getItem('details_tt_id') + '_tt'
        ));

        this._lg.log('DEBUG', '#two$render', " tt details " + JSON.stringify(tt));

        $('#two #damagetype').val(tt.damagetype);
        $('#two #damageposition').val(tt.damageposition);

        /**
         * Load images
         */
        $('.bxslider-two').empty().html("<li>" + 
                this._language.translate('No Picture(s) Attached') + 
        "</li>");
        
        if(tt.files !== undefined)
        if (tt.files.length !== 0) {
        	$('.bxslider-two').empty();
            this._lg.log('DEBUG', '#two$render', " tt.docs.length " + tt.files.length);

            for (var index in tt.files) {

                if (tt.files.hasOwnProperty(index)){
                	
                	this._lg.log('DEBUG', '#two$render', ' path to image file ' + tt.files[index].path);
                	
                	var img_id = tt.files[index].id + index;
                	window.localStorage.setItem(img_id, tt.files[index].path);
                	$('.bxslider-two').append('<li><img alt="Loading ...' +
                    	tt.files[index].path + '" id="' + img_id + 
                        '" style="width:100%; height:auto;" cache="yes" refresh="360" src="' + tt.files[index].path +
                        '" onclick="window.localStorage.setItem(\'details_doc_id\', this.id); ScreenThreeView._render(); ScreenThreeView._show();"/></li>');
                }

            }

        } else {
            $('.bxslider-two').empty().html("<li>" + 
                this._language.translate('No Picture(s) Attached') + 
                "</li>");
        }
        
        app.currentObj = {};

        app.changeInPage = false;
        app.slider_two.reloadSlider();
        return false;
    }
});

ScreenTwoView.extend({
	_show: function(){
		$('.page-surveys').hide();
		$('#two').show();
	}
});
