  /**
  * This module describes the Form element. This form can alter the appearance
  * of the plot, describing what variables are plotted and how the Ohara 
  * differential equation is calculated.
  */
    define(["utility"],
    function OharaForm(utils) {
      "use strict";
      var mediator;
      /**
      * This object describes the settings for the form.
      */
      var settings = null;
      var initialSettings = null;


      /**
      * Initialize the form. Define the initial settings of the form and define
      * the interface that the form will interact with. After that, bind the UI
      * compenents to specific actions.
      */
      function initialize(defaultSettings, mediatorObj){

        settings = defaultSettings;
        initialSettings = _.cloneDeep(defaultSettings);
        mediator = mediatorObj;

        /*
        * Set the DOM input to the value in the settings and
        * add an event listener so that it updates the values on 
        * change
        */

        // Stores all the variables that are displayed on the webpage.
        var   formCtrls    =  [ "displayAPDDI", "displayS1S2" , "displayV","displayNai", "displayNass",
                                "displayKi","displayKss", "displayCai",
                                "displayCass","displayCansr","displayCajsr", "displayXm",                                
                                "displayXhf","displayXhs","displayXj","displayXhsp",                                
                                "displayXjp","displayXml","displayXhl","displayXhlp",                                
                                "displayXa","displayXif","displayXis","displayXap",                                
                                "displayXifp","displayXisp","displayXd","displayXff",                                
                                "displayXfs","displayXfcaf","displayXfcas","displayXjca",                                
                                "displayXnca","displayXffp","displayXfcafp","displayXrf",                                
                                "displayXrs","displayXs1","displayXs2","displayXk1",                                
                                "displayJrelnp","displayJrelp", "displayCamkt", "secondaryPlot"],                               
                                                                                                                   
              settingCtrls = ["s1","s2","ns1", "icelltype", "GNa","PCa","Gto", "GKr", "GKs","GK1","GNaL","Gncx"];
                                          
        /**
        * These methods initialize the variables on the webpage.
        */
        _initializeFormCtrls(settings.formSettings);
        _initializeSettingCtrls(settings.calculationSettings);

        // On-click Action listener for the default button.
        var defaultButton = document.getElementById("default");
        defaultButton.addEventListener("click", function(e) {
          setDefaultFormCtrls();
          setDefaultSettingCtrls();
          updateCalculations();
        });

        // On-click Action listener for the print button.
        var printButton = document.getElementById("print");
        printButton.addEventListener("click", function(e) {             
          mediator.printPoints(settings, fetchPointsToPrint());
        });

        /**
        * This method initializes the form settings to their default values.
        * 
        * @param {settingsParam} - an object that holds the default form settings
        */
        function _initializeFormCtrls(settingsParam){
          formCtrls.forEach(function(ctrl){
            var ele = document.getElementsByName(ctrl)[0];             
            if(ele.type == "select-one"){ // For the currents drop down
              for (var i = 0, j = ele.options.length; i < j ; i++) {
                var option = ele.options[i];
                if (option.value === settingsParam[ele.name]) {              
                  ele.selectedIndex = i;
                  break;
                }
              }
            } 
            else{
              ele.checked = settingsParam[ele.name];
            }                                            
            _appendHandler(ele, settingsParam);           
          });
        }

      /**
      * This method initializes the parameter settings to their default values.
      * 
      * @param {settingsParam} - an object that holds the default parameter settings
      */
      function _initializeSettingCtrls(settingsParam){      
        settingCtrls.forEach( function(ctrl){
          var ele = document.getElementsByName(ctrl)[0];           
            if(ele.type == "select-one"){ // For the currents drop down
              for (var i = 0, j = ele.options.length; i < j ; i++) {
                var option = ele.options[i];               
                if (utils.numericValue(option.value) === settingsParam[ele.name]) {              
                  ele.selectedIndex = i;                  
                  _iTypeChanged(ele);
                  break;
                }
              }
            }
            else{
              ele.value = settingsParam[ele.name]; 
            }         
          _appendHandler(ele, settingsParam); 
        });
      }

      /**
      * This method adds an action listener that tracks change to the form and 
      * the parameter variables that are passed to it one element at a time
      * If there is a change event on a check box, then the updateDisplay method is called
      * else for a text box the calculations are updated. 
      * 
      * @param {ele} - the element to which listener is to be appended.
      * @param {settingsParam} - an object that holds the default parameter settings
      *
      */
      function _appendHandler(ele, settingsParam){ 
        var propName = (ele.type === "checkbox")?  "checked" : "value";
        ele.addEventListener("change", function(e) {             
          settingsParam[ele.name] = (ele.type == "select-one")? ele.options[ele.selectedIndex][propName]: utils.numericValue(ele[propName]);                                                        
          if(ele.type === "checkbox" || (ele.type == "select-one" && ele.name === "secondaryPlot")) {
            updateDisplay();
          }
          else{           
            updateCalculations();
          } 
        });
      }

      /**
      * This method updates the value for 'Gks' and 'Gto' input fields 
      * based on the value selected for 'iType' option field.
      * @param {ele} - the element to which listener is to be appended.
      * @param {settingsParam} - an object that holds the default parameter settings
      *
      */  

      function _iTypeChanged(ele){    
      var dependents = ["GNa","PCa","Gto", "GKr", "GKs","GK1","GNaL","Gncx"];
       if(ele){
        ele.addEventListener("change", function(e) {
         var  selectedText = ele.options[ele.selectedIndex].text,
              selectedVal = utils.numericValue(ele.options[ele.selectedIndex].value);
          if(selectedText && (selectedVal >= 0)){           
             settings.calculationSettings.setCellTypeDependents(settings, selectedText);
             dependents.forEach(function(item){
              var eleSub = document.getElementsByName(item)[0]; 
                if(eleSub){
                  eleSub.value = settings.calculationSettings[eleSub.name];
                }                
             });                                       
         }
       });
      }
    }

      /**
      * This method is used to set the form settings to their default values  
      * initialSettings is a global variable where all the default values are stores and it is used to 
      * restore the default values.
      */

      function setDefaultFormCtrls(){                
        formCtrls.forEach( function(ctrl){
          var ele = document.getElementsByName(ctrl)[0]; 
          settings.formSettings[ele.name] =  initialSettings.formSettings[ele.name];
          if(ele.type == "select-one"){
            for (var i = 0, j = ele.options.length; i < j ; i++) {
              var option = ele.options[i];
              if (option.value === initialSettings.formSettings[ele.name]) {              
                ele.selectedIndex = i;
                break;
              }
            }
          } 
          else{
            ele.checked = initialSettings.formSettings[ele.name];
          }                                                      
        });
      }
      /**
      * This method is used to set the parameter settings to their default values  
      * initialSettings is a global variable where all the default values are stores and it is used to 
      * restore the default values.
      */
      function setDefaultSettingCtrls(){                
        settingCtrls.forEach( function(ctrl){
          var ele = document.getElementsByName(ctrl)[0];
          settings.calculationSettings[ele.name] =  initialSettings.calculationSettings[ele.name];  
          if(ele.type == "select-one"){
            for (var i = 0, j = ele.options.length; i < j ; i++) {
              var option = ele.options[i];
              if (utils.numericValue(option.value) === initialSettings.calculationSettings[ele.name]) {              
                ele.selectedIndex = i;
                break;                
              }
            }
          } 
          else{
            ele.value = initialSettings.calculationSettings[ele.name];
          }                              
          });
        }       
      } 

      function updateCalculations() {        
        mediator.updateCalculator(_.cloneDeep(settings));
      }


      function updateDisplay() {
       mediator.updateDisplay(_.cloneDeep(settings));       
      }

      /**
      * This function identifies what are the form settings that are currently 
      * selected fetches the points that need to be printed.
      * The only points printed will be the one's that are selcted.
      *
      * @return {Array} - that will contain a list of points to be printed. 
      */
      function fetchPointsToPrint(){
        var printPoints = [];
        var formSettings = settings.formSettings;
        for(var setting in formSettings) {
          if(formSettings.hasOwnProperty(setting)){
            if(      (formSettings[setting] === true) 
            ||  (formSettings[setting] === 1) 
            ||  (setting === "secondaryPlot") ) {
              if(setting === "secondaryPlot"){
                printPoints.push(formSettings[setting]);
              }
              else{
                var name = getPointName(setting);                     
                if(name){
                  if(settings.calculationSettings.pointBuffer.points[name]){
                    printPoints.push(name);                               
                  }                        
                }
              }
            }
          }             
        }
        return printPoints;       
      }

      /**
      * This function seperates the string "display" from the form setting variable to identify 
      * the point name and returns it if there is a variable with string display in it else returns null.
      * Eg: "DisplayV" would return v - which is the variable name.
      *  
      * @return {string} - the name of the variable after seperating display from it.
      */ 
      function getPointName(displayName){
      // follows the convention of names staring with display
        if(displayName  && (typeof displayName === "string") && displayName.includes("display")){
          return displayName.replace("display","").toLowerCase();
        }
        else {
          return null;
        }
      }

      /**
      * This is the object that will be returned by the function. These are the
      * only things that will be publicly accessible after the form is
      * initialized.
      */
      var api = {
        initialize: initialize,
        updateCalculations: updateCalculations,
        updateDisplay: updateDisplay
      };
      return api;
  });

