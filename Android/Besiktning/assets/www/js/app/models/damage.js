var Damage = Stapes.subclass({
    constructor : function() {
        this.set({
            'type_of_damage' : '',
            'position' : '',
            'doc' : ''
        });
    },
});

/**
 * For node-unit test
 */
if (node_unit==true) {
    exports.Damage = Damage;
}