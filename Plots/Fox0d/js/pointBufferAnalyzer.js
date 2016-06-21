define(["utility"],
function PointBufferAnalyzer(utils) {
    "use strict";
    
    var count = 0;
    var bufferSettings;
    function initialize(settings) {
        var bufferSettings = {
            bufferSize: 100,
            calcFunction: CALCULATE_SKIP,
            points: {   
                v: [],
                ccasr: [],
                ccai: [],
                xfca: [],
                xd: [],
                xf: [],
                yto: [],
                xto: [],
                xks: [],
                xkr: [],
                xj: [],
                xh: [],
                xm: [],
                
                xina: [],
                xik1: [],
                xito: [],
                xikp: [],
                xinab: [],
                xiks: [],
                xica: [],
                xinaca: [],
                xipca: [],
                xicab: [],
                xicak: [],
                xinak: [],
                xikr: []
            }

            /*,
            minMaxPoints : {
                // min : x and max : y
                xina: new Point(1000, -10),
                xik1: new Point(1000, -10),
                xito: new Point(1000, -10),
                xikp: new Point(1000, -10),
                xinab: new Point(1000, -10),
                xiks: new Point(1000, -10),
                xica: new Point(1000, -10),
                xinaca: new Point(1000, -10),
                xipca: new Point(1000, -10),
                xicab: new Point(1000, -10),
                xicak: new Point(1000, -10),
                xinak: new Point(1000, -10),
                xikr: new Point(1000, -10)
            }*/
        };
        
        if (!settings.calculationSettings.hasOwnProperty("pointBuffer")) {
            settings.calculationSettings.pointBuffer = bufferSettings;
            } else {
            settings.calculationSettings.pointBuffer = utils.extend(bufferSettings, settings.calculationSettings.pointBuffer);
        }
    }
    
    /**
        * This function takes output from the calculator and 
        * performs the given aggregation function on it
    */
    function aggregate(data) {
        data.calculationSettings.pointBuffer.calcFunction(data);
        count++;
    }
    
    
    function reset(settings) {
        settings.calculationSettings.pointBuffer.points = {
            v: [],
            ccasr: [],
            ccai: [],
            xfca: [],
            xd: [],
            xf: [],
            yto: [],
            xto: [],
            xks: [],
            xkr: [],
            xj: [],
            xh: [],
            xm: [],
            
            xina: [],
            xik1: [],
            xito: [],
            xikp: [],
            xinab: [],
            xiks: [],
            xica: [],
            xinaca: [],
            xipca: [],
            xicab: [],
            xicak: [],
            xinak: [],
            xikr: []
            
        }
        count = 0;
    }
    
    
    /**
        * This function aggregates points by "skipping" the ones in the middle. The
        * function calls the calculator's calculateNext next function at each
        * iteration. When it comes to the end of a buffer, it logs the variables at
        * that point.
        * 
        * @param {FoxCalculator} calculator - the calculator that is used to
        * compute the variables. It does this by calling its calculateNext()
        * function
        * 
        * @param {Number} numPoints - the number of points that will be generated
        * as a result of this function
        * 
        * @param {Number} bufferSize - the size of the buffer in which points are
        * aggregated
    */
    function CALCULATE_SKIP(data) {
        
        var c    = data.calculationSettings;            
        
        // set page level variable bufferSettings 
        bufferSettings = data.calculationSettings.pointBuffer;
        
        // In each iteration a new point is added to each voltage dependant point
        c.voltageVariables.forEach(function(item){
            
            if(item == "v"){
                bufferSettings.points[item].push(
                new Point(count * c.timestep, 
                utils.normalize(c[item], new Point(-95, 43))));                            
            }
            else if(item == "ccasr"){
                bufferSettings.points[item].push(
                new Point(count * c.timestep, 
                utils.normalize(c[item], new Point(310, 325))));                            
            }
            else{
                bufferSettings.points[item].push(
                new Point(count * c.timestep, c[item]));
            }             
        });
        
        // In each iteration a new point is added to each current  point
        
        c.currentVariables.forEach(function(item){
            
            // here 'x' corresponds to minimum value
            // 'y' corresponds to maximum value 
            // bufferSettings.minMaxPoints[item]["x"] = (c[item] < bufferSettings.minMaxPoints[item]["x"]) ? c[item] : bufferSettings.minMaxPoints[item]["x"];
            // bufferSettings.minMaxPoints[item]["y"] = (c[item] > bufferSettings.minMaxPoints[item]["y"]) ? c[item] : bufferSettings.minMaxPoints[item]["y"];

            bufferSettings.points[item].push(
            new Point(count * c.timestep, c[item]));                    
        });              
    }

  /**
    * This function updates the object passed as a paremeter with the most recent
    * values of point buffer if it has a property called pointbuffer.
    *
    * @param {settings} - the object of which point buffer property needs to be updated.
    */
    function getSettings(settings){
         if (! settings.calculationSettings.hasOwnProperty("pointBuffer")) {           
            settings.calculationSettings.pointBuffer = {};
        }
        settings.calculationSettings.pointBuffer = utils.extend(settings.calculationSettings.pointBuffer, bufferSettings);
    }
    
    
    
    return {
        initialize: initialize,
        aggregate: aggregate,
        reset: reset,
        getSettings : getSettings
    }   
})    
