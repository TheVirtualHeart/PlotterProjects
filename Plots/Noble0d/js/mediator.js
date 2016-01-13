var calculator = NobleCalculator;
var pointBuffer = NoblePointBuffer;
var plots = NoblePlots;

/** 
 * provide a series of functions to easily mediate between the calculator, the
 * pointBuffer, and the plots.
 */
var NobleMediator = (function NobleMediator(calculator, pointBuffer, plots) {
	"use strict";

	var points;


	function initialize() {
		calculator.initialize();
		plots.initialize();
		pointBuffer.calculate(calculator, 500000, 5000);
		points = pointBuffer.variables;
		requestAnimationFrame(update)
	}


	/**
	 * If the user passes in some new settings, update the calculator, get new
	 * points, and update the plots.
	 * 
	 * @param  {Object} settings - the settings that will be used to update the
	 * @return {[type]}          [description]
	 */
	function updateGraph(settings) {
		calculator.reset(settings);
		pointBuffer.calculate(calculator, 500000, 5000);
		points = pointBuffer.variables;
	}


	/** 
	 * Update the plots with the given point values and 
	 * @return {[type]} [description]
	 */
	function update() {
		plots.update(points);
		requestAnimationFrame(update);
	}

	var api = {
		initialize: initialize,
		updateGraph: updateGraph,
	};
	return api;

})(calculator, pointBuffer, plots);