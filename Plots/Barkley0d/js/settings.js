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
        	u: 0,
			v: 0,

			a: 1.02,
			b: 0.15,
			eps: 0.02,
			stimdur: 0.5,
			v_stim: 0.9,
            
            s1Start: 0,
            s1: 15.0,
            s2: 30,
            ns1: 4,
            timestep: 0.005
		},
		formSettings: {
            displayU: false,
            displayV: false,
            displayS1S2: false,
            colors  : {
                s1S2 : "Black",
                v    : "Red"
            }
        } 
     
    };
    
    // The function return an array of voltage variables
    function _getVoltageVariables(){
        return ["v", "u"];
    }

    function _initialize(override){        
        defaultSettings = _.merge(defaultSettings, override);         
    //Adding additional properties    
        defaultSettings.calculationSettings.voltageVariables = _getVoltageVariables();

    // overriding the plot settings explicitly.
            var plotParams = {
                unitPerTick    :  new Point(30, 0.10)
            };

    //Setting plot setting dynamically            
        defaultSettings["plotSettings"] = utils.initializePlotSettings( null, defaultSettings.formSettings,plotParams);

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
    