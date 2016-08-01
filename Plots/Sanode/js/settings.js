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
        gfna:5.47e-4,   gfk:null,   
            
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

        displayV    : true,
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
        secondaryPlot: "ibna",
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
        return ["v",  "sdl", "sdt", "sy",  "sq",  "spaf", "spii", "sfl", "sft", "sr", "sxs", "spas", "sm", "sh1", "sh2"];
    }

      // The function return an array of current variables
    function getCurrentVariables(){
        return ["ina", "ibna", "ibca", "ibk", "if", "ikr", "iks", "inak", "ikp",  "ical", "ito",  "icat", "inaca"];
    }

      // This function returns a set of parameters that need to be updated based on user input.
    function getParameters(){
        return ["gcal", "gcat","gto", "gkr", "gks", "endTime"];
    }

      // The function return an array of additional variables that are updated 
      // in calculatenext
    function getAdditionalVariables(){
        return ["ik", "ib"];
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
   * Here "baseplot" consists of "Sanode" and "SanodeOther" which have sanodeBasePlot and sanodeOtherBasePlot respectively.
   */
    function initializePlotSettings(){
        var sanodePlots = [],
        sanodeOtherPlots = [],
        sanodeBasePlot,
        sanodeOtherBasePlot,               
        basePlots =[],
        plotSettings;


        //sanodePlots
        sanodePlots.push({key:"mainPlot",value: new Plot("Time (ms)", "V_m", false)});
        sanodeBasePlot = new BasePlot( 437.5, 240, new Point(0, 0), sanodePlots);

        // sanodeOtherPlots

        var sOtherPlotsInit = [ {key: "ina",    value: {name: "I_Na",   showDefault: false}},
                                {key: "ibna",   value: {name: "I_bNa",  showDefault: false}},
                                {key: "ibca",   value: {name: "I_bCa",  showDefault: false}},
                                {key: "ibk",    value: {name: "I_bk",   showDefault: false}},
                                {key: "if",     value: {name: "I_if",   showDefault: false}},
                                {key: "ikr",    value: {name: "I_Kr",   showDefault: false}},
                                {key: "iks",    value: {name: "I_Ks",   showDefault: false}},
                                {key: "inak",   value: {name: "I_NaK",  showDefault: false}},
                                {key: "ikp",    value: {name: "I_Kp",   showDefault: false}},
                                {key: "ical",   value: {name: "I_Cal",  showDefault: true}},
                                {key: "icap",   value: {name: "I_Cap",  showDefault: false}},
                                {key: "ito",    value: {name: "I_to",   showDefault: false}},
                                {key: "icat",   value: {name: "I_Cat",  showDefault: false}},
                                {key: "inaca",  value: {name: "I_NaCa", showDefault: false}}  ];

                         
        sOtherPlotsInit.forEach(function(plotItem){
            sanodeOtherPlots.push({key: plotItem["key"], value: new Plot("Time (ms)", plotItem["value"]["name"], 
                                        plotItem["value"]["showDefault"])}); 
        });
        sanodeOtherBasePlot = new BasePlot( 437.5, 240, new Point(0, 300), sanodeOtherPlots);

        basePlots.push({key:"Sanode", value : sanodeBasePlot});
        basePlots.push({key:"SanodeOther", value :sanodeOtherBasePlot});
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




