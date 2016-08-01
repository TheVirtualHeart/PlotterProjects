    define(["utility"],
    function PointBufferAnalyzer(utils) {
        "use strict";

        var count = 0;
        var bufferSettings;
        function initialize(settings) {
            var bufferSettings = {
                bufferSize: 100,
                normalPoints : {
                    v :  new Point(-88, 52),
                    kss:  new Point(143, 146),
                    ki:  new Point(143, 146),
                    nass:  new Point(6, 8),
                    nai:  new Point(6, 8),
                    cajsr:  new Point(0.5, 2),
                    cansr:  new Point(1, 2),
                    cai : new Point(0.00007, 0.0002),
                    cass : new Point(0.00009, 0.003),                        
                    jrelnp : new Point(0.001, 0.2),
                    jrelp: new Point(0.001, 0.2),
                    camkt: new Point(0.000000003, 0.01)
                },                
                calcFunction: CALCULATE_SKIP,
                points: {

                    //voltages
                    v: [],
                    nai: [],
                    nass: [],
                    ki: [],
                    kss: [],
                    cai: [],
                    cass: [],
                    cansr: [],
                    cajsr: [],
                    xm: [],
                    xhf: [],
                    xhs: [],
                    xj: [],
                    xhsp: [],
                    xjp: [],
                    xml: [],
                    xhl: [],
                    xhlp: [],
                    xa: [],
                    xif: [],
                    xis: [],
                    xap: [],
                    xifp: [],
                    xisp: [],
                    xd: [],
                    xff: [],
                    xfs: [],
                    xfcaf: [],
                    xfcas: [],
                    xjca: [],
                    xnca: [],
                    xffp: [],
                    xfcafp: [],
                    xrf: [],
                    xrs: [],
                    xs1: [],
                    xs2: [],
                    xk1: [],
                    jrelnp: [],
                    jrelp: [],
                    camkt: [],
                    jnakna: [],
                    jnakk: [],
                    

                    //currents
                    ina: [],
                    inal: [],
                    ito: [],
                    ical: [],
                    icana: [],
                    icak: [],
                    ikr: [],
                    iks: [],
                    ik1: [],
                    inaca: [],
                    inak: [],
                    ikb: [],
                    inab: [],
                    icab: [],
                    ipca: []
                    
                             
                    },

                    minMaxPoints : {
                    // min : x and max : y
                    /*
                    v:  new Point(1000, -10), 
                    kss:  new Point(1000, -10),
                    ki:  new Point(1000, -10),
                    nass:  new Point(1000, -10),
                    nai:  new Point(1000, -10),
                    cajsr:  new Point(1000, -10),
                    cansr:  new Point(1000, -10),
                    cai : new Point(1000, -10),
                    cass : new Point(1000, -10),                        
                    jrelnp : new Point(1000, -10),
                    jrelp: new Point(1000, -10),
                    camkt: new Point(1000, -10),*/
                    //currents
                    ina: new Point(1000, -10),
                    inal: new Point(1000, -10),
                    ito: new Point(1000, -10),
                    ical: new Point(1000, -10),
                    icana: new Point(1000, -10),
                    icak: new Point(1000, -10),
                    ikr: new Point(1000, -10),
                    iks: new Point(1000, -10),
                    ik1: new Point(1000, -10),
                    inaca: new Point(1000, -10),
                    inak: new Point(1000, -10),
                    ikb: new Point(1000, -10),
                    inab: new Point(1000, -10),
                    icab: new Point(1000, -10),
                    ipca: new Point(1000, -10)                                     
             
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
                    v: [],
                    nai: [],
                    nass: [],
                    ki: [],
                    kss: [],
                    cai: [],
                    cass: [],
                    cansr: [],
                    cajsr: [],
                    xm: [],
                    xhf: [],
                    xhs: [],
                    xj: [],
                    xhsp: [],
                    xjp: [],
                    xml: [],
                    xhl: [],
                    xhlp: [],
                    xa: [],
                    xif: [],
                    xis: [],
                    xap: [],
                    xifp: [],
                    xisp: [],
                    xd: [],
                    xff: [],
                    xfs: [],
                    xfcaf: [],
                    xfcas: [],
                    xjca: [],
                    xnca: [],
                    xffp: [],
                    xfcafp: [],
                    xrf: [],
                    xrs: [],
                    xs1: [],
                    xs2: [],
                    xk1: [],
                    jrelnp: [],
                    jrelp: [],
                    camkt: [],
                    jnakna: [],
                    jnakk: [],
                                        

                    //currents
                    ina: [],
                    inal: [],
                    ito: [],
                    ical: [],
                    icana: [],
                    icak: [],
                    ikr: [],
                    iks: [],
                    ik1: [],
                    inaca: [],
                    inak: [],
                    ikb: [],
                    inab: [],
                    icab: [],
                    ipca: []
            };

            settings.calculationSettings.pointBuffer.minMaxPoints = {
                // min : x and max : y
                /*
                v:     new Point(1000, -1000),
                kss:  new Point(1000, -10),
                ki:    new Point(1000, -10),
                nass:  new Point(1000, -10),
                nai:   new Point(1000, -10),
                cajsr: new Point(1000, -10),
                cansr: new Point(1000, -10),
                cai : new Point(1000, -10),
                cass : new Point(1000, -10),                        
                jrelnp : new Point(1000, -10),
                jrelp: new Point(1000, -10),
                camkt: new Point(1000, -10),*/


                 //currents  
                ina: new Point(1000, -10),
                inal: new Point(1000, -10),
                ito: new Point(1000, -10),
                ical: new Point(1000, -10),
                icana: new Point(1000, -10),
                icak: new Point(1000, -10),
                ikr: new Point(1000, -10),
                iks: new Point(1000, -10),
                ik1: new Point(1000, -10),
                inaca: new Point(1000, -10),
                inak: new Point(1000, -10),
                ikb: new Point(1000, -10),
                inab: new Point(1000, -10),
                icab: new Point(1000, -10),
                ipca: new Point(1000, -10)                  
                    
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
                        /*                         
                        bufferSettings.minMaxPoints[item]["x"] = (c[item] < bufferSettings.minMaxPoints[item]["x"]) ? c[item] : bufferSettings.minMaxPoints[item]["x"];
                        bufferSettings.minMaxPoints[item]["y"] = (c[item] > bufferSettings.minMaxPoints[item]["y"]) ? c[item] : bufferSettings.minMaxPoints[item]["y"]; 
                        */  
                        bufferSettings.points[item].push(new Point(count * c.timestep, utils.normalize(c[item], bufferSettings.normalPoints[item])));                 
                    }
                    else{
                      bufferSettings.points[item].push(new Point(count * c.timestep, c[item]));   
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
