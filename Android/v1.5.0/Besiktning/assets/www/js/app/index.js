var app = {
    // application Constructor
    initialize: function() {
    	/**
		 * Slider widget
		 */

		this.slider_five_a = $('.bxslider-five-a').bxSlider({
		    infiniteLoop: false,
		    hideControlOnEnd: true,
		    pager: true,
		    pagerSelector: '#pager-five-a',
		    pagerType: 'short',
		    useCSS: false,
		    swipeThreshold: 10,
		    responsive: false,
		    adaptiveHeight: true,
		    onSliderLoad: function(ci) {
		    	window.localStorage.setItem('details_tt_id', $( ".bxslider-five-a li:nth-child(" + (ci + 1) + ") a" ).attr('id'));
		    },
		    onSlideAfter: function(se, oi, ci){
		    	window.localStorage.setItem('details_tt_id', $( ".bxslider-five-a li:nth-child(" + (ci + 1) + ") a" ).attr('id'));
		    }
		});

		this.slider_five_b = $('.bxslider-five-b').bxSlider({
		    infiniteLoop: false,
		    hideControlOnEnd: true,
		    pager: true,
		    pagerSelector: '#pager-five-b',
		    pagerType: 'short',
		    useCSS: false,
		    swipeThreshold: 10,
		    responsive: false,
		    adaptiveHeight: true,
		    onSliderLoad: function(ci) {
		    	window.localStorage.setItem('latest_damage_index', $( ".bxslider-five-b li:nth-child(" + (ci + 1) + ") a" ).attr('id'));
		    },
		    onSlideAfter: function(se, oi, ci){
		    	window.localStorage.setItem('latest_damage_index', $( ".bxslider-five-b li:nth-child(" + (ci + 1) + ") a" ).attr('id'));
		    }
		});

		this.slider_one = $('.bxslider-one').bxSlider({
		    infiniteLoop: false,
		    hideControlOnEnd: true,
		    pager: true,
		    pagerSelector: '#pager-one',
		    pagerType: 'short',
		    useCSS: false,
		    swipeThreshold: 10,
		    responsive: false,
		    adaptiveHeight: true,
		    onSliderLoad: function(ci) {
		    	window.localStorage.setItem('details_tt_id', $( ".bxslider-one li:nth-child(" + (ci + 1) + ") a" ).attr('id'));
		    },
		    onSlideAfter: function(se, oi, ci){
		    	window.localStorage.setItem('details_tt_id', $( ".bxslider-one li:nth-child(" + (ci + 1) + ") a" ).attr('id'));
		    }
		});

		this.slider_four = $('.bxslider-four').bxSlider({
		    infiniteLoop: false,
		    hideControlOnEnd: true,
		    pager: true,
		    pagerSelector: '#pager-four',
		    pagerType: 'short',
		    useCSS: false,
		    swipeThreshold: 10,
		    responsive: false,
		    adaptiveHeight: true
		});

		this.slider_two = $('.bxslider-two').bxSlider({
		    infiniteLoop: false,
		    hideControlOnEnd: true,
		    pager: true,
		    pagerSelector: '#pager-two',
		    pagerType: 'short',
		    useCSS: false,
		    swipeThreshold: 10,
		    adaptiveHeight: true
		});
		
		this._lg = new Logger(Config.log.level, Config.log.type, Config.log.config);
		this._req = new Request(Config.url, undefined, Config.log);
		this._usr = new User(this._req, Config.log);
		this._lang = new Language(undefined, Config.log);
		this._wrapper = new Wrapper(this._lg);
		this.changeInPage = false;
		this.pageOneLoaded = false;
		this.pageFourLoaded = false;
		
		/**
		 * Bind Events
		 */
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
    	console.log('Received Event: ' + id);
    	
		if (app._wrapper.isGlobalization()) {
	        app._wrapper.getPreferredLanguage(
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
	            }
	        );
	    }
    }
};