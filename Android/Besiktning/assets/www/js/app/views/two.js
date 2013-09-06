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

        this.extend({
            _lg : aLog,
            _language : aLanguage,
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

        /*$('#two li center img').unbind('click').live('click', function(){
            window.localStorage.setItem('details_doc_id', $(this).attr('id').replace('#','.'));
            $.mobile.changePage('#three');
        });*/
  
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

        this._lg.log('DEBUG', " tt details id " + window.localStorage.getItem('details_tt_id'));     

        var tt = JSON.parse(window.localStorage.getItem(
            window.localStorage.getItem('details_tt_id') + '_tt'
        ));

        this._lg.log('DEBUG', " tt details " + JSON.stringify(tt));

        $('#two #damagetype').val(tt.damagetype);
        $('#two #damageposition').val(tt.damageposition);

        /**
         * Load images
         */
        $('.bxslider-two').empty().html("<li><center><div style='height:60px;'>" + 
                this._language.translate('No Picture(s) Attached') + 
        "</div></center></li>");
        
        if(tt.documents !== undefined)
        if (tt.documents.length !== 0) {
        	$('.bxslider-two').empty();
            this._lg.log('DEBUG', " tt.docs.length " + tt.documents.length);

            for (var index in tt.documents) {

                if (tt.documents.hasOwnProperty(index)){
                	
                	this._lg.log('DEBUG', ' path to image file ' + tt.documents[index].file.filename);
                	
                	window.localStorage.setItem(tt.documents[index].file.filename, Config.url + "Images/" + tt.documents[index].file.filename);
                	
                    $('.bxslider-two').append('<li><center><img alt="Loading ...' +
                    	tt.documents[index].file.filename + '" id="' + tt.documents[index].file.filename + 
                        '" style="width:100%;min-height:60px;height:auto;" src="' + 
                        Config.url + "Images/" + tt.documents[index].file.filename +
                        '" onclick="window.localStorage.setItem(\'details_doc_id\', this.id); $.mobile.changePage(\'#three\');"/></center></li>');
                }

            }

        } else {
            $('.bxslider-two').empty().html("<li><center><div style='height:60px;'>" + 
                this._language.translate('No Picture(s) Attached') + 
                "</div></center></li>");
        }

        window.changeInPage = false;
        window.slider_two.reloadSlider();
        return false;
    }
});