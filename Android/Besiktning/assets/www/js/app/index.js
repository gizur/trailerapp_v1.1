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
        var lg_one = new Logger('DEBUG', 'gta-page#one$pageshow'); 
        lg_one.log('TRACE', 'page loaded');

        var usr = new User();

        /**
         * ------------------
         * Event Bindings
         * ------------------
         */

        /**
         * Slider widget
         */

        $('.bxslider-one').bxSlider({
              infiniteLoop: false,
              hideControlOnEnd: true,
              pager:true,
              pagerSelector: '#pager-one',
              pagerType: 'short',         
              useCSS:false
        });

        /**
         * OnChange Event for trailer type
         * load matching assets into trailerid select menu
         */

        $('#one select#trailertype').unbind('change').change(function(){
            lg_one.log('TRACE', 'trailertype change event start');

            /**
             * Create the assetcollection object
             * this object automatically loads the cached
             * list of assets
             */
            var ac = new AssetCollection(usr);

            lg_one.log('TRACE', 'assets filtered START');

            /**
             * Use stapes method to filter out related trailer ids
             */
            var assets = ac.filter(function(item, key) {
                return item.get('trailertype') === $('#one select#trailertype option:selected').text();
            });

            lg_one.log('DEBUG', 'assets filtered list : ' + JSON.stringify(assets));
            
            lg_one.log('TRACE', 'assets filtered END');

            /**
             * Load the filtered trailer ids into the select menu
             * and refresh both trailer id and trailer type select menu
             * as jquery mobile needs this, else it does not reflect 
             * on the UI.
             */
            $('#one select#trailerid').html('');
            for (var index in assets) {
                    $('#trailerid').append('<option value="' + assets[index].get('assetname') + '">' + assets[index].get('assetname') + '</option>');
            }
            $('#one select#trailerid').selectmenu('refresh');
            $('#one select#trailertype').selectmenu('refresh');

            lg_one.log('trailertype change event end');
        });        

        /**
         * -------------------
         * Initialize the page
         * -------------------
         */

        /**
         * Create a new Asset object this object should have a cached
         * enum list of trailer types
         */
        var ast = new Asset(usr);
        var enum_trailertype = ast.get('enum_trailertype');

        lg_one.log('DEBUG', 'enum_trailertype : ' + JSON.stringify(enum_trailertype));

        /**
         * Load the trailer types into the select menu
         * and refresh UI.
         */
        $('#one select#trailertype').html('');
        for (var index in enum_trailertype) {
            $('#one select#trailertype').append('<option value="' + enum_trailertype[index].value + '">' + enum_trailertype[index].label + '</option>');
        }
        $('#one select#trailertype').selectmenu('refresh');

        /**
         * Create a new TroubleTicekt object this object should have a cached
         * enum sealed
         */
        var tt = new TroubleTicket(usr);
        var enum_sealed = tt.get('enum_sealed');
        var enum_place = tt.get('enum_place');

        lg_one.log('DEBUG', 'enum_sealed : ' + JSON.stringify(enum_sealed));

        /**
         * Load the trailer types into the select menu
         * and refresh UI.
         */
        $('#one #sealed').html('');
        $('#one #sealed').append('<legend>Plomerad</legend>');
        for (var index in enum_sealed) {           
            $('#one #sealed').append('<input id="radio' + index + '" name="sealed" value="' + enum_sealed[index].value + '" type="radio">');
            $('#one #sealed').append('<label for="radio' + index + '">' +  enum_sealed[index].label + '</label>');
        }
        $('#one #sealed').trigger('create');
        $('#one #sealed').controlgroup();   

        lg_one.log('DEBUG', 'enum_place : ' + JSON.stringify(enum_place));

        /**
         * Load the trailer types into the select menu
         * and refresh UI.
         */
        $('#one select#place').html('');
        for (var index in enum_place) {
            $('#one select#place').append('<option value="' + enum_place[index].value + '">' + enum_place[index].label + '</option>');
        }
        $('#one select#place').selectmenu('refresh');                    

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
        var lg_settings = new Logger('TRACE','gta-page#settings$pageshow'); 
        var req = new Request(Config.url, Config.client_id);
        var usr = new User(req);

        lg_settings.log('TRACE', 'page loaded');

        //Load values 
        $('#settings_username').val(usr.get('username'));
        $('#settings_password').val(usr.get('password'));
        $('#settings_client_id').val(req.getClientId());

        $('#settings_save').unbind('click').bind('click', function(){

            lg_settings.log('TRACE', ' username: ' + $('#settings_username').val());
            lg_settings.log('TRACE', ' password: ' + $('#settings_password').val());
            lg_settings.log('TRACE', ' client_id: ' + $('#settings_client_id').val());

            var success = function(data){
                lg_settings.log('TRACE', ' successfully authenticated');

                var tt = new TroubleTicket(usr);
                var dmg = new Damage(usr);
                var ast = new Asset(usr);
                var ac = new AssetCollection(usr);

                lg_settings.log('TRACE', ' starting to cache');

                //start caching picklists
                tt.getEnumPlace();
                tt.getEnumSealed();

                dmg.getEnumDamageType();
                dmg.getEnumDamagePosition();
                dmg.getEnumDriverCausedDamage();

                lg_settings.log('TRACE', ' type of ast ' + (typeof ast));

                ast.getEnumTrailerType();
                ac.getAssets();

                //Show success message
                $('#dialog div[data-role=header]').html('<h2>Success</h2>');
                $('#dialog div[data-role=content]').children().first().html('Credentials authenticated!');
                $('#a_dialog').click();                
            };

            var error = function(jqxhr, status, er){
                lg_settings.log('TRACE', ' error ');

                var data = JSON.parse(jqxhr.responseText);
                var message;

                if (data.error.message == 'Invalid Username and Password') {
                    message = data.error.message;
                } else {
                    message = 'Contact Gizur Saas Account holders, details are available under \'Contact\' tab.';
                }

                $('#dialog div[data-role=header]').html('<h2>Authentication Failed</h2>');
                $('#dialog div[data-role=content]').children().first().html(message);
                $('#a_dialog').click();

            };

            //Saving the client id to cache
            req.setClientId($('#settings_client_id').val());

            //Seting username and password for authentication
            usr.set('username', $('#settings_username').val());
            usr.set('password', $('#settings_password').val());

            //This caches both the username, password and 
            //authenticated flag before and after authenticating
            usr.authenticate(success, error);
        });

        lg_settings.log('TRACE', '#settings_save click binding done.');

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


            //Access Control
            //Check if the user is authenticated
            //if not show him the access denied page
            if (to === '#one' && !usr.get('authenticated')) {
                e.preventDefault();

                // remove active class on button
                // otherwise button would remain highlighted
                $.mobile.activePage
                    .find('.ui-btn-active')
                    .removeClass('ui-btn-active');

                $('#dialog div[data-role=header]').html('<h3>Access Denied</h3>');
                $('#dialog div[data-role=content]').children().first().html('You have not been authenticated. Please enter valid credentials and click save.');
                $('#a_dialog').click(); 

            }            
        }
    }); 
   
//}