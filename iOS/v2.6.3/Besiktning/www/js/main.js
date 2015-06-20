"use strict";
// DEFAULT HASH
// ============
// 
// This is a default hash.
var DEFAULT_HASH = 'surveys';

// Prepend Hash
// =============
// 
// This tells the haser to prepend the chars specified
// with all query string after hash.
hasher.prependHash = "!";

// Crossroads SetUp
// ================
// 
// Adds routers to the application.

// Route1 : Registration Process
// =============================
//
// This is a default router which excute in case of match
// the route1 function defined below.
var route1 = crossroads.addRoute('surveys');

var route2 = crossroads.addRoute('settings');

var route3 = crossroads.addRoute('survey');

var route4 = crossroads.addRoute('contacts');
// Route1
// ======
// 
// If route1 matched, the following function
// gets executed.
route1.matched.add(function() {
	console.log("I am in Surveys!!");
});

route2.matched.add(function() {
	console.log("I am in Survey Settings!!");	
});

route3.matched.add(function() {
	console.log("I am in Survey Surveys!!");	
});

route4.matched.add(function() {
	console.log("I am in Survey Contacts!!");	
});

// Default Hash
// ============
// 
// Set a default hash value
if (!hasher.getHash()) {
	hasher.setHash(DEFAULT_HASH);
}

// ParseHash
// =========
// 
// Used to parse hash. If new hash found it'll
// call the crossroad to handle.
function parseHash(newHash, oldHash) {
	// second parameter of crossroads.parse() is
	// the "defaultArguments" and should be an array
	// so we ignore the "oldHash" argument to avoid issues.
	crossroads.parse(newHash);
}

// Initialize Haser
// =================
// 
// parse initial hash
hasher.initialized.add(parseHash);

// parse hash changes
hasher.changed.add(parseHash);

// start listening for hash changes
hasher.init();