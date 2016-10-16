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


		// parameter values
		uo: 0, 
		uu: 1.55, 
		thv: 0.3, 
		thw: 0.13, 
		thwinf: 0.006, //0.13 //thw, 
		thvm: 0.006, 
		tho: 0.006,
        tv1m: 60, 
		// tv1m: 50, 
        tv2m: 1150, 
		tvp: 1.4506, 
		tw1m: 60, 
		tw2m: 15, 
		kwm: 65, 
		uwm: 0.03, 
		tw1p: 200, 
        tw2p: 200,
		kwp: 5.7, 
		wcp: 0.15, 
		tfi: 0.11, 
		to1: 400, 
		to2: 6, 
		tso1: 30.0181, 
		tso2: 0.9957, 
		kso: 2.0458, 
		uso: 0.65, 
		ts1: 2.7342, 
		ts2: 16, 
		ks: 2.0994, 
		us: 0.9087, 
		tsi1: 1.8875, 
		ksi: 97.8, 
		sc: 0.007, 
		twinf: 0.07, 
		winfstar: 0.94, 

		stimdur: 1, 
		stimmag: 0.66,
		istim: 0,
		iType: "epi",

		// numerical parameters
		s1Start: 0,
        s1: 500,
        s2: 700,
        ns1:3,
        timestep :  0.05, 
		

		// initial values 
		u: 0, //here u is Voltage
		v: 1, 
		w: 1, 
		s: 0,

        //
        xfi: 0,
        xso: 0,
        xsi: 0
            
		},

		formSettings: {
			displayAPDDI : false,
            displayS1S2  : false,
            displayU: false,
            displayV: false,
            displayW: false,
            displayS: false,
            secondaryPlot: "",
            //current with labels
            xfi: "J_fi",
            xso: "J_so",
            xsi: "J_si",
            colors  : {
                   aPDDI: "Orange",
                   s1S2 : "Black",
                   u    : "Red"
                }      
        }
    };


    // The function return an array of voltage variables
    function _getVoltageVariables(){
        return ["u", "v", "w", "s"];
    }
    
    // The function return an array of current variables
    function _getCurrentVariables(){
        return [ "xfi", "xso", "xsi"];
    }

    /* This function is responsible for set varaibles values dependent on the cell type;
        *@param  {selectedItype} string
        *@param {calcSettings} - object
    */
    
    function setDependents(selectedItype,calcSettings){
        var values   = { 
          epi : { 
                uu: 1.55,	thvm: 0.006,  tho: 0.006, tv1m: 60,	tv2m: 1150,	tw1m: 60,	
                tw2m: 15,	kwm: 65,	 uwm: 0.03,	tw1p: 200,	tfi: 0.11,	to1: 400,	to2: 6,	
                tso1: 30.0181,	tso2: 0.9957,	kso: 2.0458,	uso: 0.65,	ts2: 16,	tsi1: 1.8875,	
                twinf: 0.07,	winfstar: 0.94,	iType: "epi"
            },

          endo :{
                uu: 1.56,	thvm: 0.2,	tho: 0.006, tv1m: 75,	tv2m: 10,	tw1m: 6,	
          		tw2m: 140,	kwm: 200,	uwm: 0.016,	tw1p: 280,  tfi: 0.1,	to1: 470,	to2: 6,	
          		tso1: 40,	tso2: 1.2,	kso: 2,	uso: 0.65,	ts2: 2,	tsi1: 2.9013,   twinf: 0.0273,	
          		winfstar: 0.7, iType: "endo"
           },
           m :{
                uu: 1.61,	thvm: 0.1,	tho: 0.005, tv1m: 80,	tv2m: 1.4506,	tw1m: 70,	
                tw2m: 8,	kwm: 200,	uwm: 0.016,	tw1p: 280,   tfi: 0.078,	to1: 410,	to2: 7,	
                tso1: 91,	tso2: 0.8,	kso: 2.1,	uso: 0.6,	ts2: 4,	tsi1: 3.3849,  twinf: 0.01,	
                winfstar: 0.5, iType: "m"
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
            
        //override colors
        defaultSettings = _.merge(defaultSettings, override);

        //Adding additional properties    
        defaultSettings.calculationSettings.voltageVariables = _getVoltageVariables();
        defaultSettings.calculationSettings.currentVariables =  _getCurrentVariables();

        //Setting plot setting dynamically            
        defaultSettings["plotSettings"] = utils.initializePlotSettings( _getCurrentVariables(), defaultSettings.formSettings);
        
         // assign colors            
        defaultSettings["formSettings"]["colors"] =  utils.extend(defaultSettings["formSettings"]["colors"],
                                                     utils.assignColors(utils.removeArrayItems(_getVoltageVariables(), ["u"])));                                
        
        defaultSettings.calculationSettings.updateDependents =  setDependents;

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


		
