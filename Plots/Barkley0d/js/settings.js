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
            //secondaryPlot: "il",
        },
        plotSettings:{
        	Barkley: {
        		width: 437.5,
        		height: 240,
        		offset: new Point(0,0),
        		plots: {
        			mainPlot: {
        				range: new Point(-0.1, 1.1),
                        unitPerTick: new Point(30, .1),
                        labelFrequency: new Point(1, 1),
                        xAxis: "Time (ms)",
                        yAxis: " ",
                        labelPrecision: new Point(0, 1),
                        labelSize: new Point(0, 0),	
        			}

        		}
        	}
        }
    };

    return{

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
    