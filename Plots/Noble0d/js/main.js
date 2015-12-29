var app;
var form;

/**
 * These properties determine whether certain functions are displayed
 * on the plots
 */
var displayV = true;
var displayM = true;
var displayH = true;
var displayN = true;
var secondaryPlot = "";


/**
 * These are variables that can be modified by user input. They are 
 * used in the calculation of the values that will be plotted.
 */
var cm= 12;
var gan = 0.0; // TODO: Make Form element (gl?)
var ean= -60;
var stimmag= -106;
var stimdur= 2.0;

var v = -80.0; 
var m = 0.0;
var h = 1.0;
var n = 0.0;

var ik = 0;
var ina = 0;
var il = 0;

var gna1 = 400.0;
var gna2 = 0.14;
var s1 = 0;
var ns1 = 4;
var s2 = 2000;
var period = 500.0;


/**
 * These control how how often points are graphed. The time and the 
 * timestep should remain constant. At each step, the function performs
 * a batch of calculations and records the final result. The size of
 * each batch is determined by the batchSize variable.
 */
var time = 5000;
var timestep = 0.01;
var batchSize = 1200;
var stepSize = batchSize * timestep;
var steps = (time / stepSize);


/**
 * These hold the values that are calculated. They are updated every
 * time calculate() is called.
 */
var vArray = 	[];
var mArray = 	[];
var hArray = 	[];
var nArray = 	[];

var ikArray = 	[];
var inaArray = 	[];
var ilArray = 	[];


/**
 * These hold the values that will be plotted. Because there are often
 * more values calculated than there are pixels on the screen, we will
 * hold the data that is to be calculated here.
 */
var vArrayGraph = 		[];		
var mArrayGraph = 		[];
var hArrayGraph = 		[];
var nArrayGraph = 		[];

var ikArrayGraph = 		[];
var inaArrayGraph = 	[];
var ilArrayGraph = 		[];


/**
 * 
 */


/**
 * creates the plotter object and defines all of the plots to be
 * displayed.
 */
function buildGraphs() {
	app = createPlotter(document.getElementById("plot"));

	// app.newPlot({
	// 	domain: new Point(0, 5000),
	// 	range: new Point(0, 1),
	// 	unitPerTick: new Point(500, 1),
	// 	pixelPerUnit: new Point(.1, 400),
	// 	labelFrequency: new Point(1, 1),
	// 	xAxis: "Time (ms)",
	// 	yAxis: "V (mv)",

	// }, "Noble");

	// app.newPlot({
	// 	domain: new Point(0, time),
	// 	range: new Point(-100, 100),
	// 	unitPerTick: new Point(1000, 50),
	// 	pixelPerUnit: new Point(.1, 2),
	// 	labelFrequency: new Point(1, 1),
	// 	xAxis: "Time (ms)",
	// 	yAxis: "V (mv)",

	// }, "Noble");

	app.newPlot({
		domain: new Point(0, time),
		range: new Point(0, 1),
		unitPerTick: new Point(1000, .1),
		pixelPerUnit: new Point(.0875, 300),
		labelFrequency: new Point(1, 1),
		xAxis: "Time (ms)",
		yAxis: "V (mv)",
		labelPrecision: new Point(0, 1),
	}, "Noble");

	app.newPlot({
		offset: new Point(0, 375),
		domain: new Point(0, time),
		range: new Point(-100, 100),
		unitPerTick: new Point(1000, 20),
		pixelPerUnit: new Point(.0875, 1.2),
		labelFrequency: new Point(1, 1),
		xAxis: "Time (ms)",
		yAxis: "V (mv)",
		labelPrecision: new Point(0, 1),
	}, "NobleOther");
}



/**
 * Calculate the values that will be plotted. This is a differential 
 * equation, so the values compound on each other. The values are 
 * stored in 4 different arrays. The calculation is divided into steps.
 * At each step, the function runs a batch of calculations. Once this
 * batch is complete, the values are averaged and stored in the arrays.
 * @return {[type]} [description]
 */
function calculate() {
	vArray = [];
	mArray = [];
	hArray = [];
	nArray = [];

	ikArray = [];
	inaArray = [];
	ilArray = [];

	v = -80.0; 
	m = 0.0;
	h = 1.0;
	n = 0.0;

	vArray.push(normalize(v, new Point(-80, 40)));
    mArray.push(m);
    hArray.push(h);
    nArray.push(n);
    ikArray.push(ik);
    inaArray.push(ina);
    ilArray.push(il);

	var count = 0;
	for (var j = 0; j < steps; j++) {	
		// var vVal = v;
		// var mVal = m;
		// var hVal = h;
		// var nVal = n;

		// var ikVal = ik;
		// var inaVal = ina;
		// var ilVal = il;
		//console.log(steps);
		var vAvg = v;
		var mAvg = m;
		var hAvg = h;
		var nAvg = n;

		var ikAvg = ik;
		var inaAvg = ina;
		var ilAvg = il;
		for (var i = 0; i < batchSize; i++) {


			// calculate alphas and betas for updating gating variables
		 	var am;
		    if (Math.abs(-v - 48) < 0.001) {
		    	am=0.15;
		    } else {
		    	am=0.1*(-v-48)/(Math.exp((-v-48)/15)-1);
		    }
			var bm;
			if (Math.abs(v + 8) < 0.001) {
				bm = 0.6;
			}
			else {
				bm=0.12*(v+8)/(Math.exp((v+8)/5)-1);
			}
			var ah = 0.17 * Math.exp((-v - 90)/20);
			var bh = 1 / (Math.exp((-v - 42)/10) + 1);
			var an;
			if (Math.abs(-v - 50) < 0.001) {
				an = 0.001;
			} else {
				an = 0.0001 * (-v - 50) / (Math.exp((-v-50)/10)-1);
			}
			var bn = 0.002 * Math.exp((-v-90)/80);


			// calculate derivatives of gating variables
			var dm = am * (1-m) - bm * m;
			var dh = ah * (1-h) - bh * h;
			var dn = an * (1-n) - bn * n;


			// update gating variables using explicit method
			m += timestep * dm;
			h += timestep * dh;
			n += timestep * dn;

			// calculate potassium current conductance values
			// TODO: Make 1.2 an editable value
			var gk1 = 1.2 * Math.exp((-v-90)/50) + 0.015 * Math.exp((v+90)/60);
			var gk2 = 1.2 * Math.pow(n, 4);


			// calculate currents
			// TODO: Make gan an editable value
			var ina1 = gna1 * m * m * m * h * (v - 40);
			var ina2 = gna2 * (v - 40);
			var ik1 = gk1 * (v + 100);
			var ik2 = gk2 * (v + 100);
			il = gan * (v - ean);


			// sum the two sodium and the two potassium currents
			ina = ina1 + ina2;
			ik = ik1 + ik2;


			// set stimulus current periodically to be nonzero
			var s1Count = round(s1/timestep);
			var s2Count = round(s2/timestep);
			var periodCount = round(period/timestep);
			var stimdurCount = round(stimdur/timestep);
			var istim = s1s2Stimulus(count, 
									 s1Count, 
									 s2Count, 
									 periodCount,
									 stimdurCount);

			// // if (count % round(period/timestep) < round(stimdur / timestep)) {
			// // 	istim = stimmag
			// // }
			// var s1Count = round(s1/timestep);
			// var periodCount = round(period/timestep);

			// if ((count - s1Count > 0) && 
			// 	((count - s1Count) % periodCount === 0)) 
			// {
			// 	//console.log(count);
			// 	//console.log(s1/timestep);
			// 	console.log(periodCount);
			// 	console.log(s1Count);
			// 	istim = stimmag;
			// }


			// calculate derivative of voltage 
			var dv = (-ina - ik - il - istim) / cm;


			// update voltage using forward Euler
			v += timestep * dv;


			mAvg 	+= m;
			hAvg 	+= h;
			nAvg 	+= n;
			vAvg 	+= v;
			ikAvg 	+= ik;
			inaAvg 	+= ina;
			ilAvg 	+= il;

			count++;
	    }

	    mAvg 	/= batchSize;
	    hAvg 	/= batchSize;
	    nAvg 	/= batchSize;
	    vAvg 	/= batchSize;
	    ikAvg 	/= batchSize;
	    inaAvg 	/= batchSize;
	    ilAvg 	/= batchSize;

	    vArray.push(normalize(vAvg, new Point(-160, 40)));
	    mArray.push(mAvg);
	    hArray.push(hAvg);
	    nArray.push(nAvg);

	    ikArray.push(ikAvg);
	    inaArray.push(inaAvg);
	    ilArray.push(ilAvg);	
	}
}


/**
 * This function calculates the stimulus according to the 
 * S1-S2 Protocol. 
 * 
 * @return {number} - The stimulus that will be applied.
 */
function s1s2Stimulus(count, s1, s2, period, stimdur) {
	// var s1Count = round(s1/timestep);
	// var s2Count = round(s2/timestep);
	// var periodCount = round(period/timestep);
	// var stimdurCount = round(stimdur/timestep);
	var stim = 0;
	for (var i = 0; i < ns1; i++) {
		var curPeriod = i * period + s1;
		var endPeriod = curPeriod + stimdur;
		if ((count >= curPeriod) && (count < endPeriod)) {
			stim = stimmag;
		}
	}
	if ((count >= s2) && (count < s2 + stimdur)) {
		stim = stimmag;
	}
	return stim;

}


function analyzeData() {
	app.selectPlot("Noble");
	var dimensions = app.settings.plotSize;
	var size = Math.floor(vArray.length / dimensions.x);

	vArrayGraph = [];			
	mArrayGraph = [];
	hArrayGraph = [];
	nArrayGraph = [];

	var vTemp = 0;
	var mTemp = 0; 
	var hTemp = 0;
	var nTemp = 0;
	for (var i = 0; i < vArray.length; i++) {
		vTemp += vArray[i];
		mTemp += mArray[i];
		hTemp += hArray[i];
		nTemp += nArray[i];
		if (i % size == 0) {
			vArrayGraph.push(vTemp / size);
			mArrayGraph.push(mTemp / size);
			hArrayGraph.push(hTemp / size);
			nArrayGraph.push(nTemp / size);
			vTemp = 0;
			mTemp = 0;
			hTemp = 0;
			nTemp = 0;
		}
	} 

}


/**
 * Draw the plots according to the data specified in the arrays
 */
function update() {

	app.selectPlot("Noble");
	var plotSize = app.settings.plotSize;
	var size = Math.floor(vArray.length / plotSize.x);
	var graphSize = Math.floor(time / plotSize.x);

	// if (displayV) {

	// 	//console.log(size);
	// 	var count = 0;
	// 	app.ctx.strokeStyle = Colors.Red;
	// 	app.ctx.lineWidth = 3;
	// 	app.plotFunction(function(x) {
	// 		console.log(x);
	// 		return vArrayGraph[Math.floor((x / size) * timestep)];
	// 	}, true, size * timestep, 0, time);
	// }

	// if (displayM) {
	// 	app.ctx.strokeStyle = Colors.Green;
	// 	app.ctx.lineWidth = 3;
	// 	app.plotFunction(function(x) {
	// 		var index = Math.round(x / stepSize);
	// 		return mArray[index];
	// 	}, true, size, 0, time);
	// }

	// if (displayH) {
	// 	app.ctx.strokeStyle = Colors.LightBlue;
	// 	app.ctx.lineWidth = 3;
	// 	app.plotFunction(function(x) {
	// 		var index = Math.round(x / stepSize);
	// 		return hArray[index];
	// 	}, true, size, 0, time);
	// }

	// if (displayN) {
	// 	app.ctx.strokeStyle = Colors.Indigo;
	// 	app.ctx.lineWidth = 3;
	// 	app.plotFunction(function(x) {
	// 		var index = Math.round(x / stepSize);
	// 		return nArray[index];
	// 	}, true, size, 0, time);
	// }

	// app.selectPlot("NobleOther");

	// app.ctx.strokeStyle = Colors.Yellow;
	// app.ctx.lineWidth = 3;
	// app.plotFunction(function(x) {
	// 	var index = Math.round(x / stepSize);
	// 	return ikArray[index];
	// }, true, size, 0, time);

	// app.ctx.strokeStyle = Colors.Black;
	// app.ctx.lineWidth = 3;
	// app.plotFunction(function(x) {
	// 	var index = Math.round(x / stepSize);
	// 	return inaArray[index];
	// }, true, size, 0, time);

	// app.ctx.strokeStyle = Colors.Aqua;
	// app.ctx.lineWidth = 3;
	// app.plotFunction(function(x) {
	// 	var index = Math.round(x / stepSize);
	// 	return ilArray[index];
	// }, true, size, 0, time);
	 
	
	/**
	 * Display Filtered Results
	 */
	// if (displayV) {

	// 	//console.log(size);

	// 	app.ctx.strokeStyle = Colors.Red;
	// 	app.ctx.lineWidth = 3;
	// 	app.plotFunction(function(x) {
	// 		var index = Math.floor(x * (size / graphSize));
	// 		return vArray[index];
	// 	}, true, graphSize, 0, time);
	// }

	// if (displayM) {
	// 	app.ctx.strokeStyle = Colors.Green;
	// 	app.ctx.lineWidth = 3;
	// 	app.plotFunction(function(x) {
	// 		var index = Math.floor(x * (size / graphSize));
	// 		return mArray[index];
	// 	}, true, graphSize, 0, time);
	// }

	// if (displayH) {
	// 	app.ctx.strokeStyle = Colors.LightBlue;
	// 	app.ctx.lineWidth = 3;
	// 	app.plotFunction(function(x) {
	// 		var index = Math.floor(x * (size / graphSize));
	// 		return hArray[index];
	// 	}, true, graphSize, 0, time);
	// }

	// if (displayN) {
	// 	app.ctx.strokeStyle = Colors.Indigo;
	// 	app.ctx.lineWidth = 3;
	// 	app.plotFunction(function(x) {
	// 		var index = Math.floor(x * (size / graphSize));
	// 		return nArray[index];
	// 	}, true, graphSize, 0, time);
	// }

	// app.selectPlot("NobleOther");
	// switch(secondaryPlot) {
	// 	case "ik":
	// 		app.ctx.strokeStyle = Colors.Yellow;
	// 		app.ctx.lineWidth = 3;
	// 		app.plotFunction(function(x) {
	// 			var index = Math.floor(x * (size / graphSize));
	// 			return ikArray[index];
	// 		}, true, graphSize, 0, time);
	// 		break;
	// 	case "ina":			
	// 		app.ctx.strokeStyle = Colors.Black;
	// 		app.ctx.lineWidth = 3;
	// 		app.plotFunction(function(x) {
	// 			var index = Math.floor(x * (size / graphSize));
	// 			return inaArray[index];
	// 		}, true, graphSize, 0, time);
	// 		break;
	// 	case "il":			
	// 		app.ctx.strokeStyle = Colors.Aqua;
	// 		app.ctx.lineWidth = 3;
	// 		app.plotFunction(function(x) {
	// 			var index = Math.floor(x * (size / graphSize));
	// 			return ilArray[index];
	// 		}, true, graphSize, 0, time);
	// 		break;
	// }
	 

	/** 
	 * Display unfiltered results
	 */
	// if (displayV) {

	// 	//console.log(size);

	// 	app.ctx.strokeStyle = Colors.Red;
	// 	app.ctx.lineWidth = 3;
	// 	app.plotFunction(function(x) {
	// 		var index = Math.floor(x / timestep);
	// 		return vArray[index];
	// 	}, true, timestep, 0, time);
	// }

	// if (displayM) {
	// 	app.ctx.strokeStyle = Colors.Green;
	// 	app.ctx.lineWidth = 3;
	// 	app.plotFunction(function(x) {
	// 		var index = Math.floor(x / timestep);
	// 		return mArray[index];
	// 	}, true, timestep, 0, time);
	// }

	// if (displayH) {
	// 	app.ctx.strokeStyle = Colors.LightBlue;
	// 	app.ctx.lineWidth = 3;
	// 	app.plotFunction(function(x) {
	// 		var index = Math.floor(x / timestep);
	// 		return hArray[index];
	// 	}, true, timestep, 0, time);
	// }

	// if (displayN) {
	// 	app.ctx.strokeStyle = Colors.Indigo;
	// 	app.ctx.lineWidth = 3;
	// 	app.plotFunction(function(x) {
	// 		var index = Math.floor(x / timestep);
	// 		return nArray[index];
	// 	}, true, timestep, 0, time);
	// }

	// app.selectPlot("NobleOther");
	// switch(secondaryPlot) {
	// 	case "ik":
	// 		app.ctx.strokeStyle = Colors.Yellow;
	// 		app.ctx.lineWidth = 3;
	// 		app.plotFunction(function(x) {
	// 			var index = Math.floor(x / timestep);
	// 			return ikArray[index];
	// 		}, true, timestep, 0, time);
	// 		break;
	// 	case "ina":			
	// 		app.ctx.strokeStyle = Colors.Black;
	// 		app.ctx.lineWidth = 3;
	// 		app.plotFunction(function(x) {
	// 			var index = Math.floor(x / timestep);
	// 			return inaArray[index];
	// 		}, true, timestep, 0, time);
	// 		break;
	// 	case "il":			
	// 		app.ctx.strokeStyle = Colors.Aqua;
	// 		app.ctx.lineWidth = 3;
	// 		app.plotFunction(function(x) {
	// 			var index = Math.floor(x / timestep);
	// 			return ilArray[index];
	// 		}, true, timestep, 0, time);
	// 		break;
	// }


	// requestAnimationFrame(update);






	// // var size = Math.floor(vArray.length / plotSize.x);
	if (displayV) {
		//console.log(size);

		app.ctx.strokeStyle = Colors.Red;
		app.ctx.lineWidth = 3;
		app.plotFunction(function(x) {
			//var index = Math.round(x / stepSize);
			//var index = x * size;
			//console.log(x + ": " + index);
			// if (index < vArray.length - 1) {
			// 	return vArray[index];
			// } else {
			// 	return 0;
			// }
			index = Math.round(x / stepSize);
			return vArray[index];
		}, true, stepSize, 0, time);
	}

	if (displayM) {
		app.ctx.strokeStyle = Colors.Green;
		app.ctx.lineWidth = 3;
		app.plotFunction(function(x) {
			var index = Math.round(x / stepSize);
			return mArray[index];
		}, true, stepSize, 0, time);
	}

	if (displayH) {
		app.ctx.strokeStyle = Colors.LightBlue;
		app.ctx.lineWidth = 3;
		app.plotFunction(function(x) {
			var index = Math.round(x / stepSize);
			return hArray[index];
		}, true, stepSize, 0, time);
	}

	if (displayN) {
		app.ctx.strokeStyle = Colors.Indigo;
		app.ctx.lineWidth = 3;
		app.plotFunction(function(x) {
			var index = Math.round(x / stepSize);
			return nArray[index];
		}, true, stepSize, 0, time);
	}

	app.selectPlot("NobleOther");

	switch(secondaryPlot) {
		case "ik":
			app.ctx.strokeStyle = Colors.Yellow;
			app.ctx.lineWidth = 3;
			app.plotFunction(function(x) {
				var index = Math.floor(x / stepSize);
				return ikArray[index];
			}, true, stepSize, 0, time);
			break;
		case "ina":			
			app.ctx.strokeStyle = Colors.Black;
			app.ctx.lineWidth = 3;
			app.plotFunction(function(x) {
				var index = Math.floor(x / stepSize);
				return inaArray[index];
			}, true, stepSize, 0, time);
			break;
		case "il":			
			app.ctx.strokeStyle = Colors.Aqua;
			app.ctx.lineWidth = 3;
			app.plotFunction(function(x) {
				var index = Math.floor(x / stepSize);
				return ilArray[index];
			}, true, stepSize, 0, time);
			break;
	}



	// app.ctx.strokeStyle = Colors.Yellow;
	// app.ctx.lineWidth = 3;
	// app.plotFunction(function(x) {
	// 	var index = Math.round(x / stepSize);
	// 	return ikArray[index];
	// }, true, stepSize, 0, time);

	// app.ctx.strokeStyle = Colors.Black;
	// app.ctx.lineWidth = 3;
	// app.plotFunction(function(x) {
	// 	var index = Math.round(x / stepSize);
	// 	return inaArray[index];
	// }, true, stepSize, 0, time);

	// app.ctx.strokeStyle = Colors.Aqua;
	// app.ctx.lineWidth = 3;
	// app.plotFunction(function(x) {
	// 	var index = Math.round(x / stepSize);
	// 	return ilArray[index];
	// }, true, stepSize, 0, time);


	requestAnimationFrame(update);
}


/**
 * print the data from plotter.
 */
function printData() {
	app.printPlotData(Noble);
}


/**
 * Get the values of the form and update the graph
 */
function updateGraph() {
	console.log("update");
	calculate();
}


function refitPlot() {
	// app.editPlot("Noble",
	// {
	// 	domain: new Point(0, time),
	// 	pixelPerUnit: new Point(1/(time/500), 100)
	// },
	// true,
	// true);
}


/**
 * When the window loads, initialize out graph and plot the data.
 */
// window.onload = function() {
// 	buildGraphs();
//  	buildForms();
//  	calculate();
//  	analyzeData();
// 	requestAnimationFrame(update);
// }



// UTILITY FUNCTIONS
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


/**
 * An object that contains references to the different colors used by the
 * graph.
 */
var Colors  = {
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
};

window.addEventListener("load", function loadForm() {
	buildGraphs();
	form = NobleForm();
	calculate();
	analyzeData();
	requestAnimationFrame(update);
});