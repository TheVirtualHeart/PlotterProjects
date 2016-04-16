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
            displayAPDDI: false,
            displayV: false,
            displayM: false,
            displayH: false,
            displayN: false,
            displayS1S2: false,
            secondaryPlot: "il",
        },
        plotSettings: {
            Noble: {
                width: 437.5,
                height: 240,
                offset: new Point(0, 0),
                plots: {
                    mainPlot: {
                        range: new Point(-0.1, 1.1),
                        unitPerTick: new Point(1000, .1),
                        labelFrequency: new Point(1, 1),
                        xAxis: "Time (ms)",
                        yAxis: "V (mv)",
                        labelPrecision: new Point(0, 1),
                        labelSize: new Point(0, 0),
                    }
                }
            },
            NobleOther: {
                width: 437.5,
                height: 240,
                offset: new Point(0, 300),
                plots: {
                    ik: {
                        range: new Point(10, 60),
                        unitPerTick: new Point(1000, 10),
                        labelFrequency: new Point(1, 1),
                        xAxis: "Time (ms)",
                        yAxis: "ik",
                        labelPrecision: new Point(0, 0),
                    },
                    ina: {
                        range: new Point(-60, 0),
                        unitPerTick: new Point(1000, 5),
                        labelFrequency: new Point(1, 1),
                        xAxis: "Time (ms)",
                        yAxis: "ina",
                        labelPrecision: new Point(0, 0),
                    },
                    il: {
                        default: true,
                        range: new Point(-100, 100),
                        unitPerTick: new Point(1000, 20),
                        labelFrequency: new Point(1, 1),
                        xAxis: "Time (ms)",
                        yAxis: "il",
                    }
                }
            }
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
            defaultSettings = _.merge(defaultSettings, override);
        },   
        
        
        
        /**
         * Retrieves the settings
         */
        getSettings: function() {
            //return utils.extend({}, defaultSettings);
            return _.cloneDeep(defaultSettings);
        }
    }
    
});