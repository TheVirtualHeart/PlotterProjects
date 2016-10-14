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
            v   : -84.058830,
            m   : 0.000821,
            h   : 0.995741,
            j   : 0.999872,
            d   : 0.000016,
            f   : 0.999193,
            f2  : 0.988692,
            fca : 0.965405,
            fca2 :0.739378,
            xs1 : 0.001114,
            xs2 : 0.042234,
            xr  : 0.069808,
            a   : 0.000119,
            i   : 0.992541,
            i2  : 0.745628,
            ml  : 0.000329,
            ml3 : 0.046538,
            hl  : 0.984170,
            hl3 : 0.853893,
            jl  : 0.912569,
            jl3 : 0.827885,
            casss   : 0.000135,
            cajsr   : 1.510741,
            cacsr   : 1.537577,
            cansr   : 1.538668,
            cassl   : 0.000130, 
            nai     : 11.501546,
            nassl   : 11.501230,
            nasss   : 11.501240,
            ki      : 136.422946,
            cai : 0.000053,
            b : 0.000437,
            g : 0.990384,
            u : 0.535627,
            y : 0.182859,
            camktrap :0.010600,
            qrel1 : 0.0,
            qrel2 : 0.0,
            
                               
            //currents
            ical :0.0,
            ina :0.0,
            inal :0.0,
            icat :0.0,
            icab :0.0,
            itos :0.0,
            itof :0.0,
            ikr :0.0,
            iks :0.0,
            ik1 :0.0,
            ifna :0.0,
            ifk :0.0,
            inab :0.0,
            inaca :0.0,
            inak :0.0,
            ipca :0.0,
            irelss :0.0,
            ito1 :0.0,
            ibarca :0.0,

            //parameters
            pi:3.14,            
            radius:0.00175, 
            length:0.0164,  
            rcg:1.54,   
            frdy:96485,           
            R:8314,           
            temp:310,       
            nao:140,            
            cao:1.8,            
            ko :5.4,            
            clo:100,        
            zna:1,          
            zk :1,          
            zcl:-1,     
            zca:2,          
            ganai:0.75,     
            ganao:0.75,     
            gaki :0.75, 
            gako :0.75, 
            gacai:1.0,      
            gacao:0.341,             
            gna : 18,
            gnal2 : 0.052,  
            gnal3 : 0.018,
            pca : 1.9926e-4,    
            powtau : 10,    
            gcat : 0.07875, 
            gtos : 0.1414,     
            gtof : 0.042,
            prnak : 0.014,
            gnab : 0.0025,     
            pcab : 3.99e-8,   
            pnab : 0.64e-8,
            inacamax : 2.52,
            kmcaact : 0.000125,
            kmnai1 : 12.3,      
            kmnao : 87.5,       
            kmcai : 0.0036, 
            kmcao : 1.3,        
            nu : 0.35,          
            ksat : 0.27,
            ibarnak : 1.1004,   
            ipcabar : 0.0115,          
            kmpca : 0.0005,
            tautr1 : 120,
            tautr2 : 120,   
            gaptau : 12,
            sstau : 0.2,
            IP3 : 0.0001,  
            k1 : 150000,
            k1a : 16.5,
            k0 : 96000,
            k0a : 9.6,
            k2 : 1800,
            k2a : 0.21,
            tauip3r : 3.7,
            dqupcamkbar : 0.75,
            dkmplbbar : 0.00017,
            kmup   : 0.00028,   
            nsrbar : 15.0,  
            bsrbar : 0.019975,  
            kmbsr : 0.00087,        
            bslbar : 0.4777,    
            kmbsl : 0.0087,
            csqnbar : 2.88,         
            kmcsqn : 0.8,
            cmdnbar : 0.1125,   
            kmcmdn : 2.38e-3,
            trpnbar : 3.15e-2,
            kmtrpn : 0.5e-3,                       
            trpnbar1 : 3.5e-3,
            cmdnbar1 : 1.25e-2,
            csqnbar1 : 1.2, 
            camk0 : 0.05,       
            alphacamk : 0.05,       
            betacamk : 0.00068, 
            kmcam : 0.0015,     
            kmcamk : 0.15,                  
            fca_dtaucamkbar : 10.0, 
            stimdur : 0.5,          
            istim : -80, 
            gkr : 0.03262,
            gks : 0.053,
            gk1 : 0.12,
            
                
            //numerical parameters
            s1Start: 0,
            s1: 500,
            s2: 400,
            ns1:2,
            timestep: 0.01            
        },
        formSettings: {
            displayAPDDI : false,
            displayS1S2  : false,
            displayV     : false,
            displayM : false,
            displayH : false,
            displayJ : false,
            displayD : false,
            displayF : false,
            displayF2 : false,
            displayFca : false,
            displayFca2 : false,
            displayXs1 : false,
            displayXs2 : false,
            displayXr : false,
            displayA : false,
            displayI : false,
            displayI2 : false,
            displayMl : false,
            displayMl3 : false,
            displayHl : false,
            displayHl3 : false,
            displayJl : false,
            displayJl3 : false,
            displayCasss : false,
            displayCajsr : false,
            displayCacsr : false,
            displayCansr : false,
            displayCassl : false, 
            displayNai : false,
            displayNassl : false,
            displayNasss : false,
            displayKi : false,
            displayCai : false,
            displayB : false,
            displayG : false,
            displayU : false,
            displayY : false,
            displayCamktrap : false,                      
            secondaryPlot: "" ,
        //plot labels
            ina : "I_Na",
            inal : "I_NaL",
            inab : "I_Nab",
            ical : "I_CaL",
            icat : "I_CaT",
            icab : "I_Cab",
            itos : "I_to,s",
            itof : "I_to,f",
            ikr : "I_Kr",
            iks : "I_Ks",
            ik1 : "I_K1",
            inaca : "I_NaCa",
            inak : "I_NaK",
            ipca : "I_pCa",
            ifna : "I_f,Na",
            ifk : "I_f,K",
        //current with labels 
            
             colors  : {
                       aPDDI: "Orange",
                       s1S2 : "Black",
                       v    : "Red"
                    }          

        }
    };
    
    
    // The function return an array of voltage variables
    function _getVoltageVariables(){
        return ["v", "m", "h", "j", "d", "f", "f2", "fca", "fca2", "xs1", "xs2", "xr", "a", "i", "i2", "ml", "ml3", "hl", "hl3", "jl", "jl3", "casss", "cajsr", "cacsr", "cansr", "cassl",  "nai", "nassl", "nasss", "ki", "cai", "b", "g", "u", "y", "camktrap"]; 
    }
    
    // The function return an array of current variables
    function _getCurrentVariables(){
        return ["ina", "inal", "inab", "ical", "icat", "icab", "itos", "itof", "ikr", "iks", "ik1", "inaca", "inak", "ipca", "ifna", "ifk"];
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
                                                         utils.assignColors(utils.removeArrayItems(_getVoltageVariables(), ["v"])));                                
             
            
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
