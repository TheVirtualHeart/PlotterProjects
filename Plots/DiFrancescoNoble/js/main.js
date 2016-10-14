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
        plots)
    {

    /*
        * Initialize the default settings for the plot
        */
        settings.initialize({
            formSettings: {
                displayAPDDI: true,
                displayV: true,
                secondaryPlot: "isica"                         
            }, 
            calculationSettings: {
                pointBuffer: {
                    bufferSize: 20,
                        normalPoints :{
                            v : new Point(-91, 43),
                            cai:    new Point(0.00002, 0.00247),
                            caup:   new Point(1.29, 1.42),
                            carel:  new Point(0.081, 0.414),
                            nai:    new Point(7.97, 8.04),
                            ki:     new Point (139.97, 140.02),
                            kc:     new Point (3.94, 4.07)
                            
                        },
                    minMaxPoints : {}

                },
                apdPoints: {
                    threshhold: -75.8,
                    vNormalize : new Point(-91, 43)
                },
                tUnit: "seconds"
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
