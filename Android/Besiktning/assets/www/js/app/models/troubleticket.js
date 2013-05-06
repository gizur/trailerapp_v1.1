var TroubleTicket = Stapes.subclass({
    constructor : function() {
        this.set({
            'asset' : new Asset(),
            'sealed' : '',
            'damage' : false,
            'place' : ''
        });
    },
    clone :  function() {
        var tt = new TroubleTicket;    
        tt.set(this.getAll());
        return tt;
    }
});


/**
 * For node-unit test
 */
if (node_unit==true) {
    exports.TroubleTicket = TroubleTicket;
}