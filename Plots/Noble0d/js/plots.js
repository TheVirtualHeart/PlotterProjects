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

	var timeperiod = 5000;


	/**
	 * These are the settings for the plots that will be used when rendering
	 * @type {Object}
	 */
	var secondaryOffset = new Point(0, 325);

	var mainPlot = {
		offset: new Point(0, 0),
		range: new Point(-0.1, 1.1),
		unitPerTick: new Point(1000, .1),
		pixelPerUnit: new Point(.0875, 200),
		labelFrequency: new Point(1, 1),
		xAxis: "Time (ms)",
		yAxis: "V (mv)",
		labelPrecision: new Point(0, 1),
		labelSize: new Point(0, 0),
	};
	var ikPlot = {
		offset: secondaryOffset,
		range: new Point(10, 60),
		unitPerTick: new Point(1000, 10),
		labelFrequency: new Point(1, 1),
		xAxis: "Time (ms)",
		yAxis: "ik",
		labelPrecision: new Point(0, 0),
	};
	var inaPlot = {
		offset: secondaryOffset,
		range: new Point(-60, 0),
		unitPerTick: new Point(1000, 5),
		labelFrequency: new Point(1, 1),
		xAxis: "Time (ms)",
		yAxis: "ina",
		labelPrecision: new Point(0, 0),
	};
	var ilPlot = {
		offset: secondaryOffset,
		range: new Point(-100, 100),
		unitPerTick: new Point(1000, 20),
		labelFrequency: new Point(1, 1),
		xAxis: "Time (ms)",
		yAxis: "il",
		//labelPrecision: new Point(0, 0),
	};


	/**
	 * Initialize the plots. Attach the Plotter object to the appropriate DOM
	 * element and define the initial plots.
	 */
	function initialize(newSettings) {
		app = createPlotter(document.getElementById("plot"));


		/**
		 * @todo  These hardcoded values should be replaced
		 * @type {Object}
		 */
		var mainDomain = { 
			domain: new Point(0, 3650),
			pixelPerUnit: new Point(.1199, 200),
		};
		var secondDomain = { 
			domain: new Point(0, 3650),
			pixelPerUnit: new Point(.1199, 1.2),
		};


		var initialMain = utils.extend({}, mainPlot, mainDomain);
		var initialSecond = utils.extend({}, ilPlot, secondDomain);
		app.newPlot(initialMain, "Noble");
		app.newPlot(initialSecond, "NobleOther");
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
					// In this section, update the ppu
					secondaryPlot = "ik";
					app.editPlot("NobleOther", ikPlot, true, true);
				}
				break;
			case "ina":
				if (secondaryPlot !== "ina") {
					secondaryPlot = "ina";
					app.editPlot("NobleOther", inaPlot, true, true);
				}
				break;
			case "il":
				if (secondaryPlot !== "il") {
					secondaryPlot = "il";
					app.editPlot("NobleOther", ilPlot, true, true);
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
	 * Given the current time and the timestep, return the index value for the
	 * array.
	 * @return {number} - the value of the array for the current time.
	 */
	function arrayAtTime(currentTime, timestep, array) {
		var index = Math.floor(currentTime/timestep);
		return array[index];
	}


	/** 
	 * Renders the main plot to plotter
	 * @param  {Object} values - an object containing arrays of values to
	 * display
	 */
	function drawMainPlot(values) {
		var timestep;
		app.selectPlot("Noble");
		if (displayV) {
			timestep = timeperiod / values.v.length;
			app.ctx.strokeStyle = utils.colors.Red;
			app.ctx.lineWidth = 3;
			app.plotFunction(function(x) {
				return arrayAtTime(x, timestep, values.v);
			}, true, timestep, 0, timeperiod);
		}
		if (displayM) {
			timestep = timeperiod / values.m.length;
			app.ctx.strokeStyle = utils.colors.Green;
			app.ctx.lineWidth = 3;
			app.plotFunction(function(x) {
				return arrayAtTime(x, timestep, values.m);
			}, true, timestep, 0, timeperiod);
		}
		if (displayH) {
			timestep = timeperiod / values.h.length;
			app.ctx.strokeStyle = utils.colors.LightBlue;
			app.ctx.lineWidth = 3;
			app.plotFunction(function(x) {
				return arrayAtTime(x, timestep, values.h);
			}, true, timestep, 0, timeperiod);
		}
		if (displayN) {
			timestep = timeperiod / values.n.length;
			app.ctx.strokeStyle = utils.colors.Indigo;
			app.ctx.lineWidth = 3;
			app.plotFunction(function(x) {
				return arrayAtTime(x, timestep, values.n);
			}, true, timestep, 0, timeperiod);
		}
	}


	/**
	 * Draw the Ik value on the Secondary Plot
	 * @param  {Object} values - an object containing the ik points to plot.
	 */
	function drawIkPlot(values) {
		var timestep = timeperiod / values.ik.length;
		resizePlots("NobleOther", null, ikPlot.range);

		app.selectPlot("NobleOther");
		app.ctx.strokeStyle = utils.colors.Yellow;
		app.ctx.lineWidth = 3;
		app.plotFunction(function(x) {
			return arrayAtTime(x, timestep, values.ik);
		}, true, timestep, 0, timeperiod);
	}


	/**
	 * Draw the Ina value on the Secondary Plot
	 * @param  {Object} values - an object containing the ina points to plot.
	 */
	function drawInaPlot(values) {
		var timestep = timeperiod / values.ina.length;
		resizePlots("NobleOther", null, inaPlot.range);

		app.selectPlot("NobleOther");
		app.ctx.strokeStyle = utils.colors.Black;
		app.ctx.lineWidth = 3;
		app.plotFunction(function(x) {
			return arrayAtTime(x, timestep, values.ina);
		}, true, timestep, 0, timeperiod);
	}


	/**
	 * Draw the Il value on the Secondary Plot
	 * @param  {Object} values - an object containing the il points to plot.
	 */
	function drawIlPlot(values) {
		var timestep = timeperiod / values.il.length;
		resizePlots("NobleOther", null, ilPlot.range);

		app.selectPlot("NobleOther");
		app.ctx.strokeStyle = utils.colors.Aqua;
		app.ctx.lineWidth = 3;
		app.plotFunction(function(x) {
			return arrayAtTime(x, timestep, values.il);
		}, true, timestep, 0, timeperiod);
	}


	/**
	 * Establish the secondary plot with settings for the ik plot
	 */
	function setIkPlot() {
		app.editPlot("NobleOther", ikPlot, true, true);
	}


	/**
	 * Establish the secondary plot with settings for the il plot
	 */
	function setIlPlot() {
		app.editPlot("NobleOther", ilPlot, true, true);
	}


	/**
	 * Establish the secondary plot with settings for the ina plot
	 */
	function setInaPlot() {
		app.editPlot("NobleOther", inaPlot, true, true);
	}


	/**
	 * Clear the NobleOther plot
	 */
	function clearSecondaryPlot() {
		app.selectPlot("NobleOther");
	}


	/**
	 * Renders the secondary plot with plotter
	 * @param  {Object} values - an object containing arrays of values to display
	 */
	function drawSecondaryPlot(values) {

		app.selectPlot("NobleOther");
		switch(secondaryPlot) {
			case "ik":
				timestep = timeperiod / values.ik.length;
				app.ctx.strokeStyle = utils.colors.Yellow;
				app.ctx.lineWidth = 3;
				app.plotFunction(function(x) {
					return arrayAtTime(x, timestep, values.ik);
				}, true, timestep, 0, timeperiod);
				break;
			case "ina":
				timestep = timeperiod / values.ina.length;
				app.ctx.strokeStyle = utils.colors.Black;
				app.ctx.lineWidth = 3;
				app.plotFunction(function(x) {
					return arrayAtTime(x, timestep, values.ina);
				}, true, timestep, 0, timeperiod);
				break;
			case "il":
				timestep = timeperiod / values.il.length;
				app.ctx.strokeStyle = utils.colors.Aqua;
				app.ctx.lineWidth = 3;
				app.plotFunction(function(x) {
					return arrayAtTime(x, timestep, values.il);
				}, true, timestep, 0, timeperiod);
				break;
		}
	}


	/**
	 * Update the plots with the given values.
	 * 
	 * @param  {Object} values - an object containing the values that will be
	 * plotted.
	 */
	function drawPlots(values) {
		drawMainPlot(values);
		drawSecondaryPlot(values);
	}


	/**
	 * Draw the Overlay on the plot
	 * @return {[type]} [description]
	 */
	function drawOverlay(plotName, values) {
		var xLoc;
		var range;

		// draw the s1 overlays
		for (var i = 0; i < values.s1.length; i++) {

			app.selectPlot(plotName, false);
			xLoc = values.s1[i];
			range = app.settings.range;
			app.ctx.strokeStyle = utils.colors.Black;
			app.ctx.lineWidth = 1;
			app.plotLine(new Point(xLoc, range.x), new Point(xLoc, range.y));
		}

		// draw the s2 overlays
		app.selectPlot(plotName, false);
		xLoc = values.s2;
		range = app.settings.range;
		app.ctx.strokeStyle = utils.colors.Black;
		app.ctx.lineWidth = 1;
		app.plotLine(new Point(xLoc, range.x), new Point(xLoc, range.y));
	}


	/**
	 * Plots should maintain a constant width and height. The function gets the
	 * current pixels per unit from the selected plot. Then, it checks to see if
	 * it was passed a new domain or range. If there is a new domain and range,
	 * it updates the pixelPerUnit value. It then resizes the plot to fit the
	 * dimensions of the new domain and range.
	 * 
	 * @param  {string} plotName - the name of the plot to alter
	 * 
	 * @param  {Point} domain - the domain that the plot will be resized around
	 * 
	 * @param  {Point} range - the range that the plot will be resized around
	 */
	function resizePlots(plotName, domain, range) {
		var width = 437.5;
		var height = 240;
		
		app.selectPlot(plotName);
		//console.log("blork");
		var ppu = app.settings.pixelPerUnit;
		var newDomain = app.settings.domain;
		var newRange = app.settings.range;

		if (!!domain) {
			ppu.x = width / (domain.y - domain.x);
			newDomain = domain;
			timeperiod = domain.y;
		}
		if (!!range) {
			ppu.y = height / (range.y - range.x);
			newRange = range;
		}

		var resizeObj = {
			pixelPerUnit: ppu,
			domain: newDomain,
			range: newRange,
		}

		app.editPlot(plotName, resizeObj, true, true);
	}


	/**
	 * Resize the domain of the plot and update the time period.
	 * @param  {number} domain - the new domain of the app
	 */
	function resizeDomain(domain) {
		resizePlots("Noble", domain);
		resizePlots("NobleOther", domain);

	}


	function clearPlots() {
		app.clearPlot(true);
	}

	/**
	 * This is the api that is returned by NoblePlots. It contains the
	 * properties and functions that the user can interact with.
	 */
	var api = {
		initialize: initialize,
		toggleDisplay: toggleDisplay,
		setSecondaryPlot: setSecondaryPlot,
		setIkPlot: setIkPlot,
		setInaPlot: setInaPlot,
		setIlPlot: setIlPlot,
		drawPlots: drawPlots,
		drawMainPlot: drawMainPlot,
		drawIkPlot: drawIkPlot,
		drawInaPlot: drawInaPlot,
		drawIlPlot: drawIlPlot,
		drawOverlay: drawOverlay,
		clearSecondaryPlot: clearSecondaryPlot,
		clearPlots: clearPlots,
		resizeDomain: resizeDomain,
	}
	return api;
});