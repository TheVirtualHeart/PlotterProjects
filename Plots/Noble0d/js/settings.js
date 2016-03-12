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
            v: -80.0,
            m: 0.0,
            h: 1.0,
            n: 0.0,

            ik: 0,
            ina: 0, 
            il: 0,

            cm: 12,
            gan: 0.0,
            gkMod: 1.2,
            ean: -60,
            stimmag: -106,
            stimdur: 2.0,
            gna1: 400.0,
            gna2: 0.14,
            s1Start: 0,
            s2: 1000,
            ns1: 4,
            s1: 500.0,
            timestep: 0.01
        },
        formSettings: {
            displayV: false,
            displayM: false,
            displayH: false,
            displayN: false,
            displayS1S2: "checked",
            secondaryPlot: "il",
        }
	};

    
    return {
        
        /**
         * This function modifies any default settings
         */
        initialize: function(override) {
            // var source = override;
            // if (source !== undefined && source !== null) {
            //     for (var nextKey in source) {
            //         if (source.hasOwnProperty(nextKey) && defaultSettings.hasOwnProperty(nextKey)) {
            //             defaultSettings[nextKey] = source[nextKey];
            //         }
            //     }
            // }
            defaultSettings = utils.extend(defaultSettings, override);
        },   
        
        
        
        /**
         * Retrieves the settings
         */
        getSettings: function() {
            //return utils.extend({}, defaultSettings);
            return utils.deepCopy(defaultSettings);
        }
    }
    
});