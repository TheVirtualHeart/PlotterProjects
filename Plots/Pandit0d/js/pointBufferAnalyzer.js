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
                    v :     new Point(-90,30),          nai :  new Point(10.73,10.80),
                    ki:     new Point(139.15,139.27),   cai:   new Point(0.00008,0.0006),
                    cajsr:  new Point(0.0389,0.0988),   cansr: new Point(0.0424,0.0998),
                    cass:   new Point(0.00008, 0.02807),y:      new Point(0.0028,0.0036),
                    htrpn:  new Point(0.139,0.140),     ltrpn: new Point(0.0051,0.0248)
                    
                },
                calcFunction: CALCULATE_SKIP,
                points: {

                    //voltages
                    v:     [],  m:       [],    h:  [], j:   [],    d:    [],   f11: [],
                    f12:   [],  cainact: [],    r:  [], s:   [],    sslow:[],   rss: [],
                    sss:   [],  y:       [],    nai:[], ki:  [],    cai:  [],   cansr: [],
                    cass:  [],  cajsr:   [],    po: [], pc1: [],    pc2:  [],
                    ltrpn: [],  htrpn:    [],

                    //currents
                    ik1: [],  ibna: [],  inak: [], if: [],  ibca: [], ibk:[],
                    icap: [], inaca: [], ina:  [], ical: [], iss: [], it: []

                },

                minMaxPoints : {
                    // min : x and max : y
                
                    /*v:      new Point(1000,-1000),
                    nai :   new Point(1000,-10),
                    ki:     new Point(1000,-1000), 
                    cai:    new Point(1000,-1000),
                    htrpn:  new Point(1000,-1000),
                    ltrpn:  new Point(1000,-1000),
                    y:      new Point(1000,-1000),
                    sss:    new Point(1000,-1000),
                    cansr:  new Point(1000,-1000),
                    cass:   new Point(1000,-1000),
                    cajsr:  new Point(1000,-1000),*/

                    ik1:    new Point(1000,-1000),
                    if:     new Point(1000,-1000),
                    ibna:   new Point(1000,-1000),
                    inak:   new Point(1000,-1000),
                    ibk:    new Point(1000,-1000),
                    ibca:   new Point(1000,-1000),
                    icap:   new Point(1000,-1000),
                    inaca:  new Point(1000,-1000),
                    ina:    new Point(1000,-1000),
                    ical:   new Point(1000,-1000),
                    it:     new Point(1000,-1000),
                    iss:    new Point(1000,-1000),
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
                v:     [],  m:       [],    h:  [], j:   [],    d:    [],   f11: [],
                f12:   [],  cainact: [],    r:  [], s:   [],    sslow:[],   rss: [],
                sss:   [],  y:       [],    nai:[], ki:  [],    cai:  [],   cansr: [],
                cass:  [],  cajsr:   [],    po: [], pc1: [],    pc2: [],
                ltrpn: [],  htrpn:   [],

                //currents
                ik1: [],  ibna: [],  inak: [], if: [],  ibca: [], ibk:[],
                icap: [], inaca: [], ina:  [], ical: [], iss: [], it: []
            };
            settings.calculationSettings.pointBuffer.minMaxPoints = {
                // min : x and max : y
                
                /*v:      new Point(1000,-1000),
                nai :   new Point(1000,-10),
                ki:     new Point(1000,-1000), 
                cai:    new Point(1000,-1000),
                htrpn:  new Point(1000,-1000),
                ltrpn:  new Point(1000,-1000),
                y:      new Point(1000,-1000),
                sss:    new Point(1000,-1000),
                cansr:  new Point(1000,-1000),
                cass:   new Point(1000,-1000),
                cajsr:  new Point(1000,-1000),*/

                ik1:    new Point(1000,-1000),
                if:     new Point(1000,-1000),
                ibna:   new Point(1000,-1000),
                inak:   new Point(1000,-1000),
                ibk:    new Point(1000,-1000),
                ibca:   new Point(1000,-1000),
                icap:   new Point(1000,-1000),
                inaca:  new Point(1000,-1000),
                ina:    new Point(1000,-1000),
                ical:   new Point(1000,-1000),
                it:     new Point(1000,-1000),
                iss:    new Point(1000,-1000),

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
                    else if(item === "cansr" || item === "cajsr" || item === "cass" ){
                        bufferSettings.minMaxPoints[item]["x"] = (c[item] < bufferSettings.minMaxPoints[item]["x"]) ? c[item] : bufferSettings.minMaxPoints[item]["x"];
                        bufferSettings.minMaxPoints[item]["y"] = (c[item] > bufferSettings.minMaxPoints[item]["y"]) ? c[item] : bufferSettings.minMaxPoints[item]["y"];

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

