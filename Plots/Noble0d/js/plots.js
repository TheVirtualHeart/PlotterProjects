/**
 * This module wraps some of the functionality of the main Plotter module. It
 * provides a more convenient way for the form to interact with the graphs and
 * wraps some complex behavior into more convenient functions.
 */
define(["utility"],
function NoblePlots(utils) {
	"use strict";

	var app;

	var displayV = true;
	var displayM = true;
	var displayH = true;
	var displayN = true;
	var secondaryPlot = null;


	/**
	 * These are the settings for the plots that will be used when rendering
	 * @type {Object}
	 */
	var mainPlot = {
		offset: new Point(0, 0),
		domain: new Point(0, 5000),
		range: new Point(0, 1),
		unitPerTick: new Point(1000, .1),
		pixelPerUnit: new Point(.0875, 300),
		labelFrequency: new Point(1, 1),
		xAxis: "Time (ms)",
		yAxis: "V (mv)",
		labelPrecision: new Point(0, 1),
	};
	var ikPlot = {
		offset: new Point(0, 375),
		domain: new Point(0, 5000),
		range: new Point(10, 60),
		unitPerTick: new Point(1000, 5),
		pixelPerUnit: new Point(.0875, 4),
		labelFrequency: new Point(1, 1),
		xAxis: "Time (ms)",
		yAxis: "ik",
		labelPrecision: new Point(0, 1)
	};
	var inaPlot = {
		offset: new Point(0, 375),
		domain: new Point(0, 5000),
		range: new Point(-100, 100),
		unitPerTick: new Point(1000, 20),
		pixelPerUnit: new Point(.0875, 1.2),
		labelFrequency: new Point(1, 1),
		xAxis: "Time (ms)",
		yAxis: "ina",
		labelPrecision: new Point(0, 1),
	};
	var ilPlot = {
		offset: new Point(0, 375),
		domain: new Point(0, 5000),
		range: new Point(-100, 100),
		unitPerTick: new Point(1000, 20),
		pixelPerUnit: new Point(.0875, 1.2),
		labelFrequency: new Point(1, 1),
		xAxis: "Time (ms)",
		yAxis: "il",
		labelPrecision: new Point(0, 1),
	};


	/**
	 * Initialize the plots. Attach the Plotter object to the appropriate DOM
	 * element and define the initial plots.
	 */
	function initialize() {
		app = createPlotter(document.getElementById("plot"));
		app.newPlot(mainPlot, "Noble");
		app.newPlot(ikPlot, "NobleOther");
	}


	/**
	 * This function sets the secondary plot to the name of the given name. If
	 * the name given is not one of the valid names, an error is thrown.
	 * 
	 * @param {string} plotName - the name of the secondary plot to display
	 */
	function setSecondaryPlot(plotName) {
		switch(plotName) {
			case "ik":
				if (secondaryPlot !== "ik") {
					secondaryPlot = "ik";
					app.editPlot("NobleOther", ikPlot);
				}
				break;
			case "ina":
				if (secondaryPlot !== "ina") {
					secondaryPlot = "ina";
					app.editPlot("NobleOther", inaPlot);
				}
				break;
			case "il":
				if (secondaryPlot !== "il") {
					secondaryPlot = "il";
					app.editPlot("NobleOther", ilPlot);
				}
				break;
			case null:
				secondaryPlot = null;
				break;
			default:
				throw new Error("'" + plotName + "' is not a valid plot name");
		}
	}

	/**
	 * Toggle whether or not the given variable should be displayed. Will throw
	 * an error if the given variable is not being drawn.
	 * 
	 * @param  {string} name - the name of the variable to display.
	 * @param  {boolean} value - the value to set the display property to
	 */
	function toggleDisplay(name, value) {
		if (name === "v") {
			if (utils.checkBool(value)) {
				displayV = value;
			} else {
				throw new Error("the given value is not valid");
			}
		}
		else if (name === "m") {
			if (utils.checkBool(value)) {
				displayM = value;
			} else {
				throw new Error("the given value is not valid");
			}
		}
		else if (name === "h") {
			if (utils.checkBool(value)) {
				displayH = value;
			} else {
				throw new Error("the given value is not valid");
			}
		}
		else if (name === "n") {
			if (utils.checkBool(value)) {
				displayN = value;
			} else {
				throw new Error("the given value is not valid");
			}
		}
		else {
			throw new Error("'" + name + "'' is not a variable that can be displayed");
		}
	}


	/**
	 * Update the plots with the given values.
	 * 
	 * @param  {Object} values - an object containing the values that will be
	 * plotted.
	 */
	function update(values) {

		app.selectPlot("Noble");
		if (displayV) {
			app.ctx.strokeStyle = utils.colors.Red;
			app.ctx.lineWidth = 3;
			app.plotFunction(function(x) {
				return values.v[x];
			}, true, 1, 0, 5000);
		}
		if (displayM) {
			app.ctx.strokeStyle = utils.colors.Green;
			app.ctx.lineWidth = 3;
			app.plotFunction(function(x) {
				return values.m[x];
			}, true, 1, 0, 5000);
		}
		if (displayH) {
			app.ctx.strokeStyle = utils.colors.LightBlue;
			app.ctx.lineWidth = 3;
			app.plotFunction(function(x) {
				return values.h[x];
			}, true, 1, 0, 5000);
		}
		if (displayN) {
			app.ctx.strokeStyle = utils.colors.Indigo;
			app.ctx.lineWidth = 3;
			app.plotFunction(function(x) {
				return values.n[x];
			}, true, 1, 0, 5000);
		}

		app.selectPlot("NobleOther");
		switch(secondaryPlot) {
			case "ik":
				app.ctx.strokeStyle = utils.colors.Yellow;
				app.ctx.lineWidth = 3;
				app.plotFunction(function(x) {
					return values.ik[x];
				}, true, 1, 0, 5000);
				break;
			case "ina":			
				app.ctx.strokeStyle = utils.colors.Black;
				app.ctx.lineWidth = 3;
				app.plotFunction(function(x) {
					return values.ina[x];
				}, true, 1, 0, 5000);
				break;
			case "il":			
				app.ctx.strokeStyle = utils.colors.Aqua;
				app.ctx.lineWidth = 3;
				app.plotFunction(function(x) {
					return values.il[x];
				}, true, 1, 0, 5000);
				break;
		}
	}


	/**
	 * This is the api that is returned by NoblePlots. It contains the
	 * properties and functions that the user can interact with.
	 */
	var api = {
		initialize: initialize,
		toggleDisplay: toggleDisplay,
		setSecondaryPlot: setSecondaryPlot,
		update: update,
	}
	return api;
});