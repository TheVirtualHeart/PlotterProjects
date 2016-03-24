require.config({
	paths: {
		calculator: "calculator",
		form: "form",
		mediator: "mediator",
		plots: "plots",
		pointBufferAnalyzer: "pointBufferAnalyzer",
        s1s2Analyzer: "s1s2Analyzer",
		utility: "utility"
	},
});

// require(["plots", "calculator", "mediator", "form"],
// function initialize(plots, calculator, mediator, form) {

require(["settings", 
         "mediator", 
         "form", 
         "calculator", 
         "pointBufferAnalyzer",
         "s1s2Analyzer",
         "plots"],
function initialize(
    settings, 
    mediator,
    form, 
    calculator, 
    pointBufferAnalyzer,
    s1s2Analyzer,
    plots) {
    
    /*
     * Initialize the default settings for the plot
     */
    settings.initialize({
        formSettings: {
            displayV: true
        }, 
        calculationSettings: {
            pointBuffer: {
                bufferSize: 1000
            }
        }
    });
    var plotSettings = settings.getSettings();


    /*
     * Initialize a calculator
     */
    calculator.initialize(plotSettings);
        
    
    /*
     * Initialize a point buffer analyzer
     */
    pointBufferAnalyzer.initialize(plotSettings);
    s1s2Analyzer.initialize(plotSettings);
    calculator.addAnalysisFunction(pointBufferAnalyzer);
    calculator.addAnalysisFunction(s1s2Analyzer);
        
    
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
    
    mediator.updateCalculator(plotSettings);
    
    
    window.calculator = calculator;
    window.pointBufferAnalyzer = pointBufferAnalyzer;
});