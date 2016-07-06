/**
* This module creates a settings singleton. These will be
* the default settings, which will be modified as the 
* program runs.
*/
define(["utility"],
	function Settings(utils) {

		var defaultSettings = {

			calculationSettings: {

				// initial
				ccai:0.000102,
				ccarel:1.49,
				ccaup:1.49,
				cki:139,
				cnai:11.2,
				fn:-0.2,

				//voltages
				v:-81.2,  //imp			
				xd:0.000137,
				xf:0.999,
				xfca:0.775,
				xh:0.965,
				xj:0.978,
				xm:0.00291,
				xoa:0.0304,
				xoi:0.999,
				xr:0.0000329,
				xs:0.0187,
				xu:0.0,
				xua:0.00496,
				xui:0.999,
				xv:1,
				xw:0.999,

				//params
				ccao:1.8,
				ccaupmax:15.0,
				cko:5.4,
				cm:100.0,
				cmdnmax:0.05,
				cnao:140.0,
				csqnmax:10.0,
				gamma:0.35,
				gbca:0.00113,
				gbna:0.000674,
				gcal:0.1238,
				gk1:0.09,
				gkr:0.0294,
				gks:0.129,
				gna:7.8,
				gto:0.1652,
				r:8.3143,
				taufca:2.,
				tautr:180.0,
				tauu:8.0,
				trpnmax:0.07,
				vcell:20100.,
				vi:13668.,
				vrel:96.48,
				vup:1109.52,
				xinacamax:1600.0,
				xinakmax:0.60,
				xipcamax:0.275,
				xkmca:1.38,
				xkmcmdn:0.00238,
				xkmcsqn:0.8,
				xkmko:1.5,
				xkmna:87.5,
				xkmnai:10.0,
				xkmtrpn:0.0005,
				xkq10:3.0,
				xkrel:30.0,
				xksat:0.1,
				xkup:0.00092,
				xt:310.0,
				xupmax:0.005,
				xxf:96.4867,
				xstimamp:19.0,
				xstimdur:3.0,

				//currents
				xbca:0,
				xbna:0,
				xcal:0,
				xk1:0,
				xkr:0,
				xks:0,
				xkur:0,
				xna:0,
				xnaca:0,
				xnak:0,
				xpca:0,
				xrel:0,
				xto:0,

				//numerical parameters
				s1Start: 0,
				s1: 500,
				s2: 500,
				ns1:1,
				timestep: 0.01,

				//special case
				exptauxr_t:0.0,
				xinfxr_t:0.0,
				exptauxs_t:0.0,
				xinfxs_t:0.0
			},

			formSettings: {

				displayV: true,
				displayXH: false,
				displayXD: false,
				displayXOa: false,
				displayXUa: false,
				displayXR: false,
				displayXFca: false,
				displayXV: false,
				displayXM: false,
				displayXJ: false,
				displayXF: false,
				displayXOi: false,
				displayXUi: false,
				displayXS: false,
				displayXU: false,
				displayXW: false,
				displayAPDDI: false,
				displayS1S2: false,
				displayCcai: false,
				displayCcaup: false,
				displayCcarel: false,           
				secondaryPlot: "xcal",
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
			return ["v" ,  "xd" , "xf" , "xfca" , "xh" , "xj" , "xm" , "xoa" , "xoi" , "xr" , "xs" , "xu" , "xua" , "xui" , "xv" , "xw","ccai","ccaup", "ccarel"];        
		}

		// The function return an array of current variables
		function _getCurrentVariables(){
			return ["xbca" , "xbna" , "xcal" , "xk1" , "xkr" , "xks" , "xkur" , "xna" , "xnaca" , "xnak" , "xpca" , "xrel" , "xto" ];
		}

		/* The function return variables other than voltage and current which 
		require their values to be retained across iterations while calculations */
		function _getAdditionalVariables(){
			return [ "fn", "exptauxr_t", "xinfxr_t", "exptauxs_t", "xinfxs_t"];
		}


		/* Gets parameter list which user can update from UI*/
		function _getParameters(){
			return ["gna","gcal","gto","gks","gkr","gk1","xinacamax"];
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
			this.unitPerTick 	=  new Point(200, 0.10), 
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
			var courtPlots = [],
			courtOtherPlots = [],
			courtBasePlot,
			courtOtherBasePlot,               
			basePlots =[],
			plotSettings;

			//courtPlots
			courtPlots.push({key:"mainPlot", value: new Plot("Time (ms)", "V_m", false)});
			courtBasePlot = new BasePlot( 437.5, 240, new Point(0, 0), courtPlots);

			// courtOtherPlots

			var cOtherPlotsInit = [	{ key :  "xna" ,  value : {name:"I_Na", showDefault: false}},
									{ key  : "xk1",   value: {name:"I_K1", showDefault: false} },
									{ key  : "xto",   value : {name:"I_to", showDefault: false} },
									{ key  : "xkur",  value : {name:"I_Kur", showDefault: false} },
									{ key  : "xkr",   value : {name:"I_Kr", showDefault: false} },
									{ key  : "xks",   value : {name:"I_Ks", showDefault: true}},
									{ key  : "xcal",  value : {name:"I_Cal", showDefault: false}},
									{ key  : "xpca",  value : {name:"I_pCa", showDefault: false}},
									{ key  : "xnak",  value : {name:"I_NaK", showDefault: false}},
									{ key  : "xnaca", value : {name:"I_NaCa", showDefault: false}},
									{ key  : "xbna", value : {name:"I_bNa", showDefault: false}},
									{ key  : "xbca", value : {name:"I_bCa", showDefault: false}},
									{ key  : "xto",  value : {name:"I_Total", showDefault: false}}];

			cOtherPlotsInit.forEach(function(plotItem){
				courtOtherPlots.push({key: plotItem["key"], value: new Plot("Time (ms)", plotItem["value"]["name"], plotItem["value"]["showDefault"])});    
			});
			courtOtherBasePlot = new BasePlot( 437.5, 240, new Point(0, 300), courtOtherPlots);

			basePlots.push({key:"Court", value : courtBasePlot});
			basePlots.push({key:"CourtOther", value :courtOtherBasePlot});

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

});  // settings module ends