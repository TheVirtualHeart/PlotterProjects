require.config({
	paths: {
		calculator: "calculator",
		form: "form",
		mediator: "mediator",
		plots: "plots",
		pointBufferAnalyzer: "pointBufferAnalyzer",
		utility: "utility",
	},
});

// require(["plots", "calculator", "mediator", "form"],
// function initialize(plots, calculator, mediator, form) {

require(["settings", 
         "mediator", 
         "form", 
         "calculator", 
         "pointBufferAnalyzer",
         "plots"],
function initialize(
    settings, 
    mediator,
    form, 
    calculator, 
    pointBufferAnalyzer,
    plots) {
    
    /*
     * Initialize the default settings for the plot
     */
    settings.initialize({});
    var plotSettings = settings.getSettings();
    

    /*
     * Initialize a calculator
     */
    calculator.initialize(plotSettings);
        
    
    /*
     * Initialize a point buffer analyzer
     */
    pointBufferAnalyzer.initialize(plotSettings);
    calculator.addAnalysisFunction(pointBufferAnalyzer.aggregate);
        
    
    /*
     * Initialize the plot
     */
    plots.initialize(plotSettings);
    
    
    /*
     * Initialize a mediator with the calculator
     */
    mediator.initialize(calculator, plots);
    
    
    /*
     * Initialize a form
     */
    form.initialize(
        plotSettings,
        mediator
    );
    
    
    window.calculator = calculator;
    window.pointBufferAnalyzer = pointBufferAnalyzer;
});