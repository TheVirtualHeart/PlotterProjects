    define(["utility"],
    function PointBufferAnalyzer(utils) {
        "use strict";

        var count = 0;
        var bufferSettings;
        function initialize(settings) {
            var bufferSettings = {
                bufferSize: 100,
                normalPoints : {
                    v :  new Point(-90, 30),
                    cai: new Point(0.00005, 0.0008),
                    casr: new Point(0.15, 0.3),
                    ki : new Point(138.25, 138.32),
                    nai :new Point(11.56, 11.62)
                },                
                calcFunction: CALCULATE_SKIP,
                points: {

                    //voltages
                    cai: [],
                    casr: [],
                    ki: [],
                    nai: [],
                    sd: [],
                    sf: [],
                    sfca: [],
                    sg: [],
                    sh: [],                    
                    sj: [],
                    sm: [],
                    sr: [],
                    ss: [],
                    sxr1: [],
                    sxr2: [],
                    sxs: [],
                    v: [],

                    //currents
                    ibca: [],
                    ibna: [],
                    ical: [],
                    ik1: [],
                    ikr: [],
                    iks: [],
                    //ileak: [],
                    ina: [],
                    inaca: [],
                    inak: [],
                    ipca: [],
                    ipk: [],
                    //Irel: [],                    
                    ito: []
                             
                    },

                    minMaxPoints : {
                    // min : x and max : y
                    /*v:  new Point(1000, -10),
                    cai:  new Point(1000, -10),
                    casr: new Point(1000, -10),
                    ki: new Point(1000, -10),
                    nai: new Point(1000, -10),*/
                    //currents
                    ibca: new Point(1000, -10),
                    ibna: new Point(1000, -10),
                    ical: new Point(1000, -10),
                    ik1: new Point(1000, -10),
                    ikr: new Point(1000, -10),
                    iks: new Point(1000, -10),
                    //ileak: new Point(1000, -10),
                    ina: new Point(1000, -10),
                    inaca: new Point(1000, -10),
                    inak: new Point(1000, -10),
                    ipca: new Point(1000, -10),
                    ipk: new Point(1000, -10),
                    //Irel: new Point(1000, -10),
                    ito: new Point(1000, -10)
             
                }
            };

            if (!settings.calculationSettings.hasOwnProperty("pointBuffer")){
                settings.calculationSettings.pointBuffer = bufferSettings;
            } 
            else {
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
                    cai: [],
                    casr: [],
                    ki: [],
                    nai: [],
                    sd: [],
                    sf: [],
                    sfca: [],
                    sg: [],
                    sh: [],                    
                    sj: [],
                    sm: [],
                    sr: [],
                    ss: [],
                    sxr1: [],
                    sxr2: [],
                    sxs: [],
                    v: [],

                    //currents
                    ibca: [],
                    ibna: [],
                    ical: [],
                    ik1: [],
                    ikr: [],
                    iks: [],
                    //ileak: [],
                    ina: [],
                    inaca: [],
                    inak: [],
                    ipca: [],
                    ipk: [],
                    //Irel: [],                    
                    ito: []             
            };

            settings.calculationSettings.pointBuffer.minMaxPoints = {
                // min : x and max : y

                    /*v: new Point(1000, -10),
                    cai:  new Point(1000, -10),
                    casr: new Point(1000, -10),
                    ki: new Point(1000, -10),
                    nai: new Point(1000, -10),*/
                 //currents                    
                    ibca: new Point(1000, -10),
                    ibna: new Point(1000, -10),
                    ical: new Point(1000, -10),
                    ik1: new Point(1000, -10),
                    ikr: new Point(1000, -10),
                    iks: new Point(1000, -10),
                    //ileak: new Point(1000, -10),
                    ina: new Point(1000, -10),
                    inaca: new Point(1000, -10),
                    inak: new Point(1000, -10),
                    ipca: new Point(1000, -10),
                    ipk: new Point(1000, -10),
                    //Irel: new Point(1000, -10),
                    ito: new Point(1000, -10)
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

            // In each iteration a new point is added to each voltage dependant point

            if ( count % bufferSettings.bufferSize  === 0){
                c.voltageVariables.forEach(function(item){   

                    if(bufferSettings.normalPoints[item]){
                        // normalizing
                        /*bufferSettings.minMaxPoints[item]["x"] = (c[item] < bufferSettings.minMaxPoints[item]["x"]) ? c[item] : bufferSettings.minMaxPoints[item]["x"];
                        bufferSettings.minMaxPoints[item]["y"] = (c[item] > bufferSettings.minMaxPoints[item]["y"]) ? c[item] : bufferSettings.minMaxPoints[item]["y"]; */ 
                        
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
