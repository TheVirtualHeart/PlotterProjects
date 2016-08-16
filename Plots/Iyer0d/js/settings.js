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
     var defaultSettings =    {        
          calculationSettings: {
               Faraday: 96.5e0,    Temp: 310.e0,       Rgas: 8.315e0,
               TNa: 294.16e0,      Acap: 1.534e-4,
               Vmyo: 25.84e-6,     VJSR: 0.16e-6,      VNSR: 2.10e-6,
               VSS: 1.2e-9,        Ko: 4.0e0,          Nao: 138.0e0,
               Cao: 2.e0,          GKr: 0.0186e0,      GKs: 0.0035e0,      
               GK1: 0.125, // GK1 = 0.1253051261188079722568586886469e0
               GNa: 56.32e0,       kNaCa: 0.44e0,      KmNa: 87.5e0,
               KmCa: 1.38e0,       ksat: 0.2e0,        eta: 0.35e0,
               INaKmax: 2.387e0,   KmNai: 20.e0,       KmKo: 1.5e0,
               IpCamax: 0.05e0,    KmpCa: 0.0005e0,    GCab: 7.684e-5,
               GNab: 0.001e0,      v1: 1.8e0,          Kfb: 0.000168e0,
               Krb: 3.29e0,        KSR: 1.2e0,         Nfb: 1.2e0,
               Nrb: 1.0e0,         vmaxf: 0.0748e-3,   vmaxr: 0.318e-3,
               tautr: 0.5747e0,    tauxfer: 26.7e0,    kaplus: 0.01215e0,
               kaminus: 0.576e0,   kbplus: 0.00405e0,  kbminus: 1.930e0,
               kcplus: 0.1e0,      kcminus: 0.0008e0,  ncoop: 4.e0,
               mcoop: 3.e0,        fL: 0.3,            gL: 4,
               bL: 2,              aL: 2,              omega: .25*.01,
               Pscale: 7e0,        ICahalf: -0.265e0,  KvScale: .872e0,    
               Kv43Frac: 0.889e0,  alphaa0Kv43: 0.543708e0,
               aaKv43: 0.028983e0, betaa0Kv43: 0.080185e0,baKv43: 0.0468437e0,
               alphai0Kv43: 0.0498424e0,     aiKv43: 0.000373016e0,        betai0Kv43: 0.000819482e0,
               biKv43: 0.00000005374e0,      alphaa0Kv14: 1.84002414554e0, aaKv14: 0.00768548031e0,
               betaa0Kv14: 0.01081748340e0,  baKv14: 0.07793378174e0,      alphai0Kv14: 0.00305767916e0,
               betai0Kv14: 0.00000244936e0,  f1Kv43: 1.8936e0,             f2Kv43: 14.224647456e0,
               f3Kv43: 158.574378389e0,      f4Kv43: 142.936645351e0,      b1Kv43: 6.77348e0,
               b2Kv43: 15.6212705152e0,      b3Kv43: 28.7532603313e0,      b4Kv43: 524.576206679e0,
               f1Kv14: 0.52465073996e0,      f2Kv14: 17.51885408639e0,     f3Kv14: 938.58764534556e0,
               f4Kv14: 54749.19473332601e0,  b1Kv14: 1.00947847105e0,      b2Kv14: 1.17100540567e0,
               b3Kv14: 0.63902768758e0,      b4Kv14: 2.12035379095e0,      LTRPNtot: 70.e-3,
               HTRPNtot: 140.e-3,            khtrpn_plus: 20.e0,           khtrpn_minus: 0.066e-3,
               kltrpn_plus: 40.e0,           kltrpn_minus: 40.e-3,         CMDNtot: 50.e-3,
               CSQNtot: 15.e0,               EGTAtot: 0.e0,                KmCMDN: 2.38e-3,
               KmCSQN: 0.8e0,                KmEGTA: 1.5e-4,               T_Const_HERG: 5.320000001e0,
               A0_HERG: 0.017147641733086e0, B0_HERG: 0.03304608038835e0,  A1_HERG: 0.03969328381141e0,
               B1_HERG: -0.04306054163980e0, A2_HERG: 0.02057448605977e0,  B2_HERG: 0.02617412715118e0,
               A3_HERG: 0.00134366604423e0,  B3_HERG: -0.02691385498399e0, A4_HERG: 0.10666316491288e0,
               B4_HERG: 0.00568908859717e0,  A5_HERG: 0.00646393910049e0,  B5_HERG: -0.04536642959543e0,
               A6_HERG: 0.00008039374403e0,  B6_HERG: 0.00000069808924e0,  
               Temp_Scale: 1.38862291252871, C0ks_C1ks: 0.00795600798004,
               C1ks_O1ks: 0.03966720676071,  a1yCa :  .82,                 ZERO: 1e-15,
               PCa: 0.0017283, //c.Pscale * 2.469e-4;
               GKv43: 0.0775, //c.Kv43Frac * c.KvScale * 0.1e0,
               stimstrength: -25.0e0,        stimdur: 2.0e0,     istim: 0,

               //numerical parameters
               s1Start: 0,
               s1: 340,
               s2: 900,
               ns1: 5,
               timestep: 0.01,

               //initial conditions
               c1_ryr:   0.4448038946e+00,
               o1_ryr:   0.6601783287e-03,
               c2_ryr:   0.5545359240e+00,
               o2_ryr:   0.3973920060e-08,         
               c0:       0.8621934054e+00,
               c1:       0.1141398211e-01,
               c2:       0.5666325225e-04,
               c3:       0.1250213570e-06,
               c4:       0.1034426748e-09,
               cca0:     0.1198547081e+00,
               cca1:     0.6346794302e-02,
               cca2:     0.1260326488e-03,
               cca3:     0.1112315238e-05,
               cca4:     0.3681315892e-08,
               c0kv43:   0.9513721351e+00,
               c1kv43:   0.2668288089e-01,
               c2kv43:   0.2806380358e-03,
               c3kv43:   0.1311837579e-05,
               ci0kv43:  0.1513025204e-01,
               ci1kv43:  0.5442964601e-02,
               ci2kv43:  0.9918373359e-03,
               ci3kv43:  0.9514386057e-04,
               oikv43:   0.2742677382e-05,
               c0kv14:   0.5977099765e+00,
               c1kv14:   0.1730990528e+00,
               c2kv14:   0.1881072386e-01,
               c3kv14:   0.9160701350e-03,
               ci0kv14:  0.3539084346e-01,
               ci1kv14:  0.5428824353e-02,
               ci2kv14:  0.2287858869e-01,
               ci3kv14:  0.3233800003e-01,
               oikv14:   0.1134082058e+00,
               c1herg:   0.9966973380e+00,
               c2herg:   0.4340879648e-03,
               c3herg:   0.7634099755e-04,
               iherg:    0.1533347007e-05,
               c0ks:     0.9645606295e+00,
               c1ks:     0.3542613568e-01,
               o1ks:     0.2491710696e-06,
               o2ks:     0.1298547822e-04,
               na1:      0.1437575649e+00,
               na2:      0.4177762080e-01,
               na3:      0.4552898364e-02,
               na4:      0.2205207430e-03,
               na5:      0.4005266484e-05,
               na6:      0.1574427490e-07,
               na7:      0.2856607179e-08,
               na8:      0.4749950008e+00,
               na9:      0.2707214097e+00,
               na10:     0.5786120057e-01,
               na11:     0.5496292279e-02,
               na12:     0.1957874519e-03,
               na13:     0.4176793960e-03,

               //voltage dependants
               v:        -0.9065755929e+02,
               nai:      0.9798304162e+01,
               ki:       0.1255589432e+03,
               cai:      0.8601192016e-04,
               cansr:    0.2855294915e+00,
               cass:     0.1420215245e-03,
               cajsr:    0.2852239446e+00,
               yca:      0.9997157074e+00,
               htrpnca:  0.9772152481e+00,
               ltrpnca:  0.8046584973e-01,
               open:     0.7757981563e-11,
               okv43:    0.2299556240e-08,
               okv14:    0.1975541357e-04,
               oherg:    0.9511789113e-05,
               na:       0, // na = na6 + na7
               po:       0, // po = o1_ryr + o2_ryr
               oks:      0, // oks = o1ks+o2ks

               //current helpers
               jup: 0,    jrel: 0,    jtrpn: 0, jtr: 0,   jxfer: 0,
               ikv14_k: 0,ikv14_na: 0,Itot: 0,  ito1: 0,

               // currents
               ina: 0,   ikr: 0,   iks: 0,   ik1: 0,   inaca: 0,
               inak: 0,  ipca: 0,  icab: 0,  inab: 0,  ica: 0,   icak: 0,
               ikv43: 0, ikv14: 0, 

               },

        formSettings: { 
           displayV:   true,
           displayCai: false,
           displayCajsr: false,
           displayCansr: false,
           displayCass: false,
           displayHtrpnca: false,
           displayKi: false,
           displayLtrpnca: false,
           displayNa: false,
           displayNai: false,
           displayOherg: false,
           displayOks: false,
           displayOkv14: false,
           displayOkv43: false,
           displayOpen: false,
           displayPo: false,
           displayYca: false,
           displayAPDDI: false,
           displayS1S2:  false,
           secondaryPlot: "inaca",
           //current with labels
           ina: "I_Na",
           ikr: "I_Kr",
           iks: "I_Ks",
           ito1: "I_to1",
           ik1: "I_K1",
           inaca: "I_NaCa",
           inak: "I_NaK",
           ipca: "I_pCa",
           icab: "I_bCa",
           inab: "I_bNa",
           ica: "I_Ca",
           icak: "I_CaK",
           ikv43: "I_Kv43",
           ikv14: "I_Kv14",
           colors : {
                aPDDI: "Orange",
                s1S2 : "Black",
                v    : "Red"
            }
        }
    };
    
    // The function return an array of voltage variables
    function _getVoltageVariables(){
        return ["v",     "nai",    "ki",     "cai",    "cansr",  "cass",   "cajsr",  "yca",    
               "htrpnca",     "ltrpnca",     "open",   "okv43",  "okv14",  "oherg",  "na",     
               "po",     "oks"];
    }
    
    // The function return an array of current variables
    function _getCurrentVariables(){
        return ["ina",   "ikr",    "iks",    "ik1",    "inaca",  "inak",   
               "ipca",   "icab",   "inab",   "ica",    "icak",   "ikv43",  "ikv14"];
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

