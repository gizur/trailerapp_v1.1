/* jshint undef: true, unused: true, strict: true, vars: true */

/**
 * Utility Class Language
 * 
 * @fileoverview Language file stores the translations and provides abstractions for translating
 * @author anshuk.kumar@essindia.co.in (Anshuk Kumar)
 * @license Commercial - Copyright 2013 Gizur AB
 * @see http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml
 */

var Language = Stapes.subclass({
    constructor : function( language ) {

        /**
         * Set pseudo private vars
         * please dont change this using <objname>._privatevarname
         * method from outside of here.
         * Arggghh Stapes!!!!
         */

        this.extend({
            _lg : new Logger('DEBUG', 'app/util/language')
        });

        /**
         * Following is the translation for swedish
         * NOTE: while added new translations make sure that
         * the item with maximum number of english words are at the
         * top and least ones at the bottom.
         */

        this.set( 'svenska' , {
                'Gizur Saas Client ID' : 'Gizur Saas konto',
                'I caused the damage': 'Jag orsakade skadan',
                'Previously reported damages': 'Tidigare rapporterade skador',
                'Add more damages': 'Lägg fler skador',
                'New found damage': 'Nyfunna skador',
                'Send damage report': 'Skicka skaderapport',                
                'Type of damage': 'Typ av skada',
                'Add a picture': 'Lägg till en bild',
                'Report new damage' : 'Rapportera ny skada',
                'No new damage' : 'Inga nya skador',
                'Existing Damage(s)': 'Befintliga Skador',
                'Change Password': 'Ändra Lösenord',
                'Forgot Password': 'Glömt Lösenord',
                'Damage details': 'Skadeuppgifter',
                'Please wait' : 'Vänta',
                'Trailer type' : 'Typ av trailer',                                          
                'Back' : 'Tillbaka',
                'Picture' : 'Foton',
                'Save' : 'Spara',            
                'Survey' : 'Kontrollbesiktning',
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
            }
        );

        if (typeof language != 'undefined') {
            this.setLanguage(language)
        }
    },

    /**
     * Set current language
     * 
     * @param  {string} language the language to translate to
     * @return {void}
     */ 

    setLanguage : function ( language ) {

        this._lg.log('DEBUG', ' setLanguage language ' + language);
        window.localStorage.setItem('language', language);
    },

    /**
     * has Language in attribute
     * 
     * @param  {string} language the language to translate to
     * @return {boolean} weather the language exists or not
     */ 

    hasLanguage : function ( language ) {
        if (typeof language == 'undefined') {
            this._lg.log('DEBUG', ' hasLanguage (window.localStorage.getItem(language)) ' + (window.localStorage.getItem('language')));                        
            this._lg.log('DEBUG', ' hasLanguage (this.get(window.localStorage.getItem(language)) != null) ' + (this.get(window.localStorage.getItem('language')) != null));            
            return (this.get(window.localStorage.getItem('language')) != null);
        } else {
            this._lg.log('DEBUG', ' hasLanguage (this.get(language) != null) ' + (this.get(language) != null) );
            return (this.get(language) != null);
        }
    },

    /**
     * translate the given word
     * 
     * @param  {string} word the english word to be translated
     * @return {string} the translated word
     */

    translate : function ( word ) {

        var language = window.localStorage.getItem('language');

        if (this.get(language) == null || typeof this.get(language)[word] == 'undefined')
            return word;
        else
            return this.get(language)[word];
    }  
});

/**
 * For node-unit test
 */

if (typeof node_unit != 'undefined') {
    exports.Language = Language;
}