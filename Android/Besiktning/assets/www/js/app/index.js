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

    if (window.changeInPage && page !== window.prevPage) {
        var htm = '<a href="#' + window.prevPage +
                '" data-role="button" data-inline="true"' +
                ' data-icon="back">Back</a><a href="#' + page +
                '" data-role="button" data-inline="true" data-icon="forward" onclick="window.changeInPage = false;">Continue</a>';
        console.log(htm);
        $('#notify_buttondiv').empty().html(htm);
        $('#a_dialog_notify_changevalidation').click();
    } else {
        $.mobile.changePage("#" + page);
    }
}

/**
 * Screen One Init
 * Creates Survey
 *
 */

$(document).delegate('#one', 'pageshow', function() {

    "use strict";

    window.prevPage = 'one';

    var lg = new Logger(Config.log.level, 'gta-page#one$pageshow', Config.log.type, Config.log.config);

    try {

        /**
         * Environment
         */

        lg.log('TRACE', 'page loaded');
        var req = new Request(Config.url, undefined, Config.log);
        var usr = new User(req, Config.log);
        var language = new Language(undefined, Config.log);
        var wrapper = new Wrapper(lg);
        
        var pageOne = new ScreenOneView(usr, lg, language, wrapper);

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

        pageOne.render();

        /**
         * Only once this page is completed logger should be allowed 
         * to send logs to server
         */

        lg.appLoadingComplete();

    } catch (err) {

        lg.log('FATAL', JSON.stringify(err));

    }

    lg.log('DEBUG', '#one #troubleticketlist html : ' + $('#one #troubleticketlist').html());
});

/**
 * Screen Four Init
 * Creates Damage and adds pictures
 *
 */

$(document).delegate('#four', 'pageshow', function() {

    "use strict";

    window.prevPage = 'four';

    var lg = new Logger(Config.log.level, '#four$pageshow', Config.log.type, Config.log.config);
    var req = new Request(Config.url, undefined, Config.log);
    var usr = new User(req, Config.log);
    var language = new Language(undefined, Config.log);
    var wrapper = new Wrapper(lg);

    var pageFour = new ScreenFourView(usr, lg, language, wrapper);
    pageFour.bindEventHandlers();
    pageFour.render();

});

/**
 * Screen Two Init
 * Shows details of Trouble Ticket
 *
 */

$(document).delegate('#two', 'pageshow', function(e, data) {

    "use strict";

    window.prevPage = 'two';

    var lg = new Logger(Config.log.level, '#two$pageshow', Config.log.type, Config.log.config);
    var language = new Language(undefined, Config.log);
    var wrapper = new Wrapper(lg);

    var pageTwo = new ScreenTwoView(lg, language, wrapper);
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
    
    var lg = new Logger(Config.log.level, '#two$pageshow', Config.log.type, Config.log.config);
    var req = new Request(Config.url, undefined, Config.log);
    var usr = new User(req, Config.log);
    var language = new Language(undefined, Config.log);
    var wrapper = new Wrapper(lg);

    var base64_image = window.localStorage.getItem(window.localStorage.getItem('details_doc_id'));
    
    $('#three img').attr('src', base64_image);
    $('#three img').css('width', ($(document).width() - 20));
    $('#three img').css('height', 'auto');

    e.preventDefault();
    
    var pageThree = new ScreenThreeView(usr, lg, language, wrapper);
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

    //Environment SetUp
    var lg = new Logger(Config.log.level, 'gta-page#five$pageshow', Config.log.type, Config.log.config);
    var req = new Request(Config.url, undefined, Config.log);
    var usr = new User(req, Config.log);
    var language = new Language(undefined, Config.log);
    var wrapper = new Wrapper(lg);

    var pageFive = new ScreenFiveView(usr, lg, language, wrapper);
    pageFive.bindEventHandlers();
    pageFive.render();

    /**
     * Only once this page is completed logger should be allowed 
     * to send logs to server
     */

    lg.appLoadingComplete();
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

    var lg = new Logger(Config.log.level, 'gta-page#contact$pageshow', Config.log.type, Config.log.config);

    var pageContact = new ScreenContactView(lg);
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

    var lg = new Logger(Config.log.level, 'gta-page#settings$pageshow', Config.log.type, Config.log.config);
    var language = new Language(undefined, Config.log);
    var wrapper = new Wrapper(lg);

    try {

        /**
         * Environment SetUp
         */

        var req = new Request(Config.url, undefined, Config.log);
        var usr = new User(req, Config.log);
        var pageSettings = new ScreenSettingsView(usr, lg, language, req, wrapper);

        pageSettings.bindEventHandlers();
        pageSettings.render();

        lg.log('TRACE', 'page loaded');

    } catch (err) {

        lg.log('FATAL', JSON.stringify(err));

    }
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

        /**
         * Environment SetUp
         */

        var lg = new Logger(Config.log.level, 'gta-page$pagebeforechange', Config.log.type, Config.log.config);
        var req = new Request(Config.url, undefined, Config.log);
        var usr = new User(req, Config.log);
        var wrapper = new Wrapper(lg);

        var to = data.toPage,
                from = data.options.fromPage;

        lg.log('TRACE', typeof to);
        lg.log('TRACE', ' $.mobile.urlHistory :' + JSON.stringify($.mobile.urlHistory.stack));

        /**
         * Clear any browser cache
         */

        wrapper.clearNavigatorCache();

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
                lg.log('TRACE', ' Application loaded and user is not authenticated ');
                e.preventDefault();
                $.mobile.changePage('#settings');
                return;
            }

            /**
             * Access Control
             * Check if the user is authenticated
             * if not show him the access denied page
             */

            lg.log('DEBUG', 'usr.authenticated: ' + usr.get('authenticated'));
            lg.log('DEBUG', ' to.attr(id): ' + to.attr('id'));

            if (to.attr('id') === 'settings') {

                $('#' + to.attr('id') + ' div[data-role=navbar] li a.page-settings').addClass('ui-btn-active');

            }

            if (to.attr('id') === 'contact') {

                $('#' + to.attr('id') + ' div[data-role=navbar] li a.page-contact').addClass('ui-btn-active');

            }


            if (!usr.get('authenticated')) {

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

            lg.log('DEBUG', 'To page: ' + to);
            lg.log('DEBUG', 'usr.authenticated: ' + usr.get('authenticated'));

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

                    lg.log('TRACE', ' changing to page one ');
                    $.mobile.changePage('#one');
                }
            }
        }
        lg.log('TRACE', "END pagebeforechange");
    } catch (err) {

        lg.log('FATAL', JSON.stringify(err));

    }

});

/**
 * Device Ready
 * Shows and splash screen and waits for the cordova
 * API to be loaded. Once done changes to page one
 */

document.addEventListener("deviceready", function() {

    "use strict";
    
    var lg = new Logger(Config.log.level, 'deviceready', Config.log.type, Config.log.config);
    var wrapper = new Wrapper(lg);
    
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

    if (wrapper.isGlobalization()) {
        wrapper.getPreferredLanguage(
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

                    $.mobile.changePage('#one');

                    wrapper.clearNavigatorHistory();
                }
        );
    }
}, false);