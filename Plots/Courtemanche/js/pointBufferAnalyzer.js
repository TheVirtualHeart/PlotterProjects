define(["utility"],
function PointBufferAnalyzer(utils) {
    "use strict";
    
    var count = 0;
    var bufferSettings;
    function initialize(settings) {
        var bufferSettings = {
            bufferSize: 100,                
            calcFunction: CALCULATE_SKIP,
            normalPoints :{
                v       : new Point(-90, 30),
                ccaup   : new Point(1.4, 1.8),
                ccarel  : new Point(0, 2),
                ccai    : new Point(0.0001, 0.0006),
            },            
            points: {
                
                //voltages
                v : [],                 
                xd : [],
                xf : [],
                xfca : [],
                xh : [],
                xj : [],
                xm : [],
                xoa : [],
                xoi : [],
                xr : [],
                xs : [],
                xu : [],
                xua : [],
                xui : [],
                xv : [],
                xw : [],
                
                //currents
                xbca: [],
                xbna: [],
                xcal: [],
                xk1: [],
                xkr: [],
                xks: [],
                xkur: [],
                xna: [],
                xnaca: [],
                xnak: [],
                xpca: [],
                xrel: [],
                xto: [],
                
                //additional
                ccai:[],
                ccarel:[],
                ccaup:[]                
            },
            
            minMaxPoints : {
                // min : x and max : y
                v : new Point(1000, -10),
                ccaup : new Point(1000, -10),
                ccarel : new Point(1000, -10),
                ccai : new Point(1000, -10),
                
                //currents
                xbca : new Point(1000, -10),
                xbna : new Point(1000, -10),
                xcal : new Point(1000, -10),
                xk1 : new Point(1000, -10),
                xkr : new Point(1000, -10),
                xks : new Point(1000, -10),
                xkur : new Point(1000, -10),
                xna : new Point(1000, -10),
                xnaca : new Point(1000, -10),
                xnak : new Point(1000, -10),
                xpca : new Point(1000, -10),
                xrel : new Point(1000, -10),
                xto : new Point(1000, -10)                
            }
        };
        
        if (!settings.calculationSettings.hasOwnProperty("pointBuffer")){
            settings.calculationSettings.pointBuffer = bufferSettings;
        } 
        else {
            // deepExtend (target, source) used copy  normalPoints
            settings.calculationSettings.pointBuffer = utils.deepExtend(bufferSettings, settings.calculationSettings.pointBuffer);
        }
    };
    
    /**
        * This function takes output from the calculator and 
        * performs the given aggregation function on it
    */
    function aggregate(data) {
        data.calculationSettings.pointBuffer.calcFunction(data);
        count++;
    }
    
    /**
        * This function resets the values
    */
    function reset(settings) {
        settings.calculationSettings.pointBuffer.points = {
            //voltages
            v : [],                 
            xd : [],
            xf : [],
            xfca : [],
            xh : [],
            xj : [],
            xm : [],
            xoa : [],
            xoi : [],
            xr : [],
            xs : [],
            xu : [],
            xua : [],
            xui : [],
            xv : [],
            xw : [],
            
            //currents
            xbca: [],
            xbna: [],
            xcal: [],
            xk1: [],
            xkr: [],
            xks: [],
            xkur: [],
            xna: [],
            xnaca: [],
            xnak: [],
            xpca: [],
            xrel: [],
            xto: [],  
            
            //additional
            ccai:[],
            ccarel:[],
            ccaup:[]                
        };
        
        settings.calculationSettings.pointBuffer.minMaxPoints = {
            // min : x and max : y
            
            v : new Point(1000, -10),
            ccaup : new Point(1000, -10),
            ccarel : new Point(1000, -10),
            ccai : new Point(1000, -10),
            
            //currents
            xbca : new Point(1000, -10),
            xbna : new Point(1000, -10),
            xcal : new Point(1000, -10),
            xk1 : new Point(1000, -10),
            xkr : new Point(1000, -10),
            xks : new Point(1000, -10),
            xkur : new Point(1000, -10),
            xna : new Point(1000, -10),
            xnaca : new Point(1000, -10),
            xnak : new Point(1000, -10),
            xpca : new Point(1000, -10),
            xrel : new Point(1000, -10),
            xto : new Point(1000, -10)     
        };  
        
        count = 0;
    }
    
    
    /**
        * This function aggregates points by "skipping" the ones in the middle. The
        * function calls the calculator's calculateNext next function at each
        * iteration. When it comes to the end of a buffer, it logs the variables at
        * that point.
        * 
        * @param {data} - consists of values of variables including currents to be bufferred 
    */
    function CALCULATE_SKIP(data) {
        
        var c    = data.calculationSettings;            
        
        // set page level variable bufferSettings 
        bufferSettings = data.calculationSettings.pointBuffer;
        
        if(count % bufferSettings.bufferSize === 0){
            
            // In each iteration a new point is added to each voltage dependant point
            c.voltageVariables.forEach(function(item){
                
                if(bufferSettings.normalPoints[item]){                    
                    /* Collecting minimum and maximum points
                        *  'x' corresponds to minimum value
                        *  'y' corresponds to maximum value 
                    */
                    bufferSettings.minMaxPoints[item]["x"] = (c[item] < bufferSettings.minMaxPoints[item]["x"]) ? c[item] : bufferSettings.minMaxPoints[item]["x"];
                    bufferSettings.minMaxPoints[item]["y"] = (c[item] > bufferSettings.minMaxPoints[item]["y"]) ? c[item] : bufferSettings.minMaxPoints[item]["y"]; 
                    
                    bufferSettings.points[item].push(new Point(count * c.timestep, utils.normalize(c[item], bufferSettings.normalPoints[item])));                
                }
                else{
                    
                    bufferSettings.points[item].push(new Point(count * c.timestep, c[item] ));             
                }                                
                
            });
            
            
            // In each iteration a new point is added to each current  point
            c.currentVariables.forEach(function(item){
               
                /* Collecting minimum and maximum points
                    *  'x' corresponds to minimum value
                    *  'y' corresponds to maximum value 
                */
                bufferSettings.minMaxPoints[item]["x"] = (c[item] < bufferSettings.minMaxPoints[item]["x"]) ? c[item] : bufferSettings.minMaxPoints[item]["x"];
                bufferSettings.minMaxPoints[item]["y"] = (c[item] > bufferSettings.minMaxPoints[item]["y"]) ? c[item] : bufferSettings.minMaxPoints[item]["y"]; 
                
                bufferSettings.points[item].push(new Point(count * c.timestep, c[item]));
            });
        }              
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
    
    /*
        * The module exposes functions 
        *   initialize
        *   aggregate
        *   reset
        *   getSettings
    */  
    return {
        initialize: initialize,
        aggregate: aggregate,
        reset: reset,
        getSettings : getSettings
    } 
    
});    
