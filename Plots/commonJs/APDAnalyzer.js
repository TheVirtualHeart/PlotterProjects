define(["utility"],
function APDAnalyzer(utils) {
    "use strict";
    
    var bufferSettings;
    var vInitial
    var vOld;
    var crossed;
    var count;
    // var upTime;
    // var up;
    
    
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
            vNormalize: new Point( -90 , 30),
            voltagePoint: "v"
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
     * Record the initial value of v
     */
    function preAggregate(settings) {
        vInitial = settings.calculationSettings[bufferSettings.voltagePoint];
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
        var vCur = settings.calculationSettings[bufferSettings.voltagePoint];
        
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
                var eventtime = c.timestep * (count - ((c[bufferSettings.voltagePoint] - c.apdPoints.threshhold)/(c[bufferSettings.voltagePoint] - vOld)));
                var vAvg = (c[bufferSettings.voltagePoint] + vOld) / 2;
                var vNorm = utils.normalize(vAvg, bufferSettings.vNormalize);
                var p = new Point(eventtime, vNorm);
                c.apdPoints.crossed.push(p);
                var tempIndex = 3;
            } else if (vOld >= c.apdPoints.threshhold && vCur < c.apdPoints.threshhold) {
                var eventtime = c.timestep * (count - ((c[bufferSettings.voltagePoint] - c.apdPoints.threshhold)/(c[bufferSettings.voltagePoint] - vOld)));
                var vAvg = (c[bufferSettings.voltagePoint] + vOld) / 2;
                var vNorm = utils.normalize(vAvg, bufferSettings.vNormalize);
                var p = new Point(eventtime, vNorm);
                c.apdPoints.crossed.push(p);
                var tempIndex = 2;
            }
        }
        if(c.apdPoints.crossed.length == 1){
            var index = tempIndex;
        }
        // determine whether or not the function has reached the value of s2
        // if so determine where the last "up" threshhold was.
        var s2Location;
            
        if(c.s1Start === undefined){
            s2Location = c.endTime;
            if(c.apdPoints.crossed.length == index && !crossed){
                var apdDistance = c.apdPoints.crossed[index] - c.apdPoints.crossed[index - 1];
                var diDistance = c.apdPoints.crossed[index - 1] - c.apdPoints.crossed[index - 2];
                var oneBeat = apdDistance + diDistance;
                var firstBeat = c.apdPoints.crossed[0];
                var lastBeat = (c.endTime - firstBeat) % oneBeat;
                s2Location = c.endTime - lastBeat; 
            }
            
        }
        else{
            s2Location = (c.s1 * (c.ns1 - 1) + c.s2) / c.timestep;
        }

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
        
        // log the current value of v
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

        if((c.s1Start === undefined) && c.apdPoints.crossed.length % 2 === 0 ){
            s2Index = c.apdPoints.crossed.length - 3;
        }
        else if (c.s1Start === undefined){
            s2Index = c.apdPoints.crossed.length - 2;
        }


        console.log(c.apdPoints.crossed.length, s2Index);
        if (c.apdPoints.crossed.length >= 3) {
            
            if (c.apdPoints.s2Point.y >= c.apdPoints.threshhold) {
                
                // calculate apd values
                c.apdPoints.apd.start = c.apdPoints.crossed[s2Index];
                c.apdPoints.apd.end = c.apdPoints.crossed[s2Index + 1];
                c.apdPoints.apd.length = (c.apdPoints.apd.end && c.apdPoints.apd.start) ?
                                (c.apdPoints.apd.end.x - c.apdPoints.apd.start.x) : 0;

                // calculate dl values
                c.apdPoints.dl.start = c.apdPoints.crossed[s2Index - 1];
                c.apdPoints.dl.end = c.apdPoints.crossed[s2Index];
                c.apdPoints.dl.length = (c.apdPoints.dl.end && c.apdPoints.dl.start) ?
                                (c.apdPoints.dl.end.x - c.apdPoints.dl.start.x) : 0;
            } else {
                
                // calculate apd values
                c.apdPoints.apd.start = c.apdPoints.crossed[s2Index + 1];
                c.apdPoints.apd.end = c.apdPoints.crossed[s2Index + 2];
                c.apdPoints.apd.length = (c.apdPoints.apd.end && c.apdPoints.apd.start) ?
                                    (c.apdPoints.apd.end.x - c.apdPoints.apd.start.x) : 0;
                
                // calculate dl values
                c.apdPoints.dl.start = c.apdPoints.crossed[s2Index];
                c.apdPoints.dl.end = c.apdPoints.crossed[s2Index + 1];
                c.apdPoints.dl.length = (c.apdPoints.dl.end && c.apdPoints.dl.start) ?
                                (c.apdPoints.dl.end.x - c.apdPoints.dl.start.x) : 0;
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

    function setSanodeDependants(updatedValues, settings){
      bufferSettings = settings.calculationSettings.apdPoints;
      if(updatedValues.normalPoints){
        for(var item in updatedValues.normalPoints){
            if(bufferSettings[item+"Normalize"]){
                bufferSettings[item+"Normalize"] = updatedValues.normalPoints[item];
            }
        }
      }

      if(updatedValues["threshholdPoint"]){
        for(var item in updatedValues["threshholdPoint"]){
            bufferSettings[item] = updatedValues["threshholdPoint"][item];
        }
      }

        

    }

    return {
        initialize: initialize,
        aggregate: aggregate,
        postAggregate: postAggregate,
        preAggregate: preAggregate,
        getSettings :  getSettings,
        setSanodeDependants: setSanodeDependants,
        reset: reset,
        analyzerName : "APDAnalyzer"
    }
})