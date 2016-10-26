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
        
        calculationSettings: {

        	//parameters
        	gfk: 3.0,		gfna: 3.0,		gk1: 920.0,
        	gbna: 0.18,		gbca: 0.02,		gna: 750.,
        	kb: 4.,			kmf: 45.,		ikmax: 180.,
        	km1: 210.,		kmt: 10.,		kact: 0.0005,
          	ipmax: 125.,	kmk: 1.,		kmna: 40.,
          	gamma: 0.5,		knaca: 0.02,	dnaca: 0.001,
          	psi: 15.,		kmf2: 0.001,	cabarup: 5.0,
          	kmca: 0.001,	trel: 0.05,		trep: 2.0,
          	tup: 0.025,		prate: 0.7, 	nao: 140.,
          	cao: 2.0,		naoc: 138.,		fcon: 96485.,
          	rcon: 8314.41,	t: 310.,		cm: .075,
          	difna: 50.,		difnl: 0.000002,pi: 3.141592654,
          	vecs: 0.1,      a: 0.001,       l: 0.16,
            tau: 0.2,       gto: .28,
            stimdur: 1,   rstim: 9.3,

          	//numerical parameters
            s1Start: 0,
            s1: 500.0e-3,
            s2: 800.0e-3,
            ns1:3,
            timestep: 0.00005,
            
          	//initial values
          	v: -88.316, //v: 20.0
	        y: 0.053,
	        x: 0.1358,
	        r: 0.391,
	        m: 0.003,
	        h: 0.9186,
	        d: 0.0,
	        f: 1.0,
	        f2: 0.7339,
	        p: 0.965,
	        cai: 0.000032,
	        caup: 1.3,
	        carel: 0.4,	
	        nai: 8.0, //         nai: 7.93075
	        ki: 140.0,
	        kc: 4.0,

	        //currents
	        ifk: 0,		ifna: 0,	ik: 0,	ik1: 0,	ito: 0,
	        ibna: 0,	ibca: 0,	inak: 0,ina: 0,	inaca: 0,
	        isica: 0,	isik: 0
		},
		formSettings: {
			displayAPDDI : false,
            displayS1S2  : false,
            displayV: false,
			displayY: false,
			displayX: false,
			displayR: false,
			displayM: false,
			displayH: false,
			displayD: false,
			displayF: false,
			displayF2: false,
			displayP: false,
			displayCai: false,
			displayCaup: false,
			displayCarel: false,
			displayNai: false,
			displayKi: false,
			displayKc: false,
			secondaryPlot: "",
            
		//current with labels
      ifk: 	"I_fK",
			ifna: 	"I_fNa",
			ik: 	"I_K",
			ik1: 	"I_K1",
			ito: 	"I_to",
			ibna: 	"I_bNa",
			ibca: 	"I_bCa",
			inak: 	"I_NaK",
			ina: 	"I_Na",
			inaca: 	"I_NaCa",
			isica: 	"I_Ca",
			isik: 	"I_siK",
            colors  : {
                   aPDDI: "Orange",
                   s1S2 : "Black",
                   v    : "Red"
                }      
        }
    };

    // The function return an array of voltage variables
    function _getVoltageVariables(){
        return ["v",	"y",	"x",	"r",	"m",
        		"h",	"d",	"f",	"f2",	"p",
        		"cai",	"caup",	"carel","nai",	"ki",	"kc"];
    }
    
    // The function return an array of current variables
    function _getCurrentVariables(){
        return ["ifk",	"ifna",	"ik",	"ik1",	"ito",	
        		"ibna",	"ibca",	"inak",	"ina",	"inaca",
        		"isica","isik"];
    }

    function _initialize(override){
            
            //override colors
            defaultSettings = _.merge(defaultSettings, override);

            //Adding additional properties    
            defaultSettings.calculationSettings.voltageVariables = _getVoltageVariables();
            defaultSettings.calculationSettings.currentVariables =  _getCurrentVariables();
            
            // overriding the plot settings explicitly.
            var plotParams = {
                unitPerTick    :  new Point(0.5, 0.10)
            };

            //Setting plot setting dynamically            
            defaultSettings["plotSettings"] = utils.initializePlotSettings( _getCurrentVariables(), defaultSettings.formSettings,plotParams);
            
             // assign colors            
            defaultSettings["formSettings"]["colors"] =  utils.extend(defaultSettings["formSettings"]["colors"],
                                                         utils.assignColors(utils.removeArrayItems(_getVoltageVariables(), ["v"])));                                
            
            return defaultSettings;
    }
        
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
