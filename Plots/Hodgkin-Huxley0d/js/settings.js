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
        	
            // initial values 
            // v = -10.0;  % gives action potential through initial condition
            v: -10.0,  // gives action potential through initial condition
            h: 0.6,
            m: 0.05,
            n: 0.3,

			// parameter values
            cm: 1,
            gbark: 36,
            gbarna: 120,
            gbarl: 0.3,
            ena: -115,
            ek: 12,
            el: -10.613,
			
            // numerical parameters
            
            // endTime: 30,
            
            stimdur: 1.5,
            stimmag: 20,
            istim: 0,
            
            s1Start: 0,
            s1: 40,
            s2: 40,
            ns1: 3,

            timestep: 0.05,

            //currents
            ina: 0,   ik: 0,    il: 0
		},
		formSettings: {
            displayV: false,
            displayH: false,
            displayM: false,
            displayN: false,
            displayS1S2  : false,
            secondaryPlot: "",
            
            //current with labels
            ina    : "I_Na",
            ik    : "I_K",
            il   : "I_l",
            
            colors  : {
                v    : "Red",
                s1S2 : "Black"
            }
        } 
     
    };
    
    // The function return an array of voltage variables
    function _getVoltageVariables(){
        return ["v", "h", "m", "n"];
    }

    // The function return an array of current variables
    function _getCurrentVariables(){
          return ["ina",  "ik", "il"];
    }

    function _initialize(override){        
        
        defaultSettings = _.merge(defaultSettings, override);         

        //Adding additional properties    
        defaultSettings.calculationSettings.voltageVariables = _getVoltageVariables();
        defaultSettings.calculationSettings.currentVariables =  _getCurrentVariables();

    // overriding the plot settings explicitly.
            var plotParams = {
                range: new Point(-0.1,1.1),
                unitPerTick    :  new Point(3, 0.10)
            };

    //Setting plot setting dynamically            
        defaultSettings["plotSettings"] = utils.initializePlotSettings( _getCurrentVariables(), defaultSettings.formSettings,plotParams);

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
    