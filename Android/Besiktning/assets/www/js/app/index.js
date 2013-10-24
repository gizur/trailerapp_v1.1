/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, 
 bitwise:true, strict:true, undef:false, unused:true, 
 curly:true, browser:true, indent:4, maxerr:50 */

/*global window:true*/

/**
 *
 * Mobile App basedon Phonegap (Apache Cordova)
 * 
 * Application works over REST API 
 * 
 * @since     20 April 2013
 * @author    anshuk.kumar@essindia.co.in (Anshuk Kumar)
 * @preserve  copyright 2013 Gizur AB 
 */

/**
 * @function changepage
 * 
 * Change page by id
 * Used in changing page having input, select and checkboxes 
 * If changes detected in any field, it shows a alert dialog
 * 
 * @param {string} to page id
 */

function changepage(page) {
    window.changeInPage = false;
    
    var lg = App._lg;
    var wrapper = App._wrapper;
    var language = App._lang;
    
    if (page !== "contact" && page !== "settings" && !App._usr.get('authenticated')) {
    	$.mobile.changePage("#settings");
    	return;
    }
    
    if (window.currentObj !== null) {
        console.log(JSON.stringify(window.currentObj));
        for (index in window.currentObj) {
            if (window.currentObj.hasOwnProperty(index)) {
                console.log("Fetching " + index);

                var val = $('#' + window.prevPage + " #" + index).val();
                
                if ($('#' + window.prevPage + " #" + index).is('select'))
                    val = $('#' + window.prevPage + " #" + index + " option:selected").text();

                if ($('#' + window.prevPage + " input[name=" + index + "]").is(':radio'))
                    val = $('#' + window.prevPage + " input[name=" + index + "]:checked").val();

                if (val !== window.currentObj[index]) {
                    console.log(val + " Not matched " + window.currentObj[index]);
                    window.changeInPage = true;
                    break;
                }
            } else {
                console.log(index + " does not hasOwnProperty.");
            }
        }
    }

    if(page === "one" && (window.changeInPage || window.prevPage === "four" || window.prevPage === "five") && 
    		window.prevPage !== "settings" && window.prevPage !== "contact"){
    	var confirm = function(button){
    		if(button === 1){
    			window.changeInPage = false;
    			
    			resetFormFour();
    			resetFormOne();
    			cleanCurrentTT();
    			
    			$.mobile.changePage("#one", {allowSamePageTransition: true, transition: 'none', showLoadMsg: false, reloadPage: false});
    			return true;
    		} else {
    			return false;
    		}
    	};
    	
    	wrapper.showConfirm(language.translate("Your changes will not be saved."), confirm, language.translate("Warning"), language.translate("Confirm,Cancel"));    		
    	
    } else if (window.changeInPage && page !== window.prevPage) {
    	
    	var confirm = function(button){
    		if(button === 1){
    			window.changeInPage = false; 
    			window.localStorage.removeItem('current_tt');
    			$.mobile.changePage("#" + page, {transition: 'none', showLoadMsg: false, reloadPage: false});
    			return true;
    		} else {
    			return false;
    		}
    	};
    	
    	wrapper.showConfirm(language.translate("You have made changes. If you continue, your changes will not be saved."), confirm, language.translate("Warning"), language.translate("Continue,Cancel"));
	} else  {
		if( (window.prevPage === "contact" || window.prevPage === "settings") && page === 'one') {
			if(typeof window.surveyPage !== 'undefined')
				$.mobile.changePage("#" + window.surveyPage);
			else
				$.mobile.changePage("#" + page);
		} else {
			$.mobile.changePage("#" + page);
		}
    }
}

function resetFormFour(){      
	window.changeInPage = false;
	
	$('#four #damagetype').attr('value', '');
    $('#four #damageposition').attr('value', '');
    $('#four #drivercauseddamage').attr('value', '');
    
    $('#four #damagetype').selectmenu();
    $('#four #damageposition').selectmenu();
    $('#four #drivercauseddamage').selectmenu();
    
	$('#four #damagetype').selectmenu('refresh');
    $('#four #damageposition').selectmenu('refresh');
    $('#four #drivercauseddamage').selectmenu('refresh');
    
    $('.bxslider-four').html("<li><center><div style='height:60px;width:200px;'>" + App._lang.translate('No Picture(s) Attached') + "</div></center></li>");
    window.slider_four.reloadSlider();
}

function resetFormOne(){
	window.changeInPage = false;
	$('#one #trailertype').attr('value', '');
    $('#one #trailerid').attr('value', '');
    $('#one #place').attr('value', '');
    
    $('#one #trailertype').selectmenu();
    $('#one #trailerid').selectmenu();
    $('#one #place').selectmenu();
    
	$('#one #trailertype').selectmenu('refresh');
    $('#one #trailerid').selectmenu('refresh');
    $('#one #place').selectmenu('refresh');
    $('#one input[name=sealed]').attr('checked', false).checkboxradio("refresh");
    
    $('#one #troubleticketlist').html("<li><center><div style='height:60px;'>" + App._lang.translate('No Damages Reported') + "</div></center></li>");
    window.slider_one.reloadSlider();
}

function cleanCurrentTT(){    
    window.localStorage.removeItem('tt_list');
    window.localStorage.removeItem('current_tt');
}

/**
 * Screen One Init
 * Creates Survey
 *
 */

$(document).delegate('#one', 'pageshow', function() {

    "use strict";

    window.prevPage = 'one';
    window.surveyPage = 'one';

    try {

        /**
         * Environment
         */

    	App._lg.log('TRACE', 'gta-page#one$pageshow', 'page loaded');
        
        var pageOne = new ScreenOneView(App._usr, App._lg, App._lang, App._wrapper);

        //For Debugging : The line below must be commented
        //window.localStorage.removeItem('17x519_tt');

        /**
         * ------------------
         * Event Bindings
         * ------------------
         */

        pageOne.bindEventHandlers();

        /**
         * -------------------
         * Render the page
         * -------------------
         */

        pageOne.setValues();

        /**
         * Only once this page is completed logger should be allowed 
         * to send logs to server
         */

        App._lg.appLoadingComplete();

    } catch (err) {

    	App._lg.log('FATAL', 'gta-page#one$pageshow', JSON.stringify(err));

    }

    App._lg.log('DEBUG', 'gta-page#one$pageshow', '#one #troubleticketlist html : ' + $('#one #troubleticketlist').html());
});

/**
 * Screen Four Init
 * Creates Damage and adds pictures
 *
 */

$(document).delegate('#four', 'pageshow', function() {

    "use strict";

    window.prevPage = 'four';
    window.surveyPage = 'four';

    resetFormOne();
    
    var pageFour = new ScreenFourView(App._usr, App._lg, App._lang, App._wrapper);
    pageFour.bindEventHandlers();
    pageFour.setValues();

});

/**
 * Screen Two Init
 * Shows details of Trouble Ticket
 *
 */

$(document).delegate('#two', 'pageshow', function(e, data) {

    "use strict";

    window.prevPage = 'two';

    var pageTwo = new ScreenTwoView(App._lg, App._lang, App._wrapper);
    pageTwo.bindEventHandlers();
    pageTwo.render();

    e.preventDefault();
    e.stopPropagation();
});

/**
 * Screen Three Init
 * Shows the image in full view
 *
 */

$(document).delegate('#three', 'pageshow', function(e, data) {

    "use strict";

    window.prevPage = 'three';
    
    var base64_image = window.localStorage.getItem(window.localStorage.getItem('details_doc_id'));
    
    $('#three img').attr('src', base64_image);
    $('#three img').css('width', ($(document).width() - 20));
    $('#three img').css('height', 'auto');
    $('#three img').attr('cache', "yes");
    $('#three img').attr('refresh', "360");

    e.preventDefault();
    
    var pageThree = new ScreenThreeView(App._usr, App._lg, App._lang, App._wrapper);
    pageThree.render();
});

/**
 * Screen Five Init
 * Shows summary of trouble ticket to be submitted
 *
 */

$(document).delegate('#five', 'pageshow', function() {

    "use strict";

    window.prevPage = 'five';
    window.surveyPage = 'five';

    resetFormFour();
    
    var pageFive = new ScreenFiveView(App._usr, App._lg, App._lang, App._wrapper);
    pageFive.bindEventHandlers();
    pageFive.render();

    /**
     * Only once this page is completed logger should be allowed 
     * to send logs to server
     */

    App._lg.appLoadingComplete();
});

/**
 * Screen Contact Init
 * Shows contact information sent from the server
 *
 */

$(document).delegate('#contact', 'pageshow', function() {

    "use strict";

    /**
     * Environment SetUp
     */

    window.prevPage = 'contact';
    
    var pageContact = new ScreenContactView(App._lg, App._wrapper);
    pageContact.bindEventHandlers();
    pageContact.render();

});


/**
 * Screen Setting Init
 * Shows settings page which holds the credentails and client id
 * info
 */

$(document).delegate('#settings', 'pageshow', function() {

    "use strict";

    window.prevPage = 'settings';

    try {

        var pageSettings = new ScreenSettingsView(App._usr, App._lg, App._lang, App._req, App._wrapper);

        pageSettings.render();
        pageSettings.bindEventHandlers();
        
        App._lg.log('TRACE', 'gta-page#settings$pageshow', 'page loaded');
        
        if (App._usr.get('authenticated') && window.refreshCache) {
        	// Login again
        	window.refreshCache = false;
	        $('#settings_save').click();
        }

    } catch (err) {

        App._lg.log('FATAL', 'gta-page#settings$pageshow', JSON.stringify(err));

    }
});

/**
 * Render pages when cache completed
 */
$(document).delegate('#dialog_success_cache', 'pageshow', function(){
    
    /**
	 * Render the page one and four
	 * may have any change in picklists
	 */
	var pageOne = new ScreenOneView(App._usr, App._lg, App._lang, App._wrapper);
    pageOne.render();
    
    var pageFour = new ScreenFourView(App._usr, App._lg, App._lang, App._wrapper);
    pageFour.render();    
});

$(document).delegate('#dialog_notify_changevalidation', 'pagebeforeshow', function() {
    $(this).page('destroy').page();
});

/**
 * Page Before Change
 * Executed before transition or change between any pages
 * 
 */

$(document).bind('pagebeforechange', function(e, data) {

    "use strict";

    try {

    	var to = data.toPage,
                from = data.options.fromPage;

        App._lg.log('TRACE', 'gta-page$pagebeforechange', typeof to);
        App._lg.log('TRACE', 'gta-page$pagebeforechange', ' $.mobile.urlHistory :' + JSON.stringify($.mobile.urlHistory.stack));

        /**
         * Clear any browser cache
         */

        App._wrapper.clearNavigatorCache();

        /**
         * The type of to is object when there is a transition from
         * one page to another.
         */

        if (typeof to === 'object') {

            /**
             * If the User is not authenticated so after load
             * the user should be redirected to settings page
             */

            if (to.attr('id') === 'one' && !usr.get('authenticated')) {
                App._lg.log('TRACE', 'gta-page$pagebeforechange', ' Application loaded and user is not authenticated ');
                e.preventDefault();
                $.mobile.changePage('#settings');
                return;
            }

            /**
             * Access Control
             * Check if the user is authenticated
             * if not show him the access denied page
             */

            App._lg.log('DEBUG', 'gta-page$pagebeforechange', 'usr.authenticated: ' + usr.get('authenticated'));
            App._lg.log('DEBUG', 'gta-page$pagebeforechange', ' to.attr(id): ' + to.attr('id'));

            if (to.attr('id') === 'settings') {

                $('#' + to.attr('id') + ' div[data-role=navbar] li a.page-settings').addClass('ui-btn-active');

            }

            if (to.attr('id') === 'contact') {

                $('#' + to.attr('id') + ' div[data-role=navbar] li a.page-contact').addClass('ui-btn-active');

            }


            if (!App._usr.get('authenticated')) {

                /**
                 * If user is not authenticated
                 */

                if (to.attr('id') === 'one' ||
                        to.attr('id') === 'two' ||
                        to.attr('id') === 'three' ||
                        to.attr('id') === 'four' ||
                        to.attr('id') === 'five') {
                    e.preventDefault();

                    /**
                     * remove active class on button
                     * otherwise button would remain highlighted
                     */

                    $.mobile.activePage
                            .find('.ui-btn-active')
                            .removeClass('ui-btn-active');

                    /**
                     * Show Access denied pop up
                     */

                    $('#dialog div[data-role=header]').html('<h3>Access Denied</h3>');
                    $('#dialog div[data-role=content]').children().first().html('You have not been authenticated. Please enter valid credentials and click save.');
                    $('#a_dialog').click();
                }
            } else {

                /**
                 * If user is authenticated
                 */

                if (to.attr('id') === 'one' ||
                        to.attr('id') === 'two' ||
                        to.attr('id') === 'three' ||
                        to.attr('id') === 'four' ||
                        to.attr('id') === 'five') {

                    $('#' + to.attr('id') + ' div[data-role=navbar] li a.page-one').addClass('ui-btn-active');

                }

                if (to.attr('id') === 'four' ||
                        to.attr('id') === 'five') {

                    /**
                     * The user reaches here when he clicks the pop up's
                     * back button after sending the damages to server
                     */

                    if (window.localStorage.getItem('current_tt') === null ||
                            window.localStorage.getItem('current_tt') === false) {
                        $.mobile.changePage('#one');
                        return;
                    }
                }
            }

        }

        /**
         * The type of to is string when there is a transition from
         * no page to another i.e. during click of back button
         */

        if (typeof to === 'string') {
            var u = $.mobile.path.parseUrl(to);
            to = u.hash || '#' + u.pathname.substring(1);

            if (from) {
                from = '#' + from.attr('id');
            }

            App._lg.log('DEBUG', 'gta-page$pagebeforechange', 'To page: ' + to);
            App._lg.log('DEBUG', 'gta-page$pagebeforechange', 'usr.authenticated: ' + usr.get('authenticated'));

            /**
             * If user is authenticated
             */

            if (to === '#four' ||
                    to === '#five') {

                /**
                 * The user reaches here when he clicks the pop up's
                 * back button after sending the damages to server
                 */

                if (window.localStorage.getItem('current_tt') === null ||
                        window.localStorage.getItem('current_tt') === false) {

                    /**
                     * Changing page to one if there is not tt in cache
                     */

                    App._lg.log('TRACE', 'gta-page$pagebeforechange', ' changing to page one ');
                    $.mobile.changePage('#one');
                }
            }
        }
        App._lg.log('TRACE', 'gta-page$pagebeforechange', "END pagebeforechange");
    } catch (err) {
        App._lg.log('FATAL', 'gta-page$pagebeforechange', JSON.stringify(err));
    }

});

/**
 * Mobile Init
 * Set some global config
 */
$(document).bind("mobileinit", function(){
	$.extend(  $.mobile , {
		defaultPageTransition: 'none', defaultDialogTransition: 'none',
		 showPageLoadingMsg: false
	});
});

/**
 * Device Ready
 * Shows and splash screen and waits for the cordova
 * API to be loaded. Once done changes to page one
 */

document.addEventListener("deviceready", function() {

    "use strict";
    
    /**
     * this variable is used to 
     * validate if change in page has done.
     */
    window.changeInPage = false;
    
    /**
     * Slider widget
     */

    window.slider_five_a = $('.bxslider-five-a').bxSlider({
        infiniteLoop: true,
        hideControlOnEnd: true,
        pager: true,
        pagerSelector: '#pager-five-a',
        pagerType: 'short',
        useCSS: false,
        swipeThreshold: 10
    });

    window.slider_five_b = $('.bxslider-five-b').bxSlider({
        infiniteLoop: true,
        hideControlOnEnd: true,
        pager: true,
        pagerSelector: '#pager-five-b',
        pagerType: 'short',
        useCSS: false,
        swipeThreshold: 10
    });

    window.slider_one = $('.bxslider-one').bxSlider({
        infiniteLoop: true,
        hideControlOnEnd: true,
        pager: true,
        pagerSelector: '#pager-one',
        pagerType: 'short',
        useCSS: false,
        swipeThreshold: 10
    });

    window.slider_four = $('.bxslider-four').bxSlider({
        infiniteLoop: false,
        hideControlOnEnd: true,
        pager: true,
        pagerSelector: '#pager-four',
        pagerType: 'short',
        useCSS: false,
        swipeThreshold: 10
    });

    window.slider_two = $('.bxslider-two').bxSlider({
        infiniteLoop: false,
        hideControlOnEnd: true,
        pager: true,
        pagerSelector: '#pager-two',
        pagerType: 'short',
        useCSS: false,
        swipeThreshold: 10
    });

    /**
     * Localization
     */

    if (App._wrapper.isGlobalization()) {
        App._wrapper.getPreferredLanguage(
            function(lang) {
                var language = new Language(lang.value, Config.log);

                /**
                 * Check if the language exists; if yes
                 * replace all english to selected language.
                 */

                if (language.hasLanguage()) {

                    /**
                     * Find all text nodes and replace them
                     * with its equivalent in given language
                     */

                    $("*").each(function() {
                        if ($(this).children().length === 0) {

                            /**
                             * Get all words of the language
                             */

                            var words = language.get(lang.value);

                            /**
                             * For each word replace with translated
                             */

                            for (var english in words) {
                                if (words.hasOwnProperty(english)) {
                                    $(this).text($(this).text().replace(english, words[english]));
                                }
                            }
                        }
                    });
                }

                /**
                 * Change Page to page one and remove 
                 * splash screen from browser history
                 */

                App._wrapper.clearNavigatorHistory();
                
                if (!App._usr.get('authenticated')) {
                	$.mobile.changePage("#settings");
                	return;
                } else if(!App._usr.get('refreshTime')) {
            		window.refreshCache = true;
            		$.mobile.changePage('#settings');
            		return;
            	} else {
            		var diff = new Date().getTime() - usr.get('refreshTime');
            		App._lg.log('DEBUG', 'deviceready', 'Last cache refresh time : ' + usr.get('refreshTime'));
            		App._lg.log('DEBUG', 'deviceready', "Cache time differance : " + diff + " milliseconds.");
            		if (diff > Config.cacheRefreshTime) {
            			window.refreshCache = true;
            			$.mobile.changePage('#settings');
                		return;
            		} else {
            			$.mobile.changePage('#one');
            		}
            	}
            }
        );
    }
    var pageOne = new ScreenOneView(App._usr, App._lg, App._lang, App._wrapper);
    pageOne.render();
    
    var pageFour = new ScreenFourView(App._usr, App._lg, App._lang, App._wrapper);
    pageFour.render();
}, false);