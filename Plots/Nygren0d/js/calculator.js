/**
 * This module is responsible for performing the differential equation
 * calculation for Nygren. The object maintains the state of the different
 * variables and returns them after each calculation. These variables can also
 * be reset. 
 */

 define(["utility"],
  function NygrenCalculator(utils) {
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

		var xmbar_t, otaum_t,	xhbar_t,	otauh1_t,
	 	otauh2_t, 	dlbar_t, 	otaudl_t, 	flbar_t, 	
	 	otaufl1_t, 	otaufl2_t, 	rbar_t, 	otaur_t,
	 	sbar_t, 	otaus_t, 	rsusbar_t, 	otaursus_t,
	 	ssusbar_t, 	otaussus_t,	xnbar_t, 	otaun_t,
	 	xpabar_t, 	otaupa_t, 	xpi_t,		xnacoeff_t, 
	 	xcalcoeff_t,xnaca1_t,	xnaca2_t,
        //calcium dependant variables.
	 	xcapt_t, ccaipow,
        vmek,	xk1v_t,	ckcpow,	ccadpow,	vmena, // for tables.
        fca, 	// L-type calcium current
		cnai3,	cnac3,	cnai15, //pump and exchanger currents
		docdt,	dotcdt,	dotmgcdt,	dotmgmgdt,// intracellular ca2 +  buffering
        ena, ek, eca, xstim, // reversal potentials
        //ca2 +  handling by sarcoplasmic reticulum
        docalsedt,  ract,   rinact , 
        xup,    xtr,    temp, xrel,
        dccareldt,dccaupdt, xidi,   dodt; 


	 	//tables which are only dependant on v.
	 	xmbar_t = 1.0 / (1.0 + Math.exp((cS.v + 27.12) / (-8.21)));
        otaum_t = 1.0 / (0.042 * Math.exp(-Math.pow(((cS.v + 25.57) / 28.8),2)) + 0.024);
        xhbar_t = 1.0 / (1.0 + Math.exp((cS.v + 63.6) / 5.3));
        otauh1_t = 1.0 / (30.0 / (1.0 + Math.exp((cS.v + 35.1) / 3.2)) + 0.3);
        otauh2_t = 1.0 / (120.0 / (1.0 + Math.exp((cS.v + 35.1) / 3.2)) + 3.0);
        dlbar_t = 1.0 / (1.0 + Math.exp((cS.v + 9.0) / (-5.8)));
        otaudl_t = 1.0 / (2.7 * Math.exp(-Math.pow(((cS.v + 35.0) / 30.0),2)) + 2.0);
        flbar_t = 1.0 / (1.0 + Math.exp((cS.v + 27.4) / 7.1));
        otaufl1_t = 1.0 / (161.0 * Math.exp(-Math.pow(((cS.v + 40.0) / 14.4),2)) + 10.0);
        otaufl2_t = 1.0 / (1332.3 * Math.exp(-Math.pow(((cS.v + 40.0) / 14.2),2)) + 62.6);
        rbar_t = 1.0 / (1.0 + Math.exp((cS.v-1.0) / (-11.0)));
        otaur_t = 1.0 / (3.5 * Math.exp(-Math.pow((cS.v / 30.0),2) + 1.5));
        sbar_t = 1.0 / (1.0 + Math.exp((cS.v + 40.5) / 11.5)); 
        otaus_t = 1.0 / (481.2 * Math.exp(-Math.pow(((cS.v + 52.45) / 14.97),2)) + 14.14);
        rsusbar_t = 1.0 / (1.0 + Math.exp((cS.v + 4.3) / (-8.0)));
        otaursus_t = 1.0 / (9.0 / (1.0 + Math.exp((cS.v + 5.0) / 12.0)) + 0.5);
        ssusbar_t = 0.4 / (1.0 + Math.exp((cS.v + 20.0) / 10.0)) + 0.6;
        otaussus_t = 1.0 / (47.0 / (1.0 + Math.exp((cS.v + 60.0) / 10.0)) + 300.0);
        xnbar_t = 1.0 / (1.0 + Math.exp((cS.v-19.9) / (-12.7)));
        otaun_t = 1.0 / (700.0 + 400.0 * Math.exp(-Math.pow(((cS.v-20.0) / 20.0),2)));
        xpabar_t = 1.0 / (1.0 + Math.exp((cS.v + 15.0) / (-6.0)));
        otaupa_t = 1.0 / (31.18 + 217.18 * Math.exp(-Math.pow(((cS.v + 20.1376) / 22.1996),2)));
        xpi_t = 1.0 / (1.0 + Math.exp((cS.v + 55.0) / 24.0));

       // if(cS.v != 0)
        xnacoeff_t = cS.pna * cS.v * (cS.xxf) / cC.rtof / (Math.exp(cS.v / cC.rtof)-1.0);
        // else
       // xnacoeff_t = cS.pna * cS.v * (cS.xxf) / cC.rtof / (Math.exp(cS.v + 0.001 / cC.rtof)-1.0);

        xcalcoeff_t = cS.gcal * (cS.v - cS.ecaapp);
        xnaca1_t = cS.xknaca * Math.exp(cS.gamma * cS.v / cC.rtof);
        xnaca2_t = cS.xknaca * Math.exp((cS.gamma - 1.0) * cS.v / cC.rtof);

        

        // reversal potentials
		ena = cC.rtof * Math.log(cS.cnac / cS.cnai);
        ek = cC.rtof * Math.log(cS.ckc / cS.cki);
        eca = 0.5 * cC.rtof * Math.log(cS.ccac / cS.ccai);
        
		xstim = _s1s2Stimulus(count, data);

        
        // ca dependant 
		// cailo = .00001,caihi = .01001,ncai = 10000 
		// dcaitable = (caihi-cailo) / ncai
		// ccaii = cailo + i * dcaitable
        
        // ccaii = .00001 + count * ( .01001 - .00001) / 10000;
        xcapt_t = cS.xicap * (cS.ccai / (cS.ccai + cS.xkcap));
        ccaipow = Math.pow((cS.ccai / (cS.ccai + cS.xkreli)),4);        

        

        vmek = cS.v - ek;
        xk1v_t = cS.gk1 * vmek / (1.0 + Math.exp((1.5 * (vmek + 3.6)) / cC.rtof));

        
        ckcpow = Math.pow( cS.ckc, 0.4457 );

        ccadpow = Math.pow((cS.ccad / (cS.ccad + cS.xkreld)),4);

        vmena = cS.v - ena;
        cS.xna1_t = (Math.abs(vmena) > 1e-3) ? Math.exp(vmena / cC.rtof)-1.0 : cS.xna1_t;
        
        
		// sodium current
        cS.xm  = cS.xm + cS.timestep * (xmbar_t - cS.xm) * otaum_t;
        cS.xh1 = cS.xh1 + cS.timestep * (xhbar_t - cS.xh1) * otauh1_t;
        cS.xh2 = cS.xh2 + cS.timestep * (xhbar_t - cS.xh2) * otauh2_t;

        cS.xna = xnacoeff_t * cS.xm * cS.xm * cS.xm * cS.cnac * 
 	          (0.9 * cS.xh1 + 0.1 * cS.xh2) * cS.xna1_t; 
 	   
		// L-type calcium current
        fca = cS.ccad / (cS.ccad + cS.xkca);
        cS.xdl = cS.xdl + cS.timestep * (dlbar_t - cS.xdl) * otaudl_t;
        cS.xfl1 = cS.xfl1 + cS.timestep * (flbar_t - cS.xfl1) * otaufl1_t;
        cS.xfl2 = cS.xfl2 + cS.timestep * (flbar_t - cS.xfl2) * otaufl2_t;

        cS.xcal = xcalcoeff_t * cS.xdl * (fca * cS.xfl1 + (1.0 - fca) * cS.xfl2);

        // transient and sustained outward k +  currents
        cS.xr = cS.xr + cS.timestep * (rbar_t-cS.xr) * otaur_t;
        cS.xs = cS.xs + cS.timestep * (sbar_t-cS.xs) * otaus_t;

        cS.rsus =  cS.rsus + cS.timestep * (rsusbar_t -  cS.rsus) * otaursus_t;
        cS.ssus =  cS.ssus + cS.timestep * (ssusbar_t -  cS.ssus) * otaussus_t;

        cS.xt = cS.gt * cS.xr * cS.xs * (cS.v - ek);
        cS.xsus = cS.gsus *  cS.rsus *  cS.ssus * (cS.v - ek);
      
	// delayed rectifier k +  currents
        cS.xn = cS.xn + cS.timestep * (xnbar_t - cS.xn) * otaun_t;
        cS.xpa = cS.xpa + cS.timestep * (xpabar_t - cS.xpa) * otaupa_t;

        cS.xks = cS.gks * cS.xn * (cS.v - ek);
        cS.xkr = cS.gkr * cS.xpa * xpi_t * (cS.v - ek);


	// indexvmek indexckc = _t ?
	// inward rectifier k +  current
        // if(indexckc >= 0 && indexckc <= nckct)

        cS.xk1 = xk1v_t * ckcpow;
        
        // else
        //    xk1 = xk1v(indexvmek) * Math.pow(cS.ckc,(0.4457));
			
	//background inward currents
        
        cS.xbna = cS.gbna * (cS.v - ena);
        cS.xbca = cS.gbca * (cS.v - eca);

	//pump and exchanger currents
        cnai3 = Math.pow(cS.cnai,3);
        cnac3 = Math.pow(cS.cnac,3);
        cnai15 = Math.sqrt(cnai3);

        cS.xnak = cS.xinak * cS.ckc * cnai15 * (cS.v + 150.0) / 
               ((cS.ckc + cS.xknakk) * (cnai15 + cC.xknakna15) * (cS.v + 200.0));
        
               
//         xnak = xinak * (ckc(i) / (ckc(i) + xknakk))
//    &               * (cnai15 / (cnai15 + xknakna15))
//    &               * (v(i) + 150.0) / (v(i) + 200.0)

        cS.xcap = xcapt_t;

        cS.xnaca = (cnai3 * cS.ccac * xnaca1_t - cnac3 * cS.ccai * xnaca2_t) / 
 					(1.0 + cS.dnaca * (cnac3 * cS.ccai + cnai3 * cS.ccac));

		
	// intracellular ca2 +  buffering

        docdt = 200.0 * cS.ccai * (1.0 - cS.xoc) - 0.476 * cS.xoc;
        dotcdt = 78.4 * cS.ccai * (1.0 - cS.xotc)-0.392 * cS.xotc;
        dotmgcdt = 200.0 * cS.ccai * (1.0-cS.xotmgc-cS.xotmgmg)
            		- 0.0066 * cS.xotmgc;
        dotmgmgdt = 2.0 * cS.cmgi * (1.0-cS.xotmgc-cS.xotmgmg)
            		-0.666 * cS.xotmgmg;
        
        cS.xoc = cS.xoc + cS.timestep * docdt;
        cS.xotc = cS.xotc + cS.timestep * dotcdt;
        cS.xotmgc = cS.xotmgc + cS.timestep * dotmgcdt;
        cS.xotmgmg = cS.xotmgmg + cS.timestep * dotmgmgdt;

	// left space ion concentrations
        // if(ifixed.eq.0) then
           // cS.cnac = cS.cnac + cS.timestep * ((cS.cnab - cS.cnac) * cC.otauna
           //      + (cS.xna + cS.xbna + 3.0 * cS.xnak + 3.0 * cS.xnaca + phinaen) * (cC.ovolcf));
           	
           // cS.ckc = cS.ckc + cS.timestep * ((cS.ckb-cS.ckc) * cC.otauk
           //      + (cS.xt + cS.xsus + cS.xk1 + cS.xks + cS.xkr - 2.0 * cS.xnak) * (cC.ovolcf));
           // cS.ccac = cS.ccac + cS.timestep * ((cS.ccab-cS.ccac) * cC.otauca
           //      + (cS.xcal + cS.xbca + cS.xcap-2.0 * cS.xnaca) * 0.5 * (cC.ovolcf));
        	

        // endif

	//ca2 +  handling by sarcoplasmic reticulum
        docalsedt = 0.48 *  cS.ccarel * (1.0- cS.xocalse)-0.4 * cS.xocalse;
         cS.xocalse =  cS.xocalse + cS.timestep * docalsedt;

        ract = 0.2038 * (ccaipow + ccadpow)
        rinact = 0.03396 + 0.3396 * (ccaipow)

        cS.xf1 = cS.xf1 + cS.timestep * (cS.rrecov * (1.0-cS.xf1-cS.xf2)-ract * cS.xf1);
        cS.xf2 = cS.xf2 + cS.timestep * (ract * cS.xf1 - rinact * cS.xf2);

        xup = cS.xiup * (cS.ccai - cC.xkxcs2srca * cS.ccaup) / 
            (cS.ccai + cS.xkcyca + cC.xkxcssrca * (cS.ccaup + cS.xksrca));

        xtr = (cS.ccaup - cS.ccarel) * 2.0 * cS.xxf * cS.volrel * cC.otautr;
        temp = cS.xf2 / (cS.xf2 + 0.25);
        xrel = cS.alpharel * (temp * temp) * ( cS.ccarel - cS.ccai);

        docalsedt = 0.48 *  cS.ccarel * (1.0 - cS.xocalse) - 0.4 *  cS.xocalse;
        dccareldt = (xtr - xrel) * cC.o2volrelf - 31.0 * docalsedt;
        dccaupdt = (xup-xtr) * cC.o2volupf;

         cS.ccarel =  cS.ccarel + cS.timestep * dccareldt;

 //        if ( cS.ccarel.lt.0.0) write(6, * ) 'CALCIUM-REL NEGATIVE ',
 // &            cS.ccarel,i,ntime,ntime * cS.timestep
        cS.ccaup = cS.ccaup + cS.timestep * dccaupdt;
 //        if (cS.ccaup.lt.0.0) write(6, * ) 'CALCIUM-UP NEGATIVE ',
 // &           cS.ccaup,i,ntime,ntime * cS.timestep

// diadic space components
        xidi = (cS.ccad - cS.ccai) * 2.0 * cS.xxf * cC.vold * cC.otaudi;
        
        cS.ccad = cS.ccad - cS.timestep * (cS.xcal + xidi) * cC.o2voldf;
        
 //        if (cS.ccad.lt.0.0) write(6, * ) 'CALCIUM-D NEGATIVE ',
 // &           cS.ccad,i,ntime,ntime * cS.timestep

// may need to update the dotcdt, dotmgcdt, docdt with new O vals
// here now recomputing them
        docdt = 200.0 * cS.ccai * (1.0-cS.xoc)-0.476 * cS.xoc;
        dotcdt = 78.4 * cS.ccai * (1.0-cS.xotc)-0.392 * cS.xotc;
        dotmgcdt = 200.0 * cS.ccai * (1.0-cS.xotmgc-cS.xotmgmg)- 0.0066 * cS.xotmgc;

// trying this here for now
        dodt = 0.08 * dotcdt + 0.16 * dotmgcdt + 0.045 * docdt;

// intracellular ion concentrations
        cS.ccai = cS.ccai - cS.timestep * (-xidi + cS.xbca + cS.xcap - 2.0 
        	* cS.xnaca + xup - xrel) * 0.5 * cC.ovolif - cS.timestep * dodt;
 		
 //        if(ifixed.eq.0) then
 //           cnai(i) = cnai(i)
 // &              - cS.timestep * (xna + xbna + 3.0 * xnak + 3.0 * xnaca + phinaen)
 // &               * ovolif
 //           cki(i) = cki(i)- cS.timestep * (xt + xsus + xk1 + xks + xkr-2.0 * xnak) * ovolif
 //        endif

 		cS.v = cS.v - cC.dtocm * (cS.xna + cS.xcal + cS.xt + cS.xsus +
                cS.xkr + cS.xks + cS.xk1 + cS.xbna + cS.xbca + cS.xnak + 
                cS.xcap + cS.xnaca - xstim);

 		// sets voltage variables after calculations
        utils.copySpecific(data.calculationSettings, cS,  data.calculationSettings.voltageVariables);
        
        // sets current variables after calculations
        utils.copySpecific(data.calculationSettings, cS, data.calculationSettings.currentVariables);
    
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
 	 
		this.rtof = c.xxr * c.xxt / c.xxf;  
      	this.fort = 1.0 / this.rtof;
      	this.vold = c.voldfrac * c.voli;
      	this.xknakna15 = Math.pow(c.xknakna,1.5);
      	this.otauna = 1.0 / c.tauna;
      	this.otauk = 1.0 / c.tauk;
      	this.otauca = 1.0 / c.tauca;
      	this.ovolcf = 1.0 / (c.volc * c.xxf);
      	this.o2volupf = 1.0 / (2.0 * c.volup * c.xxf);
      	this.o2volrelf = 1.0 / (2.0 * c.volrel * c.xxf);
      	this.o2voldf = 1.0 / (2.0 * this.vold * c.xxf);
      	this.ovolif = 1.0 / (c.voli * c.xxf);
      	this.otautr = 1.0 / c.tautr;
      	this.otaudi = 1.0 / c.taudi;
      	this.xkxcs2srca = 9.6e-5;    
      	this.xkxcssrca = 0.00024;
      	this.dtocm = cS.timestep / c.cm
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
	 	var dur = utils.round(c.xstimdur / c.timestep);
	 	var periods = stimuli.s1;
	 	for (var i = 0; i < periods.length; i++) {
	 		var periodX = utils.round(periods[i] / c.timestep);
	 		if ((count >= periodX) && (count < periodX + dur)) {
	 			stim = c.xstimamp;
	 		}
	 	}
	 	var lastPeriodX = utils.round(stimuli.s2 / c.timestep);
	 	if ((count >= lastPeriodX) && (count < lastPeriodX + dur)) {
	 		stim = c.xstimamp;
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
