/**
    * This module is responsible for performing the differential equation
    * calculation for TenTusscherReducedCalculator. The object maintains the state of the different
    * variables and returns them after each calculation. These variables can also
    * be reset. 
*/

define(["utility"],
function TenTusscherReducedCalculator(utils) {
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
    settings = utils.extend(newSettings);    
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
    var Ak1, Bk1, rec_iK1, rec_iNaK, rec_ipK, AM,
    BM, TAU_M, M_INF, AH_1, BH_1, TAU_H, H_INF,
    AJ_1, BJ_1, TAU_J, J_INF, Xr1_INF, axr1, bxr1, TAU_Xr1, Xr2_INF,
    Xs_INF, Axs, Bxs, TAU_Xs, R_INF, S_INF, TAU_S, D_INF, F_INF,
    Af, Bf, Cf, TAU_F, F2_INF, Af2, Bf2, Cf2, TAU_F2, sItot;
    
    var AH_2, BH_2, AJ_2, BJ_2;
    
    //voltage = dependent gating info
    Ak1 = 0.1/(1.+Math.exp(0.06*(cS.v-cC.Ek-200)))
    Bk1 = (3.*Math.exp(0.0002*(cS.v-cC.Ek+100))+Math.exp(0.1*(cS.v-cC.Ek-10)))/(1.+Math.exp(-0.5*(cS.v-cC.Ek)));
    rec_iK1 = Ak1/(Ak1+Bk1);
    rec_iNaK = (1.0/(1.+0.1245*Math.exp(-0.1*cS.v*cC.fort)+0.0353*Math.exp(-cS.v*cC.fort)));
    rec_ipK = 1.0/(1.+Math.exp((25-cS.v)/5.98));
    
    AM = 1.0/(1.+Math.exp((-60.-cS.v)/5.));
    BM = 0.1/(1.+Math.exp((cS.v+35.)/5.))+0.10/(1.+Math.exp((cS.v-50.)/200.));
    TAU_M = AM*BM;
    M_INF = 1.0/((1.+Math.exp((-56.86-cS.v)/9.03))*(1.+Math.exp((-56.86-cS.v)/9.03)));
    
    if (cS.v  >= -40.){
      AH_1 = 0.; 
      BH_1 = (0.77/(0.13*(1.+Math.exp(-(cS.v+10.66)/11.1))));
      TAU_H =  1.0/(AH_1+BH_1);
    }
    else {
      AH_2 = (0.057*Math.exp(-(cS.v+80.)/6.8));
      BH_2 = (2.7*Math.exp(0.079*cS.v)+(3.1e5)*Math.exp(0.3485*cS.v));
      TAU_H = 1.0/(AH_2+BH_2);
    }
    H_INF = 1.0/((1.+Math.exp((cS.v+71.55)/7.43))*(1.+Math.exp((cS.v+71.55)/7.43)));
    
    if(cS.v  >= -40.){
      AJ_1 = 0.; 
      BJ_1 = (0.6*Math.exp((0.057)*cS.v)/(1.+Math.exp(-0.1*(cS.v+32.))));
      TAU_J =  1.0/(AJ_1+BJ_1);
    }
    else{
      AJ_2 = (((-2.5428e4)*Math.exp(0.2444*cS.v)-(6.948e-6)*Math.exp(-0.04391*cS.v))*(cS.v+37.78)/
      (1.+Math.exp(0.311*(cS.v+79.23))));    
      BJ_2 = (0.02424*Math.exp(-0.01052*cS.v)/(1.+Math.exp(-0.1378*(cS.v+40.14))));
      TAU_J =  1.0/(AJ_2+BJ_2);
    }
    J_INF = H_INF;
    
    Xr1_INF = 1.0/(1.+Math.exp((-26.-cS.v)/7.));
    axr1 = 450.0/(1.+Math.exp((-45.-cS.v)/10.));
    bxr1 = 6.0/(1.+Math.exp((cS.v-(-30.))/11.5));
    TAU_Xr1 = axr1*bxr1;
    Xr2_INF = 1.0/(1.+Math.exp((cS.v-(-88.))/24.));
    
    Xs_INF = 1.0/(1.+Math.exp((-5.-cS.v)/14.));
    Axs = (1400.0/(Math.sqrt(1.+Math.exp((5.-cS.v)/6))));
    Bxs = (1.0/(1.+Math.exp((cS.v-35.)/15.)));
    TAU_Xs = Axs*Bxs+80
    
    if(cS.iType === "epi"){
      //epi
      R_INF = 1.0/(1.+Math.exp((20-cS.v)/6.));
      S_INF = 1.0/(1.+Math.exp((cS.v+20)/5.));
      TAU_S = 85.*Math.exp(-(cS.v+45.)*(cS.v+45.)/320.)+5.0/(1.+Math.exp((cS.v-20.)/5.))+3.;
    }
    else if(cS.iType === "endo"){
      
      //endo
      R_INF = 1.0/(1.+Math.exp((20-cS.v)/6.));
      S_INF = 1.0/(1.+Math.exp((cS.v+28)/5.));
      TAU_S = 1000.*Math.exp(-(cS.v+67)*(cS.v+67)/1000.)+8.;
    }
    else{
      //mid
      R_INF = 1.0/(1.+Math.exp((20-cS.v)/6.));
      S_INF = 1.0/(1.+Math.exp((cS.v+20)/5.));
      TAU_S = 85.*Math.exp(-(cS.v+45.)*(cS.v+45.)/320.)+5.0/(1.+Math.exp((cS.v-20.)/5.))+3.;
    }
    
    D_INF = 1.0/(1.+Math.exp((-8-cS.v)/7.5));
    F_INF = 1.0/(1.+Math.exp((cS.v+20)/7));
    Af = 1102.5*Math.exp(-(cS.v+27)*(cS.v+27)/225);
    Bf = 200.0/(1+Math.exp((13-cS.v)/10.));
    Cf = (180.0/(1+Math.exp((cS.v+30)/10)))+20;
    TAU_F = Af+Bf+Cf;
    F2_INF = 0.67/(1.+Math.exp((cS.v+35)/7))+0.33;
    Af2 = 600*Math.exp(-(cS.v+27)*(cS.v+27)/170);
    Bf2 = 7.75/(1.+Math.exp((25-cS.v)/10));
    Cf2 = 16/(1.+Math.exp((cS.v+30)/10));
    TAU_F2 = Af2+Bf2+Cf2;
    
    //update gates
    cS.sm  =  M_INF-(M_INF-cS.sm)*Math.exp(-cS.timestep/TAU_M);
    cS.sh  =  H_INF-(H_INF-cS.sh)*Math.exp(-cS.timestep/TAU_H);
    cS.sj  =  J_INF-(J_INF-cS.sj)*Math.exp(-cS.timestep/TAU_J);
    cS.sxr1  =  Xr1_INF-(Xr1_INF-cS.sxr1)*Math.exp(-cS.timestep/TAU_Xr1);
    cS.sxs  =  Xs_INF-(Xs_INF-cS.sxs)*Math.exp(-cS.timestep/TAU_Xs);
    cS.ss =  S_INF-(S_INF-cS.ss)*Math.exp(-cS.timestep/TAU_S);
    cS.sf  = F_INF-(F_INF-cS.sf)*Math.exp(-cS.timestep/TAU_F); 
    cS.sf2  = F2_INF-(F2_INF-cS.sf2)*Math.exp(-cS.timestep/TAU_F2);
    
    //compute currents
    cS.ina = cS.GNa*cS.sm*cS.sm*cS.sm*cS.sh*cS.sj*(cS.v-cC.Ena);
    cS.ical = cS.GCaL*D_INF*cS.sf*cS.sf2*(cS.v-60);
    cS.ito = cS.Gto*R_INF*cS.ss*(cS.v-cC.Ek);
    cS.ikr = cS.Gkr*Math.sqrt(cS.Ko/5.4)*cS.sxr1*Xr2_INF*(cS.v-cC.Ek);
    cS.iks = cS.Gks*cS.sxs*cS.sxs*(cS.v-cC.Eks);
    cS.ik1 = cS.GK1*rec_iK1*(cS.v-cC.Ek);
    cS.inaca = cS.knaca*(1.0/(cS.KmNai*cS.KmNai*cS.KmNai+cS.Nao*cS.Nao*cS.Nao))*(1.0/(cS.KmCa+cS.Cao))*(1.0/(1+cS.ksat*Math.exp((cS.eta-1)*cS.v*cC.fort)))*(Math.exp(cS.eta*cS.v*cC.fort)*cS.Nai*cS.Nai*cS.Nai*cS.Cao-Math.exp((cS.eta-1)*cS.v*cC.fort)*cS.Nao*cS.Nao*cS.Nao*cS.Cai*2.5);
    cS.inak = cS.knak*(cS.Ko/(cS.Ko+cS.KmK))*(cS.Nai/(cS.Nai+cS.KmNa))*rec_iNaK;
    cS.ipca = cS.GpCa*cS.Cai/(cS.KpCa+cS.Cai);
    cS.ipk = cS.GpK*rec_ipK*(cS.v-cC.Ek);
    cS.ibna = cS.GbNa*(cS.v-cC.Ena);
    cS.ibca = cS.GbCa*(cS.v-cC.Eca);
    
    cS.istim = _s1s2Stimulus(count, data);
    
    sItot = cS.ikr*cS.iks+cS.ik1+cS.ito+cS.ina+cS.ibna+cS.ical+cS.ibca+cS.inak+cS.inaca+cS.ipca+cS.ipk+cS.istim;
    
    
    //update voltage
    cS.v =  cS.v + cS.timestep*(-sItot);
    
    
    /*//voltage = dependent gating info
      Ak1 = 0.1/(1.+Math.exp(0.06*(cS.v-cC.Ek-200)));
      Bk1=(3.*Math.exp(0.0002*(cS.v-cC.Ek+100))+Math.exp(0.1*(cS.v-cC.Ek-10)))/(1.+Math.exp(-0.5*(cS.v-cC.Ek)));
      rec_iK1 = Ak1/(Ak1+Bk1);
      rec_iNaK = (1.0/(1.+0.1245*Math.exp(-0.1*cS.v*cC.fort)+0.0353*Math.exp(-cS.v*cC.fort)));
      rec_ipK = 1.0/(1.+Math.exp((25-cS.v)/5.98));
      
      AM = 1.0/(1.+Math.exp((-60.-cS.v)/5.));
      BM = 0.1/(1.+Math.exp((cS.v+35.)/5.))+0.10/(1.+Math.exp((cS.v-50.)/200.));
      TAU_M = AM*BM;
      M_INF = 1.0/((1.+Math.exp((-56.86-cS.v)/9.03))*(1.+Math.exp((-56.86-cS.v)/9.03)));
      
      AH_1  =  (cS.v >= -40.0) ? 0.0 : (0.057*Math.exp(-(cS.v+80.)/6.8));
      BH_1  =  (cS.v >= -40.0) ? (0.77/(0.13*(1.+Math.exp(-(cS.v+10.66)/11.1)))): (2.7*Math.exp(0.079*cS.v)+(3.1e5)*Math.exp(0.3485*cS.v));
      TAU_H  =  1.0/(AH_1+BH_1);      
      H_INF = 1.0/((1.+Math.exp((cS.v+71.55)/7.43))*(1.+Math.exp((cS.v+71.55)/7.43)));
      
      AJ_1  =   (cS.v >= -40.0)?0.:(((-2.5428e4)*Math.exp(0.2444*cS.v)-(6.948e-6)*Math.exp(-0.04391*cS.v))*(cS.v+37.78)/(1.+Math.exp(0.311*(cS.v+79.23))));
      BJ_1  =   (cS.v >= -40.0)?(0.6*Math.exp((0.057)*cS.v)/(1.+Math.exp(-0.1*(cS.v+32.)))):(0.02424*Math.exp(-0.01052*cS.v)/(1.+Math.exp(-0.1378*(cS.v+40.14))));
      TAU_J  =   1.0/(AJ_1+BJ_1);       
      J_INF  =  H_INF;
      
      Xr1_INF = 1.0/(1.+Math.exp((-26.-cS.v)/7.));
      axr1 = 450.0/(1.+Math.exp((-45.-cS.v)/10.));
      bxr1 = 6.0/(1.+Math.exp((cS.v-(-30.))/11.5));
      TAU_Xr1 = axr1*bxr1;
      Xr2_INF = 1.0/(1.+Math.exp((cS.v-(-88.))/24.));
      
      Xs_INF = 1.0/(1.+Math.exp((-5.-cS.v)/14.));
      Axs = (1400.0/(Math.sqrt(1.+Math.exp((5.-cS.v)/6))));
      Bxs = (1.0/(1.+Math.exp((cS.v-35.)/15.)));
      TAU_Xs = Axs*Bxs+80;
      
      if(cS.iType == "epi"){
      //epi
      R_INF = 1.0/(1.+Math.exp((20-cS.v)/6.));
      S_INF = 1.0/(1.+Math.exp((cS.v+20)/5.));
      TAU_S = 85.0*Math.exp(-(cS.v+45.)*(cS.v+45.)/320.)+5.0/(1.0+Math.exp((cS.v-20.)/5.))+3.0;
      }
      else if(cS.iType == "endo"){
      //endo
      R_INF = 1.0/(1.+Math.exp((20-cS.v)/6.));
      S_INF = 1.0/(1.+Math.exp((cS.v+28)/5.));
      TAU_S = 1000.0*Math.exp(-(cS.v+67)*(cS.v+67)/1000.)+8.;
      }
      else{
      //mid
      R_INF = 1.0/(1.+Math.exp((20-cS.v)/6.));
      S_INF = 1.0/(1.+Math.exp((cS.v+20)/5.));
      TAU_S = 85.0*Math.exp(-(cS.v+45.)*(cS.v+45.)/320.)+5.0/(1.0+Math.exp((cS.v-20.)/5.))+3.0;
      }
      
      D_INF = 1.0/(1.+Math.exp((-8-cS.v)/7.5));
      F_INF = 1.0/(1.+Math.exp((cS.v+20)/7));
      Af = 1102.5*Math.exp(-(cS.v+27)*(cS.v+27)/225);
      Bf = 200.0/(1+Math.exp((13-cS.v)/10.));
      Cf=(180.0/(1+Math.exp((cS.v+30)/10)))+20;
      TAU_F = Af+Bf+Cf;
      F2_INF = 0.67/(1.+Math.exp((cS.v+35)/7))+0.33;
      Af2 = 600*Math.exp(-(cS.v+27)*(cS.v+27)/170);
      Bf2 = 7.75/(1.+Math.exp((25-cS.v)/10));
      Cf2 = 16/(1.+Math.exp((cS.v+30)/10));
      TAU_F2 = Af2+Bf2+Cf2;
      
      //update gates
      cS.sm  =  M_INF-(M_INF-cS.sm)*Math.exp(-cS.timestep/TAU_M);
      cS.sh  =  H_INF-(H_INF-cS.sh)*Math.exp(-cS.timestep/TAU_H);
      cS.sj  =  J_INF-(J_INF-cS.sj)*Math.exp(-cS.timestep/TAU_J);
      cS.sxr1  =  Xr1_INF-(Xr1_INF-cS.sxr1)*Math.exp(-cS.timestep/TAU_Xr1);
      cS.sxs  =  Xs_INF-(Xs_INF-cS.sxs)*Math.exp(-cS.timestep/TAU_Xs);
      cS.ss =  S_INF-(S_INF-cS.ss)*Math.exp(-cS.timestep/TAU_S);
      cS.sf  = F_INF-(F_INF-cS.sf)*Math.exp(-cS.timestep/TAU_F);
      cS.sf2  = F2_INF-(F2_INF-cS.sf2)*Math.exp(-cS.timestep/TAU_F2); 
      
      //compute currents
      cS.ina = cS.GNa*cS.sm*cS.sm*cS.sm*cS.sh*cS.sj*(cS.v-cC.Ena);
      cS.ical = cS.GCaL*D_INF*cS.sf*cS.sf2*(cS.v-60);
      cS.ito =  cS.Gto*R_INF*cS.ss*(cS.v-cC.Ek);
      cS.ikr = cS.Gkr*Math.sqrt(cS.Ko/5.4)*cS.sxr1*Xr2_INF*(cS.v-cC.Ek);
      cS.iks = cS.Gks*cS.sxs*cS.sxs*(cS.v-cC.Eks);
      cS.ik1 = cS.GK1*rec_iK1*(cS.v-cC.Ek);
      cS.inaca = cS.knaca*(1.0/(cS.KmNai*cS.KmNai*cS.KmNai+cS.Nao*cS.Nao*cS.Nao))*(1.0/(cS.KmCa+cS.Cao))*(1.0/(1+cS.ksat*Math.exp((cS.eta-1)*cS.v*cC.fort)))*(Math.exp(cS.eta*cS.v*cC.fort)*cS.Nai*cS.Nai*cS.Nai*cS.Cao- Math.exp((cS.eta-1)*cS.v*cC.fort)*cS.Nao*cS.Nao*cS.Nao*cS.Cai*2.5);
      cS.inak = cS.knak*(cS.Ko/(cS.Ko+cS.KmK))*(cS.Nai/(cS.Nai+cS.KmNa))*rec_iNaK;
      cS.ipca = cS.GpCa*cS.Cai/(cS.KpCa+cS.Cai);
      cS.ipk = cS.GpK*rec_ipK*(cS.v-cC.Ek);
      cS.ibna = cS.GbNa*(cS.v-cC.Ena);
      cS.ibca = cS.GbCa*(cS.v-cC.Eca);
      
      cS.istim = _s1s2Stimulus(count, data);
      
      sItot = cS.ikr*cS.iks+cS.ik1+cS.ito+cS.ina+cS.ibna+cS.ical+cS.ibca+cS.inak+cS.inaca+cS.ipca+cS.ipk+cS.istim;
      
      //update voltage
    cS.v =  cS.v + cS.timestep*(-sItot);*/
    
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
    this.rtof = c.RR*c.TT/c.FF;
    this.fort = 1.0/this.rtof;
    this.Ek = this.rtof*(Math.log((c.Ko/c.Ki)));
    this.Ena = this.rtof*(Math.log((c.Nao/c.Nai)));
    this.Eks = this.rtof*(Math.log((c.Ko+c.pKNa*c.Nao)/(c.Ki+c.pKNa*c.Nai)));
    this.Eca = 0.5*this.rtof*(Math.log((c.Cao/c.Cai)));         
  }
  
  
  function _getNumIterations(settings) {
    var c   =    settings.calculationSettings;
    var num = ((c.s1 * (c.ns1 - 1)) + (2 * c.s2)) / c.timestep;
    num   =    Math.floor(num);
    return num;    
  } 
  
  
  function runCalculations(iterations, settings) {
    var state   =   settings,
    curAnalyzer; 
    
    //here 'count' is global variable
    count   =    0;
    
    cS =   _.cloneDeep(settings.calculationSettings);      
    cC =   new CalcConstants(settings.calculationSettings); 
    
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
          if(   (analyzers[curAnalyzer].analyzerName === "PointBufferAnalyzer" || analyzers[curAnalyzer].analyzerName === "APDAnalyzer") 
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
        stim   =    c.stimstrength;
      }
    }
    var lastPeriodX   =    utils.round(stimuli.s2 / c.timestep);
    if ((count >=    lastPeriodX) && (count < lastPeriodX + dur)) {
            stim   =    c.stimstrength;
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