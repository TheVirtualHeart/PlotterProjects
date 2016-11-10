/**
 * This module is responsible for performing the differential equation
 * calculation for Karma. The object maintains the state of the different
 * variables and returns them after each calculation. These variables can also
 * be reset. 
 */

 define(["utility"],
  function KarmaCalculator(utils) {
 		"use strict";

	/**
	 * Displays the current iteration of the count
	 */
	 var count = 0,
	 analyzers = [], /** This refers the functions that will analyze the data that is produced */
	 settings = Object.create(null),
	 cS, // cS is for calculationSettings
	 cC; // cC is for calculationConstants

    /**
	 * This function initializes the Calculator. It is functionally the same as
	 * the reset function. This wrapper function provides a more semantic way to
	 * present that functionality.
	 * 
	 * @param  {Object} newSettings
	 */
	function initialize(newSettings) {		
		settings 		 =    utils.extend(newSettings);		
	}

   /**
	 * This function resets the Calculator with the initial values. If any
	 * values are specified in newSettings, they will overwrite the existing
	 * values in data.calculationSettings.
	 * 
	 * @param  {Object} newSettings 
	 */
	 function reset(newSettings) {
	 	var overwrite   =    newSettings || {};
	 	for (var attrname in overwrite) { 
	 		settings.initial[attrname]   =    overwrite[attrname]; 
	 	};

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
    * Performs a differential calculations and increments the values
    */
	function calculateNext(data) {

		cS.istim = _s1s2Stimulus(count, data);

		var dfunc, rfunc, hfunc, ffunc, gfunc, de, dn;

		dfunc = Math.pow(cS.n,cS.m);
		rfunc = (1 - (1 - cC.expRe)  *  cS.n) / (1 - cC.expRe);
	    hfunc = (1 - Math.tanh(cS.v - cS.eh)) * cS.v * cS.v / 2;
	    ffunc = -cS.v + (cS.estar - dfunc) * hfunc;
	    gfunc = rfunc * (cS.v - cS.en > 0) - (1 - (cS.v - cS.en > 0)) * cS.n;
	    de = ffunc / cS.taue;
	    dn = gfunc / cS.taun;

	    cS.v = cS.v + cS.timestep * de + cS.timestep * cS.istim;
	    cS.n = cS.n + cS.timestep * dn;

		// sets voltage variables after calculations
        utils.copySpecific(data.calculationSettings, cS,  data.calculationSettings.voltageVariables);
        
        // iterate the count
		count++;

		return data;				 
	}

	/*
     * This function instantiate an object consisting of constants
     * as properties to be used in calculations iterations. The values 
     * remains unchanged across iterations.
     */    
     function CalcConstants(c){
 	 
		this.eps = c.taue/c.taun;
		this.expRe = Math.exp(-c.Re);

 	}

	/*  This function calculates the number of iterations for calculateNext 
    *   to be executed.
    *   param {object} settings
    */
    function _getNumIterations(settings) {
        var c   =    settings.calculationSettings;
        var num = ((c.s1 * (c.ns1 - 1)) + (2 * c.s2)) / c.timestep;
        num   =    Math.floor(num);
        return num;    
    }
   
   	/*This function iteratively calls all the analyzers and performs 
     * all the calculations to generate points to be displayed on the
     * plotter
     * param {int} iterations
     * param {object} settings
     */  
    function runCalculations(iterations, settings) {
	 	var state   =    settings,
        data,
	 	curAnalyzer; 
	 	
        count   =    0;
        
        cS  =   _.cloneDeep(settings.calculationSettings);      
        cC  =   new CalcConstants(settings.calculationSettings); 
        
        /**
         * Reset the calculators to their base states
         */
         var numCalculations = _getNumIterations(settings);  
         for (curAnalyzer = 0; curAnalyzer < analyzers.length; curAnalyzer++) {
         	analyzers[curAnalyzer].reset(state);
         }

        /**
         * Perform a function before the calculations are run
         */
         for (curAnalyzer = 0; curAnalyzer < analyzers.length; curAnalyzer++) {
         	if (analyzers[curAnalyzer].hasOwnProperty("preAggregate")) {
         		analyzers[curAnalyzer].preAggregate(state);
         	}
         }
        /* 
         * Run the calculations the appropriate number of times and 
         * pass these values to the analyzers using their aggregate
         * function
         */
         
         for (var i = 0; i < numCalculations; i++) {
         	data = calculateNext(state);          
         	for (curAnalyzer = 0; curAnalyzer < analyzers.length; curAnalyzer++) {
                if (analyzers[curAnalyzer].hasOwnProperty("aggregate")) {
                  if(analyzers[curAnalyzer].analyzerName !== "S1S2Analyzer" || i >= numCalculations-2) {
                        analyzers[curAnalyzer].aggregate(data);
                  }
                }
            }
         }

        /**
         * Perform a function after the calculations are run
         */
         for (curAnalyzer = 0; curAnalyzer < analyzers.length; curAnalyzer++) {
         	if (analyzers[curAnalyzer].hasOwnProperty("postAggregate")) {
                analyzers[curAnalyzer].postAggregate(data);
         	}
         } 
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
	 		if ((count >= periodX) && (count < periodX + dur)) {
	 			stim = c.stimmag;
	 		}
	 	}
	 	var lastPeriodX = utils.round(stimuli.s2 / c.timestep);
	 	if ((count >= lastPeriodX) && (count < lastPeriodX + dur)) {
	 		stim = c.stimmag;
	 	}		
	 	return stim;
	 }

	 /*
	 * This function is responsible for udpating the settings object properties.
	 */
	 function updateSettingsWithAnalyzers(settings){
	 	analyzers.forEach(function(analyzer){
	 		analyzer.getSettings(settings);
	 	});
	 }

	/**
	 * This is the api that is returned by NygrenCalculator. It contains the
	 * properties and functions that are accessible from the outside.
	 */
	 var api = {
	 	addAnalysisFunction: addAnalysisFunction,
	 	runCalculations: runCalculations,
	 	initialize: initialize,
	 	updateSettingsWithAnalyzers : updateSettingsWithAnalyzers,
		reset: reset,
	};
	return api;
});
