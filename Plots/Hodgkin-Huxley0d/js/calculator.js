/**
 * This module is responsible for performing the differential equation
 * calculation for HodgkinHuxley0d. The object maintains the state of the different
 * variables and returns them after each calculation. These variables can also
 * be reset. 
 */

 define(["utility"],
 	function HodgkinHuxleyCalculator(utils) {
 		"use strict";

	/**
	 * Displays the current iteration of the count
	 */
	var count = 0,

	/**
     * This refers the functions that will analyze the 
     * data that is produced
     */
    analyzers = [],
    settings = Object.create(null),
    cS;

    /**
	 * This function initializes the Calculator. It is functionally the same as
	 * the reset function. This wrapper function provides a more semantic way to
	 * present that functionality.
	 * 
	 * @param  {Object} newSettings - the settings that will be used when
	 * calculating HodgkinHuxley. The object is initialized with default values. These
	 * settings will override any existing ones.
	 */
	
	function initialize(newSettings) {		
		settings = utils.extend(newSettings);
	}

	/**
	 * This function resets the Calculator with the initial values. If any
	 * values are specified in newSettings, they will overwrite the existing
	 * values in data.calculationSettings.
	 * 
	 * @param  {Object} newSettings - the settings that will be used when
	 * calculating HodgkinHuxley. The object is initialized with default values. These
	 * settings will override any existing ones.
	 */
	function reset(newSettings) {

	 	var overwrite  =  newSettings || {};
	 	for (var attrname in overwrite) { 
	 		settings.initial[attrname]  =  overwrite[attrname]; 
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
        
        var c   =    settings.calculationSettings; // create a shorter reference variables
        
        // store the location of each of the stimuli
        var stimuli     =    {};
        stimuli.s1  =    [];
        for (var i   =    0; i < c.ns1; i++) {
            stimuli.s1.push(i * c.s1 + c.s1Start);
        }
        var lastPeriod  =    c.s1Start + (c.s1 * (c.ns1 - 1));
        stimuli.s2      =    lastPeriod + c.s2;
        
        // return the stimuli
        return stimuli;
    }

	/**
	 * Performs a differential calculations and increments the values.
	 */
	function calculateNext(data) {

		var am, bm, ah, bh, an, bn, dm, dh, dn, dv;

	    if(Math.abs(cS.v + 25) < 1e-5)
	        am = 1; // this could be worked out by L'Hopital's rule
	    else
	        am = 0.1 * (cS.v + 25) / (Math.exp((cS.v + 25) / 10) -1);
	    
	    bm = 4 * Math.exp(cS.v / 18);
	    ah = 0.07 * Math.exp(cS.v / 20);
	    bh = 1 / (Math.exp((cS.v + 30) / 10) + 1);
	    
	    if(Math.abs(cS.v + 10) < 1e-5)
	        an = 0.1; // this could be worked out by L'Hopital's rule
	    else
	        an = 0.01 * (cS.v + 10) / (Math.exp((cS.v + 10) / 10)-1);
	    
	    bn = 0.125 * Math.exp(cS.v / 80);
	    
	    dm = am * (1 - cS.m) - bm * cS.m;
	    dh = ah * (1 - cS.h) - bh * cS.h;
	    dn = an * (1 - cS.n) - bn * cS.n;


	    cS.ina = cS.gbarna * cS.m * cS.m * cS.m * cS.h * (cS.v - cS.ena);
	    cS.ik = cS.gbark * cS.n * cS.n * cS.n * cS.n * (cS.v - cS.ek);
	    cS.il = cS.gbarl * (cS.v - cS.el);
	    
	    dv = (-cS.ina - cS.ik - cS.il - cS.istim) / cS.cm;
	    
	    cS.istim  =  _s1s2Stimulus(count, data);

	    cS.v = cS.v + cS.timestep * dv;
	    cS.m = cS.m + cS.timestep * dm;
	    cS.h = cS.h + cS.timestep * dh;
	    cS.n = cS.n + cS.timestep * dn;

        // iterate the count
		count ++;

		// sets voltage variables after calculations
        utils.copySpecific(data.calculationSettings, cS,  data.calculationSettings.voltageVariables);
		
		// sets current variables after calculations
        utils.copySpecific(data.calculationSettings, cS, data.calculationSettings.currentVariables);
    
		return data;
	}
   
   /*
	* Gets the number of iterations
	*/
	/*function _getNumIterations(settings) {
	 	var c   =    settings.calculationSettings;
	 	var num   =    (c.endTime * 1.1) / c.timestep;
	 	num   =    Math.floor(num);
        return num;    
	}*/

	function _getNumIterations(settings) {
        var c   =    settings.calculationSettings;
        var num = ((c.s1 * (c.ns1 - 1)) + (2 * c.s2)) / c.timestep;
        num   =    Math.floor(num);
        return num;    
    }
	
   /*
    * This function runs calculations by calling calculateNext
    */
    function runCalculations(iterations, settings) {
    	var state = settings,
    	data,
    	curAnalyzer;
    	count = 0;

    	cS =  _.cloneDeep(settings.calculationSettings); 

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
         	data = calculateNext(state); 
         	for (curAnalyzer = 0; curAnalyzer < analyzers.length; curAnalyzer++) {			            	
         		if (analyzers[curAnalyzer].hasOwnProperty("aggregate")) {
         			if(analyzers[curAnalyzer].analyzerName !== "S1S2Analyzer" || i >= numCalculations-2){
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
        * In this model, the stimulus duration (stimdur) is given in seconds so we 
        * need to convert it into milliseconds since the rest of the units are in 
        * milliseconds.
        *
        * @param {Number} count - the current position of the calculation. The
        * program checks this against the stimuli locations. If it is within one of
        * these locations, a stimulus is applied.
        * 
        * 
        * @return {number} - The stimulus that will be applied.
    */
    
    function _s1s2Stimulus(count, settings) {
        var stim    = 0;
        var stimuli = _getStimuliLocations(settings);
        var c       = settings.calculationSettings;
        var dur     = utils.round(c.stimdur / c.timestep); 
        var periods = stimuli.s1;
        for (var i = 0; i < periods.length; i++) {
            var periodX = utils.round(periods[i] / c.timestep);
            if ((count >= periodX) && (count < periodX + dur)) {
                stim   =    cS.stimmag;
            }
        }
        var lastPeriodX   =    utils.round(stimuli.s2 / c.timestep);
        if ((count >= lastPeriodX) && (count < lastPeriodX + dur)) {
            stim   =    cS.stimmag;
        }   
        return stim;
    }
    
    
    /*
	 * This function is responsible for updating the settings object properties.
	 *
	 */
	function updateSettingsWithAnalyzers(settings){
		analyzers.forEach(function(analyzer){
			analyzer.getSettings(settings);
		});
	}

	/**
	 * This is the api that is returned by HodgkinHuxleyCalculator. It contains the
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

