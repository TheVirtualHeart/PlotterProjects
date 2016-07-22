define(["utility"],
    function PointBufferAnalyzer(utils) {
        "use strict";
        
        var count = 0;
        var bufferSettings;
        function initialize(settings) {
            var bufferSettings = {
                bufferSize: 100,
                // This object normalPoints consists of all the variables that are to be normalized.
                // the key is the variable name, value is a point which holds the minimum and maximum values 
                // of that variable.
                normalPoints: {
                    v         : new Point(-90,30),        cai       : new Point(0.00008,0.00047),
                    cajsr     : new Point(0.17,1.27),     camkactive: new Point(0.00,0.05),
                    camktrap  : new Point(0.00,0.014),    nai       : new Point(9.87,9.90),
                    cansr     : new Point(1.27,1.36),     car       : new Point(0.00,0.029),
                    cli       : new Point(18.89,18.90),   ki        : new Point(141.98,142.016),
                    xdpower   : new Point(1,9)
                },
                calcFunction: CALCULATE_SKIP,
                points: {

                    //voltages
                    v: [],       cai: [],   cajsr: [],  camkactive: [],
                    camktrap: [],cansr: [], car: [],    cli: [],
                    ki: [],    nai: [],    xa: [],
                    xaa: [],     xd: [],    xdpower: [],xf: [],
                    xf2: [],     xfca: [],  xfca2: [],  xh: [],     
                    xhl: [],     xi: [],    xi2: [],    xj: [],
                    xm: [],      xml: [],   xr: [],     xri: [],
                    xro: [],     xs1: [],   xs2: [],         

                    //currents
                    icab: [],   icalca: [],   iclb: [],   ik1: [],
                    ikp: [],    ikr: [],    iks: [],    ina: [],
                    inaca: [],  inak: [],   inal: [],   ipca: [],
                    ito1: [],   ito2: []
                },
                minMaxPoints : {
                    // min : x and max : y
                    
                    v: new Point(1000, -10),
                    cai: new Point(1000, -10),
                    cajsr: new Point(1000, -10),
                    camkactive: new Point(1000, -10),
                    camktrap: new Point(1000, -10),
                    cansr: new Point(1000, -10),
                    car: new Point(1000, -10),
                    cli: new Point(1000, -10),
                    nai: new Point(1000, -10),
                    ki: new Point(1000, -10),
                    xdpower: new Point(1000, -10),

                    icab: new Point(1000, -10),
                    icalca: new Point(1000, -10),
                    iclb: new Point(1000, -10),
                    ik1: new Point(1000, -10),
                    ikp: new Point(1000, -10),
                    ikr: new Point(1000, -10),
                    iks: new Point(1000, -10),
                    ina: new Point(1000, -10),
                    inaca: new Point(1000,-10),
                    inak: new Point(1000, -10),
                    inal: new Point(1000, -10),
                    ipca: new Point(1000, -10),
                    ito1: new Point(1000, -10),
                    ito2: new Point(1000, -10)
                }
            };
            
            if (!settings.calculationSettings.hasOwnProperty("pointBuffer")) {
                settings.calculationSettings.pointBuffer = bufferSettings;
            } else {
                    settings.calculationSettings.pointBuffer = 
                    utils.deepExtend(bufferSettings,settings.calculationSettings.pointBuffer);
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
                v: [],       cai: [],   cajsr: [],  camkactive: [],
                camktrap: [],cansr: [], car: [],    cli: [],
                ki: [],      nai: [],   xa: [],
                xaa: [],     xd: [],    xdpower: [],xf: [],
                xf2: [],     xfca: [],  xfca2: [],  xh: [],     
                xhl: [],     xi: [],    xi2: [],    xj: [],
                xm: [],      xml: [],   xr: [],     xri: [],
                xro: [],     xs1: [],   xs2: [],         

                //currents
                icab: [],   icalca: [],   iclb: [],   ik1: [],
                ikp:  [],   ikr:  [],   iks:  [],   ina: [],
                inaca:[],   inak: [],   inal: [],   ipca:[],
                ito1: [],   ito2: []
            };
            
            settings.calculationSettings.pointBuffer.minMaxPoints = {
                    // min : x and max : y
                v: new Point(1000, -10),
                cai: new Point(1000, -10),
                cajsr: new Point(1000, -10),
                camkactive: new Point(1000, -10),
                camktrap: new Point(1000, -10),
                cansr: new Point(1000, -10),
                car: new Point(1000, -10),
                cli: new Point(1000, -10),
                nai: new Point(1000, -10),
                ki: new Point(1000, -10),
                xdpower: new Point(1000, -10),

                icab: new Point(1000, -10),
                icalca: new Point(1000, -10),
                iclb: new Point(1000, -10),
                ik1: new Point(1000, -10),
                ikp: new Point(1000, -10),
                ikr: new Point(1000, -10),
                iks: new Point(1000, -10),
                ina: new Point(1000, -10),
                inaca: new Point(1000,-10),
                inak: new Point(1000, -10),
                inal: new Point(1000, -10),
                ipca: new Point(1000, -10),
                ito1: new Point(1000, -10),
                ito2: new Point(1000, -10),
            };
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
            
            if ( count % bufferSettings.bufferSize  === 0) {
            
                // In each iteration a new point is added to each voltage dependant point
                c.voltageVariables.forEach(function(item){
                    if ( bufferSettings.normalPoints[item]){
                        bufferSettings.minMaxPoints[item]["x"] = (c[item] < bufferSettings.minMaxPoints[item]["x"]) ? c[item] : bufferSettings.minMaxPoints[item]["x"];
                        bufferSettings.minMaxPoints[item]["y"] = (c[item] > bufferSettings.minMaxPoints[item]["y"]) ? c[item] : bufferSettings.minMaxPoints[item]["y"];

                        bufferSettings.points[item].push( new Point(count * c.timestep, 
                                                utils.normalize(c[item], bufferSettings.normalPoints[item])));
                    }
                    else{
                    bufferSettings.points[item].push(
                            new Point(count * c.timestep, c[item]));                               }
                });

                // In each iteration a new point is added to each current  point
                
                c.currentVariables.forEach(function(item){   

                    // here 'x' corresponds to minimum value
                    // 'y' corresponds to maximum value 
                    bufferSettings.minMaxPoints[item]["x"] = (c[item] < bufferSettings.minMaxPoints[item]["x"]) ? 
                                    c[item] : bufferSettings.minMaxPoints[item]["x"];
                    bufferSettings.minMaxPoints[item]["y"] = (c[item] > bufferSettings.minMaxPoints[item]["y"]) ?
                                    c[item] : bufferSettings.minMaxPoints[item]["y"];
                     
                    bufferSettings.points[item].push(
                        new Point(count * c.timestep, c[item]));                    
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
});    
