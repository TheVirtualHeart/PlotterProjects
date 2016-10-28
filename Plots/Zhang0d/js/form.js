/**
  * This module describes the Form element. This form can alter the appearance
  * of the plot, describing what variables are plotted and how the Sanode 
  * differential equation is calculated.
  */

define(["utility"],
    function SanodeForm(utils) {
        "use strict";

        var mediator;

        /**
        * This object describes the settings for the form.
        */
        var settings = null,
        initialSettings = null,
        
        formCtrls   = [ "displayAPDDI", "displayV",
                        "displaySdl",   "displaySdt",   "displaySy",
                        "displaySq",    "displaySpaf",  "displaySpii",
                        "displaySfl",   "displaySft",   "displaySr",
                        "displaySxs",   "displaySpas",  "secondaryPlot",
                        "displaySh1",   "displaySh2",    "displaySm"],
        settingCtrls = ["gcal","gcat","gto","gkr","gks","endTime","sanodeType"];

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

          // Stores all the variables that are displayed on the webpage.
            
                
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
                  if(ele){
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
                  }
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
                  _sanodeTypeChanged(ele);                                        
                }
            
                if(ele.name === "endTime"){
                  ele.value = settingsParam[ele.name] * utils.timeUnit.getTimeUnit(settingsParam.tUnit);
                }
                else{
                  utils.setElementValue(ele,  settingsParam[ele.name]);
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
            ele.addEventListener("change", function(e) {             
              if(ele.name === "endTime")
                settingsParam[ele.name] = utils.numericValue(ele.value) / utils.timeUnit.getTimeUnit(settingsParam.tUnit);
              else{
                settingsParam[ele.name] =  utils.getElementValue(ele);
              }
              if(ele.type === "checkbox" || ele.type == "select-one"  && ele.name === "secondaryPlot") {
                  updateDisplay();
              }
              else{
                  updateCalculations();
              }  
            });
          } 

      /**
        * This method updates the value for input fields on the html page. 
        * based on the value selected for 'sanodeType' option field.
        * @param {ele} - the element to which listener is to be appended.
        * @param {settingsParam} - an object that holds the default parameter settings
        *
        */ 

        function _sanodeTypeChanged(ele){
            if(ele){
                ele.addEventListener("change", function(e) {
                  var selectedValue = ele.options[ele.selectedIndex].value;
                  if(selectedValue){
                    settings.calculationSettings.updateDependents(selectedValue, settings.calculationSettings);
                    //update display for setting controls
                    settingCtrls.forEach( function(ctrl){
                    var ele1 = document.getElementsByName(ctrl)[0];
                    if(ele1.name === "endTime"){
                        utils.setElementValue(ele1,  settings.calculationSettings[ele1.name] * utils.timeUnit.getTimeUnit(settings.calculationSettings.tUnit));
                    }
                    else{
                        utils.setElementValue(ele1,  settings.calculationSettings[ele1.name]);
                    }
                  });
                    if(selectedValue === "sanodeP"){
                        _addPDependants();
                      
                    }
                    else{
                        _removePDependants();
                      
                    }
                  }
                });
            }
            
        }

        function _addPDependants(){

            var controls = {sh1: "yellowGreen", sh2: "indigo",sm: "lightCoral"},
                formControls = document.getElementById("formControls"),
                secondaryPlotHolder = document.getElementsByName("secondaryPlotHolder")[0],
                div, input, label, 
                display, attr;


            for( var item in controls){

                display = "display"+item.charAt(0).toUpperCase() + item.slice(1);
                
                div = document.createElement('div');
                attr = {id: display,class:'plotter_inputgroup plotter_inputgroup-' + controls[item]};
                _setAttributes(div,attr);

                input = document.createElement('input');
                attr = {type:'checkbox',id: display, name: display };
                _setAttributes(input,attr);

                label = document.createElement('label');                      
                attr = {for: display};
                _setAttributes(label,attr);
                label.innerHTML = 'Display '+ (display).replace("display","").toLowerCase().slice(1)+' gate';

                div.appendChild(input);
                div.appendChild(label);
                
                formControls.insertBefore(div,secondaryPlotHolder);


            };
            var secondaryPlotOptions = ["ina"],
                option, select; 
            
            secondaryPlotOptions.forEach(function(item){
                display = "display"+item.charAt(0).toUpperCase() + item.slice(1);
                var option = document.createElement('option');
                attr = {id: display,value: item};
                _setAttributes(option,attr);
                option.innerHTML = item.charAt(0).toUpperCase() +"_" + item.charAt(1).toUpperCase() +item.slice(2);            
                
                select = document.getElementsByName("secondaryPlot")[0];
                select.appendChild(option);
            });

            function _setAttributes(el,attr){
                for(var key in attr) {
                   el.setAttribute(key, attr[key]);
                }
            }
            
            _initializeFormCtrls(settings.formSettings);
        }
         function _removePDependants(){
                var controls = {sh1: "yellowGreen",sh2: "indigo",sm: "lightCoral"},
                    formControls = document.getElementById("formControls");

                for( var item in controls){
                    var display = "display"+item.charAt(0).toUpperCase() + item.slice(1);
                    
                    formControls.removeChild(document.getElementById(display));
                }

                var secondaryPlotOptions = ["ina"],
                    option, select; 
                
                select = document.getElementsByName("secondaryPlot")[0];
                
            
            secondaryPlotOptions.forEach(function(item){
                display = "display"+item.charAt(0).toUpperCase() + item.slice(1);
                select.removeChild(document.getElementById(display));

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
              if(ele){
                  settings.formSettings[ele.name] =  initialSettings.formSettings[ele.name];
                  utils.setElementValue(ele, settings.formSettings[ele.name]) ;
                }
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
              if(ele.type == "select-one"){
                if(ele.name === "sanodeType" && ele.options[ele.selectedIndex].value
                                             != initialSettings.calculationSettings[ele.name]){
                    settings.calculationSettings.updateDependents(initialSettings.calculationSettings[ele.name], settings.calculationSettings);
                    _removePDependants();
                }

              }
              settings.calculationSettings[ele.name] =  initialSettings.calculationSettings[ele.name];
              if(ele.name === "endTime"){
                    utils.setElementValue(ele, settings.calculationSettings[ele.name] * utils.timeUnit.getTimeUnit(initialSettings.calculationSettings.tUnit));
              }
              else{
                    utils.setElementValue(ele, settings.calculationSettings[ele.name]) ;
              }
            });
        }       
        
        function updateCalculations() {        
          mediator.updateCalculator(_.cloneDeep(settings));
        }


        function updateDisplay() {
          mediator.updateDisplay(_.cloneDeep(settings));
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


