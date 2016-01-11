/**
 * This module describes the Form element. This form can alter the appearance
 * of the plot, describing what variables are plotted and how the Noble 
 * differential equation is calculated.
 */
function NobleForm() {


	/**
	 * This object describes the settings for the form.
	 */
	var settings = {};
	settings.defaults = {
		v: 		   -80.0,
		m: 			0.0,
		h: 			1.0,
		n: 			0.0,
		gna1: 		400,
		gna2: 		0.14,
		s1: 		0,
		ns1: 		4,
		s2: 		2000,
		period: 	500
	};


	/**
	 * Reference variables for the DOM elements of the form.
	 */
	var controls = {
		displayV: 		document.getElementById("displayV"), 
		displayM: 		document.getElementById("displayM"), 
		displayH: 		document.getElementById("displayH"), 
		displayN: 		document.getElementById("displayN"), 
		secondaryPlot:  document.getElementById("secondaryPlot"), 
		gna1: 			document.getElementsByName("gna1")[0],
		gna2: 			document.getElementsByName("gna2")[0],
		s1: 			document.getElementsByName("s1")[0],
		ns1: 			document.getElementsByName("ns1")[0],
		s2: 			document.getElementsByName("s2")[0],
		period: 		document.getElementsByName("period")[0],
		updateButton: 	document.getElementById("update"),
		resetButton: 	document.getElementById("default"),
		printButton: 	document.getElementById("print")
	};


	/**
	 * Binds the controls on the form to their specific functions
	 */
	function bindUIActions() {
		controls.resetButton.addEventListener("click", reset);
		controls.updateButton.addEventListener("click", updatePage);

		controls.gna1.addEventListener("change", updatePage);
		controls.gna2.addEventListener("change", updatePage);
		controls.s1.addEventListener("change", updatePage);
		controls.ns1.addEventListener("change", updatePage);
		controls.s2.addEventListener("change", updatePage);
		controls.period.addEventListener("change", updatePage);

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
		console.log("resetting");
		resetForm();
		updatePage();
	}

	/**
	 * Resets the form elements to the ones specified in settings.defaults.
	 */
	function resetForm() {
		controls.gna1.value 	= settings.defaults.gna1;
		controls.gna2.value 	= settings.defaults.gna2;
		controls.s1.value 		= settings.defaults.s1;
		controls.ns1.value 		= settings.defaults.ns1;                        
		controls.s2.value 		= settings.defaults.s2;
		controls.period.value 	= settings.defaults.period;
	}


	/**
	 * Update Everything on the page. Set the values to the ones specified in 
	 * the controls, recalculate, and call the update function.
	 */
	function updatePage() {
		gna1 	= controls.gna1.value;
		gna2 	= controls.gna2.value;
		s1 		= controls.s1.value;
		ns1 	= controls.ns1.value;
		s2 		= controls.s2.value; 
		period 	= controls.period.value;
		buffer.calculate();
		update();
	}


	/**
	 * get the value of the secondaryPlot select box
	 * @return {String} - a string containing the current value of the 
	 * secondary plot.
	 */
	function getSecondaryDisplay() {
		var value = controls.secondaryPlot.options[controls.secondaryPlot.selectedIndex].value;
		//console.log(value);
		secondaryPlot = value;
	}


	/** 
	 * Toggle the displayV variable
	 */
	function toggleDisplayV() {
		displayV = controls.displayV.checked;
	}
	/** 
	 * Toggle the displayM variable
	 */
	function toggleDisplayM() {
		displayM = controls.displayM.checked;
	}
	/** 
	 * Toggle the displayH variable
	 */
	function toggleDisplayH() {
		displayH = controls.displayH.checked;
	}
	/** 
	 * Toggle the displayN variable
	 */
	function toggleDisplayN() {
		displayN = controls.displayN.checked;
	}


	/**
	 * This is the object that will be returned by the function. These are the
	 * only things that will be publicly accessible after the form is
	 * initialized.
	 */
	var api = {
		controls: controls
	};


	bindUIActions();
	return api;
}