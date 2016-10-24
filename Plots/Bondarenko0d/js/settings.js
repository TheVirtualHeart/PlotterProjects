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
		calculationSettings:{
			v:0.0,
			cai:0.0,
			cass:0.0,
			cajsr:0.0,
			cansr:0.0,
			ltrpn:0.0,
			htrpn:0.0,
			nai:0.0,
			ki:0.0,
			ol:0.0,
			cl1:0.0,
			cl2:0.0,
			cl3:0.0,
			cl4:0.0,
			il1:0.0,
			il2:0.0,
			il3:0.0,
			pc1:0.0,
			pc2:0.0,
			po1:0.0,
			po2:0.0,
			pryr:0.0,
			cna3:0.0,
			cna2:0.0,
			cna1:0.0,
			ona:0.0,
			ifna:0.0,
			i1na:0.0,
			i2na:0.0,
			icna2:0.0,
			icna3:0.0,
			ck0:0.0,
			ck1:0.0,
			ck2:0.0,
			ok:0.0,
			ik:0.0,
			atof:0.0,
			itof:0.0,
			nks:0.0,
			atos:0.0,
			itos:0.0,
			aur:0.0,
			iur:0.0,
			xakss:0.0,
			xikss:0.0,
			gktof:0.0,
			gktos:0.0,
			gkur:0.0,
			gkss:0.0,
			kf:0.0,
			kb:0.0,
			kmcl:0.0,
			ecl:0.0,
			po12:0.0,
			paramType: "septum",
			//parameters
			vmeklo:-10.0,
			vmekhi:190.0,
			nvmekt:20000,
			acap:1.534e-4,
			vmyo:25.84e-6,
			vjsr:0.12e-6,
			vnsr:2.098e-6,
			vss:1.485e-9,
			ko:5.4e3,
			nao:140.0e3,
			cao:1.8e3,
			nu1:4.5,
			nu2:1.74e-5,
			nu3:0.45,
			kmup:0.5,
			tautr:20.0,
			tauxfer:8.0,
			nexp:4.0,
			mexp:3.0,
			kaplus:0.006075,
			kaminus:0.07125,
			kbplus:0.00405,
			kbminus:0.965,
			kcplus:0.009,
			kcminus:0.0008,
			gcal:0.1729,
			ecal:63.0,
			kpcmax:0.23324,
			kpchalf:20.0,
			kpcb:0.0005,
			icalmax:7.0,
			ltrpntot:70.0,
			htrpntot:140.0,
			khtrpnplus:0.00237,
			khtrpnminus:3.2e-5,
			kltrpnplus:0.0327,
			kltrpnminus:0.0196,
			cmdntot:50.0,
			csqntot:15000.0,
			kmcmdn:0.238,
			kmcsqn:800.0,
			cm:1.0,
			ff:96.5,
			tt:298.0,
			rr:8.314,
			knaca:292.8,
			kmna:87.5e3,
			kmca:1.380e3,
			ksat:0.1,
			eta:0.35,
			inakmax:0.88,
			kmnai:21.0e3,
			kmko:1.5e3,
			ipcamax:1.0,
			kmpca:0.5,
			gcab:0.000367,
			gna:13.0,
			gnab:0.0026,
			gks:0.00575,
			gkr:0.078,
			gk1:0.2938 ,
			gclca:10.0,
			istimmag:47.0,
			stimdur:1.0,
			outputevery:0.5,
			stimdelay:0.0,
			//currents
			ical : 0.0 ,
			ipca : 0.0 ,
			inaca : 0.0 ,
			icab : 0.0 ,
			ina : 0.0 ,
			inab : 0.0 ,
			inak : 0.0 ,
			iktof : 0.0 ,
			iktos : 0.0 ,
			ik1 : 0.0 ,
			iks : 0.0 ,
			ikur : 0.0 ,
			ikss : 0.0 ,
			ikr : 0.0 ,
			iclca : 0.0 ,
			istim : 0.0 ,
			jleak : 0.0 ,
			jxfer : 0.0 ,
			jup : 0.0 ,
			jtrpn : 0.0 ,
			jrel : 0.0 ,
			jtr : 0.0 ,
			
			s1Start: 0,
			s1: 50,
			s2: 100,
			ns1: 2,
			timestep: 0.01
		},
		
		formSettings: {
			displayV 	: false,
			displayVt 	: false,
			displayCai 	: false,
			displayCass : false,
			displayCajsr : false,
			displayCansr : false,
			displayLtrpn : false,
			displayHtrpn : false,
			displayNai 	: false,
			displayKi 	: false,
			displayAtof : false,
			displayItof : false,
			displayNks  : false,
			displayAtos : false,
			displayItos : false,
			displayAur  : false,
			displayIur  : false,
			displayXakss : false,
			displayXikss : false,
			dispalyOl    : false,
			dispalyOna	: false,
			dispalyOk	: false,
			dispalyPryr	: false,
			dispalyPo12 : false,
			secondaryPlot: "",
			//current with labels 
			ina : "I_Na",
			ical : "I_CaL",
			iktof : "I_to,f",
			iktos : "I_to,s",
			ikur : "I_Kur",
			ikss : "I_Kss",
			ikr : "I_Kr",
			iks : "I_Ks",
			ik1 : "I_K1",
			inaca : "I_NaCa",
			inak : "I_NaK",
			ipca : "I_pCa",
			iclca : "I_Cl,Ca",
			inab : "I_Nab",
			icab : "I_Cab",            
			colors  : {
				aPDDI: "Orange",
				s1S2 : "Black",
				v    : "Red"
			}          
		}
	};
	

	// The function return an array of voltage variables
	function _getVoltageVariables(){
		return ["v","cai","cass","cajsr","cansr","ltrpn","htrpn","nai","ki","atof","itof","nks","atos","itos","aur","iur","xakss","xikss", "ol", "ona", "ok", "pryr", "po12"];
	}
	
	// The function return an array of current variables
	function _getCurrentVariables(){
		return ["ical","ipca","inaca","icab","ina","inab","inak","iktof","iktos", "ik1","iks","ikur","ikss","ikr","iclca"];
	}

	/*
		This function is used to initialize settings properties depending on "paramType"
		parameter. It can take two values 'septum' and 'apex', the former being the default value.
		@param {dfS} - setting object the value for which needs to be updated
		@param {paramTYpe} - string object specifying paramType. 
		
	*/
	
	
	function setDependents(paramType, calcSettings){
		//paramType -  can be either "septum" or "apex";
		var values = { 
			septum: {
				v :-82.4202,
				cai :0.115001,
				cass :0.115001,
				cajsr :1299.5,
				cansr :1299.5,
				ltrpn :11.2684,
				htrpn :125.29,
				nai :14.2371e3,
				ki :143.720e3,
				ol :0.930308e-18,
				cl1 :0.999876,
				cl2 :0.124216e-3,
				cl3 :0.578679e-8,
				cl4 :0.119816e-12,
				il1 :0.497923e-18,
				il2 :0.345847e-13,
				il3 :0.185106e-13,
				pc1 :0.999817,
				pc2 :0.16774e-3,
				po1 :0.149102e-4,
				po2 :0.951726e-10,
				pryr :0.0,
				cna3 :0.624646,
				cna2 :0.020752,
				cna1 :0.279132e-3,
				ona :0.713483e-6,
				ifna :0.153176e-3,
				i1na :0.673345e-6,
				i2na :0.155787e-8,
				icna2 :0.0113879,
				icna3 :0.34278,
				ck0 :0.998159,
				ck1 :0.992513e-3,
				ck2 :0.641229e-3,
				ok :0.175298e-3,
				ik :0.319128e-4,
				atof :0.265563e-2,
				itof :0.999977,
				nks :0.262753e-3,
				atos :0.417069e-3,
				itos :0.998543,
				aur :0.417069e-3,
				iur :0.998543,
				xakss :0.417069e-3,
				xikss :1.0,
				gktof:0.0798,
				gktos:0.0629,
				gkur:0.0975,
				gkss:0.0324,
				kf:0.023761,
				kb:0.036778,
				kmcl:10.0,
				ecl:-40.0,
				//adding po1 and po2
				po12 : 0.149102e-4 + 0.951726e-10,
				paramType: "septum"
			},
			apex : {
				v:-82.7837821,
				cai:0.101727332,
				cass:0.101728503,
				cajsr:639.33895,
				cansr:648.900228,
				ltrpn:10.2553416,
				htrpn:127.367678,
				nai:14881.1268,
				ki:143213.275,
				ol:3.19834326e-12,
				cl1:0.999882995,
				cl2:0.000116557,
				cl3:5.50236314e-9,
				cl4:2.71430957e-10,
				il1:2.95995147e-7,
				il2:2.51074864e-9,
				il3:3.87914406e-7,
				pc1:0.833770414,
				pc2:0.164567574,
				po1:0.00166200436,
				po2:7.35405104e-9,
				pryr:3.02791249e-16,
				cna3:0.636060347,
				cna2:0.0203362168,
				cna1:0.000262465621,
				ona:6.39717034e-7,
				ifna:0.000137230955,
				i1na:6.51035222e-7,
				i2na:3.31464334e-6,
				icna2:0.0106328465,
				icna3:0.332565886,
				ck0:0.99811781,
				ck1:0.00096611032,
				ck2:0.000629174643,
				ok:0.000248301657,
				ik:4.46323405e-5,
				atof:0.00256372607,
				itof:0.999978634,
				nks:0.000843624148,
				atos:0.000406556324,
				itos:0.978203214,
				aur:0.000406556324,
				iur:0.994055715,
				xakss:0.783445067,
				xikss:1.0,
				gktof:0.4067,
				gktos:0.0,
				gkur:0.160,
				gkss:0.050,
				kf:0.023761,
				kb:0.036778,
				kmcl:10.0,
				ecl:-40.0,
				po12 : 0.00166200436 + 7.35405104e-9,
				paramType: "apex"
			}
		},
		
		//default  "septum"
		pType = (! paramType) ? "septum": paramType;               
		utils.extend(calcSettings, values[pType]);

	}
	
	function _initialize(override){
		
		//init dependent varaibles
		setDependents(defaultSettings.calculationSettings["paramType"] , defaultSettings.calculationSettings);
		
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
		
		defaultSettings.calculationSettings.updateDependents = setDependents;
		return defaultSettings;
	}
	
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
	
});


