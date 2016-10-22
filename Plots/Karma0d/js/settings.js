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
                taue: 2.5,
                taun: 250,
                eh: 3,
                en: 1,
                estar: 1.5415,
                // eps: taue/taun, //moved to Constants.
                Re: 1.204,  // varied between 0.5 and 1.4
                // expRe: Math.exp(-Re),
                m: 10,  // varied between 4 and 10
                gamma: 1.1, // diffusion coefficient
                stimdur: 1 , istim : 0, stimmag: 2,

                // numerical parameters
                ns1: 4,          s1Start: 0,
                s1: 500,          s2: 300,
                timestep: 0.25,
                

                // initial values
                v: 0,//Since e is voltage //e : 0,
                n: 0

            },

            formSettings: { 

              displayV    : false,
              displayN    : false,
              displayAPDDI: false,
              displayS1S2 : false,
              colors : {
                    aPDDI : "Orange",
                    s1S2  : "Black",
                    v     : "Red"
                }
            }
        };

          // The function return an array of voltage variables
        function _getVoltageVariables(){
            return ["v",  "n"];
        }

        function _initialize(override){

            defaultSettings = _.merge(defaultSettings, override);
              
            //Adding additional properties    
            defaultSettings.calculationSettings.voltageVariables = _getVoltageVariables();
            
            // overriding the plot settings explicitly.
            var plotParams = {
                unitPerTick    :  new Point(500, 0.10)
            };

            //Setting plot setting dynamically            
            defaultSettings["plotSettings"] = utils.initializePlotSettings( null, defaultSettings.formSettings, plotParams);         
            
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

    