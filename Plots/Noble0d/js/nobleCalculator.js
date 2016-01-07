/**
 * This module is responsible for performing the differential equation
 * calculation for Noble0d. The object maintains the state of the different
 * variables and returns them after each calculation. These variables can also
 * be reset. 
 */
function NobleCalculator() {

	var v;
	var m;
	var h;
	var n;

	var ik;
	var ina;
	var il;

	var cm;
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
		ean: -60,
		stimmag: -106,
		stimdur: 2.0,
		gna1: 400.0,
		gna2: 0.14,
		s1: 0,
		s2: 2000,
		ns1: 4,
		period: 500.0,
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
		ean = settings.initial.ean;
		stimmag = settings.initial.stimmag;
		stimdur = settings.initial.stimdur;
		gna1 = settings.initial.gna1;
		gna2 = settings.initial.gna2;
		s1 = settings.initial.s1;
		s2 = settings.initial.s2;
		ns1 = settings.initial.ns1;
		period = settings.initial.period;
	}

	var api = {
		settings: settings,
		initialize: initialize,
		reset: reset,
	};
	return api;
}

/**
 * Calculate the values that will be plotted. This is a differential 
 * equation, so the values compound on each other. The values are 
 * stored in 4 different arrays. The calculation is divided into steps.
 * At each step, the function runs a batch of calculations. Once this
 * batch is complete, the values are averaged and stored in the arrays.
 * @return {[type]} [description]
 */
// function calculate() {
// 	vArray = [];
// 	mArray = [];
// 	hArray = [];
// 	nArray = [];

// 	ikArray = [];
// 	inaArray = [];
// 	ilArray = [];

// 	v = -80.0; 
// 	m = 0.0;
// 	h = 1.0;
// 	n = 0.0;

// 	vArray.push(normalize(v, new Point(-80, 40)));
//     mArray.push(m);
//     hArray.push(h);
//     nArray.push(n);
//     ikArray.push(ik);
//     inaArray.push(ina);
//     ilArray.push(il);

// 	var count = 0;
// 	for (var j = 0; j < steps; j++) {	
// 		// var vVal = v;
// 		// var mVal = m;
// 		// var hVal = h;
// 		// var nVal = n;

// 		// var ikVal = ik;
// 		// var inaVal = ina;
// 		// var ilVal = il;
// 		//console.log(steps);
// 		var vAvg = v;
// 		var mAvg = m;
// 		var hAvg = h;
// 		var nAvg = n;

// 		var ikAvg = ik;
// 		var inaAvg = ina;
// 		var ilAvg = il;
// 		for (var i = 0; i < batchSize; i++) {


// 			// calculate alphas and betas for updating gating variables
// 		 	var am;
// 		    if (Math.abs(-v - 48) < 0.001) {
// 		    	am=0.15;
// 		    } else {
// 		    	am=0.1*(-v-48)/(Math.exp((-v-48)/15)-1);
// 		    }
// 			var bm;
// 			if (Math.abs(v + 8) < 0.001) {
// 				bm = 0.6;
// 			}
// 			else {
// 				bm=0.12*(v+8)/(Math.exp((v+8)/5)-1);
// 			}
// 			var ah = 0.17 * Math.exp((-v - 90)/20);
// 			var bh = 1 / (Math.exp((-v - 42)/10) + 1);
// 			var an;
// 			if (Math.abs(-v - 50) < 0.001) {
// 				an = 0.001;
// 			} else {
// 				an = 0.0001 * (-v - 50) / (Math.exp((-v-50)/10)-1);
// 			}
// 			var bn = 0.002 * Math.exp((-v-90)/80);


// 			// calculate derivatives of gating variables
// 			var dm = am * (1-m) - bm * m;
// 			var dh = ah * (1-h) - bh * h;
// 			var dn = an * (1-n) - bn * n;


// 			// update gating variables using explicit method
// 			m += timestep * dm;
// 			h += timestep * dh;
// 			n += timestep * dn;

// 			// calculate potassium current conductance values
// 			// TODO: Make 1.2 an editable value
// 			var gk1 = 1.2 * Math.exp((-v-90)/50) + 0.015 * Math.exp((v+90)/60);
// 			var gk2 = 1.2 * Math.pow(n, 4);


// 			// calculate currents
// 			// TODO: Make gan an editable value
// 			var ina1 = gna1 * m * m * m * h * (v - 40);
// 			var ina2 = gna2 * (v - 40);
// 			var ik1 = gk1 * (v + 100);
// 			var ik2 = gk2 * (v + 100);
// 			il = gan * (v - ean);


// 			// sum the two sodium and the two potassium currents
// 			ina = ina1 + ina2;
// 			ik = ik1 + ik2;


// 			// set stimulus current periodically to be nonzero
// 			var s1Count = round(s1/timestep);
// 			var s2Count = round(s2/timestep);
// 			var periodCount = round(period/timestep);
// 			var stimdurCount = round(stimdur/timestep);
// 			var istim = s1s2Stimulus(count, 
// 									 s1Count, 
// 									 s2Count, 
// 									 periodCount,
// 									 stimdurCount);

// 			// // if (count % round(period/timestep) < round(stimdur / timestep)) {
// 			// // 	istim = stimmag
// 			// // }
// 			// var s1Count = round(s1/timestep);
// 			// var periodCount = round(period/timestep);

// 			// if ((count - s1Count > 0) && 
// 			// 	((count - s1Count) % periodCount === 0)) 
// 			// {
// 			// 	//console.log(count);
// 			// 	//console.log(s1/timestep);
// 			// 	console.log(periodCount);
// 			// 	console.log(s1Count);
// 			// 	istim = stimmag;
// 			// }


// 			// calculate derivative of voltage 
// 			var dv = (-ina - ik - il - istim) / cm;


// 			// update voltage using forward Euler
// 			v += timestep * dv;


// 			mAvg 	+= m;
// 			hAvg 	+= h;
// 			nAvg 	+= n;
// 			vAvg 	+= v;
// 			ikAvg 	+= ik;
// 			inaAvg 	+= ina;
// 			ilAvg 	+= il;

// 			count++;
// 	    }

// 	    mAvg 	/= batchSize;
// 	    hAvg 	/= batchSize;
// 	    nAvg 	/= batchSize;
// 	    vAvg 	/= batchSize;
// 	    ikAvg 	/= batchSize;
// 	    inaAvg 	/= batchSize;
// 	    ilAvg 	/= batchSize;

// 	    vArray.push(normalize(vAvg, new Point(-160, 40)));
// 	    mArray.push(mAvg);
// 	    hArray.push(hAvg);
// 	    nArray.push(nAvg);

// 	    ikArray.push(ikAvg);
// 	    inaArray.push(inaAvg);
// 	    ilArray.push(ilAvg);	
// 	}
// }


// /**
//  * This function calculates the stimulus according to the 
//  * S1-S2 Protocol. 
//  * 
//  * @return {number} - The stimulus that will be applied.
//  */
// function s1s2Stimulus(count, s1, s2, period, stimdur) {
// 	// var s1Count = round(s1/timestep);
// 	// var s2Count = round(s2/timestep);
// 	// var periodCount = round(period/timestep);
// 	// var stimdurCount = round(stimdur/timestep);
// 	var stim = 0;
// 	for (var i = 0; i < ns1; i++) {
// 		var curPeriod = i * period + s1;
// 		var endPeriod = curPeriod + stimdur;
// 		if ((count >= curPeriod) && (count < endPeriod)) {
// 			stim = stimmag;
// 		}
// 	}
// 	if ((count >= s2) && (count < s2 + stimdur)) {
// 		stim = stimmag;
// 	}
// 	return stim;

// }