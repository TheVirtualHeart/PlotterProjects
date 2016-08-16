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
                
            }
        };
        
        _initPoints(bufferSettings, settings.calculationSettings);

        if( settings.calculationSettings.hasOwnProperty("currentVariables")){
            _initMinMaxPoints(bufferSettings, settings.calculationSettings);
        }
        
        
        if (!settings.calculationSettings.hasOwnProperty("pointBuffer")){
            settings.calculationSettings.pointBuffer = bufferSettings;
        } 
        else {
            settings.calculationSettings.pointBuffer = utils.deepExtend(bufferSettings, settings.calculationSettings.pointBuffer);
        }
    };
    
    
    function _initPoints(target, source){
        
        if( source.hasOwnProperty("voltageVariables")){
            source.voltageVariables.forEach(function(item){
                target.points[item] = [];
            });
        }
        
        if( source.hasOwnProperty("currentVariables")){
            
            source.currentVariables.forEach(function(item){
                target.points[item] = [];
            });
        }
        
    }
    
    
    function _initMinMaxPoints(target, source){
        if(source.pointBuffer.hasOwnProperty("minMaxPoints")){
            target.minMaxPoints = {};
            
            source.currentVariables.forEach(function(item){
                target.minMaxPoints[item] = new Point(1000, -1000);
            });
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
        * This function resets the values
    */
    function reset(settings) {
        
        // reset the point arrays
        for(var item in settings.calculationSettings.pointBuffer.points){
            item = [];
        }
        
        //reset minMax  points to default
        for(var item in settings.calculationSettings.pointBuffer.minMaxPoints){
            item = new Point(1000, -1000);
        }
        
        // reset counter
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
        
        var c    = data.calculationSettings,
        properties = ["voltageVariables", "currentVariables"],
        varCategories = [];                    
        // set page level variable bufferSettings 
        bufferSettings = data.calculationSettings.pointBuffer;
        
        
        if ( count % bufferSettings.bufferSize  === 0){
            
            properties.forEach(function(item){
                if(c.hasOwnProperty(item)){
                     varCategories.push(c[item]);
                }
            })
                       
            varCategories.forEach(function(category){
                
                category.forEach(function(item){
                    _addPoints(item, c[item], c.timestep);
                });
                
            });
        }                  
    }
    
    
    function _updateMinMaxPoints(item, point){
        /* 'x' corresponds to minimum value,  'y' corresponds to maximum value */ 
        var location = bufferSettings.minMaxPoints[item];    
        location.x = (point < location.x) ? point : location.x;
        location.y = (point > location.y) ? point : location.y;                
    }
    
    function _addPoints(item, point, timestep){
        if(bufferSettings.hasOwnProperty("minMaxPoints") && bufferSettings.minMaxPoints[item]){
            _updateMinMaxPoints(item, point);
        }
        
         if(bufferSettings.hasOwnProperty("normalPoints")){
             point = (bufferSettings.normalPoints[item]) ?  utils.normalize(point, bufferSettings.normalPoints[item]) : point;
         }
    
         bufferSettings.points[item].push(new Point(count * timestep, point ));         
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
        getSettings : getSettings,
        analyzerName : "PointBufferAnalyzer"
    } 
    
});    
















