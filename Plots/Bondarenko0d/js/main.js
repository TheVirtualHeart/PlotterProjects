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


require(["settings", 
"mediator", 
"form", 
"calculator", 
"pointBufferAnalyzer",
"s1s2Analyzer",
"apdAnalyzer",
"plots"],
function initialize(
settings , 
mediator,
form, 
calculator, 
pointBufferAnalyzer,
s1s2Analyzer,
apdAnalyzer,
plots) {
    
    
    /*
        * Initialize the default settings for the plot
    */
    settings.initialize({
        formSettings: {
            displayAPDDI: true,
            displayV: true,
            secondaryPlot: "ical",           
        }, 
        calculationSettings: {
            pointBuffer: {
                bufferSize: 20,
                normalPoints :{
                    v    :  new Point(-85, 36),
                    itos :  new Point(0.7, 1.0),
                    cass :  new Point(-1001, 41),
                    cajsr : new Point(130, 1300),
                    cansr : new Point(600, 1315),
                    ltrpn : new Point(11, 33),
                    htrpn : new Point(125, 128),
                    nai :   new Point(999, 14260),
                    ki :    new Point(999, 143700),
                    ok :    new Point (0.00001, 0.04),
                    nks:    new Point(0.00002,0.03),
                    po12 :  new Point(0.000001,0.0001)
                },
                minMaxPoints : {}   
            },                
            apdPoints: {
                threshhold: -73,
                vNormalize :  new Point(-85, 36)
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