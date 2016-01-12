/**
 * This module wraps some of the functionality of the main Plotter module. It
 * provides a more convenient way for the form to interact with the graphs and
 * wraps some complex behavior into more convenient functions.
 */
function NoblePlots() {

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
	 * This function sets the secondary plot to the name of the given name. If the name given doesn't 
	 * @param {[type]} plotName [description]
	 */
	function setSecondaryPlot(plotName) {
		switch(plotName) {
			case "ik":
				if (secondaryPlot !== "ik") {
					secondaryPlot = "ik";
					app.editPlot("NobleOther", ikPlot);
				}
			case "ina":
				if (secondaryPlot !== "ina") {
					secondaryPlot = "ina";
					app.editPlot("NobleOther", inaPlot);
				}
			case "il":
				if (secondaryPlot !== "il") {
					secondaryPlot = "il";
					app.editPlot("NobleOther", ilPlot);
				}
			case null:
				secondaryPlot = null;
			default:
				throw new Error("Not a valid plot name");
		}
	}


	/**
	 * Update the plots with the given values.
	 * @param  {Object} values - an object containing the values that will be
	 * plotted.
	 */
	function update(values) {

		app.selectPlot("Noble");
		if (displayV) {
			app.ctx.strokeStyle = Colors.Red;
			app.ctx.lineWidth = 3;
			app.plotFunction(function(x) {
				return values.v[x];
			}, true, 1, 0, 5000);
		}
		if (displayM) {
			app.ctx.strokeStyle = Colors.Green;
			app.ctx.lineWidth = 3;
			app.plotFunction(function(x) {
				return values.m[x];
			}, true, 1, 0, 5000);
		}
		if (displayH) {
			app.ctx.strokeStyle = Colors.LightBlue;
			app.ctx.lineWidth = 3;
			app.plotFunction(function(x) {
				return values.h[x];
			}, true, 1, 0, 5000);
		}
		if (displayN) {
			app.ctx.strokeStyle = Colors.Indigo;
			app.ctx.lineWidth = 3;
			app.plotFunction(function(x) {
				return values.n[x];
			}, true, 1, 0, 5000);
		}

		app.selectPlot("NobleOther");
		switch(secondaryPlot) {
			case "ik":
				app.ctx.strokeStyle = Colors.Yellow;
				app.ctx.lineWidth = 3;
				app.plotFunction(function(x) {
					return values.ik[x];
				}, true, 1, 0, time);
				break;
			case "ina":			
				app.ctx.strokeStyle = Colors.Black;
				app.ctx.lineWidth = 3;
				app.plotFunction(function(x) {
					return values.ina[x];
				}, true, 1, 0, time);
				break;
			case "il":			
				app.ctx.strokeStyle = Colors.Aqua;
				app.ctx.lineWidth = 3;
				app.plotFunction(function(x) {
					return values.il[x];
				}, true, 1, 0, time);
				break;
		}
	}




	/**
	 * This is the api that is returned by NoblePlots. It contains the
	 * properties and functions that the user can interact with.
	 */
	var api = {
		initialize: initialize,
		setSecondaryPlot: setSecondaryPlot,
		update: update,
	}
	return api;
}