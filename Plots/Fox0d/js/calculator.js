/**
 * This module is responsible for performing the differential equation
 * calculation for Fox0d. The object maintains the state of the different
 * variables and returns them after each calculation. These variables can also
 * be reset. 
 */

 define(["utility"],
 	function FoxCalculator(utils) {
 		"use strict";

	/**
	 * Displays the current iteration of the count
	 */
	 var count = 0;

	/**
     * This refers the functions that will analyze the 
     * data that is produced
     */

     var analyzers = [];

	/**
	 * These variables are used in the calculations of Barkley.
	 */

	 var gna,
	 gk1,
	 gkr,
	 gks,
	 gkp,
	 gto,
	 gnab,
	 gcab,
	 pca,
	 pcak,
	 prel,
	 pleak,
	 xinakbar,
	 xicahalfbar,
	 xipcabar,
	 rr,
	 tt,
	 ff,
	 acap,
	 csc,
	 eta,
	 xksat,
	 xknaca,
	 xkmfca,
	 xkmk1,
	 xkmna,
	 xkmca,
	 xkmnai,
	 xkmko,
	 xkmpca,
	 xkmup,
	 cmdntot,
	 csqntot,
	 xkmcmdn,
	 xkmcsqn,
	 vup,
	 vmyo,
	 vsr,
	 cnai,
	 cki,
	 cnao,
	 cko,
	 ccao,
	 xstimdur,
	stim, //80
	
	//numerical parameters
	nx,
	s1Start,
	s1,
	s2,
	ns1,
	timestep,

	//initial values
	v,
	ccai,
	ccasr,
	xf,
	xd,
	xm,
	xh,
	xj,
	xfca,
	xkr,
	xks,
	xto,
	yto,

	//currents
	xina,
	xik1,
	xito,
	xikp,
	xinab,
	xiks,
	xica,
	xinaca,
	xipca,
	xicab,
	xicak,
	xinak,
	xikr;

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

	/**
	 * This function initializes the Calculator. It is functionally the same as
	 * the reset function. This wrapper function provides a more semantic way to
	 * present that functionality.
	 * 
	 * @param  {Object} newSettings - the settings that will be used when
	 * calculating Barkley. The object is initialized with default values. These
	 * settings will override any existing ones.
	 */
	 function initialize(newSettings) {		
		//reset(newSettings);
		settings = utils.extend(newSettings);
	}

	/**
	 * This function resets the Calculator with the initial values. If any
	 * values are specified in newSettings, they will overwrite the existing
	 * values in data.calculationSettings.
	 * 
	 * @param  {Object} newSettings - the settings that will be used when
	 * calculating Barkley. The object is initialized with default values. These
	 * settings will override any existing ones.
	 */
	 function reset(newSettings) {

	 	var overwrite = newSettings || {};
	 	for (var attrname in overwrite) { 
	 		settings.initial[attrname] = overwrite[attrname]; 
	 	};

	 	gna = settings.initial.gna;
	 	gk1 = settings.initial.gk1;
	 	gkr = settings.initial.gkr;
	 	gks = settings.initial.gks;
	 	gkp = settings.initial.gkp;
	 	gto = settings.initial.gto;
	 	gnab = settings.initial.gnab;
	 	gcab = settings.initial.gcab;
	 	pca = settings.initial.pca;
	 	pcak = settings.initial.pcak;
	 	prel = settings.initial.prel;
	 	pleak = settings.initial.pleak;
	 	xinakbar = settings.initial.xinakbar;
	 	xicahalfbar = settings.initial.xicahalfbar;
	 	xipcabar = settings.initial.xipcabar;
	 	rr = settings.initial.rr;
	 	tt = settings.initial.tt;
	 	ff = settings.initial.ff;
	 	acap = settings.initial.acap;
	 	csc = settings.initial.csc;
	 	eta = settings.initial.eta;
	 	xksat = settings.initial.xksat;
	 	xknaca = settings.initial.xknaca;
	 	xkmfca = settings.initial.xkmfca;
	 	xkmk1 = settings.initial.xkmk1;
	 	xkmna = settings.initial.xkmna;
	 	xkmca = settings.initial.xkmca;
	 	xkmnai = settings.initial.xkmnai;
	 	xkmko = settings.initial.xkmko;
	 	xkmpca = settings.initial.xkmpca;
	 	xkmup = settings.initial.xkmup;
	 	cmdntot = settings.initial.cmdntot;
	 	csqntot = settings.initial.csqntot;
	 	xkmcmdn = settings.initial.xkmcmdn;
	 	xkmcsqn = settings.initial.xkmcsqn;
	 	vup = settings.initial.vup;
	 	vmyo = settings.initial.vmyo;
	 	vsr = settings.initial.vsr;
	 	cnai = settings.initial.cnai;
	 	cki = settings.initial.cki;
	 	cnao = settings.initial.cnao;
	 	cko = settings.initial.cko;
	 	ccao = settings.initial.ccao;
	 	xstimdur = settings.initial.xstimdur;
	 	stim = settings.initial.stim;	

		//numerical parameters
		nx = settings.initial.nx;
		s1Start = settings.initial.s1Start;
		s1 = settings.initial.s1;
		s2 = settings.initial.s2;
		ns1 = settings.initial.ns1;
		timestep = settings.initial.timestep;
		
		//initial values
		v = settings.initial.v;
		ccai = settings.initial.ccai;
		ccasr = settings.initial.ccasr;
		xf = settings.initial.xf;
		xd = settings.initial.xd;
		xm = settings.initial.xm;
		xh = settings.initial.xh;
		xj = settings.initial.xj;
		xfca = settings.initial.xfca;
		xkr = settings.initial.xkr;
		xks = settings.initial.xks;
		xto = settings.initial.xto;
		yto = settings.initial.yto;

		// currents
		xina = settings.initial.xina;
		xik1 = settings.initial.xik1;
		xito = settings.initial.xito;
		xikp = settings.initial.xikp;
		xinab = settings.initial.xinab;
		xiks = settings.initial.xiks;
		xica = settings.initial.xica;
		xinaca = settings.initial.xinaca;
		xipca = settings.initial.xipca;
		xicab = settings.initial.xicab;
		xicak = settings.initial.xicak;
		xinak = settings.initial.xinak;
		xikr = settings.initial.xikr;

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
	 		ccai: ccai,
	 		ccasr: ccasr,
	 		xf: xf,
	 		xd: xd,
	 		xm: xm,
	 		xh: xh,
	 		xj: xj,
	 		xfca: xfca,
	 		xkr: xkr,
	 		xks: xks,
	 		xto: xto,
	 		yto: yto,

			//currents
			xina: xina,
			xik1: xik1,
			xito: xito,
			xikp: xikp,
			xinab: xinab,
			xiks: xiks,
			xica: xica,
			xinaca: xinaca,
			xipca: xipca,
			xicab: xicab,
			xicak: xicak,
			xinak: xinak,
			xikr: xikr,


		};

		return points;
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

	 	var gna = data.calculationSettings.gna ;
	 	var gk1 = data.calculationSettings.gk1 ;
	 	var gkr = data.calculationSettings.gkr ;
	 	var gks = data.calculationSettings.gks ;
	 	var gkp = data.calculationSettings.gkp ;
	 	var gto = data.calculationSettings.gto ;
	 	var gnab = data.calculationSettings.gnab ;
	 	var gcab = data.calculationSettings.gcab ;
	 	var pca = data.calculationSettings.pca ;
	 	var pcak = data.calculationSettings.pcak ;
	 	var prel = data.calculationSettings.prel ;
	 	var pleak = data.calculationSettings.pleak ;
	 	var xinakbar = data.calculationSettings.xinakbar ;
	 	var xicahalfbar = data.calculationSettings.xicahalfbar ;
	 	var xipcabar = data.calculationSettings.xipcabar ;
	 	var rr = data.calculationSettings.rr ;
	 	var tt = data.calculationSettings.tt ;
	 	var ff = data.calculationSettings.ff ;
	 	var acap = data.calculationSettings.acap ;
	 	var csc = data.calculationSettings.csc ;
	 	var eta = data.calculationSettings.eta ;
	 	var xksat = data.calculationSettings.xksat ;
	 	var xknaca = data.calculationSettings.xknaca ;
	 	var xkmfca = data.calculationSettings.xkmfca ;
	 	var xkmk1 = data.calculationSettings.xkmk1 ;
	 	var xkmna = data.calculationSettings.xkmna ;
	 	var xkmca = data.calculationSettings.xkmca ;
	 	var xkmnai = data.calculationSettings.xkmnai ;
	 	var xkmko = data.calculationSettings.xkmko ;
	 	var xkmpca = data.calculationSettings.xkmpca ;
	 	var xkmup = data.calculationSettings.xkmup ;
	 	var cmdntot = data.calculationSettings.cmdntot ;
	 	var csqntot = data.calculationSettings.csqntot ;
	 	var xkmcmdn = data.calculationSettings.xkmcmdn ;
	 	var xkmcsqn = data.calculationSettings.xkmcsqn ;
	 	var vup = data.calculationSettings.vup ;
	 	var vmyo = data.calculationSettings.vmyo ;
	 	var vsr = data.calculationSettings.vsr ;
	 	var cnai = data.calculationSettings.cnai ;
	 	var cki = data.calculationSettings.cki ;
	 	var cnao = data.calculationSettings.cnao ;
	 	var cko = data.calculationSettings.cko ;
	 	var ccao = data.calculationSettings.ccao ;
	 	var xstimdur = data.calculationSettings.xstimdur ;
	 	var stim = data.calculationSettings.stim ;

		//numerical parameters
		var nx = data.calculationSettings.nx ;
		var s1Start = data.calculationSettings.s1Start ;
		var s1 = data.calculationSettings.s1 ;
		var s2 = data.calculationSettings.s2 ;
		var ns1 = data.calculationSettings.ns1 ;
		var timestep = data.calculationSettings.timestep ;
		
		//initial values
		var v = data.calculationSettings.v ;
		var ccai = data.calculationSettings.ccai ;
		var ccasr = data.calculationSettings.ccasr ;
		var xf = data.calculationSettings.xf ;
		var xd = data.calculationSettings.xd ;
		var xm = data.calculationSettings.xm ;
		var xh = data.calculationSettings.xh ;
		var xj = data.calculationSettings.xj ;
		var xfca = data.calculationSettings.xfca ;
		var xkr = data.calculationSettings.xkr ;
		var xks = data.calculationSettings.xks ;
		var xto = data.calculationSettings.xto ;
		var yto = data.calculationSettings.yto ;

		var xina = data.calculationSettings.xina;
		var xik1 = data.calculationSettings.xik1;
		var xito = data.calculationSettings.xito;
		var xikp = data.calculationSettings.xikp;
		var xinab = data.calculationSettings.xinab;
		var xiks = data.calculationSettings.xiks;
		var xica = data.calculationSettings.xica;
		var xinaca = data.calculationSettings.xinaca;
		var xipca = data.calculationSettings.xipca;
		var xicab = data.calculationSettings.xicab;
		var xicak = data.calculationSettings.xicak;
		var xinak = data.calculationSettings.xinak;
		var xikr = data.calculationSettings.xikr;

		// track the current value of v before iterating.
		var vOld = v;

         //  useful quantities and constants
         var rtof = rr * tt / ff,
         ena = rtof * Math.log(cnao / cnai),
         ek = rtof * Math.log(cko / cki),
         eks = rtof * Math.log((cko + 0.01833 * cnao) / (cki + 0.01833 * cnai)),
         sigma = (Math.exp(cnao / 67.3)-1.) / 7.,
         taufca = 30,
         caidtconst = acap * csc * 0.5 / (ff * vmyo);

		 //  Sodium Current
		 var am = 0.32 * (v + 47.13) / (1-Math.exp(-0.1 * (v + 47.13)));	

		 var bm = 0.08 * Math.exp(-v / 11);

		 var ah = 0.135 * Math.exp((v + 80.) / -6.8);

		 var bh = 7.5 / (1. + Math.exp(-0.1 * (v + 11.)));

		 var aj = 0.175 * Math.exp((v + 100.0) / -23.) / (1. + Math.exp(0.15 * (v + 79.)));

		 var bj = 0.3 / (1. + Math.exp(-0.1 * (v + 32.)));

		 var taum1 = 1 / (am + bm);

		 var xminf1 = taum1 * am;

		 var tauh1 = 1 / (ah + bh);

		 var xhinf1 = tauh1 * ah;

		 var tauj1 = 1 / (aj + bj);

		 var xjinf1 = tauj1 * aj;


		 xm = xminf1 + (xm - xminf1) * Math.exp(-timestep / taum1);

	     xh = xhinf1 + (xh - xhinf1) * Math.exp(-timestep / tauh1);
	     
	     xj = xjinf1 + (xj - xjinf1) * Math.exp(-timestep / tauj1);
	     
	     xina = gna * xm * xm * xm * xh * xj * (v - ena);

		 //   inward rectifier k +  current
		 xik1 = gk1 * cko / (cko + xkmk1) * (v - ek) / (2. + Math.exp(1.62 / rtof * (v - ek)));	    

		 //   rapid component of the delayed rectifier k +  current
		 var xrinf1 = 1 / (1. + Math.exp(-2.182 - 0.1819 * v));

		 var taukr1 = 43. + 1 / (Math.exp(-5.495 + 0.1691 * v) + Math.exp(-7.677 - 0.0128 * v));

		 xkr = xrinf1 + (xkr - xrinf1) * Math.exp(-timestep / taukr1);

		 var xikrcoeff = gkr * Math.sqrt(cko) * 0.5 * (v - ek) / (1. + 2.5 * Math.exp(0.1 * (v + 28.0)));

		 xikr = xkr * xikrcoeff;


	     //   slow component of the delayed rectifier k +  current
	     var xsinf1 = 1 / (1. + Math.exp((v - 16.0) / -13.6));
	     var tauks1 = 1 / ((0.0000719 * (v - 10.) / (1.-Math.exp(-0.148 * (v - 10.)))) + (0.000131 * (v - 10.) / (Math.exp(0.0687 * (v - 10)) - 1)));
	     xks = xsinf1 + (xks - xsinf1) * Math.exp(-timestep / tauks1);
	     xiks = gks * xks * xks * (v - eks);

		 //   transient outward k +  current
		 var axto = 0.04516 * Math.exp(0.03577 * v);

		 var bxto = 0.0989 * Math.exp(-0.06237 * v);
		 var ayto = 0.005415 * Math.exp((v + 33.5) / -5.) / (1. + 0.051335 * Math.exp((v + 33.5) / -5.));
		 var byto = 0.005415 * Math.exp((v + 33.5) / 5.) / (1. + 0.051335 * Math.exp((v + 33.5) / 5.));
		 var tauxto1 = 1 / (axto + bxto);
		 var xtoinf1 = axto * tauxto1;
		 var tauyto1 = 1 / (ayto + byto);
		 var ytoinf1 = ayto * tauyto1;
		 xto = xtoinf1 + (xto - xtoinf1) * Math.exp(-timestep / tauxto1);
		 yto = ytoinf1 + (yto - ytoinf1) * Math.exp(-timestep / tauyto1);
		 xito = gto * xto * yto * (v - ek);

		 //   plateau k +  current
		 xikp = gkp * (v - ek) / (1. + Math.exp((7.488 - v) / 5.98));

		 //   na + -k +  pump current
		 xinak = xinakbar * (cko / (cko + xkmko)) / (1. + Math.pow((xkmnai / cnai),1.5)) / (1. + 0.1245 * Math.exp(-0.1 * v / rtof) + 0.0365 * sigma * Math.exp(-v / rtof));

		 //   na +  / ca2 +  exchange current
		 var xinacat1 = (xknaca / (Math.pow(xkmna,3) + Math.pow(cnao,3))) / (xkmca + ccao) / (1. + xksat * Math.exp(v * (eta - 1.) / rtof)) * (Math.exp(v * eta / rtof) * (Math.pow(cnai,3) * ccao));
		 var xinacat2 = (xknaca / (Math.pow(xkmna,3) + Math.pow(cnao,3))) / (xkmca + ccao) / (1. + xksat * Math.exp(v * (eta - 1.) / rtof)) * (Math.exp(v * (eta - 1) / rtof) * Math.pow(cnao,3));
		 xinaca = xinacat1 - xinacat2 * ccai;

		 //   sarcolemmal pump current
		 xipca = xipcabar * ccai / (xkmpca + ccai);

		 //   ca2 +  background current
		 var ecat = 0.5 * rtof * Math.log(ccao / ccai);
		 xicab = gcab * (v - ecat);

		 //   na +  background current
		 xinab = gnab * (v - ena);

		 //   L-type ca2 +  channel current
		 var finf1 = 1 / (1. + Math.exp((v + 12.5) / 5.));
		 var tauf1 = 30. + 200 / (1. + Math.exp((v + 20.) / 9.5));
		 var dinf1 = 1 / (1. + Math.exp((v + 10.) / -6.24));
		 var taud1 = 1 / ((0.25 * Math.exp(-0.01 * v) / (1. + Math.exp(-0.07 * v))) + (0.07 * Math.exp(-0.05 * (v + 40.))) / (1. + Math.exp(0.05 * (v + 40.))));

		 var xicabart1 =  pca / csc * 4.0 * v * ff / rtof / (Math.exp(2 * v / rtof)-1.) * Math.exp(2 * v / rtof);
		 var xicabart2 =  pca / csc * 4.0 * v * ff / rtof / (Math.exp(2 * v / rtof)-1.) * 0.341 * ccao;

		 var xicabar =  xicabart1 * ccai-xicabart2;
		 xf =  finf1 + (xf - finf1) * Math.exp(-timestep / tauf1);
		 xd =  dinf1 + (xd - dinf1) * Math.exp(-timestep / taud1);
		 var fcainf1 =  1 / (1. + Math.pow((ccai / xkmfca),3));
		 xfca =  fcainf1 + (xfca-fcainf1) * Math.exp(-timestep / taufca);
		 xica =  xicabar * xf * xd * xfca;

		 var xicakcoeff =  pcak / csc * (1000 * v * ff / rtof) * (cki * Math.exp(v / rtof) - cko) / (Math.exp(v / rtof) - 1);
		 xicak =  xicakcoeff * xf * xd * xfca / (1. + xicabar / xicahalfbar);

		 //   calcium handling
		 var gamma  =  1 / (1 + Math.pow((2000.0 / ccasr),3));
		 var xjrelcoeff  =   prel / (1. + 1.65 * Math.exp(v / 20.));
		 var xjrel  =   xjrelcoeff * xf * xd * xfca * (gamma * ccasr - ccai);
		 var xjleak  =   pleak * (ccasr - ccai);
		 var xjup  =   vup / (1 + Math.pow((xkmup / ccai),2));
		 var bit =   1 / (1 + (cmdntot * xkmcmdn / (Math.pow((xkmcmdn + ccai),2))));
		 var dcaidt = bit * (xjrel + xjleak - xjup - caidtconst * (xica + xicab + xipca - 2.0 * xinaca));

		 ccai =  ccai + timestep * dcaidt;
		 var bsr =  1 / (1. + csqntot * xkmcsqn / (Math.pow((xkmcsqn + ccasr),2)));
		 var dcasrdt =  bsr * (xjup - xjleak - xjrel) * vmyo / vsr;
		 ccasr =  ccasr + timestep * dcasrdt;

		 var xstim;
		 xstim =  _s1s2Stimulus(count, data);

		 v =  v - timestep * (xina + xik1 + xito + xikp + xinab + xiks + xica + xinaca + xipca + xicab + xicak + xinak + xikr + xstim);
		 
		 //   check vOld against the threshold
		 checkThreshold(vOld, v, threshold);

		// iterate the count
		count++;

		data.calculationSettings.v = v;		
		data.calculationSettings.ccasr = ccasr;
		data.calculationSettings.ccai = ccai;
		data.calculationSettings.xfca = xfca;
		data.calculationSettings.xd = xd;
		data.calculationSettings.xf = xf;
		data.calculationSettings.yto = yto;
		data.calculationSettings.xto = xto;
		data.calculationSettings.xks = xks;
		data.calculationSettings.xkr = xkr;
		data.calculationSettings.xj = xj;
		data.calculationSettings.xh = xh;
		data.calculationSettings.xm = xm;
		

		//updating currents
		data.calculationSettings.xina = xina;
		data.calculationSettings.xik1 = xik1;
		data.calculationSettings.xito = xito;
		data.calculationSettings.xikp = xikp;
		data.calculationSettings.xinab = xinab;
		data.calculationSettings.xiks = xiks;
		data.calculationSettings.xica = xica;
		data.calculationSettings.xinaca = xinaca;
		data.calculationSettings.xipca = xipca;
		data.calculationSettings.xicab = xicab;
		data.calculationSettings.xicak = xicak;
		data.calculationSettings.xinak = xinak;
		data.calculationSettings.xikr = xikr;
		
		return data;
	}


	function _getNumIterations(settings) {
		var c = settings.calculationSettings;
		var num = (((c.s1 * c.ns1) + c.s2) * 1.1) / c.timestep;
		num = Math.floor(num);
		return num;    
	}

	function runCalculations(iterations, settings) {
		var state = settings; 
		var curAnalyzer; 
		count = 0;


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
         	var data = calculateNext(state);          
         	for (curAnalyzer = 0; curAnalyzer < analyzers.length; curAnalyzer++) {
         		if (analyzers[curAnalyzer].hasOwnProperty("aggregate")) {
         			analyzers[curAnalyzer].aggregate(data);
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
	 	var dur = utils.round(c.xstimdur / c.timestep);
	 	var periods = stimuli.s1;
	 	for (var i = 0; i < periods.length; i++) {
	 		var periodX = utils.round(periods[i] / c.timestep);
	 		if ((count >= periodX) && (count < periodX + dur)) {
	 			stim = c.stim;
	 		}
	 	}
	 	var lastPeriodX = utils.round(stimuli.s2 / c.timestep);
	 	if ((count >= lastPeriodX) && (count < lastPeriodX + dur)) {
	 		stim = c.stim;
	 	}		
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
	 var api = {
	 	addAnalysisFunction: addAnalysisFunction,
	 	runCalculations: runCalculations,
	 	timestep: settings.timestep,
	 	initialize: initialize,
	 	getPoints: getPoints,
	 	calculateNext: calculateNext,
	 	updateSettingsWithAnalyzers : updateSettingsWithAnalyzers,
		//getStimuliLocations: getStimuliLocations,
		reset: reset,
	};
	return api;
});
