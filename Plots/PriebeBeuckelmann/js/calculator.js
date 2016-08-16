/**
    * This module is responsible for performing the differential equation
    * calculation for PriebeBeuckCalculator. The object maintains the state of the different
    * variables and returns them after each calculation. These variables can also
    * be reset. 
*/

define(["utility"],
function PriebeBeuckCalculator(utils) {
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
        
        var   Ek, Eks, Ena, Eto, Eca, sigma, hlp5, hlp, hlp2, hlp3, fNaK, am, bm, tau, 
        ah, bh, aj, bj, ad, bd, af, bf, ar, br, ato, bto, axr, bxr, axs, bxs, 
        Ak1, Bk1,  di, fi, mi, hi, ji, ri, toi, xri, xsi, expd, expff, expm, exph, 
        expj, expr, expto, expxr, expxs, fCa, zIKr, zIKs, zINaCa1, zINaCa2, zINaK, 
        zIKr, zIKs, zINaCa1, zINaCa2, zINaK, dKi, dNai, vold;
        
        var   zIKrt_t, zINaCa1t_t, zINaCa2t_t, zINaKt_t, expmt_t, mit_t, expht_t, hit_t,
        jit_t, expjt_t, expdt_t, dit_t, expfft_t , fit_t, exprt_t, rit_t, exptot_t, toit_t,
        expxrt_t, xrit_t, expxst_t, xsit_t, zIK1t_t;
        
        // sets voltage variables after calculations
         vold = data.calculationSettings["v"];
        

        
        Ek    = cC.RTonF * Math.log(cS.ke/cS.ki);    
        Eks   = cC.RTonF * Math.log( (cS.ke + 0.01833 * cS.nae) / (cS.ki+0.01833*cS.nai) );
        Ena   = cC.RTonF * Math.log(cS.nae/cS.nai);
        Eto   = cC.RTonF * Math.log( (cS.ke+0.043*cS.nae) / (cS.ki+0.043*cS.nai) );
        sigma = (Math.exp(cS.nae/67.3)-1.0)/7.0;
        
        // tables
        hlp5 = 1.0/(1.0+ Math.exp((cS.v+26)/23));
        zIKrt_t = cS.gkr*hlp5
        
        hlp = cS.v/cC.RTonF;
        hlp2 = Math.exp(cS.eta*hlp);
        hlp3 =  Math.exp((cS.eta-1.0)*hlp);
        hlp = cS.gnaca/( (Math.pow(cS.kmna,3) + Math.pow(cS.nae,3))*(cS.kmca+cS.cae)*(1.0+cS.ksat*hlp3));            
        zINaCa1t_t = hlp*hlp2*cS.cae;
        zINaCa2t_t = hlp*hlp3*Math.pow(cS.nae,3);
        
        hlp = cS.v/cC.RTonF;
        fNaK = 1.0/(1.0+0.1245 * Math.exp(-0.1*hlp) + 0.0365 * sigma * Math.exp(-hlp));
        hlp3 = cS.ke/(cS.ke+cS.kmke);
        zINaKt_t = cS.gnak*fNaK*hlp3;
        
        //NA gating variables
        am  = ( Math.abs(cS.v + 47.13) > 0.001 ) ? 0.32*(cS.v+47.13)/(1.0 - Math.exp(-0.1*(cS.v+47.13))) : 15.218 ;
        bm =  0.08*Math.exp(cS.v/(-11.0));
        hlp = am+bm;
        tau = 1.0/hlp;
        expmt_t = Math.exp(-cS.timestep/tau);
        mit_t = am/hlp;
        
        ah =  (cS.v < -40.0) ? 0.135 * Math.exp(-(80.0 + cS.v)/(6.8)) :  0.0 ;
        bh =  (cS.v < -40.0) ? (3.56 * Math.exp(0.079 * cS.v) + 310000.0 * Math.exp(0.35 * cS.v)) : 1.0 / (0.13*(1.0+ Math.exp(-(cS.v + 10.66)/11.1)));
        hlp = ah+bh;
        tau = 1.0/hlp;
        expht_t = Math.exp(-cS.timestep/tau);
        hit_t = ah/hlp;
        
        aj = (cS.v < -40.0) ? (-127140.0*Math.exp(0.244*cS.v)-0.00003474*Math.exp(-0.04391*cS.v)) *(cS.v+37.78)/(1.+Math.exp(0.311*(cS.v+79.23))) : 0.0;
        bj = (cS.v < -40.0) ? (0.1212*Math.exp(-0.01052*cS.v))/(1.+Math.exp(-0.1378*(cS.v+40.14))): 0.3*Math.exp(-2.535E-7*cS.v)/(1.0+Math.exp(-0.1*(cS.v+32.0)));
        hlp = aj+bj;
        tau = 1.0/hlp;
        expjt_t = Math.exp(-cS.timestep/tau);
        jit_t = aj/hlp;
        
        //CA gating variables
        hlp = Math.sqrt(2.0*cS.pi);
        hlp2= (cS.v-22.36)/16.68;
        ad = (14.98/(16.68*hlp)) * Math.exp(-0.5*hlp2*hlp2);
        hlp2 = (cS.v-6.27)/14.93;
        bd = 0.1471-( (5.3/(14.93*hlp))*Math.exp(-0.5*hlp2*hlp2) );
        hlp = ad+bd;
        tau = 1.0/hlp;
        expdt_t = Math.exp(-cS.timestep/tau);
        dit_t = ad/hlp;
        
        af  = 0.00687/(1.0+Math.exp((cS.v-6.1546)/6.12));
        hlp = 0.069*Math.exp(-0.11*(cS.v+9.825)) + 0.011;
        hlp2 = 1.0+Math.exp(-0.278*(cS.v+9.825));
        bf =  hlp/hlp2 + 0.000575;
        hlp = af+bf;
        tau = 1.0/hlp;
        expfft_t = Math.exp(-cS.timestep/tau);
        fit_t = af/hlp;
        
        //TO gating variables
        hlp = cS.v-42.2912;
        hlp2 = 0.5266*Math.exp(-0.0166*hlp);
        hlp3 = 1.0 + Math.exp(-0.0943*hlp);
        ar = hlp2/hlp3;
        hlp = 0.5149*Math.exp(-0.1344*(cS.v-5.0027)) + 0.00005186*cS.v;
        hlp2 = 1.0 + Math.exp(-0.1348*(cS.v-0.00005186));
        br = hlp/hlp2;
        hlp = ar+br;
        tau = 1.0/hlp;
        exprt_t = Math.exp(-cS.timestep/tau);
        rit_t = ar/hlp;
        
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
        exptot_t = Math.exp(-cS.timestep/tau);
        toit_t = ato/hlp;
        
        //ikr and iks gating variables
        hlp = 0.005*Math.exp(0.0005266*(cS.v+4.067));
        hlp2 = 1.0+ Math.exp(-0.1262*(cS.v+4.067));
        axr = hlp/hlp2;
        hlp = 0.016*Math.exp(0.0016*(cS.v+65.66));
        hlp2 = 1.0 + Math.exp(0.0783*(cS.v+65.66));
        bxr = hlp/hlp2;
        hlp = axr+bxr;
        tau = 1.0/hlp;
        expxrt_t = Math.exp(-cS.timestep/tau);
        xrit_t = axr/hlp;
        
        axs = 0.003/(1.0+Math.exp((7.44-(cS.v+10.0))/14.32)); 
        bxs = 0.00587/(1.0+Math.exp((5.95+(cS.v+10.0))/15.82));
        hlp = axs+bxs;
        tau = 1.0/hlp;
        expxst_t = Math.exp(-cS.timestep/tau);
        xsit_t = axs/hlp;
        
        //here vv is actually v - ek       
        Ak1 =  0.1/(1.+Math.exp(0.06*((cS.v - Ek)-200.))); //gaurav
        Bk1 =  (3.* Math.exp(0.0002*((cS.v - Ek)+100.))+ Math.exp(0.1*((cS.v - Ek)-10.)))/(1.+ Math.exp(-0.5*(cS.v - Ek)));                   
        zIK1t_t = cS.gk1*(cS.v - Ek)*Ak1/(Ak1+Bk1);
        
        //compute reversal potentials
        Eca = cC.RTon2F * Math.log(cS.cae/cS.cai);  
        Ek =  cC.RTonF  * Math.log(cS.ke/cS.ki);
        Eks = cC.RTonF  * Math.log( (cS.ke+0.01833*cS.nae) / (cS.ki+0.01833*cS.nai) );
        Ena = cC.RTonF  * Math.log(cS.nae/cS.nai);
        Eto = cC.RTonF  * Math.log((cS.ke+0.043*cS.nae) / (cS.ki+0.043*cS.nai) );
        
        //Gating variables
        di  = dit_t;
        fi  = fit_t;
        mi  = mit_t;
        hi  = hit_t;
        ji  = jit_t;
        ri  = rit_t;
        toi = toit_t;
        xri = xrit_t;
        xsi = xsit_t;
        
        expd = expdt_t;
        expff = expfft_t;
        expm = expmt_t;
        exph = expht_t;
        expj = expjt_t;
        expr = exprt_t;
        expto = exptot_t;
        expxr = expxrt_t;
        expxs = expxst_t;
        
        cS.d = di+(cS.d-di)*expd;
        cS.f = fi+(cS.f-fi)*expff;
        cS.m = mi+(cS.m-mi)*expm;
        cS.h = hi+(cS.h-hi)*exph;
        cS.j = ji+(cS.j-ji)*expj;
        cS.r = ri+(cS.r-ri)*expr;
        cS.to = toi+(cS.to-toi)*expto;
        cS.xr = xri+(cS.xr-xri)*expxr;
        cS.xs = xsi+(cS.xs-xsi)*expxs;
        
        //Stimulation switched on for 2 ms with Period = bcl */
        //get stimulus 
        cS.iss =  _s1s2Stimulus(count, data);
        
        //The membrane currents
        fCa     = cS.kca/( cS.kca +  cS.cai);
        cS.ica  = cS.gca* fCa*cS.d*cS.f*( cS.v-Eca);      
        cS.icab = cS.gcab*(cS.v-Eca);
        cS.ina  = cS.gna*cS.m*cS.m*cS.m*cS.h*cS.j*(cS.v-Ena);
        cS.inab = cS.gnab*(cS.v-Ena);
        
        zIKr    = zIKrt_t;
        cS.ikr  = cS.xr*zIKr*(cS.v-Ek);
        
        zIKs    = cS.gks*(cS.v-Eks);
        cS.iks  = cS.xs*cS.xs*zIKs;
        cS.ik1  = zIK1t_t;
        cS.ito  = cS.gto*cS.r*cS.to*(cS.v-Eto);
        
        zINaCa1  = zINaCa1t_t;
        zINaCa2  = zINaCa2t_t;
        cS.inaca = cS.nai*cS.nai*cS.nai*zINaCa1 - cS.cai*zINaCa2;
        
        zINaK    = zINaKt_t;
        hlp      = cS.kmnai/cS.nai;
        hlp2     = 1.0/(1.0+Math.sqrt(hlp*hlp*hlp));
        cS.inak  = zINaK*hlp2;      
        
        cS.itot =  cS.ica + cS.icab + cS.ik1 + cS.ikr + cS.iks +  cS.ina  + cS.inab + cS.inaca + cS.inak + cS.ito + cS.iss;
        
        //cS.inak , cS.ik1
        //cS.itot =    cS.ik1 + cS.inak  + cS.ikr + cS.ina  + cS.ito + cS.iss;
        //console.log(cS.ica , cS.icab ,cS.ik1 , cS.ikr , cS.iks, cS.ina , cS.inab , cS.inaca , cS.inak , cS.ito , cS.iss);
        
        //The membrane potential and concentrations */
        cS.v = cS.v - cS.timestep * cS.itot;
        
        
        if ((vold < 0.0) && (cS.v > 0.0) && (((count % cS.bcl)-(cS.ti+2) )< 10.0)) {             
            cS.caitotvmax = cS.caitot;
            cS.tvmax      = count*cS.timestep;
        }
        
        //The membrane potential and concentrations
        cS.cansr = cS.cansr + cS.timestep*(cS.iup - cS.ileak - (cC.VR_JSR_NSR * cS.itr));     
        cS.cajsrtot = cS.cajsrtot+ cS.timestep*(cS.itr - cS.irel);
        cS.cajsr = -0.047671 + cS.cajsrtot * ( 0.11596 + cS.cajsrtot * ( cS.cajsrtot *0.0019814 - 0.0062985 ) );
        hlp = (cS.icab + cS.ica - 2.0* cS.inaca)/ cC.Vmyo2F;
        hlp2 =  cC.VR_NSR_myo*(cS.iup - cS.ileak);
        hlp3 =  cC.VR_JSR_myo*cS.irel;      
        cS.caitot = cS.caitot + cS.timestep*(hlp3-hlp2-hlp);
        cS.cai = -5.8407E-5+cS.caitot*(0.012799+cS.caitot*(cS.caitot*3.8692-0.17534));
        dKi = -(cS.ito+cS.iss+cS.ik1+cS.ikr+cS.iks-2.0*cS.inak)/(cS.vmyo*cS.fc);
        dNai= -(cS.ina+cS.inab+3.0*cS.inaca+3.0*cS.inak)/(cS.vmyo*cS.fc);
        cS.ki = cS.ki+ cS.timestep*dKi;
        cS.nai = cS.nai+cS.timestep*dNai;
        
        cS.ileak = cS.kleak*cS.cansr;
        cS.itr = (cS.cansr - cS.cajsr)/180.0;
        cS.iup = cS.giup*(cS.cai/(cS.cai+0.00092));
        
        
        if (cS.cicr === 1) {
            hlp = cS.dcai2 - cS.dcaith;
            hlp2 = Math.exp(-(count*cS.timestep - cS.tcicr0)/4.0); 
            hlp3 = 22.0*(hlp/(hlp+0.0008))*(1.0-hlp2)*hlp2;
            cS.irel = hlp3*(cS.cajsr - cS.cai);      
        }
        else { 
            cS.irel = 0.0;
        }  
        
        //Switching on and off Irel 
        if ( ((count * cS.timestep) < (cS.tvmax + 2.0)) && (((count*cS.timestep)+cS.timestep) > (cS.tvmax+2.0)) ) {     
            cS.dcai2 = cS.caitot - cS.caitotvmax;
            if ( cS.dcai2 > cS.dcaith ){
                cS.cicr = 1;
                cS.tcicr0 = count * cS.timestep;                   
            }
        }
        
        if (  (count*cS.timestep < (cS.tvmax+100.0))    &&                    
        ((count*cS.timestep+cS.timestep)>(cS.tvmax+100.0)) ) {
            cS.cicr = 0;
        } 
        
        
        //cal ends
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
        
        this.RTon2F = 8.3143 * 310.15/(2.0 * c.fc),
        this.RTonF =  2.0 * this.RTon2F,
        this.Vmyo2F = 2.0 * c.vmyo * c.fc,
        this.VR_JSR_myo = c.vjsr/c.vmyo,
        this.VR_JSR_NSR = c.vjsr/c.vnsr,
        this.VR_NSR_myo = c.vnsr/c.vmyo
    }
    
    
    function _getNumIterations(settings) {
        var c   =    settings.calculationSettings;
        var num   =    (((c.s1 * c.ns1) + c.s2) * 1.1) / c.timestep;
        num   =    Math.floor(num);
        return num;    
    } 
    
    
    function runCalculations(iterations, settings) {
        var state   =   settings,
        curAnalyzer; 
        
        //here 'count' is global variable
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
        
        /** 
            * Run the calculations the appropriate number of times and 
            * pass these values to the analyzers using their aggregate
            * function
        */
        
        for (var i = 0; i < numCalculations; i++) {
            var data = calculateNext(state);         
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
        console.log(settings);
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
                stim   =    - c.istim;
            }
        }
        var lastPeriodX   =    utils.round(stimuli.s2 / c.timestep);
        if ((count >=    lastPeriodX) && (count < lastPeriodX + dur)) {
            stim   =    - c.istim;
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
        calculateNext: calculateNext,
        updateSettingsWithAnalyzers : updateSettingsWithAnalyzers,
        reset: reset,
    };
    return api;
});