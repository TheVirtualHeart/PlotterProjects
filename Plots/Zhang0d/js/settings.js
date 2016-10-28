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
        tt:310.0,       cm:20.0e-6,
        faraday:96487.0,r:8314.0,
        nai:8.0,        ki:140.0,       cai:1.0e-4,
        nao:140.0,      ko:5.4,         cao:2.0,
        pnak:0.12,      tpii:0.002,
        gks:3.45e-4,    gkr:7.97e-4,    gkp:6.65e-5,
        gbna:0.58e-4,   gbca:1.32e-5,   gbk:2.52e-5,
        gcal:0.58e-2,   gcat:0.43e-2,   gto:4.91e-3,
        gfna:5.47e-4,   gfk:5.47e-4, //gfk = gfna.   
            
        //Used only in SanodePeripheral
        pna:0.0,        sm  : 0.99981949872082,
        sh1 : 1.1765639669754e-08,      sh2 : 2.4651671277576e-08,
        sanodeType : "sanodeC",

        // numerical parameters
        timestep: 0.0001, endTime: 1.5,

        //initial values
        //v = sv in fortran code.
        v   : 15.760660258312,      spii: 3.2132281142660e-02,
        sdl : 0.99815953112686,     sfl : 0.14004248323399,
        sdt : 0.99956816419731,     sft : 6.5705516478730e-05,
        sy  : 1.2809083561878e-02,  sr  : 0.53922249081045,
        sq  : 1.6146678857860e-02,  sxs : 7.5035050267509e-02, //sxs = n gate
        spaf: 0.55835887024974,     spas: 0.45592769434524,        

        // currents helpers.
        ibna: 0,    ibca: 0,    ibk: 0,        
        ifna: 0,    ifk:  0,
        ikr:  0,    iks:  0,

        //currents
        ina: 0, ical: 0,    icat: 0,
        ib:  0, // ib is the sum of ibna, ibca, and ibk
        if:  0, // if is the sum of ifna and ifk
        ik:  0, // ik is the sum of ikr and iks
        inak:0, icap: 0,    inaca: 0,
        ikp: 0, ito: 0
    },

      formSettings: { 

        displayV    : false,
        displaySdl  : false,
        displaySdt  : false,
        displaySy   : false,
        displaySq   : false,
        displaySpaf : false,
        displaySpii : false,
        displaySfl  : false,
        displaySft  : false,
        displaySr   : false,
        displaySxs  : false,
        displaySpas : false,
        displaySm   : false,
        displaySh1  : false,
        displaySh2  : false,
        displayAPDDI: false,
        secondaryPlot: "",
        //current with labels
        ical:   "I_Cal",
        icat:   "I_Cat",
        ito:    "I_to",
        ikp:    "I_Sus",
        ikr:    "I_Kr",
        iks:    "I_Ks",
        inaca:  "I_NaCa",
        ibna:   "I_bNa",
        ibca:   "I_bCa",
        ibk:    "I_bk",
        if:     "I_f",
        inak:   "I_NaK",
        ina:    "I_Na",
        colors : {
                aPDDI: "Orange",
                s1S2 : "Black",
                v    : "Red"
        }
      }
    };
    
    
      // The function return an array of voltage variables
    function _getVoltageVariables(){
        return ["v",  "sdl", "sdt", "sy",  "sq",  "spaf", "spii", "sfl", "sft", "sr", "sxs", "spas", "sm", "sh1", "sh2"];
    }

    // The function return an array of current variables
    function _getCurrentVariables(){
        return ["ina", "ibna", "ibca", "ibk", "if", "ikr", "iks", "inak", "ikp",  "ical", "ito",  "icat", "inaca"];
    }

    /* This function is responsible for set varaibles values dependent on the cell type;
        *@param {dfS} - object
        *@param  {cellType} string
    */
    
    function setDependents(selectedItype, calcSettings){
        var values = {
            sanodeC : { cm:20.0e-6,     
            gkp:6.65e-5,    gbna:0.58e-4,   gbca:1.32e-5,
            gbk:2.52e-5,    gfna:5.47e-4,   timestep: 0.0001,
            gcal: 0.58e-2,  gcat: 0.43e-2,  gto: 4.91e-3,
            gkr: 7.97e-4,   gks: 3.45e-4, 

            v   : 15.760660258312,      spii: 3.2132281142660e-02,
            sdl : 0.99815953112686,     sfl : 0.14004248323399,
            sdt : 0.99956816419731,     sft : 6.5705516478730e-05,
            sy  : 1.2809083561878e-02,  sr  : 0.53922249081045,
            sq  : 1.6146678857860e-02,  sxs : 7.5035050267509e-02, //sxs = n gate
            spaf: 0.55835887024974,     spas: 0.45592769434524,
            sanodeType : "sanodeC",
            
           },

          sanodeP :{ cm: 65.0e-6, pna: 1.2e-6,
            gkp: 1.14e-2,   gbna: 1.89e-4,  gbca: 4.3e-5,
            gbk: 8.19e-5,   gfna: 0.69e-2,  timestep: 0.00005,
            gcal: 6.59e-2,  gcat: 1.39e-2,  gto: 36.49e-3,
            gkr: 1.6e-2,    gks: 1.04e-2,

            v: -64.35,      sm: 0.124,      sh1: 0.595,
            sh2: 5.25e-2,   sdl: 8.45e-2,   sfl: 0.987,
            sdt: 1.725e-2,  sft: 0.436,     sy: 5.28e-2,
            sr: 1.974e-2,   sq: 0.663,      sxs: 7.67e-2,
            spaf: 0.400,    spas: 0.327,    spii: 0.991,
            sanodeType : "sanodeP",
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
            
            // overriding the plot settings explicitly.
            var plotParams = {
                unitPerTick    :  new Point(0.3, 0.10)
            };

            //Setting plot setting dynamically            
            defaultSettings["plotSettings"] = utils.initializePlotSettings( _getCurrentVariables(), defaultSettings.formSettings,plotParams);
            
             // assign colors            
            defaultSettings["formSettings"]["colors"] =  utils.extend(defaultSettings["formSettings"]["colors"],
                                                         utils.assignColors(utils.removeArrayItems(_getVoltageVariables(), ["v"])));
            
            defaultSettings.calculationSettings.updateDependents = setDependents;

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




