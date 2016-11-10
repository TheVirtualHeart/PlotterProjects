/**
 * This module is responsible for performing the differential equation
 * calculation for Mitchell0d. The object maintains the state of the different
 * variables and returns them after each calculation. These variables can also
 * be reset. 
 */

 define(["utility"],
 	function MitchellCalculator(utils){
    "use strict";

    /**
	 * Displays the current iteration of the count
	 */
	var count = 0;

	    /**
     * This refers the functions that will analyze the 
     * data that is produced
     */
    var analyzers = [],
     cS;


	    /**
		 * The Calculator is initialized with certain default settings. These will
		 * be overwritten by any settings specified in the initialSettings
		 * parameter.
		 */
		var settings = Object.create(null);

	/**
	 * This function initializes the Calculator. It is functionally the same as
	 * the reset function. This wrapper function provides a more semantic way to
	 * present that functionality.
	 * 
	 * @param  {Object} newSettings - the settings that will be used when
	 * calculating Noble. The object is initialized with default values. These
	 * settings will override any existing ones.
	 */
		function initialize(newSettings) {					
	        settings = utils.extend(newSettings);
		}


	/**
	 * This function resets the Calculator with the initial values. If any
	 * values are specified in newSettings, they will overwrite the existing
	 * values in settings.initial.
	 * 
	 * @param  {Object} newSettings - the settings that will be used when
	 * calculating Noble. The object is initialized with default values. These
	 * settings will override any existing ones.
	 */
	function reset(newSettings) {

		var overwrite = newSettings || {};
		for (var attrname in overwrite) { 
			settings.initial[attrname] = overwrite[attrname]; 
		};

		count = 0;
	}


	/**
	 * Calculate the locations of the different stimuli according to the S1-S2
	 * Protocol.
	 * @return {Object} - A JavaScript Object containing an array of s1 values
	 * and a single value for s2.
	 */
	function _getStimuliLocations(settings) {
        var c = settings.calculationSettings; // create a shorter reference variables
        
        // store the location of each of the stimuli
		var stimuli = {};
		stimuli.s1 = [];
		for (var i = 0; i < c.ns1; i++) {
			stimuli.s1.push(i * c.s1 + c.s1Start);
		}
		var lastPeriod = c.s1Start + (c.s1 * (c.ns1 - 1));
		stimuli.s2 = lastPeriod + c.s2;
        
        // return the stimuli
		return stimuli;
	}

	/**
	 * Performs a differential calculations and increments the values that will
	 * be returned by getPoints().
	 */
	function calculateNext(data) {  

    	var jstim, jin, jout, dv, dh;
        
        jstim = _s1s2Stimulus(count, data);
         

        // calculate currents
	    jin = cS.h * cS.v * cS.v * ((1-cS.v)/cS.tau_in);
	    jout = -cS.v/cS.tau_out;

	   
        //update derivatives for state variables
        dv  = jin + jout + jstim;
        dh = (cS.v < cS.v_gate) ? ((1.0-cS.h)/cS.tau_open) : (-cS.h/cS.tau_close);
         
         cS.v = cS.v + cS.timestep * dv;
         cS.h = cS.h + cS.timestep * dh;

 		//cal ends
    	// sets voltage variables after calculations
        utils.copySpecific(data.calculationSettings, cS,  data.calculationSettings.voltageVariables);

		// iterate the count
		count++;
        return data;
	}

	function addAnalysisFunction(fn) {
        analyzers.push(fn);
    }

	/**
	 * This function calculates the stimulus according to the S1-S2 Protocol.
	 * The function retrieves the location of the S1-S2 stimuli and then
	 * compares the current position against that. If it is within a stimuli
	 * location, the stimulus value is returned. Otherwise, 0 is returned.
	 * 
	 * @param {Number} count - the current position of the calculation. The
	 * program checks this against the stimuli locations. If it is within one of
	 * these locations, a stimulus is applied.
	 * 
	 * @return {number} - The stimulus that will be applied.
	 */
	function _s1s2Stimulus(count, settings) {
		var stim = 0;
		var stimuli = _getStimuliLocations(settings);
        
        var c = settings.calculationSettings;
		var dur = utils.round(c.stimdur / c.timestep);
		var periods = stimuli.s1;
		for (var i = 0; i < periods.length; i++) {
			var periodX = utils.round(periods[i] / c.timestep);
			if ((count >= periodX) && (count < periodX + dur)){ 
				stim = c.v_stim;
			}
		}
		var lastPeriodX = utils.round(stimuli.s2 / c.timestep);
		if ((count >= lastPeriodX) && (count < lastPeriodX + dur)) {
				stim = c.v_stim;
		}		
		return stim;
	}

	/*
	* gets the number of iterations
	*/
	 function _getNumIterations(settings) {
        var c = settings.calculationSettings;
        var num = ((c.s1 * (c.ns1 - 1)) + (2 * c.s2)) / c.timestep;
        num = Math.floor(num); 
        return num;    
    }

    /*
    * This function runs calculations by calling calculateNext
    */

    function runCalculations(iterations, settings) {
        var state = settings,
        curAnalyzer;                  
        count = 0;

        cS =   _.cloneDeep(settings.calculationSettings); 
        
        /**
         * Reset the calculators to their base states
         */
        var numCalculations = _getNumIterations(settings);      
        for (curAnalyzer = 0; curAnalyzer < analyzers.length; curAnalyzer++) {
            analyzers[curAnalyzer].reset(state);
        }

        /**
         * Run the calculations the appropriate number of times and 
         * pass these values to the analyzers using their aggregate
         * function
         */
         for (var i = 0; i < numCalculations; i++) {
         	var data = calculateNext(state); 

         	for (curAnalyzer = 0; curAnalyzer < analyzers.length; curAnalyzer++) {			            	
         		if (analyzers[curAnalyzer].hasOwnProperty("aggregate")) {
         			if(   (analyzers[curAnalyzer].analyzerName === "PointBufferAnalyzer" ) 
         				|| (analyzers[curAnalyzer].analyzerName === "S1S2Analyzer" && i >= numCalculations-2)){
         				analyzers[curAnalyzer].aggregate(data);
         		}
         	}
         }
     }
     console.dir(settings);
 }

    /*
    * This function is responsible for updating the settings object properties  
    */

    function updateSettingsWithAnalyzers(settings){
		analyzers.forEach(function(analyzer){
			analyzer.getSettings(settings);
		});
	}
    
    /**
	 * This is the api that is returned by NobleCalculator. It contains the
	 * properties and functions that are accessible from the outside.
	 */
	var api = {
		addAnalysisFunction: addAnalysisFunction,
        runCalculations: runCalculations,
		initialize: initialize,
		updateSettingsWithAnalyzers : updateSettingsWithAnalyzers,
		reset: reset
	};
	return api;

 });