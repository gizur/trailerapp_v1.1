/* jshint undef: true, unused: true, strict: true, vars: true */

/**
 * Model Class for Documents ie pictures
 * 
 * @fileoverview Class definition Documents
 * @author prabhat.khera@essindia.co.in (Prabhat Khera)
 * @license Commercial - Copyright 2013 Gizur AB
 * @see http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml
 */
var Wrapper = (function() {

    /**
     * Private Variables
     */

    var Wrapper = Stapes.subclass ({
        /**
         * @constructor
         */
        constructor: function (aLog) {
            this.extend({
                _lg: aLog
            });
        },
        /**
         *  Clear Navigator History
         */
        clearNavigatorHistory: function () {
            this._lg.log('TRACE', 'WRAPPER$clearNavigatorHistory', 'Starting clearNavigatorHistory');
            if (typeof navigator.app !== 'undefined') {
                navigator.app.clearHistory();
                this._lg.log('TRACE', 'WRAPPER$clearNavigatorHistory', 'History Cleared');
            }
            this._lg.log('TRACE', 'WRAPPER$clearNavigatorHistory', 'ENDING clearNavigatorHistory');
        },
        /**
         *  Clear Navigator Cache
         */
        clearNavigatorCache: function () {
            this._lg.log('TRACE', 'clearNavigatorCache', 'Starting clearNavigatorCache');
            if (typeof navigator.app !== 'undefined') {
                navigator.app.clearCache();
                this._lg.log('TRACE', 'clearNavigatorCache', 'Cache Cleared');
            }
            this._lg.log('TRACE', 'clearNavigatorCache', 'Leaving clearNavigatorCache');
        },
        /**
         * getPicture
         */
        getPicture: function (success, fail, options) {
            this._lg.log('TRACE', 'getPicture', 'Starting getPicture');
            if (typeof success === 'function' && typeof fail === 'function') {
                navigator.camera.getPicture(success, fail, options);
            }
            this._lg.log('TRACE', 'getPicture', 'Leaving getPicture');
        },
        /**
         * Globalization
         */
        isGlobalization: function () {
        	this._lg.log('TRACE', 'isGlobalization', 'In isGlobalization');
        	if (typeof navigator.globalization !== 'undefined')
        		return true;
        	else
        		return false;
        },
        /**
         * getPreferredLanguage
         */
        getPreferredLanguage: function (successCB) {
        	this._lg.log('TRACE', 'getPreferredLanguage', 'In getPreferredLanguage');
        	if (typeof successCB === 'function') {
        		navigator.globalization.getPreferredLanguage(successCB);
        	}
        },
        /**
         * Show Notification - Confirm
         */
        showConfirm: function (msg, onConfirm, title, labels) {
            navigator.notification.confirm(
                msg,       // message
                onConfirm, // callback to invoke with index of button pressed
                title,     // title
                labels     // buttonLabels
            );
        },        
        showAlert: function (msg, title) {
            navigator.notification.alert(
                msg,
                function(){},
                title
            );
        },
        /**
         * Validations Methods
         */
        checkLength: function(obj, min, msg, title){
        	if(obj.attr('value').length <= min) {
                navigator.notification.alert(msg, function(){}, title); 
        		return false;
        	} else
        		return true;
        },
        
        checkUndefined: function(obj, msg, title){
        	if(typeof obj.attr('value') === 'undefined' ||
        			obj.attr('value') === '') {
        		navigator.notification.alert(msg, function(){}, title);
        		return false;
        	} else
        		return true;
        },
        
        checkUndefinedValue: function(val, msg, title){
        	if(typeof val === 'undefined' ||
        			val === '') {
        		navigator.notification.alert(msg, function(){}, title);
        		return false;
        	} else
        		return true;
        },
    });

    return Wrapper;

})();

/**
 * For node-unit test
 */
if (typeof node_unit !== 'undefined') {
    exports.Wrapper = Wrapper;
}