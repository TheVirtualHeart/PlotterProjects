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
	var settings = {};
	settings.defaults = {
		v: 		   -80.0,
		m: 			0.0,
		h: 			1.0,
		n: 			0.0,
		gan: 		0.0,
		gkMod: 		0.0,  
		gna1: 		400,
		gna2: 		0.14,
		ns1: 		4,
		s2: 		2000,
		s1: 		500
	};


	/**
	 * Initialize the form. Define the initial settings of the form and define
	 * the interface that the form will interact with. After that, bind the UI
	 * compenents to specific actions.
	 */
	function initialize(pmediator, newSettings) {
		var overwrite = newSettings || {};
		for (var attrname in overwrite) { 
			if (settings.defaults.hasOwnProperty(attrname)) {
				settings.defaults[attrname] = overwrite[attrname];
			} 
		};
		mediator = pmediator;
		setControls();
		setControlValues(settings.defaults);
		bindUIActions();
	}


	/**
	 * A function called during initialization to set the control references to
	 * their respective DOM element.
	 */
	function setControls() {
		controls = {
			displayS1S2: 	document.getElementById("displayS1S2"),
			displayV: 		document.getElementById("displayV"), 
			displayM: 		document.getElementById("displayM"), 
			displayH: 		document.getElementById("displayH"), 
			displayN: 		document.getElementById("displayN"), 
			secondaryPlot:  document.getElementById("secondaryPlot"), 
			gan: 			document.getElementsByName("gan")[0],
			gkMod: 			document.getElementsByName("gkMod")[0],
			gna1: 			document.getElementsByName("gna1")[0],
			gna2: 			document.getElementsByName("gna2")[0],
			ns1: 			document.getElementsByName("ns1")[0],
			s2: 			document.getElementsByName("s2")[0],
			s1: 			document.getElementsByName("s1")[0],
			updateButton: 	document.getElementById("update"),
			resetButton: 	document.getElementById("default"),
			printButton: 	document.getElementById("print"),
		};
	}


	/**
	 * Set the values of the control elements to the ones specified in the
	 * default settings.
	 */
	function setControlValues(values) {
		controls.s2.value = values.s2;
		controls.ns1.value = values.ns1;
		controls.s1.value = values.s1;
		controls.gna1.value = values.gna1;
		controls.gna2.value = values.gna2;
		controls.gkMod.value = values.gkMod;
		controls.gan.value = values.gan;
	}


	/**
	 * Binds the controls on the form to their specific functions
	 */
	function bindUIActions() {
		controls.resetButton.addEventListener("click", reset);
		controls.updateButton.addEventListener("click", updatePage);

		controls.gna1.addEventListener("change", updatePage);
		controls.gna2.addEventListener("change", updatePage);
		controls.ns1.addEventListener("change", updatePage);
		controls.s2.addEventListener("change", updatePage);
		controls.s1.addEventListener("change", updatePage);
		controls.gan.addEventListener("change", updatePage);
		controls.gkMod.addEventListener("change", updatePage);

		controls.displayS1S2.addEventListener("change", toggleDisplayS1S2);
		controls.displayV.addEventListener("change", toggleDisplayV);
		controls.displayM.addEventListener("change", toggleDisplayM);
		controls.displayH.addEventListener("change", toggleDisplayH);
		controls.displayN.addEventListener("change", toggleDisplayN);

		controls.secondaryPlot.addEventListener("change", getSecondaryDisplay);
	}


	/**
	 * Resets everything to a default state. This includes the form, and any
	 * other objects on the page, such as the graph.
	 */
	function reset() {
		resetForm();
		updatePage();
	}

	/**
	 * Resets the form elements to the ones specified in settings.defaults.
	 */
	function resetForm() {
		controls.gan.value 		= settings.defaults.gan;
		controls.gkMod.value 	= settings.defaults.gkMod;
		controls.gna1.value 	= settings.defaults.gna1;
		controls.gna2.value 	= settings.defaults.gna2;
		controls.ns1.value 		= settings.defaults.ns1;                        
		controls.s2.value 		= settings.defaults.s2;
		controls.s1.value 		= settings.defaults.s1;
	}


	/**
	 * Update Everything on the page. Set the values to the ones specified in 
	 * the controls, recalculate, and call the update function.
	 */
	function updatePage() {
		var newSettings = exportValues();
		mediator.updateGraph(newSettings);
	}


	/**
	 * get the value of the secondaryPlot select box
	 * @return {String} - a string containing the current value of the 
	 * secondary plot.
	 */
	function getSecondaryDisplay() {
		var value = controls.secondaryPlot.options[controls.secondaryPlot.selectedIndex].value;
		if (value === "") {
			value = null;
		}
		mediator.setSecondaryPlot(value);
	}


	/**
	 * Toggle whether or not the S1-S2 overlay is displayed
	 */
	function toggleDisplayS1S2() {
		mediator.setDisplayOverlay(controls.displayS1S2.checked);
	}
	/** 
	 * Toggle the displayV variable
	 */
	function toggleDisplayV() {
		mediator.displayVariable("v", controls.displayV.checked);
	}
	/** 
	 * Toggle the displayM variable
	 */
	function toggleDisplayM() {
		mediator.displayVariable("m", controls.displayM.checked);
	}
	/** 
	 * Toggle the displayH variable
	 */
	function toggleDisplayH() {
		mediator.displayVariable("h", controls.displayH.checked);
	}
	/** 
	 * Toggle the displayN variable
	 */
	function toggleDisplayN() {
		mediator.displayVariable("n", controls.displayN.checked);
	}


	/**
	 * Get the values from the form and export them as an object
	 * 
	 * @return {Object} - an object where the key is the name of the form
	 * element and the value is the value of that form element.
	 */
	function exportValues() {
		var settings = {
			gna1: 	utils.numericValue(controls.gna1.value),
			gna2: 	utils.numericValue(controls.gna2.value),
			gkMod:  utils.numericValue(controls.gkMod.value),
			gan: 	utils.numericValue(controls.gan.value),
			ns1:  	utils.numericValue(controls.ns1.value),
			s2:   	utils.numericValue(controls.s2.value),
			s1: 	utils.numericValue(controls.s1.value),
		};
		return settings;
	}


	/**
	 * This is the object that will be returned by the function. These are the
	 * only things that will be publicly accessible after the form is
	 * initialized.
	 */
	var api = {
		initialize: initialize,
		exportValues: exportValues,
	};
	return api;
});