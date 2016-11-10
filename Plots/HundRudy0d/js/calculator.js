/**
 * This module is responsible for performing the differential equation
 * calculation for Hunrudy. The object maintains the state of the different
 * variables and returns them after each calculation. These variables can also
 * be reset. 
 */

 define(["utility"],
  function HundrudyCalculator(utils) {
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
	 * Performs a differential calculations and increments the values.
	 */
	function calculateNext(data) {
		
		var ma,	mb,	ha,	hb,	ja,	jb,	mtau,	htau,	jtau, 
            msst_t,	hsst_t,	jsst_t, expmtaut_t, exphtaut_t, expjtaut_t,
            //tables
            dsst_t, dtau, expdtaut_t, fsst_t, ftau, expftaut_t, f2sst_t, f2tau,
            expf2taut_t, powsst_t, xrsst_t, xrtau, expxrtaut_t, rkrt_t, xssst_t,
            xs1tau, xs2tau, expxs1taut_t, expxs2taut_t,
            alphaml, betaml, mltau, mlsst_t, hlsst_t, expmltaut_t, alphaa, betaa, alphai, 
            betai,  alphai2, betai2, atau, itau, i2tau, asst_t, isst_t, i2sst_t, expataut_t,
            expitaut_t, expi2taut_t,
            ikpcoefft_t, fnak, inakcoefft_t, expnaca1t_t, expnaca2t_t, rto1t_t, 
            expzcavfortt_t, expzclvfortt_t, expbarcat_t,
            caTable,rossjsr2t_t, allot_t, ipcat_t, gksbart_t,
            fcatau1t_t, aasst_t, rossjsr1t_t, expriss1t_t, expritau1t_t,
            calca, fca2tau, expfca2taut_t, cafact_t,vgt_t,
            cafac, expriss2t_t, expritau2t_t, powtable_t,
            // compute reversal potentials
            ena, enal, ecl, ek, ecl, ek1, ek1, ekp, ekr, eto1, eks, 
            vmek, k1a, k1b, k1ss, ik1t_t, istim,
            // c compute Ina
            expmtau, expjtau, exphtau, 
            mss, jss, hss,
            expzcavfort, //  compute ICab
            expbarca, ibarca, vgt_t, // compute ICaL
            //  activation & fast voltage dependent inactivation
            dss, expdtau, fss, expftau, f2ss, expf2tau, fcass, fca2ss, fca_dtaucamk, fcatau, 
            expfcataut_t,  expfcatau, expfca2tau, powss, xdtoxdpower, 
            xrss, expxrtau, rkr , //  compute IKr
            xsss, expxs1tau, expxs2tau , //  compute IKs
            allo, expnaca1, expnaca2, nai3, num, denommult, 
            denomterm1, denomterm2, deltaE , //  compute INaCa
            expmltau, mlss, hlss,  // compute INal
            ass, iss, i2ss, expatau, expitau, 
            expi2tau,rto1 , // compute Ito1
            aass, expzclvfort, ibarto2, // compute Ito2
            ctkcl, // compute kcl
            //compute qrel
            qreldtaucamk, rossjsr1, rossjsr2,rossjsr, ross, expriss1, 
            expriss2,riss, expritau1, expritau2, ritau, expritaut_t,expritau,
            vg, grelbar,  
            dkmplb,dqupcamk ,//compute qup
            icatot, iktot, inatot, icltot, itot, 
            enamecl2, enamecl4, ctnacl, //compute nacl
            bss, qdiff, dcar, dcajsr, cajsrtot, dcansr,
            cansr, dnai, dki, dcli, dcai, catotal,
            camkbound; // update CAMKINASE

        ma = 0.32 * (cS.v + 47.13)/(1.0 - Math.exp(-0.1 * (cS.v + 47.13)));
        mb = 0.08 * Math.exp(-cS.v / 11.0);
        
        if (cS.v < -40.0){
            ha = 0.135 * Math.exp((80.0 + cS.v)/-6.8);
            hb = 3.56 * Math.exp(0.079 * cS.v)+310000.0 * Math.exp(0.35 * cS.v);
            ja = (-127140.0 * Math.exp(0.2444 * cS.v)-0.00003474 * Math.exp(-0.04391 * cS.v))
                * (cS.v + 37.78)/(1.0 + Math.exp(0.311*(cS.v + 79.23)));
            jb = 0.1212 * Math.exp(-0.01052 * cS.v) / (1 + Math.exp(-0.1378 * (cS.v + 40.14)));
        }
         else{
            ha = 0.0;
            hb = 1.0 / (0.13 * (1.0 + Math.exp((cS.v + 10.66) / -11.1)));
            ja = 0.0;
            jb = 0.3 * Math.exp(-0.0000002535 * cS.v) / (1.0 + Math.exp(-0.1 * (cS.v + 32.0)));
         }

         mtau = 1.0/(ma + mb);
         htau = 1.0/(ha + hb);
         jtau = 1.0/(ja + jb);
         msst_t = ma * mtau;
         hsst_t = ha * htau;
         jsst_t = ja * jtau;
         expmtaut_t = Math.exp(-cS.timestep / mtau);
         exphtaut_t = Math.exp(-cS.timestep / htau);
         expjtaut_t = Math.exp(-cS.timestep / jtau);

         
         //tables
         dsst_t = (1.0 / (1.0 + Math.exp(-(cS.v-4.0) / 6.74)));
         dtau = (0.59 + .8 * Math.exp(0.052 * (cS.v + 13.0)) / (1.0 + Math.exp(0.132 * (cS.v + 13.0))));
         expdtaut_t = Math.exp(-cS.timestep / dtau);
         fsst_t = 0.30 + 0.7 / (1.0 + Math.exp((cS.v + 17.12) / 7.0));
         ftau = 1.0 / (0.2411 * Math.exp( -(0.045 * (cS.v-9.6914))
              * (0.045 * (cS.v-9.6914 ))) + 0.0529);
         expftaut_t = Math.exp(-cS.timestep / ftau);
         f2sst_t = 0.23 + 0.77 / (1.0 + Math.exp((cS.v + 17.12) / 7.0));
         f2tau = 1.0 / (0.0423 * Math.exp( -(0.059 * (cS.v-18.5726))
              * (0.059 * (cS.v-18.5726))) + 0.0054);
         expf2taut_t = Math.exp(-cS.timestep / f2tau);
         powsst_t = 9.0-8 / (1.0 + Math.exp(-(cS.v + 65.0) / 3.4));

         xrsst_t = 1.0 / (1.0 + Math.exp(-(cS.v + 10.085) / 4.25));
         xrtau = 1.0 / (0.0006 * (cS.v-1.7384) / (1.0-Math.exp(-0.136 * (cS.v-1.7384)))
              + 0.0003 * (cS.v + 38.3608) / (Math.exp(0.1522 * (cS.v + 38.3608))-1.0));
         expxrtaut_t = Math.exp(-cS.timestep / xrtau);
         rkrt_t = 1.0 / (1.0 + Math.exp((cS.v + 10) / 15.4));
         
         xssst_t = 1.0 / (1.0 + Math.exp(-(cS.v-10.5) / 24.7));
         xs1tau = 1.0 / (0.0000761 * (cS.v + 44.6) / 
             (1.0-Math.exp(-9.97 * (cS.v + 44.6))) 
              + 0.00036 * (cS.v-0.55) / (Math.exp(0.128 * (cS.v-0.55))-1.0));
         xs2tau = 2.0 * xs1tau;
         expxs1taut_t = Math.exp(-cS.timestep / xs1tau);
         expxs2taut_t = Math.exp(-cS.timestep / xs2tau);

         
         alphaml = 0.32 * (cS.v + 47.13) / (1.0 - Math.exp(-0.1 * (cS.v + 47.13)));
         betaml = 0.08 * Math.exp(-cS.v / 11);
         mltau = 1.0 / (alphaml + betaml);
         mlsst_t = alphaml / (alphaml + betaml);
         hlsst_t = 1.0 / (1.0 + Math.exp((cS.v + 91.0) / 6.1));
         expmltaut_t = Math.exp(-cS.timestep / mltau);

         alphaa = 25.0 * Math.exp((cS.v-40.0) / 25.0) / (1.0 + Math.exp((cS.v-40.0) / 25.0));
         betaa = 25.0 * Math.exp(-(cS.v + 90.0) / 25.0) / (1.0 + Math.exp(-(cS.v + 90.0) / 25.0));
         alphai = 0.03 / (1.0 + Math.exp((cS.v + 60.0) / 5.0));
         betai = 0.2 * Math.exp((cS.v + 25.0) / 5.0) / (1.0 + Math.exp((cS.v + 25.0) / 5.0));
         alphai2 = 0.00225 / (1.0 + Math.exp((cS.v + 60.0) / 5.0));
         betai2 = 0.1 * Math.exp((cS.v + 25.0) / 5.0) / (1.0 + Math.exp((cS.v + 25.0) / 5.0));
         atau = 1.0 / (alphaa + betaa);
         itau = 1.0 / (alphai + betai);
         i2tau = 1.0 / (alphai2 + betai2);
         asst_t = alphaa  / (alphaa + betaa);
         isst_t = alphai  / (alphai + betai);
         i2sst_t = alphai2  / (alphai2 + betai2);
         expataut_t = Math.exp(-cS.timestep / atau);
         expitaut_t = Math.exp(-cS.timestep / itau);
         expi2taut_t = Math.exp(-cS.timestep / i2tau);

         
         ikpcoefft_t = cS.gkp / (1.0 + Math.exp((7.488 - cS.v) / 5.98));
         fnak = 1.0 / (1.0 + 0.1245 * Math.exp(-0.1 * cS.v * cC.fort)
              + 0.0365 * cC.sigma * Math.exp(-cS.v * cC.fort));
         inakcoefft_t = cS.gnakbar * fnak * (cS.ko / (cS.ko + cS.kmko));
         
         expnaca1t_t = Math.exp(cS.nu * cS.v * cC.fort);
         expnaca2t_t = Math.exp((cS.nu - 1.0) * cS.v * cC.fort);
         rto1t_t = cS.gbarto1 * Math.exp(cS.v / 300.0);
         expzcavfortt_t = Math.exp(cS.zca * cS.v * cC.fort);
//         write(40, * ) cS.v,expzcavcC.fortt_t
         expzclvfortt_t = Math.exp(-cS.zcl * cS.v * cC.fort);
         expbarcat_t = Math.exp((cS.zca * (cS.v-15.0)) * cC.fort);
//         write(50, * ) cS.v,expbarcat_t
		 
		
		 caTable = cS.cai; // caTable = cc in fortran code. to avoid clash with cC (Constants)
		 
		 allot_t = 1.0 / (1.0 + (((cS.kmcaact / (1.5 * caTable))
		  	* (cS.kmcaact / (1.5 * caTable)))));
         
         ipcat_t = cS.ipcabar * caTable / (cS.kmpca + caTable);
         
         // Old way - Fortran code.
         // gksbart_t = 0.0575 * (0.433 * (1.0 + .6 /
         //     (1.0 + ((Math.pow((0.000038 / caTable),1.4))))));       
            
            // ************ FORMULA *********** //
            //  GKSBART = gks *( 1 + (0.6/(1 + (3.8*(10)^-5 / CA2+)^1.4)))         
            //   where gks = 0.0248975.               
            // ******************************** //

         // modified gksbart_t based on above formula provided by Professor to be able to provide gks as a parameter
         gksbart_t = cS.gks * (1 + (0.6/((1.0 + ((Math.pow((0.000038 / caTable),1.4)))))));
         
         
         caTable = cS.car; // caTable = cc in fortran code.
         fcatau1t_t =  0.5  +  1.0 / (1.0  +  caTable / 0.003);
         aasst_t = 1.0 / (1.0  +  cS.kmto2 / caTable);
         rossjsr1t_t = Math.pow(((49.28 * caTable) / (caTable  +  0.0028)),1.9);
         expriss1t_t = Math.exp((caTable - 0.0004) / 0.000025);
         expritau1t_t = Math.exp((caTable) / 0.0002);

         caTable = cS.cajsr; // caTable = cc in fortran code.
         rossjsr2t_t = Math.pow(caTable,1.9);
         
         
         calca = cS.icalca;
         fca2tau = 300.0 / (1.0 + Math.exp((-calca - 0.175) / 0.04)) + 125.0;
         expfca2taut_t = Math.exp(-cS.timestep / fca2tau);
         cafact_t = 1.0 / (1.0  +  Math.exp((calca + 0.05) / 0.015));


         cafac = cafact_t; //check
         expriss2t_t = Math.exp((0.002 * cafac) / 0.000025);
         expritau2t_t = Math.exp((0.003 * cafac-0.003) / 0.0002);
         
/*         dxdt = (xdhi-xdlo) / float(nxdt)
      dxdpowert = (xdpowerhi-xdpowerlo) / float(nxdpowert)
      do j = 0,nxdpowert
         xdpowerr = xdpowerlo + j * dxdpowert
         do i = 0,nxdt
            xdd = xdlo + i * dxdt
            powtable(i,j) = xdd ** xdpowerr
*/

         powtable_t = Math.pow(cS.xd, cS.xdpower);
         
         //TIME LOOP BEGINS


        // compute reversal potentials
         ena = cC.rtof * Math.log(cS.nao / cS.nai);
         enal = ena;
         ecl = -cC.rtof * Math.log(cS.clo / cS.cli);
         ek = cC.rtof * Math.log(cS.ko / cS.ki);
         ek1 = ek;
         ekp = ek;
         ekr = ek;
         eto1 = ek;
         eks = cC.rtof * Math.log((cS.ko + cS.prnak * cS.nao) 
        	/ (cS.ki + cS.prnak * cS.nai));
         
         vmek = cS.v - ek; //vmeklo + float(i) * dvmekt
         k1a = 1.02 / (1.0 + Math.exp(0.2385 * (vmek-59.215)));
         k1b = (0.49124 * Math.exp(0.08032 * (vmek + 5.476))
              + Math.exp(0.06175 * (vmek-594.31))) / 
             (1.0 + Math.exp(-0.5143 * (vmek + 4.753)));
         k1ss = k1a / (k1a + k1b);
         ik1t_t = cC.gk1 * k1ss * (vmek);

         cS.istim = _s1s2Stimulus(count, data);

		 // compute Ina
         expmtau = expmtaut_t;
         expjtau = expjtaut_t;
         exphtau = exphtaut_t;
         mss = msst_t;
         jss = jsst_t;
         hss = hsst_t;
         cS.xm = mss - (mss - cS.xm) * expmtau;
         cS.xh = hss - (hss - cS.xh) * exphtau;
         cS.xj = jss - (jss - cS.xj) * expjtau;
         cS.ina = cS.gna * cS.xm * cS.xm * cS.xm * cS.xh * cS.xj
          	* (cS.v - ena);

        //  compute ICab
         expzcavfort = expzcavfortt_t;

         cS.icab = Math.abs(cS.v) < 1e-2 ? -0.0236 : 
        		cS.pcab * cS.zca * cS.zca * (cS.v * cC.f2ort) * 
        		((cS.gacai * cS.cai * expzcavfort
               -cS.gacao * cS.cao) / (expzcavfort-1.0));

		// compute ICaL

		// THIS INTERPOLATION IS NECESSARY at this table resolution of 0.01 mV
		// at least for higher values such as v>12 mV

        expbarca = expbarcat_t;
        ibarca = Math.abs(cS.v - 15.0) < 1e-2 ? -29.0 : 
           		 cS.pca * cS.zca * cS.zca * ((cS.v - 15.0) * cC.f2ort)
                * ((cS.gacai * cS.car * expbarca - cS.gacao * cS.cao) / 
              	(expbarca - 1.0));
        // else
        //    ibarca = cS.pca * cS.zca * cS.zca * ((cS.v(i)-15.0) * cC.f2ort)
        //         * ((cS.gacai * cS.car * expbarca - cS.gacao * cS.cao) / 
        //       	(expbarca-1.0));
        
    	vgt_t = 1.0 / (1.0  +  Math.exp((ibarca + 13.0) / 5.0));

		// activation
        dss = dsst_t;
        expdtau = expdtaut_t;

		//  fast voltage dependent inactivation
        fss = fsst_t;
        expftau = expftaut_t;
        f2ss = f2sst_t;
        expf2tau = expf2taut_t;
        fcass = 0.3 / (1.0 - cS.icalca / 0.05) 
             +  0.55 / (1.0  +  cS.car / 0.003)  +  0.15;
        
        fca2ss = 1.0 / (1.0 - cS.icalca / 0.01);

        fca_dtaucamk = cS.fca_dtaucamkbar * cS.camkactive / 
            (cS.kmcamk + cS.camkactive);
        fcatau = fca_dtaucamk + fcatau1t_t;

        expfcataut_t = Math.exp(-cS.timestep / fcatau);

        // expfcatau = fcatau < 0 || fcatau > nfcataut ? Math.exp(-cS.timestep / fcatau) :
        // 				expfcataut_t;
        
        expfcatau = expfcataut_t;

        expfca2tau = expfca2taut_t;

        powss = powsst_t;
        cS.xd = dss - ( dss - cS.xd) * expdtau;
        cS.xf = fss - (fss - cS.xf) * expftau;
        cS.xf2 = f2ss - (f2ss - cS.xf2) * expf2tau;
        cS.xfca = fcass - (fcass - cS.xfca) * expfcatau;
        cS.xfca2 = fca2ss - (fca2ss - cS.xfca2) * expfca2tau;
        cS.xdpower = powss - (powss - cS.xdpower) * cC.exppowtau;
        
/*          xdtoxdpower = powtable(ixd1,ixdpower1) * qd2 * qpow2
     &            + powtable(ixd2,ixdpower1) * qd1 * qpow2
     &            + powtable(ixd1,ixdpower2) * qd2 * qpow1
     &            + powtable(ixd2,ixdpower2) * qd1 * qpow1
*/
       	xdtoxdpower = powtable_t; 
// c         xdtoxdpower = xd ** xdpower

        cS.icalca = (xdtoxdpower) * cS.xf * cS.xf2 * cS.xfca * cS.xfca2 * ibarca;
        
// c update for ICalca tables
     //        iicalca = nint((cS.icalca-calcalo) / dcalcat)
     //        if(iicalca.lt.0.or.iicalca.gt.ncalcat) then
     //           write(6, * ) 'index outside ICalca table: ',
     // &              ntime,ntime * dt,i,cS.icalca,iicalca
     //        endif

// c compute IClb
            cS.iclb = cS.gbarclb * (cS.v - ecl);

// c compute IK1

            cS.ik1 = ik1t_t;

//  compute IKp

            cS.ikp = ikpcoefft_t * (cS.v - ekp);

//  compute IKr
			
            xrss = xrsst_t;
            expxrtau = expxrtaut_t;
            rkr = rkrt_t;
            cS.xr = xrss - (xrss - cS.xr) * expxrtau;
            cS.ikr = cC.gkr * cS.xr * rkr * (cS.v - ekr);

//  compute IKs
			

            cS.gksbar = gksbart_t;
            xsss = xssst_t;
            expxs1tau = expxs1taut_t;	
            expxs2tau = expxs2taut_t;
            cS.xs1 = xsss-(xsss - cS.xs1) * expxs1tau;
            cS.xs2 = xsss-(xsss - cS.xs2) * expxs2tau;
            cS.iks = cS.gksbar  *  cS.xs1  *  cS.xs2  * (cS.v - eks);

        //  compute INaCa
            
            allo = allot_t;

            expnaca1 = expnaca1t_t;
            expnaca2 = expnaca2t_t;

            nai3 = Math.pow(cS.nai,3); //cS.nai * cS.nai * cS.nai
            num = cS.vmax  * (nai3 * cS.cao * expnaca1
                 - (cC.nao3) * 1.5 * cS.cai * expnaca2);
            denommult = 1  +  cS.ksat * expnaca2;
            denomterm1 = cS.kmcao * nai3  +  (cC.kmnao3) * 1.5 * cS.cai
                 +  (cC.kmnai3) * cS.cao * (1.0 + 1.5 * cS.cai / cS.kmcai);
            denomterm2 = cS.kmcai * (cC.nao3) * (1.0 + 
                ((cS.nai / cS.kmnai) * (cS.nai / cS.kmnai) * 
                (cS.nai / cS.kmnai))) + nai3 * cS.cao + (cC.nao3) 
                * 1.5 * cS.cai;
            deltaE = num / (denommult * (denomterm1 + denomterm2));
            cS.inaca = allo * deltaE;
            
        // compute INaK

        // since hill  =  2, exponent is hard coded
            cS.inak = inakcoefft_t / (1.0 + ((cS.kmnainak / cS.nai) 
                            * (cS.kmnainak / cS.nai)));

        // compute INal
            
            expmltau = expmltaut_t;
            mlss = mlsst_t;
            hlss = hlsst_t;
            cS.xml = mlss - (mlss-cS.xml) * expmltau;
            cS.xhl = hlss - (hlss-cS.xhl) * cC.exphltau;
            cS.inal = cS.gbarnal * cS.xml * cS.xml * cS.xml 
                * cS.xhl * (cS.v - enal);

        // compute IpCa
            cS.ipca = ipcat_t;
      
        // compute Ito1
            
            ass = asst_t;
            iss = isst_t;
            i2ss = i2sst_t;
            expatau = expataut_t;
            expitau = expitaut_t;
            expi2tau = expi2taut_t;
            cS.xa = ass - (ass - cS.xa)  * expatau;
            cS.xi = iss - (iss - cS.xi)  * expitau;
            cS.xi2 = i2ss - (i2ss - cS.xi2)  * expi2tau;
            rto1 = rto1t_t;
            cS.ito1 = (cS.xa * cS.xa * cS.xa) * cS.xi * cS.xi2 * 
                    rto1 * (cS.v - eto1);

        // compute Ito2

            aass = aasst_t;
            cS.xaa = aass - (aass - cS.xaa) * cC.expaatau;
            expzclvfort = expzclvfortt_t;
            ibarto2 = Math.abs(cS.v) < 1e-2 ? 3.13 :
                    cS.pcl * cS.zcl * cS.zcl * (cS.v * cC.f2ort) * 
                       (cS.cli - cS.clo * expzclvfort) / 
                       (1.0 - expzclvfort);
            cS.ito2 = ibarto2 * cS.xaa;

        // compute kcl
            ctkcl = cS.ctkclbar * (ek - ecl) / ((ek - ecl) + 87.8251);

        //compute nacl
            
            enamecl2 = (ena - ecl) * (ena - ecl);
            enamecl4 = Math.pow(enamecl2,2);//enamecl2 * enamecl2;
            ctnacl = cS.ctnaclbar * (enamecl4) / 
                (enamecl4 + cC.ctnacl4);

        //compute qrel
           
            qreldtaucamk = cS.qreldtaucamkbar * cS.camkactive / 
                (cS.kmcamk + cS.camkactive);
            rossjsr1 = rossjsr1t_t;
            rossjsr2 = rossjsr2t_t;
            rossjsr = rossjsr2 / (rossjsr2 + rossjsr1);
            ross = rossjsr * cS.icalca * cS.icalca / 
                        (cS.icalca * cS.icalca  +  1.0);
            cS.xro = ross - (ross - cS.xro) * cC.exprotau;
            
     //        icafac = nint((cafac-cafaclo) / dcafact)
     //        if(icafac.lt.0.or.icafac.gt.ncafact) then
     //           write(6, * ) 'index outside cafac table: ',
     //               ntime,ntime * dt,i,cafac,icafac
     //        endif

            expriss1 = expriss1t_t;
            expriss2 = expriss2t_t;
            riss = 1.0 / (1.0 + expriss1 * expriss2);
            
            expritau1 = expritau1t_t;
            expritau2 = expritau2t_t;
            ritau = (350.0 - qreldtaucamk) / 
                        (1.0  +  expritau1 * expritau2)
                        + 3.0 + qreldtaucamk;
             
            expritaut_t = Math.exp(-cS.timestep/ ritau);
         /*
            iritau = nint((ritau-ritaulo) / dritaut)
            if(iritau.lt.0.or.iritau.gt.nritaut) then
               write(6, * ) 'index outside ritau table: ',
                   ntime,ntime * dt,i,ritau,iritau
            endif
        */

            expritau = expritaut_t;
            cS.xri = riss - (riss - cS.xri) * expritau;
            vg = ritau;
            grelbar = 3000.0 * vg;
            cS.qrel = grelbar * cS.xro * cS.xri * (cS.cajsr - cS.car);

        //compute qleak
            cS.qleak = cS.qleakbar * cS.cansr / cS.nsrbar;

        //compute qup

            dkmplb = cS.dkmplbbar * cS.camkactive / 
                        (cS.kmcamk  +  cS.camkactive);
            dqupcamk =  cS.dqupcamkbar * cS.camkactive / 
                            (cS.kmcamk  +  cS.camkactive);
            cS.qup = (dqupcamk  +  1.0) * cS.qupbar * cS.cai /
                         (cS.cai  +  cS.kmup - dkmplb);
            
        //compute qtr
            cS.qtr = (cS.cansr - cS.cajsr) / cS.tautr;

            

            icatot = cS.icalca + cS.icab + cS.ipca - 2.0 * cS.inaca;
            iktot = cS.ikr + cS.iks + cS.ikp + cS.ik1 - 2.0 *
                         cS.inak + cS.ito1 + 0.5 * cS.istim;            
            inatot = 3.0 * cS.inak + cS.ina + 3.0 * cS.inaca + cS.inal;
            icltot = cS.ito2 + cS.iclb + 0.5 * cS.istim;
            itot = icatot + iktot + inatot + icltot;

        // update concentrations

            bss = 1.0 / (1.0 + cS.bsrbar * cS.kmbsr / ((cS.kmbsr + cS.car) 
                    * (cS.kmbsr + cS.car)) + cS.bslbar * cS.kmbsl /
                    ((cS.kmbsl + cS.car) * (cS.kmbsl + cS.car)));
            qdiff = (cS.car - cS.cai) / cS.sstau;
            dcar = cS.timestep * bss * (-(cS.icalca) * 
                        cC.acap / (cC.vss * 2.0 * cS.frdy)  + cS.qrel 
                            * cC.vjsr / cC.vss - qdiff);
            cS.car = cS.car + dcar;
            
            dcajsr = cS.timestep * (cS.qtr - cS.qrel);
            cajsrtot = dcajsr / (1.0 + cS.csqnbar * cS.kmcsqn / 
                ((cS.kmcsqn + cS.cajsr) * (cS.kmcsqn + cS.cajsr)));
            cS.cajsr = cS.cajsr + cajsrtot;

            dcansr = cS.timestep  *  (cS.qup - cS.qleak - cS.qtr  * 
                                        cC.vjsr / cC.vnsr)
            cS.cansr = cS.cansr  +  dcansr;

            // update concentrations
            
            dnai = cS.timestep * ((-inatot * cC.acap) / 
                            (cC.vmyo * cS.zna * cS.frdy)  +  ctnacl);
            dki = cS.timestep * ((-iktot  * cC.acap) / 
                        (cC.vmyo * cS.zk * cS.frdy)  +  ctkcl);
            dcli = cS.timestep * ((-icltot * cC.acap) /
                        (cC.vmyo * cS.zcl * cS.frdy)  +  ctnacl  +  ctkcl)
            cS.ki = dki  +  cS.ki;
            cS.nai = dnai  +  cS.nai;
            cS.cli = dcli  +  cS.cli;

            dcai = cS.timestep * -((cS.icab  +  cS.ipca - 2.0 * cS.inaca ) * cC.acap / 
                        (cS.zca * cS.frdy * cC.vmyo) + (cS.qup - cS.qleak) * 
                        cC.vnsr / cC.vmyo - qdiff * cC.vss / cC.vmyo);
            catotal = dcai / (1.0  +  cS.cmdnbar * cS.kmcmdn / 
                        ((cS.kmcmdn + cS.cai) * (cS.kmcmdn + cS.cai))
                         + cS.trpnbar * cS.kmtrpn / ((cS.kmtrpn + cS.cai) 
                         * (cS.kmtrpn + cS.cai)));
            cS.cai = cS.cai  +  catotal;

        // update CAMKINASE
            camkbound = cS.camk0 * (1.0 - cS.camktrap )* 1.0 / (1.0 + (cS.kmcam / cS.car));
            cS.camktrap = cS.timestep * (cS.alphacamk * camkbound * (camkbound + cS.camktrap)
                                  - cS.betacamk * cS.camktrap)  +  cS.camktrap;
            cS.camkactive = camkbound  +  cS.camktrap;   

            cS.v = cS.v - itot * cS.timestep; 

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
		//Some variables in initial settings.
        this.vcell = 1000. * cS.pi * cS.radius * cS.radius * cS.length;
		this.ageo = 2. * cS.pi * cS.radius * cS.radius + 2. * cS.pi * cS.radius * cS.length;
		this.acap = cS.rcg * this.ageo;
		this.vmyo = this.vcell * 0.68;
		this.vnsr = this.vcell * 0.0552;
		this.vjsr = this.vcell * 0.0048;
		this.vss = this.vcell * 0.02;

		// Useful values / constants
		this.exppowtau = Math.exp(-cS.timestep / cS.powtau);
		this.exphltau = Math.exp(-cS.timestep / cS.hltau);
		this.expaatau = Math.exp(-cS.timestep / cS.aatau);
		this.exprotau = Math.exp(-cS.timestep / cS.rotau);
		this.sigma=(1.0 / 7.0)*(Math.exp(cS.nao / 67.3)-1.0);
		this.fort = cS.frdy/(cS.R * cS.temp);
		this.rtof = 1.0 / this.fort;
		this.f2ort = cS.frdy * this.fort;
		this.nao3 = Math.pow(cS.nao,3); //nao * nao * nao;
		this.kmnao3 = Math.pow(cS.kmnao,3); //kmnao * kmnao * kmnao;
		this.kmnai3 = Math.pow(cS.kmnai,3); //kmnai * kmnai * kmnai;
		this.gk1 = cS.gbark1 * Math.sqrt(cS.ko / 5.4);
		this.gkr = cS.gbarkr * Math.sqrt(cS.ko / 5.4);
		this.ctnacl4 = Math.pow(87.8251,4);//87.8251 * 87.8251 * 87.8251 * 87.8251
		this.icabcoeff = cS.pcab * cS.zca * cS.zca * this.f2ort;
 	 	
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
	 * This is the api that is returned by HunrudyCalculator. It contains the
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