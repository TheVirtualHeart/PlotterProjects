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
                    v:     new Point(-90,30),       cp:   new Point(0.753,14.759),  cs:    new Point(0,6),         
                    ci:    new Point(0.26,1.25),    cj :  new Point(64 , 112),      cjp:   new Point(78,106),
                    xir:   new Point(0.0033,1.31),  xnai: new Point(12.28,12.31),   tropi: new Point(22.34,46.62),
                    trops: new Point(21.04,63.52)
                },
                calcFunction: CALCULATE_SKIP,
                points: {

                    //voltages
                    v:     [],  m:     [],  h:      [], j:      [],  xr: [],
                    xs1:   [],  xs2:   [],  xtos:   [], ytos:   [], 
                    xtof:  [],  ytof:  [],  cp:     [], cs:     [],   
                    ci:    [],  cj:    [],  cjp:    [], xir:    [],  
                    xnai:  [], tropi:  [],  trops:  [], po:     [],

                    // currents
                    inaca:  [], ica:    [], iks: [], ikr:   [],
                    itof:   [], itos:   [], ik1: [], ina:    [],
                    inak:   [],  

                },
                minMaxPoints : {
                    // min : x and max : y
                    
                    /*v:      new Point(1000, -10),
                    cp:     new Point(1000, -10),
                    cs:     new Point(1000, -10),
                    ci:     new Point(1000, -10),
                    cj:     new Point(1000, -10),
                    cjp:    new Point(1000, -10),
                    xir:    new Point(1000, -10),
                    xnai:   new Point(1000, -10),
                    tropi:  new Point(1000, -10),
                    trops:  new Point(1000, -10),*/
                    
                    inaca:  new Point(1000, -10),
                    itof:   new Point(1000, -10),
                    ina:    new Point(1000, -10),
                    idif:   new Point(1000, -10),
                    inacaq: new Point(1000, -10),
                    ica:    new Point(1000, -10),
                    itos:   new Point(1000, -10),
                    inak:   new Point(1000, -10),
                    jsr:    new Point(1000, -10),
                    iks:    new Point(1000, -10),
                    ito:    new Point(1000, -10),
                    iup:    new Point(1000, -10),
                    jca:    new Point(1000, -10),
                    ikr:    new Point(1000, -10),
                    ik1:    new Point(1000, -10),
                    ileak:  new Point(1000, -10),
                    icaq:   new Point(1000, -10),

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
                v:     [],  m:     [],  h:      [], j:      [],  xr: [],
                xs1:   [],  xs2:   [],  xtos:   [], ytos:   [], 
                xtof:  [],  ytof:  [],  cp:     [], cs:     [],   
                ci:    [],  cj:    [],  cjp:    [], xir:    [],  
                xnai:  [], tropi:  [],  trops:  [], po:     [], 

                // currents
                inaca:  [], ica:    [], iks: [], ikr:   [],
                itof:   [], itos:   [], ik1: [], ina:    [],
                inak:   [],  
            };
            settings.calculationSettings.pointBuffer.minMaxPoints = {
                    // min : x and max : y
                    
                    /*v:      new Point(1000, -10),
                    cp:     new Point(1000, -10),
                    cs:     new Point(1000, -10),
                    ci:     new Point(1000, -10),
                    cj:     new Point(1000, -10),
                    cjp:    new Point(1000, -10),
                    xir:    new Point(1000, -10),
                    xnai:   new Point(1000, -10),
                    tropi:  new Point(1000, -10),
                    trops:  new Point(1000, -10),*/
                    
                    inaca:  new Point(1000, -10),
                    itof:   new Point(1000, -10),
                    ina:    new Point(1000, -10),
                    idif:   new Point(1000, -10),
                    inacaq: new Point(1000, -10),
                    ica:    new Point(1000, -10),
                    itos:   new Point(1000, -10),
                    inak:   new Point(1000, -10),
                    jsr:    new Point(1000, -10),
                    iks:    new Point(1000, -10),
                    ito:    new Point(1000, -10),
                    iup:    new Point(1000, -10),
                    jca:    new Point(1000, -10),
                    ikr:    new Point(1000, -10),
                    ik1:    new Point(1000, -10),
                    ileak:  new Point(1000, -10),
                    icaq:   new Point(1000, -10),

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
                        // bufferSettings.minMaxPoints[item]["x"] = (c[item] < bufferSettings.minMaxPoints[item]["x"]) ? c[item] : bufferSettings.minMaxPoints[item]["x"];
                        // bufferSettings.minMaxPoints[item]["y"] = (c[item] > bufferSettings.minMaxPoints[item]["y"]) ? c[item] : bufferSettings.minMaxPoints[item]["y"];

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

