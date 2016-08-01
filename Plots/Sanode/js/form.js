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
        var settings = null;
        var initialSettings = null;


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
            var formCtrls   = [ "displayAPDDI",/* "displayS1S2"*/ "displayV",
                                "displaySdl",   "displaySdt",   "displaySy",
                                "displaySq",    "displaySpaf",  "displaySpii",
                                "displaySfl",   "displaySft",   "displaySr",
                                "displaySxs",   "displaySpas",  "secondaryPlot",
                                "displaySh1",   "displaySh2",    "displaySm"],
                settingCtrls = ["gcal","gcat","gto","gkr","gks","endTime","sanodeType"],

                sanodeTypeValues = {  sanodeC : {gcal: 0.58e-2,gcat: 0.43e-2,  gto: 4.91e-3,  gkr: 7.97e-4,   gks: 3.45e-4 },
                                      sanodeP : {gcal: 6.59e-2,gcat: 1.39e-2,  gto: 36.49e-3, gkr: 1.6e-2,    gks: 1.04e-2 }
                                    }; 
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
            
            if(ele){
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

                  for (var i = 0, j = ele.options.length; i < j ; i++) {
                    
                    var option = ele.options[i];               
                    if (option.value === settingsParam[ele.name]) {              
                      ele.selectedIndex = i;
                      _SanodeTypeChanged(ele, settingsParam);
                      break;
                    }
                  }
                }
                else{
                  if(ele.name === "endTime"){
                    ele.value = settingsParam[ele.name] * utils.timeUnit.seconds; 
                  }
                  else{
                    ele.value = settingsParam[ele.name]; 
                  }
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
              if(ele.name === "endTime"){
                settingsParam[ele.name] = utils.numericValue(ele[propName]) / utils.timeUnit.seconds;
              }
              else{
              settingsParam[ele.name] = (ele.type == "select-one")? ele.options[ele.selectedIndex][propName]: utils.numericValue(ele[propName]);                                                        
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

        function _SanodeTypeChanged(ele, settingsParam){
            
            if(ele){
                ele.addEventListener("change", function(e) {
                  var selectedVal = ele.options[ele.selectedIndex].value;
                  if(selectedVal){
                    
                    var objSelected = sanodeTypeValues[selectedVal];
                    if(objSelected){
                      for(e in objSelected){
                        document.getElementsByName(e)[0].value = objSelected[e];
                        settingsParam[e] = objSelected[e]; 
                      }
                      
                    }
                    if(selectedVal === "sanodeP"){
                        addPDependants();
                      
                    }
                    else{
                        removePDependants();
                      
                    }
                  }
                });
            }
            
        }

        function addPDependants(){

            var controls = {sh1: "yellowGreen",sh2: "indigo",sm: "lightCoral"},
                formControls = document.getElementById("formControls"),
                secondaryPlotHolder = document.getElementsByName("secondaryPlotHolder")[0],
                div, input, label, 
                display, attr;


            for( var item in controls){

                display = "display"+item.charAt(0).toUpperCase() + item.slice(1);
                
                div = document.createElement('div');
                attr = {id: display,class:'plotter_inputgroup plotter_inputgroup-'+controls[item]};
                _setAttributes(div,attr);

                input = document.createElement('input');                      
                attr = {type:'checkbox',id: display,name: display };
                _setAttributes(input,attr);

                label = document.createElement('label');                      
                attr = {for: display};
                _setAttributes(label,attr);
                label.innerHTML = 'Display '+getPointName(display).slice(1)+' gate';

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
         function removePDependants(){
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
          
          function setDefaultFormCtrls(){                
            formCtrls.forEach( function(ctrl){
              var ele = document.getElementsByName(ctrl)[0]; 
              if(ele){
                

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
              if(ele.type == "select-one"){
                if(ele.name === "sanodeType" && ele.options[ele.selectedIndex].value
                                             != initialSettings.calculationSettings[ele.name]){
                        removePDependants();
                }
              }
              settings.calculationSettings[ele.name] =  initialSettings.calculationSettings[ele.name];
              if(ele.name === "endTime"){
                    ele.value = initialSettings.calculationSettings[ele.name] * utils.timeUnit.seconds;
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
              if(      (formSettings[setting] === true) ||  (formSettings[setting] === 1) 
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


