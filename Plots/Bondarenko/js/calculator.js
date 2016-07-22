/**
    * This module is responsible for performing the differential equation
    * calculation for BondarenkoCalculator. The object maintains the state of the different
    * variables and returns them after each calculation. These variables can also
    * be reset. 
*/

define(["utility"],
function BondarenkoCalculator(utils) {
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

    var ena, ek, ekr, ecan, dol, dcl1, dcl2, dcl3, dcl4, dil1, dil2, dil3, gamma, temp1,
        dck0, dck1, dck2, dok, dik,  dcna3, dcna2, dcna1, dona, difna, di1na, di2na, dicna2, 
        dicna3, icasstot, icaitot, ikitot, inaitot, icltot, a1, a2, myA, myB, myC, myD, myE,
		myF, myU, myV, myW, myQ, myR, myX1, myX2, myX3, myX4, dpryr, dltrpn, dhtrpn,
		bi, bss, bjsr, dcai, dcajsr, dcansr;
		 


    var alphana11t_t, alphana12t_t, alphana13t_t, betana11t_t, betana12t_t, betana13t_t,
    	alphana3t_t, betana3t_t, alphana2t_t, betana2t_t, alphana4t_t, betana4t_t,
    	alphana5t_t, betana5t_t, alphaat_t, betaat_t, alphait_t, betait_t, abart_t, ibart_t, 
    	tauatost_t, tauitost_t, alphant_t, betant_t, tauaurt_t, tauiurt_t, taukss_t,
    	alphaa0t_t, betaa0t_t, alphaa1t_t, betaa1t_t, alphaikrt_t, betaikrt_t,
    	naca1t_t, naca2t_t, inakcoefft_t, oclcat_t, alphacalt_t, betacalt_t, kpcft_t, pryr1t_t,
    	ik1t_t;


    	// sets voltage variables after calculations
            data.calculationSettings.voltageVariables.forEach(function (item){
              cS[item]  =    data.calculationSettings[item];                        
            });

            // sets current variables after calculations
            data.calculationSettings.currentVariables.forEach(function (item){
             cS[item]  =    data.calculationSettings[item];
           });

            data.calculationSettings.parameters.forEach(function (item){
             cS[item]  =    data.calculationSettings[item];
           });

        // sets additional variables required in calculations
            data.calculationSettings.additionalVariables.forEach(function (item){
                 cS[item]  =    data.calculationSettings[item];
            });


		alphana11t_t = 3.802/(0.1027*Math.exp(-(cS.v+2.5)/17.0)+0.20*Math.exp(-(cS.v+2.5)/150.0)); 
        alphana12t_t = 3.802/(0.1027*Math.exp(-(cS.v+2.5)/15.0)+0.23*Math.exp(-(cS.v+2.5)/150.0)); 
        alphana13t_t = 3.802/(0.1027*Math.exp(-(cS.v+2.5)/12.0)+0.25*Math.exp(-(cS.v+2.5)/150.0));

		betana11t_t = 0.1917*Math.exp(-(cS.v+2.5)/20.3);
		betana12t_t = 0.20*Math.exp(-(cS.v-2.5)/20.3);
		betana13t_t = 0.22*Math.exp(-(cS.v-7.5)/20.3);
		alphana3t_t = 7.e-7*Math.exp(-(cS.v+7.0)/7.7);
		betana3t_t  = 0.0084+0.00002*(cS.v+7.0);
		alphana2t_t = 1.0/(0.188495*Math.exp(-(cS.v+7.0)/16.6)+0.393956);
		betana2t_t  = alphana13t_t*alphana2t_t*alphana3t_t/(betana13t_t*betana3t_t); 

		alphana4t_t = alphana2t_t/1.0e3;
		betana4t_t  = alphana3t_t;
		alphana5t_t = alphana2t_t/95.0e3;
		betana5t_t  = alphana3t_t/50.0; 

		alphaat_t  = 0.18064*Math.exp(0.03577*(cS.v+30.0));
        betaat_t   = 0.3956*Math.exp(-0.06237*(cS.v+30.0));
        alphait_t  = 0.000152*Math.exp(-(cS.v+13.5)/7.0)/(0.067083*Math.exp(-(cS.v+33.5)/7.0)+1.0);             
        betait_t   = 0.00095*Math.exp((cS.v+33.5)/7.0)/(0.051335*Math.exp((cS.v+33.5)/7.0)+1.0);             
        abart_t    = 1.0/(1.0+Math.exp(-(cS.v+22.5)/7.7));
        ibart_t    = 1.0/(1.0+Math.exp((cS.v+45.2)/5.7));
        tauatost_t = 0.493*Math.exp(-0.0629*cS.v)+2.058;
        tauitost_t = 270.0+1050.0/(1.0+Math.exp((cS.v+45.2)/5.7)); 

        alphant_t =  (Math.abs(cS.v+26.5) > 1e-3) ? 0.00000481333*(cS.v+26.5)/(1.0-Math.exp(-0.128*(cS.v+26.5))) : 3.76e-5;
		betant_t =  0.0000953333*Math.exp(-0.038*(cS.v+26.5));
		tauaurt_t = tauatost_t;
		tauiurt_t = 1200.0-170.0/(1.0+Math.exp((cS.v+45.2)/5.7));
		taukss_t = 39.3*Math.exp(-0.0862*cS.v)+13.17;

 
		alphaa0t_t  = 0.022348*Math.exp(0.01176*cS.v);
		betaa0t_t   = 0.047002*Math.exp(-0.0631*cS.v);
		alphaa1t_t  = 0.013733*Math.exp(0.038198*cS.v);
		betaa1t_t   = 0.0000689*Math.exp(-0.04178*cS.v);
		alphaikrt_t = 0.090821*Math.exp(0.023391*(cS.v+5.0));
		betaikrt_t  = 0.006497*Math.exp(-0.03268*(cS.v+5.0));

		naca1t_t = Math.exp(cS.eta*cS.v*cC.fort)*cS.cao/(1.0+cS.ksat*Math.exp((cS.eta-1.0)*cS.v*cC.fort));
		naca2t_t = Math.exp((cS.eta-1.0)*cS.v*cC.fort)*cC.nao3/(1.0+cS.ksat*Math.exp((cS.eta-1.0)*cS.v*cC.fort));
		inakcoefft_t = cS.inakmax*(cS.ko/(cS.ko+cS.kmko))/(1.0+0.1245*Math.exp(-0.1*cS.v*cC.fort)+0.0365*cC.sigma*Math.exp(-cS.v*cC.fort));
		oclcat_t = 0.2/(1.0+Math.exp(-(cS.v-46.7)/7.8));
		alphacalt_t = 0.4*Math.exp((cS.v+12.0)/10.0)*(1.0+0.7*Math.exp(-(cS.v+40.0)*(cS.v+40.0)/10.0)-0.75*Math.exp(-(cS.v+20.0)*(cS.v+20.0)/400.0))/(1.0+0.12*Math.exp((cS.v+12.0)/10.0));

		betacalt_t = 0.05*Math.exp(-(cS.v+12.0)/13.0);
		kpcft_t    = 13.0*(1.0-Math.exp(-(cS.v+14.5)*(cS.v+14.5)/100.0));
		pryr1t_t   = 0.1*Math.exp(-(cS.v-5.0)*(cS.v-5.0)/648.0)/cS.icalmax;


	//compute reversal potentials
		ena  = cC.rtof*Math.log((0.9*cS.nao+0.1*cS.ko)/(0.9*cS.nai+0.1*cS.ki));
		ek   = cC.rtof*Math.log(cS.ko/cS.ki);
		ekr  = cC.rtof*Math.log((0.98*cS.ko+0.02*cS.nao)/(0.98*cS.ki+0.02*cS.nai));
		ecan = 0.5*cC.rtof*Math.log(cS.cao/cS.cai);

        ik1t_t  = cS.gk1*(cS.ko/(cS.ko+210.0))*((cS.v - ek)/(1.0+Math.exp(0.0896*((cS.v - ek)))));
        
        cS.istim = _s1s2Stimulus(count, data);

        dol=0.0;
		dcl1=0.0;
		dcl2=0.0;
		dcl3=0.0;
		dcl4=0.0;
		dil1=0.0;
		dil2=0.0;
		dil3=0.0;

		gamma = cS.kpcmax* cS.cass/(cS.kpchalf+cS.cass);

		temp1 = alphacalt_t*cS.cl4-4.0*betacalt_t*cS.ol;
		dcl4  = dcl4-temp1;
		dol   = dol+temp1;
		temp1 = cS.kpcb*cS.il1- gamma*cS.ol;
		dil1  = dil1-temp1;
		dol   = dol+temp1;
		temp1 = 0.001*(alphacalt_t*cS.il2-kpcft_t*cS.ol);
		dil2  = dil2-temp1;
		dol   = dol+temp1;
		temp1 = 4.0*alphacalt_t*cS.cl1-betacalt_t*cS.cl2;
		dcl1  = dcl1-temp1;
		dcl2  = dcl2+temp1;
		temp1 = 2.0*betacalt_t*cS.cl3-3.0*alphacalt_t*cS.cl2;
		dcl3  = dcl3-temp1;
		dcl2  = dcl2+temp1;
		temp1 = 3.0*betacalt_t*cS.cl4-2.0*alphacalt_t*cS.cl3;
		dcl4  = dcl4-temp1;
		dcl3  = dcl3+temp1;
		temp1 = 0.01*(4.0*cS.kpcb*betacalt_t*cS.il1-alphacalt_t*gamma*cS.cl4);        
		dil1  = dil1-temp1;
		dcl4  = dcl4+temp1;
		temp1 = 0.002*(4.0*betacalt_t*cS.il2-kpcft_t*cS.cl4);
		dil2  = dil2-temp1;
		dcl4  = dcl4+temp1;
		temp1 = 4.0*betacalt_t*cS.kpcb*cS.il3-gamma*kpcft_t*cS.cl4;
		dil3  = dil3-temp1;
		dcl4  = dcl4+temp1;
		temp1 = 0.001*(alphacalt_t*cS.il3-kpcft_t*cS.il1);
		dil3  = dil3-temp1;
		dil1  = dil1+temp1;
		temp1 = cS.kpcb*cS.il3-gamma*cS.il2;
		dil3  = dil3-temp1;
		dil2  = dil2+temp1;

		cS.ol  = cS.ol  + cS.timestep * dol;
		cS.cl1 = cS.cl1 + cS.timestep * dcl1;
		cS.cl2 = cS.cl2 + cS.timestep * dcl2;
		cS.cl3 = cS.cl3 + cS.timestep * dcl3;
		cS.cl4 = cS.cl4 + cS.timestep * dcl4;
		cS.il1 = cS.il1 + cS.timestep * dil1;
		cS.il2 = cS.il2 + cS.timestep * dil2;
		cS.il3 = cS.il3 + cS.timestep * dil3;

		cS.ical = cS.gcal*cS.ol*(cS.v- cS.ecal);

	//sarcolemmal pump current
	    cS.ipca = cS.ipcamax*cS.cai*cS.cai/(cS.kmpca*cS.kmpca+cS.cai*cS.cai);

	// Na+/Ca2+ exchanger current
		cS.inaca = cS.knaca*(naca1t_t*cS.nai*cS.nai*cS.nai-naca2t_t*cS.cai)/((cC.kmna3+cC.nao3)*(cS.kmca+cS.cao));

 	//background Ca2+ current
        cS.icab = cS.gcab*(cS.v-ecan);

    //fast Ito current
         cS.atof  = cS.atof +cS.timestep *(alphaat_t*(1.0-cS.atof)-betaat_t*cS.atof); 
         cS.itof  = cS.itof +cS.timestep *(alphait_t*(1.0-cS.itof)-betait_t*cS.itof);
         cS.iktof = cS.gktof*cS.atof*cS.atof*cS.atof*cS.itof*(cS.v-ek);

    //slow Ito current
         cS.atos = cS.atos+cS.timestep*(abart_t-cS.atos)/tauatost_t;
         cS.itos = cS.itos+cS.timestep*(ibart_t-cS.itos)/tauitost_t;
         cS.iktos = cS.gktos*cS.atos*cS.itos*(cS.v-ek);

    //inward rectifier
		cS.ik1 = ik1t_t;

	//slow delayed rectifier
		cS.nks = cS.nks+cS.timestep*(alphant_t*(1.0-cS.nks)-betant_t*cS.nks);
        cS.iks = cS.gks*cS.nks*cS.nks*(cS.v-ek);

    //rapid delayed rectifier
		dck0=0.0;
		dck1=0.0;
		dck2=0.0;
		dok=0.0;
		dik=0.0;

		temp1=alphaa0t_t*cS.ck0-betaa0t_t*cS.ck1;
		dck0=dck0-temp1;
		dck1=dck1+temp1;
		temp1=cS.kf*cS.ck1-cS.kb*cS.ck2;
		dck1=dck1-temp1;
		dck2=dck2+temp1;
		temp1=alphaa1t_t*cS.ck2-betaa1t_t*cS.ok;
		dck2=dck2-temp1;
		dok=dok+temp1;
		temp1=alphaikrt_t*cS.ok-betaikrt_t*cS.ik;
		dok=dok-temp1;
		dik=dik+temp1;

		cS.ck1 = cS.ck1+cS.timestep*dck1;
		cS.ck2 = cS.ck2+cS.timestep*dck2;
		cS.ok = cS.ok+cS.timestep*dok;
		cS.ik = cS.ik+cS.timestep*dik;

		if(cS.ck0<0.0) {
			cS.ck0=0.0;
		}

		if(cS.ck1<0.0){
			cS.ck1=0.0;
		}

		if(cS.ck2<0.0){
			cS.ck2=0.0;
		}

		if(cS.ok <0.0){
			cS.ok =0.0;
		}

		if(cS.ik <0.0){
			cS.ik =0.0;
		}

		cS.ck0 = 1.0-cS.ck1-cS.ck2-cS.ok-cS.ik;
		cS.ikr = cS.ok*cS.gkr*(cS.v-ekr);

		//noninactivating steady-state current
	 	cS.xakss = cS.xakss+cS.timestep*(abart_t-cS.xakss)/taukss_t
	// xikss does not get updated; it is a constant
		 cS.ikss = cS.gkss*cS.xakss*cS.xikss*(cS.v-ek);
	// ultrarapid delayed rectifier 
		 cS.aur = cS.aur+cS.timestep*(abart_t-cS.aur)/tauaurt_t;
		 cS.iur = cS.iur+cS.timestep*(ibart_t-cS.iur)/tauiurt_t;
		 cS.ikur = cS.gkur*cS.aur*cS.iur*(cS.v-ek);
	// Na+/K+ pump
		 temp1 = Math.sqrt( cS.kmnai/ cS.nai);
		 cS.inak = inakcoefft_t/(1.0+temp1*temp1*temp1);  

	//fast Na+ current
		 dcna3=0.0;
		 dcna2=0.0;
		 dcna1=0.0;
		 dona=0.0;
		 difna=0.0;
		 di1na=0.0;
		 di2na=0.0;
		 dicna2=0.0;
		 dicna3=0.0;

		temp1 = alphana11t_t* cS.cna3-betana11t_t*cS.cna2;
		dcna3 = dcna3-temp1;
		dcna2 = dcna2+temp1;
		temp1 = alphana12t_t*cS.cna2-betana12t_t*cS.cna1;
		dcna2 = dcna2-temp1;
		dcna1 = dcna1+temp1;
		temp1 = alphana3t_t*cS.icna2-betana3t_t*cS.cna2;
		dicna2 = dicna2-temp1;
		dcna2 = dcna2+temp1;
		temp1 = alphana13t_t*cS.cna1-betana13t_t*cS.ona;
		dcna1 = dcna1-temp1;
		dona = dona+temp1;
		temp1 = alphana3t_t*cS.ifna-betana3t_t*cS.cna1;
		difna = difna-temp1;
		dcna1 = dcna1+temp1;
		temp1 = alphana2t_t*cS.ona-betana2t_t*cS.ifna;
		dona = dona-temp1;
		difna = difna+temp1;
		temp1 = alphana4t_t*cS.ifna-betana4t_t*cS.i1na;
		difna = difna-temp1;
		di1na = di1na+temp1;
		temp1 = alphana12t_t*cS.icna2-betana12t_t*cS.ifna;
		dicna2 = dicna2-temp1;
		difna = difna+temp1;
		temp1 = alphana5t_t*cS.i1na-betana5t_t*cS.i2na;
		di1na = di1na-temp1;
		di2na = di2na+temp1;
		temp1 = alphana11t_t*cS.icna3-betana11t_t*cS.icna2;
		dicna3 = dicna3-temp1;
		dicna2 = dicna2+temp1;
		temp1 = alphana3t_t*cS.icna3-betana3t_t*cS.cna3;
		dicna3 = dicna3-temp1;
		dcna3 = dcna3+temp1;

		cS.cna1 = cS.cna1+cS.timestep*dcna1;
		cS.cna2 = cS.cna2+cS.timestep*dcna2;
		cS.cna3 = cS.cna3+cS.timestep*dcna3;
		cS.ifna = cS.ifna+cS.timestep*difna;
		cS.i1na = cS.i1na+cS.timestep*di1na;
		cS.i2na = cS.i2na+cS.timestep*di2na;
		cS.icna2 = cS.icna2+cS.timestep*dicna2;
		cS.icna3 = cS.icna3+cS.timestep*dicna3;
		cS.ona = cS.ona+cS.timestep*dona;

		cS.ina = cS.gna*cS.ona*(cS.v-ena);

	//background Na+ current
         cS.inab = cS.gnab*(cS.v-ena);

    //Ca2+-activated Cl- current
		cS.iclca = cS.gclca*oclcat_t*cS.cai/(cS.cai+cS.kmcl)*(cS.v-cS.ecl);
		icasstot = -cS.ical;
		icaitot = -cS.ipca+2.0*cS.inaca-cS.icab;
		ikitot = -cS.iktof-cS.iktos-cS.ik1-cS.iks-cS.ikr-cS.ikss-cS.ikur+2.0*cS.inak+cS.istim;
		inaitot = -cS.ina-cS.inab-3.0*cS.inaca-3.0*cS.inak;
		icltot = -cS.iclca;

		a1 = cS.cass*cS.cass*cS.cass;
		a2 = a1*cS.cass;

		myA = -cS.timestep*cS.kbplus*a1;
		myB = 1.e0+cS.timestep*cS.kbminus;
		myC = -cS.timestep*cS.kaminus;
		myD = 1.e0+cS.timestep*cS.kaplus*a2;
		myE = -cS.timestep*cS.kcplus;
		myF = 1.e0+cS.timestep*cS.kcminus;
		myU = cS.po2;
		myV = cS.pc1;
		myW = cS.pc2;
		myQ = myF/myB*(myB-myA)-myC*myF/myD-myE;
		myR = myF-myF*myU/myB-myF/myD*myV-myW;

		myX1 = myR/myQ;
		myX2 = (myU-myA*myX1)/myB;
		myX3 = (myV-myC*myX1)/myD;
		myX4 = (myW-myE*myX1)/myF;

		cS.po1 = myX1;
		cS.po2 = myX2;
		cS.pc1 = myX3;
		cS.pc2 = myX4;

		dpryr = -0.04*cS.pryr-pryr1t_t*cS.ical;
		cS.pryr = cS.pryr+cS.timestep*dpryr;
		dltrpn = cS.kltrpnplus*cS.cai*(cS.ltrpntot-cS.ltrpn)-cS.kltrpnminus*cS.ltrpn;   
		dhtrpn = cS.khtrpnplus*cS.cai*(cS.htrpntot-cS.htrpn)-cS.khtrpnminus*cS.htrpn;
		cS.ltrpn = cS.ltrpn+cS.timestep*dltrpn;
		cS.htrpn = cS.htrpn+cS.timestep*dhtrpn;

		cS.jrel = cS.nu1*(cS.po1+cS.po2)*(cS.cajsr-cS.cass)*cS.pryr;
		cS.jtr = (cS.cansr-cS.cajsr)/cS.tautr;
		cS.jxfer = (cS.cass-cS.cai)/cS.tauxfer;
		cS.jleak = cS.nu2*(cS.cansr-cS.cai);
		cS.jup = cS.nu3*cS.cai*cS.cai/(cS.kmup*cS.kmup+cS.cai*cS.cai);
		cS.jtrpn = dltrpn+dhtrpn;   
		bi = 1.0/(1.0+cS.cmdntot*cS.kmcmdn/(cS.kmcmdn+cS.cai)/(cS.kmcmdn+cS.cai));
		bss = 1.0/(1.0+cS.cmdntot*cS.kmcmdn/(cS.kmcmdn+cS.cass)/(cS.kmcmdn+cS.cass));
		bjsr = 1.0/(1.0+cS.csqntot*cS.kmcsqn/(cS.kmcsqn+cS.cajsr)/(cS.kmcsqn+cS.cajsr));
		dcai = bi*(cS.jleak+cS.jxfer-cS.jup-cS.jtrpn+icaitot*cS.acap*cS.cm*0.5/(cS.vmyo*cS.ff));
		dcajsr = bjsr*(cS.jtr-cS.jrel);
		dcansr = (cS.jup-cS.jleak)*cS.vmyo/cS.vnsr-cS.jtr*cS.vjsr/cS.vnsr;
		a2  =  cS.acap/(2.e0*cS.vss*cS.ff);

		cS.cass = (cS.cass+cS.timestep*bss*(cS.vjsr/cS.vss*cS.nu1*cS.pryr *(cS.po1+cS.po2)*cS.cajsr + cS.vmyo/cS.vss/cS.tauxfer*cS.cai- a2*cS.ical))/(1.e0+cS.timestep*bss*(cS.vjsr/cS.vss*cS.nu1*cS.pryr*(cS.po1+cS.po2)+ cS.vmyo/cS.vss/cS.tauxfer));
        cS.cai = cS.cai+cS.timestep*dcai; 
        
        cS.cajsr = cS.cajsr+cS.timestep*dcajsr;
		cS.cansr = cS.cansr+cS.timestep*dcansr;
		cS.ki = cS.ki+cS.timestep*cS.acap*cS.cm/cS.vmyo/cS.ff*ikitot;
		cS.nai = cS.nai+cS.timestep*cS.acap*cS.cm/cS.vmyo/cS.ff*inaitot;    
             
        cS.v = cS.v +cS.timestep *(icasstot+icaitot+ikitot+inaitot+icltot)/cS.cm; 

       //console.log(icasstot,icaitot,ikitot,inaitot,icltot,cS.cm) ;  
 
 		//cal ends
          // sets voltage variables after calculations
          data.calculationSettings.voltageVariables.forEach(function (item){
            data.calculationSettings[item]  =    cS[item];
          });

        // sets current variables after calculations
          data.calculationSettings.currentVariables.forEach(function (item){
            data.calculationSettings[item]  =    cS[item];
          });

          data.calculationSettings.parameters.forEach(function (item){
           data.calculationSettings[item] = cS[item];
         });

        // sets additional variables after calculations
            data.calculationSettings.additionalVariables.forEach(function (item){
                data.calculationSettings[item] =   cS[item];
            });

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

		this.rtof  = c.rr*c.tt/c.ff;
		this.fort  = 1.0/this.rtof;
		this.nao3  = c.nao*c.nao*c.nao;
		this.kmna3 = c.kmna*c.kmna*c.kmna;
		this.sigma = (Math.exp(c.nao/67300.0)-1.0)/7.0;      
	  }
	
	
	function _getNumIterations(settings) {
		var c   =    settings.calculationSettings;
		var num   =    (((c.s1 * c.ns1) + c.s2) * 1.1) / c.timestep;
		num   =    Math.floor(num);
		return num;    
	} 
	
	function runCalculations(iterations, settings) {
		var state   =   settings,
            data,
            curAnalyzer;     
            //here 'count' is global variable
            count   =    0;
        // need to initialize Cs and CC here as calculationsSettings gets updated dynamicall
        cS   =   _.cloneDeep(settings.calculationSettings);      
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
	         data = calculateNext(state);         
	         for (curAnalyzer = 0; curAnalyzer < analyzers.length; curAnalyzer++) {
	          if (analyzers[curAnalyzer].hasOwnProperty("aggregate")) {
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
        //console.log(settings) ;           	
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
				stim   =    c.istimmag;
			}
		}
		var lastPeriodX   =    utils.round(stimuli.s2 / c.timestep);
		if ((count >=    lastPeriodX) && (count < lastPeriodX + dur)) {
			stim   =    c.istimmag;
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
		timestep: settings.timestep,
		initialize: initialize,            
		calculateNext: calculateNext,
		updateSettingsWithAnalyzers : updateSettingsWithAnalyzers,
		reset: reset,
	};
	return api;
	
});