define(["utility"],
	function PointBufferAnalyzer(utils) {
		"use strict";

		var count = 0;
		var bufferSettings;

		function initialize(settings) {
			var bufferSettings = {
				bufferSize: 100,
				calcFunction: CALCULATE_SKIP,
				points: {
                    u: [],
                    v: [],
                    myPoints: ["u","v"],
                    
                }
            };

            if (!settings.calculationSettings.hasOwnProperty("pointBuffer")) {
            	settings.calculationSettings.pointBuffer = bufferSettings;
            } else {
            	settings.calculationSettings.pointBuffer = utils.extend(bufferSettings, settings.calculationSettings.pointBuffer);
            }
        }


    /**
     * This function takes output from the calculator and 
     * performs the given aggregation function on it
     */
     function aggregate(data) {
     	data.calculationSettings.pointBuffer.calcFunction(data);
     	count++;
     }


     function reset(settings) {
     	settings.calculationSettings.pointBuffer.points = {
     		u: [],
     		v: []
     	}
     	count = 0;
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
	 function CALCULATE_SKIP(data) {

	 	var c = data.calculationSettings;
	 	bufferSettings = data.calculationSettings.pointBuffer;

        var uPoint = new Point(count * c.timestep, data.calculationSettings.u);
        bufferSettings.points.u.push(uPoint);
        
        var vPoint = new Point(count * c.timestep, data.calculationSettings.v);
        bufferSettings.points.v.push(vPoint);


    }
    /**
     * This function updates the object passed as a paremeter with the most recent
     * values of point buffer if it has a property called pointbuffer.
     *
     * @param {settings} - the object of which point buffer property needs to be updated.
     */
	function getSettings(settings){
		if (! settings.calculationSettings.hasOwnProperty("pointBuffer")) {           
			settings.calculationSettings.pointBuffer = {};
		}
		settings.calculationSettings.pointBuffer = utils.extend(settings.calculationSettings.pointBuffer, bufferSettings);
	}

	return {
		initialize: initialize,
		aggregate: aggregate,
		reset: reset,
		getSettings : getSettings
        //finalPoints: finalPoints
    }
})

