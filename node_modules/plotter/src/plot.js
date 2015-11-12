/**
 * Plots are what Points (and objects that consist of Points) are rendered on.
 * Plots describe the context in which Points are drawn, holding information
 * such as labels and a local coordinate system. Plotter uses this information
 * when plotting points and other objects.
 */
function Plot()
{
	var ctx = arguments[1];							// the context in which the 
	var settings = arguments[0];
	
	var offsetVar = new Point(0, 0);
	var domainVar = new Point(-10, 10);
	var rangeVar = new Point(-10, 10);
	var plotSizeVar = new Point(0, 0);
	var pixelPerUnitVar = new Point(10, 10);
	var unitPerTickVar = new Point(1, 1);
	var labelFrequencyVar = new Point(2, 2);
	var labelSizeVar = new Point(0, 0);
	var labelBleedVar = new Point(0, 0);
	var labelPrecisionVar = new Point(-1, -1);
	

	/**
	 * Plot is a module. All variables enclosed are inaccesible from the 
	 * outside. self is returned to expose some of these variables
	 * @type {Object}
	 */
	var self = {	


		/**
		 * @property {object} settings - a collection of settings that affect
		 * how the plot is rendered
		 * 
		 * @property {Point} settings.offset - by default, a graph is rendered 
		 * in the upper left corner of the canvas. This allows you to 
		 * reposition the plot relative to this point.
		 *
		 * @property {Point} settings.domain - the points along the x-axis that
		 * the plot will display
		 *
		 * @property {Point} settings.range - the points along the y-axis that 
		 * the plot will display
		 *
		 * @property {Point} settins.pixelPerUnit - The number of pixels that 
		 * each unit of the plot will take up
		 *
		 * @property {Point} settings.plotSize - (readonly) The size of the 
		 * plot in pixels. This value is calculated by multiplying the pixels 
		 * per unit by the number of units in the graph (domain end - domain 
		 * start and range end - range start)
		 *
		 * @property {Point} settings.unitPerTick - A tick is wherever a line is drawn
		 * on the plot. This controls how many units must pass before a tick is
		 * drawn
		 *
		 * @property {Point} settings.gridSize - (readonly) The size of each block of 
		 * ticks on the plot. Calculated by multiplying the pixelPerUnit by the
		 * unitPerTick
		 *
		 * @property {Point} settings.labelFrequency - This is the rate at which labels
		 * are drawn on the ticks. It will default to a label for every tick
		 *
		 * @property {Point} settings.labelSize - (readonly) The size of the 
		 * label, where x is width and y is height, as calculated by 
		 * calculateLabelSize()
		 *
		 * @property {Point} settings.labelBleed - (readonly)
		 *
		 * @property {Point} settings.labelPrecision - This is a point that 
		 * determines how many decimals trail after the "." character. Values
		 * less than 0 disable this feature.
		 *
		 * @property {string} settings.xAxis - the label for the x axis
		 *
		 * @property {string} settings.yAxis - the label for the y axis
		 * 
		 * @property {boolean} settings.zeroBoundAxis - determines whether a 
		 * thick black line is drawn around the 0 axis. If false, the thick
		 * black line will be drawn around the edges of the graph.
		 * 
		 * @property {boolean} settings.drawGrid - determines whether the 
		 *
		 * @property {boolean} settings.drawCoords - If true, the mouse
		 * coordinates will be rendered. CURRENTLY NOT WORKING.
		 * 
		 * @property {string} settings.orientation - determines where the
		 * origin of the graph is rendered. It starts at the bottom left and
		 * goes counterclockwise. "a" is the bottom left, "b" is the top left,
		 * "c" is the top right, "d" is the bottom right.
		 */
		settings:
		{
			set offset(value) 
			{
				offsetVar.x = value.x;
				offsetVar.y = value.y;
			},
			get offset() { return new Point(offsetVar.x + 75, offsetVar.y + 20); },
			set domain(value)
			{
				domainVar.x = value.x < value.y ? value.x : value.y;
				domainVar.y = value.x < value.y ? value.y : value.x;
				plotSizeVar.x = this.pixelPerUnit.x * (this.domain.y - this.domain.x);
			},
			get domain() { return new Point(domainVar.x, domainVar.y); },
			set range(value)
			{
				rangeVar.x = value.x < value.y ? value.x : value.y;
				rangeVar.y = value.x < value.y ? value.y : value.x;
				plotSizeVar.y = this.pixelPerUnit.y * (this.range.y - this.range.x);
			},
			get range() { return new Point(rangeVar.x, rangeVar.y); },
			set pixelPerUnit(value)
			{
				pixelPerUnitVar.x = value.x != 0 ? value.x : pixelPerUnitVar.x;
				pixelPerUnitVar.y = value.y != 0 ? value.y : pixelPerUnitVar.y;
				plotSizeVar.x = this.pixelPerUnit.x * (this.domain.y - this.domain.x);
				plotSizeVar.y = this.pixelPerUnit.y * (this.range.y - this.range.x);
			},
			get pixelPerUnit() { return new Point(pixelPerUnitVar.x, pixelPerUnitVar.y); },
			get plotSize() { return new Point(plotSizeVar.x, plotSizeVar.y); },
			set unitPerTick(value)
			{
				unitPerTickVar.x = value.x != 0 ? value.x : unitPerTickVar.x;
				unitPerTickVar.y = value.y != 0 ? value.y : unitPerTickVar.y;
			},
			get unitPerTick() { return new Point(unitPerTickVar.x, unitPerTickVar.y); },
			get gridSize()
			{ return new Point(this.unitPerTick.x * this.pixelPerUnit.x, this.unitPerTick.y * this.pixelPerUnit.y); },
			set labelFrequency(value)
			{
				labelFrequencyVar.x = value.x >= 0 ? value.x : 0;
				labelFrequencyVar.y = value.y >= 0 ? value.y : 0;
			},
			get labelFrequency() { return new Point(labelFrequencyVar.x, labelFrequencyVar.y); },
			get labelSize() { return new Point(labelSizeVar.x, labelSizeVar.y); },
			get labelBleed() { return new Point(labelBleedVar.x, labelBleedVar.y); },
			set labelPrecision(value)
			{
				labelPrecisionVar.x = value.x >= 0 ? Math.min(20, Math.max(0, value.x)) : -1;
				labelPrecisionVar.y = value.y >= 0 ? Math.min(20, Math.max(0, value.y)) : -1;
			},
			get labelPrecision() { return new Point(labelPrecisionVar.x, labelPrecisionVar.y); },
			xAxis: "xAxis",
			yAxis: "yAxis",
			zeroBoundAxis: true,
			drawGrid: true,
			drawCoords: false,
			orientation: "a"
		},


		/**
		 * @property {object} mouse - a collection of settings related to the 
		 * mouse in relation to the plot.
		 *
		 * @property {Point} mouse.down - The point in the plot's local
		 * coordinates where the mouse was last down.
		 *
		 * @property {Point} mouse.move - The point in the plot's local
		 * coordinates where the mouse has moved to	 
		 * 
		 * @property {Point} mouse.up - The point in the plot's local
		 * coordinates where the mouse was last down.
		 *
		 * @property {Point} mouse.isDown - The point in the plot's local
		 * coordinates where the mouse was last down.
		 *
		 * @property {Point} mouse.isUp - The point in the plot's local
		 * coordinates where the mouse was last down.
		 */
		mouse:
		{
			down: new Point(),
			move: new Point(),
			up: new Point(),
			isDown: false,
			isUp: true
		},


		/**
		 * Recalculate the size of the labels and the label bleed.
		 */
		reCalculateLabels: function() { 
			calculateLabelSize(); 
			calculateLabelBleed(); 
		}
	}
	
	/**  
	 * This initializes the Plot, merging the default settings object with the
	 * object that was passed to the function as an argument. It then calculates
	 * the size of the plot and the labels.
	 */
	for (var key in settings)
		if (self.settings.hasOwnProperty(key))
			self.settings[key] = settings[key];
	
	plotSizeVar.x = self.settings.pixelPerUnit.x * (self.settings.domain.y - self.settings.domain.x);
	plotSizeVar.y = self.settings.pixelPerUnit.y * (self.settings.range.y - self.settings.range.x);
	
	calculateLabelSize();
	calculateLabelBleed();
	

	/**
	 * This function calculates padding that labels add to the graph. This is the
	 * entire block of labels on each axis. It determines what the maximum 
	 * length of the value labels would be on each axis and then adds padding to 
	 * encompass the label of the axis.
	 */
	function calculateLabelSize()
	{
		var x = 0;
		var y = 0;
		var s = self.settings;
		
		ctx.font = "24px Helvetica";
		var labelPadding = ctx.measureText("M.").width;
		
		if (s.labelFrequency.y != 0) {
			x += Math.max(ctx.measureText(s.range.x).width, ctx.measureText(s.range.x + Math.floor(s.plotSize.y / s.gridSize.y) * s.unitPerTick.y).width);
		}
		else {
			x += 6;
		}
		if (s.yAxis != "") {
			x += labelPadding;
		}

		if (s.labelFrequency.x != 0) {
			y += labelPadding;
		}
		else {
			y += 6;
		}
		if (s.xAxis != "") {
			y += labelPadding;
		}
		if (s.yAxis != "")
		{
			ctx.font = "24px Helvetica";
			var yBleed = ctx.measureText(s.yAxis).width * 0.5 - s.plotSize.y * 0.5;
			y = yBleed > y ? yBleed : y;
		}
		
		labelSizeVar.x = x;
		labelSizeVar.y = y;
	}
	

	/**
	 * This function calculates the "bleed" of the labels. Essentially, if a 
	 * label value overflows, this provides a cutoff after which it will stop
	 * rendering the text.
	 * @return {[type]} [description]
	 */
	function calculateLabelBleed()
	{
		var s = self.settings;
		var x = 0;
		var y = s.labelFrequency.y != 0 ? -8 : 0;
		
		ctx.font = "16px Helvetica";
		
		if (s.labelFrequency.x != 0) {
			x =  Math.max(s.offset.x + Math.floor(s.plotSize.x / s.gridSize.x) * s.gridSize.x + ctx.measureText(s.domain.x + Math.floor(s.plotSize.x / s.gridSize.x) * s.unitPerTick.x).width * 0.5 - (s.offset.x + s.plotSize.x), 0);
		}
		
		ctx.font = "24px Helvetica";
		
		if (s.xAxis != "")
		{ 
			var axisBleed = Math.max(((s.domain.y - s.domain.x) * s.pixelPerUnit.x * 0.5 + ctx.measureText(s.xAxis).width * 0.5) - ((s.domain.y - s.domain.x) * s.pixelPerUnit.x), 0);
			x = x > axisBleed ? x : axisBleed;
		}
		
		if (s.yAxis != "")
		{
			var yLabelBleed = s.plotSize.y * 0.5 - ctx.measureText(s.yAxis).width * 0.5;
			y = yLabelBleed < y ? yLabelBleed : y;
		}
		
		labelBleedVar.x = x;
		labelBleedVar.y = y;
	}
	
	return self;
}