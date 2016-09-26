define(["utility"],
function PointBufferAnalyzer(utils) {
    "use strict";
    
    var count = 0;
    var bufferSettings;
    var mySettings;
    function initialize(settings) {
        var bufferSettings = {
                bufferSize: 100,
                calcFunction: CALCULATE_SKIP,
                points: {
                    v: [],
                    h: [],
                    m: [],
                    n: [],
                    il: [],
                    ina: [],
                    ik: [],
                    myPoints: ["v","h","m","n","il","ina","ik"]
                }
        };
        
        mySettings=settings;
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
            v: [],
            h: [],
            m: [],
            n: [],
            
            il: [],
            ina: [],
            ik: []
        }
        count = 0;
    }
    
    
    /**
	 * This function aggregates points by "skipping" the ones in the middle. The
	 * function calls the calculator's calculateNext next function at each
	 * iteration. When it comes to the end of a buffer, it logs the variables at
	 * that point.
	 * 
	 * @param {NobleCalculator} calculator - the calculator that is used to
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
        var c = data.calculationSettings;
        bufferSettings = data.calculationSettings.pointBuffer;
        
        var timePeriod = (((c.s1 * c.ns1) + c.s2) * 1.1);
        var numCalculation = timePeriod / c.timestep;
                   
        if (count % bufferSettings.bufferSize === 0) {
            // var points = calculator.getPoints();

            // // add any uptimes or downtimes
            // if (!!points.upTime) {
            // 	var pointX = count * calculator.timestep;
            // 	var pointY = utils.normalize(data.v, new Point(-160, 40));
            // 	variables.upTimes.push(new Point(pointX, pointY));
            // }
            // if (!!points.downTime) {
            // 	var pointX = i * calculator.timestep;
            // 	var pointY = utils.normalize(points.v, new Point(-160, 40));
            // 	variables.downTimes.push(new Point(pointX, pointY));
            // }

            var vNormal = utils.normalize(data.calculationSettings.v, new Point(-85, 30));
            var vPoint = new Point(count * c.timestep, vNormal);
            bufferSettings.points.v.push(vPoint);
            
            var mPoint = new Point(count * c.timestep, data.calculationSettings.m);
            bufferSettings.points.m.push(mPoint);
            
            var hPoint = new Point(count * c.timestep, data.calculationSettings.h);
            bufferSettings.points.h.push(hPoint);
            
            var nPoint = new Point(count * c.timestep, data.calculationSettings.n);
            bufferSettings.points.n.push(nPoint);
                    
            var ilPoint = new Point(count * c.timestep, data.calculationSettings.il);
            bufferSettings.points.il.push(ilPoint); 
            
            var inaPoint = new Point(count * c.timestep, data.calculationSettings.ina);
            bufferSettings.points.ina.push(inaPoint);
            
            var ikPoint = new Point(count * c.timestep, data.calculationSettings.ik);
            bufferSettings.points.ik.push(ikPoint);
        }
	}
    
    
    /**
	 * This function aggregates points by taking the average value of all of the
	 * points in the point buffer. At each iteration, the function calls the
	 * calculator's getNext() function and adds the variables to an average
	 * variable. When the function reaches the end of a buffer, those average
	 * values are divided by the buffer size, stored, and then set to zero.
	 * 
	 * @param {NobleCalculator} calculator - the calculator that is used to
	 * compute the variables. It does this by calling its calculateNext()
	 * function
	 * 
	 * @param {Number} numPoints - the number of points that will be generated
	 * as a result of this function
	 * 
	 * @param {Number} bufferSize - the size of the buffer in which points are
	 * aggregated
	 */
	function CALCULATE_AVERAGE(calculator, iterations, bufferSize) {

		var points 	= calculator.getPoints();
		var vAvg 	= points.v;
		var mAvg 	= points.m;
		var hAvg 	= points.h;
		var nAvg 	= points.n;
		var ikAvg 	= points.ik;
		var inaAvg 	= points.ina;
		var ilAvg 	= points.il;
		
		for (var i = 0; i < iterations; i++) {
			calculator.calculateNext();
			points 	= calculator.getPoints();

			// add any uptimes or downtimes
			if (!!points.upTime) {
				var pointX = i * calculator.timestep;
				var pointY = utils.normalize(points.v, new Point(-160, 40));
				variables.upTimes.push(new Point(pointX, pointY));
			}
			if (!!points.downTime) {
				var pointX = i * calculator.timestep;
				var pointY = utils.normalize(points.v, new Point(-160, 40));
				variables.downTimes.push(new Point(pointX, pointY));

			}

			vAvg 	+= points.v;
			mAvg 	+= points.m;
			hAvg 	+= points.h;
			nAvg 	+= points.n;
			ikAvg 	+= points.ik;
			inaAvg 	+= points.ina;
			ilAvg 	+= points.il;

			if (i % bufferSize === 0) {
				
				vAvg 	= vAvg / bufferSize;
				mAvg 	= mAvg / bufferSize;
				hAvg 	= hAvg / bufferSize;
				nAvg 	= nAvg / bufferSize;
				ikAvg 	= ikAvg / bufferSize;
				inaAvg 	= inaAvg / bufferSize;
				ilAvg 	= ilAvg / bufferSize;

				variables.v.push(utils.normalize(vAvg, new Point(-160, 40)));
				variables.m.push(mAvg);
				variables.h.push(hAvg);
				variables.n.push(nAvg);
				variables.ik.push(ikAvg);
				variables.ina.push(inaAvg);
				variables.il.push(ilAvg);

				vAvg 	= 0;
				mAvg 	= 0;
				hAvg 	= 0;
				nAvg 	= 0;
				ikAvg 	= 0;
				inaAvg 	= 0;
				ilAvg 	= 0;
			}
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
        getSettings : getSettings,
        getPoints : function(){
        	return {
        		myPoints: mySettings.calculationSettings.pointBuffer.points.myPoints,
        		points: bufferSettings.points
        	}
        }
    }
})