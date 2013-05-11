/**
 *
 * Mobile App basedon Phonegap (Apache Cordova)
 * 
 * Application works over REST API 
 * 
 * @since     20 April 2013
 * @author    Anshuk Kumar <anshuk.kumar at essindia dot co dot in>
 * @preserve  copyright 2013 Gizur AB 
 */
//document.addEventListener("deviceready", onDeviceReady, false);

//function onDeviceReady() {


    /*
    $(document).delegate('#one', 'pagebeforeshow', function(e, data){
        //Environment SetUp
        var lg = new Logger('DEBUG', 'gta-page#one$pagebeforecreate');   
        var req = new Request(Config.url, Config.client_id);
        var usr = new User(req);
  
        lg.log('TRACE', 'setting username and password');  

        usr.set('username', 'mobile_user@gizur.com');
        usr.set('password', 'ivry34aq');

        lg.log('TRACE', 'checking authentication'); 
        if (!usr.get('authenticated')) {
            e.preventDefault();
            //redirect
            $.mobile.changePage('#settings');
        }         
    });
    */
    $(document).delegate('#one', 'pageshow', function () {
        //Environment SetUp
        var lg = new Logger('DEBUG', 'gta-page#five$pageshow'); 
        lg.log('TRACE', 'page loaded');

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
        //Environment SetUp
        var lg = new Logger('TRACE', 'gta-page#five$pageshow'); 
        var req = new Request(Config.url, Config.client_id);
        var usr = new User(req);

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

    $(document).delegate('#contact', 'pageshow', function () {
        //Environment SetUp
        var lg = new Logger('TRACE', 'gta-page#contact$pageshow'); 

        lg.log(' page loaded: ');

    });

    $(document).delegate('#settings', 'pageshow', function () {
        //Environment SetUp
        var lg = new Logger('TRACE','gta-page#settings$pageshow'); 
        var req = new Request(Config.url, Config.client_id);
        var usr = new User(req);

        lg.log('TRACE', 'page loaded: ');

        //Load values 
        $('#settings_username').val(usr.get('username'));
        $('#settings_password').val(usr.get('password'));
        $('#settings_client_id').val(req.getClientId());

        $('#settings_save').unbind('click').bind('click', function(){
            lg.log('TRACE', ' username: ' + $('#settings_username').val());
            lg.log('TRACE', ' password: ' + $('#settings_password').val());
            lg.log('TRACE', ' client_id: ' + $('#settings_client_id').val());

            var success = function(data){
                lg.log('TRACE', ' success');

                $('#dialog div[data-role=header]').html('<h1>Success</h1>');
                $('#dialog div[data-role=content]').children().first().html('Credentials authenticated!');
                $('#a_dialog').click();                
            };

            var error = function(jqxhr, status, er){
                lg.log('TRACE', ' error ' + status);
            };

            //Saving the client id to cache
            req.setClientId($('#settings_client_id').val());

            usr.set('username', $('#settings_username').val());
            usr.set('password', $('#settings_password').val());

            usr.authenticate(success, error);
        });

        lg.log('TRACE', '#settings_save click binding done.');

    });

    $(document).bind('pagebeforechange', function(e, data) {
        //Environment SetUp
        var lg = new Logger('DEBUG', 'gta-page$pagebeforechange'); 
        var req = new Request(Config.url, Config.client_id);
        var usr = new User(req);

        var to = data.toPage,
            from = data.options.fromPage;

        lg.log('TRACE', typeof to);

        if (typeof to === 'object') {
          if (to.attr('id') == 'one' && !usr.get('authenticated')) {
            e.preventDefault();
            $.mobile.changePage('#settings');
          }
        }

        if (typeof to === 'string') {
            var u = $.mobile.path.parseUrl(to);
            to = u.hash || '#' + u.pathname.substring(1);
            if (from) from = '#' + from.attr('id');

            lg.log('DEBUG', 'To page: ' + to);
            lg.log('DEBUG', 'usr.authenticated: ' + usr.get('authenticated'));

            if (to === '#one' && !usr.get('authenticated')) {
                e.preventDefault();

                // remove active class on button
                // otherwise button would remain highlighted
                $.mobile.activePage
                    .find('.ui-btn-active')
                    .removeClass('ui-btn-active');

            }            
        }
    }); 
   
//}