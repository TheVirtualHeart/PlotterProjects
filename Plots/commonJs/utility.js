/**
 * A module to provide common utility functions for the
 */
define(function NobleUtilities() {
	"use strict";
	

	/**
	 * This function creates a new object from all of the other objects
	 * specified in the arguments. Based on the assign polyfill: 
	 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
	 * 
	 * @param  {Object} target - the object we want to add properties to.
	 * 
	 * @return {Object}        - an object with the properties added to it.
	 */
	function extend(target) {
        
		var output = Object(target);
	      for (var index = 1; index < arguments.length; index++) {
	        var source = arguments[index];
	        if (source !== undefined && source !== null) {
	          for (var nextKey in source) {
	            if (source.hasOwnProperty(nextKey)) {
	              output[nextKey] = source[nextKey];
	            }
	          }
	        }
	      }
	      return output;
	}
    
    function deepExtend(target, source) {
        for (var prop in source) {
        	if (typeof source[prop] === "object" && source[prop] !== null) {
                if(!(target[prop])){
                target[prop] = Object.create(source[prop]);
                }
                target[prop] = deepExtend(target[prop], source[prop]);
            }
            else {
                target[prop] = source[prop];
            }
        }
        return target;
    }
    
    
    function deepCopy(source) {
        
        var obj = {};
        
        // cycle through all of the properties in the
        // source object
        for (var nextKey in source) {
            if (source.hasOwnProperty(nextKey)) {
                
                // if the key is an object, deepcopy that object
                var prop;
                if (source[nextKey] !== null && 
                    typeof source[nextKey] === 'object') {    
                        prop = deepCopy(source[nextKey]);
                } else {
                    prop = source[nextKey];
                }
                obj[nextKey] = prop;
            }
        }
        
        return obj;
    }

    function copySpecific(target, source, properties){
    	properties.forEach(function(property){
    		if(source.hasOwnProperty(property) && target.hasOwnProperty(property) ){
    			target[property] = source[property];
    		}
    	});
    }


    /**
     * This function implements a flyweight pattern following this gist
     * https://gist.github.com/addyosmani/2668755
     */
    function implementsFor(object, target) {
        if (target.constructor == Function) {
            // Normal Inheritance 
            object.prototype = new target();
            object.prototype.constructor = object;
            object.prototype.parent = target.prototype;
        } else {
            // Pure Virtual Inheritance 
            object.prototype = target;
            object.prototype.constructor = object;
            object.prototype.parent = target;
        }
        return object;
    }
    

	/**
	 * The heaviside function. Return 0 if the expression is negative
	 * and 1 otherwise
	 * @param  {int} expression The expression to evaluate
	 * @return {int} 0 if the expression evaluates to a negative number, 1 otherwise
	 */
	function heaviside(expression) {
		if (expression < 0) {
			return 0;
		} else {
			return 1;
		}
	}


	/** 
	 * A rounding function that more closely resembles Matlab's round() 
	 * function.
	 * http://www.mathworks.com/help/matlab/ref/round.html
	 */
	function round(val) {
		if (val > 0) {
			return Math.round(val);
		} else if (val < 0) {
			var abs = Math.abs(val);
			var round = Math.round(abs);
			return -round;
		} else {
			return 0;
		}
	}


	/**
	 * Return the numeric value of the input if it has one. If the value
	 * is not a number, return zero.
	 * 
	 * @param  {any} value - can be any value. The function will interpret
	 * non-numeric values as zero.
	 * 
	 * @return {number} - the numeric value of the input if it exists. Zero
	 * otherwise
	 */
	function numericValue(value) {
		if (!isNaN(Number(value))) {
			return Number(value);
		} else {
			return 0;
		}
	}


	/** 
	 * Checks to see if the given value is a boolean. Taken from adeneo in this
	 * stackoverflow thread: 
	 * http://stackoverflow.com/questions/28814585/how-to-check-if-type-is-boolean
	 * 
	 * @param  {} bool - the value that we want to determine is a boolean
	 * @return {boolean} - true if the value is a boolean, false otherwise.
	 */
	function checkBool(bool) {
    	return typeof bool === 'boolean' || 
          	(typeof bool === 'object' && typeof bool.valueOf() === 'boolean');
	}


	/**
	 * Return the normalized value as it exists within the range.
	 * 
	 * @param  {number} value - the value to be normalized.
	 * 
	 * @param  {Point} range - a Point that defines the upper and lower
	 * bounds of the normalization. the x value is the minimum value, while
	 * the y value is the maximum.
	 * 
	 * @return {number} - The normalized value. It is expressed as a number
	 * between 0 and 1.
	 */
	function normalize(value, range) {

		var norm = (value - range.x)/(range.y - range.x);
		return norm;
	}


	/* This function {constructor} is used to initiate plot-settings for the setting object
        * @param {basePlots} - base plot object
    */
    function PlotSettings(basePlots){
        var basePlot  = function(){
            var basePlotTarget = new Object();      
            basePlots.forEach(function(item){     
                basePlotTarget[item.key] =  item.value; 
            });          
            return basePlotTarget;
        }();
        
        return basePlot;
    };

    /* This function {constructor} is used to initiate base class object
        * @param {width, height, offset, plots} 
    */  
    function BasePlot(width, height, offset, plots){
        this.width = width,
        this.height = height,
        this.offset = offset,
        this.plots =    function(){
            var plotsTarget = new Object();      
            plots.forEach(function(item){     
                plotsTarget[item.key] =  item.value; 
            });          
            return plotsTarget;
        }();
    };

     /* This function {constructor} is used to initiate Plot object
        * @param {xAxis, yAxis, defaultFlag}
        *
    */
    
    function Plot (plotParams) {     
        this.range          =  (plotParams.range) ? plotParams.range : new Point(-0.1, 1.1),
        this.unitPerTick    =  (plotParams.unitPerTick) ? plotParams.unitPerTick : new Point(260, 0.10), 
        this.labelFrequency = new Point(1, 1),
        this.xAxis          = (plotParams.xAxis) ? plotParams.xAxis : "Time (ms)",
        this.yAxis          = (plotParams.yAxis) ? plotParams.yAxis : "",
        this.labelPrecision =  new Point(0,1), 
        this.labelSize      = new Point(0, 0),
        this.default        = (plotParams.showDefault) ? plotParams.showDefault : false;
    };

    /* This function is responsible for creating plot-settings object;
        * a nested object in the settings object. One or more plot objects are nested under baseplot
        * object which in turn can be one or more in number nested under plot settings object.
        * Here "baseplot" consists of "primary" and "secondary" which have modelPlots and modelOtherPlots respectively.
    */
    
    function initializePlotSettings(currents, formSettings, plotParams){

            var temp     = [],
            basePlot     = null,
            otherPlots   = null,
            plotSettings = null,
            showDefault,
            plotParams = plotParams ? plotParams : {};


            // main plot
            temp.push({key:"mainPlot", value: new Plot(plotParams)});
            basePlot = new BasePlot( 437.5, 240, new Point(0, 0), temp);

            if(currents && formSettings){                
            //re-set temp 
            temp = [];
            
            //sub plots
            currents.forEach(function(plotItem){

                if(formSettings["secondaryPlot"] && formSettings.secondaryPlot === plotItem){
                    showDefault = true;
                }
                else{
                    showDefault = false;
                }

                plotParams["xAxis"] = "Time (ms)";
                plotParams["yAxis"] = formSettings[plotItem];
                plotParams["showDefault"] = showDefault;
                
                //push each sub plot
                temp.push({key: plotItem, value: new Plot(plotParams) });
            });
            
            if(temp.length > 0){
                otherPlots = new BasePlot( 437.5, 240, new Point(0, 300), temp);                
            }                                                        
        }
        //re-set temp 
        temp = [];  
        if(basePlot){
            temp.push({key: "primary",   value : basePlot});
        }

        if(otherPlots){
            temp.push({key: "secondary", value : otherPlots});
        }   
        
        if(temp.length > 0){
            plotSettings = new PlotSettings(temp);
        }
                
        return plotSettings;
    }; 


    /*
      * This function is used to recalculate sub plot settings.  
      * @param {settings} - consists of settings to store calculated values
      */

      function calcPlotSettings(pMinMax){
        
        var newPS = {};
        if(pMinMax){
              // update selected plot settings
              // padding range upper and lower bounds by additional 10%
              newPS.range           = new Point((pMinMax["x"] - (Math.abs(pMinMax["x"]) * .1)), (pMinMax["y"] + (Math.abs(pMinMax["y"]) * .1)));            
               newPS.unitPerTick     = new Point(260, Math.abs((newPS.range.y - newPS.range.x )/9));
              // logic for labelPrecision can be changed if someone has a better wasy to calculate it
              newPS.labelPrecision = new Point(0, (Math.abs(pMinMax["y"] - pMinMax["x"]) >= 1)?1 : 
                                            (Math.abs(pMinMax["y"] - pMinMax["x"]) >= .5 
                                                && Math.abs(pMinMax["y"] - pMinMax["x"]) < 1) ? 2 : 3);
                                             
        }
      return newPS;
      } 


      function getCssClass(colorName){
       var suffix = null;
       if(colorName && colorName.trim().length > 0){
	      suffix =  "plotter_inputgroup plotter_inputgroup-";
	      suffix = suffix + colorName.charAt(0).toLowerCase() + colorName.slice(1);	              
       }
       return suffix;
      }


        function assignColors(items){
            var taken = ["Orange", "Black", "Red"], 
            _colors = _.cloneDeep(Colors),
            colorArray, 
            result = {}; 

            colorArray = Object.keys(_colors);
            removeArrayItems(colorArray, taken);

            for(var i = 0, j = items.length; i<j ; i++){
                result[items[i]] = colorArray[i];
            } 
            return result;
        }
       
       function  removeArrayItems(sourceArray, items){
       	var index = -1;
       	items.forEach(function(item){
			for(var i= 0 , j = sourceArray.length; i< j; i++) {            
			           if(sourceArray[i] === item){
			             index = i;             
			             break;
			           }
			        }
			if(index != -1){
				sourceArray.splice(index, 1);
			}			

       	});
         return sourceArray;
       }

       function setElementValue(ele, value){
        
        switch(ele.type){
            
            case "checkbox" : 
            ele.checked = value;
            break;
            
            case "text":
            ele.value = value;
            break;
            
            case "select-one":
            ele.selectedIndex  = getValueIndex(ele, value);
            break;

            default:
            break;
        }
        
    }

        function getElementValue(ele){
        var value = null;
        
        switch(ele.type){
            
            case "checkbox" : 
            value = numericValue(ele.checked);
            break;
            
            case "text":
            value = ele.value;
            value  = (isNaN(value)) ? value : numericValue(value); 
            break;
            
            case "select-one":
            value = ele.options[ele.selectedIndex].value;
            break;
            
            default:
            break;
        }
        return value;       
    }
    
    function getValueIndex(ele, item){
        var index = -1;
        
        for (var i = 0, j = ele.options.length; i < j ; i++) {
            var option = ele.options[i];
            if (option.value === item) {              
                index = i;
                break;
            }
        }
        return index;
    }



	/**
	 * An object that contains references to the different colors used by the
	 * graph.
	 */
	var Colors  = {
		
        Blue: "rgb(0, 0, 255)",
		Aqua: "rgb(29, 239, 242)",
		Yellow: "rgb(254, 238, 0)",
		Black: "rgb(0, 0, 0)",
		Indigo: "rgb(47, 38, 224)",
		YellowGreen: "rgb(155, 226, 17)",
		Purple: "rgb(175, 26, 235)",
		Pink: "rgb(255, 153, 255)",
		Gray: "rgb(102, 102, 102)",
		Orange: "rgb(255, 153, 0)",
		LightBlue: "rgb(0, 153, 255)",
		Red: "rgb(255, 0, 0)",
		Green: "rgb(19, 171, 19)",
		/* Amit Shah
		 * 06/13/2016
		 * Description: Adding more colors.
		 */
		LightCoral: "#F08080",
		LightSlateGray: "#778899",
		Maroon: "#800000",
		MidnightBlue: "#191970",
		OrangeRed: "#FF4500",
		SandyBrown: "#F4A460",
		Teal: "#008080",
		Violet: "#EE82EE",
		SpringGreen: "#00FF7F",
		Olive: "#808000",
		/* Colors Added till here. */
		
		/* Amit Shah
		 * 07/01/2016
		 * Description: Adding more colors.
		 */

		BlueViolet: "#8A2BE2",
		Brown: 	"#A52A2A",
		BurlyWood: "#DEB887",
		Chartreuse: "#7FFF00",
		Chocolate: "#D2691E",
		CornflowerBlue: "#6495ED",
		DarkGoldenRod: 	"#B8860B",
		DarkMagenta:    "#8B008B",
		DarkSlateGrey: 	"#2F4F4F",
		FireBrick: 	"#B22222",
		Lime: 	"#00FF00",
		SaddleBrown: "#8B4513",
		Turquoise: 	"#40E0D0",
		CadetBlue: 	"#5F9EA0",
		DarkGreen: 	"#006400",
		DarkRed: 	"#8B0000",
		DarkSalmon: 	"#E9967A",
		DeepPink: 	"#FF1493",
		DodgerBlue: 	"#1E90FF",
		ForestGreen: 	"#228B22",
		Gold: 	"#FFD700"

		/* Colors Added till here. */
	};

	/**
	 * An object that contains references to the different TimeUnits used by
	 * the graph specifically in plots, form to convert from any unit to milliseconds.
	 */

	var timeUnit = {
    units : { nanoseconds : 1e-6,
          microseconds :0.001,
          milliseconds : 1,
          seconds : 1000,
          minutes : 60000,
          hours :3.6e+6
         },
             
         getTimeUnit :  function(unitParam){
               return (timeUnit.units[unitParam]) ? timeUnit.units[unitParam] : timeUnit.units["milliseconds"];
           }

   };

	/**
	 * This api contains the functions and properties that the user can interact
	 * with when using this module.
	 * @type {Object}
	 */
	var api = {
        deepExtend: deepExtend,
        deepCopy: deepCopy,
        implementsFor: implementsFor,
		heaviside: heaviside,
		round: round,
		numericValue: numericValue,
		checkBool: checkBool,
		normalize: normalize,
		colors: Colors,
		extend: extend,
		timeUnit: timeUnit,
        initializePlotSettings : initializePlotSettings,
        calcPlotSettings : calcPlotSettings,
        assignColors : assignColors,
        getCssClass : getCssClass,
        removeArrayItems : removeArrayItems,
        copySpecific : copySpecific,
        setElementValue : setElementValue,
        getElementValue : getElementValue,
        getValueIndex :getValueIndex
        
	};
	return api;
});