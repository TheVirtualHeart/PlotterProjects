/** 
 * provide a series of functions to easily mediate between the calculator, the
 * pointBuffer, and the plots.
 */
define(["pointBuffer"],
function NobleMediator(pointBuffer) {
	"use strict";

	var calculator;
	var plots;

	var points = [];
	var overlay = {};
	var numPoints = 1500;
	var numCalculations = 500000;


	/**
	 * This function performs all of the steps required to initialize the
	 * components that the mediator will use.
	 * @return {[type]} [description]
	 */
	function initialize(pcalculator, pplots) {
		calculator = pcalculator;
		plots = pplots;

		pointBuffer.calculate(calculator, numCalculations, numPoints);
		points = pointBuffer.variables;
		overlay = calculator.getStimuliLocations();

		requestAnimationFrame(update)
	}


	/**
	 * If the user passes in some new settings, update the calculator, get new
	 * points, and update the plots.
	 * 
	 * @param  {Object} settings - the settings that will be used to update the
	 */
	function updateGraph(settings) {
		calculator.reset(settings);
		pointBuffer.calculate(calculator, numCalculations, numPoints);
		points = pointBuffer.variables;
		overlay = calculator.getStimuliLocations();
	}


	/**
	 * Given a value, set the value of the secondary plot to display.
	 * 
	 * @param {String} value - the name of the secondary plot to display.
	 */
	function setSecondaryPlot(value) {
		plots.setSecondaryPlot(value);
	}


	/** 
	 * determine whether or not to display the given variable on the plot
	 * @param  {string} name  - the name of the variable to display
	 * @param  {boolean} value - the value that the display property will be set
	 * to.
	 */
	function displayVariable(name, value) {
		plots.toggleDisplay(name, value);
	}


	/** 
	 * Update the plots with the given point values. Recursively call self using
	 * requestAnimationFrame.
	 */
	function update() {
		plots.drawPlots(points);
		plots.drawOverlay(overlay);
		requestAnimationFrame(update);
	}


	var api = {
		initialize: initialize,
		displayVariable: displayVariable,
		setSecondaryPlot: setSecondaryPlot,
		updateGraph: updateGraph,
	};
	return api;

});