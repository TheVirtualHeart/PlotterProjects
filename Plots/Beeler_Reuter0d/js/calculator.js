/**
    * This module is responsible for performing the differential equation
    * calculation for BeelerReuterCalculator. The object maintains the state of the different
    * variables and returns them after each calculation. These variables can also
    * be reset. 
*/

define(["utility"],
function BeelerReuterCalculator(utils) {
	"use strict";
	/**Displays the current iteration of the count */
	var count   =    0, 
	
	/**This refers the functions that will analyze the data that is produced*/          
	analyzers   =    [],   
	settings   =    Object.create(null),
	//  cS is for calculationSettings
	cS;  
	
	/**
		* This function initializes the Calculator. It is functionally the same as
		* the reset function. This wrapper function provides a more semantic way to
		* present that functionality.
		* 
		* @param  {Object} newSettings
	*/
	function initialize(newSettings) {               
		settings    =    utils.extend(newSettings);		 
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
        * Performs a differential calculations and increments the values that will
        * be returned by getPoints().
	*/
	function calculateNext(data){
		
		var ax1, bx1, am, bm, ah, bh, aj, bj, ad, bd, af, bf, es, dcai; 
		
		cS.c1 = 0.0005; cS.c2 = 0.083; cS.c3 = 50; cS.c4 = 0; cS.c5 = 0; cS.c6 = 0.057; cS.c7 = 1;
		ax1 = (cS.c1*Math.exp(cS.c2*(cS.v+cS.c3))+cS.c4*(cS.v+cS.c5))/(Math.exp(cS.c6*(cS.v+cS.c3))+cS.c7);

		cS.c1  =  0.0013; cS.c2=-0.06; cS.c3  =  20; cS.c4  =  0; cS.c5  =  0; cS.c6=-0.04; cS.c7  =  1;
		bx1=(cS.c1*Math.exp(cS.c2*(cS.v+cS.c3))+cS.c4*(cS.v+cS.c5))/(Math.exp(cS.c6*(cS.v+cS.c3))+cS.c7);

		cS.c1  =  0; cS.c2  =  0; cS.c3  =  47; cS.c4=-1; cS.c5  =  47; cS.c6=-0.1; cS.c7=-1;
		if(Math.abs(cS.v+cS.c3)<1e-5){
			am  =  10;
		}
		else{
			am = (cS.c1*Math.exp(cS.c2*(cS.v+cS.c3))+cS.c4*(cS.v+cS.c5))/(Math.exp(cS.c6*(cS.v+cS.c3))+cS.c7);
		}
		cS.c1 = 40; cS.c2=-0.056; cS.c3 = 72; cS.c4 = 0; cS.c5 = 0; cS.c6 = 0; cS.c7 = 0;
		bm=(cS.c1*Math.exp(cS.c2*(cS.v+cS.c3))+cS.c4*(cS.v+cS.c5))/(Math.exp(cS.c6*(cS.v+cS.c3))+cS.c7);

		cS.c1 = 0.126; cS.c2=-0.25; cS.c3 = 77; cS.c4 = 0; cS.c5 = 0; cS.c6 = 0; cS.c7 = 0;
		ah=(cS.c1*Math.exp(cS.c2*(cS.v+cS.c3))+cS.c4*(cS.v+cS.c5))/(Math.exp(cS.c6*(cS.v+cS.c3))+cS.c7);

		cS.c1 = 1.7; cS.c2 = 0; cS.c3 = 22.5; cS.c4 = 0; cS.c5 = 0; cS.c6=-0.082; cS.c7 = 1;
		bh = (cS.c1*Math.exp(cS.c2*(cS.v+cS.c3))+cS.c4*(cS.v+cS.c5))/(Math.exp(cS.c6*(cS.v+cS.c3))+cS.c7);

		cS.c1 = 0.055; cS.c2=-0.25; cS.c3 = 78; cS.c4 = 0; cS.c5 = 0; cS.c6=-0.2; cS.c7 = 1;
		aj=(cS.c1*Math.exp(cS.c2*(cS.v+cS.c3))+cS.c4*(cS.v+cS.c5))/(Math.exp(cS.c6*(cS.v+cS.c3))+cS.c7);

		cS.c1 = 0.3; cS.c2 = 0; cS.c3 = 32; cS.c4 = 0; cS.c5 = 0; cS.c6=-0.1; cS.c7 = 1;
		bj=(cS.c1*Math.exp(cS.c2*(cS.v+cS.c3))+cS.c4*(cS.v+cS.c5))/(Math.exp(cS.c6*(cS.v+cS.c3))+cS.c7);

		cS.c1 = 0.095; cS.c2=-0.01; cS.c3=-5; cS.c4 = 0; cS.c5 = 0; cS.c6=-0.072; cS.c7 = 1;
		ad=(cS.c1*Math.exp(cS.c2*(cS.v+cS.c3))+cS.c4*(cS.v+cS.c5))/(Math.exp(cS.c6*(cS.v+cS.c3))+cS.c7);

		cS.c1 = 0.07; cS.c2=-0.017; cS.c3 = 44; cS.c4 = 0; cS.c5 = 0; cS.c6 = 0.05; cS.c7 = 1;
		bd=(cS.c1*Math.exp(cS.c2*(cS.v+cS.c3))+cS.c4*(cS.v+cS.c5))/(Math.exp(cS.c6*(cS.v+cS.c3))+cS.c7);

		cS.c1 = 0.012; cS.c2=-0.008; cS.c3 = 28; cS.c4 = 0; cS.c5 = 0; cS.c6 = 0.15; cS.c7 = 1;
		af=(cS.c1*Math.exp(cS.c2*(cS.v+cS.c3))+cS.c4*(cS.v+cS.c5))/(Math.exp(cS.c6*(cS.v+cS.c3))+cS.c7);

		cS.c1 = 0.0065; cS.c2=-0.02; cS.c3 = 30; cS.c4 = 0; cS.c5 = 0; cS.c6=-0.2; cS.c7 = 1;
		bf = (cS.c1*Math.exp(cS.c2*(cS.v+cS.c3))+cS.c4*(cS.v+cS.c5))/(Math.exp(cS.c6*(cS.v+cS.c3))+cS.c7);

		cS.m = (cS.m+cS.timestep*am)/(1+cS.timestep*(am+bm));
		cS.h = (cS.h+cS.timestep*ah)/(1+cS.timestep*(ah+bh));
		cS.j = (cS.j+cS.timestep*aj)/(1+cS.timestep*(aj+bj));
		cS.d = (cS.d+cS.timestep*ad)/(1+cS.timestep*(ad+bd));
		cS.f = (cS.f+cS.timestep*af)/(1+cS.timestep*(af+bf));
		cS.x1 = (cS.x1+cS.timestep*ax1)/(1+cS.timestep*(ax1+bx1));

		es  =  -82.3-13.0287*Math.log(cS.cai);
		cS.ik1 = 0.35*(4*(Math.exp(0.04*(cS.v+85))-1)/(Math.exp(0.08*(cS.v+53))+Math.exp(0.04*(cS.v+53)))+0.2*(cS.v+23)/(1-Math.exp(-0.04*(cS.v+23))));
		cS.ix1 = cS.x1*0.8*(Math.exp(0.04*(cS.v+77))-1)/Math.exp(0.04*(cS.v+35));
		cS.ina = (cS.gna*cS.m*cS.m*cS.m*cS.h*cS.j+cS.gnac)*(cS.v-cS.ena);
		cS.is = cS.gs*cS.d*cS.f*(cS.v-es);

		dcai = -1e-7*cS.is+0.07*(1e-7-cS.cai);
		cS.cai = cS.cai+cS.timestep*dcai;

		cS.istim = _s1s2Stimulus(count, data);
		cS.v = cS.v + cS.timestep * (-(cS.ik1+cS.ix1+cS.ina+cS.is-cS.istim)/cS.cm);		
				 
 		//cal ends
		// sets voltage variables after calculations
		utils.copySpecific(data.calculationSettings, cS,  data.calculationSettings.voltageVariables);
		
		// sets current variables after calculations
		utils.copySpecific(data.calculationSettings, cS, data.calculationSettings.currentVariables);
		
        // iterate the count
        count++;
		
        return data; 
	}
	
	function _getNumIterations(settings) {
		var c   =    settings.calculationSettings;
		var num   =    (((c.s1 * c.ns1) + c.s2) * 1.1) / c.timestep;
		num   =    Math.floor(num);
		return num;    
	} 
	
	function runCalculations(iterations, settings) {
		var state   =   settings,
		data,
		curAnalyzer;     
		//here 'count' is global variable
		count   =    0;
        // need to initialize Cs and CC here as calculationsSettings gets updated dynamicall
        cS   =   _.cloneDeep(settings.calculationSettings);       
		
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
		
	    /** 
	        * Run the calculations the appropriate number of times and 
	        * pass these values to the analyzers using their aggregate
	        * function
		*/  	           
		for (var i = 0; i < numCalculations; i++) {
			data = calculateNext(state);         
			for (curAnalyzer = 0; curAnalyzer < analyzers.length; curAnalyzer++) {
				if (analyzers[curAnalyzer].hasOwnProperty("aggregate")) {
					if( (analyzers[curAnalyzer].analyzerName === "PointBufferAnalyzer" || analyzers[curAnalyzer].analyzerName === "APDAnalyzer")  
					|| (analyzers[curAnalyzer].analyzerName === "S1S2Analyzer" && i >= numCalculations-2)){
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
        //console.dir(settings) ;           	
	}
    
    /* adding analyzers */
    
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
		var stim   =    0;
		var stimuli   =    _getStimuliLocations(settings);
		var c   =    settings.calculationSettings;
		var dur   =    utils.round(c.stimdur / c.timestep);
		var periods   =    stimuli.s1;
		
		for (var i   =    0; i < periods.length; i++) {
			var periodX   =    utils.round(periods[i] / c.timestep);
			if ((count >=    periodX) && (count < periodX + dur)) {
				stim   =    c.stimmag;
			}
		}
		var lastPeriodX   =    utils.round(stimuli.s2 / c.timestep);
		if ((count >=    lastPeriodX) && (count < lastPeriodX + dur)) {
			stim   =    c.stimmag;
		}   
		return stim;
	}
		
	/*
		* This function is responsible for udpating the settings object properties.
		*
	*/
	function updateSettingsWithAnalyzers(settings){
		analyzers.forEach(function(analyzer){
			analyzer.getSettings(settings);
		});
	}
	
	/**
	    * This is the api that is returned by FoxCalculator. It contains the
	    * properties and functions that are accessible from the outside.
	*/
	var api   =    {
		addAnalysisFunction: addAnalysisFunction,
		runCalculations: runCalculations,
		initialize: initialize,            
		updateSettingsWithAnalyzers : updateSettingsWithAnalyzers,
		reset: reset,
	};
	return api;
	
});