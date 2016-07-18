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
				cai:0.0002, //loop
				casr:0.2, //loop
				ki:138.3, // loop
				nai:11.6, //loop
				sd:0.,
				sf:1.,
				sfca:1.,
				sg:1.,
				sh:0.75,
				sitot:0.0,
				sj:0.75,
				sm:0.,
				sr:0.,
				ss:1.,
				sxr1:0.,
				sxr2:1.,
				sxs:0.,
				v:-86.2,

			//currents
				ibca:0,
				ibna:0,
				ical:0,
				ik1:0,
				ikr:0,
				iks:0,
				ileak:0,
				ina:0,
				inaca:0,
				inak:0,
				ipca:0,
				ipk:0,								
				ito:0,
				istim:0,
				Irel:0,
				

			//parameters 
				Bufc:0.15,
				Bufsr:10.,				
				Cao:2.0,
				CAPACITANCE:0.185,				
				F:96485.3415,
				GbCa:0.000592,
				GbNa:0.00029,
				GCaL:0.000175,
				GK1:5.405,
				Gkr:0.096,
				GNa:14.838,
				GpCa:0.825,
				GpK:0.0146,
				Kbufc:0.001,
				Kbufsr:0.3,				
				KmCa:1.38,
				KmK:1.0,
				KmNa:40.0,
				KmNai:87.5,
				knaca:1000,
				knak:1.362,
				Ko:5.4,
				KpCa:0.0005,
				ksat:0.1,
				Kup:0.00025,				
				n:0.35,				
				Nao:140.0,
				pKNa:0.03,
				R:8314.472,
				stimdur:1.0,
				stimstrength:-52.0,
				T:310.0,
				taufca:2.,
				taug:2.,				
				Vc:0.016404,
				Vmaxup:0.000425,
				Vsr:0.001094,
				Gks:0.245, 
				Gto : 0.294,
				iType : "epi",


				//numerical parameters
				s1Start: 0,
				s1: 300,
				s2: 900,
				ns1:3,
				timestep:.02
			},

			formSettings: {

				displayAPDDI : true,
				displayS1S2 : false,
				displayV : true,
				displaySd : false,
				displaySf : false,
				displaySfca : false,
				displaySg : false,
				displaySh : false,				
				displaySj : false,
				displaySm : false,
				displaySr : false,
				displaySs : false,
				displaySxr1 : false,
				displaySxr2 : false,
				displaySxs : false,
				displayCai : false,
				displayCasr : false,
				displayKi : false,
				displayNai : false,
				secondaryPlot: "ical"

			}
		};


		//Setting plot setting dynamically
		defaultSettings["plotSettings"] = initializePlotSettings();		
		defaultSettings.calculationSettings.voltageVariables = _getVoltageVariables();
		defaultSettings.calculationSettings.currentVariables = _getCurrentVariables();		
		defaultSettings.calculationSettings.parameters = _getParameters();

		// The function return an array of voltage variables
		function _getVoltageVariables(){
			return ["cai","casr","ki","nai","sd","sf","sfca","sg","sh","sj","sm","sr","ss","sxr1","sxr2","sxs","v"];   
		}

		// The function return an array of current variables
		function _getCurrentVariables(){
			return ["ibca","ibna","ical","ik1","ikr","iks","ina","inaca","inak","ipca","ipk","ito"]; //"ileak","Irel",
		}


		/* Gets parameter list which user can update from UI*/
		function _getParameters(){
			return ["s1","s2","ns1", "iType", "GNa" , "GCaL" , "Gto" , "Gkr" , "Gks" , "GK1"];
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
		* Here "baseplot" consists of "court" and "courtOther" which have courtBasePlot and courtOtherBasePlot respectively.
		*/

		function initializePlotSettings(){
			var tuscherPlots = [],
			tuscherOtherPlots = [],
			tuscherBasePlot,
			tuscherOtherBasePlot,               
			basePlots =[],
			plotSettings;

			//courtPlots
			tuscherPlots.push({key:"mainPlot", value: new Plot("Time (ms)", "V_m", false)});
			tuscherBasePlot = new BasePlot( 437.5, 240, new Point(0, 0), tuscherPlots);

			// courtOtherPlots

			var tOtherPlotsInit = [	{ key :  "ibca" ,  value : {name:"I_bCa", showDefault: false}},
									{ key  : "ibna",   value:  {name:"I_bNa", showDefault: false} },
									{ key  : "ical",   value : {name:"I_CaL", showDefault: true} },
									{ key  : "ik1",  value : {name:"I_K1", showDefault: false} },
									{ key  : "ikr",   value : {name:"I_Kr", showDefault: false} },
									{ key  : "iks",   value : {name:"I_Ks", showDefault: false}},									
									{ key  : "ina",  value : {name:"I_Na", showDefault: false}},
									{ key  : "inaca",  value : {name:"I_NaCa", showDefault: false}},
									{ key  : "inak", value : {name:"I_NaK", showDefault: false}},
									{ key  : "ipca", value : {name:"I_pCa", showDefault: false}},
									{ key  : "ipk", value : {name:"I_pK", showDefault: false}},
									{ key  : "ito", value : {name:"ito", showDefault: false}}];							
									

									/*{ key  : "ileak",  value : {name:"I_leak", showDefault: false}},
									{ key  : "Irel",  value : {name:"I_rel", showDefault: false}}*/

			tOtherPlotsInit.forEach(function(plotItem){
				tuscherOtherPlots.push({key: plotItem["key"], value: new Plot("Time (ms)", plotItem["value"]["name"], plotItem["value"]["showDefault"])});    
			});
			tuscherOtherBasePlot = new BasePlot( 437.5, 240, new Point(0, 300), tuscherOtherPlots);

			basePlots.push({key:"Tuscher", value : tuscherBasePlot});
			basePlots.push({key:"TuscherOther", value :tuscherOtherBasePlot});

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