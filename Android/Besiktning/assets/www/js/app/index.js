/*
 *
 * Mobile App basedon Phonegap (Apache Cordova)
 * 
 * Application works over REST API 
 * 
 * @since     20 April 2013
 * @author    Anshuk Kumar <anshuk.kumar at essindia dot co dot in>
 * @preserve  copyright 2013 Gizur AB 
 */

$(document).delegate('#one', 'pageshow', function () {
    //Your code for each page load here
    $('.bxslider-one').bxSlider({
          infiniteLoop: false,
          hideControlOnEnd: true,
          pager:true,
          pagerSelector: '#pager-one',
          pagerType: 'short',         
          useCSS:false
    });
});

$(document).delegate('#four', 'pageshow', function () {
    //Your code for each page load here
    $('.bxslider-four').bxSlider({
          infiniteLoop: false,
          hideControlOnEnd: true,
          pager: true,
          pagerSelector: '#pager-four',
          pagerType: 'short',
          useCSS:false
    });
});
$(document).delegate('#two', 'pageshow', function () {
    //Your code for each page load here
    $('.bxslider-two').bxSlider({
          infiniteLoop: false,
          hideControlOnEnd: true,
          pager: true,
          pagerSelector: '#pager-two',
          pagerType: 'short',
          useCSS:false
    });
});
$(document).delegate('#five', 'pageshow', function () {
    //Your code for each page load here
    $('.bxslider-five-a').bxSlider({
          infiniteLoop: false,
          hideControlOnEnd: true,
          pager: true,
          pagerSelector: '#pager-five-a',
          pagerType: 'short',
          useCSS:false
    });
    $('.bxslider-five-b').bxSlider({
          infiniteLoop: false,
          hideControlOnEnd: true,
          pager: true,
          pagerSelector: '#pager-five-b',
          pagerType: 'short',
          useCSS:false
    });
});
