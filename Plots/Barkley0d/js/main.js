require.config({
	paths: {
		calculator: "calculator",
		form: "form",
		mediator: "../../Noble0d/js/mediator",
		plots: "plots",
		pointBufferAnalyzer: "pointBufferAnalyzer",
        s1s2Analyzer: "../../Noble0d/js/s1s2Analyzer",
        utility: "../../Noble0d/js/utility"
	},
});


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
            displayV: true,
            displayU: true,
        }, 
        calculationSettings: {
            pointBuffer: {
                bufferSize: 1000
            },
        },
        plotSettings: {
            Barkley: {
                plots: {
                    mainPlot: {

                        xAxis: "Time (ms)",
                        yAxis: "",
                    }
                }
            }
        }
    });
    var analyzers = [pointBufferAnalyzer, s1s2Analyzer],
        plotSettings = settings.getSettings();

    /*
     * Initialize a calculator
     */
    calculator.initialize(plotSettings);
        
    
    /*
     * Initialize analyzers
     */
    analyzers.forEach(function(analyzer){
        analyzer.initialize(plotSettings);
    });

    /*
     * Add analyzers to calculators
     */
    analyzers.forEach(function(analyzer){
        calculator.addAnalysisFunction(analyzer);
    });    
    
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
    form.updateCalculations();

});