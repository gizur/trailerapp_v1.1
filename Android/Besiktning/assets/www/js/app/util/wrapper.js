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
            this._lg.log('TRACE', 'Starting clearNavigatorHistory');
            if (typeof navigator.app !== 'undefined') {
                navigator.app.clearHistory();
                this._lg.log('TRACE', 'History Cleared');
            }
            this._lg.log('TRACE', 'Starting clearNavigatorHistory');
        },
        /**
         *  Clear Navigator Cache
         */
        clearNavigatorCache: function () {
            this._lg.log('TRACE', 'Starting clearNavigatorCache');
            if (typeof navigator.app !== 'undefined') {
                navigator.app.clearCache();
                this._lg.log('TRACE', 'Cache Cleared');
            }
            this._lg.log('TRACE', 'Leaving clearNavigatorCache');
        },
        /**
         * getPicture
         */
        getPicture: function (success, fail, options) {
            this._lg.log('TRACE', 'Starting getPicture');
            if (typeof success === 'function' && typeof fail === 'function') {
                navigator.camera.getPicture(success, fail, options);
            }
            this._lg.log('TRACE', 'Leaving getPicture');
        },
        /**
         * Globalization
         */
        isGlobalization: function () {
        	this._lg.log('TRACE', 'In isGlobalization');
        	if (typeof navigator.globalization !== 'undefined')
        		return true;
        	else
        		return false;
        },
        /**
         * getPreferredLanguage
         */
        getPreferredLanguage: function (successCB) {
        	this._lg.log('TRACE', 'In getPreferredLanguage');
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
        }        
    });

    return Wrapper;

})();

/**
 * For node-unit test
 */
if (typeof node_unit !== 'undefined') {
    exports.Wrapper = Wrapper;
}