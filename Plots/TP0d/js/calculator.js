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
          
          var AM, BM, TAU_M, AH, BH, TAU_H, AJ, BJ, TAU_J, axr1, bxr1, TAU_Xr1,
          axr2, bxr2, TAU_Xr2, Axs, Bxs, TAU_Xs, TAU_R, TAU_S, Ad, Bd, Cd, TAU_D, 
          Af, Bf, Cf, TAU_F, Af2, Bf2, Cf2, TAU_F2, temp, temp2, Ak1, Bk1,
          Ek, Ena, Eks, Eca, FCaSS_INF, exptaufcass, kCaSR, k1, k2, dRR,
          CaCSQN, dCaSR, bjsr, cjsr, CaSSBuf, dCaSS, bcss, ccss, CaBuf, dCai, bc, cc,
          dNai, dKi, sOO; 

          var minft_t, exptaumt_t, hinft_t, exptauht_t, jinft_t, exptaujt_t, xr1inft_t,
          exptauxr1t_t, xr2inft_t, exptauxr2t_t, xsinft_t, exptauxst_t, rinft_t , sinft_t,
          exptaurt_t, exptaust_t, dinft_t, exptaudt_t, finft_t, exptauft_t, f2inft_t, 
          exptauf2t_t, inakcoefft_t, ipkcoefft_t, ical1t_t, ical2t_t, inaca1t_t, inaca2t_t,
          ik1coefft_t, fcassinft_t, exptaufcasst_t; 


          sOO = ( cS[iType] === 'epi') ? 8.958e-8 : ( cS[iType] === 'endo' )  ? 8.848e-8 : 1.142e-7;  // (cS.itype === 'M')
               

          //table setup starts
          AM = 1.0/(1.+ Math.exp((-60.-cS.v)/5.));
          BM = 0.1/(1.+ Math.exp((cS.v+35.)/5.))+0.10/(1.+Math.exp((cS.v-50.)/200.));
          minft_t = 1.0/((1.+Math.exp((-56.86-cS.v)/9.03))*(1.+Math.exp((-56.86-cS.v)/9.03)));
          TAU_M = AM*BM;
          exptaumt_t = Math.exp(-cS.timestep/TAU_M);

          hinft_t = 1.0/((1.+Math.exp((cS.v+71.55)/7.43))*(1.+Math.exp((cS.v+71.55)/7.43)));
          
          AH  = (cS.v > -40) ? 0. : (0.057*Math.exp(-(cS.v+80.)/6.8));
          BH  = (cS.v > -40) ? (0.77/(0.13*(1.+Math.exp(-(cS.v+10.66)/11.1)))) 
          : (2.7*Math.exp(0.079*cS.v)+(3.1e5)*Math.exp(0.3485*cS.v));
          TAU_H = 1.0/(AH+BH);
          exptauht_t  =  Math.exp(-cS.timestep/TAU_H);

          AJ = (cS.v > -40) ? 0. : (((-2.5428e4)*Math.exp(0.2444*cS.v)-(6.948e-6)*Math.exp(-0.04391*cS.v))*(cS.v+37.78)/(1.+Math.exp(0.311*(cS.v+79.23))));
          BJ = (cS.v > -40) ? (0.6*Math.exp((0.057)*cS.v)/(1.+Math.exp(-0.1*(cS.v+32.))))
          : (0.02424*Math.exp(-0.01052*cS.v)/(1.+Math.exp(-0.1378*(cS.v+40.14))));
          TAU_J  = 1.0/(AJ+BJ);
          exptaujt_t = Math.exp(-cS.timestep/TAU_J);

          jinft_t  = hinft_t;

          xr1inft_t = 1.0/(1.+Math.exp((-26.-cS.v)/7.));

          axr1 = 450.0/(1.+Math.exp((-45.-cS.v)/10.));
          bxr1 = 6.0/(1.+Math.exp((cS.v-(-30.))/11.5));
          TAU_Xr1 = axr1*bxr1;
          exptauxr1t_t = Math.exp(-cS.timestep/TAU_Xr1);


          xr2inft_t = 1.0/(1.+Math.exp((cS.v-(-88.))/24.));
          
          axr2  = 3.0/(1.+Math.exp((-60.-cS.v)/20.));
          bxr2  = 1.12/(1.+Math.exp((cS.v-60.)/20.));
          TAU_Xr2 = axr2*bxr2;
          exptauxr2t_t = Math.exp(-cS.timestep/TAU_Xr2);

          xsinft_t = 1.0/(1.+ Math.exp((-5.-cS.v)/14.));

          Axs = (1400.0/(Math.sqrt(1.+Math.exp((5.-cS.v)/6.))));
          Bxs = (1.0/(1.+ Math.exp((cS.v-35.)/15.)));
          TAU_Xs = Axs*Bxs+80.;
          exptauxst_t = Math.exp(-cS.timestep/TAU_Xs);

          rinft_t  =    ( cS.itype === 'epi') ? 1.0/(1.+ Math.exp((20.- cS.v)/6.)) 
          : ( cS.itype === 'endo' )  ?  1.0/(1.+Math.exp((20.-cS.v)/6.))
                          : 1.0/(1.+ Math.exp((20.-cS.v)/6.)) ; // (cS.itype === 'M')

                          sinft_t =     ( cS.itype === 'epi') ? 1.0/(1.+Math.exp((cS.v+20.)/5.))
                          : ( cS.itype === 'endo' )  ? 1.0/(1.+ Math.exp((cS.v+28.)/5.))
                          :  1.0/(1.+ Math.exp((cS.v+20.)/5.)); // (cS.itype === 'M')

                          TAU_R =       ( cS.itype === 'epi') ? 9.5* Math.exp(-(cS.v+40.)*(cS.v+40.)/1800.)+0.8
                          : ( cS.itype === 'endo' )  ? 9.5* Math.exp(-(cS.v+40.)*(cS.v+40.)/1800.)+0.8
                          :  9.5* Math.exp(-(cS.v+40.)*(cS.v+40.)/1800.)+0.8; // (cS.itype === 'M')

                          TAU_S  =      ( cS.itype === 'epi') ? 85.* Math.exp(-(cS.v+45.)*(cS.v+45.)/320.) +5.0/(1.+Math.exp((cS.v-20.)/5.))+3.               
                          : ( cS.itype === 'endo' )  ? 1000.*Math.exp(-(cS.v+67.)*(cS.v+67.)/1000.)+8.
                          :  85.*Math.exp(-(cS.v+45.)*(cS.v+45.)/320.)+5.0/(1.+Math.exp((cS.v-20.)/5.))+3.; // (cS.itype === 'M')
                          
                          exptaurt_t = Math.exp(-cS.timestep/TAU_R);
                          exptaust_t = Math.exp(-cS.timestep/TAU_S);
                          
                          dinft_t = 1.0/(1.+Math.exp((-8.-cS.v)/7.5));
                          
                          Ad = 1.4/(1.+Math.exp((-35.-cS.v)/13.))+0.25;
                          Bd = 1.4/(1.+Math.exp((cS.v+5.)/5.));
                          Cd = 1.0/(1.+Math.exp((50.-cS.v)/20.));
                          TAU_D = Ad*Bd+Cd;
                          exptaudt_t = Math.exp(-cS.timestep/TAU_D);

                          finft_t = 1.0/(1.+Math.exp((cS.v+20.)/7.));

                          Af = 1102.5*Math.exp(-(cS.v+27.)*(cS.v+27.)/225.);
                          Bf = 200.0/(1.+Math.exp((13.-cS.v)/10.));
                          Cf = (180.0/(1.+Math.exp((cS.v+30.)/10.)))+20.;
                          TAU_F = Af+Bf+Cf;
                          exptauft_t = Math.exp(-cS.timestep/TAU_F);

                          f2inft_t = 0.67/(1.+Math.exp((cS.v+35.)/7.))+0.33;

            //original code had the following, but paper uses denom of 170**2, not 7**2

            Af2 = 600.*Math.exp(-(cS.v+25.)*(cS.v+25.)/49.);

            // paper value for Af2 is INCORRECT to match the figure
            //Af2=600.*exp(-(vv+25.)*(vv+25.)/(170.*170.))
            
            Bf2 = 31.0/(1.+Math.exp((25.-cS.v)/10.));
            Cf2 = 16.0/(1.+Math.exp((cS.v+30.)/10.));
            TAU_F2 = Af2+Bf2+Cf2
            exptauf2t_t = Math.exp(-cS.timestep/TAU_F2);

            inakcoefft_t = (1.0/(1.+0.1245*Math.exp(-0.1*cS.v*cC.fort)+0.0353*Math.exp(-cS.v*cC.fort)))*cS.knak*(cS.Ko/(cS.Ko+cS.KmK));                
            ipkcoefft_t = cS.GpK/(1.+Math.exp((25.-cS.v)/5.98));             
            temp = Math.exp(2*(cS.v-15)*cC.fort);

            if(!(Math.abs(cS.v-15.) < 1e-4)){
              // need implemented
              ical1t_t = cS.GCaL*4.*(cS.v-15.)*(cS.FF*cC.fort)* (0.25*temp)/(temp-1.);
              ical2t_t = cS.GCaL*4.*(cS.v-15.)*(cS.FF*cC.fort)*cS.Cao/(temp-1.);
            }
            
            temp = Math.exp((cS.n-1.)*cS.v*cC.fort);
            temp2 = cS.knaca/((cC.KmNai3+cC.Nao3)*(cS.KmCa+cS.Cao)*(1.+cS.ksat*temp));
            inaca1t_t = temp2*Math.exp(cS.n*cS.v*cC.fort)*cS.Cao;
            inaca2t_t = temp2*temp*cC.Nao3*cS.alphanaca; 


             //reversal potentials
             Ek  = cC.rtof*(Math.log((cS.Ko/cS.ki)));
             Ena = cC.rtof*(Math.log((cS.Nao/cS.nai)));
             Eks = cC.rtof*(Math.log((cS.Ko+cS.pKNa*cS.Nao)/(cS.ki+cS.pKNa*cS.nai)));
             Eca = 0.5*cC.rtof*(Math.log((cS.Cao/cS.cai)));
             
             // need to figure out vmek  is (cS.v - Ek) 
             Ak1 = 0.1/(1.+Math.exp(0.06*((cS.v - Ek)-200.)));
             Bk1 = (3.*Math.exp(0.0002*((cS.v - Ek)+100.))+Math.exp(0.1*((cS.v - Ek)-10.)))/(1.+Math.exp(-0.5*((cS.v - Ek))));        
             ik1coefft_t = cS.GK1*Ak1/(Ak1+Bk1); 
             
             fcassinft_t     = 0.6/(1+(cS.cass/0.05)*(cS.cass/0.05))+0.4;
             temp            = 80.0/(1+(cS.cass/0.05)*(cS.cass/0.05))+2.;
             exptaufcasst_t  = Math.exp(-cS.timestep/temp); 

          //stimulus

          cS.Istim = _s1s2Stimulus(count, settings);
          
           //Compute currents

           cS.sm   = minft_t - (minft_t-cS.sm)*exptaumt_t;
           cS.sh    = hinft_t - (hinft_t-cS.sh)*exptauht_t;
           cS.sj   = jinft_t - (jinft_t-cS.sj)*exptaujt_t;
           cS.ina  = cS.GNa*cS.sm *cS.sm *cS.sm *cS.sh*cS.sj*(cS.v-Ena); 

           cS.sxr1 = xr1inft_t-(xr1inft_t - cS.sxr1)  * exptauxr1t_t;

           
           cS.sxr2 = xr2inft_t-(xr2inft_t - cS.sxr2) * exptauxr2t_t;
           
           cS.ikr = cS.Gkr*cC.Gkrfactor*cS.sxr1*cS.sxr2*(cS.v-Ek); 
           
           cS.sxs = xsinft_t-(xsinft_t-cS.sxs)*exptauxst_t;

           cS.iks = cS.Gks*cS.sxs*cS.sxs*(cS.v-Eks);

           cS.sr = rinft_t-(rinft_t-cS.sr)*exptaurt_t;

           cS.ss = sinft_t-(sinft_t-cS.ss)*exptaust_t;

           cS.ito = cS.Gto*cS.sr*cS.ss*(cS.v-Ek);

           cS.sd = dinft_t-(dinft_t-cS.sd)*exptaudt_t;

           cS.sf = finft_t-(finft_t-cS.sf)*exptauft_t;

           cS.sf2 = f2inft_t-(f2inft_t-cS.sf2)*exptauf2t_t; 

           FCaSS_INF   = (cS.cass > cS.casshi) ? 0.4 : fcassinft_t ;

           exptaufcass = (cS.cass > cS.casshi) ? cC.exptaufcassinf : exptaufcasst_t;

           cS.sfcass = FCaSS_INF-(FCaSS_INF- cS.sfcass)*exptaufcass;

           cS.ical = cS.sd*cS.sf*cS.sf2*cS.sfcass*(ical1t_t* cS.cass - ical2t_t);

           cS.ik1 = ik1coefft_t*(cS.v-Ek);

           cS.ipk = ipkcoefft_t*(cS.v-Ek);

           cS.inaca = inaca1t_t*cS.nai*cS.nai*cS.nai-inaca2t_t*cS.cai;

           cS.inak = inakcoefft_t*(cS.nai/(cS.nai+cS.KmNa));

           cS.ipca = cS.GpCa*cS.cai/(cS.KpCa+cS.cai);

           cS.ibna = cS.GbNa*(cS.v-Ena);

           cS.ibca = cS.GbCa*(cS.v-Eca);

          //total current
          cS.sItot = cS.ikr+ cS.iks+ cS.ik1+ cS.ito+ cS.ina+ cS.ibna+ cS.ical+ cS.ibca+ cS.inak+ cS.inaca+ cS.ipca+ cS.ipk+ cS.Istim;

           //console.log(cS.ikr, cS.iks, cS.ik1, cS.ito, cS.ina, cS.ibna, cS.ical, cS.ibca, cS.inak, cS.inaca, cS.ipca, cS.ipk, cS.Istim);

          //update concentrations

          kCaSR = cS.maxsr-((cS.maxsr-cS.minsr)/(1+(cS.EC/cS.casr*(cS.EC/cS.casr))));
          k1 = cS.k1prime/kCaSR;
          k2 = cS.k2prime*kCaSR;
          dRR = cS.k4*(1.-cS.srr)-k2*cS.cass*cS.srr;
          cS.srr = cS.srr+cS.timestep*dRR;
          sOO = k1*cS.cass*cS.cass*cS.srr/(cS.k3+k1*cS.cass*cS.cass);

          //intracellular calcium currents

          cS.Irel  = cS.Vrel*sOO*(cS.casr- cS.cass);
          cS.Ileak = cS.Vleak*(cS.casr-cS.cai);
          cS.Iup   = cS.Vmaxup/(1.+((cS.Kup*cS.Kup)/(cS.cai*cS.cai)));
          cS.Ixfer = cS.Vxfer*(cS.cass - cS.cai);


          CaCSQN  =  cS.Bufsr*cS.casr/(cS.casr+cS.Kbufsr);
          dCaSR   =  cS.timestep*(cS.Iup-cS.Irel-cS.Ileak);
          bjsr    =  cS.Bufsr-CaCSQN-dCaSR-cS.casr+cS.Kbufsr;
          cjsr    =  cS.Kbufsr*(CaCSQN+dCaSR+cS.casr);
          cS.casr =  (Math.sqrt(bjsr*bjsr+4.*cjsr)-bjsr)/2.;

          CaSSBuf = cS.Bufss * cS.cass/(cS.cass+cS.Kbufss);
          dCaSS   = cS.timestep * (-cS.Ixfer*(cS.Vc/cS.Vss)+cS.Irel*(cS.Vsr/cS.Vss)+(-cS.ical*cC.inversevssF2*cS.CAPACITANCE));           
          bcss    = cS.Bufss - CaSSBuf - dCaSS - cS.cass+cS.Kbufss;
          ccss    = cS.Kbufss*(CaSSBuf+dCaSS+cS.cass);
          cS.cass = (Math.sqrt(bcss*bcss+4.*ccss)-bcss)/2.;

          CaBuf  = cS.Bufc*cS.cai/(cS.cai+cS.Kbufc);
          dCai   = cS.timestep *((-(cS.ibca+cS.ipca-2*cS.inaca)*cC.inverseVcF2*cS.CAPACITANCE)-(cS.Iup-cS.Ileak)*(cS.Vsr/cS.Vc)+cS.Ixfer);                
          bc     = cS.Bufc-CaBuf-dCai-cS.cai+cS.Kbufc;
          cc     = cS.Kbufc*(CaBuf+dCai+cS.cai);
          cS.cai = (Math.sqrt(bc*bc+4.*cc)-bc)/2.;

          dNai   =  -(cS.ina+cS.ibna+3.*cS.inak+3.*cS.inaca)*cC.inverseVcF*cS.CAPACITANCE;
          cS.nai =   cS.nai+cS.timestep*dNai;

          dKi = -(cS.Istim+cS.ik1+cS.ito+cS.ikr+cS.iks-2.*cS.inak+cS.ipk)*cC.inverseVcF*cS.CAPACITANCE;                     
          cS.ki = cS.ki+cS.timestep*dKi;
          cS.v =  cS.v - cS.sItot * cS.timestep ;
          

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
          this.inverseVcF2  = 1/(2*c.Vc*c.FF);
          this.inverseVcF   = 1.0/(c.Vc*c.FF);
          this.inversevssF2 =  1/(2*c.Vss*c.FF);
          this.rtof         = (c.RR*c.TT)/c.FF;
          this.fort         = 1.0/this.rtof;
          this.KmNai3       = Math.pow(c.KmNai,3);      //c.KmNai*c.KmNai*c.KmNai
          this.Nao3         = Math.pow(c.Nao,3);       //c.Nao*c.Nao*c.Nao;
          this.Gkrfactor    = Math.sqrt(c.Ko/5.4);

            //asymptotic value for taufcass when cass>1
            this.exptaufcassinf = Math.exp(-cS.timestep/2.0)         
          }


          function _getNumIterations(settings) {
            var c   =    settings.calculationSettings;
            var num = ((c.s1 * (c.ns1 - 1)) + (2 * c.s2)) / c.timestep;
            num   =    Math.floor(num);
            return num;    
          } 


          function runCalculations(iterations, settings) {
            var state   =   settings,
            data,
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