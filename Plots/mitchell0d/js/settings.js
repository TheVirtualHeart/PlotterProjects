/**
 * This module creates a settings singleton. These will be
 * the default settings, which will be modified as the 
 * program runs.
 */

define(["utility"],
function Settings(utils) {

var defaultSettings = { 
   calculationSettings:{
	v : 0,
	h: 1,
	tau_in:0.3,
	tau_out:6,
	tau_open:120,
	tau_close:150,
	v_gate:0.13,
	v_stim:0.056,
	stimdur:2,
    endTime:500.0,

	s1Start: 0,
    s2: 1000,
    ns1: 4,
    s1: 500.0,
    timestep: 0.5
   },

   formSettings: {  
	    displayV : false,
	    displayH : false,
        displayS1S2 :false,
         colors  : {
             s1S2 : "Black",
             v    : "Red"
            }     
 	},

};

 // The function return an array of voltage variables
    function _getVoltageVariables(){
        return ["v", "h"];
    }

    function _initialize(override){ 
        var plotParams = {
         unitPerTick : new Point(1000, .1)            
        }       
        defaultSettings = _.merge(defaultSettings, override);         
    //Adding additional properties    
        defaultSettings.calculationSettings.voltageVariables = _getVoltageVariables();

    //Setting plot setting dynamically            
        defaultSettings["plotSettings"] = utils.initializePlotSettings( null, defaultSettings.formSettings, plotParams);

     // assign colors            
        defaultSettings["formSettings"]["colors"] =  utils.extend(defaultSettings["formSettings"]["colors"],
                                                     utils.assignColors(utils.removeArrayItems(_getVoltageVariables(), ["v"]))); 
        return defaultSettings;                                              
    }

return {
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