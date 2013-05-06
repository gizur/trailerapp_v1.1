
node_unit = true;

Stapes = require('../Android/Besiktning/assets/www/js/lib/stapes.js').Stapes;
Asset = require('../Android/Besiktning/assets/www/js/app/models/asset.js').Asset;
Damage = require('../Android/Besiktning/assets/www/js/app/models/damage.js').Damage;
TroubleTicket = require('../Android/Besiktning/assets/www/js/app/models/troubleticket.js').TroubleTicket;

exports.troubleticket = {
    "has properties" : function(test){
        var snd_tt = new TroubleTicket();

        test.expect(4);
        
        test.ok(snd_tt.get('asset') instanceof Asset, "Asset is not defined / properly");
        test.ok(typeof snd_tt.get('place') === 'string', "Place is not defined / properly");
        test.ok(typeof snd_tt.get('sealed') === 'string', "Sealed is not defined / properly");
        test.ok(typeof snd_tt.get('damage') === 'boolean', "Damage is not defined / properly");
        
        test.done();
    },
    "clone method" : function(test) {
        var snd_tt = new TroubleTicket();
        var snd_tt_clone = snd_tt.clone();

        snd_tt_values = snd_tt.getAll();
        snd_tt_clone_values = snd_tt_clone.getAll();

        test.expect(1);

        test.deepEqual(snd_tt_values, snd_tt_clone_values, "Cloning not working properly");

        test.done();
    }
};
