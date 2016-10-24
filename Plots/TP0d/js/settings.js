/**
	* This module creates a settings singleton. These will be
	* the default settings, which will be modified as the 
	* program runs.
*/
define(["utility"],
function Settings(utils) {
	
	var defaultSettings = {
		
		calculationSettings: {
			
			//volatges
			v:0.0,
			cai:0.0,
			casr:0.0,
			cass:0.0,
			nai:0.0,
			ki:0.0,
			sm:0.0,
			sh:0.0,
			sj:0.0,
			sxr1:0.0,
			sxr2:0.0,
			sxs:0.0,
			sr:0.0,
			ss:0.0,
			sd:0.0,
			sf:0.0,
			sf2:0.0,
			sfcass:0.0,
			srr:0.0, 
			
			//parameters
			Ko:5.4,
			Cao:2.0,
			Nao:140.0,
			Vc:0.016404,
			Vsr:0.001094,
			Vss:0.00005468,
			Bufc:0.2,
			Kbufc:0.001,
			Bufsr:10.,
			Kbufsr:0.3,
			Bufss:0.4,
			Kbufss:0.00025,
			Vmaxup:0.006375,
			Kup:0.00025,
			Vrel:0.102,
			k3:0.060,
			k4:0.005,
			k1prime:0.15,
			k2prime:0.045,
			EC:1.5,
			maxsr:2.5,
			minsr:1.,
			Vleak:0.00036,
			Vxfer:0.0038,
			RR:8314.3,
			FF:96486.7,
			TT:310.0,
			CAPACITANCE:0.185,
			
			Gkr:0.153,
			pKNa:0.03,
			GK1:5.405,
			alphanaca:2.5,
			GNa:14.838,
			GbNa:0.00029,
			KmK:1.0,
			KmNa:40.0,
			knak:2.724,
			GCaL:0.00003980,
			GbCa:0.000592,
			knaca:1000,
			KmNai:87.5,
			KmCa:1.38,
			ksat:0.1,
			n:0.35,
			GpCa:0.1238,
			KpCa:0.0005,
			GpK:0.0146,
			stimdur:1.0,
			stimstrength:-38.0,
			casshi: 1.0,
			iType: "epi", //set itype=1 for epi, =2 for M, =3 for endo
			Gto:0.294,
			Gks:0.098,
			
			//currents
			sItot: 0,
			ikr: 0,
			iks: 0,
			ik1: 0,
			ito: 0,
			ina: 0,
			ibna: 0,
			ical: 0,
			ibca: 0,
			inaca: 0,
			ipca: 0,
			ipk: 0,
			inak: 0,
			Irel: 0,
			Ileak: 0,
			Iup: 0,
			Ixfer: 0,
			Istim: 0,
			
			//numerical parameters
			s1Start: 0,
			s1: 500,
			s2: 900,
			ns1:3,
			timestep:.02
		},
		
		formSettings: {
			"displayAPDDI" : false, 
			"displayS1S2" : false, 
			"displayV" : false,
			"displayNai" : false, 
			"displayKi" : false, 
			"displaySm" : false, 
			"displaySh" : false,
			"displaySj"  : false, 
			"displaySxr1" : false,
			"displaySxr2" : false, 
			"displaySxs" : false,
			"displaySr"  : false,
			"displaySs" : false, 
			"displaySd" : false,
			"displaySf" : false,
			"displaySfcass" : false, 
			"displaySrr"  : false,
			"displayCai" : false, 
			"displayCasr" : false,
			"displaySf2" : false,
			"displayCass"  : false, 
			secondaryPlot: "",
			//current with labels
			ina: "I_Na",
			ical: "I_CaL",
			ito: "I_to",
			ikr: "I_Kr",
			iks: "I_Ks",
			ik1: "I_K1",
			ipca: "I_pCa",
			ipk: "I_pK",	
			inaca: "I_NaCa",		
			inak: "I_NaK",
			ibna: "I_bNa",				
			ibca: "I_bCa",	
			
			colors  : {
				aPDDI: "Orange",
				s1S2 : "Black",
				v    : "Red"
			} 
		}
	};
	
	
	
	// The function return an array of voltage variables
	function _getVoltageVariables(){
		return ["v","cai","casr","cass","nai","ki","sm","sh","sj","sxr1","sxr2","sxs","sr","ss","sd","sf","sf2","sfcass","srr"];        
	}
	
	// The function return an array of current variables
	function _getCurrentVariables(){
		return ["ikr","iks","ik1","ito","ina","ibna","ical","ibca","inaca","ipca","ipk","inak"];
	}
	
	function setDependents(selectedItype, calcSettings){
        var selectedValues,
        values =   {epi:  {
			v  :  -85.46, 
			cai:  0.0001029,
			casr:  3.432, 
			cass:  0.0002120,  
			nai:  9.293,  
			ki :  136.2, 
			sm :  0.001633,
			sh :  0.7512, 
			sj :  0.7508, 
			sxr1:  0.0002052,
			sxr2:  0.4736, 
			sxs:  0.003214,
			sr :  2.326e-8,
			ss :  1.000,  
			sd :  3.270e-5,
			sf :  0.9767, 
			sf2:  0.9995, 
			sfcass  :  1.000, 
			srr:  0.9891,
			Gks: 0.392, 
			Gto: 0.294,
			iType: "epi" 
		},
		
		M : {
			v	:   -84.53,
			cai  :   0.0001156, 
			casr:   4.130,
			cass:   0.0002331, 
			nai :   9.322,
			ki  :   136.0,
			sm :   0.001694,  
			sh  :   0.7466,
			sj :   0.7457,
			sxr1:   0.0002140, 
			sxr2:   0.4718,
			sxs:   0.003343,  
			sr:   2.392e-8,  
			ss:   1.000,
			sd:   3.345e-5, 
			sf :   0.9595,
			sf2:   0.9995,
			sfcass:   1.000,
			srr :   0.9874,
			Gks: 0.098 , 
			Gto: 0.294,
			iType: "M"
		},
		
		endo:  {
			v :   -84.70,
			cai :  0.0001021,
			casr :  3.385,
			cass  :  0.0002111,
			nai  :  9.413,
			ki:  136.1,
			sm :  0.001634,
			sh :  0.7512,
			sj  :  0.7508,
			sxr1 :  0.0002051,
			sxr2:  0.4736,
			sxs:  0.003213,
			sr:  2.326e-8,
			ss  :   0.6401,
			sd:  3.270e-5,
			sf:  0.9771,
			sf2  :  0.9995,
			sfcass:  1.000,
			srr :  0.9891,
			Gks: 0.392, 
			Gto: 0.073,
			iType: "endo"
		}};
				       
        selectedValues = values[selectedItype];
        if(selectedValues){
            for (var value in selectedValues){
                calcSettings[value] = selectedValues[value];            
			}       
		}   
	}
	
	function _initialize(override){
        //init dependent varaibles
		setDependents(defaultSettings.calculationSettings["iType"] , defaultSettings.calculationSettings);		
		
		defaultSettings = _.merge(defaultSettings, override); 
		
		//Adding additional properties    
		defaultSettings.calculationSettings.voltageVariables = _getVoltageVariables();
		defaultSettings.calculationSettings.currentVariables =  _getCurrentVariables();
		
		//Setting plot setting dynamically            
		defaultSettings["plotSettings"] = utils.initializePlotSettings( _getCurrentVariables(), defaultSettings.formSettings);         
		
		// assign colors            
		defaultSettings["formSettings"]["colors"] =  utils.extend(defaultSettings["formSettings"]["colors"],
		utils.assignColors(utils.removeArrayItems(_getVoltageVariables(), ["v"])));                                					
		
		defaultSettings.calculationSettings.updateDependents = setDependents;
		return defaultSettings;
	}
	
	/*
		* The module exposes functions 
		* initialize
		* getSettings
	*/	
	return{
		
		/**
			* This function modifies any default settings
		*/
		initialize: function(override) {
			return _initialize(override);
		},   
		
		/**
			* Retrieves the settings
		*/
		getSettings: function() {            
			return _.cloneDeep(defaultSettings);
		}
	}
});