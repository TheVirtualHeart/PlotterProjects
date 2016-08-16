define(["utility"],
function S1S2Analyzer(utils) {
    "use strict";
    
    var bufferSettings;
    function initialize(settings) {
        var bufferSettings = {
            s1: [],
            s2: null
        };
        
        if (!settings.calculationSettings.hasOwnProperty("s1s2Points")) {
            settings.calculationSettings.s1s2Points = bufferSettings;
        } else {
            settings.calculationSettings.s1s2Points = utils.extend(bufferSettings, settings.calculationSettings.s1s2Points);
        }
    }
    
    
    /**
     * This function takes output from the calculator and 
     * performs the given aggregation function on it
     */
    function aggregate(data) {
        var c = data.calculationSettings;

        bufferSettings = c.s1s2Points;
        
        // create an array of all s1 values
        var s1Array = [];
        for (var i = 0; i < c.ns1; i++) {
            var xLoc = c.s1Start + (i * c.s1);
            s1Array[i] = new Point(xLoc, 0);
        }
        
        // log the s2 location
        var xLoc = c.s1Start + ((c.ns1-1) * c.s1) + c.s2;
        var s2Point = new Point(xLoc, 0);
        
        // log the data
        data.calculationSettings.s1s2Points = {
            s1: s1Array,
            s2: s2Point
        };
    }
    
    
    function reset(settings) {
        settings.calculationSettings.s1s2Points.points = {
            s1: [],
            s2: null
        };
    }

    function getSettings(settings){
        if (!settings.calculationSettings.hasOwnProperty("s1s2Points")) {
                    settings.calculationSettings.s1s2Points = {};
                } 
        settings.calculationSettings.s1s2Points = utils.extend(settings.calculationSettings.s1s2Points, bufferSettings);
    }
    
    
    return {
        initialize: initialize,
        aggregate: aggregate,
        getSettings:  getSettings,
        reset: reset,
        analyzerName : "S1S2Analyzer"
    }
})