/**
    * This module is responsible for performing the differential equation
    * calculation for TenTusscherCalculator. The object maintains the state of the different
    * variables and returns them after each calculation. These variables can also
    * be reset. 
*/

define(["utility"],
function TenTusscherCalculator(utils) {
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
    
    var AM, BM, AH_1, BH_1, AJ_1, BJ_1, temp, factor, Ak1, Bk1, tempc, cc2, cc4, cc6, cc8, cc16,
    Ek, Ena, Eks, Eca, exp2vfort, INaCa1,
    INaCa2, INaKcoeff, IpKcoeff, Caisquare, CaSRsquare, CaCurrent, A, Irel, Ileak, SERCA, 
    CaSRCurrent, CaCSQN, dCaSR, bjsr, cjsr, CaBuf, dCai, bc, cc, dNai, dKi,
    expTAU_M, M_INF, expTAU_H, H_INF, expTAU_J, J_INF, Xr1_INF, expTAU_Xr1, 
    Xr2_INF, expTAU_Xr2, Xs_INF, expTAU_Xs, R_INF, S_INF, expTAU_R, 
    expTAU_S, D_INF, expTAU_D, F_INF, expTAU_F, FCa_INF, G_INF, gold;
    
    
    var INaKcoefft_t, IpKcoefft_t, exptaumt_t, m_inft_t, exptauht_t, exptaujt_t, h_inft_t,
    xr1_inft_t, exptauxr1t_t, xr2_inft_t, exptauxr2t_t, xs_inft_t, exptauxst_t,
    r_inft_t, s_inft_t, exptaurt_t, exptaust_t,
    d_inft_t, exptaudt_t, f_inft_t, exptauft_t, INaCa1t_t, INaCa2t_t, exp2vfortt_t, IK1t_t,
    fcainft_t, ginft_t;
    
    
    
    //table setup starts
    
    INaKcoefft_t  =   cS.knak*(cS.Ko/(cS.Ko+cS.KmK)) * ( 1.0 /( 1.+0.1245 * Math.exp(-0.1 * cS.v * cS.F/(cS.R * cS.T)) + 0.0353 * Math.exp(- cS.v * cS.F/(cS.R * cS.T))));
    IpKcoefft_t   = cS.GpK/(1.+ Math.exp((25 - cS.v)/5.98));
    
    AM  =   1.0/(1.+ Math.exp((-60.- cS.v)/5.));     
    BM  = 0.1/(1.+Math.exp((cS.v + 35.)/5.))+0.10/(1.+ Math.exp((cS.v-50.)/200.)); 
    
    exptaumt_t  = Math.exp(- cS.timestep/(AM*BM)); 
    m_inft_t  = 1.0/((1.+ Math.exp((-56.86-cS.v)/9.03))*(1.+ Math.exp((-56.86-cS.v)/9.03)));
    
    AH_1    = (cS.v > -40.) ? 0. : (0.057 * Math.exp(-(cS.v + 80.)/6.8));
    BH_1    = (cS.v > -40.) ? (0.77/(0.13*(1.+ Math.exp(-(cS.v+10.66)/11.1)))) : (2.7*Math.exp(0.079*cS.v)+(3.1e5)*Math.exp(0.3485*cS.v));
    exptauht_t  = (cS.v > -40.) ? Math.exp(-cS.timestep/(1.0/(AH_1+BH_1))) : Math.exp(-cS.timestep/(1.0/(AH_1+BH_1)));
    AJ_1    = (cS.v > -40.) ? 0. : (((-2.5428e4)*Math.exp(0.2444*cS.v)-(6.948e-6)*Math.exp(-0.04391*cS.v))*(cS.v+37.78)/(1.+Math.exp(0.311*(cS.v+79.23))));
    BJ_1    = (cS.v > -40.) ? (0.6*Math.exp((0.057)*cS.v)/(1.+Math.exp(-0.1*(cS.v+32.)))) : (0.02424*Math.exp(-0.01052*cS.v)/(1.+Math.exp(-0.1378*(cS.v+40.14)))); 
    exptaujt_t  = (cS.v > -40.) ? Math.exp(-cS.timestep/(1.0/(AJ_1+BJ_1))) : Math.exp(-cS.timestep/(1.0/(AJ_1+BJ_1)));   
    
    h_inft_t = 1.0/((1.+ Math.exp((cS.v+71.55)/7.43))*(1.+Math.exp((cS.v+71.55)/7.43)));
    
    
    xr1_inft_t    = 1.0/(1.+Math.exp((-26.-cS.v)/7.));
    exptauxr1t_t  = Math.exp(-cS.timestep/((450.0 /(1.0+ Math.exp((-45.- cS.v)/10.)))*(6.0/(1.0+Math.exp((cS.v-(-30.))/11.5)))));
    xr2_inft_t    = 1.0/(1.+Math.exp((cS.v-(-88.))/24.));     
    
    exptauxr2t_t = Math.exp(-cS.timestep/((3.0/(1.+ Math.exp((-60.-cS.timestep)/20.)))*(1.12/(1.+Math.exp((cS.v-60.)/20.)))));
    xs_inft_t  = 1.0/(1.+ Math.exp((-5.-cS.v)/14.));
    exptauxst_t  = Math.exp(-cS.timestep/((1100.0/(Math.sqrt(1.+ Math.exp((-10.-cS.v)/6))))*(1.0/(1.+ Math.exp((cS.v-60.)/20.)))));
    
    //itype = 1
    
    // table setup stops
    //set itype=1 for epi, =2 for M, =3 for endo
    switch(cS["iType"]){
      case "M":
      r_inft_t = 1.0/(1.+Math.exp((20-cS.v)/6.));
      s_inft_t = 1.0/(1.+Math.exp((cS.v+20)/5.));
      exptaurt_t = Math.exp(-cS.timestep/(9.5*Math.exp(-(cS.v+40.)*(cS.v+40.)/1800.)+0.8));
      exptaust_t = Math.exp(-cS.timestep/(85.*Math.exp(-(cS.v+45.)*(cS.v+45.)/320.)+5.0/(1.+Math.exp((cS.v-20.)/5.))+3.));                         
      break;
      case "endo":
      r_inft_t = 1.0/(1.+Math.exp((20-cS.v)/6.));
      s_inft_t = 1.0/(1.+Math.exp((cS.v+28)/5.));
      exptaurt_t = Math.exp(-cS.timestep/(9.5*Math.exp(-(cS.v+40.)*(cS.v+40.)/1800.)+0.8));
      exptaust_t = Math.exp(-cS.timestep/(1000.*Math.exp(-(cS.v+67)*(cS.v+67)/1000.)+8.));
      break;
      // it defaults to 'epi'
      default:                  
      r_inft_t  = 1.0/(1.+Math.exp((20-cS.v)/6.));
      s_inft_t  = 1.0/(1.0+Math.exp((cS.v+20)/5.));
      exptaurt_t  = Math.exp(-cS.timestep/(9.5*Math.exp(-(cS.v+40.)*(cS.v+40.)/1800.)+0.8));
      exptaust_t  = Math.exp(-cS.timestep/(85.*Math.exp(-(cS.v+45.)*(cS.v+45.)/320.)+5.0/(1.0+Math.exp((cS.v-20.)/5.))+3.));
      break;
    }
    
    
    d_inft_t  = 1.0/(1.+Math.exp((-5.-cS.v)/7.5));
    exptaudt_t  = Math.exp(-cS.timestep/((1.4/(1.+Math.exp((-35.-cS.v)/13.))+0.25)*(1.4/(1.+Math.exp((cS.v+5.)/5.)))+1.0/(1.+Math.exp((50-cS.v)/20.))));
    f_inft_t  = 1.0/(1.+Math.exp((cS.v+20.)/7.));
    exptauft_t  = Math.exp(-cS.timestep/(1125*Math.exp(-(cS.v+27)*(cS.v+27.)/240)+80.+165/(1.+Math.exp((25.-cS.v)/10))));     
    temp    = Math.exp((cS.n-1)*cS.v*cS.F/(cS.R*cS.T));
    factor    = cS.knaca/(cC.KmNai3+cC.Nao3)/(cS.KmCa+cS.Cao)/(1.+cS.ksat*temp);
    INaCa1t_t   = factor*Math.exp(cS.n*cS.v*cS.F/(cS.R*cS.T))*cS.Cao;
    INaCa2t_t   = factor*temp*cC.Nao3;
    exp2vfortt_t = Math.exp(2*cS.v/cC.RTONF); 
    
    
    //       compute reversal potentials
    
    Ek  = cC.RTONF*(Math.log((cS.Ko/cS.ki)));
    Ena = cC.RTONF*(Math.log((cS.Nao/cS.nai)));
    Eks = cC.RTONF*(Math.log((cS.Ko+cS.pKNa*cS.Nao)/(cS.ki+cS.pKNa*cS.nai)));
    Eca = 0.5*cC.RTONF*(Math.log((cS.Cao/cS.cai)));
    Ak1 = 0.1/(1.+Math.exp(0.06*(cS.v - Ek-200)));
    Bk1 = (3.*Math.exp(0.0002*(cS.v-Ek+100))+Math.exp(0.1*(cS.v-Ek-10)))/(1.+Math.exp(-0.5*(cS.v-Ek)));
    
    
    //here vv is actually v - ek
    Ak1   = 0.1/(1.+Math.exp(0.06*((cS.v - Ek)-200.)));
    Bk1    = (3.*Math.exp(0.0002*((cS.v - Ek)+100.))+Math.exp(0.1*((cS.v - Ek)-10.)))/(1.+Math.exp(-0.5*(cS.v - Ek)));      
    IK1t_t  = cS.GK1*(cS.v - Ek)*Ak1/(Ak1+Bk1); 
    
    // Go back for fcainft_t
    fcainft_t = (1.0/(1.+(Math.pow((cS.cai/0.000325),8)))+0.1/(1.+Math.exp((cS.cai-0.0005)/0.0001))+0.20/(1.+ Math.exp((cS.cai-0.00075)/0.0008))+0.23 )/1.46;
    
    
    tempc   = cS.cai/0.00035;
    cc2   = tempc*tempc;
    cc4   = cc2*cc2;
    cc6   = cc2*cc4;
    cc8   = cc4*cc4;
    cc16  = cc8*cc8;
    
    ginft_t = (cS.cai < 0.00035) ? 1.0/(1.+cc6) :1.0/(1.+cc16);
    
    //table ends 
    
    
    //stimulus
        cS.istim    =  _s1s2Stimulus(count, data);
    
    //Compute currents 
    cS.ina    = cS.GNa * cS.sm * cS.sm * cS.sm * cS.sh * cS.sj * (cS.v - Ena);
    
    exp2vfort   = exp2vfortt_t;
    
    cS.ical   = cC.ICalcoeff * cS.sd * cS.sf * cS.sfca * cS.v * (exp2vfort * cS.cai-0.341* cS.Cao)/(exp2vfort-1.0);             
    
    cS.ito    = cS.Gto * cS.sr * cS.ss*(cS.v-Ek);
    cS.ikr    = cS.Gkr*cC.sqrtko54*cS.sxr1*cS.sxr2*(cS.v-Ek);
    cS.iks    = cS.Gks*cS.sxs*cS.sxs*(cS.v-Eks);
    cS.ik1    = IK1t_t;
    
    INaCa1    = INaCa1t_t;
    INaCa2    = INaCa2t_t;
    
    cS.inaca  = INaCa1*cS.nai*cS.nai*cS.nai-INaCa2*cS.cai*2.5;
    
    INaKcoeff   = INaKcoefft_t;
    
    cS.inak   = INaKcoeff*(cS.nai/(cS.nai+cS.KmNa));
    cS.ipca   = cS.GpCa*cS.cai/(cS.KpCa+cS.cai);
    
    IpKcoeff  = IpKcoefft_t;
    
    cS.ipk    = IpKcoeff*(cS.v-Ek);
    cS.ibna   = cS.GbNa*(cS.v - Ena);
    cS.ibca   = cS.GbCa*(cS.v-Eca);
    
    // Determine total current
    cS.sitot = cS.ikr+cS.iks+cS.ik1+cS.ito+cS.ina+cS.ibna+cS.ical+cS.ibca+cS.inak+cS.inaca+cS.ipca+cS.ipk+cS.istim;
        
    // update concentrations
    Caisquare  = Math.pow(cS.cai, 2); //cS.cai*cS.cai
    CaSRsquare = Math.pow(cS.casr, 2); //cS.casr* cS. CaSR
    CaCurrent=-(cS.ical+cS.ibca+cS.ipca-2*cS.inaca)*cC.inverseVcF2*cS.CAPACITANCE;
    A     = 0.016464*CaSRsquare/(0.0625+CaSRsquare)+0.008232;
    Irel  = A*cS.sd*cS.sg;
    Ileak = 0.00008*(cS.casr- cS.cai);
    SERCA = cS.Vmaxup/(1.+(cC.Kupsquare/Caisquare));
    CaSRCurrent = SERCA-Irel-Ileak;
    CaCSQN  = cS.Bufsr*cS.casr/(cS.casr+cS.Kbufsr);
    dCaSR   = cS.timestep*(cS.Vc/cS.Vsr)*CaSRCurrent;
    bjsr    = cS.Bufsr-CaCSQN-dCaSR-cS.casr+cS.Kbufsr;
    cjsr   = cS.Kbufsr*(CaCSQN+dCaSR+cS.casr);
    cS.casr = (Math.sqrt(bjsr*bjsr+4*cjsr)-bjsr)/2;
    CaBuf   = cS.Bufc * cS.cai/(cS.cai+cS.Kbufc);
    dCai    = cS.timestep*(CaCurrent-CaSRCurrent);
    bc      = cS.Bufc-CaBuf-dCai-cS.cai+cS.Kbufc;
    cc      = cS.Kbufc*(CaBuf+dCai+cS.cai);
    
    cS.cai  = (Math.sqrt(bc*bc+4*cc)-bc)/2;
    
    dNai  = -(cS.ina+cS.ibna+3*cS.inak+3*cS.inaca)*cC.inverseVcF*cS.CAPACITANCE;
    
    cS.nai =  cS.nai+ cS.timestep*dNai;
    
    dKi = -(cS.istim+cS.ik1+cS.ito+cS.ikr+cS.iks-2*cS.inak+cS.ipk)*cC.inverseVcF*cS.CAPACITANCE;
    
    cS.ki = cS.ki+cS.timestep*dKi; 
    
    //compute steady state values and time constants 
    
    expTAU_M =  exptaumt_t;
    M_INF =  m_inft_t;
    expTAU_H = exptauht_t;
    H_INF = h_inft_t;
    expTAU_J = exptaujt_t;
    J_INF = H_INF;
    Xr1_INF = xr1_inft_t;
    expTAU_Xr1 = exptauxr1t_t;
    Xr2_INF = xr2_inft_t;
    expTAU_Xr2 = exptauxr2t_t;
    Xs_INF = xs_inft_t;
    expTAU_Xs = exptauxst_t;
    R_INF = r_inft_t;
    S_INF = xs_inft_t;
    expTAU_R = exptaurt_t;
    expTAU_S = exptaust_t;
    D_INF = d_inft_t;
    expTAU_D = exptaudt_t;
    F_INF = f_inft_t;
    expTAU_F = exptauft_t;
    FCa_INF = fcainft_t;         
    G_INF = ginft_t;
    
    
    //Update gates
    cS.sm     =   M_INF-(M_INF-cS.sm)*expTAU_M;
    cS.sh     =   H_INF-(H_INF-cS.sh)*expTAU_H;
    cS.sj     =   J_INF-(J_INF-cS.sj)*expTAU_J;
    cS.sxr1   =   Xr1_INF-(Xr1_INF-cS.sxr1)*expTAU_Xr1;
    cS.sxr2   =   Xr2_INF-(Xr2_INF-cS.sxr2)*expTAU_Xr2;
    cS.sxs    =   Xs_INF-(Xs_INF-cS.sxs)*expTAU_Xs;
    cS.ss     =   S_INF-(S_INF-cS.ss)*expTAU_S;
    cS.sr     =   R_INF-(R_INF-cS.sr)*expTAU_R;
    cS.sd     =   D_INF-(D_INF-cS.sd)*expTAU_D;
    cS.sf     = F_INF-(F_INF-cS.sf)*expTAU_F;
    cS.fcaold   = cS.sfca;
    cS.sfca   = FCa_INF-(FCa_INF-cS.sfca)*cC.exptaufca;
    
    if ((cS.sfca > cS.fcaold) && (cS.v > -60) ){
      cS.sfca = cS.fcaold;
    }
    
    gold = cS.sg;
    cS.sg = G_INF - (G_INF- cS.sg) * cC.exptaug;
    
    if ((cS.sg > gold) && (cS.v > -60)){
      cS.sg = gold;
    }
    
    cS.v = cS.v - cS.sitot * cS.timestep;
    
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
    
    this.RTONF        =  (c.R * c.T)/c.F,
    this.inverseVcF2  =  1/(2*c.Vc * c.F),
    this.inverseVcF   =  1.0/(c.Vc * c.F),
    this.Kupsquare    =  c.Kup * c.Kup,
    this.exptaufca    = Math.exp(-c.timestep/c.taufca),
    this.exptaug      = Math.exp(-c.timestep/c.taug),
    this.sqrtko54     = Math.sqrt(c.Ko/5.4),
    this.Nao3         = Math.pow(c.Nao,3), //c.Nao*c.Nao*c.Nao
    this.KmNai3       = Math.pow(c.KmNai,3), //c.KmNai*c.KmNai*c.KmNai
    this.ICalcoeff    = c.GCaL*4.0*c.F/this.RTONF          
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
    
    cS         =   _.cloneDeep(settings.calculationSettings);      
    cC         =   new CalcConstants(settings.calculationSettings); 
    
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

    //console.log(settings);
    
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
    calculateNext: calculateNext,
    updateSettingsWithAnalyzers : updateSettingsWithAnalyzers,
    reset: reset,
  };
  return api;
});