/* jshint undef: true, unused: true, strict: true, vars: true */

/**
 * Model Class for Documents ie pictures
 * 
 * @fileoverview Class definition Documents
 * @author anshuk.kumar@essindia.co.in (Anshuk Kumar)
 * @license Commercial - Copyright 2013 Gizur AB
 * @see http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml
 */

var Doc = Stapes.subclass({

    /**
     * @constructor
     */ 
    constructor : function() {
        this.set({
            'id' : '',
            'path' : ''
        });
    }
});

/**
 * For node-unit test
 */
if (node_unit) {
    exports.Doc = Doc;
}