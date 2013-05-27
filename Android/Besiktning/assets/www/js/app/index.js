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

$(document).delegate('#one', 'pageshow', function () {
    //Environment SetUp
    var lg_one = new Logger('FATAL', 'gta-page#one$pageshow'); 
    lg_one.log('TRACE', 'page loaded');
    var req = new Request(Config.url, Config.client_id);
    var usr = new User(req);
    var language = new Language();

    //For Debugging : The line below must be commented
    //window.localStorage.removeItem('17x519_tt');

    /**
     * ------------------
     * Event Bindings
     * ------------------
     */

    /**
     * Slider widget
     */

    var slider = $('.bxslider-one').bxSlider({
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
            return item.get('trailertype') === $('#one select#trailertype option:selected').html();
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
        
        $('#trailerid').append('<option value=""> - Select One - </option>');

        for (var index in assets) {
            $('#trailerid').append('<option value="' + assets[index].get('assetname') + '">' + assets[index].get('assetname') + '</option>');
        }
        $('#one select#trailerid').selectmenu('refresh');
        $('#one select#trailertype').selectmenu('refresh');

        lg_one.log('trailertype change event end');
    });   

    /**
     * OnChange Event for trailer id
     * get Damaged trouble tickets of the given trailer id
     */

    $('#one select#trailerid').unbind('change').change(function(){
        lg_one.log('TRACE', 'trailerid change event start');

        /**
         * Create the assetcollection object
         * this object automatically loads the cached
         * list of assets
         */

        var ttc = new TroubleTicketCollection(usr);

        $('#one select#trailerid').selectmenu('refresh');

        var success = function(data){
            var tts = ttc.getAll();

            //A memory issue is encountered when the following 
            //line is uncommented
            //lg_one.log('DEBUG', ' tts ' + JSON.stringify(tts));

            $('#one #troubleticketlist').html('');
            tt_list = {};
            var tt_list_html = '';
            for (index in tts) {

                lg_one.log('DEBUG', ' tts[index].get(id) ' + tts[index].get('id'));

                var clipped_tt = tts[index].getAll();

                lg_one.log('DEBUG', ' tts[index].asset instanceof Asset ' + (tts[index].get('asset') instanceof Asset));
                lg_one.log('DEBUG', "tts[index].get('damageposition') " + tts[index].get('damageposition'));
                lg_one.log('DEBUG', "tts[index].get('damagetype') " + tts[index].get('damagetype'));

                clipped_tt.trailerid =  tts[index].get('asset').get('assetname');

                delete clipped_tt.asset;
                delete clipped_tt.enum_place;
                delete clipped_tt.enum_sealed;

                var li_tt = "<li><center><div style='height:60px;width:200px;'><a id='" + clipped_tt.id + "' href='javascript:void(0);'>" + tts[index].get('damageposition') + ' ' + tts[index].get('damagetype') + "</a></div></center></li>";

                tt_list_html += li_tt; 

                $('#one #troubleticketlist').append(li_tt);
                window.localStorage.setItem(tts[index].get('id') + '_tt', JSON.stringify(clipped_tt));                
            }

            /**
             * Save the downloaded trouble ticket collection
             */
            tt_list.html = tt_list_html;
            tt_list.position = 0;
            window.localStorage.setItem('tt_list', JSON.stringify(tt_list));

            slider.reloadSlider();
        }

        ttc.getDamagedTroubleTicketsByAsset($('#one select#trailerid option:selected').text(), success);

        lg_one.log('trailerid change event end');
    });  

    /**
     * OnChange Event for trailer id
     * get Damaged trouble tickets of the given trailer id
     */

    $('#one #reportsurvey').unbind('click').click(function(){
        lg_one.log('TRACE', 'reportsurvey click START');

        /**
         * Validate
         */

        if ($('#one #trailerid option:selected').length == 0) {
            //Show success pop up
            $('#dialog div[data-role=header]').html('<h2>Error</h2>');
            $('#dialog a[data-role=button]').attr('href', '#one');            
            $('#dialog div[data-role=content]').children().first().html('Please select a Trailer.');
            $('#a_dialog').click();             
            return;
        }

        if ($('#one #place option:selected').length == 0) {
            //Show success pop up
            $('#dialog div[data-role=header]').html('<h2>Error</h2>');
            $('#dialog div[data-role=content]').children().first().html('Please select a Place.');
            $('#dialog a[data-role=button]').attr('href', '#one');
            $('#a_dialog').click();             
            return;
        }        

        if ($('#one input[name=sealed]:checked').length == 0) {
            //Show success pop up
            $('#dialog div[data-role=header]').html('<h2>Error</h2>');
            $('#dialog div[data-role=content]').children().first().html('Please select if sealed or not.');
            $('#dialog a[data-role=button]').attr('href', '#one');
            $('#a_dialog').click();             
            return;
        }        

        /**
         * Create the assetcollection object
         * this object automatically loads the cached
         * list of assets
         */
        var tt = new TroubleTicket(usr);

        var success = function(data){
            //Show success pop up
            $('#dialog div[data-role=header]').html('<h2>Success</h2>');
            $('#dialog div[data-role=content]').children().first().html('Survey reported successfully.');
            $('#a_dialog').click();                 
        }

        var error = function(jqxhr, status, er) {
            //Show error pop up
            $('#dialog div[data-role=header]').html('<h2>Error</h2>');
            $('#dialog div[data-role=content]').children().first().html('Could not report survey.');
            $('#a_dialog').click();                
        }

        var ast = new Asset();
        ast.set('assetname', escapeHtmlEntities($('#one #trailerid option:selected').text()));

        tt.set({
            'asset' : ast,
            'place' : escapeHtmlEntities($('#one #place option:selected').text()),
            'sealed' : escapeHtmlEntities($('#one input[name=sealed]:checked').val())
        });

        tt.save(success, error);

        lg_one.log('TRACE', 'reportsurvey click END');
    });                     

    /**
     * Report damage
     * get Damaged trouble tickets of the given trailer id
     */

    $('#one #reportdamage').unbind('click').click(function(){
        lg_one.log('TRACE', 'reportdamage click START');

        /**
         * Validate
         */

        if ($('#one #trailertype option:selected').attr('value') == '') {
            //Show success pop up
            $('#dialog div[data-role=header]').html('<h2>Error</h2>');
            $('#dialog div[data-role=content]').children().first().html('Please select a Trailer Type.');
            $('#dialog a[data-role=button]').attr('href', '#one');
            $('#a_dialog').click();             
            return;
        } 

        if ($('#one #trailerid option:selected').attr('value') == '') {
            //Show success pop up
            $('#dialog div[data-role=header]').html('<h2>Error</h2>');
            $('#dialog div[data-role=content]').children().first().html('Please select a Trailer.');
            $('#dialog a[data-role=button]').attr('href', '#one');
            $('#a_dialog').click();             
            return;
        }   

        if ($('#one #place option:selected').attr('value') == '') {
            //Show success pop up
            $('#dialog div[data-role=header]').html('<h2>Error</h2>');
            $('#dialog div[data-role=content]').children().first().html('Please select a Place.');
            $('#dialog a[data-role=button]').attr('href', '#one');
            $('#a_dialog').click();             
            return;
        }

        if ($('#one input[name=sealed]:checked').length == 0) {
            //Show success pop up
            $('#dialog div[data-role=header]').html('<h2>Error</h2>');
            $('#dialog div[data-role=content]').children().first().html('Please select if sealed or not.');
            $('#a_dialog').click();             
            return;
        }      

        if (current_tt == null)   
            current_tt = {};

        current_tt.trailertype = escapeHtmlEntities($('#one #trailertype option:selected').text());
        current_tt.trailerid = escapeHtmlEntities($('#one #trailerid option:selected').text());
        current_tt.place = escapeHtmlEntities($('#one #place option:selected').text());
        current_tt.sealed = escapeHtmlEntities($('#one input[name=sealed]:checked').val());

        window.localStorage.setItem('current_tt', JSON.stringify(current_tt));

        lg_one.log('TRACE', 'reportdamage current tt saved : ' + JSON.stringify(current_tt));

        slider.hide();
        slider.destroySlider();
        
        $.mobile.changePage('#four');

        lg_one.log('TRACE', 'reportdamage click END');
    });          

    /**
     * OnClick of a trouble ticket in widget list
     * 
     */

    $('.bxslider-one li a').unbind('click').live('click', function(e){
        e.preventDefault();

        var that = this;
        var tt = new TroubleTicket(usr);

        lg_one.log('TRACE', '.bxslider-one li a click start');
        lg_one.log('DEBUG', " $(this).attr('id') " + $(this).attr('id'));   

        // Save the position

        tt_list = JSON.parse(window.localStorage.getItem('tt_list'));
        tt_list.position = slider.getCurrentSlide();
        window.localStorage.setItem('tt_list', JSON.stringify(tt_list));  

        var success = function(data) {

            lg_one.log('TRACE', '.bxslider-one li a click start');            

            var doc = new Doc(usr);
            doc.set(data.result.documents[0]);

            //Download Images
            var successCb = function(data) {
                lg_one.log('TRACE', 'successCb Download Images start');

                /**
                 * Save the page state
                 */

                if (current_tt == null)   
                    current_tt = {};

                current_tt.trailertype = escapeHtmlEntities($('#one #trailertype option:selected').text());
                current_tt.trailerid = escapeHtmlEntities($('#one #trailerid option:selected').text());
                current_tt.place = escapeHtmlEntities($('#one #place option:selected').text());
                current_tt.sealed = escapeHtmlEntities($('#one input[name=sealed]:checked').val());

                window.localStorage.setItem('current_tt', JSON.stringify(current_tt));  
                lg_one.log('TRACE', 'successCb saved current tt state');

                /**
                 * Set initial state for page two
                 */                

                var gas = tt.getAllSanitized();
                gas.docs = Array();
                gas.docs.push({'path': doc.get('path')});              

                window.localStorage.setItem('details_tt_id', $(that).attr('id'));
                window.localStorage.setItem($(that).attr('id') + '_tt', JSON.stringify(gas));

                lg_one.log('TRACE', 'successCb saved initial state for page two');

                $.mobile.changePage('#two');
            };

            var errorCb = function(jqxhr, status, er) {
                lg_one.log('TRACE', 'errorCb Download Images start');
            };

            doc.download(successCb, errorCb);
        };

        var error = function() {

        };

        tt.getById($(this).attr('id'), success, error);
    });

    /**
     * -------------------
     * Initialize the page
     * -------------------
     */

    /**
     * Load from cache if available
     * this cache is cleared when the Troubleticket is submitted successfully
     */

    var current_tt = JSON.parse(window.localStorage.getItem('current_tt'));
    var selected; //text to save selected attr 

    lg_one.log('DEBUG', 'from cache current_tt : ' + JSON.stringify(current_tt));

    /**
     * Create a new Asset object this object should have a cached
     * enum list of trailer types
     */
    var ast = new Asset(usr);
    var enum_trailertype = ast.get('enum_trailertype');

    $('#one select#trailerid').html('');   

    lg_one.log('DEBUG', 'enum_trailertype : ' + JSON.stringify(enum_trailertype));

    /**
     * Load the trailer types into the select menu
     * and refresh UI.
     */

    $('#one select#trailertype').html('');
    $('#one select#trailertype').append('<option value=""> - Select One - </option>');    
    for (var index in enum_trailertype) {

        //Load value from cache
        selected = '';
        if (current_tt != null && enum_trailertype[index].value == current_tt.trailertype) {
            selected = 'selected="selected"';
            lg_one.log('DEBUG', 'selected trailer type : ' + enum_trailertype[index].value);            
        }

        $('#one select#trailertype').append('<option ' + selected + ' value="' + enum_trailertype[index].value + '">' + enum_trailertype[index].label + '</option>');
    }
    $('#one select#trailertype').selectmenu('refresh');

    /**
     * Load the trailerids based on the trailer typ
     *
     */

    var ac = new AssetCollection(usr);
    var assets = ac.filter(function(item, key) {
        return item.get('trailertype') === $('#one select#trailertype option:selected').text();
    });

    $('#trailerid').append('<option value=""> - Select One - </option>');

    for (var index in assets) {

        //Load value from cache
        selected = '';
        lg_one.log('DEBUG', 'loop  preload trailer id : ' + assets[index].get('assetname'));
        lg_one.log('DEBUG', 'loop  preload trailer id : ' + current_tt.trailerid);
        lg_one.log('DEBUG', 'loop  preload are they equal : ' + (assets[index].get('assetname') == current_tt.trailerid));
        
        if (current_tt != null && assets[index].get('assetname') == current_tt.trailerid) {
            selected = 'selected="selected"';
            lg_one.log('DEBUG', 'selected trailer id : ' + assets[index].get('assetname'));            
        }

        $('#trailerid').append('<option ' + selected + ' value="' + assets[index].get('assetname') + '">' + assets[index].get('assetname') + '</option>');
    }
    $('#one select#trailerid').selectmenu('refresh');     

    /**
     * Create a new TroubleTicket object this object should have a cached
     * enum sealed
     */

    var tt = new TroubleTicket(usr);
    var enum_sealed = tt.get('enum_sealed');
    var enum_place = tt.get('enum_place');

    lg_one.log('DEBUG', 'enum_sealed : ' + JSON.stringify(enum_sealed));

    /**
     * Load the sealed into the select menu
     * and refresh UI.
     */

    $('#one #sealed').html('');
    $('#one #sealed').append('<legend>' + language.translate('Sealed') + '</legend>');

    for (var index in enum_sealed) {    

        //Load value from cache
        selected = '';
        if (current_tt != null && enum_sealed[index].value == current_tt.sealed) {
            selected = 'checked="checked"';
            lg_one.log('DEBUG', 'selected sealed : ' + enum_sealed[index].value);                        
        }

        $('#one #sealed').append('<input ' + selected + ' id="radio' + index + '" name="sealed" value="' + enum_sealed[index].value + '" type="radio">');
        $('#one #sealed').append('<label for="radio' + index + '">' +  enum_sealed[index].label + '</label>');
    }
    $('#one #sealed').trigger('create');
    $('#one #sealed').controlgroup();   

    lg_one.log('DEBUG', 'enum_place : ' + JSON.stringify(enum_place));

    /**
     * Load the place into the select menu
     * and refresh UI.
     */
    $('#one select#place').html('');
    $('#one select#place').append('<option value=""> - Select One - </option>');

    for (var index in enum_place) {

        //lg_one.log('DEBUG', 'enum_place value : ' + enum_place[index].value);        

        //Load value from cache
        selected = '';        
        if (current_tt != null && enum_place[index].value == current_tt.place) {
            selected = 'selected="selected"';
            lg_one.log('DEBUG', 'selected place : ' + enum_place[index].value);                                    
        }

        $('#one select#place').append('<option ' + selected + ' value="' + enum_place[index].value + '">' + enum_place[index].label + '</option>');
    }

    lg_one.log('DEBUG', '#one select#place html : ' + $('#one select#place').html());

    $('#one select#place').selectmenu('refresh');    

    /**
     * Load the perviously fetched tt list from cache
     * to slider
     * 
     */

    var tt_list = JSON.parse(window.localStorage.getItem('tt_list'));
    if (tt_list != null && current_tt != null) {
        lg_one.log('DEBUG', 'reloading slider for troubleticketlist  to position ' + tt_list.position);        

        $('#one #troubleticketlist').html(tt_list.html);
        slider.reloadSlider();
        slider.goToSlide(tt_list.position);        
    } else {
        $('#one #troubleticketlist').html("<li><center><div style='height:60px;width:120px;'>No TroubleTickets</div></center></li>");
        slider.reloadSlider();       
    }

    lg_one.log('DEBUG', '#one #troubleticketlist html : ' + $('#one #troubleticketlist').html());        
});

/**
 * Screen Four Init
 * Creates Damage and adds pictures
 *
 */

$(document).delegate('#four', 'pageshow', function () {

    navigator.app.clearCache();

    var lg = new Logger('DEBUG', '#four$pageshow');
    var req = new Request(Config.url, Config.client_id);
    var usr = new User(req);

    var current_tt = JSON.parse(window.localStorage.getItem('current_tt'));

    lg.log('DEBUG', '#four current_tt ' + window.localStorage.getItem('current_tt'));

    //The index of the last damage added
    var latest_damage_index = -1;

    if (window.localStorage.getItem('latest_damage_index') == null) {
        if (current_tt != null && current_tt.damages instanceof Array) {
            latest_damage_index = current_tt.damages.length - 1;
            lg.log('DEBUG', ' latest damage index from last index : ' + latest_damage_index);
        }
    } else {
        latest_damage_index = window.localStorage.getItem('latest_damage_index');
        lg.log('DEBUG', ' latest damage index from cache : ' + latest_damage_index);
        window.localStorage.removeItem('latest_damage_index');        
    }

    lg.log('DEBUG', ' current_tt.damages instanceof Array : ' + (current_tt.damages instanceof Array));

    //string var to store the selected status
    var selected;

    /**
     * ------------------
     * Event Bindings
     * ------------------
     */

    /**
     * Click event for saving damage report
     */    

    $('#four #savedamage').unbind('click').click(function() {

        lg.log('TRACE', '#four #savedamage click start');

        lg.log('TRACE', '#four #damagetype option:selected' + $('#four #damagetype option:selected').text());        

        if ($('#four #damagetype option:selected').attr('value') == '') {
            //Show success pop up
            $('#dialog div[data-role=header]').html('<h2>Error</h2>');
            $('#dialog div[data-role=content]').children().first().html('Please select a damage Type.');
            $('#a_dialog').click();             
            return;
        }

        lg.log('TRACE', '#four #damageposition option:selected' + $('#four #damageposition option:selected').text());

        if ($('#four #damageposition option:selected').attr('value') == '') {
            //Show success pop up
            $('#dialog div[data-role=header]').html('<h2>Error</h2>');
            $('#dialog div[data-role=content]').children().first().html('Please select a damage position.');
            $('#a_dialog').click();             
            return;
        }

        lg.log('TRACE', '#four #drivercauseddamage option:selected' + $('#four #drivercauseddamage option:selected').val());

        var current_tt = JSON.parse(window.localStorage.getItem('current_tt'));

        var damage = {
            'damagetype' : escapeHtmlEntities($('#four #damagetype option:selected').text()),
            'damageposition' : escapeHtmlEntities($('#four #damageposition option:selected').text()),
            'drivercauseddamage' : escapeHtmlEntities($('#four #drivercauseddamage option:selected').attr('value'))
        };

        var documents = [];

        $('.four-picture img').each(function(){
            lg.log('TRACE', '#four #savedamage found image ' + $(this).attr('src'));
            documents.push({ path : $(this).attr('src') });
        });

        damage['documents'] = documents;

        if (!(current_tt['damages'] != undefined && current_tt['damages'] instanceof Array)) {
            current_tt['damages'] = new Array();
            current_tt['damages'].push(damage);
        } else {
            current_tt['damages'][latest_damage_index] = damage;
        }

        lg.log('TRACE', '#four #savedamage current_tt' + JSON.stringify(current_tt));   

        window.localStorage.setItem('current_tt', JSON.stringify(current_tt));   

        $.mobile.changePage('#five');  

        lg.log('TRACE', '#four #savedamage click end');   
    });

    $('#four #deletedamage').unbind('click').click(function(e){

        lg.log('TRACE', '#four #deletedamage start');   

        e.preventDefault();
        if (current_tt != null && latest_damage_index != -1) {

            lg.log('DEBUG', '#four #deletedamage latest_damage_index ' + latest_damage_index);  

            current_tt.damages.splice(latest_damage_index, 1);

            window.localStorage.setItem('current_tt', JSON.stringify(current_tt));

            $.mobile.changePage('#five');
        }    

        lg.log('TRACE', '#four #deletedamage end');      
    });

    $('#four #takephoto').unbind('click').click(function() {

        lg.log('TRACE', '#four #takephoto click start');

        lg.log('DEBUG', '#four #takephoto success $(.bxslider-four-picture).html()' + $('.bxslider-four-picture').html());       

        var success = function (imageURL) {
        
            //Log
            lg.log('DEBUG', '#four #takephoto success' + imageURL); 

            $('.four-picture').html('<img style="width:100%;height:auto;" src="' + imageURL + '"/>');
            $('.four-picture').css('height','auto');
            $('.four-picture').css('line-height','normal');
            lg.log('DEBUG', '#four #takephoto success $(.bxslider-four-picture).html()' + $('.bxslider-four-picture').html());
        };

        var fail = function (message) {
        
            //Log
            lg.log('DEBUG', '#four #takephoto fail' +  message);  
            lg.log('DEBUG', '#four #takephoto success $(.bxslider-four-picture).html()' + $('.bxslider-four-picture').html());                    

        };
        
        navigator.camera.getPicture(success, fail, { quality: 25,
            destinationType: Camera.DestinationType.FILE_URL
        }); 
    });

    $('#four select#damagetype').unbind('change').bind('change', function() {

        lg.log('TRACE', ' start loading dependency');

        var dmg = new Damage();       
        var picklist = dmg.get('enum_damagetype');

        for (var index in picklist) {

            lg.log('DEBUG', ' picklist[index].value ' + picklist[index].value);

            if (picklist[index].value == escapeHtmlEntities($('#four #damagetype option:selected').attr('value'))) {
                $('#four select#damageposition').html('');
                $('#four select#damageposition').append('<option value=""> - Select One - </option>');                                        

                lg.log('DEBUG', ' MATCH ' + picklist[index].value);

                if (typeof picklist[index].dependency != 'undefined') {

                    lg.log('DEBUG', ' picklist[index].dependency ' + JSON.stringify(picklist[index].dependency));

                    for (var depindex in picklist[index].dependency['damageposition']) {
                        $('#four select#damageposition').append('<option value="' + picklist[index].dependency['damageposition'][depindex].value + '">' + picklist[index].dependency['damageposition'][depindex].label + '</option>');           
                    }   
                }
                
                $('#four select#damageposition').selectmenu('refresh'); 
            }

        }  

        $('#four select#damagetype').selectmenu('refresh');
        lg.log('TRACE', ' end loading dependency');      
    });

    /**
     * Load the filtered enum_damagetype / enum_damageposition into the select menu
     * and refresh both damagetype and damageposition select menu
     * as jquery mobile needs this, else it does not reflect 
     * on the UI.
     */

    lg.log('TRACE', 'start loading values to select menu');

    var dmg = new Damage(usr);
    var enum_damagetype =  dmg.get('enum_damagetype');

    lg.log('DEBUG', 'enum_damagetype : ' + JSON.stringify(enum_damagetype));

    $('#four select#damagetype').html('');
    $('#four select#damagetype').append('<option value=""> - Select One - </option>');     
    for (var index in enum_damagetype) {

        //Load value from cache
        selected = '';

        if (current_tt != null && latest_damage_index != -1) {
            lg.log('DEBUG',' selected check damagetype : enum_damagetype[index].value ' + enum_damagetype[index].value);
            lg.log('DEBUG',' selected check damagetype : current_tt.damages[latest_damage_index].damagetype ' + current_tt.damages[latest_damage_index].damagetype);
        }

        if (current_tt != null && 
            latest_damage_index != -1 && 
            enum_damagetype[index].value == current_tt.damages[latest_damage_index].damagetype) {
            selected = 'selected="selected"';
            lg.log('DEBUG', 'selected damagetype : ' + enum_damagetype[index].value);                        
        }

        $('#four select#damagetype').append('<option ' + selected + ' value="' + enum_damagetype[index].value + '">' + enum_damagetype[index].label + '</option>');
    }
    $('#four select#damagetype').selectmenu('refresh');        

    //Damge position enum loading to select menu
    var enum_damageposition = dmg.get('enum_damageposition');

    lg.log('DEBUG', 'enum_damageposition : ' + JSON.stringify(enum_damageposition));    

    $('#four select#damageposition').html('');
    $('#four select#damageposition').append('<option value=""> - Select One - </option>');    

    for (var index in enum_damageposition) {

        //Load value from cache
        selected = '';

        //lg.log('DEBUG',' selected check damageposition : enum_damageposition[index].value ' + unescape(enum_damageposition[index].value) );
        
        //if (latest_damage_index != -1)
        //    lg.log('DEBUG',' selected check damageposition : current_tt.damages[latest_damage_index].enum_damageposition ' + (current_tt.damages[latest_damage_index].damageposition));

        if (current_tt != null && 
            latest_damage_index != -1 &&  
            enum_damageposition[index].value == current_tt.damages[latest_damage_index].damageposition) {
            selected = 'selected="selected"';
            lg.log('DEBUG', 'selected damageposition : ' + enum_damageposition[index].value);                        
        }

        $('#four select#damageposition').append('<option ' + selected + ' value="' + enum_damageposition[index].value + '">' + enum_damageposition[index].label + '</option>');
    }
    $('#four select#damageposition').selectmenu('refresh');

    if (latest_damage_index == -1 ||
        (current_tt.damages.length == 1 && latest_damage_index == 0)) {
        $('#deletedamage').hide();
    }

    if (latest_damage_index != -1) {
        
        lg.log('DEBUG', '(current_tt.damages[latest_damage_index].documents instanceof Array) ' + (current_tt.damages[latest_damage_index].documents instanceof Array) );
        
        if ((current_tt.damages[latest_damage_index].documents instanceof Array))
            lg.log('DEBUG', 'current_tt.damages[latest_damage_index].documents.length ' + current_tt.damages[latest_damage_index].documents.length );
    }

    $('.four-picture').html("<center>No Picture Attached</center>");
    $('.four-picture').css('height','100px');
    $('.four-picture').css('line-height','100px'); 

    //Document pictures enum loading
    if (latest_damage_index != -1 && 
        (current_tt.damages[latest_damage_index].documents instanceof Array)) {

        if (current_tt.damages[latest_damage_index].documents.length > 0) {

            for (var index in current_tt.damages[latest_damage_index].documents) {
                lg.log('DEBUG', ' document path ' + current_tt.damages[latest_damage_index].documents[index].path);
                $('.four-picture').html('<img style="width:100%;height:auto;" src="' + current_tt.damages[latest_damage_index].documents[index].path + '"/>');
                $('.four-picture').css('height','auto');
                $('.four-picture').css('line-height','normal'); 
                break;               
            }

        } else {

            lg.log('DEBUG', ' no documents found ');

        }
    }

    //Damge position enum loading to select menu
    lg.log('TRACE', 'damage caused damage start '); 
    var enum_drivercauseddamage = dmg.get('enum_drivercauseddamage');

    lg.log('DEBUG', 'enum_drivercauseddamage : ' + JSON.stringify(enum_drivercauseddamage));    

    $('#four select#drivercauseddamage').html('');
    for (var index in enum_drivercauseddamage) {

        $('#four select#drivercauseddamage').append('<option value="' + enum_drivercauseddamage[index].value + '">' + enum_drivercauseddamage[index].label + '</option>');
    }    

    if (latest_damage_index != -1) {

        lg.log('DEBUG', 'drivercauseddamage ' + current_tt.damages[latest_damage_index].drivercauseddamage);
        $("#four select#drivercauseddamage option[value='" + current_tt.damages[latest_damage_index].drivercauseddamage + "']").attr("selected","selected");
    }

    $('#four select#drivercauseddamage').selectmenu('refresh');

    lg.log('TRACE', 'end loading values to select menu');    
});

/**
 * Screen Two Init
 * Shows details of Trouble Ticket
 *
 */

$(document).delegate('#two', 'pageshow', function () {

    var lg = new Logger('DEBUG', '#two$pageshow');

    //Your code for each page load here
    var slider_picture = $('.bxslider-two').bxSlider({
          infiniteLoop: false,
          hideControlOnEnd: true,
          pager: true,
          pagerSelector: '#pager-two',
          pagerType: 'short',
          useCSS:false
    });

    /**
     * Event Bindings
     */

    $('li center img').unbind('click').live('click', function(){
        window.localStorage.setItem('details_doc_id', $(this).attr('id').replace('#','.'));
        $.mobile.changePage('#three');
    });

    /**
     * Initialize Page
     */

    lg.log('DEBUG', " tt details id " + window.localStorage.getItem('details_tt_id'));     

    var tt = JSON.parse(window.localStorage.getItem(
        window.localStorage.getItem('details_tt_id') + '_tt'
    ));

    lg.log('DEBUG', " tt details " + JSON.stringify(tt));

    $('#two #damagetype').val(tt.damagetype);
    $('#two #damageposition').val(tt.damageposition);

    /**
     * Load images
     */

    $('.bxslider-two').html('');
    $('.bxslider-two').append('<li><center><img id="' + tt.docs[0].path.replace('.','#') + '" style="width:200px;height:100px;" src="data:image/jpeg;base64,' + window.localStorage.getItem(tt.docs[0].path) + '"/></center></li>');
    slider_picture.reloadSlider();    
});

$(document).delegate('#three', 'pageshow', function () {
    var base64_image = window.localStorage.getItem(window.localStorage.getItem('details_doc_id'));
    $('#three img').attr('src', 'data:image/jpeg;base64,' + base64_image);
    $('#three img').css('width', ($(document).width()-20));
    $('#three img').css('height', 'auto');
});

/**
 * Screen Five Init
 * Shows summary of trouble ticket to be submitted
 *
 */

$(document).delegate('#five', 'pageshow', function () {
    
    //Environment SetUp
    var lg = new Logger('TRACE', 'gta-page#five$pageshow'); 
    var req = new Request(Config.url);
    var usr = new User(req);

    var current_tt = JSON.parse(window.localStorage.getItem('current_tt'));

    lg.log('DEBUG', ' cached trouble ticket : ' +  JSON.stringify(current_tt));    

    /**
     * ------------------
     * Event Bindings
     * ------------------
     */

    /**
     * Slider widget
     */    

    var slider_a = $('.bxslider-five-a').bxSlider({
        infiniteLoop: false,
        hideControlOnEnd: true,
        pager: true,
        pagerSelector: '#pager-five-a',
        pagerType: 'short',
        useCSS:false
    });

    var slider_b = $('.bxslider-five-b').bxSlider({
        infiniteLoop: false,
        hideControlOnEnd: true,
        pager: true,
        pagerSelector: '#pager-five-b',
        pagerType: 'short',
        useCSS:false
    });

    /**
     * Click event for report all damages
     */  

    $('.bxslider-five-a li a').unbind('click').live('click', function(e){
        e.preventDefault();

        var that = this;
        var tt = new TroubleTicket(usr);

        lg_one.log('TRACE', '.bxslider-five-a li a click start');
        lg_one.log('DEBUG', " $(this).attr('id') " + $(this).attr('id'));   

        // Save the position

        tt_list = JSON.parse(window.localStorage.getItem('tt_list'));
        tt_list.position = slider.getCurrentSlide();
        window.localStorage.setItem('tt_list', JSON.stringify(tt_list));  

        var success = function(data) {

            lg_one.log('TRACE', '.bxslider-five-a li a click start');            

            var doc = new Doc(usr);
            doc.set(data.result.documents[0]);

            //Download Images
            var successCb = function(data) {
                lg_one.log('TRACE', 'successCb Download Images start');

                /**
                 * Save the page state
                 */

                if (current_tt == null)   
                    current_tt = {};

                current_tt.trailertype = escapeHtmlEntities($('#one #trailertype option:selected').text());
                current_tt.trailerid = escapeHtmlEntities($('#one #trailerid option:selected').text());
                current_tt.place = escapeHtmlEntities($('#one #place option:selected').text());
                current_tt.sealed = escapeHtmlEntities($('#one input[name=sealed]:checked').val());

                window.localStorage.setItem('current_tt', JSON.stringify(current_tt));  
                lg_one.log('TRACE', 'successCb saved current tt state');

                /**
                 * Set initial state for page two
                 */                

                var gas = tt.getAllSanitized();
                gas.docs = Array();
                gas.docs.push({'path': doc.get('path')});              

                window.localStorage.setItem('details_tt_id', $(that).attr('id'));
                window.localStorage.setItem($(that).attr('id') + '_tt', JSON.stringify(gas));

                lg_one.log('TRACE', 'successCb saved initial state for page two');

                $.mobile.changePage('#two');
            };

            var errorCb = function(jqxhr, status, er) {
                lg_one.log('TRACE', 'errorCb Download Images start');
            };

            doc.download(successCb, errorCb);
        };

        var error = function() {

        };

        tt.getById($(this).attr('id'), success, error);
    });

    $('#five #sendalldamages').unbind('click').click(function(){

        lg.log('TRACE', '#five #sendalldamages click start');

        var ttc = new TroubleTicketCollection(usr);

        //De-serialize current_tt to its object
        for ( var index in current_tt.damages ) {
            var tt = new TroubleTicket(usr);
            var dmg = new Damage();
            var ast = new Asset();
            var dc = new DocCollection();

            for ( var docindex in current_tt.damages[index].documents) {
                var doc = new Doc();
                doc.set('path', current_tt.damages[index].documents[docindex].path);
                dc.push(doc);
            }

            ast.set('assetname', current_tt.trailerid)

            dmg.set('damageposition', current_tt.damages[index].damageposition);
            dmg.set('damagetype', current_tt.damages[index].damagetype);
            dmg.set('drivercauseddamage', current_tt.damages[index].drivercauseddamage);
            dmg.set('docs', dc);

            tt.set('sealed', current_tt.sealed);
            tt.set('sealed', current_tt.sealed);
            tt.set('place', current_tt.place);
            tt.set('damage', dmg);
            tt.set('asset', ast);

            lg.log('DEBUG', 'trouble ticket');   

            ttc.push(tt);
        }

        //success callback

        var success = function(){

            //Clear the cached current trouble ticket as the
            $.mobile.urlHistory.stack = [];
            navigator.app.clearHistory();

            $('#dialog a[data-role=button]').attr('href','#one');
            $('#dialog a[data-role=button]').show();

            window.localStorage.removeItem('current_tt');
        };

        //error callback

        var error = function(jqxhr, status, error){

            /**
             * This section need to be tested thoroughly
             */

            // Reset the cached current trouble ticket 
            var stt = ttc.getAllAsArray();

            lg.log('DEBUG', ' stt[index] instanceof TroubleTicket ' + (stt[index] instanceof TroubleTicket));

            current_tt.damages = Array();
            
            for (var index in stt) {
                current_tt.damages.push(
                    JSON.parse(
                        stt[index].damage.serialize()
                    )
                );
            }
            
            $('#dialog a[data-role=button]').attr('href','#five');
            $('#dialog a[data-role=button]').show();

            window.localStorage.setItem('current_tt', JSON.stringify(current_tt));
            
        };

        var status = function(aAttemptCount, aTotalCount){
            $('#dialog div[data-role=content]').children().first().html('Completed ... ' + aAttemptCount + ' of ' + aTotalCount);            
        };

        ttc.save(success, error, status);

        //Show success message
        $('#dialog div[data-role=header]').html('<h2>Sending Damage Report</h2>');
        $('#dialog div[data-role=content]').children().first().html('Completed ... 0 of ' + ttc.size());
        $('#dialog a[data-role=button]').hide();
        $('#a_dialog').click();              

        lg.log('TRACE', '#five #sendalldamages click end');   
    });

    /**
     * Click event for report another damage
     */    

    $('#five #reportanotherdamage').unbind('click').click(function(){

        lg.log('TRACE', '#five #savedamage click start');

        current_tt.damages.push({});

        window.localStorage.setItem('current_tt', JSON.stringify(current_tt));

        $.mobile.changePage('#four');  

        lg.log('TRACE', '#five #savedamage click end');   
    }); 

    /**
     * Click event for widget link
     */   

    $('#five .bxslider-five-b li a').die('click').live('click',function(e){

        lg.log('TRACE', '#five .bxslider-five-b li a click start');

        e.preventDefault();
        window.localStorage.setItem('latest_damage_index', $(this).attr('id'));

        slider_a.destroySlider();
        slider_b.destroySlider();

        $.mobile.changePage('#four');

        lg.log('TRACE', '#five .bxslider-five-b li a click end');        
    });

    /**
     * -----------------
     * Page Inititialize
     * -----------------
     */

    if ( current_tt != null &&
            current_tt.damages instanceof Array && 
            current_tt.damages.length > 0) {

        $('#five .bxslider-five-b').html('');

        for (index in current_tt.damages) {
            $('#five .bxslider-five-b').append("<li><center><div style='height:60px;width:200px;'><a id='" + index + "' href='javascript:void(0);'>" + current_tt.damages[index].damageposition + ' ' + current_tt.damages[index].damagetype + "</a></div></center></li>");
        }
        slider_b.reloadSlider();  
    } 

    var tt_list = JSON.parse(window.localStorage.getItem('tt_list'));
    if (tt_list != null && current_tt != null) {
        lg_one.log('DEBUG', 'reloading slider for troubleticketlist  to position ' + tt_list.position);        

        $('.bxslider-five-a').html(tt_list.html);
        slider_a.reloadSlider();
        slider_a.goToSlide(tt_list.position);        
    } else {
        $('#one #troubleticketlist').html("<li><center><div style='height:60px;width:120px;'>No TroubleTickets</div></center></li>");
        slider_a.reloadSlider();       
    }      
});

$(document).delegate('#contact', 'pageshow', function () {
    //Environment SetUp
    var lg = new Logger('TRACE', 'gta-page#contact$pageshow'); 

    lg.log(' page loaded: ');
});

$(document).delegate('#settings', 'pageshow', function () {
    //Environment SetUp
    var lg_settings = new Logger('TRACE','gta-page#settings$pageshow'); 
    var req = new Request(Config.url);
    var usr = new User(req);

    lg_settings.log('TRACE', 'page loaded');

    //Load values 
    $('#settings_username').val(usr.get('username'));
    $('#settings_password').val(usr.get('password'));
    $('#settings_client_id').val(req.getClientId());

    $('#settings_save').unbind('click').bind('click', function(){
        var cacheSuccessList = Array();
        var cacheErrorList = Array();

        lg_settings.log('TRACE', ' username: ' + $('#settings_username').val());
        lg_settings.log('TRACE', ' password: ' + $('#settings_password').val());
        lg_settings.log('TRACE', ' client_id: ' + $('#settings_client_id').val());

        //Show popup right away
        $('#a_dialog_authenticating').click();

        // Clear back button history so that if the user clicks on 
        // device's back button the app exits
        navigator.app.clearHistory();

        // Clear All cache
        window.localStorage.clear();

        // Create event handler for cache complete
        usr.on('cache complete', function(status){
            if (status.success) {
                cacheSuccessList.push(status.name);
                $('#dialog_success_login div[data-role=content]').children().eq(2).html('Completed ' + cacheSuccessList.length  + ' of 7');                                          
            } else {
                cacheErrorList.push(status.name);
            }

            //Check if all cache calls have completed
            if ((cacheSuccessList.length + cacheErrorList.length) == 7) {

                if (cacheErrorList.length==0) { 
                    $('#a_dialog_success_cache').click();
                    navigator.app.clearHistory();
                } else {
                    usr.setAuthenticated(false);
                    $('#a_dialog_error_cache').click();
                    navigator.app.clearHistory();                  
                }
                cacheSuccessList = cacheErrorList = [];
            }
        });
        

        var success = function(data){
            lg_settings.log('TRACE', ' successfully authenticated');

            var tt = new TroubleTicket(usr);
            var dmg = new Damage(usr);
            var ast = new Asset(usr);
            var ac = new AssetCollection(usr);

            lg_settings.log('TRACE', ' starting to cache');

            var successCb = function (data, name) {
                usr.emit("cache complete", {success: true, name: name});
            };

            var errorCb = function (j, s, e, name) {
                usr.emit("cache complete", {success: false, name: name});
            };            

            //start caching picklists
            tt.getEnumPlace(successCb, errorCb);
            tt.getEnumSealed(successCb, errorCb);

            dmg.getEnumDamageType(successCb, errorCb);
            dmg.getEnumDamagePosition(successCb, errorCb);
            dmg.getEnumDriverCausedDamage(successCb, errorCb);

            lg_settings.log('TRACE', ' type of ast ' + (typeof ast));

            ast.getEnumTrailerType(successCb, errorCb);
            ac.getAssets(successCb, errorCb);

            //Show success message
            $('#a_dialog_success_login').click();                        
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
            $('#dialog a[data-role=button]').attr('href','#five');
            $('#dialog a[data-role=button]').show();
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

$(document).bind('pagebeforechange', function (e, data) {
    /**
     * Environment SetUp
     */

    var lg = new Logger('FATAL', 'gta-page$pagebeforechange'); 
    var req = new Request(Config.url);
    var usr = new User(req);

    var to = data.toPage,
        from = data.options.fromPage;

    lg.log('TRACE', typeof to);
    lg.log('TRACE', ' $.mobile.urlHistory :' + JSON.stringify($.mobile.urlHistory.stack));
    //navigator.app.clearHistory();
    if (typeof navigator.app != 'undefined')
        navigator.app.clearCache();
    /**
     * The type of to is object when there is a transition from
     * one page to another.
     */

    if (typeof to === 'object') {
        if (to.attr('id') == 'one' && !usr.get('authenticated')) {
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

        if (!usr.get('authenticated')){
            /**
             * If user is not authenticated
             */
            if (to.attr('id') === 'one' || 
                    to.attr('id') === 'two' || 
                    to.attr('id') == 'three' || 
                    to.attr('id') == 'four' || 
                    to.attr('id') == 'five') {                    
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

            if (to.attr('id') === 'four' || 
                    to.attr('id') === 'five') {

                /**
                 * The user reaches here when he clicks the pop up's
                 * back button after sending the damages to server
                 */

                if (window.localStorage.getItem('current_tt') == null ||
                    window.localStorage.getItem('current_tt') == false) {
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
        if (from) from = '#' + from.attr('id');

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

            if (window.localStorage.getItem('current_tt') == null ||
                window.localStorage.getItem('current_tt') == false) {

                /**
                 * Changing page to one if there is not tt in cache
                 */

                lg.log('TRACE', ' changing to page one ');
                $.mobile.changePage('#one');
            }
        }
    }
});

document.addEventListener("deviceready", function(){

        /**
         * Localization
         */

        navigator.globalization.getPreferredLanguage(
            function (lang) {
                var language = new Language(lang.value);

                if (language.hasLanguage()) {
                    $("*").each(function () {
                        if ($(this).children().length == 0) {
                            var words = language.get(lang.value);
                            for (var english in words) {
                                $(this).text($(this).text().replace(english, words[english]));
                            }
                        }
                    });
                }

                $.mobile.changePage('#one');
                navigator.app.clearHistory();
            },
            function () {
                console.log('Error getting language\n');
            }
        );   
}, false);