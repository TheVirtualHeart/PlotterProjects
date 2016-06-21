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
	    displayV : true,
	    displayH : true,
        displayS1S2 :false
 	},

   plotSettings:{
	Mitchell: {
                width: 437.5,
                height: 240,
                offset: new Point(0, 0),
                plots: {
                        mainPlot: {
                        range: new Point(-0.1, 1),
                        unitPerTick: new Point(1000, .1),
                        labelFrequency: new Point(1, 1),
                        xAxis: "Time (ms)",
                        yAxis: " ",
                        labelPrecision: new Point(0, 1),
                        labelSize: new Point(0, 0),
                    }
                }
            }
   },

};

return {
        /**
         * This function modifies any default settings
         */
        initialize: function(override) {
            defaultSettings = _.merge(defaultSettings, override);
        },   
       
        /**
         * Retrieves the settings
         */
        getSettings: function() {
            return _.cloneDeep(defaultSettings);
        }
}

});