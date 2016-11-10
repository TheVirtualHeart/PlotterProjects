    /**
    * This module is responsible for performing the differential equation
    * calculation for Courtemanche. The object maintains the state of the different
    * variables and returns them after each calculation. These variables can also
    * be reset. 
    */

    define(["utility"],
    function CourtemancheCalculator(utils) {
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
        * Performs a differential calculations and increments the values
        */
        function calculateNext(data) {

            var alpham, betam, alphah, betah, alphaj, betaj, alphaoa,
                betaoa, alphaoi, betaoi, alphaua, betaua, alphaui, betaui, alphaxr, betaxr, alphaxs, betaxs,
                temp, xnaca11, xnaca21;

            var exptaum_t,  xinfm_t,  exptauh_t,  xinfh_t,  exptauj_t,  xinfj_t, 
                xk1t_t,  exptauoa_t,  xinfoa_t,  exptauoi_t,  xinfoi_t,  exptauua_t,  xinfua_t,  exptauui_t,  xinfui_t,  xkurcoeff_t,   xkrcoeff_t, 
                exptaud_t,  xinfd_t,  exptauf_t,  xinff_t,  xnakt_t,  xnaca1_t, 
                xnaca2_t,  exptauw_t,  xinfw_t;

            /* moved to settings as previous value required 
            exptauxr_t, xinfxr_t, exptauxs_t, xinfxs_t*/

            var xinffca_t , xpcat_t, ecat_t, xupt_t, carow2_t;

            var xinfut_t, exptauvt_t, xinfvt_t; 

            var xstim, eca, xinfm1, exptaum1, xinfh1, exptauh1, xinfj1, exptauj1,
                xinfoa1, exptauoa1, xinfoi1, exptauoi1,
                xinfua1, exptauua1, xinfui1, exptauui1, xkurcoeff1,
                xinfxr1, exptauxr1, xkrcoeff1,
                xinfxs1, exptauxs1,
                xinfd1, exptaud1, xinff1, exptauf1, xinffca1,
                xinfu, exptauv, xinfv, xinfw1, exptauw1,
                xtr, xup, xupleak,
                di_ups, carow21;    

            //calculations start
            //

            alpham  =   (Math.abs( cS.v + 47.13) < 1e-5) ? 3.2 : 0.32 * ( cS.v + 47.13 )/( 1.- Math.exp(-0.1*( cS.v + 47.13 ) ) );

            betam  =   0.08 * Math.exp (- cS.v /11.);

            alphah  =   ( cS.v > -40.0 ) ? 0.0 : 0.135  *  Math.exp(-( cS.v+80.0)/6.8); 

            betah   =   ( cS.v > -40.0 ) ? 1.0/ (0.13  * (1.0 + Math.exp (-( cS.v + 10.66)/11.1))) 
                        : 3.56  *  Math.exp ( 0.079  *   cS.v ) + 3.1e5 * Math.exp(0.35 *  cS.v); 

            alphaj  =   ( cS.v > -40.0 ) ? 0.0 
                        : (-127140 * Math.exp(0.2444 *  cS.v)-3.474e-5 * Math.exp(-0.04391 *  cS.v)) * ( cS.v + 37.78)/(1. + Math.exp (0.311 * ( cS.v + 79.23))); 

            betaj  =    ( cS.v > -40.0 ) ? 0.3 * Math.exp(-2.535e-7 *  cS.v)/(1.+Math.exp(-0.1 * ( cS.v+32.))) 
                         : 0.1212 * Math.exp(-0.01052 *  cS.v)/(1.+Math.exp(-0.1378 * ( cS.v+40.14))); 

            alphaoa  =  0.65 /  (  Math.exp  ( - (  cS.v + 10. )  / 8.5 )  +  Math.exp  ( - (  cS.v-30. )  / 59. )  ); 

            betaoa  =   0.65 /  ( 2.5 +  Math.exp  (  (  cS.v + 82. )  / 17. )  );

            alphaoi  =  1.0 /  ( 18.53 +  Math.exp  (  (  cS.v + 113.7 )  / 10.95 )  );

            betaoi  =   1.0 /  ( 35.56 +  Math.exp  ( - (  cS.v + 1.26 )  / 7.44 )  ); 

            alphaua  =  0.65 /  (  Math.exp  ( - (  cS.v + 10. )  / 8.5 )  +  Math.exp  ( - (  cS.v-30. )  / 59. )  ); 

            betaua  =   0.65 /  ( 2.5 +  Math.exp  (  (  cS.v + 82. )  / 17. )  ); 

            alphaui  =  1.0 /  ( 21. +  Math.exp  ( - (  cS.v-185. )  / 28. )  ) ; 

            betaui  =   Math.exp  (  (  cS.v-158. )  / 16. ); 

            alphaxr  =  0.0003* (  cS.v  +  14.1 )  /  ( 1.- Math.exp  ( - (  cS.v + 14.1 )  / 5. )  ); 

            betaxr  =   7.3898e-5* (  cS.v-3.3328 )  /  (  Math.exp  (  (  cS.v-3.3328 )  / 5.1237 ) -1. ); 

            alphaxs  =  4e-5* (  cS.v-19.9 )  /  ( 1.- Math.exp  ( - (  cS.v-19.9 )  / 17. )  ); 

            betaxs  =   3.5e-5* (  cS.v-19.9 )  /  (  Math.exp  (  (  cS.v-19.9 )  / 9. ) -1. );

            //table variables depending on V

            exptaum_t   =  Math.exp(- cS.timestep*(alpham+betam));

            xinfm_t   =  alpham/(alpham+betam);

            exptauh_t   =  Math.exp(- cS.timestep*(alphah+betah));

            xinfh_t   =  alphah/(alphah+betah);

            exptauj_t   =  Math.exp(- cS.timestep*(alphaj+betaj));

            xinfj_t   =  alphaj/(alphaj+betaj);

            xk1t_t    =   cS.gk1*( cS.v- cC.ek)/(1.+Math.exp(0.07*( cS.v + 80.)));

            exptauoa_t  =  Math.exp(- cS.timestep*((alphaoa+betaoa)* cS.xkq10));

            xinfoa_t    =  1.0/(1.+Math.exp(-( cS.v+20.47)/17.54));

            exptauoi_t  =  Math.exp(- cS.timestep*((alphaoi+betaoi)* cS.xkq10));

            xinfoi_t    =  1.0/(1.+Math.exp(( cS.v+43.1)/5.3));

            exptauua_t  =  Math.exp(- cS.timestep*((alphaua+betaua)* cS.xkq10));

            xinfua_t    =  1.0/(1.+Math.exp(-( cS.v+30.3)/9.6));

            exptauui_t  =  Math.exp(- cS.timestep*((alphaui+betaui)* cS.xkq10));

            xinfui_t    =  1.0/(1.+Math.exp(( cS.v-99.45)/27.48));

            xkurcoeff_t  =  (0.005+0.05/(1.+Math.exp(-( cS.v-15.)/13.)))*( cS.v- cC.ek);


            if(!((Math.abs( cS.v+14.1) < 1e-5) || (Math.abs( cS.v-3.3328)<1e-5))){
                 cS.exptauxr_t  =  Math.exp(- cS.timestep*(alphaxr+betaxr));
                 cS.xinfxr_t    =  1.0/(1.+Math.exp(-( cS.v+14.1)/6.5));
            }

            xkrcoeff_t  =   cS.gkr*( cS.v- cC.ek)/(1.+Math.exp(( cS.v+15.)/22.4));

            if(!(Math.abs( cS.v-19.9) < 1e-5)){
                 cS.exptauxs_t  =  Math.exp(- cS.timestep/0.5*(alphaxs+betaxs));
                 cS.xinfxs_t    =  1.0/Math.sqrt(1.+Math.exp(-( cS.v-19.9)/12.7));
            }

            //temp varaible used for calculations
            temp    =  (1.0-Math.exp(-( cS.v+10.)/6.24))/(0.035*( cS.v+10.)* (1.+Math.exp(-( cS.v+10.)/6.24)));

            if(Math.abs( cS.v+10) < 1e-5){
                exptaud_t = 2.2894;
                exptauf_t = 0.9997795;
            }
            else{
                exptaud_t   =  Math.exp(- cS.timestep/temp);      
                exptauf_t   =  Math.exp(- cS.timestep/9.*(0.0197*Math.exp(Math.pow(-(0.0337 *( cS.v+10.)), 2))+0.02));
            }

            xinfd_t   =  1.0/(1.+Math.exp(-( cS.v+10.)/8.));

            xinff_t   =  1.0/(1.+Math.exp(( cS.v+28.)/6.9));

            xnakt_t   =  (1.0/(1.+0.1245*Math.exp(-0.1* cS.v/ cC.rtof)+0.0365* cC.sigma*Math.exp(- cS.v/ cC.rtof)))* cS.xinakmax/(1.+(Math.pow(( cS.xkmnai/ cS.cnai),1.5)))*( cS.cko/( cS.cko+ cS.xkmko));

            xnaca1_t    =   cS.xinacamax*Math.exp( cS.gamma* cS.v/ cC.rtof)*(Math.pow( cS.cnai,3))* cS.ccao/((Math.pow( cS.xkmna,3)+ Math.pow( cS.cnao,3))*( cS.xkmca+ cS.ccao)*(1.+ cS.xksat*Math.exp(( cS.gamma-1.)* cS.v/ cC.rtof)));

            xnaca2_t    =   cS.xinacamax*Math.exp(( cS.gamma-1.)* cS.v/ cC.rtof)/((Math.pow( cS.xkmna,3) + Math.pow( cS.cnao,3))*( cS.xkmca+ cS.ccao)*(1.+ cS.xksat*Math.exp(( cS.gamma-1.)* cS.v/ cC.rtof)));                                  

            temp    =   6.0*(1.-Math.exp(-( cS.v-7.9)/5.))/((1.+0.3*Math.exp(-( cS.v-7.9)/5.))*( cS.v-7.9));                

            exptauw_t   =  Math.exp(- cS.timestep/temp);

            xinfw_t   =  1.0-1.0/(1.+Math.exp(-( cS.v-40.)/17.));

            //table variables depending on ca

            xinffca_t   =   1.0/(1.+ cS.ccai/0.00035);
            xpcat_t   =  cS.xipcamax* cS.ccai/(0.0005+ cS.ccai);
            ecat_t    =  cC.rtof*0.5*Math.log( cS.ccao/ cS.ccai);
            xupt_t    =  cS.xupmax/(1.+ cS.xkup/ cS.ccai);
            carow2_t  = ( cS.trpnmax* cS.xkmtrpn/( cS.ccai+ cS.xkmtrpn)/( cS.ccai+ cS.xkmtrpn) +  cS.cmdnmax* cS.xkmcmdn/( cS.ccai+ cS.xkmcmdn)/( cS.ccai+ cS.xkmcmdn)+1.)/ cC.c_b1c;

            //table variables depending on fn
            /*  fnlo=-0.2,fnhi=2.3,nfnt=2500
            dfntable=(fnhi-fnlo)/float(nfnt)
            fn=fnlo+i*dfntable
            */
            xinfut_t  = 1.0/(1.+ Math.exp(-( cS.fn/13.67e-4-250.0)));

            temp    = 1.91+2.09/(1.+ Math.exp(-( cS.fn/13.67e-4-250.0)));

            exptauvt_t  = Math.exp(- cS.timestep/temp);

            xinfvt_t  = 1.-1.0/(1.+ Math.exp(-( cS.fn-6.835e-14)/13.67e-16));


            // table loop starts here

            xstim   =  _s1s2Stimulus(count, data);

            //c equilibrium potentials
            eca = ecat_t;

            //c fast sodium current
            xinfm1    = xinfm_t;
            exptaum1  = exptaum_t;
            xinfh1    = xinfh_t;
            exptauh1  = exptauh_t;
            xinfj1    = xinfj_t;
            exptauj1  = exptauj_t;

            cS.xm = xinfm1 + ( cS.xm - xinfm1) * exptaum1;
            cS.xh = xinfh1 + ( cS.xh - xinfh1) * exptauh1;
            cS.xj = xinfj1 + ( cS.xj - xinfj1) * exptauj1;   
            cS.xna =  cS.xm *  cS.xm *  cS.xm *  cS.xh * cS.xj * cS.gna *( cS.v -  cC.ena);

            //c time-independent k+ current
            cS.xk1 = xk1t_t;

            //c transient outward k+ current
            xinfoa1   =  xinfoa_t;
            exptauoa1 =  exptauoa_t;
            xinfoi1   =  xinfoi_t;
            exptauoi1 =  exptauoi_t;

            cS.xoa =  xinfoa1+( cS.xoa-xinfoa1)*exptauoa1;
            cS.xoi =  xinfoi1+( cS.xoi-xinfoi1)*exptauoi1;
            cS.xto =   cS.xoa* cS.xoa* cS.xoa* cS.xoi* cS.gto*( cS.v -  cC.ek);

            //c ultrarapid delayed rectifier k+ current
            xinfua1 = xinfua_t;
            exptauua1 = exptauua_t;
            xinfui1 = xinfui_t;
            exptauui1 = exptauui_t;
            xkurcoeff1= xkurcoeff_t;

            cS.xua = xinfua1+( cS.xua-xinfua1)*exptauua1;
            cS.xui = xinfui1+( cS.xui-xinfui1)*exptauui1;
            cS.xkur  =  cS.xua* cS.xua* cS.xua* cS.xui*xkurcoeff1;

            //c rapid delayed outward rectifier k+ current
            xinfxr1 =    cS.xinfxr_t;
            exptauxr1 =  cS.exptauxr_t;
            xkrcoeff1 = xkrcoeff_t;

            cS.xr  = xinfxr1+( cS.xr-xinfxr1)*exptauxr1;
            cS.xkr   =  cS.xr*xkrcoeff1;

            //c slow delayed outward rectifier k+ current
            xinfxs1   =  cS.xinfxs_t;
            exptauxs1 =  cS.exptauxs_t;

            cS.xs  = xinfxs1+( cS.xs-xinfxs1)*exptauxs1;
            cS.xks     =  cS.xs* cS.xs* cS.gks*( cS.v-  cC.ek);

            //c L-tpe ca2+ current
            xinfd1  = xinfd_t;
            exptaud1  = exptaud_t;
            xinff1  = xinff_t;
            exptauf1  = exptauf_t;
            xinffca1  = xinffca_t;

            cS.xd  = xinfd1+( cS.xd-xinfd1)*exptaud1;
            cS.xf  = xinff1+( cS.xf-xinff1)*exptauf1;
            cS.xfca  = xinffca1+( cS.xfca-xinffca1)*  cC.exptaufca;
            cS.xcal  =  cS.xd* cS.xf* cS.xfca* cS.gcal*( cS.v-65.0);

            //xnak,  xnaca, xbca, xbna, xpca; 

            //cc na+/k+ pump current
             cS.xnak  = xnakt_t;

            //c na+/ca2+ exchanger current
            xnaca11   = xnaca1_t;
            xnaca21   = xnaca2_t;
            cS.xnaca = xnaca11 - xnaca21* cC.cnao3* cS.ccai;

            //cc background currents
            cS.xbca  =  cS.gbca * ( cS.v - eca);

            cS.xbna  =  cS.gbna * ( cS.v -  cC.ena);

            //c ca2+ pump current
            cS.xpca =  xpcat_t;

            /*c ca2+ release current from JSR
            c correction: divide first fn term by cm, multiply second fn term by cm
            c then to ensure computational accuracy (no problems with tiny numbers),
            c divide fn by 1e-12 and adjust functions accordingly*/
            cS.xrel =  cS.xkrel* cS.xu* cS.xu* cS.xv* cS.xw*( cS.ccarel- cS.ccai);

            cS.fn  =  cS.vrel/ cS.cm* cS.xrel-0.5 * cS.cm/ cS.xxf*(0.5* cS.xcal-0.2* cS.xnaca);

            xinfu   = xinfut_t;
            exptauv = exptauvt_t;
            xinfv   = xinfvt_t;

            cS.xu  = xinfu+( cS.xu-xinfu)*  cC.exptauu;
            cS.xv  = xinfv+( cS.xv-xinfv)*exptauv;

            xinfw1 = xinfw_t;
            exptauw1 = exptauw_t;

            cS.xw   = xinfw1+( cS.xw-xinfw1)*exptauw1;
            cS.xrel =  cS.xkrel* cS.xu* cS.xu* cS.xv* cS.xw*( cS.ccarel -  cS.ccai);

            // c transfer current from NSR to JSR
            xtr = ( cS.ccaup -  cS.ccarel)/ cS.tautr;

            // c ca2+ uptake current by the NSR
            xup = xupt_t;

            // c ca2+ leak current by the NSR
            xupleak =  cS.ccaup* cS.xupmax/ cS.ccaupmax;

            //c intracellular ion concentrations
            di_ups    = xup-xupleak;
            carow21   =   carow2_t;
            cS.ccai  =    cS.ccai +   cS.timestep  * ( cC.c_b1d*( cS.xnaca +  cS.xnaca -  cS.xpca -  cS.xcal -  cS.xbca)-  cC.c_b1e* di_ups +  cS.xrel) / carow21;             
            cS.ccaup   =    cS.ccaup +  cS.timestep  * (xup - xupleak-xtr*( cS.vrel/ cS.vup));
            cS.ccarel  =    cS.ccarel +  cS.timestep * ((xtr -  cS.xrel)/ (1.+( cS.csqnmax* cS.xkmcsqn)/(Math.pow(( cS.ccarel+ cS.xkmcsqn),2))));

            //console.log( cS.xna ,  cS.xk1 , +  cS.xkur +  cS.xto ,  cS.xkur ,  cS.xkr ,  cS.xks ,   cS.xcal ,  cS.xpca ,  cS.xnak,  cS.xnaca,  cS.xbna,  cS.xbca-xstim);
     
             cS.v =  cS.v -  cS.timestep * ( cS.xna +  cS.xk1 +  cS.xto +   cS.xkur +  cS.xkr +  cS.xks +  cS.xcal +  cS.xpca +  cS.xnak +  cS.xnaca +  cS.xbna +   cS.xbca - xstim);

            // table loop ends

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

            this.sigma   =   (Math.exp(c.cnao/67.3)-1.)/7.0,
            this.rtof    =   c.r * c.xt/c.xxf,
            this.ena      =  this.rtof * Math.log(c.cnao/c.cnai),
            this.ek      =   this.rtof * Math.log(c.cko/c.cki),
            this.c_b1a   =   c.cm * 0.5/(c.xxf*c.vi),
            this.c_b1b   =   c.vup/c.vi,
            this.c_b1c   =   c.vrel/c.vi,
            this.c_b1d   =    this.c_b1a/ this.c_b1c,
            this.c_b1e   =    this.c_b1b/ this.c_b1c,
            this.cnao3   =   c.cnao * c.cnao * c.cnao,
            this.istimdur  =   c.xstimdur/c.timestep,
            this.exptaufca  =  Math.exp(-c.timestep/c.taufca),
            this.exptauu  =   Math.exp(-c.timestep/c.tauu)  
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
            curAnalyzer; 

            //here 'count' is global variable
            count   =    0;

             cS   =   _.cloneDeep(settings.calculationSettings);      
             cC   =   new CalcConstants(settings.calculationSettings); 
          
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
            var dur   =    utils.round(c.xstimdur / c.timestep);
            var periods   =    stimuli.s1;

            for (var i   =    0; i < periods.length; i++) {
                var periodX   =    utils.round(periods[i] / c.timestep);
                if ((count >=    periodX) && (count < periodX + dur)) {
                    stim   =    c.xstimamp;
                }
            }
            var lastPeriodX   =    utils.round(stimuli.s2 / c.timestep);
            if ((count >=    lastPeriodX) && (count < lastPeriodX + dur)) {
                stim   =    c.xstimamp;
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