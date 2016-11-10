/**
    * This module is responsible for performing the differential equation
    * calculation for PriebeBeuckelmannReduced. The object maintains the state of the different
    * variables and returns them after each calculation. These variables can also
    * be reset. 
*/

define(["utility"],
function PriebeBeuckelmannCalculator(utils) {
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
        
        var aK1, bK1, hlp, hlp2, hlp3, tau, fNaK, am, bm, ad, bd, Infi, af, bf, ar, br, ato, bto, Itot;
        //xlap;
                
        var vi_t, tauv_t, xi_t, taux_t, zIK1_t, zINaCa1_t, zINaCa2_t, zINaK_t, zINab_t, zICab_t,
        expm_t, mi_t, zINa_t, expv_t,  zICa_t, expff_t, fi_t, zIto_t, expto_t, toi_t, expxx_t,
        zIK_t;
        
        
        /* tabulations */
        
        vi_t=.5*(1-((Math.exp(7.74+.12*cS.v)-Math.exp(-(7.74+.12*cS.v)))/(Math.exp(7.74+.12*cS.v)+Math.exp(-(7.74+.12*cS.v)))));
        tauv_t  = .25+2.24*((1-(Math.exp(7.74+.12*cS.v)-Math.exp(-(7.74+.12*cS.v)))/(Math.exp(7.74+.12*cS.v)+Math.exp(-(7.74+.12*cS.v))))/(1-(Math.exp(0.07*(cS.v+92.4))-Math.exp(-(0.07*(cS.v+92.4))))/(Math.exp(0.07*(cS.v+92.4))+Math.exp(-(0.07*(cS.v+92.4))))));
        xi_t    = 0.988/(1+Math.exp(-.861-0.062*cS.v));
        taux_t  = 240*Math.exp(-((25.5+cS.v)*(25.5+cS.v))/156)+182*(1+(Math.exp(0.154+0.0116*cS.v)-Math.exp(-(0.154+0.0116*cS.v)))/(Math.exp(0.154+0.0116*cS.v)+Math.exp(-(0.154+0.0116*cS.v))))+40*(1+(Math.exp(160+2*cS.v)-Math.exp(-(160+2*cS.v)))/(Math.exp(160+2*cS.v)+Math.exp(-(160+2*cS.v))));
        
        /* Time-independent functions */
        aK1 = 0.1/(1.0+Math.exp(0.06*(cS.v-cC.ek1-200.0)));
        bK1=(3.0*Math.exp(0.0002*(cS.v-cC.ek1+100.0))+Math.exp(0.1*(cS.v-cC.ek1-10.0)))/(1.0+Math.exp(-0.5*(cS.v-cC.ek1)));
        hlp = aK1/(aK1+bK1);
        zIK1_t = cS.gK1*hlp*(cS.v-cC.ek1);
        
        hlp = cS.v/cC.RTonF;
        hlp2 = Math.exp(cS.eta*hlp);
        hlp3 = Math.exp((cS.eta-1.0)*hlp);
        hlp = cS.gNaCa/( (cS.KmNa*cS.KmNa*cS.KmNa+cS.Nae*cS.Nae*cS.Nae)*(cS.KmCa+cS.Cae)*(1.0+cS.ksat*hlp3));
        zINaCa1_t = hlp*hlp2*cS.Nai*cS.Nai*cS.Nai*cS.Cae;
        zINaCa2_t = hlp*hlp3*cS.Nae*cS.Nae*cS.Nae;
        
        hlp = cS.v/cC.RTonF;
        fNaK = 1.0/(1.0+0.1245*Math.exp(-0.1*hlp) + 0.0365*cC.sigma*Math.exp(-hlp));
        hlp = cS.KmNai/cS.Nai;
        hlp2 = 1.0/(1.0+Math.sqrt(hlp*hlp*hlp));
        hlp3 = cS.Ke/(cS.Ke+cS.KmKe);
        zINaK_t = cS.gNaK*fNaK*hlp2*hlp3;
        zINab_t = cS.gNab*(cS.v-cC.ena);
        zICab_t = cS.gCab*(cS.v-cC.eca);
        
        /* NA gating variables */
        am   = ((Math.abs(cS.v+47.13)) > 0.001) ? 0.32*(cS.v+47.13)/(1.0 - Math.exp(-0.1*(cS.v+47.13)) ): 3.2;
        bm   = 0.08*Math.exp(cS.v/(-11.0));
        hlp  = am+bm;
        tau  = 1.0/hlp;
        expm_t = Math.exp(-cS.timestep/tau);
        
        mi_t   = am/hlp;
        zINa_t = cS.gNa*(cS.v - cC.ena);
        expv_t = Math.exp(-cS.timestep/tauv_t);
        
        
        /*CA gating variables */
        
        hlp = Math.sqrt(2.0*cC.pi);
        hlp2= (cS.v-22.36)/16.6813;
        ad = (14.9859/(16.6813*hlp))*Math.exp(-0.5*hlp2*hlp2);
        hlp2 = (cS.v-6.2744)/14.93;
        bd = 0.1471-((5.3/(14.93*hlp))*Math.exp(-0.5*hlp2*hlp2));
        hlp = ad+bd;
        Infi = ad/hlp;
        zICa_t = cS.gCa*cC.fCa*Infi*(cS.v-cC.eca);
        
        af = 0.006872/(1.0+Math.exp((cS.v-6.1546)/6.1223));
        hlp = 0.0687*Math.exp(-0.1081*(cS.v+9.8255)) + 0.0112;
        hlp2 = 1.0+Math.exp(-0.2779*(cS.v+9.8255));
        bf = hlp/hlp2 + 0.0005474;
        hlp = af+bf;
        tau = 1.0/hlp;
        expff_t = Math.exp(-cS.timestep/tau);
        fi_t = af/hlp;
        
        /*TO gating variables */
        hlp = cS.v-42.2912;
        hlp2 = 0.5266*Math.exp(-0.0166*hlp);
        hlp3 = 1.0 + Math.exp(-0.0943*hlp);
        ar = hlp2/hlp3;
        hlp = 0.5149*Math.exp(-0.1344*(cS.v-5.0027)) + 0.00005186*cS.v;
        hlp2 = 1.0 + Math.exp(-0.1348*(cS.v-0.00005186));
        br = hlp/hlp2;
        hlp = ar+br;
        Infi = ar/hlp;
        zIto_t= cS.gto*Infi*(cS.v-cC.eto);
        hlp = cS.v + 34.2531;
        hlp2 = 0.0721*Math.exp(-0.173*hlp)+0.00005612*cS.v;
        hlp3 = 1.0+Math.exp(-0.1732*hlp);
        ato = hlp2/hlp3;
        hlp = cS.v + 34.0235;
        hlp2 = 0.0767*Math.exp(-1.66E-9*hlp)+0.0001215*cS.v;
        hlp3 = 1.0+Math.exp(-0.1604*hlp);
        bto = hlp2/hlp3;
        hlp = ato+bto;
        tau = 1.0/hlp;
        expto_t = Math.exp(-cS.timestep/tau);
        toi_t = ato/hlp;
        
        /* IK gating variables */
        expxx_t= Math.exp(-cS.timestep/(taux_t+40.0*(1.0-(Math.exp(160.0+cS.v*2.0)- Math.exp(-(160.0+cS.v*2.0)))/(Math.exp(160.0+cS.v*2.0)+ Math.exp(-(160.0+cS.v*2.0)))) ));
        zIK_t = cS.gK*(cS.v- cC.ekr);
        
        cS.istim = _s1s2Stimulus(count, data);
        
        /* Gating variables */
        cS.m =  mi_t + ( cS.m  - mi_t ) * expm_t;
        cS.f =  fi_t + ( cS.f - fi_t ) * expff_t;
        cS.xv = vi_t + ( cS.xv - vi_t ) * expv_t;
        cS.to = toi_t + ( cS.to - toi_t ) * expto_t;
        cS.xx = xi_t + ( cS.xx - xi_t ) * expxx_t;
        
        /* The membrane currents */
        cS.ica = cS.f*zICa_t;
        cS.icab= zICab_t;
        cS.ina = cS.gNa*cS.xv*cS.xv*cS.m*cS.m*cS.m*(cS.v - cC.ena);
        cS.inab= zINab_t;
        cS.ik = cS.xx*cS.xx*zIK_t;
        cS.ik1 = zIK1_t;
        cS.ito = cS.to*zIto_t;
        cS.inaca = zINaCa1_t - cS.Cai*zINaCa2_t;
        cS.inak  = zINaK_t;
        Itot= cS.ica+cS.icab+cS.ik1+cS.ik+cS.ina+cS.inab+cS.inaca+cS.inak+cS.ito-cS.istim;
       
        // 
        
        /*if(count == 1){
            xlap = cC.d_o_dx2*(2.0*v(i+1)-2.0*cS.v);
            }
            else if (count == 1){
            xlap = cC.d_o_dx2*(2.0*v(i-1)-2.0*cS.v)
            }
            else{
            xlap = cC.d_o_dx2*(v(i+1)-2.0*cS.v+v(i-1))
        }*/
        
        /* The membrane potential */
        
    //cS.v = cS.v - cS.timestep*Itot+xlap; 
        cS.v = cS.v - cS.timestep*Itot;
        
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
        
        this.pi = 4*Math.atan(1.);
        this.RTon2F = 8.3143*310.15/(2.0*c.Fc);
        this.RTonF = 2.0*this.RTon2F;
        this.eca = this.RTon2F*Math.log(c.Cae/c.Cai);
        this.fCa = c.KCa/(c.KCa + c.Cai);
        this.ekr = this.RTonF*Math.log(c.Ke/c.Ki);
        this.ek1 = this.RTonF*Math.log(c.Ke/c.Ki);
        this.ena = this.RTonF*Math.log(c.Nae/c.Nai);
        this.eto = this.RTonF*Math.log( (c.Ke+0.043*c.Nae) / (c.Ki+0.043*c.Nai));
        this.sigma = (Math.exp(c.Nae/67.3) - 1.0) / 7.0 ;
        this.d_o_dx2 = c.timestep*c.dlap/(c.dx*c.dx);
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
        param {int} iterations
        param {object} settings
    */    
    function runCalculations(iterations, settings) {
        var state   =   settings,
        data,
        curAnalyzer; 
        
        //here 'count' is global variable
        count   =    0;

        cS  =   _.cloneDeep(settings.calculationSettings);      
        cC  =   new CalcConstants(settings.calculationSettings); 
        
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
                   if(    (analyzers[curAnalyzer].analyzerName === "PointBufferAnalyzer" || analyzers[curAnalyzer].analyzerName === "APDAnalyzer") 
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



        //console.dir(settings);        
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
                stim   =    c.istim;
            }
        }
        var lastPeriodX   =    utils.round(stimuli.s2 / c.timestep);
        if ((count >=    lastPeriodX) && (count < lastPeriodX + dur)) {
            stim   =    c.istim;
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