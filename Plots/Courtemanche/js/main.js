require.config({
    paths: {
        calculator: "calculator",
        form: "form",
        mediator: "../../commonJs/mediator",
        plots: "../../commonJs/plots",
        pointBufferAnalyzer: "../../commonJs/pointBufferAnalyzer",
        s1s2Analyzer: "../../commonJs/s1s2Analyzer",
        apdAnalyzer: "../../commonJs/APDAnalyzer",
        utility: "../../commonJs/utility"
    },
});


require([
"settings", 
"mediator", 
"form", 
"calculator", 
"pointBufferAnalyzer",
"s1s2Analyzer",
"apdAnalyzer",
"plots"
], 
function initialize(
settings, 
mediator,
form, 
calculator, 
pointBufferAnalyzer,
s1s2Analyzer,
apdAnalyzer,
plots){    
    /*
        * Initialize the default settings for the plot
    */
    settings.initialize({
        formSettings: {
            displayAPDDI: true,
            displayV: true,
            secondaryPlot: "xcal",
        }, 
        calculationSettings: {
            pointBuffer: {
                bufferSize: 10,
                normalPoints :{
                    v       : new Point(-81, 38),
                    ccaup   : new Point(1.4, 1.8),
                    ccarel  : new Point(0, 2),
                    ccai    : new Point(0.0001, 0.0006),
                },
                minMaxPoints : {}       
                
            },
            apdPoints: {
                threshhold: -68.84,
                vNormalize : new Point(-81, 38)
            }
        }
    });
    
    /*
        * Create an analyzer array that holds all the 
        * analyzers to be processed
    */
    var analyzers = [pointBufferAnalyzer, s1s2Analyzer, apdAnalyzer],
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
        * Add analyzers to calculator
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
    
    /*
        * Call update calculations
    */
    form.updateCalculations();   
});