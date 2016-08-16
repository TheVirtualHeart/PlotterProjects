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
            
            // voltages
            v  : -90.0,
            xv : 1,
            to : 0,
            f  : 1,
            xx : 0,
            m  : 0,
            
            //currents
            ik1 : 0.0,
            inaca : 0.0,
            inak : 0.0,
            icab : 0.0,
            inab : 0.0,
            ina : 0.0,
            ica : 0.0,
            ito : 0.0,
            ik : 0.0,
            istim : 40.0,
            
            //parameters
            Nai : 10.0,
            Nae : 138.0,
            Ki : 140.0,
            Ke : 4.0,
            Cae : 2.0,
            Cai : 0.0004,
            Cm : 153.4,
            gNa : 16.0,
            gto : 0.4,
            gCa : 0.064,
            gK : 0.018,
            gK1 : 3.9,
            gCab : 0.00085,
            gNab : 0.001,
            gNaK : 1.3,
            gNaCa : 1000.0,
            KCa : 0.0006,
            KmCa : 1.38,
            KmKe : 1.5,
            KmNa : 87.5,
            KmNai : 10.0,
            ksat : 0.1,
            eta : 0.35,
            Fc : 96.4867,
            stimdur: 1.0,
            dlap : 0.00116,
            dx : .025,
            
            //numerical parameters
            s1Start: 0,
            s1: 400,
            s2: 500,
            ns1:3,
            timestep: 0.01            
        },
        formSettings: {
            displayAPDDI : false,
            displayS1S2  : false,
            displayV     : false,
            displayXv    : false,
            displayTo    : false,
            displayF     : false,
            displayXx    : false,
            displayM     : false,
            secondaryPlot: "", 
    //current with labels
            ik1     : "I_K1",
            inaca   : "I_NaCa",
            inak    : "I_NaK",
            icab    : "I_Cab",
            inab    : "I_Nab",
            ina     : "I_Na",
            ica     : "I_Ca",
            ito     : "I_To",
            ik      : "I_K",           
            colors  : {
                   aPDDI: "Orange",
                   s1S2 : "Black",
                   v    : "Red"
                }      
        }
    };
            
    // The function return an array of voltage variables
    function _getVoltageVariables(){
        return ["v","xv","to","f","xx","m"];
    }
    
    // The function return an array of current variables
    function _getCurrentVariables(){
        return ["ik1","inaca","inak","icab","inab","ina","ica","ito","ik"];
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
