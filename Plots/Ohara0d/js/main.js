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
                secondaryPlot: "ical"
            }, 
            calculationSettings: {
                pointBuffer: {
                    bufferSize: 20,
                    normalPoints : {
                        v :  new Point(-88, 52),
                        kss:  new Point(143, 146),
                        ki:  new Point(143, 146),
                        nass:  new Point(6, 8),
                        nai:  new Point(6, 8),
                        cajsr:  new Point(0.5, 2),
                        cansr:  new Point(1, 2),
                        cai : new Point(0.00007, 0.0002),
                        cass : new Point(0.00009, 0.003),                        
                        jrelnp : new Point(0.001, 0.2),
                        jrelp: new Point(0.001, 0.2),
                        camkt: new Point(0.000000003, 0.01)
                    },
                    minMaxPoints : {}      
                },                
                apdPoints: {
                    threshhold: -74.0,
                    vNormalize : new Point(-88, 52)
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
