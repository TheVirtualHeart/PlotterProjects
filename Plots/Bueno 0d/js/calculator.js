/**
* This module is responsible for performing the differential equation
* calculation for DiFrancesco. The object maintains the state of the different
* variables and returns them after each calculation. These variables can also
* be reset. 
*/

define(["utility"],
function Bueno0dCalculator(utils) {
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
    
        var hthv, hthw, hthso, hthsi, hthvm, htho, hthvinf, hthwinf,
        tvm, ts, to, twp, twm, tso, tsi, vinf, winf, dv, dw, ds;
        

        cS.istim = _s1s2Stimulus(count,data);

        /* Trial again.

        // Step functions
        hthv = (cS.u >= cS.thv);
        hthw = (cS.u >= cS.thw);
        hthso = (cS.u >= cS.thso);
        hthsi = (cS.u >= cS.thsi);
        hthvm = (cS.u >= cS.thvm);
        htho = (cS.u >= cS.tho);
        hthvinf = (cS.u >= cS.thvm);
        hthwinf = (cS.u >= cS.thw);

        // Multi-part terms
        tvm = (1 - hthvm) * cS.tv1m + hthvm * cS.tv2m;
        ts  = (1 - hthw) * cS.ts1 + hthw * cS.ts2;
        to  = (1 - htho) * cS.to1 + htho * cS.to2;
        twp = cS.tw1p + (cS.tw2p - cS.tw1p) * (1 + Math.tanh((cS.w - cS.wcp) * cS.kwp)) / 2;
        twm = cS.tw1m + (cS.tw2m - cS.tw1m) * (1 + Math.tanh((cS.u - cS.uwm) * cS.kwm)) / 2;
        tso = cS.tso1 + (cS.tso2 - cS.tso1) * (1 + Math.tanh((cS.u - cS.uso) * cS.kso)) / 2;
        tsi = cS.tsi1 + (cS.tsi1 - cS.tsi1) * (1 + Math.tanh((cS.s - cS.sc) * cS.ksi)) / 2;
        vinf = 1 - hthvinf;
        winf = (1 - hthwinf) * (1 - cS.u / cS.twinf) + hthwinf * cS.winfstar;

        // Gate evolution
        dv = (1 - hthv) * (vinf - cS.v) / tvm - hthv * cS.v / cS.tvp;
        dw = (1 - hthw) * (winf - cS.w) / twm - hthw * cS.w / twp;
        ds = ((1 + Math.tanh((cS.u - cS.us) * cS.ks)) / 2 - cS.s) / ts;
        cS.v = cS.v + cS.timestep * dv;
        cS.w = cS.w + cS.timestep * dw;
        cS.s = cS.s + cS.timestep * ds;
        
        // Currents
        cS.xfi = -cS.v * hthv * (cS.u - cS.thv) * (cS.uu - cS.u) / cS.tfi;
        cS.xso = (cS.u - cS.uo) * (1 - hthso) / to + hthso / tso;
        cS.xsi = -hthsi * cS.w * cS.s / tsi;
        
        // update u using forward Euler
        cS.u = cS.u - cS.timestep * (cS.xfi + cS.xso + cS.xsi - cS.istim);
        */


       // Step functions
        hthv = (cS.u >= cS.thv);
        hthw = (cS.u >= cS.thw);
        hthso = (cS.u >= cS.thw);
        hthsi = (cS.u >= cS.thw);
        hthvm = (cS.u >= cS.thvm);
        htho = (cS.u >= cS.tho);
        hthvinf = (cS.u >= cS.thvm);
        hthwinf = (cS.u >= cS.thwinf);

        // Multi-part terms
        tvm = (1 - hthvm) * cS.tv1m + hthvm * cS.tv2m;
        ts  = (1 - hthw) * cS.ts1 + hthw * cS.ts2;
        to  = (1 - htho) * cS.to1 + htho * cS.to2;
        twp = cS.tw1p + (cS.tw2p - cS.tw1p) * (1 + Math.tanh((cS.w - cS.wcp) * cS.kwp)) / 2;
        twm = cS.tw1m + (cS.tw2m - cS.tw1m) * (1 + Math.tanh((cS.u - cS.uwm) * cS.kwm)) / 2;
        tso = cS.tso1 + (cS.tso2 - cS.tso1) * (1 + Math.tanh((cS.u - cS.uso) * cS.kso)) / 2;
        tsi = cS.tsi1 + (cS.tsi1 - cS.tsi1) * (1 + Math.tanh((cS.s - cS.sc) * cS.ksi)) / 2;
        vinf = 1 - hthvinf;
        winf = (1 - hthwinf) * (1 - cS.u / cS.twinf) + hthwinf * cS.winfstar;

        // Gate evolution
        dv = (1 - hthv) * (vinf - cS.v) / tvm - hthv * cS.v / cS.tvp;
        dw = (1 - hthw) * (winf - cS.w) / twm - hthw * cS.w / twp;
        ds = ((1 + Math.tanh((cS.u - cS.us) * cS.ks)) / 2 - cS.s) / ts;
        cS.v = cS.v + cS.timestep * dv;
        cS.w = cS.w + cS.timestep * dw;
        cS.s = cS.s + cS.timestep * ds;
        
        // Currents
        cS.xfi = -cS.v * hthv * (cS.u - cS.thv) * (cS.uu - cS.u) / cS.tfi;
        cS.xso = (cS.u - cS.uo) * (1 - hthso) / to + hthso / tso;
        cS.xsi = -hthsi * cS.w * cS.s / tsi;
        
        // update u using forward Euler
        cS.u = cS.u - cS.timestep * (cS.xfi + cS.xso + cS.xsi - cS.istim);
       
        // sets voltage variables after calculations
        utils.copySpecific(data.calculationSettings, cS,  data.calculationSettings.voltageVariables);
        
        // sets current variables after calculations
        utils.copySpecific(data.calculationSettings, cS, data.calculationSettings.currentVariables);
        
        // iterate the count
        count++;
        
        return data;   
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

        
        


