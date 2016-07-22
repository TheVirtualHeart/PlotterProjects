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
					paramType: "",
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
				displayAur : false,
				displayIur : false,
				displayXakss : false,
				displayXikss : false,
				dispalyOl: false,

				dispalyOna: false,
				dispalyOk: false,
				dispalyPryr: false,
				dispalyPo12 : false,
				secondaryPlot: "ical"
			}
		};

	//Setting plot setting dynamically
		defaultSettings["plotSettings"] = initializePlotSettings();	
		defaultSettings.calculationSettings["voltageVariables"] = _getVoltageVariables();
		defaultSettings.calculationSettings["currentVariables"] = _getCurrentVariables();		
		defaultSettings.calculationSettings["parameters"] = _getParameters();
		defaultSettings.calculationSettings.additionalVariables = _getAdditionalVariables();
		defaultSettings.calculationSettings["initCalculationSettings"] = initCalculationSettings;


		// The function return an array of voltage variables
		function _getVoltageVariables(){
			return ["v","cai","cass","cajsr","cansr","ltrpn","htrpn","nai","ki","atof","itof","nks","atos","itos","aur","iur","xakss","xikss", "ol", "ona", "ok", "pryr", "po12"];
		}

		// The function return an array of current variables
		function _getCurrentVariables(){
			return ["ical","ipca","inaca","icab","ina","inab","inak","iktof","iktos", "ik1","iks","ikur","ikss","ikr","iclca"];
		}

		//Gets parameter list which user can update from UI
		function _getParameters(){
			return ["s1","s2","ns1", "paramType","gna", "gcal", "gktof", "gktos", "gkr", "gks", "knaca", "gk1"];
		}

		/* The function return variables other than voltage and current which 
		require their values to be retained across iterations while calculations */
		function _getAdditionalVariables(){
			return ["ol","cl1","cl2","cl3","cl4","il1","il2","il3","ck1","ck2","ok","ik","ck0","cna1","cna2","cna3","ifna","i1na","i2na","icna2","icna3","pc1","pc2","jrel","jtr","jxfer","jleak","jup","jtrpn"];
		}


		/*
			This function is used to initialize settings properties depending on "paramType"
			parameter. It can take two values 'septum' and 'apex', the former being the default value.
			@param {dfS} - setting object the value for which needs to be updated
			@param {paramTYpe} - string object specifying paramType. 

		*/

		function initCalculationSettings(dfS, paramType){
			//paramType -  can be either "septum" or "apex";
			var cS = { 
				septum: {v :-82.4202,
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
				utils.extend(dfS.calculationSettings, cS[pType]);
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
		* Here "baseplot" consists of "bondarenko" and "bondarenkoOther" which have bondarenkoBasePlot and bondarenkoOtherBasePlot respectively.
		*/
 
		function initializePlotSettings(){
			var bondarenkoPlots = [],
			bondarenkoOtherPlots = [],
			bondarenkoBasePlot,
			bondarenkoOtherBasePlot,               
			basePlots =[],
			plotSettings;

			//bondarenkoPlots
			bondarenkoPlots.push({key:"mainPlot", value: new Plot("Time (ms)", "V_m", false)});
			bondarenkoBasePlot = new BasePlot( 437.5, 240, new Point(0, 0), bondarenkoPlots);

			// bondarenkoOtherPlots

			var bondarenkoPlotsInit = [	{ key :  "ical" ,  value : {name:"I_CaL",  showDefault: false}},
										{ key :  "ipca" ,  value : {name:"I_pCa",  showDefault: false}},
										{ key :  "inaca" , value : {name:"I_NaCa", showDefault: false}},
										{ key :  "icab" ,  value : {name:"I_Cab", showDefault: false}},
										{ key :  "ina" ,   value : {name:"I_Na",  showDefault: false}},
										{ key :  "inab" ,  value : {name:"I_Nab", showDefault: false}},
										{ key :  "inak" ,  value : {name:"I_NaK", showDefault: false}},
										{ key :  "iktof" , value : {name:"I_to,f", showDefault: false}},
										{ key :  "iktos" , value : {name:"I_to,s", showDefault: false}},
										{ key :  "ik1" ,   value : {name:"I_K1",  showDefault: false}},
										{ key :  "iks" ,   value : {name:"I_Ks",  showDefault: false}},
										{ key :  "ikur" ,  value : {name:"I_Kur", showDefault: false}},
										{ key :  "ikss" ,  value : {name:"I_Kss", showDefault: false}},
										{ key :  "ikr" ,   value : {name:"I_Kr",  showDefault : false}},
										{ key :  "iclca" , value : {name:"I_Cl,Ca", showDefault: false}}];							

			bondarenkoPlotsInit.forEach(function(plotItem){
				bondarenkoOtherPlots.push({key: plotItem["key"], value: new Plot("Time (ms)", plotItem["value"]["name"], plotItem["value"]["showDefault"])});    
			});
			bondarenkoOtherBasePlot = new BasePlot( 437.5, 240, new Point(0, 300), bondarenkoOtherPlots);

			basePlots.push({key:"Bondarenko", value : bondarenkoBasePlot});
			basePlots.push({key:"BondarenkoOther", value :bondarenkoOtherBasePlot});

			plotSettings = new PlotSettings(basePlots);

			return plotSettings;
		};	



		return{

    	/**
         * This function modifies any default settings
         */
         initialize: function(override) {

         	defaultSettings = _.merge(defaultSettings, override);
         	// init value base on paramType
         	initCalculationSettings(defaultSettings);
         },  

        /**
         * Retrieves the settings
         */

         getSettings: function() {         	
         	return _.cloneDeep(defaultSettings);
         }
     }

 });


