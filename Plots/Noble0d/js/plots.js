/**
 * This module wraps some of the functionality of the main Plotter module. It
 * provides a more convenient way for the form to interact with the graphs and
 * wraps some complex behavior into more convenient functions.
 */
define(["utility"],
function NoblePlots(utils) {
	"use strict";

// 	var app;

// 	var displayV = true;
// 	var displayM = true;
// 	var displayH = true;
// 	var displayN = true;
// 	var secondaryPlot = null;

// 	var timeperiod = 5000;


// 	/**
// 	 * These are the settings for the plots that will be used when rendering
// 	 * @type {Object}
// 	 */
// 	var secondaryOffset = new Point(0, 325);

// 	var mainPlot = {
// 		offset: new Point(0, 0),
// 		range: new Point(-0.1, 1.1),
// 		unitPerTick: new Point(1000, .1),
// 		pixelPerUnit: new Point(.0875, 200),
// 		labelFrequency: new Point(1, 1),
// 		xAxis: "Time (ms)",
// 		yAxis: "V (mv)",
// 		labelPrecision: new Point(0, 1),
// 		labelSize: new Point(0, 0),
// 	};
// 	var ikPlot = {
// 		offset: secondaryOffset,
// 		range: new Point(10, 60),
// 		unitPerTick: new Point(1000, 10),
// 		labelFrequency: new Point(1, 1),
// 		xAxis: "Time (ms)",
// 		yAxis: "ik",
// 		labelPrecision: new Point(0, 0),
// 	};
// 	var inaPlot = {
// 		offset: secondaryOffset,
// 		range: new Point(-60, 0),
// 		unitPerTick: new Point(1000, 5),
// 		labelFrequency: new Point(1, 1),
// 		xAxis: "Time (ms)",
// 		yAxis: "ina",
// 		labelPrecision: new Point(0, 0),
// 	};
// 	var ilPlot = {
// 		offset: secondaryOffset,
// 		range: new Point(-100, 100),
// 		unitPerTick: new Point(1000, 20),
// 		labelFrequency: new Point(1, 1),
// 		xAxis: "Time (ms)",
// 		yAxis: "il",
// 		//labelPrecision: new Point(0, 0),
// 	};


// 	/**
// 	 * Initialize the plots. Attach the Plotter object to the appropriate DOM
// 	 * element and define the initial plots.
// 	 */
// 	function initialize(newSettings) {
// 		app = createPlotter(document.getElementById("plot"));


// 		/**
// 		 * @todo  These hardcoded values should be replaced
// 		 * @type {Object}
// 		 */
// 		var mainDomain = { 
// 			domain: new Point(0, 3650),
// 			pixelPerUnit: new Point(.1199, 200),
// 		};
// 		var secondDomain = { 
// 			domain: new Point(0, 3650),
// 			pixelPerUnit: new Point(.1199, 1.2),
// 		};


// 		var initialMain = utils.extend({}, mainPlot, mainDomain);
// 		var initialSecond = utils.extend({}, ilPlot, secondDomain);
// 		app.newPlot(initialMain, "Noble");
// 		app.newPlot(initialSecond, "NobleOther");
// 	}


// 	/**
// 	 * This function sets the secondary plot to the name of the given name. If
// 	 * the name given is not one of the valid names, an error is thrown.
// 	 * 
// 	 * @param {string} plotName - the name of the secondary plot to display
// 	 */
// 	function setSecondaryPlot(plotName) {
// 		switch(plotName) {
// 			case "ik":
// 				if (secondaryPlot !== "ik") {
// 					// In this section, update the ppu
// 					secondaryPlot = "ik";
// 					app.editPlot("NobleOther", ikPlot, true, true);
// 				}
// 				break;
// 			case "ina":
// 				if (secondaryPlot !== "ina") {
// 					secondaryPlot = "ina";
// 					app.editPlot("NobleOther", inaPlot, true, true);
// 				}
// 				break;
// 			case "il":
// 				if (secondaryPlot !== "il") {
// 					secondaryPlot = "il";
// 					app.editPlot("NobleOther", ilPlot, true, true);
// 				}
// 				break;
// 			case null:
// 				secondaryPlot = null;
// 				break;
// 			default:
// 				throw new Error("'" + plotName + "' is not a valid plot name");
// 		}
// 	}


// 	/**
// 	 * Toggle whether or not the given variable should be displayed. Will throw
// 	 * an error if the given variable is not being drawn.
// 	 * 
// 	 * @param  {string} name - the name of the variable to display.
// 	 * @param  {boolean} value - the value to set the display property to
// 	 */
// 	function toggleDisplay(name, value) {
// 		if (name === "v") {
// 			if (utils.checkBool(value)) {
// 				displayV = value;
// 			} else {
// 				throw new Error("the given value is not valid");
// 			}
// 		}
// 		else if (name === "m") {
// 			if (utils.checkBool(value)) {
// 				displayM = value;
// 			} else {
// 				throw new Error("the given value is not valid");
// 			}
// 		}
// 		else if (name === "h") {
// 			if (utils.checkBool(value)) {
// 				displayH = value;
// 			} else {
// 				throw new Error("the given value is not valid");
// 			}
// 		}
// 		else if (name === "n") {
// 			if (utils.checkBool(value)) {
// 				displayN = value;
// 			} else {
// 				throw new Error("the given value is not valid");
// 			}
// 		}
// 		else {
// 			throw new Error("'" + name + "'' is not a variable that can be displayed");
// 		}
// 	}


// 	/** 
// 	 * Renders the main plot to plotter
// 	 * @param  {Object} values - an object containing arrays of values to
// 	 * display
// 	 */
// 	function drawMainPlot(values) {
// 		var timestep;
// 		app.selectPlot("Noble");
// 		if (displayV) {
// 			timestep = timeperiod / values.v.length;
// 			app.ctx.strokeStyle = utils.colors.Red;
// 			app.ctx.lineWidth = 3;
// 			app.plotFunction(function(x) {
// 				return arrayAtTime(x, timestep, values.v);
// 			}, true, timestep, 0, timeperiod);
// 		}
// 		if (displayM) {
// 			timestep = timeperiod / values.m.length;
// 			app.ctx.strokeStyle = utils.colors.Green;
// 			app.ctx.lineWidth = 3;
// 			app.plotFunction(function(x) {
// 				return arrayAtTime(x, timestep, values.m);
// 			}, true, timestep, 0, timeperiod);
// 		}
// 		if (displayH) {
// 			timestep = timeperiod / values.h.length;
// 			app.ctx.strokeStyle = utils.colors.LightBlue;
// 			app.ctx.lineWidth = 3;
// 			app.plotFunction(function(x) {
// 				return arrayAtTime(x, timestep, values.h);
// 			}, true, timestep, 0, timeperiod);
// 		}
// 		if (displayN) {
// 			timestep = timeperiod / values.n.length;
// 			app.ctx.strokeStyle = utils.colors.Indigo;
// 			app.ctx.lineWidth = 3;
// 			app.plotFunction(function(x) {
// 				return arrayAtTime(x, timestep, values.n);
// 			}, true, timestep, 0, timeperiod);
// 		}
// 	}


// 	/**
// 	 * Draw the Ik value on the Secondary Plot
// 	 * @param  {Object} values - an object containing the ik points to plot.
// 	 */
// 	function drawIkPlot(values) {
// 		var timestep = timeperiod / values.ik.length;
// 		resizePlots("NobleOther", null, ikPlot.range);

// 		app.selectPlot("NobleOther");
// 		app.ctx.strokeStyle = utils.colors.Yellow;
// 		app.ctx.lineWidth = 3;
// 		app.plotFunction(function(x) {
// 			return arrayAtTime(x, timestep, values.ik);
// 		}, true, timestep, 0, timeperiod);
// 	}


// 	/**
// 	 * Draw the Ina value on the Secondary Plot
// 	 * @param  {Object} values - an object containing the ina points to plot.
// 	 */
// 	function drawInaPlot(values) {
// 		var timestep = timeperiod / values.ina.length;
// 		resizePlots("NobleOther", null, inaPlot.range);

// 		app.selectPlot("NobleOther");
// 		app.ctx.strokeStyle = utils.colors.Black;
// 		app.ctx.lineWidth = 3;
// 		app.plotFunction(function(x) {
// 			return arrayAtTime(x, timestep, values.ina);
// 		}, true, timestep, 0, timeperiod);
// 	}


// 	/**
// 	 * Draw the Il value on the Secondary Plot
// 	 * @param  {Object} values - an object containing the il points to plot.
// 	 */
// 	function drawIlPlot(values) {
// 		var timestep = timeperiod / values.il.length;
// 		resizePlots("NobleOther", null, ilPlot.range);

// 		app.selectPlot("NobleOther");
// 		app.ctx.strokeStyle = utils.colors.Aqua;
// 		app.ctx.lineWidth = 3;
// 		app.plotFunction(function(x) {
// 			return arrayAtTime(x, timestep, values.il);
// 		}, true, timestep, 0, timeperiod);
// 	}


// 	/**
// 	 * Establish the secondary plot with settings for the ik plot
// 	 */
// 	function setIkPlot() {
// 		app.editPlot("NobleOther", ikPlot, true, true);
// 	}


// 	/**
// 	 * Establish the secondary plot with settings for the il plot
// 	 */
// 	function setIlPlot() {
// 		app.editPlot("NobleOther", ilPlot, true, true);
// 	}


// 	/**
// 	 * Establish the secondary plot with settings for the ina plot
// 	 */
// 	function setInaPlot() {
// 		app.editPlot("NobleOther", inaPlot, true, true);
// 	}


// 	/**
// 	 * Clear the NobleOther plot
// 	 */
// 	function clearSecondaryPlot() {
// 		app.selectPlot("NobleOther");
// 	}


// 	/**
// 	 * Renders the secondary plot with plotter
// 	 * @param  {Object} values - an object containing arrays of values to display
// 	 */
// 	function drawSecondaryPlot(values) {

// 		app.selectPlot("NobleOther");
// 		switch(secondaryPlot) {
// 			case "ik":
// 				timestep = timeperiod / values.ik.length;
// 				app.ctx.strokeStyle = utils.colors.Yellow;
// 				app.ctx.lineWidth = 3;
// 				app.plotFunction(function(x) {
// 					return arrayAtTime(x, timestep, values.ik);
// 				}, true, timestep, 0, timeperiod);
// 				break;
// 			case "ina":
// 				timestep = timeperiod / values.ina.length;
// 				app.ctx.strokeStyle = utils.colors.Black;
// 				app.ctx.lineWidth = 3;
// 				app.plotFunction(function(x) {
// 					return arrayAtTime(x, timestep, values.ina);
// 				}, true, timestep, 0, timeperiod);
// 				break;
// 			case "il":
// 				timestep = timeperiod / values.il.length;
// 				app.ctx.strokeStyle = utils.colors.Aqua;
// 				app.ctx.lineWidth = 3;
// 				app.plotFunction(function(x) {
// 					return arrayAtTime(x, timestep, values.il);
// 				}, true, timestep, 0, timeperiod);
// 				break;
// 		}
// 	}


// 	/**
// 	 * Update the plots with the given values.
// 	 * 
// 	 * @param  {Object} values - an object containing the values that will be
// 	 * plotted.
// 	 */
// 	function drawPlots(values) {
// 		drawMainPlot(values);
// 		drawSecondaryPlot(values);
// 	}


// 	/**
// 	 * draw the APD values on the plot
// 	 */
// 	function drawAPD(plotName, values) {
// 		for (var i = 0; i < values.length; i++) {

// 			app.selectPlot(plotName, false);
// 			// xLoc = values[i][0].x;
// 			// range = app.settings.range;
// 			app.ctx.strokeStyle = utils.colors.Blue;
// 			app.ctx.lineWidth = 3;
// 			app.plotLine(values[i][0], values[i][1]);
// 		}
//         //debugger;
// 	}
    
    
//    /**
// 	 * draw the APD values on the plot
// 	 */
// 	function drawDI(plotName, values) {
// 		for (var i = 0; i < values.length; i++) {

// 			app.selectPlot(plotName, false);
// 			// xLoc = values[i][0].x;
// 			// range = app.settings.range;
// 			app.ctx.strokeStyle = utils.colors.Orange;
// 			app.ctx.lineWidth = 3;
// 			app.plotLine(values[i][0], values[i][1]);
// 		}
//         //debugger;
// 	}


// 	/**
// 	 * Draw the Overlay on the plot
// 	 */
// 	function drawS1S2Overlay(plotName, values) {
// 		var xLoc;
// 		var range;

// 		// draw the s1 overlays
// 		for (var i = 0; i < values.s1.length; i++) {

// 			app.selectPlot(plotName, false);
// 			xLoc = values.s1[i];
// 			range = app.settings.range;
// 			app.ctx.strokeStyle = utils.colors.Black;
// 			app.ctx.lineWidth = 1;
// 			app.plotLine(new Point(xLoc, range.x), new Point(xLoc, range.y));
// 		}

// 		// draw the s2 overlays
// 		app.selectPlot(plotName, false);
// 		xLoc = values.s2;
// 		range = app.settings.range;
// 		app.ctx.strokeStyle = utils.colors.Black;
// 		app.ctx.lineWidth = 1;
// 		app.plotLine(new Point(xLoc, range.x), new Point(xLoc, range.y));
// 	}


// 	/**
// 	 * Plots should maintain a constant width and height. The function gets the
// 	 * current pixels per unit from the selected plot. Then, it checks to see if
// 	 * it was passed a new domain or range. If there is a new domain and range,
// 	 * it updates the pixelPerUnit value. It then resizes the plot to fit the
// 	 * dimensions of the new domain and range.
// 	 * 
// 	 * @param  {string} plotName - the name of the plot to alter
// 	 * 
// 	 * @param  {Point} domain - the domain that the plot will be resized around
// 	 * 
// 	 * @param  {Point} range - the range that the plot will be resized around
// 	 */
// 	function resizePlots(plotName, domain, range) {
// 		var width = 437.5;
// 		var height = 240;
		
// 		app.selectPlot(plotName);
// 		var ppu = app.settings.pixelPerUnit;
// 		var newDomain = app.settings.domain;
// 		var newRange = app.settings.range;

// 		if (!!domain) {
// 			ppu.x = width / (domain.y - domain.x);
// 			newDomain = domain;
// 			timeperiod = domain.y;
// 		}
// 		if (!!range) {
// 			ppu.y = height / (range.y - range.x);
// 			newRange = range;
// 		}

// 		var resizeObj = {
// 			pixelPerUnit: ppu,
// 			domain: newDomain,
// 			range: newRange,
// 		}

// 		app.editPlot(plotName, resizeObj, false, false);
// 	}


// 	/**
// 	 * Resize the domain of the plot and update the time period.
// 	 * @param  {number} domain - the new domain of the app
// 	 */
// 	function resizeDomain(domain) {
// 		resizePlots("Noble", domain);
// 		resizePlots("NobleOther", domain);

// 	}


// 	function clearPlots() {
// 		app.clearPlot(true);
// 	}

// 	/**
// 	 * This is the api that is returned by NoblePlots. It contains the
// 	 * properties and functions that the user can interact with.
// 	 */
// 	var api = {
// 		initialize: initialize,
// 		toggleDisplay: toggleDisplay,
// 		setSecondaryPlot: setSecondaryPlot,
// 		setIkPlot: setIkPlot,
// 		setInaPlot: setInaPlot,
// 		setIlPlot: setIlPlot,
// 		drawPlots: drawPlots,
// 		drawMainPlot: drawMainPlot,
// 		drawIkPlot: drawIkPlot,
// 		drawInaPlot: drawInaPlot,
// 		drawIlPlot: drawIlPlot,
// 		drawS1S2Overlay: drawS1S2Overlay,
// 		drawAPD: drawAPD, 
//         drawDI: drawDI,
// 		clearSecondaryPlot: clearSecondaryPlot,
// 		clearPlots: clearPlots,
// 		resizeDomain: resizeDomain,
// 	}
// 	return api;

    var app;
    var mainPlotBase = {
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

    
    /**
     * Given settings, create main plot settings based on the 
     * main plot
     */
    // function _generateMainPlot(settings) {
        
        
    //     // create a copy of the main plot base settings
    //     var mainPlotSettings = utils.extend({}, mainPlotBase);
        
        
    //     // calculate a new domain based on the s1, ns1, and s2
    //     var domain = settings.calculationSettings.ns1 *
    //                               settings.calculationSettings.s1 + 
    //                               settings.calculationSettings.s2;
    //     mainPlotSettings.domain = new Point(0, domain);
        
        
    //     // resize the ppu so that it will remain a constant width
    //     var pixelsPerUnitX = settings.plotSettings.width / mainPlotSettings.domain.y - mainPlotSettings.domain.x;
    //     mainPlotSettings.pixelPerUnit.x = pixelsPerUnitX;
        
    //     return mainPlotSettings;
    // }	
    
    
    /**
     * Recursively cycle through the plots to generate the settings
     */
    function _generatePlot(plotSettings, calculationSettings, preset) {
        
        var generatedPlot = {};
        generatedPlot.offset = plotSettings.offset || new Point(0, 0);
        
        // get the display of the default plot if it exists
        var defaultPlot;
        
        if (!preset) {
            for (var plot in plotSettings.plots) {
                if (plotSettings.plots[plot].hasOwnProperty("default")) {
                    if (plotSettings.plots[plot].default === true) {
                        defaultPlot = plot;
                    }
                } 
            }
            if (!defaultPlot) {
                defaultPlot = Object.keys(plotSettings.plots)[0];
            };
        }
        else {
            defaultPlot = preset;
        }
        
        // get the settings of the default plot or the first plot
        generatedPlot = utils.extend(plotSettings.plots[defaultPlot], generatedPlot);
        
        // set the domain of the plot
        generatedPlot.domain = _calculateDomain(calculationSettings);
        
        // calculate the pixels per unit of the new plot
        generatedPlot.pixelPerUnit = _calculatePixelsPerUnit(generatedPlot.domain.x, 
                                              generatedPlot.range.x,
                                              generatedPlot.domain.y,
                                              generatedPlot.range.y,
                                              plotSettings.width,
                                              plotSettings.height);
        
        return generatedPlot;
    }
    
    
    /**
	 * Given the current time and the timestep, return the index value for the
	 * array.
	 * @return {number} - the value of the array for the current time.
	 */
	function _arrayAtTime(currentTime, timestep, array) {
		var index = Math.floor(currentTime);
		return array[index];
	}
    
    
    /**
     * calculate what the domain of the plot should be
     */
    function _calculateDomain(c) {
        var start = c.s1Start;
        var end = ((c.s1Start + (c.s1 * c.ns1) + c.s2) * 1.1);
        return new Point(start, end);
    }
    
    
    /**
     * Calculate the pixels per unit of the plot
     */
    function _calculatePixelsPerUnit(x1, y1, x2, y2, width, height) {
        var ppuX = width / (x2 - x1);
        var ppuY = height / (y2 - y1);
        return new Point(ppuX, ppuY);
    }
    
    
    /**
     * Resize the plot to fit within the height and width of the plot
     */
    function _resizePlots(plotName, plotSettings, calculationSettings, preset) {
        var newPlotSettings = _generatePlot(plotSettings, calculationSettings, preset);
        //if (newPlotSettings.domain.x !== app.settings.domain.x || newPlotSettings.domain.y !== app.settings.domain.y) {
            app.editPlot(plotName, newPlotSettings, false, false);
        //}
    }
    
    
    /**
     * Draws a vertical line on the current plot
     */
    function _drawLineOnPlot(xPoint, color) {
        var currentRange = app.settings.range;
        var pBottom = new Point(xPoint.x, currentRange.x);
        var pTop = new Point(xPoint.x, -0.01);
        app.ctx.strokeStyle = color;
        app.ctx.lineWidth = 3;
        app.plotLine(pBottom, pTop);
    }
    
    
    /**
     * Initialize the main plot
     */
    function initialize(settings) {
        app = createPlotter(document.getElementById("plot"));
        for (var graph in settings.plotSettings) {
            app.newPlot(_generatePlot(settings.plotSettings[graph], settings.calculationSettings), graph);
        }
    }
    

    /**
     * Draw a horizontal line on the plot
     */
    function _drawHorizontalLine(start, end) {
        
        // check to see that there is at least one height
        var height;
        if (!!start && start.hasOwnProperty("y")) {
            height = start.y;
        } else if (!!end && end.hasOwnProperty("y")) {
            height = end.y;
        }
        
        // if there is at least one point, draw the line
        if (!!height) {
            var startPoint = new Point(app.settings.domain.x, height)
            if (!!start) {
                startPoint = start;
            }
            var endPoint = new Point(app.settings.domain.y, height)
            if (!!end) {
                endPoint = end;
            }
            app.plotLine(startPoint, endPoint);
        }
        
    }
    
    
    /**
     * Draws all of the plots based on the given settings
     */
    function drawPlots(settings) {
        
        // draw the main plot
        app.selectPlot("Noble");
        _resizePlots("Noble", 
                     settings.plotSettings.Noble, 
                     settings.calculationSettings,
                     "mainPlot");
                     
        
        // Draw the APD and DI line segments
        if (settings.formSettings.displayAPDDI) {
            if (!!settings.calculationSettings.apdPoints.dl.start) {
                app.ctx.strokeStyle = utils.colors.LightBlue;
                app.ctx.lineWidth = 3;
                _drawHorizontalLine(settings.calculationSettings.apdPoints.dl.start, settings.calculationSettings.apdPoints.dl.end);
            }
            if (!!settings.calculationSettings.apdPoints.apd.start) {
                app.ctx.strokeStyle = utils.colors.Orange;
                app.ctx.lineWidth = 3;
                _drawHorizontalLine(settings.calculationSettings.apdPoints.apd.start, settings.calculationSettings.apdPoints.apd.end);
            }
        }
        
        // Draw the voltage plots
		if (settings.formSettings.displayV) {
            app.ctx.strokeStyle = utils.colors.Red;
            app.ctx.lineWidth = 3;
            app.plotPoly(settings.calculationSettings.pointBuffer.points.v, false);
		}
        if (settings.formSettings.displayM) {
            app.ctx.strokeStyle = utils.colors.Green;
            app.ctx.lineWidth = 3;
            app.plotPoly(settings.calculationSettings.pointBuffer.points.m, false);
		}
		if (settings.formSettings.displayH) {
            app.ctx.strokeStyle = utils.colors.LightBlue;
            app.ctx.lineWidth = 3;
            app.plotPoly(settings.calculationSettings.pointBuffer.points.h, false);
		}
		if (settings.formSettings.displayN) {
            app.ctx.strokeStyle = utils.colors.Indigo;
            app.ctx.lineWidth = 3;
            app.plotPoly(settings.calculationSettings.pointBuffer.points.n, false);
		}
        
        // draw the S1-S2 lines
        if (settings.formSettings.displayS1S2) {
            var textPoint;
            for (var i = 0; i < settings.calculationSettings.s1s2Points.s1.length; i++) {
                _drawLineOnPlot(
                    settings.calculationSettings.s1s2Points.s1[i],
                    utils.colors.Black);
                textPoint = new Point(settings.calculationSettings.s1s2Points.s1[i].x, -0.01);
                app.ctx.font = "12pt Arial";
                app.ctx.textAlign = "left";
                app.plotText(" S1", textPoint);
            }
            _drawLineOnPlot(
                settings.calculationSettings.s1s2Points.s2,
                utils.colors.Black);                
            textPoint = new Point(settings.calculationSettings.s1s2Points.s2.x, -0.01);
            app.ctx.font = "12pt Arial";
            app.ctx.textAlign = "left";
            app.plotText(" S2", textPoint);
        }        
        
        // draw the readings of the APD and DI values
        if (settings.formSettings.displayAPDDI) {
            // Draw the DI
            var DIText;
            if (!!settings.calculationSettings.apdPoints.dl.length) {
                DIText = settings.calculationSettings.apdPoints.dl.length;
                DIText = Math.floor(DIText * 10) / 10;
                DIText = "DI: " + DIText + "ms";
            } else {
                DIText = "no DI";
            }
            app.ctx.fillStyle = utils.colors.LightBlue;
            app.ctx.font = "12pt Arial";
            app.ctx.textAlign = "left";
            app.ctx.fillText(DIText, 400, 50);
            
            // Draw the APD
            var APDText;
            if (!!settings.calculationSettings.apdPoints.apd.length) {
                APDText = settings.calculationSettings.apdPoints.apd.length;
                APDText = Math.floor(APDText * 10) / 10;
                APDText = "APD: " + APDText + "ms";
            } else {
                APDText = "no APD";
            }
            app.ctx.fillStyle = utils.colors.Orange;
            app.ctx.font = "12pt Arial";
            app.ctx.textAlign = "left";
            app.ctx.fillText(APDText, 400, 30);
        }
        
        
        // draw the secondary plot
        app.selectPlot("NobleOther");
        _resizePlots("NobleOther",
                     settings.plotSettings.NobleOther, 
                     settings.calculationSettings, 
                     settings.formSettings.secondaryPlot);
        
        app.ctx.strokeStyle = utils.colors.Indigo;
        app.ctx.lineWidth = 3;
        app.plotPoly(settings.calculationSettings.pointBuffer.points[settings.formSettings.secondaryPlot], false);
        
    }
    
    
    return {
        initialize: initialize,
        drawPlots: drawPlots,
    }
});