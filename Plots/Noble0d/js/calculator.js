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
	var s1;
	var s2;
	var ns1;
	var period;
	var timestep;


	/**
	 * The Calculator is initialized with certain default settings. These will
	 * be overwritten by any settings specified in the initialSettings
	 * parameter.
	 */
	var settings = {};
	settings.initial = {
		v: -80.0,
		m: 0.0,
		h: 1.0,
		n: 0.0,

		ik: 0,
		ina: 0, 
		il: 0,

		cm: 12,
		gan: 0.0,
		gkMod: 1.2,
		ean: -60,
		stimmag: -106,
		stimdur: 2.0,
		gna1: 400.0,
		gna2: 0.14,
		s1: 250,
		s2: 2000,
		ns1: 4,
		period: 500.0,
		timestep: 0.01,
	};


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
		reset(newSettings);
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
		s1 = settings.initial.s1;
		s2 = settings.initial.s2;
		ns1 = settings.initial.ns1;
		period = settings.initial.period;
		timestep = settings.initial.timestep;
		count = 0;
	}


	/**
	 * This gets the points from the current iteration of NobleCalculator.
	 * 
	 * @return {Object} - an object containing the values that the 
	 */
	function getPoints() {
		return {
			v: v,
			m: m,
			h: h,
			n: n,

			ik: ik,
			ina: ina,
			il: il,
		};
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
		for (var i = 0; i < ns1; i++) {
			stimuli.s1.push(i * period + s1);
		}
		var lastPeriod = s1 + (period * (ns1 - 1));
		stimuli.s2 = lastPeriod + s2;
		return stimuli;
	}


	/**
	 * Performs a differential calculations and increments the values that will
	 * be returned by getPoints().
	 */
	function calculateNext() {

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
		var ah = 0.17 * Math.exp((-v - 90)/20);
		var bh = 1 / (Math.exp((-v - 42)/10) + 1);
		var an;
		if (Math.abs(-v - 50) < 0.001) {
			an = 0.001;
		} else {
			an = 0.0001 * (-v - 50) / (Math.exp((-v-50)/10)-1);
		}
		var bn = 0.002 * Math.exp((-v-90)/80);


		// calculate derivatives of gating variables
		var dm = am * (1-m) - bm * m;
		var dh = ah * (1-h) - bh * h;
		var dn = an * (1-n) - bn * n;


		// update gating variables using explicit method
		m += timestep * dm;
		h += timestep * dh;
		n += timestep * dn;

		// calculate potassium current conductance values
		var gk1 = gkMod * Math.exp((-v-90)/50) + 0.015 * Math.exp((v+90)/60);
		var gk2 = gkMod * Math.pow(n, 4);


		// calculate currents
		var ina1 = gna1 * m * m * m * h * (v - 40);
		var ina2 = gna2 * (v - 40);
		var ik1 = gk1 * (v + 100);
		var ik2 = gk2 * (v + 100);
		il = gan * (v - ean);


		// sum the two sodium and the two potassium currents
		ina = ina1 + ina2;
		ik = ik1 + ik2;


		// set stimulus current periodically to be nonzero
		var istim = s1s2Stimulus(count);


		// calculate derivative of voltage 
		var dv = (-ina - ik - il - istim) / cm;


		// update voltage using forward Euler
		v += timestep * dv;


		// iterate the count
		count++;
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
		var dur = utils.round(stimdur / timestep);
		var periods = stimuli.s1;
		for (var i = 0; i < periods.length; i++) {
			var periodX = utils.round(periods[i] / timestep);
			if ((count >= periodX) && (count < periodX + dur)) {
				stim = stimmag;
			}
		}
		var lastPeriodX = utils.round(stimuli.s2 / timestep);
		if ((count >= lastPeriodX) && (count < lastPeriodX + dur)) {
				stim = stimmag;
		}		
		return stim;
	}
 

	/**
	 * This is the api that is returned by NobleCalculator. It contains the
	 * properties and functions that are accessible from the outside.
	 */
	var api = {
		initialize: initialize,
		getPoints: getPoints,
		calculateNext: calculateNext,
		getStimuliLocations: getStimuliLocations,
		reset: reset,
	};
	return api;
});