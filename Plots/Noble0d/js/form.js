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
	var settings = null;


	/**
	 * Initialize the form. Define the initial settings of the form and define
	 * the interface that the form will interact with. After that, bind the UI
	 * compenents to specific actions.
	 */
	function initialize(defaultSettings, mediatorObj) {
        //settings = utils.implementsFor(settings, defaultSettings);
		// var overwrite = newSettings || {};
		// for (var attrname in overwrite) { 
		// 	if (settings.defaults.hasOwnProperty(attrname)) {
		// 		settings.defaults[attrname] = overwrite[attrname];
		// 	} 
		// };
		// mediator = pmediator;
		// setControls();
		// setControlValues(settings.defaults);
		// bindUIActions();
        
        
        settings = defaultSettings;
        mediator = mediatorObj;
        
        
        // bindFormElement(document.getElementById("displayV"), settings.formSettings.displayV, "checked");
        
        
        /*
         * Set the DOM input to the value in the settings and
         * add an event listener so that it updates the values on 
         * change
         */
        var displayV = document.getElementById("displayV");
        displayV["checked"] = settings.formSettings["displayV"];
        displayV.addEventListener("change", function(e) {
            settings.formSettings.displayV = displayV["checked"];
            
            updateCalculations();
        });
        
        var displayM = document.getElementById("displayM");
        displayM["checked"] = settings.formSettings["displayM"];
        displayM.addEventListener("change", function(e) {
            settings.formSettings.displayM = displayM["checked"];
            
            updateCalculations();
        });
        
        var displayH = document.getElementById("displayH");
        displayH["checked"] = settings.formSettings["displayH"];
        displayH.addEventListener("change", function(e) {
            settings.formSettings.displayH = displayH["checked"];
            
            updateCalculations();
        });
        
        var displayN = document.getElementById("displayN");
        displayN["checked"] = settings.formSettings["displayN"];
        displayN.addEventListener("change", function(e) {
            settings.formSettings.displayN = displayN["checked"];
            
            updateCalculations();
        });
        
        var displayS1S2 = document.getElementById("displayS1S2");
        displayS1S2["checked"] = settings.formSettings["displayS1S2"];
        displayS1S2.addEventListener("change", function(e) {
            settings.formSettings.displayS1S2 = displayS1S2["checked"];
            
            updateCalculations();
        });
        
        var secondaryPlot = document.getElementById("secondaryPlot");
        secondaryPlot.selectedIndex = settings.formSettings.secondaryPlot;
        for (var i = 0; i < secondaryPlot.options.length; i++) {
            var option = secondaryPlot.options[i];
            if (option.value === settings.formSettings["secondaryPlot"]) {
                secondaryPlot.selectedIndex = i;
            }
        }
        secondaryPlot.addEventListener("change", function(e) {
            settings.formSettings.secondaryPlot = secondaryPlot.options[secondaryPlot.selectedIndex].value;
            updateCalculations();
        });
        
        //secondaryPlot["selected"] = settings.formSettings["secondaryPlot"];
        // displayS1S2.addEventListener("change", function(e) {
        //     settings.formSettings.displayS1S2 = displayS1S2["checked"];
            
        //     updateCalculations();
        // });
        
        var gna1Input = document.getElementsByName("gna1")[0];
        gna1Input["value"] = settings.calculationSettings["gna1"];
        gna1Input.addEventListener("change", function(e) {
            settings.calculationSettings.gna1 = 
                utils.numericValue(gna1Input["value"]);
            
            updateCalculations();
        });
        
        var gna2Input = document.getElementsByName("gna2")[0];
        gna2Input["value"] = settings.calculationSettings["gna2"];
        gna2Input.addEventListener("change", function(e) {
            settings.calculationSettings.gna2 = 
                utils.numericValue(gna2Input["value"]);
            
            updateCalculations();
        });
        
        var ganInput = document.getElementsByName("gan")[0];
        ganInput["value"] = settings.calculationSettings["gan"];
        ganInput.addEventListener("change", function(e) {
            settings.calculationSettings.gan = 
                utils.numericValue(ganInput["value"]);
            
            updateCalculations();
        });
        
        var gkModInput = document.getElementsByName("gkMod")[0];
        gkModInput["value"] = settings.calculationSettings["gkMod"];
        gkModInput.addEventListener("change", function(e) {
            settings.calculationSettings.gkMod = 
                utils.numericValue(gkModInput["value"]);
            
            updateCalculations();
        });
        
        var s1Input = document.getElementsByName("s1")[0];
        s1Input["value"] = settings.calculationSettings["s1"];
        s1Input.addEventListener("change", function(e) {
            settings.calculationSettings.s1 = 
                utils.numericValue(s1Input["value"]);
            
            updateCalculations();
        });
        
        var ns1Input = document.getElementsByName("ns1")[0];
        ns1Input["value"] = settings.calculationSettings["ns1"];
        ns1Input.addEventListener("change", function(e) {
            settings.calculationSettings.ns1 = 
                utils.numericValue(ns1Input["value"]);
            
            updateCalculations();
        });
        
        var s2Input = document.getElementsByName("s2")[0];
        s2Input["value"] = settings.calculationSettings["s2"];
        s2Input.addEventListener("change", function(e) {
            settings.calculationSettings.s2 = 
                utils.numericValue(s2Input["value"]);
            
            updateCalculations();
        });
        
        // setControls();
        // setControlValues();
        // bindUIActions();
	}
    
    
    function updateCalculations() {
        console.log(_.cloneDeep(settings));
        mediator.updateCalculator(_.cloneDeep(settings));
    }
    
    
    function updateDisplay() {
        mediator.updateDisplay(_.cloneDeep(settings));
    }
    
	// /**
	//  * A function called during initialization to set the control references to
	//  * their respective DOM element.
	//  */
	// function setControls() {
	// 	controls = {
	// 		displayS1S2: 	document.getElementById("displayS1S2"),
	// 		displayV: 		document.getElementById("displayV"), 
	// 		displayM: 		document.getElementById("displayM"), 
	// 		displayH: 		document.getElementById("displayH"), 
	// 		displayN: 		document.getElementById("displayN"), 
	// 		secondaryPlot:  document.getElementById("secondaryPlot"), 
	// 		gan: 			document.getElementsByName("gan")[0],
	// 		gkMod: 			document.getElementsByName("gkMod")[0],
	// 		gna1: 			document.getElementsByName("gna1")[0],
	// 		gna2: 			document.getElementsByName("gna2")[0],
	// 		ns1: 			document.getElementsByName("ns1")[0],
	// 		s2: 			document.getElementsByName("s2")[0],
	// 		s1: 			document.getElementsByName("s1")[0],
	// 		updateButton: 	document.getElementById("update"),
	// 		resetButton: 	document.getElementById("default"),
	// 		printButton: 	document.getElementById("print"),
	// 	};
	// }


	// /**
	//  * Set the values of the control elements to the ones specified in the
	//  * default settings.
	//  */
	// function setControlValues() {
	// 	controls.s2.value = settings.calculationSettings.s2;
	// 	controls.ns1.value = settings.calculationSettings.ns1;
	// 	controls.s1.value = settings.calculationSettings.s1;
	// 	controls.gna1.value = settings.calculationSettings.gna1;
	// 	controls.gna2.value = settings.calculationSettings.gna2;
	// 	controls.gkMod.value = settings.calculationSettings.gkMod;
	// 	controls.gan.value = settings.calculationSettings.gan;
	// }


	// /**
	//  * Binds the controls on the form to their specific functions
	//  */
	// function bindUIActions() {
	// 	// controls.resetButton.addEventListener("click", reset);
	// 	controls.updateButton.addEventListener("click", updatePage);

	// 	controls.gna1.addEventListener("change", updatePage);
	// 	controls.gna2.addEventListener("change", updatePage);
	// 	controls.ns1.addEventListener("change", updatePage);
	// 	controls.s2.addEventListener("change", updatePage);
	// 	controls.s1.addEventListener("change", updatePage);
	// 	controls.gan.addEventListener("change", updatePage);
	// 	controls.gkMod.addEventListener("change", updatePage);

	// 	controls.displayS1S2.addEventListener("change", updatePage);
	// 	controls.displayV.addEventListener("change", updatePage);
	// 	controls.displayM.addEventListener("change", updatePage);
	// 	controls.displayH.addEventListener("change", updatePage);
	// 	controls.displayN.addEventListener("change", updatePage);
        
	// 	// controls.displayS1S2.addEventListener("change", toggleDisplayS1S2);
	// 	// controls.displayV.addEventListener("change", toggleDisplayV);
	// 	// controls.displayM.addEventListener("change", toggleDisplayM);
	// 	// controls.displayH.addEventListener("change", toggleDisplayH);
	// 	// controls.displayN.addEventListener("change", toggleDisplayN);

	// 	// controls.secondaryPlot.addEventListener("change", getSecondaryDisplay);
	// }


	// /**
	//  * Resets everything to a default state. This includes the form, and any
	//  * other objects on the page, such as the graph.
	//  */
	// function reset() {
	// 	resetForm();
	// 	updatePage();
	// }

	// /**
	//  * Resets the form elements to the ones specified in settings.defaults.
	//  */
	// function resetForm() {
	// 	controls.gan.value 		= settings.defaults.gan;
	// 	controls.gkMod.value 	= settings.defaults.gkMod;
	// 	controls.gna1.value 	= settings.defaults.gna1;
	// 	controls.gna2.value 	= settings.defaults.gna2;
	// 	controls.ns1.value 		= settings.defaults.ns1;                        
	// 	controls.s2.value 		= settings.defaults.s2;
	// 	controls.s1.value 		= settings.defaults.s1;
	// }


	// /**
	//  * Update Everything on the page. Set the values to the ones specified in 
	//  * the controls, recalculate, and call the update function.
	//  */
	// function updatePage() {
	// 	// var newSettings = exportValues();
	// 	// mediator.updateGraph(newSettings);
    //     console.log(settings);
	// }


	// /**
	//  * get the value of the secondaryPlot select box
	//  * @return {String} - a string containing the current value of the 
	//  * secondary plot.
	//  */
	// function getSecondaryDisplay() {
	// 	var value = controls.secondaryPlot.options[controls.secondaryPlot.selectedIndex].value;
	// 	if (value === "") {
	// 		value = null;
	// 	}
	// 	mediator.setSecondaryPlot(value);
	// }


	// /**
	//  * Toggle whether or not the S1-S2 overlay is displayed
	//  */
	// function toggleDisplayS1S2() {
	// 	mediator.setDisplayOverlay(controls.displayS1S2.checked);
	// }
	// /** 
	//  * Toggle the displayV variable
	//  */
	// function toggleDisplayV() {
	// 	mediator.displayVariable("v", controls.displayV.checked);
	// }
	// /** 
	//  * Toggle the displayM variable
	//  */
	// function toggleDisplayM() {
	// 	mediator.displayVariable("m", controls.displayM.checked);
	// }
	// /** 
	//  * Toggle the displayH variable
	//  */
	// function toggleDisplayH() {
	// 	mediator.displayVariable("h", controls.displayH.checked);
	// }
	// /** 
	//  * Toggle the displayN variable
	//  */
	// function toggleDisplayN() {
	// 	mediator.displayVariable("n", controls.displayN.checked);
	// }


	// /**
	//  * Get the values from the form and export them as an object
	//  * 
	//  * @return {Object} - an object where the key is the name of the form
	//  * element and the value is the value of that form element.
	//  */
	// function exportValues() {
	// 	// var settings = {
	// 	// 	gna1: 	utils.numericValue(controls.gna1.value),
	// 	// 	gna2: 	utils.numericValue(controls.gna2.value),
	// 	// 	gkMod:  utils.numericValue(controls.gkMod.value),
	// 	// 	gan: 	utils.numericValue(controls.gan.value),
	// 	// 	ns1:  	utils.numericValue(controls.ns1.value),
	// 	// 	s2:   	utils.numericValue(controls.s2.value),
	// 	// 	s1: 	utils.numericValue(controls.s1.value),
	// 	// };
    //     console.log(settings);
	// 	return settings;
	// }


	/**
	 * This is the object that will be returned by the function. These are the
	 * only things that will be publicly accessible after the form is
	 * initialized.
	 */
	var api = {
		initialize: initialize,
        updateCalculations: updateCalculations,
        updateDisplay: updateDisplay
		//exportValues: exportValues,
	};
	return api;
});