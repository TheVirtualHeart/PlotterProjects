define(["utility"],
function PointBufferAnalyzer(utils) {
    "use strict";
    
    
    var bufferSize = 1;
    var calcFunction = CALCULATE_SKIP;
    var count = 0;
    
    var points = {
        v: [],
        h: [],
        m: [],
        n: [],
        
    }
    
    function initialize(settings) {
        bufferSize = settings.bufferSize || 1;
        calcFunction = settings.calcFunction || CALCULATE_SKIP;
    }
    
    
    /**
     * This function takes output from the calculator and 
     * performs the given aggregation function on it
     */
    function aggregate(data) {
        calcFunction(data);
        count++;
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
        if (count % bufferSize === 0) {
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

            points.v.push(utils.normalize(data.v, new Point(-160, 40)));
            points.m.push(data.m);
            points.h.push(data.h);
            points.n.push(data.n);
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

		console.log(calculator);
		
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
    
    function getPoints() {
        return points;
    }
    
    return {
        getPoints: getPoints,
        initialize: initialize,
        aggregate: aggregate,
    }
})