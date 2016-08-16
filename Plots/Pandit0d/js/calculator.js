/**
 * This module is responsible for performing the differential equation
 * calculation for Pandit. The object maintains the state of the different
 * variables and returns them after each calculation. These variables can also
 * be reset. 
 */

 define(["utility"],
  function PanditCalculator(utils) {
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
		//reset(newSettings);
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

		var mbart_t, exptaumt_t, hbart_t, jbart_t, exptauht_t, exptaujt_t, dbart_t, f11bart_t, 
	 		f12bart_t, exptaudt_t, exptauf11t_t, exptauf12t_t, rbart_t, sbart_t, sslowbart_t,
	 		exptaurt_t, exptaust_t, exptausslowt_t, rssbart_t, sssbart_t, exptaursst_t, yinft_t,
        	exptauyt_t, inakt_t, inacat1_t, inacat2_t, ik1t1_t, cassmt_t, cassnt_t, fbt_t,rbt_t,
	 	
	 		taum, tauh, tauj, taud, tauf11, tauf12, taur, taus, tausslow, taurss, 
	 		ccass, ena, ek, vmek,ik1t2_t,ik1t3_t, mbar, hbar, jbar, dbar, f11bar, f12bar, cainactbar, rbar,
	 		sbar, sslowbar, rssbar, sssbar, Nai3, cassm, cassn, mya, myb, myc, myd, mye,
	 		myf, myg, myh, myi, myj, myy1, myy2, myy3, myy4, myx1, myx2, myx3, myx4, Jrel,
	 		fb, rb, Jup, Jtr, Jxfer, Jtrpn, Bss, Bjsr, Bi ;
	 		

	 	//tables
	 	mbart_t = 1.0 / (1.0 + Math.exp((cS.v + 45.0) / (-6.5)));
        taum = (Math.abs(cS.v + 47.13) < 1e-4) ? 0.000151018 : 
        			0.00136 / (((0.32  * (cS.v + 47.13)) / 
                	(1.0-Math.exp(-0.1 * (cS.v + 47.13)))) + 0.08 * Math.exp(-1.0 * cS.v / 11.0));
        
        exptaumt_t = Math.exp(-cS.timestep / taum);
        hbart_t  = 1.0 / (1.0 + Math.exp((cS.v + 76.1) / 6.07));
        jbart_t  = hbart_t; 
        if(cS.v > -40.0){
           tauh = 0.0004537  *  (1.0 + Math.exp(-1.0  *  (cS.v + 10.66) / 11.1));
           tauj = 0.01163  *  (1.0 + Math.exp(-0.1  *  (cS.v + 32.0))) / Math.exp(-2.535e-7 * cS.v);
        }
        else{
           tauh = 0.00349 / (0.135 * Math.exp(-1.0 * (cS.v + 80.0) / 6.8)  +  
               3.56 * Math.exp(0.079 * cS.v)  +  3.1e5 * Math.exp(0.35 * cS.v));
           tauj = 0.00349 / ((cS.v + 37.78) * (-127140.0 * Math.exp(0.2444 * cS.v)
               -3.474e-5 * Math.exp(-0.04391 * cS.v)) / 
               (1.0 + Math.exp(0.311 * (cS.v + 79.23)))  + 0.1212 * Math.exp(-0.01052 * cS.v) / 
               (1.0 + Math.exp(-0.1378 * (cS.v + 40.14))) );
        }
        exptauht_t = Math.exp(-cS.timestep / tauh);
        exptaujt_t = Math.exp(-cS.timestep / tauj);
        dbart_t  = 1.0 / (1.0 + Math.exp((cS.v + 15.3) / (-5.0)));
        f11bart_t  = 1.0 / (1.0 + Math.exp((cS.v + 26.7) / 5.4));
        f12bart_t  = f11bart_t ;
        taud = 0.00305 * Math.exp(-0.0045 * (cS.v + 7.0) * (cS.v + 7.0)) +  
            0.00105 * Math.exp(-0.002 * (cS.v-18.0) * (cS.v-18.0))  + 0.00025;
        tauf11 = 0.105 * Math.exp(-1.0 * ((cS.v + 45.0) / 12.0) * ((cS.v + 45.0) / 12.0))  + 
            0.04 / (1.0 + Math.exp((-1.0 * cS.v + 25.0) / 25.0))  +  0.015 / 
            (1.0 + Math.exp((cS.v + 75.0) / 25.0)) + 0.0017;
        tauf12 = 0.041 * Math.exp(-1.0 * ((cS.v + 47.0) / 12.0) * ((cS.v + 47.0) / 12.0))  + 
            0.08 / (1.0 + Math.exp((cS.v + 55.0) / (-5.0)))  +  
            0.015 / (1.0 + Math.exp((cS.v + 75.0) / 25.0)) + 0.0017;
        exptaudt_t = Math.exp(-cS.timestep / taud);
        exptauf11t_t = Math.exp(-cS.timestep / tauf11);
        exptauf12t_t = Math.exp(-cS.timestep / tauf12);

        rbart_t  = 1.0 / (1.0  +  Math.exp((cS.v + 10.6) / (-11.42)));
        sbart_t  = 1.0 / (1.0  +  Math.exp((cS.v + 45.3) / 6.8841));
        sslowbart_t  = sbart_t ;
        taur = 1.0 / (45.16 * Math.exp(0.03577 * (cS.v + 50.0)) 
             +  98.9 * Math.exp(-0.1 * (cS.v + 38.0)));

        if(cS.iType === "epi"){
            taus = 0.35 * Math.exp(-1.0 * (((cS.v + 70) / 15.0) * ((cS.v + 70) / 15.0)))  +  0.035;
            tausslow = 3.7 * Math.exp(-1.0 * (((cS.v + 70) / 30.0) * ((cS.v + 70) / 15.0))) +  0.035;
        }
        else{ //iType = "endo"
            taus = 0.55 * Math.exp(-1.0 * (((cS.v + 70) / 25.0) * ((cS.v + 70) / 25.0)))  +  0.049;
            tausslow = 3.3 * Math.exp(-1.0 * (((cS.v + 70) / 30.0) * ((cS.v + 70) / 30.0))) +  0.049;
        }

        
        exptaurt_t = Math.exp(-cS.timestep / taur);
        exptaust_t = Math.exp(-cS.timestep / taus);
        exptausslowt_t = Math.exp(-cS.timestep / tausslow);

        rssbart_t  = 1.0 / (1.0 + Math.exp((cS.v + 11.5) / (-11.82)));
        sssbart_t  = 1.0 / (1.0 + Math.exp((cS.v + 87.5) / 10.3));
        taurss = 10.0 / (45.16 * Math.exp(0.03577 * (cS.v + 50.0)) + 
            98.9 * Math.exp(-0.1 * (cS.v + 38.0)));
        exptaursst_t = Math.exp(-cS.timestep / taurss);

        yinft_t  = 1.0 / (1.0  +  Math.exp((cS.v + 138.6) / 10.48));
        cS.tauy = 1.0 / (0.11885 * Math.exp((cS.v + 80.0) / 28.37) + 
            0.5623 * Math.exp((cS.v + 80.0) / (-14.19)));
        exptauyt_t = Math.exp(-cS.timestep / cS.tauy);

        inakt_t = cS.Inakbar * (1.0 / (1.0 + 0.1245 * Math.exp(-0.1 * cS.v * cC.fort) + 
            0.0365 * cC.sig * Math.exp(-1.0 * cS.v * cC.fort))) * (cS.Ko / (cS.Ko + cS.Kmk));

        inacat1_t = Math.exp(0.03743 * cS.gam * cS.v);
        inacat2_t = Math.exp(0.03743 * (cS.gam - 1.0) * cS.v);

        ik1t1_t  = (48.0 / (Math.exp((cS.v + 37.0) / 25.0) 
             	+ Math.exp((cS.v + 37.0) / (-25.0))) +  10.0);

        cassmt_t = Math.pow(cS.cass,cS.mpow);
        cassnt_t = Math.pow(cS.cass,cS.npow);

      	fbt_t = Math.pow((cS.cai/cS.Kfb),cS.Nfb);

        rbt_t = Math.pow((cS.cansr/cS.Krb),cS.Nrb);
        
        //Time Loop

        // reversal potentials
        ena = cC.rtof * Math.log(cS.Nao / cS.nai);
        ek = cC.rtof * Math.log(cS.Ko / cS.ki);

        vmek = cS.v - ek;
        ik1t2_t = (0.001 / (1.0 + Math.exp((vmek-76.77) / (-17.0))));
        ik1t3_t = cS.gk1 * (vmek - 1.73) / 
             (1.0 + Math.exp(1.613 * cC.fort * (vmek - 1.73))
             * (1.0 + Math.exp((cS.Ko - 0.9988) / (-0.124))));

        cS.istim = _s1s2Stimulus(count,data);

        // update currents and gating variables

		// INa
        mbar = mbart_t; 
        hbar = hbart_t;
        jbar = jbart_t;

        cS.m = mbar - (mbar - cS.m) * (exptaumt_t);
        cS.h = hbar - (hbar - cS.h) * (exptauht_t);
        cS.j = jbar - (jbar - cS.j) * (exptaujt_t);

        cS.ina = cS.gna * cS.m * cS.m * cS.m * cS.h * cS.j * (cS.v - ena);

		// ICaL
        dbar = dbart_t;
        f11bar = f11bart_t;
        f12bar = f12bart_t;
        cainactbar  =  1.0 / (1.0  +  cS.cass / 0.01);

        cS.d = dbar - (dbar - cS.d) * (exptaudt_t);
        cS.f11 = f11bar - (f11bar - cS.f11)	* (exptauf11t_t);
        cS.f12 = f12bar - (f12bar - cS.f12) * (exptauf12t_t);
        cS.cainact = cainactbar - (cainactbar - cS.cainact) * cC.exptaucainact;
        
        cS.ical  =  cS.gcal * cS.d * ((0.9 + cS.cainact / 10.0) * cS.f11
              + (0.1 - cS.cainact / 10.0) * cS.f12) * (cS.v - cS.Ecal);

		// Ito
        rbar = rbart_t;
        sbar = sbart_t;
        sslowbar = sslowbart_t;

        cS.r = rbar - (rbar - cS.r) * (exptaurt_t);
        cS.s = sbar - (sbar - cS.s) * (exptaust_t);
        cS.sslow = sslowbar-(sslowbar - cS.sslow) * (exptausslowt_t);

        cS.it  =  cS.gt * cS.r * (cS.a * cS.s + cS.b * cS.sslow) * (cS.v - ek);

        

		// Iss
        rssbar = rssbart_t;
        sssbar = sssbart_t;

        cS.rss = rssbar - (rssbar - cS.rss)	* (exptaursst_t);
        cS.sss = sssbar - (sssbar - cS.sss) * cC.exptausss;

        cS.iss  =  cS.gss * cS.rss * cS.sss * (cS.v - ek);
		
		// If
        cS.yinf = yinft_t;
        cS.y = cS.yinf - (cS.yinf - cS.y) * (exptauyt_t);

        cS.ifk = cS.gf * cS.y * cC.fk * (cS.v - ek);
        cS.ifna = cS.gf * cS.y * cS.fna * (cS.v - ena);
        cS.if = cS.ifk + cS.ifna;

		// IK1
        cS.ik1  =  (ik1t1_t) * (ik1t2_t) + (ik1t3_t);


		// background currents
        cS.ibna = cS.gbna * (cS.v - ena);
        cS.ibk  = cS.gbk * (cS.v - ek);
        cS.ibca = cS.gbca * (cS.v - cS.Ecal);
        cS.ib   = cS.ibna + cS.ibca + cS.ibk;

		// INaK
        cS.inak=(inakt_t) * (1.0 / (1.0 + (Math.sqrt(cS.Kmna / cS.nai) * cS.Kmna / cS.nai)));

		// ICaP
        cS.icap  =  cS.Icapbar * (cS.cai / (cS.cai + 0.0004));

		// INaCa
        Nai3 = Math.pow(cS.nai,3); //cS.nai * cS.nai * cS.nai

        cS.inaca = cS.knaca * (Nai3 * cS.Cao * (inacat1_t) - 
             cC.Nao3 * cS.cai * inacat2_t) / 
             (1.0 + cS.dnaca * (cC.Nao3 * cS.cai + Nai3 * cS.Cao));

        // calcium subsystem
//         cS.pc1  =  cS.pc1 + cS.timestep * (-1.0 * Kaplus * (cS.cass *  * npow) * cS.pc1  +  Kaminus * cS.po1)
//         cS.po1  =  cS.po1 + cS.timestep * (Kaplus * (cS.cass *  * npow) * cS.pc1 
//             - Kaminus * cS.po1-Kbplus * (cS.cass *  * mpow) * cS.po1
//              + Kbminus * cS.po2 - Kcplus * cS.po1 + Kcminus * cS.pc2)
//         cS.po2  =  cS.po2 + cS.timestep * (Kbplus * (cS.` *  * mpow) * cS.po1 - Kbminus * cS.po2)
//         cS.pc2  =  cS.pc2 + cS.timestep * (Kcplus * cS.po1 - Kcminus * cS.pc2)
		
		 // if(icass1.ge.0.and.icass2.le.ncasst) then
            // cassm = cassmt(icass1) * qcass2 + cassmt(icass2) * qcass1
            // cassn = cassnt(icass1) * qcass2 + cassnt(icass2) * qcass1
         // else
        cassm = Math.pow(cS.cass,cS.mpow);
        cassn = Math.pow(cS.cass,cS.npow);
         
        mya = 1 + cS.timestep * (cS.Kaminus + cS.Kbplus * cassm + cS.Kcplus);
        myb = -cS.timestep * cS.Kbminus;
        myc = -cS.timestep * cS.Kaplus * cassn;
        myd = -cS.timestep * cS.Kcminus;
        mye = -cS.timestep * cS.Kbplus * cassm;
        myf = 1 + cS.timestep * cS.Kbminus;
        myg = -cS.timestep * cS.Kaminus;
        myh = 1 + cS.timestep * cS.Kaplus * cassn;
        myi = -cS.timestep * cS.Kcplus;
        myj = 1 + cS.timestep * cS.Kcminus;
        myy1 = cS.po1;
        myy2 = cS.po2;
        myy3 = cS.pc1;
        myy4 = cS.pc2;

        myx1 = (myy1 - myy2 * myb / myf - myy3 * myc / myh - myy4 * myd / myj)
              / (mya - myb * mye / myf - myc * myg / myh - myd * myi / myj);
        myx2 = (myy2 - mye * myx1) / myf;
        myx3 = (myy3 - myg * myx1) / myh;
        myx4 = (myy4 - myi * myx1) / myj;

        cS.po1 = myx1;
        cS.po2 = myx2;
        cS.po  = cS.po1 + cS.po2; 
        cS.pc1 = myx3;
        cS.pc2 = myx4;

        
        
// compute calcium fluxes
        Jrel =  cS.v1 * (cS.po) * (cS.cajsr-cS.cass)
         
        // if(icai1 > 0 && icai2.le.ncait) 
        //    fb = fbt(icai1) * qcai2 + fbt(icai2) * qcai1
        // else
        fb = (Math.pow((cS.cai / cS.Kfb),cS.Nfb));
         	
        // if(icansr1.ge.0.and.icansr2.le.ncansrt) 
        //    rb = rbt(icansr1) * qcansr2 + rbt(icansr2) * qcansr1
        // else
        rb =  (Math.pow((cS.cansr / cS.Krb) , cS.Nrb));
         
        Jup = cS.Ksr * (cS.vmaxf * fb - cS.vmaxr * rb) / (1.0 + fb + rb);
        Jtr = (cS.cansr - cS.cajsr) / cS.tautr;
        Jxfer = (cS.cass - cS.cai) / cS.tauxfer;

        Jtrpn = (cS.Khtrpnplus * cS.cai * (cS.HTRPNtot-cS.htrpn) - cS.Khtrpnminus * cS.htrpn) 
              + (cS.Kltrpnplus * cS.cai * (cS.LTRPNtot - cS.ltrpn) - cS.Kltrpnminus * cS.ltrpn);

        Bss = 1.0 / (1.0 + cS.CMDNtot * cS.KmCMDN / ((cS.KmCMDN + cS.cass) * (cS.KmCMDN + cS.cass)));
        Bjsr = 1.0 / (1.0 + cS.CSQNtot * cS.KmCSQN / ((cS.KmCSQN + cS.cajsr) * (cS.KmCSQN + cS.cajsr)));
        Bi = 1.0 / (1.0  +  cS.CMDNtot * cS.KmCMDN / ((cS.KmCMDN + cS.cai) * (cS.KmCMDN + cS.cai)) + 
             cS.EGTAtot * cS.KmEGTA / ((cS.KmEGTA + cS.cai) * (cS.KmEGTA + cS.cai)));

// update ionic concentrations
        cS.nai = cS.nai + cS.timestep * (-1.0) * (cS.ina + cS.ibna + 3.0 * cS.inaca + 3.0 * cS.inak + cS.ifna)
              * (1.0 / (cS.Volmyo * cS.FF));
        cS.ki = cS.ki + cS.timestep * (-1.0) * (cS.iss + cS.ibk + cS.it + cS.ik1 + cS.ifk-2.0 * cS.inak)
              * (1.0 / (cS.Volmyo * cS.FF));
        cS.cai = cS.cai + cS.timestep * Bi * (Jxfer - Jup - Jtrpn - (cS.ibca - 2.0 * cS.inaca + cS.icap) * 
             1.0 / (2.0 * cS.Volmyo * cS.FF));
        cS.cass = (cS.cass + cS.timestep * Bss * (cS.v1 * (cS.po)
              * cS.Voljsr / cS.Volss * cS.cajsr
              + (cS.Volmyo / cS.Volss) * (cS.cai / cS.tauxfer) - cS.ical / (2.0 * cS.Volss * cS.FF))) / 
             (1. + cS.timestep * Bss * (cS.v1 * (cS.po) * cS.Voljsr / cS.Volss
              + cS.Volmyo / cS.Volss / cS.tauxfer));
        cS.cajsr = cS.cajsr + cS.timestep * Bjsr * (Jtr - Jrel);
        cS.cansr = cS.cansr + cS.timestep * (Jup * cS.Volmyo / cS.Volnsr - Jtr * cS.Voljsr / cS.Volnsr);
        cS.htrpn = cS.htrpn + cS.timestep * (cS.Khtrpnplus * cS.cai
             * (cS.HTRPNtot - cS.htrpn) - cS.Khtrpnminus * cS.htrpn);
        cS.ltrpn = cS.ltrpn + cS.timestep * (cS.Kltrpnplus * cS.cai
              * (cS.LTRPNtot - cS.ltrpn) - cS.Kltrpnminus * cS.ltrpn);
        
// update voltage
        cS.v = cS.v + cS.timestep * (-1.0) * (cS.ina + cS.ical + cS.it + cS.iss + cS.if
              + cS.ik1 + cS.ib + cS.inak + cS.inaca + cS.icap-cS.istim) / cS.Cm;
        
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

		// nice values to precompute
		this.fort = cS.FF / (cS.RR * cS.TT);
      	this.rtof = cS.RR * cS.TT / cS.FF;
      	this.exptaucainact = Math.exp(-cS.timestep / cS.tauCainact);
      	this.exptausss = Math.exp(-cS.timestep / cS.tausss);
      	this.fk = 1.0 - cS.fna;
      	this.Nao3 = Math.pow(cS.Nao,3); //cS.Nao * cS.Nao * cS.Nao;
//      this.Ena = this.rtof * Math.log(cS.Nao/cS.nai);
//      this.Ek = this.rtof * Math.log(cS.Ko/cS.ki);
      	this.sig = (Math.exp(cS.Nao / 67.3) - 1.0) / 7.0;
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

   /* This function iteratively calls all the analyzers and performs 
    * all the calculations to generate points to be displayed on the
    * plotter
    * param {int} iterations
    * param {object} settings
    */
	function runCalculations(iterations, settings) {
	 	var state   =    settings,
	 	data,
        curAnalyzer,
        iTypeValues = {}; 

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
        /* 
         * Run the calculations the appropriate number of times and 
         * pass these values to the analyzers using their aggregate
         * function
         */
         
         for (var i = 0; i < numCalculations; i++) {
         	var data = calculateNext(state);          
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
	 	var dur = utils.round(c.stimdur / c.timestep);
	 	var periods = stimuli.s1;
	 	for (var i = 0; i < periods.length; i++) {
	 		var periodX = utils.round(periods[i] / c.timestep);
	 		if ((count >= periodX) && (count < periodX + dur)) {
	 			stim = c.stimmag;
	 		}
	 	}
	 	var lastPeriodX = utils.round(stimuli.s2 / c.timestep);
	 	if ((count >= lastPeriodX) && (count < lastPeriodX + dur)) {
	 		stim = c.stimmag;
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
	 * This is the api that is returned by PanditCalculator. It contains the
	 * properties and functions that are accessible from the outside.
	 */
	 var api = {
	 	addAnalysisFunction: addAnalysisFunction,
	 	runCalculations: runCalculations,
	 	initialize: initialize,
	 	updateSettingsWithAnalyzers : updateSettingsWithAnalyzers,
		reset: reset
	};
	return api;
});