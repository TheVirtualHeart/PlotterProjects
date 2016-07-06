/**
	* This module creates a settings singleton. These will be
	* the default settings, which will be modified as the 
	* program runs.
	*/

	define(["utility"],
		function Settings(utils) {	

    /**
	* The default settings for the plot
	*/
	var defaultSettings = {        
		calculationSettings: {

			//parameter values
			gna:12.8,
			gk1: 2.8,
			gkr: 0.0136,
			gks: 0.0245,
			gkp: 0.002216,
			gto: 0.23815,
			gnab: 0.0031,
			gcab: 0.0003842,
			pca: 0.0000226,
			pcak: 5.79e-7,
			prel: 6.0,
			pleak: 0.000001,
			xinakbar: 0.693,
			xicahalfbar: -0.265,
			xipcabar: 0.05,
			rr: 8.314,
			tt: 310.0,
			ff: 96.5,
			acap: 1.534e-4,
			csc: 1.0,
			eta: 0.35,
			xksat: 0.2,
			xknaca: 1500.0,
			xkmfca: 0.18,
			xkmk1: 13.0,
			xkmna: 87.5,
			xkmca: 1380.0,
			xkmnai: 10.0,
			xkmko: 1.5,
			xkmpca: 0.05,
			xkmup: 0.32,
			cmdntot: 10.0,
			csqntot: 10000.0,
			xkmcmdn: 2.0,
			xkmcsqn: 600.0,
			vup: 0.1,
			vmyo: 25.84e-6,
			vsr: 2e-6,
			cnai: 10.0,
			cki: 149.4,
			cnao: 138.0,
			cko: 4.0,
			ccao: 2000.0,
			xstimdur: 1,
			stim: -61.2, 

		//numerical parameters
		nx: 1,
		s1Start: 0,
		s1: 430,
		s2: 200,
		ns1:2,
		timestep: 0.05,	
		
		//initial values
		v: -94.7,
		ccai: 0.0472,
		ccasr: 320,
		xf: 1,
		xd: 0.0,
		xm: 0.0,
		xh: 1.0,
		xj: 1.0,
		xfca: 1.0,
		xkr: 0.0,
		xks: 0.0,
		xto: 0.0,
		yto: 1.0,
		
		//currents
		xina : 0,
		xik1 : 0,
		xito : 0,
		xikp : 0,
		xinab : 0,
		xiks : 0,
		xica : 0,
		xinaca : 0,
		xipca : 0,
		xicab : 0,
		xicak : 0,
		xinak : 0,
		xikr : 0
	},

	formSettings: {	

		displayV: true,
		displayCcai: false,
		displayCcasr: false,
		displayXf: false,
		displayXd: false,
		displayXm: false,
		displayXh: false,
		displayXj: false,
		displayXfca: false,
		displayXkr: false,
		displayXks: false,
		displayXto: false,
		displayYto: false,
		displayAPDDI: false,
		displayS1S2: false,
		secondaryPlot: "xikr",
	}               	    	
};

	//Setting plot setting dynamically
	defaultSettings["plotSettings"] = initializePlotSettings();

	defaultSettings.calculationSettings.voltageVariables= getVoltageVariables();
	defaultSettings.calculationSettings.currentVariables = getCurrentVariables();


  // The function return an array of voltage variables
  function getVoltageVariables(){
  	return ["v",    "ccasr",    "ccai",     "xfca",     "xd",       "xf",       "yto",      "xto",      "xks",      "xkr",      "xj",   "xh",   "xm"];        
  }

// The function return an array of current variables
function getCurrentVariables(){
	return ["xina", "xik1",     "xito",     "xikp",     "xinab",    "xiks",     "xica",     "xinaca",   "xipca",    "xicab",    "xicak", "xinak", "xikr"];
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
  	this.plots = 	function(){
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

        function Plot (xAxis, yAxis, defaultFlag) {     
            this.range          =  new Point(-0.1, 1.1),     
            this.unitPerTick    =  new Point(200, 0.10), 
            this.labelFrequency = new Point(1, 1),
            this.xAxis          = xAxis,
            this.yAxis          = yAxis,
            this.labelPrecision =  new Point(0,1), 
            this.labelSize      = new Point(0, 0),
            this.default        = defaultFlag
        };

/* This function is responsible for creating plot-settings object;
 * a nested object in the settings object. One or more plot objects are nested under baseplot
 * object which in turn can be one or more in number nested under plot settings object.
 * Here "baseplot" consists of "Fox" and "FoxOther" which have foxBasePlot and foxOtherBasePlot respectively.
 */


 function initializePlotSettings(){
 	var foxPlots = [],
 	foxOtherPlots = [],
 	foxBasePlot,
 	foxOtherBasePlot,               
 	basePlots =[],
 	plotSettings;

		//foxPlots
		foxPlots.push({key:"mainPlot",value: new Plot("Time (ms)", " ", false)});
        foxBasePlot = new BasePlot( 437.5, 240, new Point(0, 0), foxPlots);

		/*foxPlots.push({key:"mainPlot",
			value: new Plot(new Point(-0.1, 1.1), new Point(200, 0.1), new Point(1, 1), "Time (ms)",
				"V_m", new Point(0, 1), new Point(0, 0), false)});
		foxBasePlot = new BasePlot( 437.5, 240, new Point(0, 0), foxPlots);
		*/
		// foxOtherPlots

		var fOtherPlotsInit = [ {key : "xica",	value:  {name: "I_Ca",	showDefault:false}},
                                {key : "xicab", value:  {name: "I_Cab", showDefault:false}},
                                {key : "xicak", value:  {name: "I_CaK", showDefault:false}},
                                {key : "xik1",  value:  {name: "I_K1", 	showDefault:false}},
                                {key : "xikp",  value:  {name: "I_Kp",  showDefault:false}},
                                {key : "xikr",  value:  {name: "I_Kr", 	showDefault:false}},
                                {key : "xiks",  value:  {name: "I_Ks",  showDefault:false}},
                                {key : "xina",  value:  {name: "I_Na",  showDefault:false}},
                                {key : "xinab", value:  {name: "I_Nab", showDefault:false}},
                                {key : "xinaca",value:  {name: "I_NaCa",showDefault:false}},
                                {key : "xinak", value:  {name: "I_NaK", showDefault:false}},
                                {key : "xipca", value:  {name: "I_pCa",	showDefault:false}},
                                {key : "xito", 	value:  {name: "I_to",	showDefault:false}} ];

       fOtherPlotsInit.forEach(function(plotItem){
        foxOtherPlots.push({key: plotItem["key"], value: new Plot("Time (ms)", plotItem["value"]["name"], 
                            plotItem["value"]["showDefault"])}); });
        foxOtherBasePlot = new BasePlot( 437.5, 240, new Point(0, 300), foxOtherPlots);

        basePlots.push({key:"Fox", value : foxBasePlot});
        basePlots.push({key:"FoxOther", value :foxOtherBasePlot});

        plotSettings = new PlotSettings(basePlots);
        return plotSettings;
    }; 
/*
		foxOtherPlots.push({key:"xica",
			value: new Plot(new Point(-1.6, 0), new Point(200, .15), new Point(1, 1), "Time (ms)",
				"I_Ca", new Point(0, 2), new Point(0, 0), false)});

		foxOtherPlots.push({key:"xicab",
			value: new Plot(new Point(-0.1, 0), new Point(200, 0.01), new Point(1, 1), "Time (ms)",
				"I_Cab", new Point(0, 2), new Point(0, 0), false)});

		
		foxOtherPlots.push({key:"xicak",
			value: new Plot(new Point(0, 0.8), new Point(200, .08), new Point(1, 1), "Time (ms)",
				"I_CaK", new Point(0, 2), new Point(0, 0), false)});

		foxOtherPlots.push({key:"xik1",
			value: new Plot(new Point(0, 10), new Point(200, 1), new Point(1, 1), "Time (ms)",
				"I_K1", new Point(0, 1), new Point(0, 0), false)});		

		foxOtherPlots.push({key:"xikp",
			value: new Plot(new Point(0, 0.3), new Point(200, .03), new Point(1, 1), "Time (ms)",
				"I_Kp", new Point(0, 2), new Point(0, 0), false)});		


		foxOtherPlots.push({key:"xikr",
			value: new Plot(new Point(0, 0.2), new Point(200, .02), new Point(1, 1), "Time (ms)",
				"I_Kr", new Point(0, 2), new Point(0, 0), true)});


		foxOtherPlots.push({key:"xiks",
			value: new Plot(new Point(0, 0.004), new Point(200, .0004), new Point(1, 1), "Time (ms)",
				"I_Ks", new Point(0, 4), new Point(0, 0), false)});

		foxOtherPlots.push({key:"xina",
			value: new Plot(new Point(-350, 0), new Point(200, 35), new Point(1, 1), "Time (ms)",
				"I_Na", new Point(0, 1), new Point(0, 0), false)});
		
		foxOtherPlots.push({key:"xinab",
			value: new Plot(new Point(-0.2, 0), new Point(200, .02), new Point(1, 1), "Time (ms)",
				"I_Nab", new Point(0, 2), new Point(0, 0), false)});

		foxOtherPlots.push({key:"xinaca",
			value: new Plot(new Point(-0.25, 0), new Point(200, .025), new Point(1, 1), "Time (ms)",
				"I_NaCa", new Point(0, 3), new Point(0, 0), false)});		

		foxOtherPlots.push({key:"xinak",
			value: new Plot(new Point(0, 0.3), new Point(200, .03), new Point(1, 1), "Time (ms)",
				"I_NaK", new Point(0, 2), new Point(0, 0), false)});

		foxOtherPlots.push({key:"xipca",
			value: new Plot(new Point(0, 0.05), new Point(200, .005), new Point(1, 1), "Time (ms)",
				"I_pCa", new Point(0, 3), new Point(0, 0), false)});	
		
		foxOtherPlots.push({key:"xito",
			value: new Plot(new Point(0, 3), new Point(200, .3), new Point(1, 1), "Time (ms)",
				"I_to", new Point(0, 1), new Point(0, 0), false)});

		foxOtherBasePlot = new BasePlot( 437.5, 240, new Point(0, 300), foxOtherPlots);
		

		basePlots.push({key:"Fox", value : foxBasePlot});
		basePlots.push({key:"FoxOther", value :foxOtherBasePlot});
		
		plotSettings = new PlotSettings(basePlots);
		return plotSettings;
	};*/


	/*
	* The module exposes functions 
    * initialize
    * getSettings
    */

    return{
    	
        /**
			* This function modifies any default settings
			*/
			initialize: function(override) {
				defaultSettings = _.merge(defaultSettings, override);
			},   

        /**
			* Retrieves the settings
			*/
			getSettings: function() {            
				return _.cloneDeep(defaultSettings);
			}
		}

	});


