/**
 * This module wraps some of the functionality of the main Plotter module. It
 * provides a more convenient way for the form to interact with the graphs and
 * wraps some complex behavior into more convenient functions.
 */
define(["utility"],
function BarkleyPlots(utils) {
	"use strict";

	var app;
    var mainPlotBase = {
        offset: new Point(0, 0),
        range: new Point(-0.1, 1.1),
        unitPerTick: new Point(30, .1),
        pixelPerUnit: new Point(.0875, 200),
        labelFrequency: new Point(1, 1),
        xAxis: "Time (ms)",
        yAxis: " ",
        labelPrecision: new Point(0, 1),
        labelSize: new Point(0, 0),
    };

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
        app.selectPlot("Barkley");
        _resizePlots("Barkley", 
                     settings.plotSettings.Barkley, 
                     settings.calculationSettings,
                     "mainPlot");
                     
        
        // Draw the APD and DI line segments
        /*if (settings.formSettings.displayAPDDI) {
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
        }*/
        
        // Draw the voltage plots
		
        if (settings.formSettings.displayU) {
            app.ctx.strokeStyle = utils.colors.Green;
            app.ctx.lineWidth = 3;
            app.plotPoly(settings.calculationSettings.pointBuffer.points.u, false);
        }

        if (settings.formSettings.displayV) {
            app.ctx.strokeStyle = utils.colors.Red;
            app.ctx.lineWidth = 3;
            app.plotPoly(settings.calculationSettings.pointBuffer.points.v, false);
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

        /*        
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
        }*/

	}
    return {
		initialize: initialize,
		drawPlots: drawPlots,
	}
});


