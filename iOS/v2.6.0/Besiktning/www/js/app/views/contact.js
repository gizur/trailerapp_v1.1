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

    constructor : function(aLog) {

        "use strict";

        /**
         * Set pseudo private vars
         * please dont change this using <objname>._privatevarname
         * method from outside of here.
         * Arggghh Stapes!!!!
         */

        this.extend({
            _lg : aLog
        });

    },

    /**
     * Binds events to various elements of the page
     *   
     * @return {void} 
     */ 
          
    bindEventHandlers : function() {

        "use strict";

        $('#contact').off('swiperight');

        $('#contact').on('swiperight',function(){
            if ($('#trace_id').length === 0) {
                var trace_id = window.localStorage.getItem('trace_id');
                $('<div id="trace_id"><p style="text-align:center;">' + trace_id + '<p></div>').insertAfter('#contact div[data-role=navbar]');
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

        try {

            this._lg.log('TRACE',' page loaded: ');

            var contact_html = window.localStorage.getItem('contact');

            this._lg.log('DEBUG',' contact_html ' + contact_html);

            if (contact_html === null) {
                $('#contact div[data-role=navbar]').siblings().remove();

                this._lg.log('DEBUG', " $('#contact div[data-role=navbar]') " + $('#contact div[data-role=navbar]').length);            

                $(  '<div><p>An account needs to setup in order to use '.concat(
                    'this service. Please contact ' ,
                    '<a href="mailto://sales@gizur.com">sales@gizur.com' ,
                    '</a> ' ,
                    'in order to setup an account.</p></div>')).insertAfter('#contact div[data-role=navbar]');
            } else {
                $('#contact div[data-role=navbar]').siblings().remove();
                $('<div>' + contact_html + '</div>').insertAfter('#contact div[data-role=navbar]');

                $('#contact div[data-role=navbar]').siblings().find('a');

            }

            this._lg.log('TRACE', ' page loaded: complete');

        } catch (err) {

            this._lg.log('FATAL', JSON.stringify(err));

        }        

        /**
         * Current Object is used to 
         * verify if user has modified anything
         * on the page.
         */
        window.currentObj = {};
    }
});