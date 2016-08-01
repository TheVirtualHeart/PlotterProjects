/**
 * This module is responsible for performing the differential equation
 * calculation for Mahajan. The object maintains the state of the different
 * variables and returns them after each calculation. These variables can also
 * be reset. 
 */

 define(["utility"],
  function MahajanCalculator(utils) {
 		"use strict";

		/**
	 * Displays the current iteration of the count
	 */
	 var count = 0,
	 analyzers = [], /** This refers the functions that will analyze the data that is produced */
	 settings = Object.create(null),
	 cS, // cS is for calculationSettings
     cC; // cC is for constant used in calculations


    /**
	 * This function initializes the Calculator. It is functionally the same as
	 * the reset function. This wrapper function provides a more semantic way to
	 * present that functionality.
	 * 
	 * @param  {Object} newSettings
	 */
	 function initialize(newSettings) {		
		//reset(newSettings);
		settings 		 =    utils.extend(newSettings);		
		cS 	 =   _.cloneDeep(settings.calculationSettings);	
		cC 	 =   new CalcConstants(settings.calculationSettings);
	}

	/**
	 * This function initializes the Calculator. It is functionally the same as
	 * the reset function. This wrapper function provides a more semantic way to
	 * present that functionality.
	 * 
	 * @param  {Object} newSettings
	 */
	 function initialize(newSettings) {		
		//reset(newSettings);
		settings 		 =    utils.extend(newSettings);		
		cS 	 =   _.cloneDeep(settings.calculationSettings);	
		cC 	 =   new CalcConstants(settings.calculationSettings);
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
		 * Performs a differential calculations and increments the values that will
		 * be returned by getPoints().
		 */
	function calculateNext(data) {


		// sets voltage variables after calculations
	 	data.calculationSettings.voltageVariables.forEach(function (item){
           cS[item]  =    data.calculationSettings[item];
	 	});

	 	// sets current variables after calculations
	 	data.calculationSettings.currentVariables.forEach(function (item){
           cS[item]  =    data.calculationSettings[item];
	 	});

		// sets current variables after calculations
	 	data.calculationSettings.additionalVariables.forEach(function (item){
           cS[item]  =    data.calculationSettings[item];
	 	});	 	

	 	var alpham, betam, alphah, betah, alphaj, betaj, tau_X1, tau_X2, tau_Xr, 
	 	alphaK1, betaK1, gksx, za, factor1, factor, csm, rxa, alpha, beta, fca, s1, xk1, s2, s2t, xk3, xk3t, prv,
	 	tau_ca, tauba, tauca, poix, xk6, xk5, xk6t, xk5t, xk4, xk4t, dc2, dc1,
	 	dxi1ca, dxi2ca, dxi1ba, dxi2ba, xnai3, zw3, aloss, yz1, yz2, yz3, yz4, zw8,
	 	bpx, spx, mempx, sarpx, bufferi, buffers, dcs, dci, dcj, dcjp, bv, Qr,
	 	spark_rate, dir, dcp, xrr, dv, ena, eks,

	 	//tables
	 	minft_t, expotaumt_t, hinft_t, expotauht_t, jinft_t, expotaujt_t,
	 	x1inft_t, x2inft_t, expotauxt1_t, expotauxt2_t, xrinft_t, rkrt_t, expotaurt_t,
        fnakt_t, nacanut_t, nacanum1t_t, expzcat_t, expvzcat_t, expgrr_t, expp_t, expk3_t,
        recov_t, expr_t, exps_t, expsr_t, xtoslowinft_t, ytoslowinft_t, rslowinft_t,
        tau_XTO_slow, tau_YTO_slow, tau_R_slow, expotauxtoslowt_t, expotauytoslowt_t,
        xtofastinft_t, ytofastinft_t, tau_XTO_fast, tau_YTO_fast, expotauxtofastt_t,
        expotauytofastt_t, k1inft_t  ;

	 	// table setup

	 	// Na gates
        alpham = (Math.abs(cS.v + 47.13) > 1e-4) ? 
        				0.32 * (cS.v + 47.13) / (1.0 - Math.exp(-0.1 * (cS.v + 47.13))): 3.2;
        
         betam = 0.08 * Math.exp((-1.0 * cS.v) / 11.0);
         minft_t = alpham / (alpham + betam);
         expotaumt_t = Math.exp(-cS.timestep * (alpham + betam));

        if(cS.v > -40.0){
            alphah = 0.0;
            betah = 1.0/(0.13 * (1.0 + Math.exp((cS.v + 10.66)/(-11.1))));
            alphaj = 0.0;
            betaj = 0.3 * Math.exp(-2.535e-7 * cS.v)/(1.0 + Math.exp(-0.1 * (cS.v + 32.0)));
        }
         else{
            alphah = 0.135 * Math.exp((80.0  +  cS.v)/(-6.8));
            betah = 3.56 * Math.exp(0.079 * cS.v) + 3.1e5 * Math.exp(0.35 * cS.v);
            alphaj = (-1.2714e5 * Math.exp(0.2444 * cS.v) 
                   - 3.474e-5 * Math.exp(-0.04391 * cS.v)) 
                   * (cS.v + 37.78)/(1. + Math.exp(0.311 * (cS.v + 79.23)));
            betaj = 0.1212 * Math.exp( -0.01052 * cS.v) /
                   (1. + Math.exp( -0.1378 * (cS.v  +  40.14)));
         }
         hinft_t = alphah/(alphah + betah);
         expotauht_t = Math.exp(-cS.timestep * (alphah + betah));
         jinft_t = alphaj/(alphaj + betaj);
         expotaujt_t = Math.exp(-cS.timestep * (alphaj + betaj));
		

         //  Slow Potasium gates
		x1inft_t = 1.0 / (1.0 + Math.exp(-1.0  *  (cS.v - 1.5)  /  16.7));
	    x2inft_t = x1inft_t;
        tau_X1 = Math.abs(cS.v + 30.0) > 1e-4 ? 
        		1.0 / (7.19e-5 * (cS.v  +  30.0) / 
                (1.0 - Math.exp(-0.148 * (cS.v  +  30.0)))
                 + 1.31e-4 * (cS.v + 30.0) / (-1.0 +  Math.exp(0.0687 * (cS.v + 30.0))))
         		: 417.946;
         
	   	tau_X2 = 4 * tau_X1;
        expotauxt1_t = Math.exp(-cS.timestep / tau_X1);
	    expotauxt2_t = Math.exp(-cS.timestep / tau_X2);

	    
		 //  Rapid Potasium gates
 
         xrinft_t = 1.0 / (1.0 + Math.exp(-1.0 * (cS.v + 50.0) / 7.5));
         if(Math.abs(cS.v + 10.0) < 1e-4)
            tau_Xr = 74.165;
         else if(Math.abs(cS.v + 7.0) < 1e-4)
            tau_Xr = 68.599;
         else
            tau_Xr = 1.0 / (0.00138  *  (cS.v  +  7.0) / 
                (1.0 - Math.exp(-0.123  *  (cS.v  +  7.0)))  +  0.00061 
                 *  (cS.v  +  10.0) / (Math.exp(0.145  *  (cS.v  +  10.0)) - 1.0));  
         
         rkrt_t = 1.0 / (1.0  +  Math.exp((cS.v  +  33.0) / 22.4));
         expotaurt_t = Math.exp(-cS.timestep / tau_Xr);

         //Na-K pump gate
		//        ikpt  =  1.0/(1.0  +  Math.exp((7.488 - cS.v)/5.98))
         fnakt_t =  1.0/(1.0  +  0.1245  *  Math.exp(-0.1  *  cS.v * cC.fort) 
                 +  0.0365  *  cC.sigma  *  Math.exp(-1.0 * cS.v * cC.fort));
		//Na-Ca exchange flux	  
         nacanut_t = Math.exp(cS.nue * cS.v * cC.fort);
         nacanum1t_t = Math.exp((cS.nue - 1.0) * cS.v * cC.fort);
		//ica
         expzcat_t = Math.exp(cS.zca  *  cS.v  * cC.fort);
         expvzcat_t = Math.abs(cS.v) > 1e-4 ? cS.v/(expzcat_t-1.0) : 13.3541;
        
         

		//ryanodine-receptor gate
	    expgrr_t =  Math.exp(-0.05  *  (cS.v  +  30.0))/(1. + 
         						Math.exp(-0.05 * (cS.v  +  30.0)));

		//markov exponentials
	
	    expp_t  =  1.0/(1.0 + Math.exp(-(cS.v / 8)));
	    expk3_t  =  1.0/(1.0 + Math.exp(-(cS.v  +  40.0)) / 3);
	    recov_t = 10. + 4954. * Math.exp(cS.v / 15.6);
	    expr_t  =  Math.exp(-(cS.v + 40.0)) / 4;
	    exps_t  =  1.0/(1.0 + Math.exp(-(cS.v  +  40.0) / 11.3));
		//Dyadic space

	    expsr_t =  Math.exp(-0.3576 * (cS.v  +  30.0))/(1. + 
        				Math.exp(-0.3576 * (cS.v  +  30.0)));

			
		
//Slow  and fast potasium gates(Ito)

         xtoslowinft_t  =  1.0 / (1.0  +  Math.exp((cS.v  +  3.0)/(-15.0)));
         ytoslowinft_t  =  1.0 / (1.0  +  Math.exp((cS.v  +  33.5)/10.0));    
         rslowinft_t  =   ytoslowinft_t;

         tau_XTO_slow  =  9.0 / (1.0  +  Math.exp((cS.v  +  3.0)/15.0))  +  0.5;
         tau_YTO_slow  =  3000.0 / (1.0  +  Math.exp((cS.v  +  60.0)/10.0))  +  30.0;
//        tau_R_slow  =  2800.0 / (1.0  +  Math.exp((cS.v  +  60.0)/10.0))  +  220.0;

         expotauxtoslowt_t = Math.exp(-cS.timestep / tau_XTO_slow);
         expotauytoslowt_t = Math.exp(-cS.timestep / tau_YTO_slow);
//        expotaurslowt_t = Math.exp(-cS.timestep/tau_R_slow)

         xtofastinft_t  =  xtoslowinft_t;
         ytofastinft_t  =   ytoslowinft_t;
	     tau_XTO_fast  =  3.5 *  Math.exp(-1.0 * (cS.v / 30.0)
	   									  *  (cS.v / 30.0))  +  1.5;
         tau_YTO_fast  =  20.0 * (ytoslowinft_t + 1.0);
         expotauxtofastt_t = Math.exp(-cS.timestep/tau_XTO_fast);
         expotauytofastt_t = Math.exp(-cS.timestep/tau_YTO_fast);


		// Inward Rectifier potasium gates

         alphaK1 = 1.02/(1.0  +  Math.exp(0.2385  *  (cS.v - cC.ek - 59.215)));
         betaK1 = (0.49124  *  Math.exp(0.08032  *  (cS.v - cC.ek  +  5.476))
		              +  Math.exp(0.06175  *  (cS.v - cC.ek - 594.31)))/
		             (1.0  +  Math.exp(-0.5143  *  (cS.v - cC.ek  +  4.753)));
         k1inft_t = alphaK1/(alphaK1  +  betaK1);

      	// Time Loop Starts.

      	// compute reversal potentials
      	ena  =  (1./cC.fort) * Math.log(cS.xnao/cS.xnai);
		eks = cC.rtof * Math.log((cS.xko + cS.prnak * cS.xnao) / (cS.xki + cS.prnak * cS.xnai));

		cS.istim = _s1s2Stimulus(count,data);

		// INa
        cS.m = minft_t - (minft_t - cS.m) * expotaumt_t;
        cS.h = hinft_t - (hinft_t - cS.h) * expotauht_t;
        cS.j = jinft_t - (jinft_t - cS.j) * expotaujt_t;
        cS.ina = cS.gna * cS.m * cS.m * cS.m * cS.h * cS.j * (cS.v - ena);
        
// Se tiene que comprobar si hace falta este factor
//            junctionINaTransportRate  =  junctionINa / EquivalentsNa 
//     &            *  AFConversion  *  1e-6 

		// IKs
        cS.xs1 = x1inft_t - (x1inft_t - cS.xs1) * expotauxt1_t;
		cS.xs2 = x2inft_t - (x2inft_t - cS.xs2) * expotauxt2_t;
        gksx = 0.433 * (1 + 0.8 / (1 + 0.125 / Math.pow(cS.ci,3))); //(0.5 * 0.5 * 0.5)/(ci * ci * ci)));
	    cS.iks = cS.gks * gksx * cS.xs1 * cS.xs2 * (cS.v - eks);

		// ICa
		
		za = cS.v * cS.zca * cC.fort;
		factor1 = cS.zca * cS.zca * cS.pca * cC.fort * cS.xf;
		factor = cS.v * factor1;
		csm = cS.cs * 1e-3;
		rxa = (Math.abs(za) < 0.001) ? 
           	factor1 * (csm * expzcat_t - 0.341 * (cS.cao))/(2.0 * cC.fort) :
		 		factor * (csm * expzcat_t - 0.341 * (cS.cao))/(expzcat_t - 1.0)
	        	
	//		  rxa = (zCa * zCa) * pca * xf * cC.fort * expvzcat(iv1) * 
	//     &	          (cs * 1e-3 * expzcat(iv1)-0.341 * cao)

	// Markovian current
	//	
		alpha = expp_t / cS.taupo;
		beta = (1.0 - expp_t) / cS.taupo;
	    
		fca = 1.0 / (1.0 + Math.pow((cS.cat / cS.cp), 3));

		s1 = 0.0182688 * fca;

		xk1 = 0.024168 * fca;
		
		s2 = s1 * (cS.r1 / cS.r2) * (cS.xk2 / xk1);
		s2t = cS.s1t * (cS.r1 / cS.r2) * (cS.xk2t / cS.xk1t);

	//	vx = -40
	//	sx = 3.0
	//	poi = 1.0/(1.0 + exp(-(v-vx)/sx))
		 
		xk3 = (1.0 - expk3_t) / cS.tau3;
		xk3t = xk3;
				
	//	vy = -40.0
	//	sy = 4.0
	//	prv = 1.0-1.0/(1.0 + exp(-(v-vy)/sy))
	//	prv = expr(iv1)/(1.0 + expr(iv1)
		prv = 1.0 - 1.0 / (1.0 + expr_t);

	//  Different values than the ones in the paper

		tau_ca = cS.tca / (1.0 + Math.pow((cS.cp/cS.cpt),4));
		
	//#ifdef ___FORTHREED
	//	tauca = (recov_t - tau_ca) * prv + tau_ca + 1
	//#else
		tauca = (recov_t - tau_ca) * prv + tau_ca;
	//#endif
		tauba = (recov_t - 450.0) * prv + 450.0;

		
	//	vyr = -40.0
	//	syr = 11.32
		poix = exps_t;

	// I think they are wrong. In the paper is not the same
		xk6 = fca * poix / tauca;
		xk5 = (1.0 - poix) / tauca;
	//	xk6 = fca * (1.0-poix)/tauca
	//	xk5 = poix/tauca

	//	xk6t = (1.0-poix)/tauba
	//	xk5t = poix/tauba
		xk6t = poix / tauba;
		xk5t = (1.0 - poix) / tauba;

		
		xk4 = xk3 * (alpha / beta) * (xk1 / cS.xk2) * (xk5 / xk6);
		xk4t = xk3t * (alpha / beta) * (cS.xk1t / cS.xk2t) * (xk5t / xk6t);

		cS.po = 1.0 - cS.xi1ca - cS.xi2ca - cS.xi1ba - cS.xi2ba - cS.c1 - cS.c2;

		dc2 = beta * cS.c1 + xk5 * cS.xi2ca + xk5t * cS.xi2ba - (xk6 + xk6t + alpha) * cS.c2
		dc1 = alpha * cS.c2 + cS.xk2 * cS.xi1ca + cS.xk2t * cS.xi1ba + cS.r2 * cS.po -
	         	(beta + cS.r1 + cS.xk1t + xk1) * cS.c1;

		dxi1ca = xk1 * cS.c1 + xk4 * cS.xi2ca + s1 * cS.po - (xk3 + cS.xk2 + s2) * cS.xi1ca;
		dxi2ca = xk3 * cS.xi1ca + xk6 * cS.c2 - (xk5 + xk4) * cS.xi2ca;

		dxi1ba = cS.xk1t * cS.c1 + xk4t * cS.xi2ba + cS.s1t * cS.po - (xk3t + cS.xk2t + s2t) * cS.xi1ba;
		dxi2ba = xk3t * cS.xi1ba + xk6t * cS.c2 - (xk5t + xk4t) * cS.xi2ba;


		//  IKr
	    cS.xr = xrinft_t - (xrinft_t - cS.xr) * expotaurt_t;

	    cS.ikr = cS.gkr * cS.xr * cC.gki * rkrt_t * (cS.v - cC.ek);

	//  IK1    
	    cS.ik1  =  cS.gkix  * cC.gki * k1inft_t * (cS.v - cC.ek);

	//  ITO_slow
	//  paper does not include full gate for R_slow, only uses infinity value
	    cS.xtos = xtoslowinft_t - (xtoslowinft_t - cS.xtos) * expotauxtoslowt_t;
	    cS.ytos = ytoslowinft_t - (ytoslowinft_t - cS.ytos) * expotauytoslowt_t;

	//             R_slow = rslowinft(iv1)
	//      &           -(rslowinft(iv1)-R_slow) * expotaurslowt(iv1)

	    cS.itos  =  cS.gtos * cS.xtos * (cS.ytos + 0.5 * rslowinft_t) * (cS.v - cC.ek);
	//  use R_slow gate
	//      &            *  (ytos  +  0.5  *  R_slow)  *  (cS.v - EK)
	//  use R_slow infinity value
	            // 

	//  ITO_fast
	    cS.xtof = xtofastinft_t - (xtofastinft_t - cS.xtof) * expotauxtofastt_t;
	    cS.ytof = ytofastinft_t - (ytofastinft_t - cS.ytof) * expotauytofastt_t;

	    cS.itof = cS.gtof * cS.xtof * cS.ytof * (cS.v - cC.ek);


	//  whole ITO (if needed)
	    cS.ito  =  cS.itos +  cS.itof;     

	//  INaK
	 	cS.inak  =  cS.gnak * fnakt_t * (1. / (1. + (cS.xkmnai / cS.xnai)))
				 * cS.xko / (cS.xko + cS.xkmko);

	//  INaCa
	// 
		xnai3 =  Math.pow(cS.xnai,3);//xnai * xnai * xnai
		zw3 = (xnai3 * cS.cao * nacanut_t - cC.xnao3 * cS.cs *  1e-3
	      			* nacanum1t_t)/(1. + 0.2 * nacanum1t_t);
	// 	xkdna = 0.3 ! micro M
		aloss = 1.0 / (1.0 + Math.pow((cS.xkdna/cS.cs),3));
		
		yz1 = cS.xmcao * xnai3 + cC.xmnao3 * cS.cs *  1e-3;
		yz2 = cC.xmnai3 * cS.cao * (1.0 + cS.cs * 1e-3 / cS.xmcai);
		yz3 = cS.xmcai * cC.xnao3 * (1.0 + xnai3 / cC.xmnai3);
		yz4 = xnai3 * cS.cao + cC.xnao3 * cS.cs *  1e-3; 
		zw8 = yz1 + yz2 + yz3 + yz4;
		cS.inacaq = cS.gnaca * aloss * zw3 / zw8;

// ----- SERCA2a uptake current ------------------------------------
// 
		cS.iup = cS.vup * cS.ci * cS.ci / (cS.ci * cS.ci  +  cS.xup * cS.xup);

// ---------leak from the SR--------------------------
// 
	
		cS.ileak = cS.gleak * (cS.cj * cS.cj / (cS.cj * cS.cj + 50.0 * 50.0))
        	* (cS.cj * 16.667 - cS.ci); // vsr/vcell = 0.06

	        
	// ---------- buffer dynamics in the myoplasm -----------------------
	//  buffering to calmodulin and SR are instantaneous, while buffering to
	//  Troponin C is time dependent.These are important to have reasonable
	//  Ca transient.Note: we have buffering in the submembrane space and 
	//  the myoplasm.


		bpx = cS.bcal * cS.xkcal / ((cS.xkcal + cS.ci) * (cS.xkcal + cS.ci));
		spx = cS.srmax * cS.srkd / ((cS.srkd + cS.ci) * (cS.srkd + cS.ci));
		mempx = cS.bmem * cS.kmem / ((cS.kmem + cS.ci) * (cS.kmem + cS.ci));
		sarpx = cS.bsar * cS.ksar / ((cS.ksar + cS.ci) * (cS.ksar + cS.ci));
		bufferi = 1.0/(1.0 + bpx + spx + mempx + sarpx);

		bpx = cS.bcal * cS.xkcal / ((cS.xkcal + cS.cs) * (cS.xkcal + cS.cs));
		spx = cS.srmax * cS.srkd / ((cS.srkd + cS.cs) * (cS.srkd + cS.cs));
		mempx = cS.bmem * cS.kmem / ((cS.kmem + cS.cs) * (cS.kmem + cS.cs));
		sarpx = cS.bsar * cS.ksar / ((cS.ksar + cS.cs) * (cS.ksar + cS.cs));
		buffers = 1.0 / (1.0 + bpx + spx + mempx + sarpx);


		dcs = buffers * (50.0 * (cS.xir - cS.idif - cS.icaq + cS.inacaq) - cS.bs);
		dci = bufferi * (cS.idif - cS.iup + cS.ileak - cS.bi);
	// SR load dynamics
		dcj = -cS.xir + cS.iup - cS.ileak; // SR load dynamics
	// NSR-JSR relaxation dynamics
		dcjp = (cS.cj - cS.cjp) / cS.taua; // NSR-JSR relaxation dynamics 

	//  --------- release-load functional dependence ----------------
	//
		
		bv = (cS.cstar - 50.) - cS.av * cS.cstar;

		if (cS.cjp < 50)
		Qr = 0.0;
		else
			if (cS.cjp > 50.0 && cS.cjp < cS.cstar)
				Qr = cS.cjp - 50.0;
			else
				Qr = cS.av * cS.cjp + bv;

	// Yo no lo habia anyadido no esta en el articulo
		Qr = cS.cj * Qr / cS.cstar;
		
	// Ryanodine receptor gate 

		
		

		spark_rate = cS.g * cS.po * Math.abs(rxa) * expgrr_t; //N's

	//	dir  =  spark_rate * cj * Qr/cstar-xir * (1-taur * dcj/cj)/taur
		dir  = spark_rate * Qr - cS.xir * (1 - cS.taur * dcj / cS.cj) / cS.taur;


	// ----------- dyadic junction dynamics SR------------------------

	// 
	//   xirp
	//	jsr = grel * cS.po * Qr * abs(rxa) * expsr(iv1)
		cS.jsr = cS.grel * cS.po * Qr * Math.abs(rxa) * expsr_t;
	//   xicap
		cS.jca = cS.po * cS.gdyad * Math.abs(rxa);
		dcp  =  cS.jsr + cS.jca - (cS.cp - cS.cs) / cS.taups;
		

	//----------- Equations for Ca cycling -------------------------
		cS.idif = (cS.cs - cS.ci) / cS.taus // diffusion from submembrane to myoplasm
	 
	//	// Troponin kinetics

		cS.bi = cS.kon * cS.ci * (cS.btrop - cS.tropi) - cS.koff * cS.tropi;
		cS.bs = cS.kon * cS.cs * (cS.btrop - cS.trops) - cS.koff * cS.trops;

		cS.icaq = cS.gca * cS.po * rxa; //Ca current in micro M/ms

		dcs = buffers * (50.0 * (cS.xir - cS.idif - cS.icaq + cS.inacaq)- cS.bs);
		dci = bufferi * (cS.idif - cS.iup + cS.ileak - cS.bi);
		dcj = -cS.xir + cS.iup - cS.ileak; //SR load dynamics 
		dcjp = (cS.cj - cS.cjp) / cS.taua; //NSR-JSR relaxation dynamics 
		
		cS.c1 = cS.c1 + dc1 * cS.timestep;
		cS.c2 = cS.c2 + dc2 * cS.timestep;
		cS.xi1ca = cS.xi1ca + dxi1ca * cS.timestep;
		cS.xi1ba = cS.xi1ba + dxi1ba * cS.timestep;
		cS.xi2ca = cS.xi2ca + dxi2ca * cS.timestep;
		cS.xi2ba = cS.xi2ba + dxi2ba * cS.timestep;


		cS.cp = cS.cp +  dcp * cS.timestep;
		cS.cs = cS.cs +  dcs * cS.timestep;
		cS.ci = cS.ci +  dci * cS.timestep;
		cS.cj = cS.cj +  dcj * cS.timestep;
		cS.xir = cS.xir + dir * cS.timestep;
		cS.cjp = cS.cjp + dcjp * cS.timestep;

		cS.tropi = cS.tropi + cS.bi * cS.timestep;
		cS.trops = cS.trops + cS.bs * cS.timestep;

	////-------convert ion flow to current---------
	    cS.inaca = cS.wca * cS.inacaq;
		cS.ica = 2.0 * cS.wca * cS.icaq;
	////--------sodium dynamics -------------------------
		
		xrr = (1.0 / cS.wca)/1000.0; //note: sodium is in m molar so need to divide by 1000
		cS.xnai = cS.xnai + (-xrr * (cS.ina + 3.0 * cS.inak + 3.0 * cS.inaca)) * cS.timestep;

	//// --------	dV/cS.timestep ------------------------------------
	//	Itotal = -(ina + ik1 + ikr + iks + ito + inaca + ica + inak-Istim)

	// voltage
        dv = -(cS.ina + cS.iks + cS.ica + cS.ikr + cS.ik1 + cS.ito  
                +  cS.inak +  cS.inaca - cS.istim);
        
        cS.v = cS.v + cS.timestep * dv;
			

	 	// sets voltage variables after calculations
        data.calculationSettings.voltageVariables.forEach(function (item){
           data.calculationSettings[item]  =   cS[item];
        });

        // sets current variables after calculations
        data.calculationSettings.currentVariables.forEach(function (item){
           data.calculationSettings[item]  =   cS[item];
        });

        // sets current variables after calculations
	 	data.calculationSettings.additionalVariables.forEach(function (item){
           data.calculationSettings[item]  =   cS[item];
	 	});

		// iterate the count
		count++;

		return data;
	}

	function CalcConstants(c){

		// nice values to precompute
		this.fort = c.xf / (c.xxr * c.temp);
		this.rtof = 1 / this.fort;
		this.ek = this.rtof * Math.log(c.xko / c.xki);
		this.gki = (Math.sqrt(c.xko / 5.4));
      	this.sigma = (Math.exp(c.xnao / 67.3) - 1.0) / 7.0;
      	this.xnao3 = Math.pow(c.xnao,3);   //xnao*xnao*xnao
      	this.xmnai3 = Math.pow(c.xmnai,3); //xmNai*xmNai*xmNai
      	this.xmnao3 = Math.pow(c.xmnao,3); //xmNao*xmNao*xmNao
    }


    function _getNumIterations(settings) {
	 	var c   =    settings.calculationSettings;
	 	var num   =    (((c.s1 * c.ns1) + c.s2) * 1.1) / c.timestep;
	 	num   =    Math.floor(num);
	 	return num;    
	}

	function runCalculations(iterations, settings) {
	 	var state   =    settings; 
	 	var curAnalyzer; 
	 	
        count   =    0;
        
        // need to update change in parameter values in page level cS object.
        state.calculationSettings.parameters.forEach(function (item){
           cS[item] = state.calculationSettings[item];
        });


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
	 	var dur = utils.round(c.stimdur / c.timestep);
	 	var periods = stimuli.s1;
	 	for (var i = 0; i < periods.length; i++) {
	 		var periodX = utils.round(periods[i] / c.timestep);
	 		if ((count >= periodX) && (count < periodX + dur)) {
	 			stim = c.istimmag;
	 		}
	 	}
	 	var lastPeriodX = utils.round(stimuli.s2 / c.timestep);
	 	if ((count >= lastPeriodX) && (count < lastPeriodX + dur)) {
	 		stim = c.istimmag;
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
	 * This is the api that is returned by MahajanCalculator. It contains the
	 * properties and functions that are accessible from the outside.
	 */
	 var api = {
	 	addAnalysisFunction: addAnalysisFunction,
	 	runCalculations: runCalculations,
	 	initialize: initialize,
	 	calculateNext: calculateNext,
	 	updateSettingsWithAnalyzers : updateSettingsWithAnalyzers,
		reset: reset,
	};
	return api;
});