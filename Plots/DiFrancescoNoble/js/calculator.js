    

/**
* This module is responsible for performing the differential equation
* calculation for DiFrancesco. The object maintains the state of the different
* variables and returns them after each calculation. These variables can also
* be reset. 
*/

define(["utility"],
function DiFrancescoCalculator(utils) {
    "use strict";
    
    /**Displays the current iteration of the count */
    var count   =    0, 
    /**This refers the functions that will analyze the data that is produced*/          
    analyzers   =    [],   
    settings   =    Object.create(null),
    
    //  cS is for calculationSettings
    cS ,
    
    //  cC is for constant used in calculations 
    cC;
    
    /**
        * This function initializes the Calculator. It is functionally the same as
        * the reset function. This wrapper function provides a more semantic way to
        * present that functionality.
        * 
        * @param  {Object} newSettings
    */
    function initialize(newSettings) {               
        settings =    utils.extend(newSettings);        
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
     * Performs a differential calculations and increments the values
    */
    function calculateNext(data) {
        
		var yinft_t, exptauyt_t, xinft_t, exptauxt_t, ikcoefft_t, rinft_t, exptaurt_t, itoterm1t_t, itoterm2t_t, itoterm3t_t,
		inacaterm1t_t, inacaterm2t_t, minft_t, exptaumt_t, hinft_t, exptauht_t, dinft_t, exptaudt_t, finft_t, exptauft_t,
		isicaterm1t_t, isikterm1t_t, isikterm2t_t, pinft_t, exptaupt_t, ik1term1t_t, 

		adum, bdum, ena, ek, emh, eca, vmek, yinf, exptauy, ikc, inac, ionc, xinf, exptaux, ikcoeff, ik1term1, rinf, exptaur,
		itoterm1, itoterm2, itoterm3, icac, inacaterm1, inacaterm2, nai3, dum2, dum3, dum4, minf, exptaum, hinf, exptauh, 
		dinf, exptaud, finf, exptauf, tvar, inf, isicaterm1, isikterm1, isikterm2, imk, imna, imca, iion,
		factor, derv, pinf, exptaup, iup, itr, irel, dcaup, dcarel, dcai, dna, dk  ;

		adum = 0.05 * Math.exp(-0.067 * (cS.v + 42.));
        bdum = (Math.abs(cS.v + 42.) <= 1e-6) ? 2.5 : (cS.v + 42.) / (1.- Math.exp(-0.2 * (cS.v + 42.)));
        cS.tau = adum + bdum;
        yinft_t = adum / cS.tau;
        exptauyt_t = Math.exp(-cS.timestep * cS.tau);
        adum = 0.5 * Math.exp(0.0826 * (cS.v + 50.)) / (1.0 + Math.exp(0.057 * (cS.v + 50.)));
        bdum = 1.3 * Math.exp(-0.06 * (cS.v + 20.)) / (1. + Math.exp(-0.04 * (cS.v + 20.)));
        cS.tau = adum + bdum;
        xinft_t = adum / cS.tau;
        exptauxt_t = Math.exp(-cS.timestep * cS.tau);
        ikcoefft_t = Math.exp(-cS.v * cC.fort);
        adum = 0.033 * Math.exp(-cS.v / 17.);
        bdum = 33. / (1. + Math.exp(-(cS.v + 10.) / 8.));
        cS.tau = adum + bdum;
        rinft_t = adum / cS.tau;
        exptaurt_t = Math.exp(-cS.timestep * cS.tau);
        itoterm1t_t = (Math.abs(cS.v + 10.) <= (10e-6)) ? 5. : (cS.v + 10.) / (1.-Math.exp(-2. * (cS.v + 10.)));
        itoterm2t_t = Math.exp(.02 * cS.v);
        itoterm3t_t = Math.exp(-.02 * cS.v);
        inacaterm1t_t = Math.exp(cS.gamma * cS.v * cC.fort);
        inacaterm2t_t = Math.exp((cS.gamma - 1.) * cS.v * cC.fort);
        adum = (Math.abs(cS.v + 41.) <= 1e-6) ? 2000 : 200. * (cS.v + 41.) / (1.-Math.exp(-0.1 * (cS.v + 41.)));
        bdum = 8000. * Math.exp(-0.056 * (cS.v + 66.));
        cS.tau = adum + bdum;
        minft_t = adum / cS.tau;
        exptaumt_t = Math.exp(-cS.timestep * cS.tau);
        adum = 20. * Math.exp(-0.125 * (cS.v + 75.));
        bdum = 2000. / (1. + 320. * Math.exp(-0.1 * (cS.v + 75.)));
        cS.tau = adum + bdum;
        hinft_t = adum / cS.tau;
        exptauht_t = Math.exp(-cS.timestep * cS.tau);
        if(Math.abs(cS.v + 19.) <= 1e-6){
           adum = 120.;
           bdum = 120.;
        }
        else{
           adum = 30. * (cS.v + 19.) / (1.-Math.exp(-(cS.v + 19.) / 4.));
           bdum = 12. * (cS.v + 19.) / (Math.exp((cS.v + 19.) / 10.)-1.);
        }
        cS.tau = adum + bdum;
        dinft_t = adum / cS.tau;
        exptaudt_t = Math.exp(-cS.timestep * cS.tau);
        adum = (Math.abs((cS.v + 34.)) <= 1e-6) ? 25. : 6.25 * (cS.v + 34.) / (Math.exp((cS.v + 34.) / 4.)-1.);
        bdum = 50. / (1. + Math.exp(-(cS.v + 34.) / 4.));
        cS.tau = adum + bdum;
        finft_t = adum / cS.tau;
        exptauft_t = Math.exp(-cS.timestep * cS.tau);
        isicaterm1t_t = Math.exp(-2. * (cS.v - 50.) * cC.fort);
        isikterm1t_t = (1.- Math.exp(-(cS.v - 50.) * cC.fort));
        isikterm2t_t = Math.exp((50. - cS.v) * cC.fort);
        adum = (Math.abs((cS.v + 34.)) <= 1e-6) ? 2.5 : .625 * (cS.v + 34.) / (Math.exp((cS.v + 34.) / 4.)-1.);
        bdum = 5.0 / (1. + Math.exp(-(cS.v + 34.) / 4.));
        cS.tau = adum + bdum;
        pinft_t = adum / cS.tau;
        exptaupt_t = Math.exp(-cS.timestep * cS.tau);

        // compute equilibrium potentials
		
		ena = cC.rtof * Math.log(cS.nao / cS.nai);
        ek = cC.rtof * Math.log(cS.kc / cS.ki);
        emh = cC.rtof * Math.log((cS.nao + 0.12 * cS.kc) / (cS.nai + 0.12 * cS.ki));
        eca = 0.5 * cC.rtof * Math.log(cS.cao / cS.cai);
    
        vmek = cS.v - ek;
        ik1term1t_t = cS.gk1 * (vmek) / (1. + Math.exp(2. * (vmek + 10.) * cC.fort));
		
		// hyperpolarizing-activated current
        yinf = yinft_t;
        exptauy = exptauyt_t;
        cS.y = yinf - (yinf - cS.y) * exptauy;

        cS.ifk = cS.y * (cS.kc / (cS.kc + cS.kmf)) * cS.gfk * (cS.v - ek);
        cS.ifna = cS.y * (cS.kc / (cS.kc + cS.kmf)) * cS.gfna * (cS.v - ena);
//            cS.ifk = 0.0
//            cS.ifna = 0.0
        ikc = cS.ifk;
        inac = cS.ifna;
        ionc = cS.ifk + cS.ifna;

// time-dependent (delayed K +  current)
        xinf = xinft_t;
        exptaux = exptauxt_t;
        cS.x = xinf - (xinf - cS.x) * exptaux;

        ikcoeff = ikcoefft_t;
        cS.ik = cS.x * cS.ikmax * (cS.ki - cS.kc * ikcoeff) / 140.;
        ikc = ikc + cS.ik;
        ionc = ionc + cS.ik;

// time-independent (background) K +  current
        ik1term1 = ik1term1t_t;
        cS.ik1 = (cS.kc / (cS.kc + cS.km1)) * ik1term1;
        ikc = ikc + cS.ik1;
        ionc = ionc + cS.ik1;

		// transient outward current
        rinf = rinft_t;
        exptaur = exptaurt_t;
        cS.r = rinf - (rinf - cS.r) * exptaur;

        itoterm1 = itoterm1t_t;
        itoterm2 = itoterm2t_t;
        itoterm3 = itoterm3t_t;
        cS.ito = (cS.r * cS.gto * (0.2 + (cS.kc / (cS.kc + cS.kmt))) * (cS.cai / 
            (cS.kact + cS.cai)) * itoterm1) * (cS.ki * itoterm2-cS.kc * itoterm3); // gto = 0.28
        ikc = ikc + cS.ito;
        ionc = ionc + cS.ito;
		        
// background sodium current
        cS.ibna = cS.gbna * (cS.v - ena);
        inac = inac + cS.ibna;
        ionc = ionc + cS.ibna;

// background calcium current
        cS.ibca = cS.gbca * (cS.v - eca);
        icac = cS.ibca;
        ionc = ionc + cS.ibca;

// na-k pump exchange current
        cS.inak = cS.ipmax * (cS.kc / (cS.kmk + cS.kc)) * (cS.nai / (cS.kmna + cS.nai));
        ikc = ikc - 2. * cS.inak;
        inac = inac + 3. * cS.inak;
        ionc = ionc + cS.inak;

// na-ca pump exchange current
        inacaterm1 = inacaterm1t_t;
        inacaterm2 = inacaterm2t_t;
        nai3 = cS.nai * cS.nai * cS.nai;
        dum2 = nai3 * cS.cao * inacaterm1;
        dum3 = cC.nao3 * (cS.cai) * inacaterm2;
        dum4 = 1. + cS.dnaca * ((cS.cai) * cC.nao3 + cS.cao * nai3);
        cS.inaca = cS.knaca * (dum2 - dum3) / dum4;
        inac = inac + 3 * cS.inaca;
        icac = icac - 2. * cS.inaca;
        ionc = ionc + cS.inaca;

// fast sodium current
        minf = minft_t;
        exptaum = exptaumt_t;
        cS.m = minf - (minf - cS.m) * exptaum;

        hinf = hinft_t;
        exptauh = exptauht_t;
        cS.h = hinf - (hinf - cS.h) * exptauh;

        cS.ina = cS.m * cS.m * cS.m * cS.h * cS.gna * (cS.v - emh);
        inac = inac + cS.ina;
        ionc = ionc + cS.ina;   

// fast second inward current (calcium)
        dinf = dinft_t;
        exptaud = exptaudt_t;
        cS.d = dinf - (dinf - cS.d) * exptaud;

        finf = finft_t;
        exptauf = exptauft_t;
        cS.f = finf - (finf - cS.f) * exptauf;

        adum = 5.;
        bdum = cS.cai * adum / cS.kmf2;
        tvar = adum + bdum;
        inf = adum / (adum + bdum);
        cS.f2 = inf - (inf - cS.f2) * Math.exp(-cS.timestep * tvar);

        dum2 = cS.d * cS.f * cS.f2 * (4. * cS.psi * (cS.v - 50.) * cC.fort);
        isicaterm1 = isicaterm1t_t;
        dum3 = (1. - isicaterm1);
        dum4 = cS.cai * cC.exp100fort - cS.cao * isicaterm1;
        cS.isica = dum2 * dum4 / dum3;
        icac = icac + cS.isica;
        ionc = ionc + cS.isica;

// more fast inward current
        isikterm1 = isikterm1t_t;
        isikterm2 = isikterm2t_t;
        dum3 = isikterm1;
        dum4 = cS.ki * cC.exp50fort - cS.kc * isikterm2;
        cS.isik = dum2 * dum4 / (400. * dum3);
        ikc = ikc + cS.isik;
        ionc = ionc + cS.isik;

// total currents used to update each ion concentration
        imk = ikc;
        imna = inac;
        imca = icac;

// convert from nanoamperes to microampers per square cm

//            iion = 0.015 * ionc

//            derv = -1000. * iion / cm

        imna = cS.ifna + cS.ina + 3. * cS.inaca + 3. * cS.inak + cS.ibna;
        imk = cS.ifk + cS.ik + cS.ik1 + cS.ito + cS.isik - 2. * cS.inak;
        imca = cS.isica - 2. * cS.inaca + cS.ibca;
        iion = imna + imk + imca;


// stimulus
//           if(ttim * 1000.0.le.1.0) then
//            if(mod(it,icycle).le.istimdur) then
//            if(ttim * 1000.0.le.1.0.or.
//     &           (ttim * 1000.0.gt.500.0.and.ttim * 1000.0.le.501.0)) then
//               ionc = ionc-10000.0
//            endif
// 1750 works, 1800 does not so use 1750 as diast. thresh, 3500  =  2 * 
        // if(mod(ntime,icycle).le.istimdur) then
        factor = _s1s2Stimulus(count,data);
            iion = iion - factor;
            imk = imk - factor;
        
        derv = iion / cS.cm;

        
// change in intracellular sodium            
           dna = (-imna / (cC.vi * cS.fcon)) * cS.timestep;
           cS.nai = cS.nai + dna;

// change in extracellular potassium
           dk = (-cS.prate * (cS.kc - cS.kb) + imk / (cC.ve * cS.fcon)) * cS.timestep;
           cS.kc = cS.kc + dk;

// change in intracellular potassium
           dk = (-imk / (cC.vi * cS.fcon)) * cS.timestep;
           cS.ki = cS.ki + dk;
		
// intracellular calcium handling
        pinf = pinft_t;
        exptaup = exptaupt_t;
        cS.p = pinf - (pinf - cS.p) * exptaup;

        iup = cC.aup * cS.cai * (cS.cabarup - cS.caup);
        itr = cC.atr * cS.p * (cS.caup - cS.carel);
        irel = cC.arel * cS.carel * (((cS.cai) * cS.cai) / ((cS.cai) * cS.cai + cS.kmca * cS.kmca));

        dcaup = ((iup - itr) / (2. * cC.vup * cS.fcon)) * cS.timestep;
        cS.caup = cS.caup + dcaup;

        dcarel = ((itr - irel) / (2. * cC.vrel * cS.fcon)) * cS.timestep;
        cS.carel = cS.carel + dcarel;

        dcai = (-(imca + iup - irel) / (2. * cC.vi * cS.fcon)) * cS.timestep;
        cS.cai = cS.cai + dcai;

// update voltage
        cS.v = cS.v - cS.timestep * derv;
		
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
        this.fort = c.fcon / (c.rcon * c.t)		
		this.vol  = c.pi * (c.difna * c.difna) * c.difnl;
		this.vi   = (1. - c.vecs) * this.vol;
		this.ve   = c.vecs * this.vol;
		this.vup  = 0.05 * this.vi;
		this.vrel = 0.02 * this.vi;
		this.rtof = 1.0 / this.fort;


		// calculated constants
      	this.aup = (2. * c.fcon * this.vi) / (c.tup * c.cabarup);
      	this.atr = (2. * c.fcon * this.vrel) / c.trep;
      	this.arel = (2. * c.fcon * this.vrel) / c.trel;
      	this.nao3 = Math.pow(c.nao,3); //c.nao * c.nao * c.nao;
      	this.exp100fort = Math.exp(100. * this.fort);
      	this.exp50fort = Math.exp(50. * this.fort);

    }
    
    /*  This function calculates the number of iterations for calculateNext 
     *   to be executed.
     *   param {object} settings
     */
    function _getNumIterations(settings) {
        var c   =    settings.calculationSettings;
        var num   =    (((c.s1 * c.ns1) + c.s2) * 1.1) / c.timestep;
        num   =    Math.floor(num);
        return num;    
    }
    
    
    /*This function iteratively calls all the analyzers and performs 
     * all the calculations to generate points to be displayed on the
     * plotter
     *  param {int} iterations
     *  param {object} settings
     */    
    function runCalculations(iterations, settings) {
        var state   =   settings,
        data,
        curAnalyzer; 
        
        //here 'count' is global variable
        count   =    0;

        cS  =   _.cloneDeep(state.calculationSettings);      
        cC  =   new CalcConstants(state.calculationSettings); 
        
        /**
          * Reset the calculators to their base states
          */
        var numCalculations = _getNumIterations(state);  
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
        var dur     = utils.round(c.stimdur * 0.001 / c.timestep); //conversion of stimdur into ms.
        var periods = stimuli.s1;
        for (var i = 0; i < periods.length; i++) {
            var periodX = utils.round(periods[i] / c.timestep);
            if ((count >= periodX) && (count < periodX + dur)) {
                stim   =    3500;
            }
        }
        var lastPeriodX   =    utils.round(stimuli.s2 / c.timestep);
        if ((count >= lastPeriodX) && (count < lastPeriodX + dur)) {
            stim   =    3500;
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

