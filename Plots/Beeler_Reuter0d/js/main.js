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
            secondaryPlot: "is"          
        }, 
        calculationSettings: {
            pointBuffer: {
                bufferSize: 2,
                normalPoints :{
                    v    :  new Point(-85, 35),
                    cai : new Point( 0.0000000001 , 0.00008)
                },
                minMaxPoints : {
                    /*v : new Point(1000, -1000),
                    cai :  new Point(1000, -1000)*/
                }
            },
            apdPoints: {
                threshhold: -72.5,
                vNormalize : new Point(-85, 35)
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