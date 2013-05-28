/* jshint undef: true, unused: true, strict: true, vars: true */

/**
 * Testing Stapes Private var access
 * 
 * @author anshuk.kumar@essindia.co.in (Anshuk Kumar)
 * @license Commercial - Copyright 2013 Gizur AB
 * @see http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml
 */

node_unit = true;

var foo = function() {
    var stack = (new Error()).stack.split(/at /g);

    console.log(stack[2]);

};

foo();

exports.PrivateVar = {
    "base test" : function(test){
    },
};
