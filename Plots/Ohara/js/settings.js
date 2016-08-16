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
			icelltype: "endo",  //endo = 0, epi = 1, M = 2
			
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
			displayAPDDI : false,
			displayS1S2 : false,
			displayV : false,
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
			secondaryPlot : "",
			//current labels
			ina : "I_Na,fast",
			ical : "I_Cal",
			icana : "I_CaNa",
			icak : "I_CaK",
			ito : "I_to",
			ikr : "I_Kr",
			iks : "I_Ks",
			ik1 : "I_K1",
			inal : "I_Na,late",
			inaca : "I_NaCa",
			inak : "I_NaK",
			ipca : "I_pCa",
			inab : "I_Nab",
			icab : "I_Cab",
			ikb : "I_Kb",
			colors  : {
				aPDDI: "Orange",
				s1S2 : "Black",
				v    : "Red"
			}    
		}
	};
	
	
	// The function return an array of voltage variables
	function _getVoltageVariables(){
		return ["v","nai","nass","ki","kss","cai","cass","cansr","cajsr","xm","xhf","xhs","xj","xhsp","xjp","xml","xhl","xhlp","xa","xif","xis","xap","xifp","xisp","xd","xff",
		"xfs","xfcaf","xfcas","xjca","xnca","xffp","xfcafp","xrf","xrs","xs1","xs2","xk1","jrelnp","jrelp","camkt"];        
	}
	
	// The function return an array of current variables  //"inaca_i","inaca_ss"
	function _getCurrentVariables(){
		return ["ina", "inal", "ito", "ical", "icana", "icak", "ikr", "iks", "ik1", "inaca", "inak", "ikb", "inab", "icab", "ipca"];
	}

	
	/* This function is responsible for set varaibles values dependent on the cell type;
		*@param {dfS} - object
		*@param  {cellType} string
	*/
	
	function setDependents(selectedItype, calcSettings){
		
		var values = {
			endo: {
				GNa: 75,
				PCa: 0.0001,
				Gto: 0.02,
				GKr: 0.046,
				GKs: 0.0034,
				GK1: 0.1908,
				GNaL: 0.0075,
				Gncx: 0.0008,
				icelltype: "endo"
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
				icelltype: "epi"
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
				icelltype: "M"
			}
		},		
		selectedTypeValues = values[selectedItype];
		
		if(selectedTypeValues){
			for(var prop in selectedTypeValues){
				calcSettings[prop] =  selectedTypeValues[prop];
			}			
		}
	}
	
	function _initialize(override){
		
		defaultSettings = _.merge(defaultSettings, override);
		
		//Adding additional properties    
		defaultSettings.calculationSettings.voltageVariables = _getVoltageVariables();
		defaultSettings.calculationSettings.currentVariables =  _getCurrentVariables();
		
		//Setting plot setting dynamically            
		defaultSettings["plotSettings"] = utils.initializePlotSettings( _getCurrentVariables(), defaultSettings.formSettings);         
		
		// assign colors            
		defaultSettings["formSettings"]["colors"] =  utils.extend(defaultSettings["formSettings"]["colors"],
		utils.assignColors(utils.removeArrayItems(_getVoltageVariables(), ["v"])));
		
		defaultSettings.calculationSettings.updateDependents = setDependents;                                
		
		return defaultSettings;			
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
			return _initialize(override); 
		},   
		
		/**
			* Retrieves the settings
		*/
		getSettings: function() {            
			return _.cloneDeep(defaultSettings);
		}
	}
	
});