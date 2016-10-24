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
		calculationSettings:{
			v : -83.5,  
			m : 0.0127,
			h : 0.9824,
			j : 0.9685,
			d : 0.0033,
			f : 0.9969,
			x1 : 0.1410,
			cai : 1.8545e-7,
			gna : 4.0,
			gnac : 0.003,
			ena : 50.0,
			gs : 0.09,
			cm : 1.0,

			stimdur : 2,     // verify with prof. formula being used is 2/dt
			stimmag : 26.4, // 13.2*2
			c1 : 0.0,
			c2 : 0.0,
			c3 : 0,
			c4 : 0,
			c5 : 0,
			c6 : 0.0,
			c7 : 0,

			ik1 : 0.0,
			ix1 : 0.0,
			ina : 0.0,
			is : 0.0,
			istim : 0.0,
		
			s1Start: 0,
			s1: 400,
			s2: 500,
			ns1: 3,
			timestep: 0.1
		},
		
		formSettings: {
			displayAPDDI: false,
			displayV : false,  
			displayM : false,
			displayH : false,
			displayJ : false,
			displayD : false,
			displayF : false,
			displayX1  : false,
			displayCai : false,
			secondaryPlot : "",
		
		//current with labels 
			ik1 : "I_K1",
			ix1 : "I_K",
			ina : "I_Na",
			is  : "I_Ca",

			colors  : {
				aPDDI: "Orange",
				s1S2 : "Black",
				v    : "Red"
			}          
		}
	};
	
	// The function return an array of voltage variables
	function _getVoltageVariables(){
		return ["v", "m", "h", "j", "d", "f", "x1", "cai"];
	}

	
	// The function return an array of current variables
	function _getCurrentVariables(){
		return ["ik1", "ix1", "ina", "is"];
	}

	function _initialize(override){
				
		//override colors
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
	
	return{
		
    	/**
			* This function modifies any default settings
		*/
		initialize: function(override) {
			
            // = _.merge(defaultSettings, override);   
            return   _initialize(override);  
		},  
		
        /**
			* Retrieves the settings
		*/
		
		getSettings: function() {         	
         	return _.cloneDeep(defaultSettings);
		}
	}
	
});


