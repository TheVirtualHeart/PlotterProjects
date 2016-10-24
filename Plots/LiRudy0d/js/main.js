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
            secondaryPlot : "ical",
        },
        calculationSettings: {
            pointBuffer: {
                bufferSize: 20,
                normalPoints: {
                    v: new Point(-85 , 50),
                    cajsr: new Point(0.5,2.0),
                    cacsr: new Point(1.25, 1.75),
                    cansr: new Point(1.25, 1.75),
                    cassl: new Point(0.00001, 0.01),
                    nai: new Point(11.25, 11.75),
                    nassl: new Point(11.25, 11.75),
                    nasss: new Point(11.45, 11.55),
                    ki: new Point(136.25, 136.75),
                    cai: new Point(0.0005, 0.00007),
                    camktrap :  new Point(0.010, 0.0175),
                    jl3 :  new Point(0.16788761327119348, 0.8278862011914145)  
                },
                minMaxPoints : {}  
            },
            apdPoints: {
                threshhold: -71.5,
                vNormalize: new Point(-85 , 50)
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