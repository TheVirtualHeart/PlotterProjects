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
			
			displayV: false,
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
			secondaryPlot: "",
			//current with labels 
			xna : "I_Na",
			xk1 : "I_K1",
			xto : "I_to",
			xkur : "I_Kur",
			xkr : "I_Kr",
			xks : "I_Ks",
			xcal : "I_Cal",
			xpca : "I_pCa",
			xnak : "I_NaK",
			xnaca : "I_NaCa",
			xbna : "I_bNa",
			xbca : "I_bCa",
			xto : "I_Total", 
			
			colors  : {
				aPDDI: "Orange",
				s1S2 : "Black",
				v    : "Red"
			}          
		}
	};
	
	// The function return an array of voltage variables
	function _getVoltageVariables(){
		return ["v" ,  "xd" , "xf" , "xfca" , "xh" , "xj" , "xm" , "xoa" , "xoi" , "xr" , "xs" , "xu" , "xua" , "xui" , "xv" , "xw","ccai","ccaup", "ccarel"];        
	}
	
	// The function return an array of current variables
	function _getCurrentVariables(){
		return ["xbca" , "xbna" , "xcal" , "xk1" , "xkr" , "xks" , "xkur" , "xna" , "xnaca" , "xnak" , "xpca" , "xrel" , "xto" ];
	}
	
	function _initialize(override){
		
		//override colors
		defaultSettings = _.merge(defaultSettings, override);
		
		//Adding additional properties    
		defaultSettings.calculationSettings.voltageVariables = _getVoltageVariables();
		defaultSettings.calculationSettings.currentVariables =  _getCurrentVariables();
		
		//Setting plot setting dynamically            
		defaultSettings["plotSettings"] = utils.initializePlotSettings( _getCurrentVariables(), defaultSettings.formSettings);         
		
		// assign colors            
		defaultSettings["formSettings"]["colors"] =  utils.extend(defaultSettings["formSettings"]["colors"],
		utils.assignColors(utils.removeArrayItems(_getVoltageVariables(), ["v"])));
		
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
			// = _.merge(defaultSettings, override);   
			return   _initialize(override);
		},   
		
		/**
			* Retrieves the settings
		*/
		getSettings: function() {            
			return _.cloneDeep(defaultSettings);
		}
	}
	
});  // settings module ends

