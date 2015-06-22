/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, 
         bitwise:true, strict:true, undef:false, unused:true, 
         curly:true, browser:true, indent:4, maxerr:50 */

/*global node_unit:true, exports:false*/

/**
 * Object App
 * 
 * @fileoverview Application file 
 * @author prabhat.khera@essindia.co.in (Prabhat Khera)
 * @license Commercial - Copyright 2013 Gizur AB
 * @see http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml
 */

var lg = new Logger(Config.log.level, Config.log.type, Config.log.config);
var req = new Request(Config.url, undefined, Config.log);
var usr = new User(req, Config.log);
var language = new Language(undefined, Config.log);
var wrapper = new Wrapper(lg);

var App = {
	_lg : lg,
	_req : req,
	_usr : usr,
	_lang : language,
	_wrapper : wrapper,
    changeInPage : false,
    pageOneLoaded : false,
    pageFourLoaded : false
};


/**
 * Slider widget
 */

App.slider_five_a = $('.bxslider-five-a').bxSlider({
    infiniteLoop: true,
    hideControlOnEnd: true,
    pager: true,
    pagerSelector: '#pager-five-a',
    pagerType: 'short',
    useCSS: false,
    swipeThreshold: 10
});

App.slider_five_b = $('.bxslider-five-b').bxSlider({
    infiniteLoop: true,
    hideControlOnEnd: true,
    pager: true,
    pagerSelector: '#pager-five-b',
    pagerType: 'short',
    useCSS: false,
    swipeThreshold: 10
});

App.slider_one = $('.bxslider-one').bxSlider({
    infiniteLoop: true,
    hideControlOnEnd: true,
    pager: true,
    pagerSelector: '#pager-one',
    pagerType: 'short',
    useCSS: false,
    swipeThreshold: 10
});

App.slider_four = $('.bxslider-four').bxSlider({
    infiniteLoop: false,
    hideControlOnEnd: true,
    pager: true,
    pagerSelector: '#pager-four',
    pagerType: 'short',
    useCSS: false,
    swipeThreshold: 10
});

App.slider_two = $('.bxslider-two').bxSlider({
    infiniteLoop: false,
    hideControlOnEnd: true,
    pager: true,
    pagerSelector: '#pager-two',
    pagerType: 'short',
    useCSS: false,
    swipeThreshold: 10
});
 /**
 * For node-unit test
 */
if (typeof node_unit !== 'undefined') {
    exports.App = App;
}
