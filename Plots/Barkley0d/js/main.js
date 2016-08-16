require.config({
    paths: {
        calculator: "calculator",
        form: "form",
        mediator: "../../commonJs/mediator",
        plots: "../../commonJs/plots",
        pointBufferAnalyzer: "../../commonJs/pointBufferAnalyzer",
        s1s2Analyzer: "../../commonJs/s1s2Analyzer",
        utility: "../../commonJs/utility"
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
            displayV: true
        }, 
        calculationSettings: {
            pointBuffer: {
                bufferSize: 4
            }
        },
    });

   /*
    * Create an analyzer array that holds all the 
    * analyzers to be processed
    */
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