/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, 
         bitwise:true, strict:true, undef:false, unused:true, 
         curly:true, browser:true, indent:4, maxerr:50 */

/*global Stapes:true, window:true*/
/*exported ScreenContactView*/

/**
 * View Class for screen Contact
 * 
 * @fileoverview Class definition of a View of screen contact
 * @author anshuk.kumar@essindia.co.in (Anshuk Kumar)
 * @license Commercial - Copyright 2013 Gizur AB
 * @see http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml
 */

var ScreenContactView = Stapes.subclass({

    /**
     * @constructor
     *
     * @param {logger}   aLog       object containing the log configuration
     */

    constructor : function(aLog, aWrapper) {

        "use strict";

        /**
         * Set pseudo private vars
         * please dont change this using <objname>._privatevarname
         * method from outside of here.
         * Arggghh Stapes!!!!
         */

        this.extend({
            _lg : aLog,
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

        //$('#contact').off('swiperight');

        $('#contacts-box').unbind('dblclick').bind('dblclick',function(){
        	alert("12345");
            if ($('#trace_id').length === 0) {
                var trace_id = window.localStorage.getItem('trace_id');
                $('#contacts-box-trace').empty().html('<div id="trace_id"><p style="text-align:center;">' + trace_id + '<p></div>');
            }
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

        try {

            this._lg.log('TRACE', '#contact$render', ' page loaded: ');

            var contact_html = window.localStorage.getItem('contact');

            this._lg.log('DEBUG', '#contact$render', ' contact_html ' + contact_html);

            if (contact_html === null) {
                $('#contacts-box').empty();

                this._lg.log('DEBUG', " $('#contact div[data-role=navbar]') " + $('#contact div[data-role=navbar]').length);            

                $('#contacts-box').html('<div><p>An account needs to setup in order to use '.concat(
                    'this service. Please contact ' ,
                    '<a href="mailto://sales@gizur.com">sales@gizur.com' ,
                    '</a> ' ,
                    'in order to setup an account.</p></div>'));
            } else {
            	$('#contacts-box').empty();
                
                var contactHtml = JSON.parse(contact_html);
                var language = window.localStorage.getItem('language');
                var address = '';
                
                if (language === null || typeof contactHtml[language] === 'undefined') {
                	address = contactHtml['english'];
                } else {
                	address = contactHtml[language];
                }
                
                $('#contacts-box').html('<div>' + address + '</div>');

            }

            this._lg.log('TRACE', '#contact$render', ' page loaded: complete');

        } catch (err) {

            this._lg.log('FATAL', '#contact$render', JSON.stringify(err));

        }        

        /**
         * Current Object is used to 
         * verify if user has modified anything
         * on the page.
         */
        app.currentObj = {};
    }
});
