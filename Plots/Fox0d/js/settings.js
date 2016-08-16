/**
	* This module creates a settings singleton. These will be
	* the default settings, which will be modified as the 
	* program runs.
	*/

	define(["utility"],
		function Settings(utils) {	

    /**
	* The default settings for the plot
	*/
	var defaultSettings = {        
		calculationSettings: {

			//parameter values
			gna:12.8,
			gk1: 2.8,
			gkr: 0.0136,
			gks: 0.0245,
			gkp: 0.002216,
			gto: 0.23815,
			gnab: 0.0031,
			gcab: 0.0003842,
			pca: 0.0000226,
			pcak: 5.79e-7,
			prel: 6.0,
			pleak: 0.000001,
			xinakbar: 0.693,
			xicahalfbar: -0.265,
			xipcabar: 0.05,
			rr: 8.314,
			tt: 310.0,
			ff: 96.5,
			acap: 1.534e-4,
			csc: 1.0,
			eta: 0.35,
			xksat: 0.2,
			xknaca: 1500.0,
			xkmfca: 0.18,
			xkmk1: 13.0,
			xkmna: 87.5,
			xkmca: 1380.0,
			xkmnai: 10.0,
			xkmko: 1.5,
			xkmpca: 0.05,
			xkmup: 0.32,
			cmdntot: 10.0,
			csqntot: 10000.0,
			xkmcmdn: 2.0,
			xkmcsqn: 600.0,
			vup: 0.1,
			vmyo: 25.84e-6,
			vsr: 2e-6,
			cnai: 10.0,
			cki: 149.4,
			cnao: 138.0,
			cko: 4.0,
			ccao: 2000.0,
			xstimdur: 1,
			stim: -61.2, 

		//numerical parameters
		nx: 1,
		s1Start: 0,
		s1: 430,
		s2: 200,
		ns1:2,
		timestep: 0.05,	
		
		//initial values
		v: -94.7,
		ccai: 0.0472,
		ccasr: 320,
		xf: 1,
		xd: 0.0,
		xm: 0.0,
		xh: 1.0,
		xj: 1.0,
		xfca: 1.0,
		xkr: 0.0,
		xks: 0.0,
		xto: 0.0,
		yto: 1.0,
		
		//currents
		xina : 0,
		xik1 : 0,
		xito : 0,
		xikp : 0,
		xinab : 0,
		xiks : 0,
		xica : 0,
		xinaca : 0,
		xipca : 0,
		xicab : 0,
		xicak : 0,
		xinak : 0,
		xikr : 0
	},

	formSettings: {	

		displayV: false,
		displayCcai: false,
		displayCcasr: false,
		displayXf: false,
		displayXd: false,
		displayXm: false,
		displayXh: false,
		displayXj: false,
		displayXfca: false,
		displayXkr: false,
		displayXks: false,
		displayXto: false,
		displayYto: false,
		displayAPDDI: false,
		displayS1S2: false,
		secondaryPlot: "",
		//current with labels
		xica: "I_Ca",
		xicab: "I_Cab",
		xicak: "I_CaK",
		xik1: "I_K1",
		xikp: "I_Kp",
		xikr: "I_Kr",
		xiks: "I_Ks",
		xina: "I_Na",
		xinab: "I_Nab",
		xinaca: "I_NaCa",
		xinak: "I_NaK",
		xipca: "I_pCa",
		xito: "I_to",
      	colors : {
	        aPDDI: "Orange",
	        s1S2 : "Black",
	        v    : "Red"
      	}
	}               	    	
};

	
  // The function return an array of voltage variables
  function _getVoltageVariables(){
  	return ["v",    "ccasr",    "ccai",     "xfca",     "xd",       "xf",       "yto",      "xto",      "xks",      "xkr",      "xj",   "xh",   "xm"];        
  }

// The function return an array of current variables
function _getCurrentVariables(){
	return ["xina", "xik1",     "xito",     "xikp",     "xinab",    "xiks",     "xica",     "xinaca",   "xipca",    "xicab",    "xicak", "xinak", "xikr"];
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


