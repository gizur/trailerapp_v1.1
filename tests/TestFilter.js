/* jshint undef: true, unused: true, strict: true, vars: true */

/**
 * Testing Stapes Private var access
 * 
 * @author anshuk.kumar@essindia.co.in (Anshuk Kumar)
 * @license Commercial - Copyright 2013 Gizur AB
 * @see http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml
 */

node_unit = true;

//Lib
Stapes = require('../Android/Besiktning/assets/www/js/lib/stapes.js').Stapes;

var Module = Stapes.subclass();
var module = new Module();

module.set('singer', {
    'name' : 'Elvis',
    'instrument' : 'Guitar'
});

console.log(module.singer);

var singer = module.filter(function(item, key) {
    console.log(item);
    return item.name === "Elvis" && key === "singer";
}); // [ { name : 'Elvis', instrument : 'Guitar' }]

console.log(singer);

exports.PrivateVar = {
    "base test" : function(test){
    },
};
