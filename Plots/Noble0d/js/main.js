require.config({
	paths: {
		calculator: "calculator",
		form: "form",
		mediator: "mediator",
		plots: "plots",
		pointBuffer: "pointBuffer",
		utility: "utility",
	},
});

define(
function initialize(require, exports, module) {

	var defaultSettings = {
		v: -80.0,
		m: 0.0,
		h: 1.0,
		n: 0.0,

		ik: 0,
		ina: 0, 
		il: 0,

		cm: 12,
		gan: 0.0,
		gkMod: 1.2,
		ean: -60,
		stimmag: -106,
		stimdur: 2.0,
		gna1: 400.0,
		gna2: 0.14,
		s1: 250,
		s2: 1000,
		ns1: 4,
		period: 500.0,
		timestep: 0.01,
	};

	var plots = require("plots");
	var calculator = require("calculator");
	var mediator = require("mediator");
	var form = require("form");

	plots.initialize();
	calculator.initialize(defaultSettings);
	mediator.initialize(calculator, plots);

	form.initialize(mediator, defaultSettings);
});