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

	var calculator = calculator;
	var interations = iterations;
	var numPoints = numPoints;
	var aggregateMethod = aggregateMethod;

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
	function calculate() {

		var bufferSize = Math.floor(iterations/numPoints);

		for (var i = 0; i < iterations; i++) {
			calculator.calculateNext();
			if (i % bufferSize === 0) {
				var points = calculator.getPoints();
				variables.v.push(points.v);
				variables.m.push(points.m);
				variables.h.push(points.h);
				variables.n.push(points.n);
				variables.ik.push(points.ik);
				variables.ina.push(points.ina);
				variables.il.push(points.il);
			}
		}


		// vArray = [];
		// mArray = [];
		// hArray = [];
		// nArray = [];

		// ikArray = [];
		// inaArray = [];
		// ilArray = [];

		// var vAvg = 0;
		// var mAvg = 0;
		// var hAvg = 0;
		// var nAvg = 0;
		
		// var ikAvg = 0;
		// var inaAvg = 0;
		// var ilAvg = 0;


		// for (var i = 0; i < Math.round(time / timestep); i++) {
		// 	calculator.calculateNext();
		// 	var points = calculator.getPoints();

		// 	vAvg += points.v;
		// 	mAvg += points.m;
		// 	hAvg += points.h;
		// 	nAvg += points.n;
		// 	ikAvg += points.ik;
		// 	inaAvg += points.ina;
		// 	ilAvg += points.il;

		// 	var vAvg 
		// 	if (i % 1000 === 0) {
		// 		var points = calculator.getPoints();
		// 		vArray.push(normalize(vAvg / 1000, new Point(-160, 40)));
		// 		mArray.push(mAvg / 1000);
		// 		hArray.push(hAvg / 1000);
		// 		nArray.push(nAvg / 1000);
		// 		ikArray.push(ikAvg / 1000);
		// 		inaArray.push(inaAvg / 1000);
		// 		ilArray.push(ilAvg / 1000);

		// 		vAvg = 0;
		// 		mAvg = 0;
		// 		hAvg = 0;
		// 		nAvg = 0;
				
		// 		ikAvg = 0;
		// 		inaAvg = 0;
		// 		ilAvg = 0;
		// 	}
		// }

		// calculator.reset();
	}


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
}