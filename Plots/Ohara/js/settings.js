/**
	* This module creates a settings singleton. These will be
	* the default settings, which will be modified as the 
	* program runs.
	*/
	define(["utility"],
		function Settings(utils) {

			var defaultSettings = {

				calculationSettings: {
					v:-87,
					nai:7,
					nass:7,
					ki:145,
					kss:145,
					cai:1.0e-4,
					cass:1.0e-4,
					cansr:1.2,
					cajsr:1.2,
					xm:0,
					xhf:1,
					xhs:1,
					xj:1,
					xhsp:1,
					xjp:1,
					xml:0,
					xhl:1,
					xhlp:1,
					xa:0,
					xif:1,
					xis:1,
					xap:0,
					xifp:1,
					xisp:1,
					xd:0,
					xff:1,
					xfs:1,
					xfcaf:1,
					xfcas:1,
					xjca:1,
					xnca:0,
					xffp:1,
					xfcafp:1,
					xrf:0,
					xrs:0,
					xs1:0,
					xs2:0,
					xk1:1,
					jrelnp:0,
					jrelp:0,
					camkt:0,
					jnakna:0,
					jnakk:0,

				//parameter
				nao:140.0,
				cao:1.8,
				ko:5.4,
				R:8314.0,
				T:310.0,
				F:96485.0,
				L:0.01,
				rad:0.0011,
				vcell:0.0,
				Ageo:0.0,
				Acap:0.0,
				vmyo:0.0,
				vnsr:0.0,
				vjsr:0.0,
				vss:0.0,
				KmCaMK:0.15,
				aCaMK:0.05,
				bCaMK:0.00068,
				CaMKo:0.05,
				KmCaM:0.0015,
				PKNa:0.01833,
				Ahf:0.99,
				Ahs:.01,			
				GNa:75,
				PCa :0.0001,
				Gto :0.02,
				GKr :0.046,
				GKs :0.0034,
				GK1 :0.1908,
				GNaL :0.0075,
				Gncx :0.0008,
				thL:200.0,
				tjca:75.0,
				Kmn:0.002,
				k2n:1000.0,
				zca:2.0,
				kna1:15.0,
				kna2:5.0,
				kna3:88.12,
				kasymm:12.5,
				wna:6.0e4,
				wca:6.0e4,
				wnaca:5.0e3,
				kcaon:1.5e6,
				kcaoff:5.0e3,
				qna:0.5224,
				qca:0.1670,
				KmCaAct:150.0e-6,
				zna:1.0,
				k1p:949.5,
				k1m:182.4,
				k2p:687.2,
				k2m:39.4,
				k3m:79300.0,
				k4m:40.0,
				Knai0:9.073,
				Knao0:27.78,
				delta:-0.1550,
				Kki:0.5,
				Kko:0.3582,
				MgADP:0.05,
				MgATP:9.8,
				Kmgatp:1.698e-7,
				H:1.0e-7,
				eP:4.2,
				Khp:1.698e-7,
				Knap:224.0,
				Kxkur:292.0,
				zk:1.0,
				PNab:3.75e-10,
				PCab:2.5e-8,
				GpCa:0.0005,
				amp:-80.0,
				duration:0.5,
				bt:4.7,
				kmcmdn:0.00238,
				trpnmax:0.07,
				kmtrpn:0.0005,
				BSRmax:0.047,
				KmBSR:0.00087,
				BSLmax:1.124,
				KmBSL:0.0087,
				csqnmax:10.0,
				kmcsqn:0.8,
				icelltype: 0,  //endo = 0, epi = 1, M = 2
				
				//currents
				ina: 0.0,
				inal: 0.0,
				ito: 0.0,
				ical: 0.0,
				icana: 0.0,
				icak: 0.0,
				ikr: 0.0,
				iks: 0.0,
				ik1: 0.0,
				inaca : 0.0, // it is  inaca_i + inaca_ss
				inak: 0.0,
				ikb: 0.0,
				inab: 0.0,
				icab: 0.0,
				ipca: 0.0,			
				jdiffna: 0.0,
				jdiffk: 0.0,
				jdiff: 0.0,
				jrel: 0.0,
				jleak: 0.0,
				jup: 0.0,
				jtr: 0.0,
				istim: 0.0,
				inaca_i : 0.0,
				inaca_ss : 0.0,
				
				//numerical parameters
				s1Start: 0,
				s1: 500,
				s2: 400,
				ns1:3,
				timestep: 0.01,
				
			},
			
			formSettings: {
				displayAPDDI : true,
				displayS1S2 : false,
				displayV : true,
				displayNai : false,
				displayNass : false,
				displayKi : false,
				displayKss : false,
				displayCai : false,
				displayCass : false,
				displayCansr : false,
				displayCajsr : false,
				displayXm : false, 
				displayXhf : false,
				displayXhs : false,
				displayXj : false,
				displayXhsp : false, 
				displayXjp : false,
				displayXml : false,
				displayXhl : false,
				displayXhlp : false, 
				displayXa : false,
				displayXif : false,
				displayXis : false,
				displayXap : false, 
				displayXifp : false,
				displayXisp : false,
				displayXd : false,
				displayXff : false, 
				displayXfs : false,
				displayXfcaf : false,
				displayXfcas : false,
				displayXjca : false, 
				displayXnca : false,
				displayXffp : false,
				displayXfcafp : false,
				displayXrf : false, 
				displayXrs : false,
				displayXs1 : false,
				displayXs2 : false,
				displayXk1 : false, 
				displayJrelnp : false,
				displayJrelp : false,
				displayCamkt : false,
				secondaryPlot : "ical"
			}
		};
		
	//Setting plot setting dynamically
	defaultSettings["plotSettings"] = initializePlotSettings();		
	defaultSettings.calculationSettings.voltageVariables = _getVoltageVariables();
	defaultSettings.calculationSettings.currentVariables = _getCurrentVariables();
	defaultSettings.calculationSettings.additionalVariables = _getAdditionalVariables();
	defaultSettings.calculationSettings.setCellTypeDependents = _setCellTypeDependents;
	
	
	
	// The function return an array of voltage variables
	function _getVoltageVariables(){
		return ["v","nai","nass","ki","kss","cai","cass","cansr","cajsr","xm","xhf","xhs","xj","xhsp","xjp","xml","xhl","xhlp","xa","xif","xis","xap","xifp","xisp","xd","xff",
		"xfs","xfcaf","xfcas","xjca","xnca","xffp","xfcafp","xrf","xrs","xs1","xs2","xk1","jrelnp","jrelp","camkt"];        
	}
	
	// The function return an array of current variables  //"inaca_i","inaca_ss"
	function _getCurrentVariables(){
		return ["ina","inal","ito","ical","icana","icak","ikr","iks","ik1","inaca","inak","ikb","inab","icab","ipca"];
	}
	
	/* Gets additional variables list which are used across iterations*/
	function _getAdditionalVariables(){
		return ["jdiffna","jdiffk","jdiff","jrel","jleak","jup","jtr","jnakna","jnakk", "inaca_i", "inaca_ss"];
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
		* Here "baseplot" consists of "Ohara" and "OharaOther" which have OharaPlots and OharaOtherBasePlot respectively.
		*/

		function initializePlotSettings(){
			var OharaPlots = [],
			OharaOtherPlots = [],
			OharaBasePlot,
			OharaOtherBasePlot,               
			basePlots =[],
			plotSettings;

		//OharaPlots
		OharaPlots.push({key:"mainPlot", value: new Plot("Time (ms)", "V_m", false)});
		OharaBasePlot = new BasePlot( 437.5, 240, new Point(0, 0), OharaPlots);
		
		// OharaOtherPlots
		
		var oHOtherPlotsInit = [{ key :  "ina" ,  	value : {name: "I_Na, fast", showDefault: false}},
		{ key :  "inal",  	value : {name: "I_Na, late", showDefault: false}},
		{ key :  "ito" ,  	value : {name: "I_to", showDefault: false}},
		{ key :  "ical" ,  	value : {name: "I_Cal, late", showDefault: true}},
		{ key :  "icana" ,  value : {name: "I_CaNa", showDefault: false}},
		{ key :  "icak"  ,  value : {name: "I_CaK", showDefault: false}},
		{ key :  "ikr"  ,  	value : {name: "I_Kr", showDefault: false}},
		{ key :  "iks"  ,  	value : {name: "I_Ks", showDefault: false}},				
		{ key :  "ik1"  ,  	value : {name: "I_Kl", showDefault: false}},
		{ key :  "inaca",   value : {name: "I_NaCa", showDefault: false}},
		{ key :  "inak",    value : {name: "I_NaK", showDefault: false}},
		{ key :  "ikb",  	value : {name: "I_Kb", showDefault: false}},
		{ key :  "inab",  	value : {name: "I_Nab", showDefault: false}},
		{ key :  "icab",  	value : {name: "I_Cab", showDefault: false}},
		{ key :  "ipca",  	value : {name: "I_pCa", showDefault: false}}];
		
		oHOtherPlotsInit.forEach(function(plotItem){
			OharaOtherPlots.push({key: plotItem["key"], value: new Plot("Time (ms)", plotItem["value"]["name"], plotItem["value"]["showDefault"])});    
		});
		OharaOtherBasePlot = new BasePlot( 437.5, 240, new Point(0, 300), OharaOtherPlots);
		
		basePlots.push({key:"Ohara", value : OharaBasePlot});
		basePlots.push({key:"OharaOther", value :OharaOtherBasePlot});
		
		plotSettings = new PlotSettings(basePlots);
		
		return plotSettings;
	};
	
	/* This function is responsible for set varaibles values dependent on the cell type;
		*@param {dfS} - object
		*@param  {cellType} string
		*/

		function _setCellTypeDependents(dfS, cellType){
		//endo = 0, epi = 1, M = 2
		var dependents = {
			endo: {
				GNa: 75,
				PCa: 0.0001,
				Gto: 0.02,
				GKr: 0.046,
				GKs: 0.0034,
				GK1: 0.1908,
				GNaL: 0.0075,
				Gncx: 0.0008,
				icelltype:0
			},
			epi: {
				GNa: 75,
				PCa: 0.00012,
				Gto: 0.08,
				GKr: 0.0598,
				GKs: 0.00476,
				GK1: 0.22896,
				GNaL: 0.0045,
				Gncx: 0.00088,
				icelltype:1
			},
			M: {
				GNa: 75,
				PCa: 0.00025,
				Gto: 0.08,
				GKr: 0.0368,
				GKs: 0.0034,
				GK1: 0.24804,
				GNaL: 0.0075,
				Gncx: 0.00112,
				icelltype:2
			}
		},		
		typeData = dependents[cellType];

		if(typeData){
			for(var prop in typeData){
				dfS.calculationSettings[prop] =  typeData[prop];
			}
			
		}
	}	
	
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