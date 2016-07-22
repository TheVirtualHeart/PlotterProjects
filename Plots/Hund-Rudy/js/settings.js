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
	var defaultSettings =  {        
		calculationSettings: {
			zna: 1.0,		zk: 1.0,		zcl: -1.0,
			zca: 2.0,		ganai: 0.75,	ganao: 0.75,
			gaki: 0.75,		gako: 0.75,		gacao: 0.341,
			gacai: 1.0,		csqnbar: 10.0,	kmcsqn: 0.8,
			kmtrpn: 0.5e-3,	kmcmdn: 2.38e-3,trpnbar: 70e-3,
			cmdnbar: 50e-3,	alphacamk: 0.05,betacamk: 0.00068,
			bsrbar: 0.047,	kmbsr: 0.00087,	bslbar: 1.124,
			kmbsl: 0.0087,	sstau: 0.2,		temp: 310.0,
			
			frdy: 96485.0,	R: 8314.0,		pi: 3.14,
			radius: 0.0011,	length: 0.01,	rcg: 2.0,

            //placed in Calculator.calculateConstants().
			// vcell: 1000.*pi*radius*radius*length,
			// ageo: 2.*pi*radius*radius + 2.*pi*radius*length,
			// acap: rcg*ageo,
			// vmyo: vcell*0.68,
			// vnsr: vcell*0.0552,
			// vjsr: vcell*0.0048,
			// vss: vcell*0.02,
			
            camk0: 0.05,
			kmcam: 0.0015,	kmcamk: 0.15,	nao: 140,
			ko: 5.4,		cao: 1.8,		clo: 100.0,
			// for 2*diastolic threshold, istimmag: -64.0	
			istimmag: -66.0,S1delay: 1.0,	xstimdur: 1.0,//called as stimdur in fortran code
			gna: 8.25,		pcab: 0.0000001995084, //0.1225*0.003016*0.00054,
			pca: 0.000243,	fca_dtaucamkbar: 10.0,gbarclb: 0.000225,
			gbark1: 0.5,	gkp: 0.00276,	gbarkr: 0.0138542,
			prnak: 0.01833,	vmax: 4.5,		kmcaact: 0.000125,
			kmnai: 12.3,	kmnao: 87.5,	kmcai: 0.0036,
			kmcao: 1.3,		nu: 0.35,		ksat: 0.27,
			gnakbar: 0.61875, /*0.275*2.25,*/hill: 2,
			kmnainak: 10,	kmko: 1.5,		gbarnal: 0.0065,
			ipcabar: 0.0575,kmpca: 0.0005,	gbarto1: 0.19, // 0.019?
			pcl: 0.0000004,	kmto2: 0.1502,	ctkclbar: 0.0000070756,
			ctnaclbar: 0.0000098443,		qreldtaucamkbar: 10.0,
			qleakbar: 0.004375,				nsrbar: 15.0,
			qupbar: 0.004375,				kmup: 0.00092,
			dqupcamkbar: 0.75,				dkmplbbar: 0.00017,
			tautr: 120.0,	powtau: 10.0,	hltau: 600.0,
			aatau: 1.0,		rotau: 3.0,     gksbar: 0.0248975,
            gks: 0.0248975,

			//helpers for currents
			qleak: 0,
			qrel: 0,
			qtr: 0,
			qup: 0,
			kcl: 0,
			nacl: 0,

			//numerical parameters
			s1Start: 0,
			s1: 430,
			s2: 900,
			ns1: 3,
			timestep: 0.01,

			//initial values
			v:  -86.9351482,						
			cai:  8.34E-05,			
            cajsr:  1.27169598,			
            camkactive:  0.003264868,			
            camktrap:  0.000632046,			
            cansr:  1.271695903,			
            car:  8.34E-05,			
            cli:  18.90029866,			
            ki:  142.0142622,			
            nai:  9.875593321,
            xa:  0.01303108,			
            xaa:  0.000555155,			
            xd:  1.38E-06,			
            xdpower:  8.987394846,			
            xf:  0.999967371,			
            xf2:  0.999964108,			
            xfca:  0.985118263,			
            xfca2:  1,			
            xh:  0.990199813,			
            xhl:  0.339310414,			
            xi:  0.999972058,			
            xi2:  0.999813749,			
            xj:  0.993630289,			
            xm:  0.00111859,			
            xml:  0.00111859,			
            xr:  1.40E-08,			
            xri:  0.999950186,			
            xro:  0.0,			
            xs1:  0.018988645,			
            xs2:  0.018988645,			
			
			// initialize other dynamic variables

      		
      		//currents

      		icab: 0,
			icalca: 0,
			iclb: 0,
			ik1: 0,
			ikp: 0,
			ikr: 0,
			iks: 0,
			ina: 0,
			inaca: 0,
			inak: 0,
			inal: 0,
			ipca: 0,
			ito1: 0,
			ito2: 0
		},

        formSettings: { 

	        displayV: true,
	        displayCai: false,
			displayCajsr: false,
			displayCamkactive: false,
			displayCamktrap: false,
			displayCansr: false,
			displayCar: false,
			displayCli: false,
			displayKi: false,
			displayNai: false,
			displayXa: false,
			displayXaa: false,
			displayXd: false,
			displayXdpower: false,
			displayXf: false,
			displayXf2: false,
			displayXfca: false,
			displayXfca2: false,
			displayXh: false,
			displayXhl: false,
			displayXi: false,
			displayXi2: false,
			displayXj: false,
			displayXm: false,
			displayXml: false,
			displayXr: false,
			displayXri: false,
			displayXro: false,
			displayXs1: false,
			displayXs2: false,
			displayAPDDI: false,
        	displayS1S2: false,
			secondaryPlot: "iks"
		}
	};

    //Setting plot setting dynamically
    defaultSettings["plotSettings"] = initializePlotSettings();

    defaultSettings.calculationSettings.voltageVariables= getVoltageVariables();
    defaultSettings.calculationSettings.currentVariables = getCurrentVariables();
    defaultSettings.calculationSettings.additionalVariables = getAdditionalVariables();
    defaultSettings.calculationSettings.parameters = getParameters();

    // The function return an array of voltage variables
    function getVoltageVariables(){
        return ["v",	 "cai",	   "cajsr",	"camkactive",	"camktrap",	"cansr",
        		"car",	 "cli",	  "ki",  "nai",	   "xa",	"xaa",
        		"xd",	 "xdpower","xf",	"xf2", "xfca",	"xfca2",	"xh",
        		"xhl",	 "xi",	   "xi2",	"xj",	"xm",	"xml",		"xr",
        		"xri",	"xro",	   "xs1",	"xs2"];
    }

    // The function return an array of current variables
    function getCurrentVariables(){
        return ["icab",	"icalca",	"iclb",	"ik1",	"ikp",	"ikr",	"iks",	
        		"ina",	"inaca","inak",	"inal",	"ipca",	"ito1",	"ito2"];
    }

    // This function returns a set of parameters that need to be updated based on user input.
    function getParameters(){
        return ["gna","pca","gbarto1","gbarkr","gks","gbark1","gbarnal"];
    }

    // The function return an array of additional variables that are updated 
    // in calculatenext
    function getAdditionalVariables(){
        return [];
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

        this.plots =    function(){
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
            this.unitPerTick    =  new Point(250, 0.10), 
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
     * Here "baseplot" consists of "hundrudy" and "hundrudyOther" which have hundrudyBasePlot and hundrudyOtherBasePlot respectively.
     */
     function initializePlotSettings(){
     	var hundrudyPlots = [],
        hundrudyOtherPlots = [],
        hundrudyBasePlot,
        hundrudyOtherBasePlot,               
        basePlots = [],
        plotSettings;

        //hundrudyPlots
        hundrudyPlots.push({key:"mainPlot",value: new Plot("Time (ms)", "", false)});
        hundrudyBasePlot = new BasePlot( 437.5, 240, new Point(0, 0), hundrudyPlots);

        // hundrudyOtherPlots
        
        var hOtherPlotsInit = [ {key : "icab",  value:  {name: "I_bCa", showDefault:false}},
                                {key : "icalca",  value:  {name: "I_Ca",  showDefault:false}},
                                {key : "iclb",  value:  {name: "I_Cl",  showDefault:false}},
                                {key : "ik1",   value:  {name: "I_K1",  showDefault:false}},
                                {key : "ikp",   value:  {name: "I_Kr",  showDefault:false}},
                                {key : "ikr",   value:  {name: "I_Kr",  showDefault:false}},
                                {key : "iks",   value:  {name: "I_Ks",  showDefault:false}},
                                {key : "ina",   value:  {name: "I_Na",  showDefault:false}},
                                {key : "inaca", value:  {name: "I_NaCa",showDefault:false}},
                                {key : "inak",  value:  {name: "I_NaK", showDefault:false}},
                                {key : "inal",  value:  {name: "I_lNa", showDefault:false}},
                                {key : "ipca",  value:  {name: "I_pCa", showDefault:false}},
                                {key : "ito1",  value:  {name: "I_to1", showDefault:false}},
                                {key : "ito2",  value:  {name: "I_to2", showDefault:false}} ];

        hOtherPlotsInit.forEach(function(plotItem){
        hundrudyOtherPlots.push({key: plotItem["key"], value: new Plot("Time (ms)", plotItem["value"]["name"], 
                            plotItem["value"]["showDefault"])}); });
        
        hundrudyOtherBasePlot = new BasePlot( 437.5, 240, new Point(0, 300), hundrudyOtherPlots);

        basePlots.push({key:"Hundrudy", value : hundrudyBasePlot});
        basePlots.push({key:"HundrudyOther", value :hundrudyOtherBasePlot});

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
