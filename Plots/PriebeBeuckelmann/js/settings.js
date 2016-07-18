/**
	* This module creates a settings singleton. These will be
	* the default settings, which will be modified as the 
	* program runs.
*/
define(["utility"],
function Settings(utils) {
	
	var defaultSettings = {
		
		calculationSettings: {
			
			//volatges
			v : -90.65004,
			caitot : 0.023632353,
			cajsrtot : 10.69691,
			cansr : 3.033365,
			nai :    10.e0,
			ki :    140.E0,
			d :   2.6203886E-10,
			f :   0.9217116,
			m :   5.9394888E-04,
			h :   0.9957722,
			j :   0.9969334,
			r :   1.7635530E-05,
			to :  0.9998544,
			xr :  1.5783978E-04,
			xs :  7.4024042E-03,
			cajsr : -0.047671 + 10.69691 * ( 0.11596 + 10.69691 * ( 10.69691 * 0.0019814 - 0.0062985 ) ),
			cai :   -5.8407E-5+ 0.023632353*(0.012799+0.023632353*(0.023632353*3.8692-0.17534)),
			iup : 0.0,
			ileak : 0.0,
			itr : 0.0,
			irel : 0.0,
			
			//parameters
			nae : 138.e0,
			ke : 4.e0,
			cae : 2.e0,
			cm : 153.4,
			gna : 16.0,
			gca : 0.064,
			gks : 0.02,
			gkr : 0.015,
			kca : 0.0006,
			kmca : 1.38,
			kmke : 1.5,
			kmna : 82.5,
			kmnai : 10.0,
			ksat : 0.1,
			eta : 0.35,
			dcaith : 0.000005,
			vmyo : 25840.0,
			vnsr : 2098.0,
			vjsr : 182.0,
			fc : 96.4867,
			bcl : 1000.0,
			pi : 3.141593,				
			gto : 0.3,
			gk1 : 2.5,
			gcab : 0.00085,
			gnab : 0.001,
			gnak : 1.3,
			gnaca : 1000.0,
			giup : 0.0045,
			kleak : 0.00026,
			cicr : 0.0,
			tcicr0: 0.0,
			ti : 100,
			dcai2 : 0.0,
			caitotvmax : 0.0,
			tvmax:-120.0,
			stimdur:2.0,
			stimdelay:0.0,
			istim : 20.0,
			
			//currents
			ik1   : 0.0,
			inaca : 0.0,
			inak : 0.0,
			icab : 0.0,
			inab : 0.0,
			ina  : 0.0,
			ica  : 0.0,
			ito  : 0.0,
			//IK 	 : 0.0,
			ikr  : 0.0,
			iks  : 0.0,
			itot : 0.0,
			iss:0.0,
			
			//numerical parameters
			s1Start: 0,
			s1: 400,
			s2: 700,
			ns1:3,
			timestep:0.01
		},
		
		formSettings: {
			displayAPDDI    : true,
			displayV		: true,
			displayS1S2 : false,
			displayCaitot	: false,
			displayCajsrtot : false,
			displayCansr	: false,
			displayNai	: false,
			displayKi	: false,
			displayD	: false,
			displayF	: false,
			displayM	: false,
			displayH	: false,
			displayJ	: false,
			displayR	: false,
			displayTo	: false,
			displayXr	: false,
			displayXs	: false,
			displayCajsr    : false,
			displayCai  : false,
			secondaryPlot : "ica"
		}
	};
	
	
	//Setting plot setting dynamically
	defaultSettings["plotSettings"] = initializePlotSettings();		
	defaultSettings.calculationSettings.voltageVariables = _getVoltageVariables();
	defaultSettings.calculationSettings.currentVariables = _getCurrentVariables();
	defaultSettings.calculationSettings.additionalVariables = _getAdditionalVariables();
	defaultSettings.calculationSettings.parameters = _getParameters();
	
	// The function return an array of voltage variables
	function _getVoltageVariables(){
		return ["v","cansr","nai","ki","d","f","m","h","j","r","to","xr","xs","cajsr","cai"];        
	}
	
	// The function return an array of current variables
	function _getCurrentVariables(){
		return ["ik1","inaca","inak","icab","inab","ina","ica","ito","ikr","iks"];
	}
	
	/* Gets parameter list which user can update from UI*/
	function _getParameters(){
		return ["s1","s2","ns1","gna","gca","gto","gkr","gks","gk1", "gnaca"];
	}
	
	/* Gets additional variables list which are used across iterations*/
	function _getAdditionalVariables(){
		return ["caitotvmax", "tvmax", "ileak", "itr", "iup", "irel", "dcai2", "cicr", "tcicr0", ];
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
		this.range 			=  new Point(-0.1, 1.1),     
		this.unitPerTick 	=  new Point(260, 0.10), 
		this.labelFrequency = new Point(1, 1),
		this.xAxis 			= xAxis,
		this.yAxis 			= yAxis,
		this.labelPrecision =  new Point(0,1), 
		this.labelSize 		= new Point(0, 0),
		this.default 		= defaultFlag
	};
	
	
	
	/* This function is responsible for creating plot-settings object;
		* a nested object in the settings object. One or more plot objects are nested under baseplot
		* object which in turn can be one or more in number nested under plot settings object.
		* Here "baseplot" consists of "PriebeBeuck" and "PriebeBeuckOther" which have PriebeBeuckPlots and PriebeBeuckOtherBasePlot respectively.
	*/
	
	function initializePlotSettings(){
		var PriebeBeuckPlots = [],
		PriebeBeuckOtherPlots = [],
		PriebeBeuckBasePlot,
		PriebeBeuckOtherBasePlot,               
		basePlots =[],
		plotSettings;
		
		//PriebeBeuckPlots
		PriebeBeuckPlots.push({key:"mainPlot", value: new Plot("Time (ms)", "V_m", false)});
		PriebeBeuckBasePlot = new BasePlot( 437.5, 240, new Point(0, 0), PriebeBeuckPlots);
		
		// PriebeBeuckOtherPlots
		
		var pBOtherPlotsInit = [{ key :  "ik1" ,  	value : {name: "I_K1"   ,showDefault: false}},
		{ key :  "inaca",  	value : {name: "I_NaCa" ,showDefault: false}},
		{ key :  "inak" ,  	value : {name: "I_NaK"  ,showDefault: false}},
		{ key :  "icab" ,  	value : {name: "I_Cab"  ,showDefault: false}},
		{ key :  "inab" ,  	value : {name: "I_Nab"  ,showDefault: false}},
		{ key :  "ina"  ,  	value : {name: "I_Na"   ,showDefault: false}},
		{ key :  "ica"  ,  	value : {name: "I_Ca"   ,showDefault: false}},
		{ key :  "ito"  ,  	value : {name: "I_to"   ,showDefault: false}},				
		{ key :  "ikr"  ,  	value : {name: "I_Kr"   ,showDefault: false}},
		{ key :  "iks"  ,  	value : {name: "I_Ks"   ,showDefault: false}} ];
		
		pBOtherPlotsInit.forEach(function(plotItem){
			PriebeBeuckOtherPlots.push({key: plotItem["key"], value: new Plot("Time (ms)", plotItem["value"]["name"], plotItem["value"]["showDefault"])});    
		});
		PriebeBeuckOtherBasePlot = new BasePlot( 437.5, 240, new Point(0, 300), PriebeBeuckOtherPlots);
		
		basePlots.push({key:"PriebeBeuck", value : PriebeBeuckBasePlot});
		basePlots.push({key:"PriebeBeuckOther", value :PriebeBeuckOtherBasePlot});
		
		plotSettings = new PlotSettings(basePlots);
		
		return plotSettings;
	};	
	
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