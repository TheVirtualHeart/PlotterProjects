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
                    v:    new Point( -87 , 42 ),    trops: new Point(21.04,63.52),
                    cp:   new Point(0.753,14.759),  cs:    new Point(0,6),         
                    ci:   new Point(0.26,1.25),     cj :   new Point(64 , 112),
                    cjp:  new Point(78,106),        xir:   new Point(0.0033,1.31),
                    xnai: new Point(12.28,12.31),   tropi: new Point(22.34,46.62),
                },
                minMaxPoints: {}
            },
            apdPoints: {
                threshhold: -73.5,
                vNormalize: new Point( -87 , 42 )
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
     
     form.updateCalculations();
     
 });