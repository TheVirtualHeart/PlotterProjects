define(["utility"],
function APDAnalyzer(utils) {
    "use strict";
    
    var bufferSettings;
    var vInitial
    var vOld;
    var crossed;
    var count;
    
    
    /**
     * Initialize the Analyzer
     */
    function initialize(settings) {
        count = 0;
        crossed = false;
        bufferSettings = {
            threshhold: 0,
            crossed: [],
            s2Point: null,
            apd: {
                start: null,
                end: null,
                length: null,
            },
            dl: {
                start: null,
                end: null,
                length: null,
            },
            vNormalize: new Point( -90 , 30)
        };
        if (!settings.calculationSettings.hasOwnProperty("apdPoints")) {
            settings.calculationSettings.apdPoints = bufferSettings;
        } else {
            settings.calculationSettings.apdPoints = utils.extend(bufferSettings, settings.calculationSettings.apdPoints);
        }
    }
    
    
    /**
     * This function is called before the calculations are performed
     * 
     * Record the initial value of V
     */
    function preAggregate(settings) {
        vInitial = settings.calculationSettings.v;
    }
    
    
    /**
     * This function takes output from the calculator and 
     * performs the given aggregation function on it.
     * 
     * Given point data, calculate whether the point crosses the
     * threshhold. Determine whether it is crossing above or below
     * the threshhold and then log where that crossing occurred. 
     * log the point. 
     */
    function aggregate(settings) {
        var c = settings.calculationSettings; 
        var vCur = settings.calculationSettings.v;
        
        // pointing reference to buffersettings
        bufferSettings = c.apdPoints;
        // console.dir(bufferSettings);
        
        // if (bufferSettings.hasOwnProperty("vMin")){
        //     vMin = bufferSettings.vMin;
        //     vMax = bufferSettings.vMax;
        // }
        // edge case. There should not be an initial value
        // of v to check against. We must wait until after
        // the first pass
        if (count > 0) {

            if (vOld <= c.apdPoints.threshhold && vCur > c.apdPoints.threshhold) {
                var eventtime = c.timestep * (count - ((c.v - c.apdPoints.threshhold)/(c.v - vOld)));
                var vAvg = (c.v + vOld) / 2;
                var vNorm = utils.normalize(vAvg, bufferSettings.vNormalize);
                var p = new Point(eventtime, vNorm);
                c.apdPoints.crossed.push(p);
            } else if (vOld >= c.apdPoints.threshhold && vCur < c.apdPoints.threshhold) {
                var eventtime = c.timestep * (count - ((c.v - c.apdPoints.threshhold)/(c.v - vOld)));
                var vAvg = (c.v + vOld) / 2;
                var vNorm = utils.normalize(vAvg, bufferSettings.vNormalize);
                var p = new Point(eventtime, vNorm);
                c.apdPoints.crossed.push(p);
            }
        }
        
        // determine whether or not the function has reached the value of s2
        // if so determine where the last "up" threshhold was.
        var s2Location = ((c.s1 * (c.ns1-1) + c.s2)) / c.timestep;
        if (count >= s2Location && !crossed) {
            c.apdPoints.s2Point = new Point(s2Location * c.timestep, vCur);
            crossed = true;
            
            // if (c.apdPoints.crossed.length > 0) {
            //     c.apdPoints.apd.start = c.apdPoints.crossed[c.apdPoints.crossed.length - 1];
            //     c.apdPoints.dl.end = c.apdPoints.crossed[c.apdPoints.crossed.length - 1];
            // }
            
            // // determine where the last down was before that
            // if (c.apdPoints.crossed.length > 0) {
            //     c.apdPoints.dl.start = c.apdPoints.crossed[c.apdPoints.crossed.length - 2];
            // }
        }
        
        // log the current value of V
        vOld = vCur;
        count++;
    }
    
    
    /**
     * After tracking all of the times the apd crossed the threshold
     * calculate the APD and DI values
     */
    function postAggregate(settings) {
        var c = settings.calculationSettings;

        // pointing reference to buffersettings
        bufferSettings = c.apdPoints;
        var s2Index = 0;
        var s2 = c.apdPoints.s2Point;
        for (var i = 0; i < c.apdPoints.crossed.length; i++) {
            var cur = c.apdPoints.crossed[i];
            if (cur.x < s2.x) {
                s2Index++;
            }
        }
        
        // account for an initial crossover from a low initial value of v
        console.log(vInitial);
        console.log(c.apdPoints.threshhold);
        if (vInitial < c.apdPoints.threshhold) {
            console.log(vInitial);
            s2Index--;
        }
        

        console.log(c.apdPoints.crossed.length);
        if (c.apdPoints.crossed.length >= 3) {
            if (c.apdPoints.s2Point.y >= c.apdPoints.threshhold) {
                // calculate apd values
                c.apdPoints.apd.start = c.apdPoints.crossed[s2Index];
                c.apdPoints.apd.end = c.apdPoints.crossed[s2Index + 1];
                c.apdPoints.apd.length = c.apdPoints.apd.end.x - c.apdPoints.apd.start.x;

                // calculate dl values
                c.apdPoints.dl.start = c.apdPoints.crossed[s2Index - 1];
                c.apdPoints.dl.end = c.apdPoints.crossed[s2Index];
                c.apdPoints.dl.length = c.apdPoints.dl.end.x - c.apdPoints.dl.start.x;
                console.log(c.apdPoints.dl.length);
            } else {
                // calculate apd values
                c.apdPoints.apd.start = c.apdPoints.crossed[s2Index + 1];
                c.apdPoints.apd.end = c.apdPoints.crossed[s2Index + 2];
                c.apdPoints.apd.length = c.apdPoints.apd.end.x - c.apdPoints.apd.start.x;
                
                // calculate dl values
                c.apdPoints.dl.start = c.apdPoints.crossed[s2Index];
                c.apdPoints.dl.end = c.apdPoints.crossed[s2Index + 1];
                c.apdPoints.dl.length = c.apdPoints.dl.end.x - c.apdPoints.dl.start.x;
                console.log(c.apdPoints.dl.length);
            }
        }
    }
    
    
    /**
     * Reset the analyzer
     */
    function reset(settings) {
        count = 0;
        crossed = false;
        settings.calculationSettings.apdPoints.crossed = [];
        settings.calculationSettings.apdPoints.s2Point = null;
        settings.calculationSettings.apdPoints.apd = {
            start: null,
            end: null,
            length: null,
        };
        settings.calculationSettings.apdPoints.dl = {
            start: null,
            end: null,
            length: null,
        };
    }


    function getSettings(settings){
        if (!settings.calculationSettings.hasOwnProperty("apdPoints")) {
            settings.calculationSettings.apdPoints = {};
        }                  
        settings.calculationSettings.apdPoints = utils.extend(settings.calculationSettings.apdPoints, bufferSettings);         
    }
    
    
    return {
        initialize: initialize,
        aggregate: aggregate,
        postAggregate: postAggregate,
        preAggregate: preAggregate,
        getSettings :  getSettings,
        reset: reset
    }
})