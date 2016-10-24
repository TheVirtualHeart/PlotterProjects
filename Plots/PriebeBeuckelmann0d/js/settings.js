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
			v : -90.65004,
			caitot : 0.023632353,
			cajsrtot : 10.69691,
			cansr : 3.033365,
			nai :    10.e0,
			ki :    140.E0,
			d :   2.6203886E-10,
			f :   0.9217116,
			m :   5.9394888E-04,
			h :   0.9957722,
			j :   0.9969334,
			r :   1.7635530E-05,
			to :  0.9998544,
			xr :  1.5783978E-04,
			xs :  7.4024042E-03,
			cajsr : -0.047671 + 10.69691 * ( 0.11596 + 10.69691 * ( 10.69691 * 0.0019814 - 0.0062985 ) ),
			cai :   -5.8407E-5+ 0.023632353*(0.012799+0.023632353*(0.023632353*3.8692-0.17534)),
			iup : 0.0,
			ileak : 0.0,
			itr : 0.0,
			irel : 0.0,
			
			//parameters
			nae : 138.e0,
			ke : 4.e0,
			cae : 2.e0,
			cm : 153.4,
			gna : 16.0,
			gca : 0.064,
			gks : 0.02,
			gkr : 0.015,
			kca : 0.0006,
			kmca : 1.38,
			kmke : 1.5,
			kmna : 82.5,
			kmnai : 10.0,
			ksat : 0.1,
			eta : 0.35,
			dcaith : 0.000005,
			vmyo : 25840.0,
			vnsr : 2098.0,
			vjsr : 182.0,
			fc : 96.4867,
			bcl : 1000.0,
			pi : 3.141593,				
			gto : 0.3,
			gk1 : 2.5,
			gcab : 0.00085,
			gnab : 0.001,
			gnak : 1.3,
			gnaca : 1000.0,
			giup : 0.0045,
			kleak : 0.00026,
			cicr : 0.0,
			tcicr0: 0.0,
			ti : 100,
			dcai2 : 0.0,
			caitotvmax : 0.0,
			tvmax:-120.0,
			stimdur:2.0,
			stimdelay:0.0,
			istim : 20.0,
			
			//currents
			ik1   : 0.0,
			inaca : 0.0,
			inak : 0.0,
			icab : 0.0,
			inab : 0.0,
			ina  : 0.0,
			ica  : 0.0,
			ito  : 0.0,
			//IK 	 : 0.0,
			ikr  : 0.0,
			iks  : 0.0,
			itot : 0.0,
			iss:0.0,
			
			//numerical parameters
			s1Start: 0,
			s1: 500,
			s2: 700,
			ns1:3,
			timestep:0.01
		},
		
		formSettings: {
			displayAPDDI    : false,
			displayV		: false,
			displayS1S2 	: false,
			displayCaitot	: false,
			displayCajsrtot : false,
			displayCansr	: false,
			displayNai	: false,
			displayKi	: false,
			displayD	: false,
			displayF	: false,
			displayM	: false,
			displayH	: false,
			displayJ	: false,
			displayR	: false,
			displayTo	: false,
			displayXr	: false,
			displayXs	: false,
			displayCajsr    : false,
			displayCai  : false,
			secondaryPlot : "",
			
			//current with labels
			ik1 : "I_K1",
			inaca : "I_NaCa",
			inak : "I_NaK",
			icab : "I_Cab",
			inab : "I_Nab",
			ina : "I_Na",
			ica : "I_Ca",
			ito : "I_to",
			ikr : "I_Kr",
			iks : "I_Ks",    
            colors  : {
				aPDDI: "Orange",
				s1S2 : "Black",
				v    : "Red"
			}      
		}
	};
	
	
	// The function return an array of voltage variables
	function _getVoltageVariables(){
		return ["v","cansr","nai","ki","d","f","m","h","j","r","to","xr","xs","cajsr","cai"];        
	}
	
	// The function return an array of current variables
	function _getCurrentVariables(){
		return ["ik1","inaca","inak","icab","inab","ina","ica","ito","ikr","iks"];
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