/**
 * A module to provide common utility functions for the
 */
define(function NobleUtilities() {
	"use strict";
	

	/**
	 * This function creates a new object from all of the other objects
	 * specified in the arguments. Based on the assign polyfill: 
	 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
	 * 
	 * @param  {Object} target - the object we want to add properties to.
	 * 
	 * @return {Object}        - an object with the properties added to it.
	 */
	function extend(target) {
        
		var output = Object(target);
	      for (var index = 1; index < arguments.length; index++) {
	        var source = arguments[index];
	        if (source !== undefined && source !== null) {
	          for (var nextKey in source) {
	            if (source.hasOwnProperty(nextKey)) {
	              output[nextKey] = source[nextKey];
	            }
	          }
	        }
	      }
	      return output;
	}
    
    function deepExtend(target, source) {
        for (var prop in source) {
            if (typeof prop === "object") {
                target[prop] = deepExtend(target[prop], source[prop]);
            }
            else {
                target[prop] = source[prop];
            }
        }
        return target;
    }
    
    
    function deepCopy(source) {
        
        var obj = {};
        
        // cycle through all of the properties in the
        // source object
        for (var nextKey in source) {
            if (source.hasOwnProperty(nextKey)) {
                
                // if the key is an object, deepcopy that object
                var prop;
                if (source[nextKey] !== null && 
                    typeof source[nextKey] === 'object') {    
                        prop = deepCopy(source[nextKey]);
                } else {
                    prop = source[nextKey];
                }
                obj[nextKey] = prop;
            }
        }
        
        return obj;
    }


    /**
     * This function implements a flyweight pattern following this gist
     * https://gist.github.com/addyosmani/2668755
     */
    function implementsFor(object, target) {
        if (target.constructor == Function) {
            // Normal Inheritance 
            object.prototype = new target();
            object.prototype.constructor = object;
            object.prototype.parent = target.prototype;
        } else {
            // Pure Virtual Inheritance 
            object.prototype = target;
            object.prototype.constructor = object;
            object.prototype.parent = target;
        }
        return object;
    }
    

	/**
	 * The heaviside function. Return 0 if the expression is negative
	 * and 1 otherwise
	 * @param  {int} expression The expression to evaluate
	 * @return {int} 0 if the expression evaluates to a negative number, 1 otherwise
	 */
	function heaviside(expression) {
		if (expression < 0) {
			return 0;
		} else {
			return 1;
		}
	}


	/** 
	 * A rounding function that more closely resembles Matlab's round() 
	 * function.
	 * http://www.mathworks.com/help/matlab/ref/round.html
	 */
	function round(val) {
		if (val > 0) {
			return Math.round(val);
		} else if (val < 0) {
			var abs = Math.abs(val);
			var round = Math.round(abs);
			return -round;
		} else {
			return 0;
		}
	}


	/**
	 * Return the numeric value of the input if it has one. If the value
	 * is not a number, return zero.
	 * 
	 * @param  {any} value - can be any value. The function will interpret
	 * non-numeric values as zero.
	 * 
	 * @return {number} - the numeric value of the input if it exists. Zero
	 * otherwise
	 */
	function numericValue(value) {
		if (!isNaN(Number(value))) {
			return Number(value);
		} else {
			return 0;
		}
	}


	/** 
	 * Checks to see if the given value is a boolean. Taken from adeneo in this
	 * stackoverflow thread: 
	 * http://stackoverflow.com/questions/28814585/how-to-check-if-type-is-boolean
	 * 
	 * @param  {} bool - the value that we want to determine is a boolean
	 * @return {boolean} - true if the value is a boolean, false otherwise.
	 */
	function checkBool(bool) {
    	return typeof bool === 'boolean' || 
          	(typeof bool === 'object' && typeof bool.valueOf() === 'boolean');
	}


	/**
	 * Return the normalized value as it exists within the range.
	 * 
	 * @param  {number} value - the value to be normalized.
	 * 
	 * @param  {Point} range - a Point that defines the upper and lower
	 * bounds of the normalization. the x value is the minimum value, while
	 * the y value is the maximum.
	 * 
	 * @return {number} - The normalized value. It is expressed as a number
	 * between 0 and 1.
	 */
	function normalize(value, range) {
		var norm = (value - range.x)/(range.y - range.x);
		return norm;
	}


	/**
	 * An object that contains references to the different colors used by the
	 * graph.
	 */
	var Colors  = {
        Blue: "#0099FF",
		Aqua: "rgb(29, 239, 242)",
		Yellow: "rgb(254, 238, 0)",
		Black: "rgb(0, 0, 0)",
		Indigo: "rgb(47, 38, 224)",
		YellowGreen: "rgb(155, 226, 17)",
		Purple: "rgb(175, 26, 235)",
		Pink: "rgb(255, 153, 255)",
		Gray: "rgb(102, 102, 102)",
		Orange: "rgb(255, 153, 0)",
		LightBlue: "rgb(0, 153, 255)",
		Red: "rgb(255, 0, 0)",
		Green: "rgb(19, 171, 19)",
	};

	/**
	 * This api contains the functions and properties that the user can interact
	 * with when using this module.
	 * @type {Object}
	 */
	var api = {
        deepExtend: deepExtend,
        deepCopy: deepCopy,
        implementsFor: implementsFor,
		heaviside: heaviside,
		round: round,
		numericValue: numericValue,
		checkBool: checkBool,
		normalize: normalize,
		colors: Colors,
		extend: extend,
	};
	return api;
});