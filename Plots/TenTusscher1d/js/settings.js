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
				v:0.0,
				cai:0.0,
				casr:0.0,
				cass:0.0,
				nai:0.0,
				ki:0.0,
				sm:0.0,
				sh:0.0,
				sj:0.0,
				sxr1:0.0,
				sxr2:0.0,
				sxs:0.0,
				sr:0.0,
				ss:0.0,
				sd:0.0,
				sf:0.0,
				sf2:0.0,
				sfcass:0.0,
				srr:0.0, 

			//parameters
				Ko:5.4,
				Cao:2.0,
				Nao:140.0,
				Vc:0.016404,
				Vsr:0.001094,
				Vss:0.00005468,
				Bufc:0.2,
				Kbufc:0.001,
				Bufsr:10.,
				Kbufsr:0.3,
				Bufss:0.4,
				Kbufss:0.00025,
				Vmaxup:0.006375,
				Kup:0.00025,
				Vrel:0.102,
				k3:0.060,
				k4:0.005,
				k1prime:0.15,
				k2prime:0.045,
				EC:1.5,
				maxsr:2.5,
				minsr:1.,
				Vleak:0.00036,
				Vxfer:0.0038,
				RR:8314.3,
				FF:96486.7,
				TT:310.0,
				CAPACITANCE:0.185,
								
				Gkr:0.153,
				pKNa:0.03,
				GK1:5.405,
				alphanaca:2.5,
				GNa:14.838,
				GbNa:0.00029,
				KmK:1.0,
				KmNa:40.0,
				knak:2.724,
				GCaL:0.00003980,
				GbCa:0.000592,
				knaca:1000,
				KmNai:87.5,
				KmCa:1.38,
				ksat:0.1,
				n:0.35,
				GpCa:0.1238,
				KpCa:0.0005,
				GpK:0.0146,
				stimdur:1.0,
				stimstrength:-38.0,
				casshi: 1.0,
				iType: "epi", //set itype=1 for epi, =2 for M, =3 for endo
				Gto:0.294,
				Gks:0.098,

			//currents
				sItot: 0,
				ikr: 0,
				iks: 0,
				ik1: 0,
				ito: 0,
				ina: 0,
				ibna: 0,
				ical: 0,
				ibca: 0,
				inaca: 0,
				ipca: 0,
				ipk: 0,
				inak: 0,
				Irel: 0,
				Ileak: 0,
				Iup: 0,
				Ixfer: 0,
				Istim: 0,

			//numerical parameters
				s1Start: 0,
				s1: 500,
				s2: 900,
				ns1:3,
				timestep:.02
			},

			formSettings: {
				"displayAPDDI" : true, 
				"displayS1S2" : false, 
				"displayV" : true,
				"displayNai" : false, 
				"displayKi" : false, 
				"displaySm" : false, 
				"displaySh" : false,
				"displaySj"  : false, 
				"displaySxr1" : false,
				"displaySxr2" : false, 
				"displaySxs" : false,
				"displaySr"  : false,
				"displaySs" : false, 
				"displaySd" : false,
				"displaySf" : false,
				"displaySfcass" : false, 
				"displaySrr"  : false,
				"displayCai" : false, 
				"displayCasr" : false,
				"displaySf2" : false,
				"displayCass"  : false, 
				secondaryPlot: "ical"
			}
		};


		//Setting plot setting dynamically
		defaultSettings["plotSettings"] = initializePlotSettings();		
		defaultSettings.calculationSettings.voltageVariables = _getVoltageVariables();
		defaultSettings.calculationSettings.currentVariables = _getCurrentVariables();
		//defaultSettings.calculationSettings.additionalVariables = _getAdditionalVariables();
		defaultSettings.calculationSettings.parameters = _getParameters();

		// The function return an array of voltage variables
		function _getVoltageVariables(){
			return ["v","cai","casr","cass","nai","ki","sm","sh","sj","sxr1","sxr2","sxs","sr","ss","sd","sf","sf2","sfcass","srr"];        
		}

		// The function return an array of current variables
		function _getCurrentVariables(){
			return ["ikr","iks","ik1","ito","ina","ibna","ical","ibca","inaca","ipca","ipk","inak"];
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

			var tOtherPlotsInit = [	{ key :  "ibca" ,  	value : {name:"I_bCa", showDefault: false}},
									{ key  : "ibna",   	value:  {name:"I_bNa", showDefault: false} },
									{ key  : "ical",   	value : {name:"I_CaL", showDefault: true} },
									{ key  : "ik1",  	value : {name:"I_K1", showDefault: false} },
									{ key  : "ikr",   	value : {name:"I_Kr", showDefault: false} },
									{ key  : "iks",   	value : {name:"I_Ks", showDefault: false}},									
									{ key  : "ina",  	value : {name:"I_Na", showDefault: false}},
									{ key  : "inaca",  	value : {name:"I_NaCa", showDefault: false}},
									{ key  : "inak", 	value : {name:"I_NaK", showDefault: false}},
									{ key  : "ipca", 	value : {name:"I_pCa", showDefault: false}},
									{ key  : "ipk", 	value : {name:"I_pK", showDefault: false}},
									{ key  : "ito", 	value : {name:"Ito", showDefault: false}}];
															
																		
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