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
	var defaultSettings =   {        
		calculationSettings: {

			//parameter values
			v1: 1.8e3,			Kfb: 0.168e-3,		Krb: 3.29,
			Ksr: 1.0,			Nfb: 1.2,			Nrb: 1.0,
			vmaxf: 0.4e-1,		vmaxr: 0.9,			tautr: 0.5747e-3,
			tauxfer: 26.7e-3,	Kaplus: 12.15e12,	Kaminus: 0.576e3,
			Kbplus: 4.05e9,		Kbminus: 1.930e3,	Kcplus: 0.1e3,
			Kcminus: 0.0008e3,	npow: 4.0,			mpow: 3.0,
          	LTRPNtot: 70.0e-3,	HTRPNtot: 140.0e-3,	Khtrpnplus: 200.0e3,
          	Khtrpnminus: 66.0e-3,Kltrpnplus: 40.0e3,Kltrpnminus: 0.04e3,
          	CMDNtot: 50.0e-3,	CSQNtot: 15.0,		EGTAtot: 0.0,
          	KmCMDN: 2.38e-3,	KmCSQN: 0.8,		KmEGTA: 1.5e-4,
          	Cm: 100.0e-6,		FF: 96487.0,		TT: 295.0,	RR: 8314.5,
          	gna: 0.8,			gcal: 0.031,		gt: 0.035,	gss: 0.007,
          	gk1: 0.024,			gbna: 8.015e-5,		gbca: 3.24e-5,
          	gbk: 13.8e-5,		gf: 0.00145,		Inakbar: 0.08,
          	Kmna: 10.0,			Kmk: 1.5,			Icapbar: 0.004,
          	knaca: 0.9984e-5,	dnaca: 0.0001,		gam: 0.5,
          	Ko: 5.4,			Nao: 140.0,			Cao: 1.2,
			//  volumes in uL
          	Volss: 1.2e-9,		Voljsr: 0.056e-6,	Volnsr: 0.504e-6,
          	Volmyo: 9.36e-6,	Ecal: 65.0,			tauCainact: 0.009,
          	a: 0.886,			b: 0.114,			tausss: 2.1,		fna: 0.2,
          	istim: 0, 			stimdur: 2e-3,		stimmag: 2.58, // for stimdur: 2ms, in 0d, diastolic threshold :  1.29
            iType: "epi",

          	// numerical parameters
			s1Start: 0,
			s1: 200.0e-3,
			s2: 300.0e-3,
            ns1: 3,
			timestep: 1e-5, // seconds, not ms
	      	 
	      	 //initial values
	      	v: -80.50146,
	        m: 4.164108e-3,
	        h: 6.735613e-1,
	        j: 6.729362e-1,
	        d: 2.171081e-6,
	        f11: 9.999529e-1,
	        f12: 9.999529e-1,
	        cainact: 9.913102e-1,
	        r: 2.191519e-3,
	        s: 9.842542e-1,
	        sslow: 6.421196e-1,
	        rss: 2.907171e-3,
	        sss: 3.142767e-1,
	        y: 3.578708e-3,
	        nai: 1.073519e1,
	        ki: 1.392751e2,
	        cai: 7.901351e-5,
	        cansr: 6.600742e-2,
	        cass: 8.737212e-5,
	        cajsr: 6.607948e-2,
	        pc1: 6.348229e-1,
	        po1: 4.327548e-4,
	        po2: 6.062540e-10,
            po: 0,
	        pc2: 3.647471e-1,
	        ltrpn: 5.161900e-3,
	        htrpn: 1.394301e-1,

	        //current helpers
	        ib: 0, tauy: 0, yinf: 0, ifna: 0,    ifk: 0,

	        //currents
	        ik1: 0,    if: 0, 	it: 0,  iss: 0,
	        ibna: 0,   ibk: 0,	ibca: 0,
	        inak: 0,   sig: 0,	icap: 0,
            inaca: 0,  ical: 0, ina: 0,
	    },

        formSettings: { 

            displayV:   true,
            displayM: false,
			displayH: false,
			displayJ: false,
			displayD: false,
			displayF11: false,
			displayF12: false,
			displayCainact: false,
			displayR: false,
			displayS: false,
			displaySslow: false,
			displayRss: false,
			displaySss: false,
			displayY: false,
			displayNai: false,
			displayKi: false,
			displayCai: false,
			displayCansr: false,
			displayCass: false,
			displayCajsr: false,
			displayPo: false,
            displayPc1: false,
			displayPc2: false,
			displayLtrpn: false,
			displayHtrpn: false,
			displayAPDDI: false,
            displayS1S2:  false,
            secondaryPlot: "ibna"
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
        return ["v",	"m",	"h",	"j",	"d",	"f11",	"f12",	"cainact",	"r",	
        		"s",	"sslow",  "rss",	"sss",	"y",	"nai",	"ki",	"cai",	"cansr",	
        		"cass",	"cajsr",  "po",   "ltrpn",	"htrpn"];
    }
    
    // The function return an array of current variables
    function getCurrentVariables(){
        return [ "ik1",     "if",   "ibna","inak",  "ibk", "ibca",
        	     "icap",    "inaca","ina", "ical",  "it",  "iss" ];
    }


    // This function returns a set of parameters that need to be updated based on user input.
    function getParameters(){
        return ["gna", "gcal", "gt", "gss","gk1", "gf", "knaca", "iType"];
    }

    // The function return an array of additional variables that are updated 
    // in calculatenext
    function getAdditionalVariables(){
        return ["pc1",  "pc2", "po1",   "po2", "tauy",  "ib", "yinf", "ifna",  "ifk" ];
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
            this.unitPerTick    =  new Point(0.2, 0.10), 
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
     * Here "baseplot" consists of "Pandit" and "PanditOther" which have hundrudyBasePlot and hundrudyOtherBasePlot respectively.
     */
     function initializePlotSettings(){
        var panditPlots = [],
        panditOtherPlots = [],
        panditBasePlot,
        panditOtherBasePlot,               
        basePlots = [],
        plotSettings;

        //panditPlots
        panditPlots.push({key:"mainPlot",value: new Plot("Time (ms)", "", false)});
        panditBasePlot = new BasePlot( 437.5, 240, new Point(0, 0), panditPlots);

        // panditOtherPlots
        var mOtherPlotsInit = [ {key: "ik1",  	value: {name: "I_K1", 	showDefault: false}},
								{key: "if",  	value: {name: "I_f", 	showDefault: false}},
								{key: "ibna",  	value: {name: "I_bNa", 	showDefault: false}},
								{key: "inak",  	value: {name: "I_NaK", 	showDefault: false}},
								{key: "ibk",  	value: {name: "I_bK", 	showDefault: false}},
								{key: "ibca",  	value: {name: "I_bCa", 	showDefault: false}},
								{key: "icap",  	value: {name: "I_pCa", 	showDefault: false}},
                                {key: "inaca",  value: {name: "I_NaCa", showDefault: true}},
                                {key: "ina",    value: {name: "I_Na",   showDefault: false}},
                                {key: "ical",   value: {name: "I_CaL",  showDefault: false}},
                                {key: "it",     value: {name: "I_to",   showDefault: false}},
                                {key: "iss",    value: {name: "I_ss",    showDefault: false}},
                                ];

		mOtherPlotsInit.forEach(function(plotItem){
        panditOtherPlots.push({key: plotItem["key"], value: new Plot("Time (ms)", plotItem["value"]["name"], 
                            plotItem["value"]["showDefault"])}); });
        
        panditOtherBasePlot = new BasePlot( 437.5, 240, new Point(0, 300), panditOtherPlots);

        basePlots.push({key:"Pandit", value : panditBasePlot});
        basePlots.push({key:"PanditOther", value :panditOtherBasePlot});

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
