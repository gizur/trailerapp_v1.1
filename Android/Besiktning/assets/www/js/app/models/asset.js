/* jshint undef: true, unused: true, strict: true, vars: true */

/**
 * Model Class Asset
 * 
 * @fileoverview Class definition of a collection of TroubleTickets
 * @author anshuk.kumar@essindia.co.in (Anshuk Kumar)
 * @license Commercial - Copyright 2013 Gizur AB
 * @see http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml
 */

var Asset = Stapes.subclass({
    constructor : function() {
        this.set({
            'id' : '',
            'assetname' : '',
            'trailertype' : ''
        });
    }
});

/**
 * For node-unit test
 */
if (node_unit) {
    exports.Asset = Asset;
}