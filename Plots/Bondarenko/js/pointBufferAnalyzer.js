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
                v    : new Point(-85, 36),
                itos : new Point(0.7, 1.0),
                cass : new Point(-1001, 41),
                cajsr : new Point(130, 1300),
                cansr : new Point(600, 1315),
                ltrpn : new Point(11, 33),
                htrpn : new Point(125, 128),
                nai : new Point(999, 14260),
                ki : new Point(999, 143700),
            },            
            points: {
                
                //voltages               
                v : [],
                cai : [],
                cass : [],
                cajsr : [],
                cansr : [],
                ltrpn : [],
                htrpn : [],
                nai : [],
                ki : [],
                atof : [],
                itof : [],
                nks : [],
                atos : [],
                itos : [],
                aur : [],
                iur : [],
                xakss : [],
                xikss : [],
                ol : [], 
                ona : [],
                ok : [],
                pryr : [],
                po12 : [],
                
                //currents
                ical : [],
                ipca : [],
                inaca : [],
                icab : [],
                ina : [],
                inab : [],
                inak : [],
                iktof : [],
                iktos : [],
                ik1 : [],
                iks : [],
                ikur : [],
                ikss : [],
                ikr : [],
                iclca : []                
                //additional                            
            },
            
            minMaxPoints : {
                // min : x and max : y
                //volatge
                /*v    : new Point(1000, -10),
                itos : new Point(1000, -10),
                cass : new Point(-1000, -10),
                cajsr : new Point(1000, -10),
                cansr : new Point(1000, -10),
                ltrpn : new Point(1000, -10),
                htrpn : new Point(1000, -10),
                nai : new Point(1000, -10),
                ki  : new Point(1000, -10),*/
                               
                //currents
                ical :  new Point(1000, -10),
                ipca :  new Point(1000, -10),
                inaca :  new Point(1000, -10),
                icab :  new Point(1000, -10),
                ina :  new Point(1000, -10),
                inab :  new Point(1000, -10),
                inak :  new Point(1000, -10),
                iktof :  new Point(1000, -10),
                iktos :  new Point(1000, -10),
                ik1 :  new Point(1000, -10),
                iks :  new Point(1000, -10),
                ikur :  new Point(1000, -10),
                ikss :  new Point(1000, -10),
                ikr :  new Point(1000, -10),
                iclca :  new Point(1000, -10)
                                                       
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
            cai : [],
            cass : [],
            cajsr : [],
            cansr : [],
            ltrpn : [],
            htrpn : [],
            nai : [],
            ki : [],
            atof : [],
            itof : [],
            nks : [],
            atos : [],
            itos : [],
            aur : [],
            iur : [],
            xakss : [],
            xikss : [],
            ol : [], 
            ona : [],
            ok : [],
            pryr : [],
            po12 : [],
            
            //currents
            ical : [],
            ipca : [],
            inaca : [],
            icab : [],
            ina : [],
            inab : [],
            inak : [],
            iktof : [],
            iktos : [],
            ik1 : [],
            iks : [],
            ikur : [],
            ikss : [],
            ikr : [],
            iclca : []            
            //additional
                          
        };
        
        settings.calculationSettings.pointBuffer.minMaxPoints = {
            // min : x and max : y
            //volatge
           
            /*v    : new Point(1000, -10),
            itos : new Point(1000, -10),
            cass : new Point(-1000, -10),
            cajsr : new Point(1000, -10),
             cansr : new Point(1000, -10),
            ltrpn : new Point(1000, -10),
            htrpn : new Point(1000, -10),
            nai : new Point(1000, -10),
            ki  : new Point(1000, -10), */                      
            //currents
            ical :  new Point(1000, -10),
            ipca :  new Point(1000, -10),
            inaca :  new Point(1000, -10),
            icab :  new Point(1000, -10),
            ina :  new Point(1000, -10),
            inab :  new Point(1000, -10),
            inak :  new Point(1000, -10),
            iktof :  new Point(1000, -10),
            iktos :  new Point(1000, -10),
            ik1 :  new Point(1000, -10),
            iks :  new Point(1000, -10),
            ikur :  new Point(1000, -10),
            ikss :  new Point(1000, -10),
            ikr :  new Point(1000, -10),
            iclca :  new Point(1000, -10)                        
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
                    /*                   
                    bufferSettings.minMaxPoints[item]["x"] = (c[item] < bufferSettings.minMaxPoints[item]["x"]) ? c[item] : bufferSettings.minMaxPoints[item]["x"];
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
