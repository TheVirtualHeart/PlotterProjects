/**
 * This module is used to generate point values. Point values are generated
 * using a calculator object and stored in arrays. The User can also specify the
 * range of the calculations, how many point values they want to save in each
 * array, and what method they want to use to aggregate excess points.
 */
define(["utility"],
function NobleThreshholdAnalyzer(utils) {
	"use strict";

	/**
	 * These are the variable arrays that are used to store the points as they
	 * are generated
	 */
	var variables = {
		v: [],
		m: [],
		h: [],
		n: [],
		ik: [],
		ina: [],
		il: [],
		upTimes: [],
		downTimes: [],
	};


	/**
	 * Enum-type objects for specifying the calculation function
	 */
	var SKIP_FUNCTION = "skip";
	var AVERAGE_FUNCTION = "average";



	/**
	 * This function performs the differential calculations using a calculator
	 * object. The user specifies the number of calculations to perform and the
	 * number of points they want to generate. It uses this to calculate the
	 * size of a point buffer, the number of iterations before a point is
	 * logged. It then passes it to another calculation function which generates
	 * points based using a specific method.
	 * 
	 * @param {NobleCalculator} calculator - the calculator that is used to
	 * compute the variables. It does this by calling its calculateNext()
	 * function
	 * 
	 * @param {Number} iterations - the number of calculations to be performed.
	 * 
	 * @param {Number} numPoints - the number of points that will be generated
	 * as a result of this function
	 * 
	 * @param {String} calcFunction - the method of calculation that will be
	 * used to aggregate the points.
	 */
	function calculate(calculator, iterations, numPoints, calcFunction) {
		reset();
		var bufferSize = Math.floor(iterations/numPoints);

		if (calcFunction === AVERAGE_FUNCTION) {
			CALCULATE_AVERAGE(calculator, iterations, bufferSize);
		}
		else {
			CALCULATE_AVERAGE(calculator, iterations, bufferSize);
		}
	}


	/**
	 * This function aggregates points by "skipping" the ones in the middle. The
	 * function calls the calculator's calculateNext next function at each
	 * iteration. When it comes to the end of a buffer, it logs the variables at
	 * that point.
	 * 
	 * @param {NobleCalculator} calculator - the calculator that is used to
	 * compute the variables. It does this by calling its calculateNext()
	 * function
	 * 
	 * @param {Number} numPoints - the number of points that will be generated
	 * as a result of this function
	 * 
	 * @param {Number} bufferSize - the size of the buffer in which points are
	 * aggregated
	 */
	function CALCULATE_SKIP(calculator, iterations, bufferSize) {
		for (var i = 0; i < iterations; i++) {
			calculator.calculateNext();
			if (i % bufferSize === 0) {
				var points = calculator.getPoints();

				// add any uptimes or downtimes
				if (!!points.upTime) {
					var pointX = i * calculator.timestep;
					var pointY = utils.normalize(points.v, new Point(-160, 40));
					variables.upTimes.push(new Point(pointX, pointY));
				}
				if (!!points.downTime) {
					var pointX = i * calculator.timestep;
					var pointY = utils.normalize(points.v, new Point(-160, 40));
					variables.downTimes.push(new Point(pointX, pointY));
				}

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
	 * This function aggregates points by taking the average value of all of the
	 * points in the point buffer. At each iteration, the function calls the
	 * calculator's getNext() function and adds the variables to an average
	 * variable. When the function reaches the end of a buffer, those average
	 * values are divided by the buffer size, stored, and then set to zero.
	 * 
	 * @param {NobleCalculator} calculator - the calculator that is used to
	 * compute the variables. It does this by calling its calculateNext()
	 * function
	 * 
	 * @param {Number} numPoints - the number of points that will be generated
	 * as a result of this function
	 * 
	 * @param {Number} bufferSize - the size of the buffer in which points are
	 * aggregated
	 */
	function CALCULATE_AVERAGE(calculator, iterations, bufferSize) {

		var points 	= calculator.getPoints();
		var vAvg 	= points.v;
		var mAvg 	= points.m;
		var hAvg 	= points.h;
		var nAvg 	= points.n;
		var ikAvg 	= points.ik;
		var inaAvg 	= points.ina;
		var ilAvg 	= points.il;

		console.log(calculator);
		
		for (var i = 0; i < iterations; i++) {
			calculator.calculateNext();
			points 	= calculator.getPoints();

			// add any uptimes or downtimes
			if (!!points.upTime) {
				var pointX = i * calculator.timestep;
				var pointY = utils.normalize(points.v, new Point(-160, 40));
				variables.upTimes.push(new Point(pointX, pointY));
			}
			if (!!points.downTime) {
				var pointX = i * calculator.timestep;
				var pointY = utils.normalize(points.v, new Point(-160, 40));
				variables.downTimes.push(new Point(pointX, pointY));

			}

			vAvg 	+= points.v;
			mAvg 	+= points.m;
			hAvg 	+= points.h;
			nAvg 	+= points.n;
			ikAvg 	+= points.ik;
			inaAvg 	+= points.ina;
			ilAvg 	+= points.il;

			if (i % bufferSize === 0) {
				
				vAvg 	= vAvg / bufferSize;
				mAvg 	= mAvg / bufferSize;
				hAvg 	= hAvg / bufferSize;
				nAvg 	= nAvg / bufferSize;
				ikAvg 	= ikAvg / bufferSize;
				inaAvg 	= inaAvg / bufferSize;
				ilAvg 	= ilAvg / bufferSize;

				variables.v.push(utils.normalize(vAvg, new Point(-160, 40)));
				variables.m.push(mAvg);
				variables.h.push(hAvg);
				variables.n.push(nAvg);
				variables.ik.push(ikAvg);
				variables.ina.push(inaAvg);
				variables.il.push(ilAvg);

				vAvg 	= 0;
				mAvg 	= 0;
				hAvg 	= 0;
				nAvg 	= 0;
				ikAvg 	= 0;
				inaAvg 	= 0;
				ilAvg 	= 0;
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
		variables.upTimes = [];
		variables.downTimes = [];
	}


	/**
	 * The functions and properties that the User can interact with.
	 * @type {Object}
	 */
	var api = {
		SKIP_FUNCTION: SKIP_FUNCTION,
		AVERAGE_FUNCTION: AVERAGE_FUNCTION,
		variables: variables,
		reset: reset,
		calculate: calculate,
	};
	return api;
});