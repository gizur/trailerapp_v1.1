var Doc = Stapes.subclass({
    constructor : function() {
        this.set({
            'id' : '',
            'path' : ''
        });
    },
});

/**
 * For node-unit test
 */
if (node_unit==true) {
    exports.Doc = Doc;
}