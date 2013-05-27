/* jshint undef: true, unused: true, strict: true, vars: true */

/**
 * Utility Class Language
 * 
 * @fileoverview Logs
 * @author anshuk.kumar@essindia.co.in (Anshuk Kumar)
 * @license Commercial - Copyright 2013 Gizur AB
 * @see http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml
 */

var Language = Stapes.subclass({
    constructor : function( language ) {

        this.extend({
            _lg : new Logger('FATAL', 'app/util/language')
        });

        this.set( 'svenska' , {
                'Survey' : 'Kontrollbesiktning',
                'Contact' : 'Kontakt',
                'Survey' : 'Besiktning',
                'Settings' : 'Inställningar',
                'Trailer type' : 'Typ av trailer',
                'Place' : 'Plats',
                'Sealed' : 'Plomberad',
                'Yes' : 'Ja',
                'No' : 'Nej',
                'Report new damage' : 'Rapportera ny skada',
                'No new damage' : 'Inga nya skador',
                'Existing Damage(s)': 'Befintliga Skador',
                'Back' : 'Tillbaka',
                'Picture' : 'Foton',
                'Save' : 'Spara',
                'Change Password': 'Ändra Lösenord',
                'Forgot Password': 'Glömt Lösenord',
                'Password' : 'Lösenord',
                'Gizur Saas Client ID' : 'Gizur Saas konto',
                'Add more damages': 'Lägg fler skador',
                'New found damage': 'Nyfunna skador',
                'Send damage report': 'Skicka skaderapport',
                'Previously reported damages': 'Tidigare rapporterade skador',
                'I caused the damage': 'Jag orsakade skadan',
                'Delete': 'Radera',
                'Damage details': 'Skadeuppgifter',
                'Type of damage': 'Typ av skada',
                'Add a picture': 'Lägg till en bild',
                'Weekday': 'Vardagar',
            }
        );
        if (typeof language != 'undefined') {
            this.setLanguage(language)
        }
    },
    setLanguage : function ( language ) {

        this._lg.log('DEBUG', ' setLanguage language ' + language);
        window.localStorage.setItem('language', language);
    },
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
if (node_unit) {
    exports.Language = Language;
}