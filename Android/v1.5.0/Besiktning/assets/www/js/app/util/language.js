/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, 
         bitwise:true, strict:true, undef:false, unused:true, 
         curly:true, browser:true, indent:4, maxerr:50 */

/*global node_unit:true, Stapes:true, 
         Logger:true, window:true, exports:false*/

/**
 * Utility Class Language
 * 
 * @fileoverview Language file stores the translations and provides abstractions for translating
 * @author anshuk.kumar@essindia.co.in (Anshuk Kumar)
 * @license Commercial - Copyright 2013 Gizur AB
 * @see http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml
 */

var Language = Stapes.subclass({
    constructor : function( language, aLogConfig ) {

        "use strict";

        /**
         * Set pseudo private vars
         * please dont change this using <objname>._privatevarname
         * method from outside of here.
         * Arggghh Stapes!!!!
         */

        if (typeof aLogConfig === 'undefined') {
            aLogConfig = {
                level  : 'FATAL',
                type   : 'console',
                config : {}
            };
        } else {
            if (typeof aLogConfig.level === 'undefined') {
                aLogConfig.level = 'FATAL';
            }

            if (typeof aLogConfig.level === 'undefined') {
                aLogConfig.type = 'console';
            }

            if (typeof aLogConfig.config === 'undefined') {
                aLogConfig.config = {};            
            }
        }

        this.extend({
            _lg : new Logger(aLogConfig.type, aLogConfig.type, aLogConfig.config)
        });

        /**
         * Following is the translation for swedish
         * NOTE: while added new translations make sure that
         * the item with maximum number of english words are at the
         * top and least ones at the bottom.
         */

        this.set( 'svenska' , {
                "If yes click 'Ok', (you will receive a mail with the new password) else click 'Go Back'" : 'Välj i så fall Ok (ditt nya lösen kommer att mailas)',
                'Please try again, If the problem persists please contact the Gizur Saas Account holders' : 'Försök igen, Kontakta Gizur SaaS support om problemet kvarstår',
                'All fields (username, password and client id) must be filled' : 'Alla fält (användarnamn, lösenord och klient id) måste fyllas i',
                'You have made changes. If you continue, your changes will not be saved.': 'Du har gjort ändringar. Om du fortsätter kommer inte dina ändringar att sparas.',
                "Unable to reset password. Please try again, If the problem persists please contact the Gizur Saas Account holders." : "Kunde inte nollställa lösen. Försök igen, Kontakta Gizur SaaS support om problemet kvarstår.",
                "Unable to change password. Please try again, If the problem persists please contact the Gizur Saas Account holders." : "Kunde inte ändra lösen. Försök igen, Kontakta Gizur SaaS support om problemet kvarstår.",
                "Your username and password settings are invalid. Please enter valid settings and try again." : "Ditt användarnamn eller lösenord är ogiltigt. Ange giltiga inställningar och försök igen.",
                'Password has been reset successfully. Please check your mail for the new password.' : 'Lösen har nollställts. Ett nytt lösen har mailat.',
                'Please select, if damage was caused by driver or not' : 'Välj om skadan orsakats av chauffören eller ej',
                'Are you sure you want to reset your password' : 'Vill du verkligen nollställa lösen',
                'Specify the damage in the direction the trailer moves' : 'Skadan anges I trailerns färdriktning',
                'Please check your mail for the new password' : 'Ett nytt lösen har mailat',  
                'Please check your internet connection and try again' : 'Kontrollera internetuppkopplingen och försök igen',        
                'Authenticated successfully and Cache built successfully' : 'Autensiering lyckades och cache är klar',
                'Password has been reset successfully' : 'Lösen har nollställts',
                'All Damages have been reported successfully' : 'Kontrollbesiktning har rapporterats',
                'Please select if sealed or not' : 'Ange om trailern är plomberad eller ej',
                'You cannot add more than 3 pictures.' : 'Du kan inte lägga till mer än 3 bilder.',
                'Only some damages have been reported successfully' : 'Endast några skador har rapporterats',
                'Your changes will not be saved.' : 'Dina ändringar kommer inte att sparas.',
                'Do you really want to delete the damage' : 'Vill du verkligen radera skadan',
                'New Password cannot be blank' : 'Nytt lösenord kan inte vara tomt',
                'Please select a damage type' : 'Ange typ av skada',
                'Please select a damage position' : 'Ange position för skadan',                
                'Please select Trailer Type' : 'Välj en trailer typ',
                'Please select a Trailer' : 'Välj en trailer',
                'Please select a Place' : 'Välj en plats',
                'Unable to build cache' : 'Kunde inte bygga cache',
                'Unable to change password' : 'Kunde inte ändra lösen',
                'Unable to reset password' : 'Kunde inte nollställa lösen',
                'Building Cache, please wait' : 'Bygger cache, vänta',
                'Gizur Saas Client ID' : 'Gizur Saas konto',
                'I caused the damage': 'Jag orsakade skadan',
                'Enter New Password': 'Ange nytt lösenord',
                'No Picture(s) Attached' : 'Inga bilder har bifogats',
                'Password Changed successfully' : 'Lösen har nollställts',
                'No Damages Reported' : 'Inga kontrollbesiktningar har rapporterats',
                'Previously reported damages': 'Tidigare rapporterade skador',
                'Add new damage' : 'Lägg till fler skador',
                'New found damage' : 'Nyfunna skador',
                'Send damage report' : 'Skicka skaderapport',                
                'Type of damage' : 'Typ av skada',
                'Add new picture' : 'Lägg till en bild',
                'Report new damage' : 'Rapportera ny skada',
                'Report Damage' : 'Rapportera skada',
                'Survey reported successfully' : 'Kontrollbesiktningen har rapporterats',
                'No New Damage' : 'Inga nya skador',
                'Damage Information' : 'Information om skada',
                'Existing Damage(s)': 'Befintliga Skador',
                'Change Password': 'Ändra Lösenord',
                'Connection Error' : 'Kunde inte ansluta till servern',
                'Forget Password': 'Glömt Lösenordet',
                'Damage details': 'Skadeuppgifter',
                'Please wait' : 'Vänta',
                'Password Changed' : 'Lösen har ändrats',
                'Authenticated successfully' : 'Autensiering lyckades',
                'Network Error: Retrying' : 'Network Error: Försöker igen',
                'Trailer type' : 'Typ av trailer',
                'Continue,Cancel' : 'Fortsätt,Avbryt',
                'Confirm,Cancel' : 'Bekräfta,Avbryt',
                'Select One' : 'Välj',  
                'Go Back' : 'Tillbaka',
                'Back' : 'Tillbaka',
                'Picture' : 'Foton',
                'Save' : 'Spara',
                'Contact' : 'Kontakt',
                'Survey' : 'Besiktning',
                'Settings' : 'Inställningar',
                'Place' : 'Plats',
                'Sealed' : 'Plomberad',
                'Yes' : 'Ja',
                'No' : 'Nej',
                'Cancel' : 'Avbryt',
                'Delete': 'Radera',
                'Weekday': 'Vardagar',
                'Password' : 'Lösenord',
                'Success' : 'Lyckades',
                'Authenticating' : 'Autensierar',
                'Change' : 'Ändra',
                'Error' : 'Fel',
                'Completed' : 'Slutfört',
                'of' : 'av',
                'Sending' : 'Skickar',
                'Warning' : 'Varning',
                'Processing' : 'Bearbetning',
                'Unable to submit a damage report.' : 'Kunde inte skicka in skaderapport.',
                'Failed' : 'Misslyckades',
                'Loading...' : 'Laddar ...',
                'All existing damages loaded successfully.' : 'Alla befintliga skador inlästa.',
                'Timeout Error' : 'Timeout Fel',
                'Request timeout, please check your internet connection' : 'Begär timeout, kontrollera din internetanslutning',
                'View More' : 'Visa mer',
                'loading more..' : 'laddar mer ..'
        });
        
        this.set('English', {
        	 'Aggregatk&aring;pa' : 'Ciller',
        	 'Trailersidor' : 'Cabinet Side',
        	 'Underk&ouml;rningsskydd' : 'Bumber',
        	 'D&ouml;rrar' : 'Rear Doors',
        	 'Skyddspl&aring;tar' : 'Cover',
        	 'St&ouml;dbensfot' : 'Landing Legs',
        	 'Tak' : 'Roof',
        	 'Ja' : 'Yes',
             'Nej' : 'No'
        });

        if (typeof language !== 'undefined') {
            this.setLanguage(language);
        }
    },

    /**
     * Set current language
     * 
     * @param  {string} language the language to translate to
     * @return {void}
     */ 

    setLanguage : function ( language ) {

        "use strict";

        this._lg.log('DEBUG', 'js/util/language', ' setLanguage language ' + language);
        window.localStorage.setItem('language', language);
    },

    /**
     * has Language in attribute
     * 
     * @param  {string} language the language to translate to
     * @return {boolean} weather the language exists or not
     */ 

    hasLanguage : function ( language ) {

        "use strict";

        if (typeof language === 'undefined') {
            this._lg.log('DEBUG', 'js/util/language', ' hasLanguage (window.localStorage.getItem(language)) ' + (window.localStorage.getItem('language')));                        
            this._lg.log('DEBUG', 'js/util/language', ' hasLanguage (this.get(window.localStorage.getItem(language)) != null) ' + (this.get(window.localStorage.getItem('language')) !== null));            
            return (this.get(window.localStorage.getItem('language')) !== null);
        } else {
            this._lg.log('DEBUG', 'js/util/language', ' hasLanguage (this.get(language) != null) ' + (this.get(language) !== null) );
            return (this.get(language) !== null);
        }
    },

    /**
     * translate the given word
     * 
     * @param  {string} word the english word to be translated
     * @return {string} the translated word
     */

    translate : function ( word ) {

        "use strict";

        var language = window.localStorage.getItem('language');

        this._lg.log('DEBUG', 'js/util/language', language + ' translate ' + word + ' exists? ' + typeof this.get(language));

        if (this.get(language) === null || typeof this.get(language)[word] === 'undefined') {
            return word;
        } else {
            return this.get(language)[word];
        }
    }  
});

/**
 * For node-unit test
 */

if (typeof node_unit !== 'undefined') {
    exports.Language = Language;
}
