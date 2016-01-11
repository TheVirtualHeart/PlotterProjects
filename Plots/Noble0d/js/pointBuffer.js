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
function NoblePointBuffer(calculator, iterations, numPoints, aggregateMethod) {

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
	 * Resets the PointBuffer by resetting the calculator and emptying the
	 * variables array.
	 */
	function reset() {
		calculator.reset();
		variables.v = [];
		variables.m = [];
		variables.h = [];
		variables.n = [];
		variables.ik = [];
		variables.ina = [];
		variables.il = [];
	}


	var api = {
		variables: variables,
		reset: reset,
	};
}