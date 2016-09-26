/**
	* This module describes the Form element. This form can alter the appearance
	* of the plot, describing what variables are plotted and how the Noble 
	* differential equation is calculated.
*/
define(["utility"],
function NobleForm(utils) {
	"use strict";
	
	
	var mediator;
	var controls;
		
	/**
		* This object describes the settings for the form.
	*/
	var settings = null,
	initialSettings = null;
	
	var formCtrls = ["displayV", "displayM", "displayH", "displayN", "displayS1S2",
	"displayAPDDI", "secondaryPlot"],	               
	settingCtrls = ["gna1", "gna2", "gan", "gkMod", "s1", "ns1", "s2" ];
	
	
	/**
		* Initialize the form. Define the initial settings of the form and define
		* the interface that the form will interact with. After that, bind the UI
		* compenents to specific actions.
	*/
	function initialize(defaultSettings, mediatorObj) {
        
        settings = defaultSettings;
        initialSettings = _.cloneDeep(defaultSettings);
        mediator = mediatorObj;
        
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
	
	function _initializeFormCtrls(settingsParam){         
		formCtrls.forEach(function(ctrl){
			var ele = document.getElementsByName(ctrl)[0]; 
			console.log(ele);
			utils.setElementValue(ele,  settingsParam[ele.name]);                                          
			_appendHandler(ele, settingsParam); 
		});
	}
	
	function _initializeSettingCtrls(settingsParam){       
		settingCtrls.forEach( function(ctrl){
			var ele = document.getElementsByName(ctrl)[0];                     
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
			settingsParam[ele.name] =  utils.getElementValue(ele);
			if(ele.type === "checkbox" || (ele.type == "select-one" && ele.name === "secondaryPlot")) {
				updateDisplay();
			}
			else{           
				updateCalculations();
			}  
		});
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
			settings.calculationSettings[ele.name] =  initialSettings.calculationSettings[ele.name];  
			utils.setElementValue(ele, settings.calculationSettings[ele.name]);                    
		});
	}       
	
	
	function updateCalculations() {
		// console.log(_.cloneDeep(settings));
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