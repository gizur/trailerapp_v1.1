var sandbox = require('nodeunit').utils.sandbox;
var tt = sandbox(
    'Android/Besiktning/assets/www/js/app/lib/stapes.js',
    'Android/Besiktning/assets/www/js/app/models/troubleticket_stapes.js'
);
var dmg = sandbox(
    'Android/Besiktning/assets/www/js/app/lib/stapes.js',
    'Android/Besiktning/assets/www/js/app/models/damage.js'
);

exports.troubleticket = {
    "has methods getters, setters" : function(test){
        var snd_tt = new tt.TroubleTicket();
        test.expect(10);
        
        test.ok(typeof snd_tt.getTypeOfTrailer === 'function', "getTypeOfTrailer is not defined / properly");
        test.ok(typeof snd_tt.getTrailerId === 'function', "getTrailerId is not defined / properly");
        test.ok(typeof snd_tt.getPlace === 'function', "getPlace is not defined / properly");
        test.ok(typeof snd_tt.getSealed === 'function', "getSealed is not defined / properly");
        test.ok(typeof snd_tt.getDamages === 'function', "getDamages is not defined / properly");

        test.ok(typeof snd_tt.setTypeOfTrailer === 'function', "setTypeOfTrailer is not defined / properly");
        test.ok(typeof snd_tt.setTrailerId === 'function', "setTrailerId is not defined / properly");
        test.ok(typeof snd_tt.setPlace === 'function', "setPlace is not defined / properly");
        test.ok(typeof snd_tt.setSealed === 'function', "setSealed is not defined / properly");
        test.ok(typeof snd_tt.setDamages === 'function', "setDamages is not defined / properly");
        
        test.done();
    },
    
    "getter setters are working" : function(test){
        var snd_tt = new tt.TroubleTicket();

        var snd_dmg_1 = new dmg.Damage();
        var snd_dmg_2 = new dmg.Damage();
        var snd_dmg_3 = new dmg.Damage();
        var snd_dmg_4 = new dmg.Damage();
        var damages = [snd_dmg_1, snd_dmg_2, snd_dmg_3, snd_dmg_4];

        test.expect(5);

        snd_tt.setTypeOfTrailer('A1') ;
        snd_tt.setTrailerId('B2');
        snd_tt.setPlace('C3');
        snd_tt.setSealed('Yes');
        snd_tt.setDamages(damages);
        
        test.ok(snd_tt.getTypeOfTrailer() === 'A1', "getTypeOfTrailer is not returning proper value");
        test.ok(snd_tt.getTrailerId() === 'B2', "getTrailerId is not returning proper value");
        test.ok(snd_tt.getPlace() === 'C3', "getPlace is not returning proper value");
        test.ok(snd_tt.getSealed() === 'Yes', "getSealed is not returning proper value");
        test.ok((snd_tt.getDamages().length == damages.length), "getDamages is not returning proper value");
  
        test.done();
    }
};
