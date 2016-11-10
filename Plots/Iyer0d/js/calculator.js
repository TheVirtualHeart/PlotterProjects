/**
 * This module is responsible for performing the differential equation
 * calculation for Iyer. The object maintains the state of the different
 * variables and returns them after each calculation. These variables can also
 * be reset. 
 */

 define(["utility"],
  function IyerCalculator(utils) {
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
    * Performs a differential calculations and increments the values
    */
	function calculateNext(data) {

	 	var C1H_to_C2Ht_t, C2H_to_C1Ht_t, C3H_to_OHt_t, OH_to_C3Ht_t, OH_to_IHt_t, IH_to_OHt_t,
	 	C3H_to_IHt_t, IH_to_C3Ht_t, alpha1t_t, beta1t_t, gamma1t_t, Delta1t_t, Ont_t, Oft_t, GammaGammat_t,
	 	DeltaDeltat_t, rhot_t, mut_t, O1ks_O2kst_t, O1ks_C1kst_t, O2ks_O1kst_t, C1ks_C0kst_t,
	 	alphat_t, betat_t, yCa_inft_t, tau_yCat_t, alpha_act43t_t, beta_act43t_t, alpha_inact43t_t,
	 	beta_inact43t_t, alpha_act14t_t, beta_act14t_t, expvfortt_t, exp2vfortt_t, INaKcoefft_t,
	 	INaCa1t_t, INaCa2t_t, 


	 	ENa, EK, a1, a2, EKs, ECa, VF_over_RT, VFsq_over_RT, expvfort, K1_inf, exp2vfort, ICamax, PKprime, 
	 	INaKcoeff, INaCa1, INaCa2,alpha1, beta1, gamma1, Delta1, On, Of, GammaGamma, DeltaDelta, rho, 
	 	mu, parameter_a,k12, k23, k34, k45, k56, k67, k89, k910, k1011, k1112, k1213, k57, k21, k32, 
	 	k43,k54, k65, k76, k98, k109, k1110, k1211, k1312, k75, k81, k92, k103, k114, k125, k136,
        k18, k29, k310, k411, k512, k613, na1t, na2t, na3t, na4t, na5t, na6t, na7t, na8t, na9t,
        na10t, na11t, na12t, na13t, C1H_to_C2H, C2H_to_C1H, C3H_to_OH, OH_to_C3H, OH_to_IH, IH_to_OH,
        C3H_to_IH, IH_to_C3H, C1Hergt, C2Hergt, C3Hergt, OHergt, IHergt, O1ks_O2ks, O1ks_C1ks,
        O2ks_O1ks, C1ks_C0ks, C0kst, C1kst, O1kst, O2kst, fb, rb, dLTRPNCa, dHTRPNCa,
 		beta_SS, beta_JSR, beta_i, dNai, a3, dKi, dCai, dCaJSR, dCaNSR, myCaSS, dV,
	 	myA, myB, myC, myD, myE, myF, myU, myV, myW, myQ, myR, myX1, myX2, myX3, myX4, alpha, beta,    
        alpha_prime, beta_prime, C0_to_C1, C1_to_C2, C2_to_C3, C3_to_C4, CCa0_to_CCa1, CCa1_to_CCa2,
		CCa2_to_CCa3, CCa3_to_CCa4, C1_to_C0, C2_to_C1, C3_to_C2, C4_to_C3, CCa1_to_CCa0, CCa2_to_CCa1,
		CCa3_to_CCa2, CCa4_to_CCa3, gamma, C0_to_CCa0, C1_to_CCa1, C2_to_CCa2, C3_to_CCa3, C4_to_CCa4,
		CCa0_to_C0, CCa1_to_C1, CCa2_to_C2, CCa3_to_C3, CCa4_to_C4, C0t, C1t, C2t, C3t, C4t, Opent,
		CCa0t, CCa1t, CCa2t, CCa3t, CCa4t, yCa_inf, tau_yCa, alpha_act43, beta_act43, alpha_inact43,
		beta_inact43, C0Kv43_to_C1Kv43, C1Kv43_to_C2Kv43, C2Kv43_to_C3Kv43, C3Kv43_to_OKv43, 
		CI0Kv43_to_CI1Kv43, CI1Kv43_to_CI2Kv43, CI2Kv43_to_CI3Kv43, CI3Kv43_to_OIKv43,
		C1Kv43_to_C0Kv43, C2Kv43_to_C1Kv43, C3Kv43_to_C2Kv43, OKv43_to_C3Kv43, CI1Kv43_to_CI0Kv43,
		CI2Kv43_to_CI1Kv43, CI3Kv43_to_CI2Kv43, OIKv43_to_CI3Kv43, C0Kv43_to_CI0Kv43, C1Kv43_to_CI1Kv43,
		C2Kv43_to_CI2Kv43, C3Kv43_to_CI3Kv43, OKv43_to_OIKv43, CI0Kv43_to_C0Kv43, CI1Kv43_to_C1Kv43,
		CI2Kv43_to_C2Kv43, CI3Kv43_to_C3Kv43, OIKv43_to_OKv43, C0Kv43t, C1Kv43t, C2Kv43t, C3Kv43t,
		OKv43t, CI0Kv43t, CI1Kv43t, CI2Kv43t, CI3Kv43t, OIKv43t, alpha_act14, beta_act14, alpha_inact14,
		beta_inact14, C0Kv14_to_C1Kv14, C1Kv14_to_C2Kv14, C2Kv14_to_C3Kv14, C3Kv14_to_OKv14, CI0Kv14_to_CI1Kv14,
		CI1Kv14_to_CI2Kv14, CI2Kv14_to_CI3Kv14, CI3Kv14_to_OIKv14, C1Kv14_to_C0Kv14,C2Kv14_to_C1Kv14,
		C1Kv24_to_C1Kv14, C3Kv14_to_C2Kv14, OKv14_to_C3Kv14, CI1Kv14_to_CI0Kv14,CI2Kv14_to_CI1Kv14,
        CI3Kv14_to_CI2Kv14, OIKv14_to_CI3Kv14,C0Kv14_to_CI0Kv14, C1Kv14_to_CI1Kv14, C2Kv14_to_CI2Kv14,
        C3Kv14_to_CI3Kv14, OKv14_to_OIKv14,CI0Kv14_to_C0Kv14, CI1Kv14_to_C1Kv14, 
		CI2Kv14_to_C2Kv14, CI3Kv14_to_C3Kv14, OIKv14_to_OKv14,C0Kv14t, C1Kv14t, C2Kv14t, C3Kv14t, 
		OKv14t, CI0Kv14t, CI1Kv14t, CI2Kv14t, CI3Kv14t, OIKv14t;

	 	//table setup
	 	C1H_to_C2Ht_t = cS.T_Const_HERG * cS.A0_HERG * Math.exp(cS.B0_HERG * cS.v);
        C2H_to_C1Ht_t = cS.T_Const_HERG * cS.A1_HERG * Math.exp(cS.B1_HERG * cS.v);
        C3H_to_OHt_t = cS.T_Const_HERG * cS.A2_HERG * Math.exp(cS.B2_HERG * cS.v);
        OH_to_C3Ht_t = cS.T_Const_HERG * cS.A3_HERG * Math.exp(cS.B3_HERG * cS.v);
        OH_to_IHt_t = cS.T_Const_HERG * cS.A4_HERG * Math.exp(cS.B4_HERG * cS.v);
        IH_to_OHt_t = cS.T_Const_HERG * cS.A5_HERG * Math.exp(cS.B5_HERG * cS.v);
        C3H_to_IHt_t = cS.T_Const_HERG * cS.A6_HERG * Math.exp(cS.B6_HERG * cS.v);
        IH_to_C3Ht_t = (OH_to_C3Ht_t * IH_to_OHt_t * C3H_to_IHt_t) / 
            										(C3H_to_OHt_t * OH_to_IHt_t);

        alpha1t_t = cS.Temp_Scale * cC.KToverH * Math.exp( (-114007.462700232) / cC.RTNa
            + 224.114e0 / cS.Rgas + (0.286374268596235) * cS.v / cC.RTNaF);
        beta1t_t = cS.Temp_Scale * cC.KToverH * Math.exp( (-272470.273489681) / cC.RTNa 
            + 708.146e0 / cS.Rgas + (-2.28528417586424) * cS.v / cC.RTNaF);
        gamma1t_t = cS.Temp_Scale * cC.KToverH * Math.exp( (-196336.575735923) / cC.RTNa
            + 529.952e0 / cS.Rgas + (2.78084918596045) * cS.v / cC.RTNaF);
        Delta1t_t = cS.Temp_Scale * cC.KToverH * Math.exp( (-133689.9304091) / cC.RTNa
            + 229.205e0 / cS.Rgas + (-1.55804214553883) * cS.v / cC.RTNaF);
        Ont_t = cS.Temp_Scale * cC.KToverH * Math.exp( (-62123.0784380481) / cC.RTNa
            + 39.295e0 / cS.Rgas + (0.288816042743232) * cS.v / cC.RTNaF);
        Oft_t = cS.Temp_Scale * cC.KToverH * Math.exp( (-97657.8497137015) / cC.RTNa
            + 1.51e0 / cS.Rgas + (0.0684861993100685) * cS.v / cC.RTNaF);
        GammaGammat_t = cS.Temp_Scale * cC.KToverH * Math.exp( (116431.142142348) / cC.RTNa
            + -578.317e0 / cS.Rgas  + (0.764126011745707) * cS.v / cC.RTNaF);
        DeltaDeltat_t = cS.Temp_Scale * cC.KToverH * Math.exp( 
            (-55700.6624658307) / cC.RTNa + -130.639e0 / cS.Rgas + (-3.64981672927078) 
            														* cS.v / cC.RTNaF);
        rhot_t = cS.Temp_Scale * cC.KToverH * Math.exp( (-147813.990005035) / cC.RTNa
            + 338.915e0 / cS.Rgas + (2.1360043702126) * cS.v / cC.RTNaF);
        mut_t = cS.Temp_Scale * cC.KToverH * Math.exp( (-121322.143275242) / cC.RTNa
            + 193.265e0 / cS.Rgas + (-1.74290267020903) * cS.v / cC.RTNaF);

        O1ks_O2kst_t = 0.00767254363063 * Math.exp(0.08662945914655 * cS.v);
        O1ks_C1kst_t = 0.00700806628929 * Math.exp(-0.14999754700285 * cS.v);
        O2ks_O1kst_t = 0.00379737998368 * Math.exp(-0.01425668126881 * cS.v);
        C1ks_C0kst_t = 0.21625575895850 * Math.exp(-0.00001889123021 * cS.v);

        alphat_t = 4.e0 * 1.2e0 * 0.416e0 *  Math.exp(0.012e0 * (cS.v - 35.e0)); 
        betat_t = 4.e0 * 0.45e0 * 0.049e0 *  Math.exp(-0.065e0 * (cS.v - 22.e0));

        yCa_inft_t = cS.a1yCa / (1.e0 + Math.exp((cS.v + 28.5e0) / (7.8e0))) 
            												+ (1.e0 - cS.a1yCa);
        tau_yCat_t = 1.e0 / (0.00336336209452 / 
            (0.5e0 + Math.exp(cS.v / (-5.53899874036055))) 
            +    0.00779046570737 * Math.exp(cS.v /  -49.51039631160386));

        alpha_act43t_t = cS.alphaa0Kv43 * Math.exp(cS.aaKv43 * cS.v);
        beta_act43t_t = cS.betaa0Kv43 * Math.exp(-cS.baKv43 * cS.v);
        alpha_inact43t_t = cS.alphai0Kv43 * Math.exp(-cS.aiKv43 * cS.v);
        beta_inact43t_t = cS.betai0Kv43 * Math.exp(cS.biKv43 * cS.v);

        alpha_act14t_t = cS.alphaa0Kv14 * Math.exp(cS.aaKv14 * cS.v);
        beta_act14t_t  = cS.betaa0Kv14 * Math.exp(-cS.baKv14 * cS.v);

        expvfortt_t = Math.exp(cS.v / cC.RT_over_F);
        exp2vfortt_t = Math.exp(2.e0 * cS.v / cC.RT_over_F);

        INaKcoefft_t = cS.INaKmax * cS.Ko / (cS.Ko + cS.KmKo) / 
				            (1.e0 + 0.1245e0 * Math.exp(-0.1e0 * cS.v / cC.RT_over_F) + 
				            0.0365e0 * cC.sigma * Math.exp(-1.33 * cS.v / cC.RT_over_F));
        INaCa1t_t = Math.exp((cS.eta - 1.e0) * cS.v / cC.RT_over_F);
        INaCa2t_t = Math.exp(cS.eta * cS.v / cC.RT_over_F) * cS.Cao;

        //TIME LOOP STARTS

        // compute reversal potentials
         

        ENa = cC.RT_over_F * Math.log(cS.Nao / cS.nai);
        EK =  cC.RT_over_F * Math.log(cS.Ko / cS.ki);
        a1 = cS.Ko + 0.01833e0 * cS.Nao;
        a2 = cS.ki + 0.01833e0 * cS.nai;
        EKs = cC.RT_over_F * Math.log(a1 / a2);
        cS.cai = (cS.cai <= 0.e0) ? 1.e-10 : cS.cai;
        ECa = 0.5e0 * cC.RT_over_F * Math.log(cS.Cao / cS.cai);

        // stimulus
        cS.istim = _s1s2Stimulus(count,data);

        // compute I_Na, IKr, IKs, Ito1, IK1, INab, IKp

        cS.ina = cS.GNa * (cS.na6 + cS.na7) * (cS.v - ENa); //na6 + na7 two open states

        cS.ikr = cC.IKrcoeff * cS.oherg * (cS.v - EK); 
 
		// using EKs
        cS.iks = cS.GKs * (cS.o1ks + cS.o2ks) * (cS.v - EKs); //O1 + O2 -> two open states

        cS.ikv43 = cS.GKv43 * cS.okv43 * (cS.v - EK);
        VF_over_RT = cS.v / cC.RT_over_F;
        VFsq_over_RT = (1000.e0 * cS.Faraday) * VF_over_RT;
        expvfort = expvfortt_t;
        a1 = cS.ki * expvfort - cS.Ko; 
        a2 = expvfort - 1.e0;
        cS.ikv14_k = cC.PKv14 * cS.okv14 * VFsq_over_RT * (a1 / a2);
        a1 =  cS.nai * expvfort - cS.Nao; 
        cS.ikv14_na = 0.02e0 * cC.PKv14 * cS.okv14 * VFsq_over_RT * (a1 / a2);
        cS.ikv14 = cS.ikv14_k + cS.ikv14_na;
        cS.ito1 = cS.ikv43 + cS.ikv14;

        K1_inf = 1.e0 / (.94e0 + Math.exp(1.26e0 / cC.RT_over_F * (cS.v - EK)));
        cS.ik1 = cC.IK1coeff * K1_inf * (cS.v - EK);

        cS.inab = cS.GNab * (cS.v - ENa);

// compute ICa, ICaK
        VF_over_RT = cS.v / cC.RT_over_F;
        VFsq_over_RT = (1000.e0 * cS.Faraday) * VF_over_RT;

        exp2vfort = exp2vfortt_t;
        a1 =  1.e-3 * exp2vfort - cS.Cao * 0.341e0;
        a2 =  exp2vfort - 1.e0;
        ICamax = cS.PCa * 4.e0 * VFsq_over_RT * (a1 / a2);
        cS.ica = ICamax * cS.yca * cS.open;
        
        PKprime = cC.PK / (1.e0 + (Math.min(0.e0,ICamax) / cS.ICahalf));
        a1 = cS.ki * expvfort - cS.Ko;
        a2 = expvfort - 1.e0;
        cS.icak = PKprime * cS.open * cS.yca * VFsq_over_RT * (a1 / a2);

// compute INaK, INaCa, ICab, IpCa

        VF_over_RT = cS.v / cC.RT_over_F;

        a2 = 1.0e0 + Math.sqrt(cS.KmNai / cS.nai) * (cS.KmNai / cS.nai);
        INaKcoeff = INaKcoefft_t;
        cS.inak = INaKcoeff / a2;
        
        INaCa1 = INaCa1t_t
        INaCa2 = INaCa2t_t
        cS.inaca = cC.INaCacoeff * (INaCa2 * cS.nai * cS.nai * cS.nai
             - INaCa1 * cC.Nao3 * cS.cai) / (1.e0 + cS.ksat * INaCa1);

        cS.icab = cS.GCab * (cS.v - ECa);

        cS.ipca = cS.IpCamax * cS.cai / (cS.KmpCa + cS.cai);


        // compute gating variable derivatives

		// INa

        alpha1 = alpha1t_t;
        beta1 = beta1t_t;
        gamma1 = gamma1t_t;
        Delta1 = Delta1t_t;
        On = Ont_t;
        Of = Oft_t;
        GammaGamma = GammaGammat_t;
        DeltaDelta = DeltaDeltat_t;
        rho = rhot_t;
        mu = mut_t;

        parameter_a = 1.40042625477401;
        
        k12 = 4.e0 * alpha1;
        k23 = 3.e0 * alpha1;
        k34 = 2.e0 * alpha1;
        k45 = alpha1;
        k56 = gamma1;
        k67 = cC.epsilon;
        k89 = k12 * parameter_a;
        k910 = k23 * parameter_a;	
        k1011 = k34 * parameter_a;
        k1112 = k45 * parameter_a;
        k1213 = GammaGamma;
        k57 = rho;
    
        k21 = beta1;
        k32 = 2.e0 * beta1;
        k43 = 3.e0 * beta1;
        k54 = 4.e0 * beta1;
        k65 = Delta1;
        k76 = cC.omega_na;
        k98 = k21 / parameter_a;
        k109 = k32 / parameter_a;
        k1110 = k43 / parameter_a;
        k1211 = k54 / parameter_a;
        k1312 = DeltaDelta;
        k75 = mu;

        k81 = cC.Cf;
        k92 = k81 / parameter_a;
        k103 = k92 / parameter_a;
        k114 = k103 / parameter_a;
        k125 = k114 / parameter_a;
        k136 = Of;
        k18 = cC.Cn;
        k29 = k18 * parameter_a;
        k310 = k29 * parameter_a;
        k411 = k310 * parameter_a;
        k512 = k411 * parameter_a;
        k613 = On;

        na1t =  (cS.na1 + cS.timestep * (k21 * cS.na2 +  k81 * cS.na8)) / 
            (1.e0 + cS.timestep * (k18 + k12));
        na2t =  (cS.na2 + cS.timestep * (k12 * cS.na1 + k32 * cS.na3 + k92 * cS.na9)) / 
            (1.e0 + cS.timestep * (k21 + k23 + k29));
        na3t =  (cS.na3 + cS.timestep * (k23 * cS.na2 +  k43 * cS.na4 + k103 * cS.na10)) / 
            (1.e0 + cS.timestep * (k32 + k34 + k310)); 
        na4t = (cS.na4 + cS.timestep * (k34 * cS.na3 +  k54 * cS.na5 + k114 * cS.na11)) / 
            (1.e0 + cS.timestep * (k43 + k45 + k411));
        na5t = (cS.na5 + cS.timestep * (k45 * cS.na4 + k65 * cS.na6 + k75 * cS.na7
             + k125 * cS.na12)) / 
            (1.e0 + cS.timestep * (k54 + k56 + k57 + k512));
        na6t = (cS.na6 + cS.timestep * (k56 * cS.na5 + k76 * cS.na7 + k136 * cS.na13)) / 
            (1.e0 + cS.timestep * (k65 + k67 + k613));
        na7t = (cS.na7 + cS.timestep * (k57 * cS.na5 + k67 * cS.na6)) / 
            (1.e0 + cS.timestep * (k75 + k76));
        na8t = (cS.na8 + cS.timestep * (k18 * cS.na1 + k98 * cS.na9)) / 
            (1.e0 + cS.timestep * (k81 + k89));
        na9t = (cS.na9 + cS.timestep * (k29 * cS.na2 + k89 * cS.na8 + k109 * cS.na10)) / 
            (1.e0 + cS.timestep * (k98 + k92 + k910));
        na10t = (cS.na10 + cS.timestep * (k310 * cS.na3 +  k910 * cS.na9 + k1110 * cS.na11)) / 
            (1.e0 + cS.timestep * (k1011 + k103 + k109));
        na11t = (cS.na11 + cS.timestep * (k411 * cS.na4 +  k1011 * cS.na10 +  k1211 * cS.na12)) / 
            (1.e0 + cS.timestep * (k1110 + k114 + k1112));
        na12t = (cS.na12 + cS.timestep * (k512 * cS.na5 +  k1112 * cS.na11 +  k1312 * cS.na13)) / 
            (1.e0 + cS.timestep * (k1211 + k125 + k1213));
        na13t = (cS.na13 + cS.timestep * (k613 * cS.na6 +  k1213 * cS.na12)) / 
            (1.e0 + cS.timestep * (k1312 + k136));

        cS.na1 = na1t;
        cS.na2 = na2t;
        cS.na3 = na3t;
        cS.na4 = na4t;
        cS.na5 = na5t;
        cS.na6 = na6t;
        cS.na7 = na7t;
        cS.na8 = na8t;
        cS.na9 = na9t;
        cS.na10 = na10t;
        cS.na11 = na11t;
        cS.na12 = na12t;
//        cS.na13 = na13t
		
		cS.na = cS.na6 + cS.na7; // na = na6 + na7

        if(cS.na1 < cS.ZERO) cS.na1 = cS.ZERO;
        if(cS.na2 < cS.ZERO) cS.na2 = cS.ZERO;
        if(cS.na3 < cS.ZERO) cS.na3 = cS.ZERO;
        if(cS.na4 < cS.ZERO) cS.na4 = cS.ZERO;
        if(cS.na5 < cS.ZERO) cS.na5 = cS.ZERO;
        if(cS.na6 < cS.ZERO) cS.na6 = cS.ZERO;
        if(cS.na7 < cS.ZERO) cS.na7 = cS.ZERO;
        if(cS.na8 < cS.ZERO) cS.na8 = cS.ZERO;
        if(cS.na9 < cS.ZERO) cS.na9 = cS.ZERO;
        if(cS.na10 < cS.ZERO) cS.na10 = cS.ZERO;
        if(cS.na11 < cS.ZERO) cS.na11 = cS.ZERO;
        if(cS.na12 < cS.ZERO) cS.na12 = cS.ZERO;
        if(cS.na13 < cS.ZERO) cS.na13 = cS.ZERO;

        cS.na13 = 1.e0 - cS.na1 - cS.na2 - cS.na3 - cS.na4 - cS.na5 - cS.na6
             - cS.na7 - cS.na8 - cS.na9 - cS.na10 - cS.na11 - cS.na12;

// IKr
        C1H_to_C2H = C1H_to_C2Ht_t;
        C2H_to_C1H = C2H_to_C1Ht_t;
        C3H_to_OH = C3H_to_OHt_t;
        OH_to_C3H = OH_to_C3Ht_t;
        OH_to_IH = OH_to_IHt_t;
        IH_to_OH = IH_to_OHt_t;
        C3H_to_IH = C3H_to_IHt_t;
        IH_to_C3H = IH_to_C3Ht_t;
	
        C1Hergt = (cS.c1herg + cS.timestep * (C2H_to_C1H * cS.c2herg)) / 
            (1.e0 + cS.timestep * C1H_to_C2H);
        C2Hergt = (cS.c2herg + cS.timestep * (C1H_to_C2H * cS.c1herg + cC.C3H_to_C2H * cS.c3herg)) / 
            (1.e0 + cS.timestep * (C2H_to_C1H + cC.C2H_to_C3H));
        C3Hergt = (cS.c3herg + cS.timestep * (cC.C2H_to_C3H * cS.c2herg  + OH_to_C3H * cS.oherg + 
        	IH_to_C3H * cS.iherg)) / (1.e0 + cS.timestep * (C3H_to_IH + C3H_to_OH + cC.C3H_to_C2H));
        OHergt = (cS.oherg + cS.timestep * (C3H_to_OH * cS.c3herg + IH_to_OH * cS.iherg)) / 
            (1.e0 + cS.timestep * (OH_to_C3H + OH_to_IH));
        IHergt = (cS.iherg + cS.timestep * (C3H_to_IH * cS.c3herg + OH_to_IH * cS.oherg)) / 
            (1.e0 + cS.timestep * (IH_to_C3H + IH_to_OH));

        cS.c1herg = C1Hergt;
        cS.c2herg = C2Hergt;
        cS.c3herg = C3Hergt;
        cS.oherg = OHergt;
//        cS.iherg = IHergt

        if(cS.c1herg < cS.ZERO) cS.c1herg = cS.ZERO;
        if(cS.c2herg < cS.ZERO) cS.c2herg = cS.ZERO;
        if(cS.c3herg < cS.ZERO) cS.c3herg = cS.ZERO;
        if(cS.oherg < cS.ZERO) cS.oherg = cS.ZERO;
        if(cS.iherg < cS.ZERO) cS.iherg = cS.ZERO;

        cS.iherg = 1.e0 - cS.c1herg - cS.c2herg - cS.c3herg - cS.oherg;

// IKs
		
        O1ks_O2ks = O1ks_O2kst_t;
        O1ks_C1ks = O1ks_C1kst_t;
        O2ks_O1ks = O2ks_O1kst_t;
        C1ks_C0ks = C1ks_C0kst_t;

        C0kst = (cS.c0ks + cS.timestep * (C1ks_C0ks * cS.c1ks)) / 
            (1.e0 + cS.timestep * (cS.C0ks_C1ks));
        C1kst = (cS.c1ks + cS.timestep * (cS.C0ks_C1ks * cS.c0ks + O1ks_C1ks * cS.o1ks)) / 
            (1.e0 + cS.timestep * (C1ks_C0ks + cS.C1ks_O1ks));
        O1kst = (cS.o1ks + cS.timestep * (cS.C1ks_O1ks * cS.c1ks + O2ks_O1ks * cS.o2ks)) / 
            (1.e0 + cS.timestep * (O1ks_C1ks + O1ks_O2ks));
        O2kst = (cS.o2ks + cS.timestep * (O1ks_O2ks * cS.o1ks)) / 
            (1.e0 + cS.timestep * O2ks_O1ks);

        cS.c0ks = C0kst;
        cS.c1ks = C1kst;
        cS.o1ks = O1kst;
//        cS.o2ks = O2kst;

        if(cS.c0ks < cS.ZERO) cS.c0ks = cS.ZERO;
        if(cS.c1ks < cS.ZERO) cS.c1ks = cS.ZERO;
        if(cS.o1ks < cS.ZERO) cS.o1ks = cS.ZERO;
        if(cS.o2ks < cS.ZERO) cS.o2ks = cS.ZERO;

        cS.o2ks = 1.e0 - cS.c0ks - cS.c1ks - cS.o1ks;

        cS.oks = cS.o1ks + cS.o2ks; //oks = o1ks + o2ks;

        // compute intracellular calcium fluxes

// hard code these exponents
        fb = Math.pow((cS.cai / cS.Kfb),cS.Nfb);
// since Nrb = 1 do not raise to any power
        rb = cS.cansr / cS.Krb;
        cS.jup =  cS.KSR * (cS.vmaxf * fb - cS.vmaxr * rb) / (1.e0 + fb + rb);

        cS.jrel = cS.v1 * (cS.o1_ryr + cS.o2_ryr) * (cS.cajsr - cS.cass);
        
        cS.jtr = (cS.cansr - cS.cajsr) / cS.tautr;

        cS.jxfer = (cS.cass - cS.cai) / cS.tauxfer;

// compute Jtrpn and buffer scale factors

        a1 = cS.kltrpn_minus  *  cS.ltrpnca;
        dLTRPNCa = cS.kltrpn_plus * cS.cai * (1.e0 - cS.ltrpnca) - a1;

        a1 = cS.khtrpn_minus  *  cS.htrpnca;
        dHTRPNCa = cS.khtrpn_plus * cS.cai * (1.e0 - cS.htrpnca) - a1;

        cS.htrpnca = (cS.htrpnca + cS.timestep * cS.cai * cS.khtrpn_plus) / 
            (1.e0 + cS.timestep * (cS.cai * cS.khtrpn_plus + cS.khtrpn_minus));
        cS.ltrpnca = (cS.ltrpnca + cS.timestep * cS.cai * cS.kltrpn_plus) / 
            (1.e0 + cS.timestep * (cS.cai * cS.kltrpn_plus + cS.kltrpn_minus));

        cS.jtrpn = cS.LTRPNtot * dLTRPNCa + cS.HTRPNtot * dHTRPNCa;
 
        a1 = cS.CMDNtot * cS.KmCMDN / ((cS.cass + cS.KmCMDN) * (cS.cass + cS.KmCMDN));
        a2 = cS.EGTAtot * cS.KmEGTA / ((cS.cass + cS.KmEGTA) * (cS.cass + cS.KmEGTA));
        beta_SS = 1.e0 / (1.e0 + a1 + a2);
		
        a1 = cS.CSQNtot * cS.KmCSQN / ((cS.cajsr + cS.KmCSQN) * (cS.cajsr + cS.KmCSQN));
        beta_JSR = 1.e0 / (1.e0 + a1);

        a1 = cS.CMDNtot * cS.KmCMDN / ((cS.cai + cS.KmCMDN) * (cS.cai + cS.KmCMDN));
        a2 = cS.EGTAtot * cS.KmEGTA / ((cS.cai + cS.KmEGTA) * (cS.cai + cS.KmEGTA));
        beta_i = 1.e0 / (1.e0 + a1 + a2);

// compute concentration and voltage derivatives

        a1 = cS.Acap / (cS.Vmyo * cS.Faraday * 1000.e0); 
        a2 = cS.Acap / (2.e0 * cS.VSS * cS.Faraday * 1000.e0);

        dNai = -( cS.ina + cS.inab + 3.e0 * (cS.inaca + cS.inak) + cS.ikv14_na ) * a1;

        a3 = cS.ikr + cS.iks + cS.ik1 + cS.icak + cS.istim;
        dKi = -( a3 - 2.e0 * cS.inak + cS.ikv43 + cS.ikv14_k ) * a1;

        a3 = cS.icab - 2.e0 * cS.inaca + cS.ipca;
        dCai = beta_i * (cS.jxfer - cS.jup - cS.jtrpn - a3 * 0.5e0 * a1);
	
        dCaJSR = beta_JSR * (cS.jtr - cS.jrel);
        
        dCaNSR = cS.jup * cS.Vmyo / cS.VNSR - cS.jtr * cS.VJSR / cS.VNSR;

        myCaSS = (cS.cass + cS.timestep * beta_SS * (cS.VJSR / cS.VSS * cS.v1 * 
            (cS.o1_ryr + cS.o2_ryr) * cS.cajsr + cS.Vmyo / cS.VSS / cS.tauxfer * cS.cai - a2 * cS.ica)) / 
            (1.e0 + cS.timestep * beta_SS * (cS.VJSR / cS.VSS * cS.v1 * (cS.o1_ryr + cS.o2_ryr)
            									+ cS.Vmyo / cS.VSS / cS.tauxfer));

        cS.nai = cS.nai + cS.timestep * dNai;
        cS.ki = cS.ki + cS.timestep * dKi;
        cS.cai = cS.cai + cS.timestep * dCai;
        cS.cass = myCaSS;
        cS.cajsr = cS.cajsr + cS.timestep * dCaJSR;
        cS.cansr = cS.cansr + cS.timestep * dCaNSR;

        a1 = cS.ina + cS.ica + cS.icak + cS.ikr + cS.iks;
	    a2 = cS.ik1 + cS.inaca + cS.inak + cS.ito1;
	    a3 = cS.ipca + cS.icab + cS.inab;

	    cS.Itot = a1 + a2 + a3 + cS.istim;
	    dV = -cS.Itot;
	    cS.v = cS.v + cS.timestep * dV;

	    //here
		// compute derivatives of RyR receptor states
// hard-coding: mcoop = 3, ncoop = 4
//         a1 = (cS.cass * 1000.e0) *  * mcoop
//         a2 = (cS.cass * 1000.e0) *  * ncoop
        a1 = Math.pow((cS.cass * 1000.e0),3); //(cS.cass * 1000.e0) * (cS.cass * 1000.e0) * (cS.cass * 1000.e0);
        a2 = a1 * (cS.cass * 1000.e0);
        

        myA = -cS.timestep * cS.kbplus * a1;
        myB = 1.e0 + cS.timestep * cS.kbminus;
        myC = -cS.timestep * cS.kaminus;
        myD = 1.e0 + cS.timestep * cS.kaplus * a2;
        myE = -cS.timestep * cS.kcplus;
        myF = 1.e0 + cS.timestep * cS.kcminus;
        myU = cS.o2_ryr;
        myV = cS.c1_ryr;
        myW = cS.c2_ryr;
        myQ = myF / myB * (myB - myA) - myC * myF / myD - myE;
        myR = myF - myF * myU / myB - myF / myD * myV - myW;

        myX1 = myR / myQ;
        myX2 = (myU - myA * myX1) / myB;
        myX3 = (myV - myC * myX1) / myD;
        myX4 = (myW - myE * myX1) / myF;

        cS.o1_ryr = myX1;
        cS.o2_ryr = myX2;
        
        cS.po = cS.o1_ryr + cS.o2_ryr; // po = o1_ryr + o2_ryr;

        cS.c1_ryr = myX3;
        cS.c2_ryr = myX4;

        if(cS.c1_ryr < cS.ZERO) cS.c1_ryr = cS.ZERO;
        if(cS.c2_ryr < cS.ZERO) cS.c2_ryr = cS.ZERO;
        if(cS.o1_ryr < cS.ZERO) cS.o1_ryr = cS.ZERO;
        if(cS.o2_ryr < cS.ZERO) cS.o2_ryr = cS.ZERO;

// compute derivatives of L-type channel states
		alpha = alphat_t;
        beta = betat_t;

        alpha_prime = cS.aL * alpha;
        beta_prime = beta / cS.bL;

        C0_to_C1 = 4.e0 * alpha;
        C1_to_C2 = 3.e0 * alpha;
        C2_to_C3 = 2.e0 * alpha;
        C3_to_C4 =        alpha;

        CCa0_to_CCa1 = 4.e0 * alpha_prime;
        CCa1_to_CCa2 = 3.e0 * alpha_prime;
        CCa2_to_CCa3 = 2.e0 * alpha_prime;
        CCa3_to_CCa4 =        alpha_prime;

        C1_to_C0 =        beta;
        C2_to_C1 = 2.e0 * beta;
        C3_to_C2 = 3.e0 * beta;
        C4_to_C3 = 4.e0 * beta;

        CCa1_to_CCa0 =        beta_prime;
        CCa2_to_CCa1 = 2.e0 * beta_prime;
        CCa3_to_CCa2 = 3.e0 * beta_prime;
        CCa4_to_CCa3 = 4.e0 * beta_prime;
	
        gamma = .6 * 0.09233e0 * cS.cass;
				
        C0_to_CCa0 = gamma;     // = gamma
        C1_to_CCa1 = cS.aL * C0_to_CCa0; // = gamma * cS.aL
        C2_to_CCa2 = cS.aL * C1_to_CCa1; // = gamma * cS.aL^2
        C3_to_CCa3 = cS.aL * C2_to_CCa2; // = gamma * cS.aL^3
        C4_to_CCa4 = cS.aL * C3_to_CCa3; // = gamma * cS.aL^4
		
        CCa0_to_C0 = cS.omega;     // = omega
        CCa1_to_C1 = CCa0_to_C0 / cS.bL; // = omega / cS.bL
        CCa2_to_C2 = CCa1_to_C1 / cS.bL; // = omega / cS.bL^2
        CCa3_to_C3 = CCa2_to_C2 / cS.bL; // = omega / cS.bL^3
        CCa4_to_C4 = CCa3_to_C3 / cS.bL; // = omega / cS.bL^4

        C0t = (cS.c0 + cS.timestep * (C1_to_C0 * cS.c1 + CCa0_to_C0 * cS.cca0)) / 
            (1.e0 + cS.timestep * (C0_to_C1 + C0_to_CCa0));
        C1t = (cS.c1 + cS.timestep * (C0_to_C1 * cS.c0 + C2_to_C1 * cS.c2 
            + CCa1_to_C1 * cS.cca1)) / 
            (1.e0 + cS.timestep * (C1_to_C0 + C1_to_C2 + C1_to_CCa1));
        C2t = (cS.c2 + cS.timestep * (C1_to_C2 * cS.c1 + C3_to_C2 * cS.c3 
            + CCa2_to_C2 * cS.cca2)) / 
            (1.e0 + cS.timestep * (C2_to_C1 + C2_to_C3 + C2_to_CCa2));
        C3t = (cS.c3 + cS.timestep * (C2_to_C3 * cS.c2 + C4_to_C3 * cS.c4 
            + CCa3_to_C3 * cS.cca3)) / 
            (1.e0 + cS.timestep * (C3_to_C2 + C3_to_C4 + C3_to_CCa3));
        C4t = (cS.c4 + cS.timestep * (C3_to_C4 * cS.c3 + cS.gL * cS.open 
            + CCa4_to_C4 * cS.cca4)) / 
            (1.e0 + cS.timestep * (C4_to_C3 + cS.fL + C4_to_CCa4));
        Opent = (cS.open + cS.timestep * cS.fL * cS.c4) / (1.e0 + cS.timestep * cS.gL);
        CCa0t = (cS.cca0 + cS.timestep * (CCa1_to_CCa0 * cS.cca1 + C0_to_CCa0 * cS.c0)) / 
            (1.e0 + cS.timestep * (CCa0_to_CCa1 + CCa0_to_C0));
        CCa1t = (cS.cca1 + cS.timestep * (CCa0_to_CCa1 * cS.cca0 + CCa2_to_CCa1 * cS.cca2 
            + C1_to_CCa1 * cS.c1)) / 
            (1.e0 + cS.timestep * (CCa1_to_CCa0 + CCa1_to_CCa2 + CCa1_to_C1));
        CCa2t = (cS.cca2 + cS.timestep * (CCa1_to_CCa2 * cS.cca1 + CCa3_to_CCa2 * cS.cca3 
            + C2_to_CCa2 * cS.c2)) / 
            (1.e0 + cS.timestep * (CCa2_to_CCa1 + CCa2_to_CCa3 + CCa2_to_C2));
        CCa3t = (cS.cca3 + cS.timestep * (CCa2_to_CCa3 * cS.cca2 + CCa4_to_CCa3 * cS.cca4 
            + C3_to_CCa3 * cS.c3)) / 
            (1.e0 + cS.timestep * (CCa3_to_CCa2 + CCa3_to_CCa4 + CCa3_to_C3));
        CCa4t = (cS.cca4 + cS.timestep * (CCa3_to_CCa4 * cS.cca3 + C4_to_CCa4 * cS.c4)) / 
            (1.e0 + cS.timestep * (CCa4_to_CCa3 + CCa4_to_C4));

        cS.c0 = C0t;
        cS.c1 = C1t;
        cS.c2 = C2t;
        cS.c3 = C3t;
        cS.c4 = C4t;
        cS.open = Opent;
        cS.cca0 = CCa0t;
        cS.cca1 = CCa1t;
        cS.cca2 = CCa2t;
        cS.cca3 = CCa3t;
//        cS.cca4 = CCa4t;

        if(cS.c0 < cS.ZERO) cS.c0 = cS.ZERO;
        if(cS.c1 < cS.ZERO) cS.c1 = cS.ZERO;
        if(cS.c2 < cS.ZERO) cS.c2 = cS.ZERO;
        if(cS.c3 < cS.ZERO) cS.c3 = cS.ZERO;
        if(cS.c4 < cS.ZERO) cS.c4 = cS.ZERO;
        if(cS.open < cS.ZERO) cS.open = cS.ZERO;
        if(cS.cca0 < cS.ZERO) cS.cca0 = cS.ZERO;
        if(cS.cca1 < cS.ZERO) cS.cca1 = cS.ZERO;
        if(cS.cca2 < cS.ZERO) cS.cca2 = cS.ZERO;
        if(cS.cca3 < cS.ZERO) cS.cca3 = cS.ZERO;
        if(cS.cca4 < cS.ZERO) cS.cca4 = cS.ZERO;

        cS.cca4 = 1.e0 - cS.c0 - cS.c1 - cS.c2 - cS.c3 - cS.c4
            - cS.cca0 - cS.cca1 - cS.cca2 - cS.cca3 - cS.open;

// inactivation
        yCa_inf = yCa_inft_t;

        tau_yCa = tau_yCat_t;
  
        cS.yca = (cS.yca + cS.timestep * yCa_inf / tau_yCa) / (1.e0 + cS.timestep / tau_yCa);

// compute derivatives of Kv4.3 channel states

        alpha_act43 = alpha_act43t_t;
        beta_act43  =  beta_act43t_t;
        alpha_inact43 = alpha_inact43t_t;
        beta_inact43  = beta_inact43t_t;

        C0Kv43_to_C1Kv43 = 4.e0 * alpha_act43;
        C1Kv43_to_C2Kv43 = 3.e0 * alpha_act43;
        C2Kv43_to_C3Kv43 = 2.e0 * alpha_act43;
        C3Kv43_to_OKv43  =        alpha_act43;

        CI0Kv43_to_CI1Kv43 = 4.e0 * cS.b1Kv43 * alpha_act43;
        CI1Kv43_to_CI2Kv43 = 3.e0 * cS.b2Kv43 * alpha_act43 / cS.b1Kv43;
        CI2Kv43_to_CI3Kv43 = 2.e0 * cS.b3Kv43 * alpha_act43 / cS.b2Kv43;
        CI3Kv43_to_OIKv43  =        cS.b4Kv43 * alpha_act43 / cS.b3Kv43;

        C1Kv43_to_C0Kv43 =        beta_act43;	
        C2Kv43_to_C1Kv43 = 2.e0 * beta_act43;
        C3Kv43_to_C2Kv43 = 3.e0 * beta_act43;
        OKv43_to_C3Kv43  = 4.e0 * beta_act43;

        CI1Kv43_to_CI0Kv43 =            	     beta_act43 / cS.f1Kv43;
        CI2Kv43_to_CI1Kv43 = 2.e0 * cS.f1Kv43 * beta_act43 / cS.f2Kv43;
        CI3Kv43_to_CI2Kv43 = 3.e0 * cS.f2Kv43 * beta_act43 / cS.f3Kv43;
        OIKv43_to_CI3Kv43  = 4.e0 * cS.f3Kv43 * beta_act43 / cS.f4Kv43;
        
        C0Kv43_to_CI0Kv43 = beta_inact43;
        C1Kv43_to_CI1Kv43 = cS.f1Kv43 * beta_inact43;
        C2Kv43_to_CI2Kv43 = cS.f2Kv43 * beta_inact43;
        C3Kv43_to_CI3Kv43 = cS.f3Kv43 * beta_inact43;
        OKv43_to_OIKv43   = cS.f4Kv43 * beta_inact43;

        CI0Kv43_to_C0Kv43 = alpha_inact43;
        CI1Kv43_to_C1Kv43 = alpha_inact43 / cS.b1Kv43;
        CI2Kv43_to_C2Kv43 = alpha_inact43 / cS.b2Kv43;
        CI3Kv43_to_C3Kv43 = alpha_inact43 / cS.b3Kv43;
        OIKv43_to_OKv43   = alpha_inact43 / cS.b4Kv43;

        C0Kv43t = (cS.c0kv43 + cS.timestep * (C1Kv43_to_C0Kv43 * cS.c1kv43 
            + CI0Kv43_to_C0Kv43 * cS.ci0kv43)) / 
            (1.e0 + cS.timestep * (C0Kv43_to_C1Kv43 + C0Kv43_to_CI0Kv43));
        C1Kv43t = (cS.c1kv43 + cS.timestep * (C2Kv43_to_C1Kv43 * cS.c2kv43 
            + CI1Kv43_to_C1Kv43 * cS.ci1kv43 + C0Kv43_to_C1Kv43 * cS.c0kv43)) / 
            (1.e0 + cS.timestep * (C1Kv43_to_C2Kv43 + C1Kv43_to_C0Kv43 + C1Kv43_to_CI1Kv43));
        C2Kv43t = (cS.c2kv43 + cS.timestep * (C3Kv43_to_C2Kv43 * cS.c3kv43 
            + CI2Kv43_to_C2Kv43 * cS.ci2kv43 + C1Kv43_to_C2Kv43 * cS.c1kv43)) / 
            (1.e0 + cS.timestep * (C2Kv43_to_C3Kv43 + C2Kv43_to_C1Kv43 + C2Kv43_to_CI2Kv43));
        C3Kv43t = (cS.c3kv43 + cS.timestep * (OKv43_to_C3Kv43 * cS.okv43
            + CI3Kv43_to_C3Kv43 * cS.ci3kv43 + C2Kv43_to_C3Kv43 * cS.c2kv43)) / 
            (1.e0 + cS.timestep * (C3Kv43_to_OKv43 + C3Kv43_to_C2Kv43 + C3Kv43_to_CI3Kv43));
        OKv43t = (cS.okv43 + cS.timestep * (C3Kv43_to_OKv43 * cS.c3kv43
             + OIKv43_to_OKv43 * cS.oikv43)) / 
            (1.e0 + cS.timestep * (OKv43_to_C3Kv43 + OKv43_to_OIKv43));
        CI0Kv43t = (cS.ci0kv43 + cS.timestep * (C0Kv43_to_CI0Kv43 * cS.c0kv43 
            + CI1Kv43_to_CI0Kv43 * cS.ci1kv43)) / 
            (1.e0 + cS.timestep * (CI0Kv43_to_C0Kv43 + CI0Kv43_to_CI1Kv43));
        CI1Kv43t = (cS.ci1kv43 + cS.timestep * (CI2Kv43_to_CI1Kv43 * cS.ci2kv43 
            + C1Kv43_to_CI1Kv43 * cS.c1kv43 + CI0Kv43_to_CI1Kv43 * cS.ci0kv43)) / 
            (1.e0 + cS.timestep * (CI1Kv43_to_CI2Kv43 + CI1Kv43_to_C1Kv43 + CI1Kv43_to_CI0Kv43));
        CI2Kv43t = (cS.ci2kv43 + cS.timestep * (CI3Kv43_to_CI2Kv43 * cS.ci3kv43 
            + C2Kv43_to_CI2Kv43 * cS.c2kv43 + CI1Kv43_to_CI2Kv43 * cS.ci1kv43)) / 
            (1.e0 + cS.timestep * (CI2Kv43_to_CI3Kv43 + CI2Kv43_to_C2Kv43 + CI2Kv43_to_CI1Kv43));

        CI3Kv43t = (cS.ci3kv43 + cS.timestep * (OIKv43_to_CI3Kv43 * cS.oikv43 
            + C3Kv43_to_CI3Kv43 * cS.c3kv43 + CI2Kv43_to_CI3Kv43 * cS.ci2kv43)) / 
            (1.e0 + cS.timestep * (CI3Kv43_to_OIKv43 + CI3Kv43_to_C3Kv43 + CI3Kv43_to_CI2Kv43));
        OIKv43t = (cS.oikv43 + cS.timestep * (OKv43_to_OIKv43 * cS.okv43
            + CI3Kv43_to_OIKv43 * cS.ci3kv43)) / 
            (1.e0 + cS.timestep * (OIKv43_to_OKv43 + OIKv43_to_CI3Kv43));

        cS.c0kv43 = C0Kv43t;
        cS.c1kv43 = C1Kv43t;
        cS.c2kv43 = C2Kv43t;
        cS.c3kv43 = C3Kv43t;
        cS.okv43 = OKv43t;
        cS.ci0kv43 = CI0Kv43t;
        cS.ci1kv43 = CI1Kv43t;
        cS.ci2kv43 = CI2Kv43t;
        cS.ci3kv43 = CI3Kv43t;
//        cS.oikv43 = OIKv43t;

        if(cS.c0kv43 < cS.ZERO) cS.c0kv43 = cS.ZERO;
        if(cS.c1kv43 < cS.ZERO) cS.c1kv43 = cS.ZERO;
        if(cS.c2kv43 < cS.ZERO) cS.c2kv43 = cS.ZERO;
        if(cS.c3kv43 < cS.ZERO) cS.c3kv43 = cS.ZERO;
        if(cS.okv43 < cS.ZERO)  cS.okv43 = cS.ZERO;
        if(cS.ci0kv43 < cS.ZERO) cS.ci0kv43 = cS.ZERO;
        if(cS.ci1kv43 < cS.ZERO) cS.ci1kv43 = cS.ZERO;
        if(cS.ci2kv43 < cS.ZERO) cS.ci2kv43 = cS.ZERO;
        if(cS.ci3kv43 < cS.ZERO) cS.ci3kv43 = cS.ZERO;
        if(cS.oikv43 < cS.ZERO) cS.oikv43 = cS.ZERO;

        cS.oikv43 = 1.e0 - cS.c0kv43 - cS.c1kv43 - cS.c2kv43 - cS.c3kv43
             - cS.okv43 - cS.ci0kv43 - cS.ci1kv43 - cS.ci2kv43 - cS.ci3kv43;

// compute derivatives of Kv1.4 channel states

        alpha_act14 = alpha_act14t_t;
        beta_act14  =  beta_act14t_t;
        alpha_inact14 = cS.alphai0Kv14;
        beta_inact14  = cS.betai0Kv14;

        C0Kv14_to_C1Kv14 = 4.e0 * alpha_act14;
        C1Kv14_to_C2Kv14 = 3.e0 * alpha_act14;
        C2Kv14_to_C3Kv14 = 2.e0 * alpha_act14;
        C3Kv14_to_OKv14  =        alpha_act14;

        CI0Kv14_to_CI1Kv14 = 4.e0 * cS.b1Kv14 * alpha_act14;
        CI1Kv14_to_CI2Kv14 = 3.e0 * cS.b2Kv14 * alpha_act14 / cS.b1Kv14;
        CI2Kv14_to_CI3Kv14 = 2.e0 * cS.b3Kv14 * alpha_act14 / cS.b2Kv14;
        CI3Kv14_to_OIKv14  =        cS.b4Kv14 * alpha_act14 / cS.b3Kv14;

        C1Kv14_to_C0Kv14 =        beta_act14;
        C2Kv14_to_C1Kv14 = 2.e0 * beta_act14;
        C3Kv14_to_C2Kv14 = 3.e0 * beta_act14;
        OKv14_to_C3Kv14  = 4.e0 * beta_act14;

        CI1Kv14_to_CI0Kv14 =                  beta_act14 / cS.f1Kv14;
        CI2Kv14_to_CI1Kv14 = 2.e0 * cS.f1Kv14 * beta_act14 / cS.f2Kv14;
        CI3Kv14_to_CI2Kv14 = 3.e0 * cS.f2Kv14 * beta_act14 / cS.f3Kv14;
        OIKv14_to_CI3Kv14  = 4.e0 * cS.f3Kv14 * beta_act14 / cS.f4Kv14;

        C0Kv14_to_CI0Kv14 = beta_inact14;
        C1Kv14_to_CI1Kv14 = cS.f1Kv14 * beta_inact14;
        C2Kv14_to_CI2Kv14 = cS.f2Kv14 * beta_inact14;
        C3Kv14_to_CI3Kv14 = cS.f3Kv14 * beta_inact14;
        OKv14_to_OIKv14   = cS.f4Kv14 * beta_inact14;

        CI0Kv14_to_C0Kv14 = alpha_inact14;
        CI1Kv14_to_C1Kv14 = alpha_inact14 / cS.b1Kv14;
        CI2Kv14_to_C2Kv14 = alpha_inact14 / cS.b2Kv14;
        CI3Kv14_to_C3Kv14 = alpha_inact14 / cS.b3Kv14;
        OIKv14_to_OKv14   = alpha_inact14 / cS.b4Kv14;

        

        C0Kv14t = (cS.c0kv14 + cS.timestep * (C1Kv14_to_C0Kv14 * cS.c1kv14 
            + CI0Kv14_to_C0Kv14 * cS.ci0kv14)) / 
            (1.e0 + cS.timestep * (C0Kv14_to_C1Kv14 + C0Kv14_to_CI0Kv14));
        C1Kv14t = (cS.c1kv14 + cS.timestep * (C2Kv14_to_C1Kv14 * cS.c2kv14 
            + CI1Kv14_to_C1Kv14 * cS.ci1kv14 + C0Kv14_to_C1Kv14 * cS.c0kv14)) / 
            (1.e0 + cS.timestep * (C1Kv14_to_C2Kv14 + C1Kv14_to_C0Kv14
                     								+ C1Kv14_to_CI1Kv14));
        C2Kv14t = (cS.c2kv14 + cS.timestep * (C3Kv14_to_C2Kv14 * cS.c3kv14 
            + CI2Kv14_to_C2Kv14 * cS.ci2kv14 + C1Kv14_to_C2Kv14 * cS.c1kv14)) / 
            (1.e0 + cS.timestep * (C2Kv14_to_C3Kv14 + C2Kv14_to_C1Kv14
                     								+ C2Kv14_to_CI2Kv14));
        C3Kv14t = (cS.c3kv14 + cS.timestep * (OKv14_to_C3Kv14 * cS.okv14
            + CI3Kv14_to_C3Kv14 * cS.ci3kv14 + C2Kv14_to_C3Kv14 * cS.c2kv14)) / 
            (1.e0 + cS.timestep * (C3Kv14_to_OKv14 + C3Kv14_to_C2Kv14 
            											+ C3Kv14_to_CI3Kv14));
        OKv14t = (cS.okv14 + cS.timestep * (C3Kv14_to_OKv14 * cS.c3kv14 
            + OIKv14_to_OKv14 * cS.oikv14)) / 
            (1.e0 + cS.timestep * (OKv14_to_C3Kv14 + OKv14_to_OIKv14));
        CI0Kv14t = (cS.ci0kv14 + cS.timestep * (C0Kv14_to_CI0Kv14 * cS.c0kv14 
            + CI1Kv14_to_CI0Kv14 * cS.ci1kv14)) / 
            (1.e0 + cS.timestep * (CI0Kv14_to_C0Kv14 + CI0Kv14_to_CI1Kv14));
        CI1Kv14t = (cS.ci1kv14 + cS.timestep * (CI2Kv14_to_CI1Kv14 * cS.ci2kv14 
            + C1Kv14_to_CI1Kv14 * cS.c1kv14 + CI0Kv14_to_CI1Kv14 * cS.ci0kv14)) / 
            (1.e0 + cS.timestep * (CI1Kv14_to_CI2Kv14 + CI1Kv14_to_C1Kv14
            								         + CI1Kv14_to_CI0Kv14));
        CI2Kv14t = (cS.ci2kv14 + cS.timestep * (CI3Kv14_to_CI2Kv14 * cS.ci3kv14 
            + C2Kv14_to_CI2Kv14 * cS.c2kv14 
            + CI1Kv14_to_CI2Kv14 * cS.ci1kv14)) / 
            (1.e0 + cS.timestep * (CI2Kv14_to_CI3Kv14 + CI2Kv14_to_C2Kv14
                     + CI2Kv14_to_CI1Kv14))
        CI3Kv14t = (cS.ci3kv14 + cS.timestep * (OIKv14_to_CI3Kv14 * cS.oikv14 
            + C3Kv14_to_CI3Kv14 * cS.c3kv14 
            + CI2Kv14_to_CI3Kv14 * cS.ci2kv14)) / 
            (1.e0 + cS.timestep * (CI3Kv14_to_OIKv14 + CI3Kv14_to_C3Kv14
                     + CI3Kv14_to_CI2Kv14))
        OIKv14t = (cS.oikv14 + cS.timestep * (OKv14_to_OIKv14 * cS.okv14 
            + CI3Kv14_to_OIKv14 * cS.ci3kv14)) / 
            (1.e0 + cS.timestep * (OIKv14_to_OKv14 + OIKv14_to_CI3Kv14))

        cS.c0kv14 = C0Kv14t;
        cS.c1kv14 = C1Kv14t;
        cS.c2kv14 = C2Kv14t;
        cS.c3kv14 = C3Kv14t;
        cS.okv14 = OKv14t;
        cS.ci0kv14 = CI0Kv14t;
        cS.ci1kv14 = CI1Kv14t;
        cS.ci2kv14 = CI2Kv14t;
        cS.ci3kv14 = CI3Kv14t;
//        cS.oikv14 = OIKv14t

        if(cS.c0kv14 < cS.ZERO) cS.c0kv14 = cS.ZERO;
        if(cS.c1kv14 < cS.ZERO) cS.c1kv14 = cS.ZERO;
        if(cS.c2kv14 < cS.ZERO) cS.c2kv14 = cS.ZERO;
        if(cS.c3kv14 < cS.ZERO) cS.c3kv14 = cS.ZERO;
        if(cS.okv14 < cS.ZERO)  cS.okv14 = cS.ZERO;
        if(cS.ci0kv14 < cS.ZERO) cS.ci0kv14 = cS.ZERO;
        if(cS.ci1kv14 < cS.ZERO) cS.ci1kv14 = cS.ZERO;
        if(cS.ci2kv14 < cS.ZERO) cS.ci2kv14 = cS.ZERO;
        if(cS.ci3kv14 < cS.ZERO) cS.ci3kv14 = cS.ZERO;
        if(cS.oikv14 < cS.ZERO) cS.oikv14 = cS.ZERO;

        cS.oikv14 = 1.e0 - cS.c0kv14 - cS.c1kv14 - cS.c2kv14 - cS.c3kv14 - cS.okv14
            -cS.ci0kv14 - cS.ci1kv14 - cS.ci2kv14 - cS.ci3kv14;

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
		
		//from settings
		this.RT_over_F = c.Rgas * c.Temp / c.Faraday;
		this.KToverH = 1.381e-23 * c.TNa / 6.626e-31;
		this.RTNa = c.Rgas * c.TNa;     
		this.RTNaF = c.Rgas * c.TNa / 96.48;
		this.PK = c.Pscale * 4.574e-7;
		this.PKv14 = (1.e0 - c.Kv43Frac) * c.KvScale * 4.2986e-7;
		this.C2H_to_C3H = c.T_Const_HERG * 0.02608362043337e0;
		this.C3H_to_C2H = c.T_Const_HERG * 0.14832978132145e0;

	   // useful values
	   // for INa state transition rates
      	this.epsilon = c.Temp_Scale * this.KToverH * Math.exp((-85800.3675578326) / this.RTNa + (70.078e0) / c.Rgas);
      	this.omega_na = c.Temp_Scale * this.KToverH * Math.exp((-121955.166154864) / this.RTNa + (225.175e0) / c.Rgas);
      	this.Cn = c.Temp_Scale * this.KToverH * Math.exp((-287913.446530953) / this.RTNa + (786.217e0) / c.Rgas);
      	this.Cf = c.Temp_Scale * this.KToverH * Math.exp((-59565.2236284584) / this.RTNa + (.00711e0) / c.Rgas);
      	this.sqrtko = Math.sqrt(c.Ko);
      	this.IKrcoeff = c.GKr * this.sqrtko * 0.5;
      	this.IK1coeff = c.GK1 * this.sqrtko;
      	this.sigma = (Math.exp(c.Nao / 67.3e0) - 1.0e0) / 7.0e0;
      	this.Nao3 = Math.pow(c.Nao,3);   //Nao*Nao*Nao
      	this.KmNa3 = Math.pow(c.KmNa,3); //KmNa*KmNa*KmNa
      	this.INaCacoeff = c.kNaCa * 5000.0e0 / (this.KmNa3 + this.Nao3) / (c.KmCa + c.Cao);
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
     *  param {int} iterations
     * param {object} settings
     */ 
	function runCalculations(iterations, settings) {
	 	var state   =    settings,
        data, 
	 	curAnalyzer; 

	 	cC     =   new CalcConstants(settings.calculationSettings);
        cS   =   _.cloneDeep(settings.calculationSettings);
        
        count   =    0;
        
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
	 	var dur = utils.round(c.stimdur / c.timestep);
	 	var periods = stimuli.s1;
	 	for (var i = 0; i < periods.length; i++) {
	 		var periodX = utils.round(periods[i] / c.timestep);
	 		if ((count >= periodX) && (count < periodX + dur)) {
	 			stim = c.stimstrength;
	 		}
	 	}
	 	var lastPeriodX = utils.round(stimuli.s2 / c.timestep);
	 	if ((count >= lastPeriodX) && (count < lastPeriodX + dur)) {
	 		stim = c.stimstrength;
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
	 * This is the api that is returned by IyerCalculator. It contains the
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