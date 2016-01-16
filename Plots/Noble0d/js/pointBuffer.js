/**
 * This module is used to generate point values. Point values are generated
 * using a calculator object and stored in arrays. The User can also specify the
 * range of the calculations, how many point values they want to save in each
 * array, and what method they want to use to aggregate excess points.
 * @param {Object} calculator - The object that is used to perform the
 * calculations. In this case NobleCalculator.
 * 
 * @param {number} iterations - The number of calculations to perform
 * @param {number} numPoints - The number of points that should be generated for
 * each variable.
 * @param {string} aggregateMethod - The way that points will be aggregated. By
 * default, it will skip extra values, but it could also use averaging or some
 * form of interpolation.
 * 
 * @return {Object} - Returns the NoblePointBuffer api, which includes functions
 * for resetting the buffer, updating settings, and accessing point arrays.
 */
define(["utility"],
function NoblePointBuffer(utils) {
	"use strict";

	/**
	 * These are the variable arrays that are used to store the points as they
	 * are generated
	 * @type {Object}
	 */
	var variables = {
		v: [],
		m: [],
		h: [],
		n: [],
		ik: [],
		ina: [],
		il: []
	};


	/**
	 * Temporary function. Uses the NobleCalculator to get every 1000th point and hold
	 * it in the array.
	 */
	function calculate(calculator, iterations, numPoints) {

		reset();
		var bufferSize = Math.floor(iterations/numPoints);
		console.log(bufferSize);

		for (var i = 0; i < iterations; i++) {
			calculator.calculateNext();
			if (i % bufferSize === 0) {
				var points = calculator.getPoints();
				variables.v.push(utils.normalize(points.v, new Point(-160, 40)));
				variables.m.push(points.m);
				variables.h.push(points.h);
				variables.n.push(points.n);
				variables.ik.push(points.ik);
				variables.ina.push(points.ina);
				variables.il.push(points.il);
			}
		}
	}


	/** 
	 * Resets the PointBuffer by resetting the calculator and emptying the
	 * variables array.
	 */
	function reset() {
		variables.v = [];
		variables.m = [];
		variables.h = [];
		variables.n = [];
		variables.ik = [];
		variables.ina = [];
		variables.il = [];
	}


	/**
	 * The functions and properties that the User can interact with.
	 * @type {Object}
	 */
	var api = {
		variables: variables,
		reset: reset,
		calculate: calculate,
	};
	return api;
});