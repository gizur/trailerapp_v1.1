/* jshint undef: true, unused: true, strict: true, vars: true */

/**
 * Model Class for Documents ie pictures
 * 
 * @fileoverview Class definition Documents
 * @author anshuk.kumar@essindia.co.in (Anshuk Kumar)
 * @license Commercial - Copyright 2013 Gizur AB
 * @see http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml
 */
var Cache = (function(){

    /**
     * Private Variables
     */
    var storage;

    var Cache = Stapes.subclass({

        /**
         * @constructor
         */ 
        constructor : function() {
            storage = window.localStorage;
        },

        /**
         *  Set Cache
         */ 
        set : function(key, value) {
            if (value instanceof Stapes) {
                storage.setItem(value.getAll());
            } else {
                storage.setItem(key, value);
            }
        },

        /**
         *  Get Cache
         */ 
        get : function(key) {
            storage.getItem(key);
        },

        /**
         * Remove cache
         */       
        remove : function(key) {
            storage.removeItem(key);
        },

        /**
         * Clear cache
         */       
        remove : function(key) {
            storage.clear();
        },        
    });

return Cache;

})();

/**
 * For node-unit test
 */
if (node_unit) {
    exports.Cache = Cache;
}