define(["utility"],
    function PointBufferAnalyzer(utils) {
        "use strict";
        
        var count = 0;
        var bufferSettings;
        function initialize(settings) {
            var bufferSettings = {
                bufferSize: 100,
                // This object normalPoints consists of all the variables that are to be normalized.
        		// the key is the variable name, value is a point which holds the minimum and maximum values of 
        		// that variable.
                normalPoints: {
                                v : new Point(-90,30)         
                            },
                calcFunction: CALCULATE_SKIP,
                points: {

                    //voltages
                    v:   [],
                    sdl: [],
                    sdt: [],
                    sy:  [],
                    sq:  [],
                    spaf:[],
                    spii:[],
                    sfl: [],
                    sft: [],
                    sr:  [],
                    sxs: [],
                    spas:[],
                    sm:  [],
                    sh1: [],
                    sh2: [],

                    //currents
                    ina:  [],
                    ibna: [],
                    ibca: [],
                    ibk:  [],
                    if:   [],
                    ikr:  [],
                    iks:  [],
                    inak: [],
                    ikp:  [],
                    ical: [],
                    ito:  [],
                    icat: [],
                    inaca:[]
                },
                minMaxPoints : {
                    // min : x and max : y
                    v:      new Point(1000, -10),

                    ina:  new Point(1000,-10),
                    ibna: new Point(1000,-10),
                    ibca: new Point(1000,-10),
                    ibk:  new Point(1000,-10),
                    if:   new Point(1000,-10),
                    ikr:  new Point(1000,-10),
                    iks:  new Point(1000,-10),
                    inak: new Point(1000,-10),
                    ikp:  new Point(1000,-10),
                    ical: new Point(1000,-10),
                    ito:  new Point(1000,-10),
                    icat: new Point(1000,-10),
                    inaca:new Point(1000,-10)  
                }
            };

            if (!settings.calculationSettings.hasOwnProperty("pointBuffer")) {
                settings.calculationSettings.pointBuffer = bufferSettings;
            } else {
                settings.calculationSettings.pointBuffer = 
                    utils.deepExtend(bufferSettings, settings.calculationSettings.pointBuffer);
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
                v:   [],
                sdl: [],
                sdt: [],
                sy:  [],
                sq:  [],
                spaf:[],
                spii:[],
                sfl: [],
                sft: [],
                sr:  [],
                sxs: [],
                spas:[],
                sm:  [],
                sh1: [],
                sh2: [],

                //currents
                ina:  [],
                ibna: [],
                ibk:  [],
                ibca: [],
                if:   [],
                ikr:  [],
                iks:  [],
                inak: [],
                ikp:  [],
                ical: [],
                ito:  [],
                icat: [],
                inaca:[]
            };

            settings.calculationSettings.pointBuffer.minMaxPoints = {
                
                // min : x and max : y
                v:    new Point(1000, -10),

                ina:  new Point(1000,-10),
                ibna: new Point(1000,-10),
                ibca: new Point(1000,-10),
                ibk:  new Point(1000,-10),
                if:   new Point(1000,-10),
                ikr:  new Point(1000,-10),
                iks:  new Point(1000,-10),
                inak: new Point(1000,-10),
                ikp:  new Point(1000,-10),
                ical: new Point(1000,-10),
                ito:  new Point(1000,-10),
                icat: new Point(1000,-10),
                inaca:new Point(1000,-10)    
            };
            count = 0;
        }    
        
        /**
        * This function aggregates points by "skipping" the ones in the middle. The
        * function calls the calculator's calculateNext next function at each
        * iteration. When it comes to the end of a buffer, it logs the variables at
        * that point.
        * 
        * @param {data} - A settings variable which has all the voltages and currents
        *                 values updated for one iteration.
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
                            new Point(count * c.timestep, c[item]));                               
                    }
                });

                // In each iteration a new point is added to each current  point
                
                c.currentVariables.forEach(function(item){   

                    // here 'x' corresponds to minimum value
                    // 'y' corresponds to maximum value 
                    bufferSettings.minMaxPoints[item]["x"] = (c[item] < bufferSettings.minMaxPoints[item]["x"]) ? c[item] : bufferSettings.minMaxPoints[item]["x"];
                    bufferSettings.minMaxPoints[item]["y"] = (c[item] > bufferSettings.minMaxPoints[item]["y"]) ? c[item] : bufferSettings.minMaxPoints[item]["y"];
                     
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


        function setSanodeDependants(updatedValues, settings){
          bufferSettings = settings.calculationSettings.pointBuffer;
          if(updatedValues.normalPoints){
            for(var item in updatedValues.normalPoints){
                if(bufferSettings.normalPoints[item]){
                    bufferSettings.normalPoints[item] = updatedValues.normalPoints[item];
                }
            }
          }

        }

    return {
        initialize: initialize,
        aggregate: aggregate,
        reset: reset,
        getSettings : getSettings,
        setSanodeDependants: setSanodeDependants
    }   
});    
  