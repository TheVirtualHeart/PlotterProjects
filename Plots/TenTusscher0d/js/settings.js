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
			cai:0.0002, //loop
			casr:0.2, //loop
			ki:138.3, // loop
			nai:11.6, //loop
			sd:0.,
			sf:1.,
			sfca:1.,
			sg:1.,
			sh:0.75,
			sitot:0.0,
			sj:0.75,
			sm:0.,
			sr:0.,
			ss:1.,
			sxr1:0.,
			sxr2:1.,
			sxs:0.,
			v:-86.2,
			
			//currents
			ibca:0,
			ibna:0,
			ical:0,
			ik1:0,
			ikr:0,
			iks:0,
			ileak:0,
			ina:0,
			inaca:0,
			inak:0,
			ipca:0,
			ipk:0,								
			ito:0,
			istim:0,
			Irel:0,
						
			//parameters 
			Bufc:0.15,
			Bufsr:10.,				
			Cao:2.0,
			CAPACITANCE:0.185,				
			F:96485.3415,
			GbCa:0.000592,
			GbNa:0.00029,
			GCaL:0.000175,
			GK1:5.405,
			Gkr:0.096,
			GNa:14.838,
			GpCa:0.825,
			GpK:0.0146,
			Kbufc:0.001,
			Kbufsr:0.3,				
			KmCa:1.38,
			KmK:1.0,
			KmNa:40.0,
			KmNai:87.5,
			knaca:1000,
			knak:1.362,
			Ko:5.4,
			KpCa:0.0005,
			ksat:0.1,
			Kup:0.00025,				
			n:0.35,				
			Nao:140.0,
			pKNa:0.03,
			R:8314.472,
			stimdur:1.0,
			stimstrength:-52.0,
			T:310.0,
			taufca:2.,
			taug:2.,				
			Vc:0.016404,
			Vmaxup:0.000425,
			Vsr:0.001094,
			Gks:0.245, 
			Gto : 0.294,
			iType : "epi",
						
			//numerical parameters
			s1Start: 0,
			s1: 300,
			s2: 900,
			ns1:3,
			timestep:.02
		},
		
		formSettings: {
			
			displayAPDDI : false,
			displayS1S2 : false,
			displayV : false,
			displaySd : false,
			displaySf : false,
			displaySfca : false,
			displaySg : false,
			displaySh : false,				
			displaySj : false,
			displaySm : false,
			displaySr : false,
			displaySs : false,
			displaySxr1 : false,
			displaySxr2 : false,
			displaySxs : false,
			displayCai : false,
			displayCasr : false,
			displayKi : false,
			displayNai : false,
			secondaryPlot: "",
			//current with labels
			ina : "I_Na",
			ical : "I_CaL",
			ito : "I_to",
			ikr : "I_Kr",
			iks : "I_Ks",
			ik1 : "I_K1",
			ipca : "I_pCa",
			ipk : "I_pK",
			inaca : "I_NaCa",
			inak : "I_NaK",	
			ibna : "I_bNa",
			ibca : "I_bCa",
			colors  : {
				aPDDI: "Orange",
				s1S2 : "Black",
				v    : "Red"
			} 
			
		}
	};
	
	// The function return an array of voltage variables
	function _getVoltageVariables(){
		return ["cai","casr","ki","nai","sd","sf","sfca","sg","sh","sj","sm","sr","ss","sxr1","sxr2","sxs","v"];   
	}
	
	// The function return an array of current variables
	function _getCurrentVariables(){
		return ["ibca","ibna","ical","ik1","ikr","iks","ina","inaca","inak","ipca","ipk","ito"]; //"ileak","Irel",
	}

	function setDependents(selectedItype, calcSettings){
        var selectedValues,
        values =   { M : {Gks: 0.062 , Gto: 0.294, iType: "M"}, endo : {Gks: 0.245, Gto: 0.073, iType:"endo"}, epi : {Gks: 0.245, Gto: 0.294, iType: "epi"}};
        
        selectedValues = values[selectedItype];
        if(selectedValues){
            for (var value in selectedValues){
                calcSettings[value] = selectedValues[value];            
            }       
        }   
    }
	
	function _initialize(override){
		
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