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
            secondaryPlot: "icalca",
        },
        calculationSettings: {
            pointBuffer: {
                bufferSize: 20,
                normalPoints: {
                    v: new Point( -87 , 34 ),             cai       : new Point(0.00008,0.00047),
                    cajsr     : new Point(0.17,1.27),     camkactive: new Point(0.00,0.05),
                    camktrap  : new Point(0.00,0.014),    nai       : new Point(9.87,9.90),
                    cansr     : new Point(1.27,1.36),     car       : new Point(0.00,0.029),
                    cli       : new Point(18.89,18.90),   ki        : new Point(141.98,142.016),
                    xdpower   : new Point(1,9)
                },
                minMaxPoints: {}
            },
            apdPoints: {
                threshhold: -75.34,
                vNormalize: new Point( -87 , 34 )
            }
        },
    });

     /*
    * Create an analyzer array that holds all the 
    * analyzers to be processed
    */
    var start = new Date();
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
     var end = new Date();

     console.log(end.getTime() - start.getTime());
 });