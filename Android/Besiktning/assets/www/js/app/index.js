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
    var lg_one = new Logger('DEBUG', 'gta-page#one$pageshow'); 
    lg_one.log('TRACE', 'page loaded');
    var req = new Request(Config.url, Config.client_id);
    var usr = new User(req);

    //For Debugging : The line below must be commented
    //window.localStorage.removeItem('current_tt');


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

            $('#one #troubleticketlist').html('');
            for (index in tts) {
                $('#one #troubleticketlist').html("<li><center><div style='height:60px;width:200px;'><a href=''#two'>" + tts[index].get('damageposition') + ' ' + tts[index].get('damagetype') + "</a></div></center></li>");
            }
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
            $('#dialog div[data-role=content]').children().first().html('Please select a Trailer.');
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
     * OnChange Event for trailer id
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
            $('#a_dialog').click();             
            return;
        } 

        if ($('#one #trailerid option:selected').attr('value') == '') {
            //Show success pop up
            $('#dialog div[data-role=header]').html('<h2>Error</h2>');
            $('#dialog div[data-role=content]').children().first().html('Please select a Trailer.');
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
        lg_one.log('DEBUG', 'loop  prelaod trailer id : ' + assets[index].get('assetname'));
        lg_one.log('DEBUG', 'loop  prelaod trailer id : ' + current_tt.trailerid);
        lg_one.log('DEBUG', 'loop  prelaod are they equal : ' + (assets[index].get('assetname') == current_tt.trailerid));
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
    $('#one #sealed').append('<legend>Plomerad</legend>');

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
});

/**
 * Screen Four Init
 * Creates Damage and adds pictures
 *
 */

$(document).delegate('#four', 'pageshow', function () {
    var lg = new Logger('DEBUG', '#four$pageshow');
    var req = new Request(Config.url, Config.client_id);
    var usr = new User(req);

    var current_tt = JSON.parse(window.localStorage.getItem('current_tt'));

    //The index of the last damage added
    var latest_damage_index = -1;
    if (current_tt != null && current_tt.damages instanceof Array)
        latest_damage_index = current_tt.damages.length - 1;

    lg.log('DEBUG', ' latest damage index : ' + latest_damage_index);
    lg.log('DEBUG', ' current_tt.damages instanceof Array : ' + (current_tt.damages instanceof Array));

    //string var to store the selected status
    var selected;

    /**
     * ------------------
     * Event Bindings
     * ------------------
     */

    /**
     * Slider widget
     */    

    var slider_picture = $('.bxslider-four-picture').bxSlider({
        infiniteLoop: false,
        hideControlOnEnd: true,
        pager: true,
        pagerSelector: '#pager-four',
        pagerType: 'short',
        useCSS:false
    });
    slider_picture.reloadSlider();

    /**
     * Click event for saving damage report
     */    

    $('#four #savedamage').unbind('click').click(function(){

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

        $('.bxslider-four-picture img').each(function(){
            documents.push({ path : $(this).attr('src') })
        });

        damage['documents'] = documents;

        if (!(current_tt['damages'] != undefined && current_tt['damages'] instanceof Array)) {
            current_tt['damages'] = new Array();
            current_tt['damages'].push(damage);
        } else {
            current_tt['damages'][current_tt['damages'].length - 1] = damage;
        }

        lg.log('TRACE', '#four #savedamage current_tt' + JSON.stringify(current_tt));   

        window.localStorage.setItem('current_tt', JSON.stringify(current_tt));   

        $.mobile.changePage('#five');  

        lg.log('TRACE', '#four #savedamage click end');   
    });

    $('#four #takephoto').unbind('click').click(function(){

        lg.log('TRACE', '#four #takephoto click start');

        lg.log('DEBUG', '#four #takephoto success $(.bxslider-four-picture).html()' + $('.bxslider-four-picture').html());


        if ($('.bxslider-four-picture img').length >= 3) {
            //Show success message
            $('#dialog div[data-role=header]').html('<h2>Limit Reached</h2>');
            $('#dialog div[data-role=content]').children().first().html('You cannot add more than three pictures.');
            $('#a_dialog').click();                  
            return;
        }        

        var success = function (imageURL) {
        
            //Log
            lg.log('DEBUG', '#four #takephoto success' + imageURL); 

            if ($('.bxslider-four-picture img').length==0)
                $('.bxslider-four-picture').html('');

            $('.bxslider-four-picture').append('<li><center><img class="image-to-upload" style="width:200px;height:100px;" src="' + imageURL + '"/></center></li>');
            slider_picture.reloadSlider();

            lg.log('DEBUG', '#four #takephoto success $(.bxslider-four-picture).html()' + $('.bxslider-four-picture').html());
        };

        var fail = function (message) {
        
            //Log
            lg.log('DEBUG', '#four #takephoto fail' +  message);  
            lg.log('DEBUG', '#four #takephoto success $(.bxslider-four-picture).html()' + $('.bxslider-four-picture').html());                    

        };
        
        navigator.camera.getPicture(success, fail, { quality: 50,
            destinationType: Camera.DestinationType.FILE_URL
        }); 
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

    lg.log('DEBUG', '(current_tt.damages[latest_damage_index].documents instanceof Array) ' + (current_tt.damages[latest_damage_index].documents instanceof Array) );
    lg.log('DEBUG', 'current_tt.damages[latest_damage_index].documents.length ' + current_tt.damages[latest_damage_index].documents.length );

    //Document pictures enum loading
    if (latest_damage_index != -1 && 
        (current_tt.damages[latest_damage_index].documents instanceof Array) &&
        current_tt.damages[latest_damage_index].documents.length > 0) {
        
        $('.bxslider-four-picture').html('');

        for (var index in current_tt.damages[latest_damage_index].documents) {
            lg.log('DEBUG', ' document path ' + current_tt.damages[latest_damage_index].documents[index].path);
            $('.bxslider-four-picture').append('<li><center><img class="image-to-upload" style="width:200px;height:100px;" src="' + current_tt.damages[latest_damage_index].documents[index].path + '"/></center></li>');
        }

        slider_picture.reloadSlider();  
    }

    //Damge position enum loading to select menu
    lg.log('TRACE', 'damage caused damage start '); 
    lg.log('DEBUG', 'drivercauseddamage ' + current_tt.damages[latest_damage_index].drivercauseddamage);

    $("#four select#drivercauseddamage option[value='" + current_tt.damages[latest_damage_index].drivercauseddamage + "']").attr("selected","selected");

    $('#four select#drivercauseddamage').selectmenu('refresh');

    lg.log('TRACE', 'end loading values to select menu');    
});

/**
 * Screen Two Init
 * Shows details of Trouble Ticket
 *
 */

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

/**
 * Screen Five Init
 * Shows summary of trouble ticket to be submitted
 *
 */

$(document).delegate('#five', 'pageshow', function () {
    //Environment SetUp
    var lg = new Logger('TRACE', 'gta-page#five$pageshow'); 
    var req = new Request(Config.url, Config.client_id);
    var usr = new User(req);

    var current_tt = JSON.parse(window.localStorage.getItem('current_tt'));

    lg.log('TRACE', ' cached trouble ticket : ' +  JSON.stringify(current_tt));    

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

            ast.set('assetname', current_tt.assetname)

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

        };

        var error = function(jqxhr, status, error){

        };

        var status = function(aAttemptCount, aTotalCount){
            $('#dialog div[data-role=content]').children().first().html('Completed ... ' + aAttemptCount + ' of ' + aTotalCount);            
        };

        ttc.save(success, error, status);

        //Show success message
        $('#dialog div[data-role=header]').html('<h2>Sending Damage Report</h2>');
        $('#dialog div[data-role=content]').children().first().html('Completed ... 0 of ' + ttc.size());
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
     * -----------------
     * Page Inititialize
     * -----------------
     */

    if (current_tt.damages instanceof Array && current_tt.damages.length > 0) {

        $('#five .bxslider-five-b').html('');

        for (index in current_tt.damages) {
            $('#five .bxslider-five-b').append("<li><center><div style='height:60px;width:200px;'><a href=''#two'>" + current_tt.damages[index].damageposition + ' ' + current_tt.damages[index].damagetype + "</a></div></center></li>");
        }
        slider_b.reloadSlider();  

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
    lg.log('TRACE', ' $.mobile.urlHistory :' + JSON.stringify($.mobile.urlHistory.stack));

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

        if (!usr.get('authenticated')){
            if (to === '#one' || to === '#two' || to == '#three' || to == '#four') {                    
                e.preventDefault();

                // remove active class on button
                // otherwise button would remain highlighted
                $.mobile.activePage
                    .find('.ui-btn-active')
                    .removeClass('ui-btn-active');

                //Show Access denied pop up
                $('#dialog div[data-role=header]').html('<h3>Access Denied</h3>');
                $('#dialog div[data-role=content]').children().first().html('You have not been authenticated. Please enter valid credentials and click save.');
                $('#a_dialog').click(); 
            }
        } else {
            if (to === '#four') {
                if (window.localStorage.getItem('current_tt') == null ||
                    window.localStorage.getItem('current_tt') == false) {
                    $.mobile.changePage('#one');
                }
            }
        }
    }
});