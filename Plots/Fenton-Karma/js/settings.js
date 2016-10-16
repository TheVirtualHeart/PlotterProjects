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

    		tvp: 3.33,
			tv1m: 19.6,
			tv2m: 1250.,
			twp: 870.0,
			twm: 41.0, //original
			// twm: 11.0, //variation
			td: 0.25,
			to: 12.5,
			tr: 33.33,
			tsi: 29.0,
			xk: 10.0,
			ucsi: 0.85,
			uc: 0.13,
			uv: 0.04, 

			// stimulation period and strength
			stimmag: 0.66,
			//stimmag=0.15,
			stimdur: 1, // (1/timestep)
            istim: 0,

			// numerical parameters
			s1Start: 0,
            s1: 500,
            s2: 700,
            ns1:3,
			timestep: 0.02, // size of time step in ms
			

			// initial values 
			u: 0, //Here, u is voltage.
			v: 1,
			w: 1,
			// v=1,
			// w=1,

            //currents
            jfi: 0,
            jso: 0,
            jsi: 0
		},
		formSettings: {
			displayAPDDI : false,
            displayS1S2  : false,
            displayU: false,
            displayV: false,
            displayW: false,
            secondaryPlot: "",

            //currents with labels
            jfi: "J_fi",
            jso: "J_so",
            jsi: "J_si",
            
            colors  : {
               aPDDI: "Orange",
               s1S2 : "Black",
               u    : "Red"
            }      
        }
    };

    // The function return an array of voltage variables
    function _getVoltageVariables(){
        return ["u", "v", "w"];
    }

    // The function return an array of current variables
    function _getCurrentVariables(){
        return [ "jfi", "jso", "jsi"];
    }
    
    function _initialize(override){
            
        //override colors
        defaultSettings = _.merge(defaultSettings, override);

        //Adding additional properties    
        defaultSettings.calculationSettings.voltageVariables = _getVoltageVariables();
        defaultSettings.calculationSettings.currentVariables =  _getCurrentVariables();

        // overriding the plot settings explicitly.
        var plotParams = {
            range: new Point(-0.1, 1.3)
        };

        //Setting plot setting dynamically            
        defaultSettings["plotSettings"] = utils.initializePlotSettings( _getCurrentVariables(), defaultSettings.formSettings,plotParams);
        
         // assign colors            
        defaultSettings["formSettings"]["colors"] =  utils.extend(defaultSettings["formSettings"]["colors"],
                                                     utils.assignColors(utils.removeArrayItems(_getVoltageVariables(), ["u"])));                                
        
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


		




