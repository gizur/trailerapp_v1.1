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

var ClassA = (function() {

    /**
     * Private Variables
     */
    var _a;


    var ClassA = Stapes.subclass({

        constructor : function(argA) {
            _a = new String();
            _a = argA;
        },

        getA: function() {
            return (_a);
        }

    });

    return ClassA;
})();

exports.PrivateVar = {
    "base test" : function(test){
        var a1 = new ClassA("foo");
        var a2 = new ClassA("bar");

        test.expect(1);
        
        test.ok(a1.getA() != a2.getA(), "a1.getA() and a2.getA() should be not equal => " + a1.getA() + ', ' + a2.getA());

        test.done();a1.getA() == a2.getA()
    },
};