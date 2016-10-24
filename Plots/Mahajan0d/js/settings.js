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
			taur: 30.0,		taus: 4.0,		taua: 100.0,
     		av: 11.3,		cstar: 90.0,	wca: 8,
     		xf: 96.485,		xxr: 8.314,		temp: 308.0,
     		taupo: 1.0,		r1: 0.30,		r2: 3.0,cat: 3.0,tau3: 3.0,
     		tca: 78.0329,	cpt: 6.09365,	taups: 0.5,s1t: 0.00195,
     		xk2: 1.03615e-4,xk1t: 0.00413,	xk2t: 0.00224,
            zca: 2.0,      zna: 1.0,        zk: 1.0,
     		pna: 1.5e-8,	pk: 2.7e-7,		pca: 5.4e-4,

     		gna: 12.0,		gks: 0.32,		gkr: 0.0125,
     		gca: 182.,		gtos: 0.04,		gtof: 0.11,
     		gnaca: 0.84,    vup: 0.4,       xup: 0.5,
     		gkix: 0.3,		gnak: 1.5,		gleak: 0.00002069,
     		g: 2.58079,		grel: 26841.8,	gdyad: 9000,
			xkmko: 1.5,		xkmnai: 12.0,	xmcai: 3.59e-3,
			xmcao: 1.3,		xmnai: 12.29,	xmnao: 87.5,
     		nue: 0.35,		xkdna: 0.3,		bcal: 24.0,
     		xkcal: 7.0,		srmax: 47.0,	srkd: 0.6,
     		bmem: 15.0,		kmem: 0.3,		bsar: 42.0,
     		ksar: 13.0,		ksr: 0.6,		kon: 32.7e-3,
          	koff: 19.6e-3,  btrop: 70.0,	xnao: 136.0,
          	xki: 140.0,		xko: 5.40,		cao: 1.8,
          	prnak: 0.01833,	bs: 0,          bi: 0, 
            istimmag: 63.8, stimdur: 1.0,   istim: 0,

          	//numerical parameters
          	s1Start: 0,
			s1: 300,
			s2: 400,
            ns1: 3,
          	timestep: 0.02,
      	
           // initial values
            v: -84.5437601,
            m: 0.00134497903,
            h: 0.990499217,
            j: 0.993758796, 

           //  Rapid and slow components of teh delayed rectifier K+
            xr: 0.00728191488,
            xs1: 0.0581998025,
            xs2: 0.114144265,

           // Ito slow activation and inactivation
            xtos:  0.00367082157,
            ytos:  0.166435705,
           // ito fast activation
            xtof: 0.0036673458,
           // ito fast inactivation
            ytof: 0.991103442,
           // averaged dyadi// space con.
            cp:  1.53558176,
           // averaged submembrane conc.
            cs: 0.251236065,
           // myoplasm conc.
            ci: 0.290789638,
           // NSR load
            cj:  105.920973,
           // average JSR load
            cjp: 97.3737589,
           // SR current fluxR states
            xir: 0.00663552891,
                
           // Markov gate variables 
            c1: 1.85045704E-05,
            c2: 0.975550923,
            xi1ca: 0.00210862126,
            xi1ba: 3.40305848E-05,
            xi2ca: 0.00702795968,
            xi2ba: 0.0152581124,

            // internal Na conc.
            xnai: 12.2908491,

            // time dependent buffers in myplasm (troponin)
            tropi:   24.3571327,
            // time dependent buffers in submembrane (troponin)
            trops:   21.6408582,
            po: 0,

            // currents
            inaca: 0,   ica: 0,     iks: 0, ikr: 0,
            itof: 0,    itos: 0,    ito: 0, ik1: 0,
            ina: 0,     inak: 0,    iup: 0, ileak: 0,
            idif: 0,    jsr: 0,     jca: 0, icaq: 0,
            inacaq: 0
        },

        formSettings: { 

            displayV:   false,
            displayM:   false,
            displayH:   false,
            displayJ:   false,
            displayPo:  false,
            displayXr:  false,
            displayXs1: false,
            displayXs2: false,
            displayXtos:false,
            displayYtos:false,
            displayXtof:false,
            displayYtof:false,
            displayCp:  false,
            displayCs:  false,
            displayCi:  false,
            displayCj:  false,
            displayCjp: false,
            displayXir: false,
            displayXnai:  false,
            displayTropi: false,
            displayTrops: false,
            displayAPDDI: false,
            displayS1S2:  false,
            secondaryPlot: "",
            //current with labels
            inaca: "I_NaCa",
            itof: "I_tof",
            ina: "I_Na",
            ica: "I_Ca",
            itos: "I_tos",
            inak: "I_NaK",
            iks: "I_Ks",
            ikr: "I_Kr",
            ik1: "I_K1",
            colors : {
              aPDDI: "Orange",
              s1S2 : "Black",
              v    : "Red"
            }
        }
    };
    
    // The function return an array of voltage variables
    function _getVoltageVariables(){
        return ["v",    "m",    "h",    "j",    "xr",   "xs1",
                "xs2",  "xtos", "ytos", "xtof", "ytof", "cp",
                "cs",   "ci",   "cj",   "cjp",  "xir",  
                "xnai", "tropi","trops","po"];
    }
    
    // The function return an array of current variables
    function _getCurrentVariables(){
        return ["inaca",    "ica",   "iks", "ikr",    "itof", "itos", "ik1",
            "ina",  "inak" ];
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
