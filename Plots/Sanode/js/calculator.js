/**
 * This module is responsible for performing the differential equation
 * calculation for Sanode. The object maintains the state of the different
 * variables and returns them after each calculation. These variables can also
 * be reset. 
 */


define(["utility"],
  function SanodeCalculator(utils) {
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
		cS 	 =   _.cloneDeep(settings.calculationSettings);	
		cC 	 =   new CalcConstants(settings.calculationSettings);
	}

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
		cS 	 =   _.cloneDeep(settings.calculationSettings);	
		cC 	 =   new CalcConstants(settings.calculationSettings);
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
	 * Performs a differential calculations considering one point at a time.
	 */
	function calculateNextCentral(data) {
        // sets voltage variables after calculations
	 	data.calculationSettings.voltageVariables.forEach(function (item){
           cS[item]  =    data.calculationSettings[item];
	 	});

	 	// sets current variables after calculations
	 	data.calculationSettings.currentVariables.forEach(function (item){
           cS[item]  =    data.calculationSettings[item];
	 	});

        data.calculationSettings.additionalVariables.forEach(function (item){
           data.calculationSettings[item]  =   cS[item];
        });

        cS.gfk = cS.gfna;

        //Table setup for voltage-dependent functions
        var adl, bdl, afl, bfl, adt, bdt, aft, bft, tr, tq, ay, by  ;

        var tdlt_t, bar_dlt_t, tflt_t, bar_flt_t,
        	d_1t_t, tdtt_t, bar_dtt_t, tftt_t, bar_ftt_t, bar_paft_t, bar_past_t,
        	tpaft_t, tpast_t, bar_piit_t, ast_t, bst_t, bar_rt_t,
    		trt_t, bar_qt_t, tqt_t, bar_yt_t, tyt_t, inakdenom_t, inacat_t ;

        if(Math.abs(cS.v + 35.0) < 1e-4)
            adl = 36.525;
        else if(Math.abs(cS.v) < 1e-4)
            adl = 701.09;
        else
            adl = -14.20 * (cS.v + 35.0) / (Math.exp(-(cS.v + 35.0) / 2.5) - 1.0)
               			- 42.45 * cS.v / (Math.exp(-0.208 * cS.v) - 1.0);

        if(Math.abs(cS.v - 5.0) < 1e-4)
            bdl = 14.275;
        else
            bdl = 5.71 * (cS.v - 5.0) / (Math.exp(0.4 * (cS.v - 5.0)) - 1.0);
        
        tdlt_t = 1.0 / (adl + bdl);
        bar_dlt_t = 1.0 / (1.0 + Math.exp(-(cS.v + 22.3) / 6.0));

        if(Math.abs(cS.v + 28.0) < 1e-4)
            afl = 3.12 * 4.0;
        else
            afl = 3.12 * (cS.v + 28.0) / (Math.exp((cS.v + 28.0) / 4.0) - 1.0);

       	bfl = 25.0 / (1.0 + Math.exp(-(cS.v + 28.0) / 4.0));
        tflt_t = 1.0 / (afl + bfl);
        bar_flt_t = 1. / (1.0 + Math.exp((cS.v + 45.0) / 5.));

        d_1t_t = 1.0 / (1.0 + Math.exp(-(cS.v + 14.1) / 6.0));

        adt = 1068.0 * Math.exp((cS.v + 26.3) / 30.);
        bdt = 1068.0 * Math.exp(-(cS.v + 26.3) / 30.);
         
        tdtt_t = 1.0 / (adt + bdt);
        bar_dtt_t = 1.0 / (1.0 + Math.exp(-(cS.v + 37.0) / 6.8));

        aft = 15.3 * Math.exp(-(cS.v + 71.0) / 83.3);
        bft = 15. * Math.exp((cS.v + 71.0) / 15.38);

        tftt_t = 1. / (aft + bft);
        bar_ftt_t = 1. / (1 + Math.exp((cS.v + 71.0) / 9.0));

        bar_paft_t = 1.0 / (1.0 + Math.exp(-(cS.v + 23.2 - 9.0) / 10.6));
        bar_past_t = bar_paft_t;
    	
    	tpaft_t = 1. / (37.2 * Math.exp((cS.v - 9.0) / 15.9) +
             0.96 * Math.exp(-(cS.v - 9.0) / 22.5));
        tpast_t = 1. / (4.2 * Math.exp((cS.v - 9.0) / 17.0)
              + 0.15 * Math.exp(-(cS.v - 9.0) / 21.6));

        bar_piit_t = 1.0 / (1.0 + Math.exp((cS.v + 28.6 - 9.0) / 10.1));

        ast_t = 14.0 / (1.0 + Math.exp(-(cS.v - 40.0) / 9.0));
        bst_t = Math.exp(-(cS.v) / 45.0);

        bar_rt_t = 1. / (1 + Math.exp(-(cS.v - 10.93) / 19.70));

        tr = 2.98 + 15.96 / (1.037 * Math.exp(0.09012 * (cS.v + 30.61)) +
             0.369 * Math.exp(-0.1190 * (cS.v + 23.84)));

        trt_t = tr * 1.0e-3;
      
        bar_qt_t = 1.0 / (1.0 + Math.exp((cS.v + 59.37) / 13.1));

        tq = 10.10 + 65.17 / (0.5686 * Math.exp(-0.08161 * (cS.v + 49.0)) +
             0.7174 * Math.exp(0.2719 * (cS.v + 50.93)));

        tqt_t = tq * 1.0e-3;

        ay = Math.exp(-(cS.v + 78.91) / 26.63);
        by = Math.exp((cS.v + 75.13) / 21.25);
        bar_yt_t = ay / (ay + by);
        tyt_t = 1. / (ay + by);

        inakdenom_t = (1.5 + Math.exp(-(cS.v + 60) / 40));

        inacat_t = 0.27e-5 * (cC.nai3 * cS.cao * Math.exp(0.03743 * cS.v * 0.5) -
            	cC.nao3 * cS.cai * Math.exp(0.03743 * cS.v * (0.5 - 1))) / 
             	(1 + 0.0001 * (cS.cai * cC.nao3 + cS.cao * cC.nai3));
        
        // TIME LOOP

        // compute currents

        // ina
        cS.ina = 0.0;

		// ical
        var temp;
        temp = (bar_dlt_t - cS.sdl) / tdlt_t;
        cS.sdl = cS.sdl + temp * cS.timestep;
        temp = (bar_flt_t - cS.sfl) / tflt_t;
        cS.sfl = cS.sfl + temp * cS.timestep;

        cS.ical = cS.gcal * (cS.sdl * cS.sfl + 
        			0.006 * d_1t_t) * (cS.v - 46.4);

		// icat
        temp = (bar_dtt_t - cS.sdt) / tdtt_t;
        cS.sdt = cS.sdt + temp * cS.timestep;

        temp = (bar_ftt_t - cS.sft) / tftt_t;
        cS.sft = cS.sft + temp * cS.timestep;

        cS.icat = cS.gcat * cS.sdt * cS.sft * (cS.v - 45.);


		// ikr,iks
        temp = (bar_paft_t - cS.spaf) / tpaft_t;
        cS.spaf = cS.spaf + temp * cS.timestep;

        temp = (bar_past_t - cS.spas) / tpast_t;
        cS.spas = cS.spas + temp * cS.timestep;

        temp = (bar_piit_t - cS.spii) / cS.tpii;
        cS.spii = cS.spii + temp * cS.timestep;

        cS.ikr = cS.gkr * (0.6 * cS.spaf + 0.4 
        			* cS.spas) * cS.spii * (cS.v - cC.ek);

        temp = ast_t * (1 - cS.sxs) - bst_t * cS.sxs;
        cS.sxs = cS.sxs + temp * cS.timestep;

        cS.iks = cS.gks * cS.sxs * cS.sxs * (cS.v - cC.eks);
      	cS.ik = cS.ikr + cS.iks;

		// ito
        temp = (bar_rt_t - cS.sr) / trt_t;
        cS.sr = cS.sr + temp * cS.timestep;

        temp = (bar_qt_t - cS.sq) / tqt_t;
        cS.sq = cS.sq + temp * cS.timestep;
        cS.ito  = cS.gto * cS.sq * cS.sr * (cS.v - cC.ek);

		// ikp (  =  isus)
        cS.ikp = cS.gkp * cS.sr * (cS.v - cC.ek);

		// ib
        cS.ibna = cS.gbna * (cS.v - cC.ena);
        cS.ibca = cS.gbca * (cS.v - cC.eca);
        cS.ibk = cS.gbk * (cS.v - cC.ek);

        cS.ib = cS.ibna + cS.ibca + cS.ibk;


        // formulation of if
        temp = (bar_yt_t - cS.sy) / tyt_t;
        cS.sy = cS.sy + temp * cS.timestep;

        cS.ifna = cS.gfna * cS.sy * (cS.v - cC.ena);
        cS.ifk = cS.gfk * cS.sy * (cS.v - cC.ek);

        cS.if = cS.ifna + cS.ifk;

		// inak (ip),icap,inaca

        cS.inak = cC.inaknumer / inakdenom_t;

		// icap is a constant since cai is constant!
        cS.icap = 4.17e-3 * cS.cai/(cS.cai + 0.0004);
        
        cS.inaca = inacat_t;
        
        temp = -(cS.ina + cS.icat + cS.ical + cS.ik + cS.ito + 
        	cS.ikp + cS.if + cS.ib + cS.inak + cS.inaca + cS.icap) 
        	/ cS.cm;
        
        cS.v = cS.v + temp * cS.timestep;
        
        // sets voltage variables after calculations
	 	data.calculationSettings.voltageVariables.forEach(function (item){
           data.calculationSettings[item]  =   cS[item];
	 	});

	 	// sets current variables after calculations
	 	data.calculationSettings.currentVariables.forEach(function (item){
           data.calculationSettings[item]  =   cS[item];
	 	});

        data.calculationSettings.voltageVariables.forEach(function (item){
           data.calculationSettings[item]  =   cS[item];
        });

        data.calculationSettings.additionalVariables.forEach(function (item){
           data.calculationSettings[item]  =   cS[item];
        });

	 	// iterate the count
		count++;

		return data;
    }
    function calculateNextPeripheral(data) {
        // sets voltage variables after calculations
        data.calculationSettings.voltageVariables.forEach(function (item){
           cS[item]  =    data.calculationSettings[item];
        });

        // sets current variables after calculations
        data.calculationSettings.currentVariables.forEach(function (item){
           cS[item]  =    data.calculationSettings[item];
        });

        cS.gfk = cS.gfna;
        
        var bar_mt_t, tmt_t, bar_ht_t, th1t_t, th2t_t, tdlt_t, bar_dlt_t,
            tflt_t, bar_flt_t, d_1t_t, tdtt_t, bar_dtt_t, tftt_t, bar_ftt_t, 
            bar_paft_t, bar_past_t, tpaft_t, tpast_t, bar_piit_t, ast_t, bst_t,
            bar_rt_t, trt_t, bar_qt_t, tqt_t, bar_yt_t, tyt_t, inakdenom_t, inacat_t,
            bar_h1, bar_h2 ;

          

        var b1m, c1m, d1m, b2m, c2m, d2m, em, ah, bh, adl, bdl,
            afl, bfl, adt, bdt, aft, bft, tr, tq, ay, by,
            temp, sh_new    ;

        bar_mt_t = Math.pow((1.0 / (1 + Math.exp(-(cS.v + 25.32) / 5.46))),(1 / 3));

        b1m = 0.8322166;
        c1m = 0.33566;
        d1m = 56.7062;
        b2m = 0.6274;
        c2m = 0.0823;
        d2m = 65.0131;
        em = 0.04569e-3;
        tmt_t = 0.6247e-3 / (b1m * Math.exp(-c1m * (cS.v + d1m))
              + b2m * Math.exp(c2m * (cS.v + d2m))) + em;

        ah = 44.9 * Math.exp(-(cS.v + 66.9) / 5.570);
        bh = 1491. / (323.3 * Math.exp(-(cS.v + 94.6) / 12.9) + 1);
        bar_ht_t = ah / (ah + bh);

        th1t_t = 0.03 / (1.+ Math.exp((cS.v + 40.0) / 6)) + 0.00035;
        th2t_t = 0.12 / (1.+ Math.exp((cS.v + 60.0) / 2)) + 0.00295;

        if(Math.abs(cS.v + 35.0) < 1e-4) 
            adl = 36.525;
        else if(Math.abs(cS.v) < 1e-4)
            adl = 701.09;
        else
            adl = -14.20 * (cS.v + 35.0) / (Math.exp(-(cS.v + 35.0) / 2.5) - 1.0)
                            - 42.45 * cS.v / (Math.exp(-0.208 * cS.v) - 1.0);
         
        if(Math.abs(cS.v-5.0) < 1e-4)
            bdl = 14.275;
        else
            bdl = 5.71 * (cS.v-5.0) / (Math.exp(0.4 * (cS.v-5.0))-1.0);
              
        tdlt_t = 1.0 / (adl + bdl);
        bar_dlt_t = 1.0 / (1.0 + Math.exp(-(cS.v + 22.3) / 6.0));

        if(Math.abs(cS.v + 28.0) < 1e-4)
            afl = 3.12 * 4.0;
        else
            afl = 3.12 * (cS.v + 28.0) / (Math.exp((cS.v + 28.0) / 4.0) - 1.0);
        
        bfl = 25.0 / (1.0 + Math.exp(-(cS.v + 28.0) / 4.0));
        tflt_t = 1.0 / (afl + bfl);
        bar_flt_t = 1. / (1.0 + Math.exp((cS.v + 45.0) / 5.));

        d_1t_t = 1.0 / (1.0 + Math.exp(-(cS.v + 14.1) / 6.0));

        adt = 1068.0 * Math.exp((cS.v + 26.3) / 30.);
        bdt = 1068.0 * Math.exp(-(cS.v + 26.3) / 30.);
         
        tdtt_t = 1.0 / (adt + bdt);
        bar_dtt_t=1.0 / (1.0 + Math.exp(-(cS.v + 37.0) / 6.8));

        aft = 15.3 * Math.exp(-(cS.v + 71.0) / 83.3);
        bft = 15. * Math.exp((cS.v + 71.0) / 15.38);

        tftt_t = 1. / (aft + bft);
        bar_ftt_t = 1. / (1 + Math.exp((cS.v + 71.0) / 9.0));

       

        bar_paft_t = 1.0 / (1.0 + Math.exp(-(cS.v + 23.2-9.0) / 10.6));
        bar_past_t = bar_paft_t;
        tpaft_t = 1. / (37.2 * Math.exp((cS.v-9.0) / 15.9) + 
             0.96 * Math.exp(-(cS.v-9.0) / 22.5));
        tpast_t = 1. / (4.2 * Math.exp((cS.v-9.0) / 17.0)
              + 0.15 * Math.exp(-(cS.v-9.0) / 21.6));

        bar_piit_t = 1.0 / (1.0 + Math.exp((cS.v + 28.6-9.0) / 10.1));

        ast_t = 14.0 / (1.0 + Math.exp(-(cS.v-40.0) / 9.0));
        bst_t = Math.exp(-(cS.v) / 45.0);

        bar_rt_t = 1. / (1 + Math.exp(-(cS.v-10.93) / 19.70));

        tr = 2.98 + 15.96 / (1.037 * Math.exp(0.09012 * (cS.v + 30.61)) + 
             0.369 * Math.exp(-0.1190 * (cS.v + 23.84)));

        trt_t = tr * 1.0e-3;
      
        bar_qt_t = 1.0 / (1.0 + Math.exp((cS.v + 59.37) / 13.1));

        tq = 10.10 + 65.17 / (0.5686 * Math.exp(-0.08161 * (cS.v + 49.0)) + 
             0.7174 * Math.exp(0.2719 * (cS.v + 50.93)));

        tqt_t = tq * 1.0e-3;

       
        ay = Math.exp(-(cS.v + 78.91) / 26.63);
        by = Math.exp((cS.v + 75.13) / 21.25);
        bar_yt_t = ay / (ay + by);
        tyt_t = 1 / (ay + by);

        inakdenom_t = (1.5 + Math.exp(-(cS.v + 60) / 40));

        inacat_t = 0.88e-5 * (cC.nai3 * cS.cao * Math.exp(0.03743 * cS.v * 0.5) - 
             cC.nao3 * cS.cai * Math.exp(0.03743 * cS.v * (0.5 - 1))) / 
             (1 + 0.0001 * (cS.cai * cC.nao3 + cS.cao * cC.nai3));
        
        // TIME LOOP BEGINS.

        // compute currents
        // ina

        temp = (bar_mt_t - cS.sm) / tmt_t;
        cS.sm = cS.sm + temp * cS.timestep;

        bar_h1 = bar_ht_t;
        bar_h2 = bar_h1;

        temp = (bar_h1 - cS.sh1) / th1t_t;
        cS.sh1 = cS.sh1 + temp * cS.timestep;

        temp = (bar_h2 - cS.sh2) / th2t_t;
        cS.sh2 = cS.sh2 + temp * cS.timestep;
        sh_new = 0.635 * cS.sh1 + 0.365 * cS.sh2;

        if(Math.abs(cS.v) > 1e-4) 
            cS.ina = cS.pna * cS.sm * cS.sm * cS.sm * sh_new * cS.nao * cS.faraday * cC.fort * 
                (Math.exp((cS.v - cC.ena) * cC.fort) - 1.0) / (Math.exp(cS.v * cC.fort) - 1) * cS.v;
        else
            cS.ina = cS.pna * cS.sm * cS.sm * cS.sm * sh_new * cS.nao * cS.faraday * cC.fort * 
                (Math.exp((cS.v - cC.ena) * cC.fort) - 1.0) * cC.rtof;
        

        // ical

        temp = (bar_dlt_t - cS.sdl) / tdlt_t;
        cS.sdl = cS.sdl + temp * cS.timestep;
        temp = (bar_flt_t - cS.sfl) / tflt_t;
        cS.sfl = cS.sfl + temp * cS.timestep;

        cS.ical = cS.gcal * (cS.sdl * cS.sfl + 0.006 * d_1t_t) * (cS.v - 46.4);

        // icat
        temp = (bar_dtt_t - cS.sdt) / tdtt_t;
        cS.sdt = cS.sdt + temp * cS.timestep;

        temp = (bar_ftt_t - cS.sft) / tftt_t;
        cS.sft = cS.sft + temp * cS.timestep;

        cS.icat = cS.gcat * cS.sdt * cS.sft * (cS.v - 45);

        // ikr,iks

        temp = (bar_paft_t - cS.spaf) / tpaft_t;
        cS.spaf = cS.spaf + temp * cS.timestep;
        temp = (bar_past_t - cS.spas) / tpast_t;
        cS.spas = cS.spas + temp * cS.timestep;

        temp = (bar_piit_t - cS.spii) / cS.tpii;
        cS.spii = cS.spii + temp * cS.timestep;

        cS.ikr = cS.gkr * (0.6 * cS.spaf + 0.4 * cS.spas) * cS.spii * (cS.v - cC.ek);

        temp = ast_t * (1 - cS.sxs) - bst_t * cS.sxs;
        cS.sxs = cS.sxs + temp * cS.timestep;

        cS.iks = cS.gks * cS.sxs * cS.sxs * (cS.v - cC.eks);
      
        cS.ik = cS.ikr + cS.iks;


        // ikp (  =  isus)

        cS.ikp = cS.gkp * cS.sr * (cS.v - cC.ek);

        // ito

        temp = (bar_rt_t - cS.sr) / trt_t;
        cS.sr = cS.sr + temp * cS.timestep;

        temp = (bar_qt_t - cS.sq) / tqt_t;
        cS.sq = cS.sq + temp * cS.timestep;
        cS.ito  = cS.gto * cS.sq * cS.sr * (cS.v - cC.ek);

        // ib
        cS.ibna = cS.gbna * (cS.v - cC.ena);
        cS.ibca = cS.gbca * (cS.v - cC.eca);
        cS.ibk = cS.gbk * (cS.v - cC.ek);
        cS.ib = cS.ibna + cS.ibca + cS.ibk;

        // formulation of if
        temp = (bar_yt_t - cS.sy) / tyt_t;
        cS.sy = cS.sy + temp * cS.timestep;

        cS.ifna = cS.gfna * cS.sy * (cS.v - cC.ena);
        cS.ifk = cS.gfk * cS.sy * (cS.v - cC.ek);

        cS.if = cS.ifna + cS.ifk;

        // block of I_f
        //cS.if = cS.if * 0.0

        // inak (ip),icap,inaca

        cS.inak = cC.inaknumer / inakdenom_t;

        // icap is a constant since cai is constant!
        cS.icap = 0.88e-5 * cS.cai / (cS.cai + 0.0004);

        cS.inaca = inacat_t;

        temp = -(cS.ina + cS.icat + cS.ical + cS.ik + cS.ito + cS.ikp + cS.if +
                    cS.ib + cS.inak + cS.inaca + cS.icap) / cS.cm;
        
        
        cS.v = cS.v + temp * cS.timestep;
        
        // sets voltage variables after calculations
        data.calculationSettings.voltageVariables.forEach(function (item){
           data.calculationSettings[item]  =   cS[item];
        });

        // sets current variables after calculations
        data.calculationSettings.currentVariables.forEach(function (item){
           data.calculationSettings[item]  =   cS[item];
        });

        // iterate the count
        count++;

        return data;
    }

    function CalcConstants(c){
		// Useful values / constants
		this.rtof = cS.r * cS.tt / cS.faraday;
      	this.fort = 1.0 / this.rtof;
      	this.nai3 = Math.pow(cS.nai,3);//nai * nai * nai
      	this.nao3 = Math.pow(cS.nao,3);//nao * nao * nao
	    this.ek = 26.71 * Math.log(cS.ko / cS.ki);
      	this.eks = this.rtof * Math.log((cS.ko + cS.pnak * cS.nao)
      					/ (cS.ki + cS.pnak * cS.nai));
      	this.ena = 26.71 * Math.log(cS.nao / cS.nai);
      	this.eca = 13.35 * Math.log(cS.cao / cS.cai);
      	this.inaknumer = 4.79e-2 * Math.pow((cS.nai / (cS.nai + 5.64)),3) 
	}

	function _getNumIterations(settings) {
	 	var c   =    settings.calculationSettings;
	 	var num   =    (c.endTime * 1.1) / c.timestep;
	 	num   =    Math.floor(num);
        return num;    
	}

	function runCalculations(iterations, settings) {
	 	var state   =    settings, 
	 	curAnalyzer,
        sanodeTypeValues = {};
        count   =    0;
        
        //need to update change in parameter values in page level cS object.
        state.calculationSettings.parameters.forEach(function (item){
           cS[item] = state.calculationSettings[item];
        });

        sanodeTypeValues   = { 
          sanodeC : { cm:20.0e-6,     
            gkp:6.65e-5,    gbna:0.58e-4,   gbca:1.32e-5,
            gbk:2.52e-5,    gfna:5.47e-4,   timestep: 0.0001,

            v   : 15.760660258312,      spii: 3.2132281142660e-02,
            sdl : 0.99815953112686,     sfl : 0.14004248323399,
            sdt : 0.99956816419731,     sft : 6.5705516478730e-05,
            sy  : 1.2809083561878e-02,  sr  : 0.53922249081045,
            sq  : 1.6146678857860e-02,  sxs : 7.5035050267509e-02, //sxs = n gate
            spaf: 0.55835887024974,     spas: 0.45592769434524,
           },

          sanodeP :{ cm: 65.0e-6, pna: 1.2e-6,
            gkp: 1.14e-2,   gbna: 1.89e-4,  gbca: 4.3e-5,
            gbk: 8.19e-5,   gfna: 0.69e-2,  timestep: 0.00005,

            v: -64.35,      sm: 0.124,      sh1: 0.595,
            sh2: 5.25e-2,   sdl: 8.45e-2,   sfl: 0.987,
            sdt: 1.725e-2,  sft: 0.436,     sy: 5.28e-2,
            sr: 1.974e-2,   sq: 0.663,      sxs: 7.67e-2,
            spaf: 0.400,    spas: 0.327,    spii: 0.991,
           } 
        };

        var sanodeDependants = {
            sanodeC : { normalPoints: {v : new Point(-58 , 22)},
                        threshholdPoint: {threshhold: -50 }},
            sanodeP : { normalPoints: {v : new Point(-78 , 24)},
                        threshholdPoint: {threshhold: -65 }}
        };

        // update the default settings based on the model selected.
        for(var item in sanodeTypeValues[state.calculationSettings.sanodeType]){
            state.calculationSettings[item] = sanodeTypeValues[state.calculationSettings.sanodeType][item];
            cS[item] = sanodeTypeValues[state.calculationSettings.sanodeType][item];
        };

        /**
         * Update the values to normalize the points based on sanodeType.
         */
         for (curAnalyzer = 0; curAnalyzer < analyzers.length; curAnalyzer++) {
            if (analyzers[curAnalyzer].hasOwnProperty("setSanodeDependants")) {
                analyzers[curAnalyzer].setSanodeDependants(sanodeDependants[state.calculationSettings.sanodeType],state);
            }
         }

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
            if (state.calculationSettings.sanodeType === "sanodeC"){ 
              var data = calculateNextCentral(state);
            }
            else{ 
             var data = calculateNextPeripheral(state);   
            }

            for (curAnalyzer = 0; curAnalyzer < analyzers.length; curAnalyzer++) {
         		if (analyzers[curAnalyzer].hasOwnProperty("aggregate")) {
                    // if(analyzers[curAnalyzer] === "pointBufferAnalyzer" || analyzers[curAnalyzer] === "s1s2Analyzer")
         			analyzers[curAnalyzer].aggregate(data);
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
	 * This is the api that is returned by SanodeCalculator. It contains the
	 * properties and functions that are accessible from the outside.
	 */
	 var api = {
	 	addAnalysisFunction: addAnalysisFunction,
	 	runCalculations: runCalculations,
	 	initialize: initialize,
	 	// calculateNext: calculateNext,
	 	updateSettingsWithAnalyzers : updateSettingsWithAnalyzers,
		reset: reset,
	};
	return api;
});

        