
/*
 * This is main.js which is referenced directly from within
 * a <script> node in index.html
 */

// "use strict" means that some strange JavaScript things are forbidden
"use strict";

// this shall be the function that generates a new path object
var makePath = function(splitter) {
	var actualPath = [];
	var f = function(value) {
		if (value === undefined) {
			var retString;
			if (splitter === undefined) {
				splitter = ", ";
			}
			for (var i = 0; i < actualPath.length; i++) {
				if (i !== 0) {
					retString = retString + splitter + actualPath[i];
				} else {
					retString = actualPath[i];
				}
			}
			return retString;
		} else {
			actualPath.push(value);
		}
	}
	return f;
};

// the main() function is called when the HTML document is loaded
var main = function() {

    ////////////////////////////////////////////////////////////
    //create a path, add a few points on the path, and print it
    var path1 = makePath();

    path1("A"); 
    path1("B"); 
    path1("C");

    var path2 = makePath("-->");
    path2("Berlin"); 
    path2("San Francisco"); 
    path2("Vancouver");
	
	var path3 = makePath("======>");
	path3("Nice");
	path3("Fett");
	path3("Geilo");
	
	var pathDerp = makePath("=)");
	pathDerp("Derp");
	pathDerp("Deerp");
	pathDerp("Deeerp");

    window.console.log("path 1 is " + path1() );
    window.console.log("path 2 is " + path2() );
    window.console.log("path 3 is " + path3() );
    window.console.log("path Derp is " + pathDerp() );

    ////////////////////////////////////////////////////////////
    // second example
    window.console.log('This is the start.');

    // sets a timeout and calls the callbackFunction
    // after the timeout. 
    // The specified callback is 0!!! milliseconds
    setTimeout(function callbackFunction() {
        window.console.log('This is a msg from call back.');
    }, 0);

    window.console.log('This is just a message.');


};
