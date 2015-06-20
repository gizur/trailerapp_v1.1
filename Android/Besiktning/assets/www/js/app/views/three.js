/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, 
         bitwise:true, strict:true, undef:false, unused:true, 
         curly:true, browser:true, indent:4, maxerr:50 */

/*global Stapes:true, window:true*/
/*exported ScreenThreeView*/

/**
 * View Class for screen Three
 * 
 * @fileoverview Class definition of a View of screen three
 * @author anshuk.kumar@essindia.co.in (Anshuk Kumar)
 * @license Commercial - Copyright 2013 Gizur AB
 * @see http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml
 */

var ScreenThreeView = Stapes.subclass({

    /**
     * @constructor
     *
     * @param {user}     aUsr       the user who is making calls to server
     * @param {logger}   aLog       object containing the log configuration
     * @param {language} aLanguage  the language object
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
            _wrapper : aWrapper
        });

    },

    /**
     * Render page
     *   
     * @return {void} 
     */ 

    render : function() {

        "use strict";
        
        this._wrapper.clearNavigatorCache();
        this._wrapper.clearNavigatorHistory();
        
        app.changeInPage = false;
        app.currentObj = {};
    }
});

ScreenThreeView.extend({
	_render : function(){
		app.prevPage = 'three';
	    
	    var base64_image = window.localStorage.getItem(window.localStorage.getItem('details_doc_id'));
	    
	    $('#three img').attr('src', base64_image);
	    $('#three img').css('width', ($(document).width() - 20));
	    $('#three img').css('height', 'auto');
	    $('#three img').attr('cache', "yes");
	    $('#three img').attr('refresh', "360");
	    
	    var pageThree = new ScreenThreeView(app._usr, app._lg, app._lang, app._wrapper);
	    pageThree.render();
	},
	_show: function(){
		$('.page-surveys').hide();
		$('#three').show();
	},
	_back: function(){
		$('.page-surveys').hide();
		$('#two').show();
	}
});