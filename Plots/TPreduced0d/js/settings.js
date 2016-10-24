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
            v:-86.2,
            sm:0.0,
            sh:0.75,
            sj:0.75,
            sxr1:0.0,
            sxs:0.0,
            ss:1.0,
            sf:1.0,
            sf2:1.0,
                       
            //currents
            ikr: 0.0,
            iks: 0.0,
            ik1: 0.0,
            ito: 0.0,
            ina: 0.0,
            ibna : 0.0,
            ical: 0.0,
            ibca: 0.0,
            inaca: 0.0,
            ipca: 0.0,
            ipk: 0.0,
            inak: 0.0,
            istim: 0.0,
            stimstrength: -38.0,
                       
            //parameters
            Ko:5.4,
            Cao:2.0,
            Nao:140.0,
            Cai:0.00007,
            Nai:7.67,
            Ki:138.3,
            RR:8314.472,
            FF:96485.3415,
            TT:310.0,
            CAPACITANCE:0.185,
            pKNa:0.03,
            Gkr:0.101,
            GK1:5.405,
            GNa:14.838,
            GbNa:0.00029,
            GCaL:0.2786,
            GbCa:0.000592,
            GpCa:0.1238,
            GpK:0.0293,
            KmK:1.0,
            KmNa:40.0,
            knak:2.724,
            knaca:1000,
            KmNai:87.5,
            KmCa:1.38,
            ksat:0.1,
            eta:0.35,
            KpCa:0.0005,
            iType: "epi", //1 for epi, 2 for mid, 3 for endo
            stimdur:1.0,
            Gks:0.257, //initialized to epi values by default
            Gto:0.294, //initialized to epi values by default
                
            //numerical parameters
            s1Start: 0,
            s1: 550,
            s2: 600,
            ns1:3,
            timestep: 0.01            
        },
        formSettings: {
            displayAPDDI : false,
            displayS1S2  : false,
            displayV  : false,
            displaySm : false,
            displaySh : false,
            displaySj : false,
            displaySxr1 : false,
            displaySxs  : false,
            displaySs : false,
            displaySf : false,
            displaySf2 : false,
            secondaryPlot: "" ,
        //current with labels 
            ikr: "I_Kr",
            iks: "I_Ks",
            ik1: "I_K1",
            ito: "I_to",
            ina: "I_Na",
            ibna : "I_bNa",
            ical: "I_CaL",
            ibca: "I_bCa",
            inaca: "I_NaCa",
            ipca: "I_pCa",
            ipk: "I_pK",
            inak: "I_NaK",
            colors  : {
             aPDDI: "Orange",
             s1S2 : "Black",
             v    : "Red"
            }          

        }
    };
    
    
    // The function return an array of voltage variables
    function _getVoltageVariables(){
        return ["v","sm","sh","sj","sxr1","sxs","ss","sf","sf2"];
    }
    
    // The function return an array of current variables
    function _getCurrentVariables(){
        return ["ikr","iks","ik1","ito","ina","ibna","ical","ibca","inaca","ipca","ipk","inak"];
    }


    function setDependents(selectedItype, calcSettings){
        var selectedValues,
        values =   { epi : {Gks: 0.257, Gto: 0.294, iType: "epi"}, mid : {Gks: 0.098 , Gto: 0.294, iType: "mid"}, endo : {Gks: 0.392, Gto: 0.073, iType: "endo"}};
        
        selectedValues = values[selectedItype];
        if(selectedValues){
            for (var value in selectedValues){
                calcSettings[value] = selectedValues[value];            
            }       
        }   
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
            
            defaultSettings.calculationSettings.updateDependents = setDependents;
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
