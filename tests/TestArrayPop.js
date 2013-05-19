/* jshint undef: true, unused: true, strict: true, vars: true */

/**
 * Node Unit Test file for Doc
 * 
 * @fileoverview Class definition of a collection of Docs
 * @author anshuk.kumar@essindia.co.in (Anshuk Kumar)
 * @license Commercial - Copyright 2013 Gizur AB
 * @see http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml
 */

node_unit = true;

Stapes = require('../Android/Besiktning/assets/www/js/lib/stapes.js').Stapes;

var Module = Stapes.subclass();

var module = new Module();

module.push([
	'foo',
	'bar',
	'baz',
	'qux'
]);

console.log(module.getAll());
console.log(module.getAllAsArray());

for (var index in module.getAll()) {
	module.remove(index);
	break;
}

console.log(module.getAll());

function foo(val) {
	var value = val;

	console.log(value);
}

foo();