/**
 * This module is responsible for performing the differential equation
 * calculation for Noble0d. The object maintains the state of the different
 * variables and returns them after each calculation. These variables can also
 * be reset. 
 */
define(["utility"],
function NobleCalculator(utils) {
	"use strict";

	/**
	 * Displays the current iteration of the count
	 */
	var count = 0;


    /**
     * This refers the functions that will analyze the 
     * data that is produced
     */
    var analysisFunctions = [];
    
    
	/**
	 * These variables are used in the calculations of Noble.
	 */
	var v;
	var m;
	var h;
	var n;

	var ik;
	var ina;
	var il;

	var cm;
	var gkMod;
	var gan;
	var ean;
	var stimmag;
	var stimdur;
	var gna1;
	var gna2;
	var s1Start;
	var s2;
	var ns1;
	var s1;
	var timestep;


	/**
	 * These variables are used to calculate the APD values
	 */
	var vOld;
	var threshold;
	var upTime;
	var downTime;


	/**
	 * The Calculator is initialized with certain default settings. These will
	 * be overwritten by any settings specified in the initialSettings
	 * parameter.
	 */
	var settings = Object.create(null);
	// settings.initial = {
	// 	v: -80.0,
	// 	m: 0.0,
	// 	h: 1.0,
	// 	n: 0.0,

	// 	ik: 0,
	// 	ina: 0, 
	// 	il: 0,

	// 	cm: 12,
	// 	gan: 0.0,
	// 	gkMod: 1.2,
	// 	ean: -60,
	// 	stimmag: -106,
	// 	stimdur: 2.0,
	// 	gna1: 400.0,
	// 	gna2: 0.14,
	// 	s1Start: 250,
	// 	s2: 2000,
	// 	ns1: 4,
	// 	period: 500.0,
	// 	timestep: 0.01,

	// 	vOld: null,
	// 	threshold: -50.0,		// -69, if that's not catching, -57

	// };


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
		//reset(newSettings);
        console.log(newSettings);
        settings = utils.extend(newSettings);
        console.log(settings);
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
		v = settings.initial.v;
		m = settings.initial.m;
		h = settings.initial.h;
		n = settings.initial.n;

		ik = settings.initial.ik;
		ina = settings.initial.ina;
		il = settings.initial.il;

		cm = settings.initial.cm;
		gan = settings.initial.gan;
		gkMod = settings.initial.gkMod;
		ean = settings.initial.ean;
		stimmag = settings.initial.stimmag;
		stimdur = settings.initial.stimdur;
		gna1 = settings.initial.gna1;
		gna2 = settings.initial.gna2;
		s1Start = settings.initial.s1Start;
		s2 = settings.initial.s2;
		ns1 = settings.initial.ns1;
		s1 = settings.initial.s1;
		timestep = settings.initial.timestep;

		vOld = settings.initial.vOld;
		threshold = settings.initial.threshold;
		count = 0;
	}


	/**
	 * This gets the points from the current iteration of NobleCalculator. If
	 * the calculation crossed a threshold, add that value to the points array.
	 * 
	 * @return {Object} - an object containing the values that the 
	 */
	function getPoints() {
		var points = {
			v: v,
			m: m,
			h: h,
			n: n,

			ik: ik,
			ina: ina,
			il: il,
		};
		if (!!upTime) {
			points.upTime = upTime;
		}
		if (!!downTime) {
			points.downTime = downTime;
		}
		return points;
	}


	/**
	 * Calculate the locations of the different stimuli according to the S1-S2
	 * Protocol.
	 * @return {Object} - A JavaScript Object containing an array of s1 values
	 * and a single value for s2.
	 */
	function getStimuliLocations() {
		var stimuli = {};
		stimuli.s1 = [];
		for (var i = 0; i < settings.ns1; i++) {
			stimuli.s1.push(i * settings.s1 + settings.s1Start);
		}
		var lastPeriod = settings.s1Start + (settings.s1 * (settings.ns1 - 1));
		stimuli.s2 = lastPeriod + settings.s2;
        console.log(stimuli);
		return stimuli;
	}


	/**
	 * Performs a differential calculations and increments the values that will
	 * be returned by getPoints().
	 */
	function calculateNext(data) {
        console.log("data");
        console.log(data);
        var v = data.v;
        var m = data.m;
        var n = data.n;
        var h = data.h;
        var ik = data.ik;
        var il = data.il;
        var ina = data.ina;
        var timestep = data.timestep;
        var gna1 = data.gna1;
        var gna2 = data.gna2;
        var gk1 = data.gk1;
        var gk2 = data.gk2;
        var gkMod = data.gkMod;
        var gan = data.gan;
        var ean = data.ean;
        var ns1 = data.ns1;
        var s1 = data.s1;
        var s2 = data.s2;
        var cm = data.cm;
        
        
        
        console.log(v);
        console.log(m);
        console.log(h);
        console.log(n);
        console.log(ik);
        console.log(il);
        console.log(ina);
        
		// track the current value of v before iterating.
		var vOld = v;


		// calculate alphas and betas for updating gating variables
	 	var am;
	    if (Math.abs(-v - 48) < 0.001) {
	    	am=0.15;
	    } else {
	    	am=0.1*(-v-48)/(Math.exp((-v-48)/15)-1);
	    }
        
		var bm;
		if (Math.abs(v + 8) < 0.001) {
			bm = 0.6;
		}
		else {
			bm=0.12*(v+8)/(Math.exp((v+8)/5)-1);
		}
        console.log(am);
        console.log(bm);
        
		var ah = 0.17 * Math.exp((-v - 90)/20);
		var bh = 1 / (Math.exp((-v - 42)/10) + 1);
        console.log(ah);
        console.log(bh);
        
		var an;
		if (Math.abs(-v - 50) < 0.001) {
			an = 0.001;
		} else {
			an = 0.0001 * (-v - 50) / (Math.exp((-v-50)/10)-1);
		}
		var bn = 0.002 * Math.exp((-v-90)/80);
        
        console.log(an);
        console.log(bn);


		// calculate derivatives of gating variables
		var dm = am * (1-m) - bm * m;
		var dh = ah * (1-h) - bh * h;
		var dn = an * (1-n) - bn * n;
        
        console.log(dm);
        console.log(dh);
        console.log(dn);


        console.log(timestep);
		// update gating variables using explicit method
		m += timestep * dm;
		h += timestep * dh;
		n += timestep * dn;

		// calculate potassium current conductance values
		var gk1 = gkMod * Math.exp((-v-90)/50) + 0.015 * Math.exp((v+90)/60);
		var gk2 = gkMod * Math.pow(n, 4);


		// calculate currents
		var ina1 = gna1 * m * m * m * h * (v - 40);
        console.log("gna1 " + gna1);
        
        console.log("ina1 " + ina1);
		var ina2 = gna2 * (v - 40);
        console.log("ina2 " + ina2);
		var ik1 = gk1 * (v + 100);
        
        console.log("ik1 " + ik1);
		var ik2 = gk2 * (v + 100);
        
        console.log("ik2 " + ik2);
		il = gan * (v - ean);


		// sum the two sodium and the two potassium currents
		ina = ina1 + ina2;
		ik = ik1 + ik2;
        console.log("ina " + ina);
        console.log("ik " + ik);
        console.log("il " + il);


		// set stimulus current periodically to be nonzero
		var istim = s1s2Stimulus(count);


		// calculate derivative of voltage 
		var dv = (-ina - ik - il - istim) / cm;
        console.log("dv " + dv);


		// update voltage using forward Euler
		v += timestep * dv;


		// check vOld against the threshold
		checkThreshold(vOld, v, threshold);


		// iterate the count
		count++;
        
        data.v = v;
        data.m = m;
        data.n = n;
        data.h = h;
        data.ik = ik;
        data.ina = ina;
        data.il = il;
        
        // var obj = {
        //     v: v,
        //     h: h,
        //     n: n,
        //     m: m,
        //     ik: ik,
        //     ina: ina,
        //     il: il
        // }
        // console.log("object");
        // console.log(obj);
        return data;
	}


    function runCalculations(iterations) {
        var state = utils.extend(settings);
        for (var i = 0; i < iterations; i++) {
            var data = calculateNext(state);
            for (var j = 0; j < analysisFunctions.length; j++) {
                analysisFunctions[j](data);
            }
        }
    }
    
    
    function addAnalysisFunction(fn) {
        analysisFunctions.push(fn);
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
	function s1s2Stimulus(count) {
		var stim = 0;
		var stimuli = getStimuliLocations();
		var dur = utils.round(settings.stimdur / settings.timestep);
		var periods = stimuli.s1;
		for (var i = 0; i < periods.length; i++) {
			var periodX = utils.round(periods[i] / settings.timestep);
			if ((count >= periodX) && (count < periodX + dur)) {
				stim = settings.stimmag;
			}
		}
		var lastPeriodX = utils.round(stimuli.s2 / settings.timestep);
		if ((count >= lastPeriodX) && (count < lastPeriodX + dur)) {
				stim = settings.stimmag;
		}		
        console.log(stim);
		return stim;
	}


	/**
	 * Check to see if the v has crossed the threshold during the last 
	 * calculation. If so, calculate the location of the crossover using
	 * linear interpolation, and save that value in either the upTimes array or
	 * the downTimes array.
	 */
	function checkThreshold() {

		upTime = null;
		downTime = null;

		// don't work out linear yet
		if ( (vOld < threshold) && (v >= threshold) ) {
			upTime = true;
		}
		else if ( (vOld > threshold) && (v <= threshold) ) {
			downTime = true;
		}

	}
 

	/**
	 * This is the api that is returned by NobleCalculator. It contains the
	 * properties and functions that are accessible from the outside.
	 */
	var api = {
        addAnalysisFunction: addAnalysisFunction,
        runCalculations: runCalculations,
		timestep: settings.timestep,
		initialize: initialize,
		getPoints: getPoints,
		calculateNext: calculateNext,
		getStimuliLocations: getStimuliLocations,
		reset: reset,
	};
	return api;
});