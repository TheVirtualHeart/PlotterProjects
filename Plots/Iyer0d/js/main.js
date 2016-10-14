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
    plots
    ) {
    /*
     * Initialize the default settings for the plot
     */
     settings.initialize({
        formSettings: {
            displayAPDDI: true,
            displayV: true,
            secondaryPlot: "ica",
        },
        calculationSettings: {
            pointBuffer: {
                bufferSize: 20,
                normalPoints: {
                    v: new Point( -90 , 35 ),           cai: new Point(0.00008, 0.00150),
                    cajsr: new Point(0.0955, 0.4359),   cansr: new Point(0.104, 0.436),
                    cass: new Point(0.00014, 0.04807),  htrpnca: new Point(0.9771, 0.9973),
                    ltrpnca: new Point(0.0803, 0.5968), ki: new Point(125.55, 125.577),
                    nai: new Point(9.710, 9.802)
                },
                minMaxPoints: {}
            },
            apdPoints: {
                threshhold: -78.8,
                vNormalize: new Point( -90 , 35 )
            }
        },
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
     
     form.updateCalculations();
     
 });