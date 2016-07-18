define(["utility"],
function PointBufferAnalyzer(utils) {
    "use strict";
    
    var count = 0;
    var bufferSettings;
    function initialize(settings) {
        var bufferSettings = {
            bufferSize: 100,
            calcFunction: CALCULATE_SKIP,
            normalPoints : {
                v :  new Point(-90, 30),
                caitot  : new Point(0.02 , 0.03),
                cajsrtot : new Point(10, 11),
                cansr    : new Point(3.0, 3.5),
                nai      : new Point(9, 11),
                ki : new Point(139, 141),
                cajsr : new Point(2.5, 3.5),
                cai :  new Point(0.00019, 0.000199)
            },   
            points: {  
                //voltages 
                v        :[] ,
                cansr    : [],
                nai      : [],
                ki : [],
                d : [],
                f :[],
                m : [],
                h : [],
                j :  [],
                r :  [],
                to :  [],
                xr :  [],
                xs :  [],
                cajsr :[], 
                cai : [],
                
                //currents
                ik1   : [],
                inaca : [],
                inak : [],
                icab : [],
                inab : [],
                ina  : [],
                ica  : [],
                ito  : [], 
                ikr  : [],
                iks  : [] 
            },
            minMaxPoints : {
                // min : x and max : y
                /*v : new Point(1000, -10) ,
                    cansr    : new Point(1000, -10),
                    nai      : new Point(1000, -10),
                    ki : new Point(1000, -10),
                    cajsr : new Point(1000, -10),
                cai :  new Point(1000, -10),*/
                ik1 : new Point(1000, -10),
                inaca : new Point(1000, -10),
                inak : new Point(1000, -10),
                icab : new Point(1000, -10),
                inab : new Point(1000, -10),
                ina : new Point(1000, -10),
                ica : new Point(1000, -10),
                ito : new Point(1000, -10),
                ikr : new Point(1000, -10),
                iks : new Point(1000, -10)                
            }
        };
        
        if (!settings.calculationSettings.hasOwnProperty("pointBuffer")) {
            settings.calculationSettings.pointBuffer = bufferSettings;
            } else {
            settings.calculationSettings.pointBuffer = utils.deepExtend(bufferSettings, settings.calculationSettings.pointBuffer);
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
            //voltages 
            v        :[] ,
            cansr    : [],
            nai      : [],
            ki : [],
            d : [],
            f :[],
            m : [],
            h : [],
            j :  [],
            r :  [],
            to :  [],
            xr :  [],
            xs :  [],
            cajsr :[], 
            cai : [],
            //currents
            ik1   : [],
            inaca : [],
            inak : [],
            icab : [],
            inab : [],
            ina  : [],
            ica  : [],
            ito  : [],
            ikr  : [],
            iks  : []   
        },
        
        settings.calculationSettings.pointBuffer.minMaxPoints = {
            // min : x and max : y
            
            /*v : new Point(1000, -10) ,
                cansr    : new Point(1000, -10),
                nai      : new Point(1000, -10),
                ki : new Point(1000, -10),
                cajsr : new Point(1000, -10),
            cai :  new Point(1000, -10),*/
            ik1 : new Point(1000, -10),
            inaca : new Point(1000, -10),
            inak : new Point(1000, -10),
            icab : new Point(1000, -10),
            inab : new Point(1000, -10),
            ina : new Point(1000, -10),
            ica : new Point(1000, -10),
            ito : new Point(1000, -10),
            ikr : new Point(1000, -10),
            iks : new Point(1000, -10)   
        },
        
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
        
        if ( count % bufferSettings.bufferSize  === 0){
            // In each iteration a new point is added to each voltage dependant point
            
            c.voltageVariables.forEach(function(item){   
                //console.log(bufferSettings.normalPoints[item], item);
                if(bufferSettings.normalPoints[item]){
                    // normalizing
                    
                    /*bufferSettings.minMaxPoints[item]["x"] = (c[item] < bufferSettings.minMaxPoints[item]["x"]) ? c[item] : bufferSettings.minMaxPoints[item]["x"];
                        bufferSettings.minMaxPoints[item]["y"] = (c[item] > bufferSettings.minMaxPoints[item]["y"]) ? c[item] : bufferSettings.minMaxPoints[item]["y"]; 
                    */
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
    
    
    
    return {
        initialize: initialize,
        aggregate: aggregate,
        reset: reset,
        getSettings : getSettings
    }   
})    
