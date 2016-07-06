/** 
 * provide a series of functions to easily mediate between the calculator, the
 * pointBuffer, and the plots.
 */
define([],
function NobleMediator() {
	"use strict";
     
	// var calculator;
	// var plots;
	// var displayOverlay = true;

	// var points = [];
	// var overlay = {};
	// var numPoints = 1500;

	// var secondaryPlot = null;


	// var numCalculations = 500000;

	// /**
	//  * This function performs all of the steps required to initialize the
	//  * components that the mediator will use.
	//  */
	// function initialize(pcalculator, pplots) {
	// 	calculator = pcalculator;
	// 	plots = pplots;
        
    //     pointBufferAnalyzer.initialize(numPoints)
        
        
    //     calculator.addAnalysisFunction(pointBufferAnalyzer.aggregate)

	// 	//pointBuffer.calculate(calculator, numCalculations, numPoints, pointBuffer.AVERAGE_FUNCTION);
        
	// 	//points = pointBuffer.variables;
	// 	//overlay = calculator.getStimuliLocations();

	// 	requestAnimationFrame(update)
	// }


	// /**
	//  * A utility function for plotting the new bounds of the plot.
	//  * @param  {number} s1  - the length of time per s1 period.
	//  * @param  {number} ns1 - the number of s1 periods.
	//  * @param  {number} s2  - the amount of time after the last s1 period
	//  * before this final calculation.
	//  * @return {number}     - the new bounds of the plot.
	//  */
	// function calculatePlotBounds(s1, ns1, s2) {
	// 	return (s1 * ns1) + s2;
	// }


	// /**
	//  * If the user passes in some new settings, update the calculator, get new
	//  * points, and update the plots.
	//  * 
	//  * @param  {Object} settings - the settings that will be used to update the
	//  */
	// function updateGraph(settings) {
	// 	calculator.reset(settings);

	// 	var bounds = calculatePlotBounds(settings.s1, settings.ns1, settings.s2);

	// 	var newDomain = new Point(0, bounds + 650);
	// 	plots.resizeDomain(newDomain);


	// 	/**
	// 	 * @todo - make this dynamic. It is hard coded and ugly
	// 	 */
	// 	var calculations = (bounds + 650) * 100;


	// 	pointBuffer.calculate(calculator, calculations, numPoints, pointBuffer.AVERAGE_FUNCTION);
	// 	points = pointBuffer.variables;

	// 	var stimuli = calculator.getStimuliLocations();
	// 	overlay = stimuli;
	// }


	// /**
	//  * Given a value, set the value of the secondary plot to display.
	//  * 
	//  * @param {String} value - the name of the secondary plot to display.
	//  */
	// function setSecondaryPlot(plotName) {
	// 	switch (plotName) {
	// 		case "il":
	// 			secondaryPlot = plotName;
	// 			plots.setIlPlot();
	// 			break;
	// 		case "ina":
	// 			secondaryPlot = plotName;
	// 			plots.setInaPlot();
	// 			break;
	// 		case "ik":
	// 			secondaryPlot = plotName;
	// 			plots.setIkPlot();
	// 			break;
	// 		default:
	// 			secondaryPlot = null;
	// 	}
	// }


	// /**
	//  * 
	//  */
	// function drawMain(points) {
	// 	plots.drawMainPlot(points);
	// }


	// function drawSecondaryPlot(points, plotName) {
	// 	switch (plotName) {
	// 		case "il":
	// 			plots.drawIlPlot(points);
	// 			break;
	// 		case "ina":
	// 			plots.drawInaPlot(points);
	// 			break;
	// 		case "ik":
	// 			plots.drawIkPlot(points);
	// 			break;
	// 		default:
	// 			plots.clearSecondaryPlot();
	// 	}
	// }


	// /** 
	//  * determine whether or not to display the given variable on the plot
	//  * @param  {string} name  - the name of the variable to display
	//  * @param  {boolean} value - the value that the display property will be set
	//  * to.
	//  */
	// function displayVariable(name, value) {
	// 	plots.toggleDisplay(name, value);
	// }


	// /**
	//  * toggle whether or not the overlay is displayed on the plot.
	//  * @param {boolean} value - the value to set the displayOverlay variable to.
	//  */
	// function setDisplayOverlay(value) {
	// 	displayOverlay = value;
	// }


    // /**
    //  * Draws the APD on the given plot. This function combines points from the
    //  * uptimes and downtimes and creates the coordinates for a line that spans
    //  * the length of when the voltage is above the threshhold.
    //  * 
    //  * @param {string} name - the name of the plot that we will draw the APD on
    //  * @param {array} upTimes - an array containing a list of points where the 
    //  * voltage crossed above the threshold
    //  * @param {array} downTimes - an array containing a list of points where
    //  * the voltage crossed below the threshold
    //  */
	// function drawAPD(name, upTimes, downTimes) {
        
    //     /*
    //      * Find out where the first uptime-downtime stretch occurs
    //      * in the arrays
    //      */
    //     var foundDown = false,
    //         downStart = 0;   
    //     while (downStart < downTimes.length && !foundDown) {
    //         if (downTimes[downStart].x < upTimes[0].x) {
    //             downStart++;
    //         } else {
    //             foundDown = true;
    //         }
    //     }
        
    //     /*
    //      * create lines from the corresponding array from each point
    //      * ignore any unmatched points 
    //      */
    //     var pointArray = [];
    //     for (var i = 0; i < downTimes.length - downStart; i++) {
    //         pointArray[i] = [upTimes[i], downTimes[i + downStart]];
    //     }
        
    //     plots.drawAPD(name, pointArray);
        
	// }
    
    
    // /**
    //  * Draws the DI on the given plot. This function combines points from the
    //  * uptimes and downtimes and creates the coordinates for a line that spans
    //  * the length of when the voltage is below the threshhold.
    //  * 
    //  * @param {string} name - the name of the plot that we will draw the APD on
    //  * @param {array} upTimes - an array containing a list of points where the 
    //  * voltage crossed above the threshold
    //  * @param {array} downTimes - an array containing a list of points where
    //  * the voltage crossed below the threshold
    //  */
	// function drawDI(name, upTimes, downTimes) {
        
    //     /*
    //      * Find out where the first uptime-downtime stretch occurs
    //      * in the arrays
    //      */
    //     var foundUp = false,
    //         upStart = 0;   
    //     while (upStart < upTimes.length && !foundUp) {
    //         if (upTimes[upStart].x < downTimes[0].x) {
    //             upStart++;
    //         } else {
    //             foundUp = true;
    //         }
    //     }
        
    //     /*
    //      * create lines from the corresponding array from each point
    //      * ignore any unmatched points 
    //      */
    //     var pointArray = [];
    //     for (var i = 0; i < upTimes.length - upStart; i++) {
    //         pointArray[i] = [downTimes[i], upTimes[i + upStart]];
    //     }
        
    //     plots.drawDI(name, pointArray);
        
	// }


	// /** 
	//  * Update the plots with the given point values. Recursively call self using
	//  * requestAnimationFrame.
	//  */
	// function update() {
	// 	requestAnimationFrame(update);
        
    //     if (displayOverlay) {
    //     }
	// 	drawMain(points);
	// 	drawSecondaryPlot(points, secondaryPlot);
	// 	if (displayOverlay) {
    //         drawAPD("Noble", points.upTimes, points.downTimes);
    //         drawDI("Noble", points.upTimes, points.downTimes);
	// 		plots.drawS1S2Overlay("Noble", overlay);
	// 		if (!!secondaryPlot) {
	// 			plots.drawS1S2Overlay("NobleOther", overlay);
	// 		}
	// 	}
	// 	//plots.clearPlots();
	// }


	// /**
	//  * The api that contains the functions that will be available to the User.
	//  * @type {Object}
	//  */
	// var api = {
	// 	initialize: initialize,
	// 	displayVariable: displayVariable,
	// 	setDisplayOverlay: setDisplayOverlay,
	// 	setSecondaryPlot: setSecondaryPlot,
	// 	updateGraph: updateGraph,
	// };
	// return api;
    
    
    var calculator;
    var plots;
    
    
    /**
     * Initialize the mediator. Record instances of the 
     * calculator and the plot
     */
    function initialize(calculatorObj, plotsObj) {
        calculator = calculatorObj;
        plots = plotsObj;
    }


    /**
     * This function is used to update the display of the plot
     * @param {settings} - consists of values used by the plot
     */
    function updateDisplay(settings) {        
        //console.log("display");
        console.log(settings); 
        calculator.updateSettingsWithAnalyzers(settings);        
        plots.drawPlots(settings);       
    }


	/*
    * This function is used to recalculate settings and draw plots synchronously.  
    * @param {settings} - consists of settings to store calculated values
	*/
    function updateCalculator(settings) {
         calculator.runCalculations(500000, settings);              
         plots.drawPlots(settings);        
    }


    

    /*
    * This function is used to recalculate settings and draw plots asynchronously.
    * @param {settings} - consists of settings to store calculated values
	*/

    function updateCalculatorAsync(settings) {
        calculator.runCalculations(500000, settings, function(){
        	plots.drawPlots(settings);
        });
    }

    /*
     * This function is used to prepare the format for he points 
     * to be displayed on the screen 
     * @param {settings}   -  consists of the points in pointbuffer
     * @param {pointNames} -  the selected attributes from the UI for which the 
                              points need to be displayed
     * function
     */ 

    function printPoints(settings, pointNames){

    	calculator.updateSettingsWithAnalyzers(settings);

    	var points = settings.calculationSettings.pointBuffer.points,
    	    precision = 3,
    	    counter = (pointNames.length>0)?points[pointNames[0]].length:0,
    	    pBuffer = settings.calculationSettings.pointBuffer,
    	    normalPoints = settings.calculationSettings.pointBuffer.normalPoints,
            fileName = Object.keys(settings.plotSettings)[0];

    	    var a = ["time"],
    	        A = [],
    	        temp = [];

    	    for(var i = 0, count = pointNames.length; i < count; i++ ){
    	    	a.push(pointNames[i]);
    	    }

    	    A.push(a);

    	    for(var i = 0; i < counter; i++ ){
    	          temp.push(points[pointNames[0]][i]["x"]); 	    	
    	    	for(var j =0, count = pointNames.length; j < count; j++ ){	
    	    		if(normalPoints[pointNames[j]])
    	    		{
    	    			temp.push((points[pointNames[j]][i]["y"] * (normalPoints[pointNames[j]]["y"] - normalPoints[pointNames[j]]["x"])) + normalPoints[pointNames[j]]["x"]);
    	    		}
    	    		else{
    	    			temp.push(points[pointNames[j]][i]["y"]);
    	    		}			   

    	    	}
    	    	A.push(temp);
    	    	temp = [];
    	    }


			var csvRows = [];

			for(var i=0, l=A.length; i<l; ++i){
			    csvRows.push(A[i].join(','));
			}

    	 downloadFile(csvRows.join("\r\n"), fileName);
    }

     /*
     * This function downloads the file
     */   

     function downloadFile(csvString, fileName) {
		var a         = document.createElement('a');
        a.id          = "dwnLink"
		a.href        = 'data:attachment/csv,' +  encodeURIComponent(csvString);
		a.target      = '_blank';
		a.download    = fileName +'.csv';
		document.body.appendChild(a);
		a.click();
        document.body.removeChild(a);
	}
        
    /**
     * return the functions that can be 
     * interacted with.
     */
    return {
        initialize: initialize,
        updateDisplay: updateDisplay,
        printPoints : printPoints,
        updateCalculator: updateCalculator,
        updateCalculatorAsync : updateCalculatorAsync
    }

});