require.config({
	paths: {
		calculator: "calculator",
		form: "form",
		mediator: "../../Noble0d/js/mediator",
		plots: "plots",
		pointBufferAnalyzer: "pointBufferAnalyzer",
        s1s2Analyzer: "../../Noble0d/js/s1s2Analyzer",
        apdAnalyzer: "../../Noble0d/js/APDAnalyzer",
        utility: "../../Noble0d/js/utility"
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
            secondaryPlot: "ikr",
        },
        calculationSettings: {
            pointBuffer: {
                bufferSize: 20,
                normalPoints: {
                    v: new Point( -87 , 34 )
                }
            },
            apdPoints: {
                threshhold: -75.34,
                vNormalize: new Point( -87 , 34 )
            }
        },
        plotSettings: {
            Hundrudy: {
                plots: {
                    mainPlot: {
                        xAxis: "Time (ms)",
                        yAxis: "",
                    }
                }
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