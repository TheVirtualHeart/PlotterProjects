/**
  * This module describes the Form element. This form can alter the appearance
  * of the plot, describing what variables are plotted and how the Mitchell 
  * differential equation is calculated.
  */
  define(["utility"],
    function MitchellForm(utils) {
      "use strict";

  /**
  * This object describes the settings for the form.
  */
  var mediator,
  settings,
  initialSettings;


  /**
  * Initialize the form. Define the initial settings of the form and define
  * the interface that the form will interact with. After that, bind the UI
  * compenents to specific actions.
  */
  function initialize(defaultSettings, mediatorObj) {
    settings = defaultSettings;
    initialSettings = _.cloneDeep(defaultSettings);
    mediator = mediatorObj;

    /*
    * Set the DOM input to the value in the settings and
    * add an event listener so that it updates the values on 
    * change
    */
    var  formCtrls      = ["displayV", "displayH", "displayS1S2"],
    settingCtrls  = ["s1", "ns1", "s2", "tau_in", "tau_out", "tau_open", "tau_close", "v_gate"];

    _initializeFormCtrls(settings.formSettings);
    _initializeSettingCtrls(settings.calculationSettings);

    /*
    *Default functionality
    *Sets default value on the UI and updates the graph accordingly
    */
    var defaultBtn = document.getElementById("default");
    defaultBtn.addEventListener("click", function(e) {
      _setDefaultFormCtrls();
      _setDefaultSettingCtrls();
      updateCalculations();
    });

    /*
    *Print functionality
    *Prints the points for selected options 
    */

    var printButton = document.getElementById("print");
    printButton.addEventListener("click", function(e) {           
      mediator.printPoints(settings, _fetchPointsToPrint());
    });

    /*
     * Sets default value for Form controls
     */
     function _initializeFormCtrls(paramSettings){
      formCtrls.forEach( function(ctrl){
        var ele = document.getElementsByName(ctrl)[0];                        
        ele.checked = paramSettings[ele.name]; 
        _appendHandler(ele, paramSettings);           
      });
    }

    /*
     * Sets default values for Setting controls
     * Generic Initilizer
     */
     function _initializeSettingCtrls(paramSettings){
      settingCtrls.forEach( function(ctrl){
        var ele = document.getElementsByName(ctrl)[0];                                    
        ele.value = paramSettings[ele.name];
        _appendHandler(ele, paramSettings); 
      });
    }


    /*
     * Generic handler to handle user input
     */
     function _appendHandler(ele, paramSettings){ 
      var propName =   (ele.type === "checkbox")?  "checked" : "value";
      ele.addEventListener("change", function(e) {  
        paramSettings[ele.name] = utils.numericValue(ele[propName]); 

        if(ele.type === "checkbox") {
          updateDisplay();
        } 
        else{
          updateCalculations();
        }                        

      });
    } 

    /*
    * Sets default value for form controls
    */

    function _setDefaultFormCtrls(){      
      formCtrls.forEach( function(ctrl){
        var ele = document.getElementsByName(ctrl)[0]; 
        settings.formSettings[ele.name] =  initialSettings.formSettings[ele.name];                      
        ele.checked = initialSettings.formSettings[ele.name]; 
      });

    }

    /*
    * Sets default value for Settings controls
    */

    function _setDefaultSettingCtrls(){      
      settingCtrls.forEach( function(ctrl){
        var ele = document.getElementsByName(ctrl)[0]; 
        settings.calculationSettings[ele.name] =  initialSettings.calculationSettings[ele.name];             
        ele.value = initialSettings.calculationSettings[ele.name];
      });

    }

    /*
    * This function returns name of the controls 
    * for which the points need to be displayed
    * when print is clicked
    */

    function _fetchPointsToPrint(){
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
              var name = _getPropertyName(setting);                     
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


    /*
    * This function retruns the property name
    * @param {displayName} - display name which is provided in the name attribute for a HTML tag 
    */

    function _getPropertyName(displayName){
      // follows the convention of names staring with display
      if(displayName  && (typeof displayName === "string") && displayName.includes("display")){

        return displayName.replace("display","").toLowerCase();
      }
      else {
        return null;
      }
      
    }        
  }
  
  /*
  * perform calculations
  */
  function updateCalculations() {
    mediator.updateCalculator(_.cloneDeep(settings));
  }
  
  /*
  * update graph display
  */
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