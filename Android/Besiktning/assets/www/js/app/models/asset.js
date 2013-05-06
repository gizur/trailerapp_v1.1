var Asset = Stapes.subclass({
    constructor : function() {
        this.set({
            'id' : '',
            'asset_name' : '',
            'asset_type' : ''
        });
    },
});

/**
 * For node-unit test
 */
if (node_unit==true) {
    exports.Asset = Asset;
}