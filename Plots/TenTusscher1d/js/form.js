/**
  * This module describes the Form element. This form can alter the appearance
  * of the plot, describing what variables are plotted and how the TenTusscher 
  * differential equation is calculated.
*/
define(["utility"],
function TusscherForm(utils) {
  "use strict";
  var mediator;
  /**
    * This object describes the settings for the form.
  */
  var settings = null;
  var initialSettings = null;

      // Stores all the variables that are displayed on the webpage.
  var   formCtrls    =  [ "displayAPDDI"  , "displayS1S2"  , "displayV",
                          "displayNai"    , "displayKi"    , "displaySm"    , "displaySh",
                          "displaySj"     , "displaySxr1"  , "displaySxr2"  , "displaySxs",
                          "displaySr"     , "displaySs"    , "displaySd"    , "displaySf",  
                          "displaySfcass" , "displaySrr"   ,  "displayCai"  , "displayCasr",  
                          "displaySf2"    , "displayCass"   , "secondaryPlot"],                                         
  
  settingCtrls = ["s1","s2","ns1", "iType", "GNa" , "GCaL" , "Gto" , "Gkr" , "Gks" , "GK1"];
  
  
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
    
    /**
      * These methods initialize the variables on the webpage.
    */
    _initializeFormCtrls(settings.formSettings);
    _initializeSettingCtrls(settings.calculationSettings);
    
    // On-click Action listener for the default button.
    var defaultButton = document.getElementById("default");
    defaultButton.addEventListener("click", function(e) {
      _setDefaultFormCtrls();
      _setDefaultSettingCtrls();
      updateCalculations();
    });
    
    // On-click Action listener for the print button.
    var printButton = document.getElementById("print");
    printButton.addEventListener("click", function(e) {             
      mediator.printPoints(settings);
    });
  }   
  
  /**
    * This method initializes the form settings to their default values.
    * 
    * @param {settingsParam} - an object that holds the default form settings
  */
    function _initializeFormCtrls(settingsParam){
    formCtrls.forEach(function(ctrl){
      var ele = document.getElementsByName(ctrl)[0];  
      if(ele.type == "select-one"){ // For the currents drop down
        // set label for currents
        _setSecondaryPlotLabels(ele);
      } 
      else{
        //set css class
        _setCssClass(ele);
      } 
      utils.setElementValue(ele,  settingsParam[ele.name]);                                          
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
        _iTypeChanged(ele);                                        
      }
      utils.setElementValue(ele,  settingsParam[ele.name]);
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
    
    ele.addEventListener("change", function(e) {             
      settingsParam[ele.name] = utils.getElementValue(ele);                                                        
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
    if(ele){
      ele.addEventListener("change", function(e) {
        var selectedVal = ele.options[ele.selectedIndex].value;
        if(selectedVal){
          settings.calculationSettings.updateDependents(selectedVal, settings.calculationSettings);

          //update display for setting controls
          settingCtrls.forEach( function(ctrl){
          var ele1 = document.getElementsByName(ctrl)[0];          
          utils.setElementValue(ele1,  settings.calculationSettings[ele1.name]);             
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
    
    function _setDefaultFormCtrls(){                
    formCtrls.forEach( function(ctrl){
      var ele = document.getElementsByName(ctrl)[0];
      settings.formSettings[ele.name] =  initialSettings.formSettings[ele.name];
      utils.setElementValue(ele, settings.formSettings[ele.name]);                                             
    });
  }
    /**
    * This method is used to set the parameter settings to their default values  
    * initialSettings is a global variable where all the default values are stores and it is used to 
    * restore the default values.
  */
    function _setDefaultSettingCtrls(){                
    settingCtrls.forEach( function(ctrl){
      var ele = document.getElementsByName(ctrl)[0];
      // required 
      if(ele.type == "select-one"){
        var selectedVal = ele.options[ele.selectedIndex].value
        if(initialSettings.calculationSettings[ele.name] != selectedVal){
            settings.calculationSettings.updateDependents(initialSettings.calculationSettings[ele.name], settings.calculationSettings);
        }
      }
      settings.calculationSettings[ele.name] =  initialSettings.calculationSettings[ele.name];  
      utils.setElementValue(ele, settings.calculationSettings[ele.name]);                          
    });
  }
    
    function _setSecondaryPlotLabels(ele){    
    if(ele["options"]){
      for (var i = 0, j = ele.options.length; i < j ; i++) {
        ele.options[i].text = initialSettings.formSettings[ele.options[i].value];
      }
    }    
  }
    
    function  _setCssClass(ele){
    var parentDiv = ele.parentElement,
    name = ele.name;
    if(parentDiv){
      name = name.replace('display', '');
      name = name.charAt(0).toLowerCase() + name.slice(1);            
      parentDiv.className = utils.getCssClass(settings.formSettings.colors[name]);
    }
  }    
  
  function updateCalculations() {        
    mediator.updateCalculator(_.cloneDeep(settings));
  }
  
  
  function updateDisplay() {
    mediator.updateDisplay(_.cloneDeep(settings));
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