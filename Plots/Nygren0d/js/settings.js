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
                cnab:130.0,     ckb:5.4,        ccab:1.8,
                cmgi:2.5,       ecaapp:60.0,    xkca:0.025,
                xxr:8314.,      xxt:306.15,     xxf:96487.,
                cm:1.0,         voli:0.11768,   voldfrac:0.02,
                volrel:0.000882,volup:0.007938, tauna:14300.,
                tauk:10000.,    tauca:24700.,   taudi:10.,
                xinak:1.416506, xknakk:1.,      xknakna:11.,
                xicap:0.08,     xkcap:0.0002,   xknaca:0.000749684,
                gamma:0.45,     dnaca:0.0003,   xiup:56.,
                xkcyca:0.0003,  xksrca:0.5,     xkxcs:0.4,
                tautr:10.,      alpharel:4000., xkreli:0.0003,
                xkreld:0.003,   rrecov:0.815e-3,pna:3.2e-5,
                gcal:0.135,     gt:0.15,        gsus:0.055,
                gks:0.02,       gkr:0.01,       gk1:0.06,
                gbna:0.00121198,gbca:0.00157362,phinaenorig:-0.0336,
                volc:0.01600448,xstimdur: 3,    xstimamp: 19.6,//based on assumption that iaf=0, icourt and ifixed=1
                xotmgc:0.196085,xotmgmg:0.709417,xocalse:0.43686,
                xoc:0.0274971,  xotc:0.0132801, cnac:130.0,
                ckc:5.4,        ccac:1.8,       cnai:8.55474,
                cki:129.435,    ccai:6.72905e-5,ccad:7.24947e-5,
                ccaup:0.664564, ccarel:0.646458,xf1:0.428396,
                xf2:0.0028005,  xstim:0,

                // numerical parameters
                ns1: 4,          s1Start: 0,
                s1: 320,          s2: 640,
                timestep: 0.01,

                // initial values
                v:-74.2525,     xm:3.20173e-3, xh1:0.881421,
                xh2:0.874233,   xdl:1.30047e-5,xfl1:0.998639,
                xfl2:0.998604, xr:1.06783e-3, xs:0.948975,
                rsus:1.59491e-4,ssus:0.991169, xn:4.83573e-3,
                xpa:5.16114e-5,    

                //currents
                xna: 0,   xcal: 0,    xt: 0,  xsus: 0,
                xks: 0,   xkr: 0,     xk1: 0, xbna: 0,
                xbca: 0,  xnak: 0,    xcap: 0, xnaca: 0
                
            },

            formSettings: { 

                  displayV    : false,
                  displayXm   : false,
                  displayXh1  : false,
                  displayXh2  : false,
                  displayXdl  : false,
                  displayXfl1 : false,
                  displayXfl2 : false,
                  displayXr   : false,
                  displayXs   : false,
                  displayRsus : false,
                  displaySsus : false,
                  displayXn   : false,
                  displayXpa  : false,
                  displayAPDDI: false,
                  displayS1S2 : false,
                  secondaryPlot: "",
                  //current with labels
                  xna    : "I_Na",
                  xks    : "I_Ks",
                  xbca   : "I_bCa",
                  xcal   : "I_CaL",
                  xkr    : "I_Kr",
                  xnak   : "I_NaK",
                  xt     : "I_t",
                  xk1    : "I_K1",
                  xcap   : "I_Cap",
                  xsus   : "I_Sus",
                  xbna   : "I_bNa",
                  xnaca  : "I_NaCa",
                  colors : {
                    aPDDI: "Orange",
                    s1S2 : "Black",
                    v    : "Red"
                  }
              }
          };

          // The function return an array of voltage variables
        function _getVoltageVariables(){
            return ["v",  "xm",   "xh1",  "xh2",  "xdl",  "xfl1",  "xfl2",  "xr",
                    "xs",  "rsus", "ssus", "xn",   "xpa", "ccai", "ccad", "ccaup",
                    "ccarel"];
        }

        // The function return an array of current variables
        function _getCurrentVariables(){
              return ["xna",  "xcal", "xt","xsus", "xks", "xkr",  "xk1",  "xbna",
                      "xbca", "xnak", "xcap", "xnaca"];
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

