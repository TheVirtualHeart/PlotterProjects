/**
 * A generic object for holding a point
 * @param {number} px - the x coordinate of the point
 * @param {number} py - the y coordinate of the point
 */
function Point(px, py) {
	this.x = px; 
	this.y = py;
}

/**
 * A generic object for holding a line.
 * @param {Point} pa - the first point on the line (used for calculating a line based on two points)
 * @param {Point} pb - the second point on the line (used for calculating a line based on two points)
 * @param {number} s - the slope of the line (used for calculating a line based on point-slope)
 * @param {Point} p - the point on the line (used for calculating a line based on point-slope)
 */
function Line(pa, pb, s, p) {
	this.a = pa; 
	this.b = pb; 
	this.point = p; 
	this.slope = s;
} //much like a point, but can also hold slope and intercept info

//this function creates a plotter object
function createPlotter()
{
	var canvas, ctx;
	var plots = [];
	var plotNames = {};
	var currentPlot, clipped = false;
	var debugBorders = false;
	var padding = typeof arguments[1] !== "undefined" ? arguments[1] : new Point(0, 0);
	
	canvas = arguments[0];
	ctx = canvas.getContext("2d");
		
	canvas.addEventListener("mousedown", function(e){updateMouse(e);}, false);
	canvas.addEventListener("mousemove", function(e){updateMouse(e);}, false);
	canvas.addEventListener("mouseup", function(e){updateMouse(e);}, false);
	canvas.addEventListener("touchstart", function(e){updateTouch(e);}, false);
	canvas.addEventListener("touchmove", function(e){updateTouch(e);}, false);
	canvas.addEventListener("touchend", function(e){updateTouch(e);}, false);
	canvas.addEventListener("touchcancel", function(e){updateTouch(e);}, false);
	
	function pageToPlot(p, plot)
	{
		var s = plot.settings;
		var x = (p.x - canvas.offsetLeft - s.offset.x) / s.pixelPerUnit.x + s.domain.x;
		var y = (canvas.height - (p.y - canvas.offsetTop) - (canvas.height - (s.offset.y + s.plotSize.y))) / s.pixelPerUnit.y + s.range.x;
		return new Point(x, y);
	}
	
	function pointInBounds(p, plot)
	{
		var s = plot.settings;
		return (p.x >= s.domain.x && p.x <= s.domain.y && p.y >= s.range.x && p.y <= s.range.y)
	}
	
	function findPlotUnderPoint(p)
	{
		for (var i = 0; i < plots.length; i++)
			if (pointInBounds(pageToPlot(p, plots[i]), plots[i]))
				return i;
		return -1;
	}
	
	function updateMouse(e)
	{
		var plot = findPlotUnderPoint(new Point(e.pageX, e.pageY));
		if (plot == -1)
			return;
		plot = plots[plot];
		
		var p = pageToPlot(new Point(e.pageX, e.pageY), plot);
		var type = e.type.replace("mouse", '');
		
		if ((type == "down" || type == "move") && (!(e.buttons & 1) && e.button != 0))
			return;
		
		plot.mouse[type].x = p.x;
		plot.mouse[type].y = p.y;
		if (type == "down")
		{
			plot.mouse.isDown = true;
			plot.mouse.isUp = false;
		}
		else if (type == "up")
		{
			plot.mouse.isDown = false;
			plot.mouse.isUp = true;
		}
	}
	
	function updateTouch(e)
	{	
		var type = e.type.replace("touch",'');
		
		for(var i = 0; i < e.changedTouches.length; i++)
		{
			var touchID, event;
			
			switch(type)
			{
				case "start":
					event = new MouseEvent("mousedown",
					{screenX: e.changedTouches[i].screenX, screenY: e.changedTouches[i].screenY,
					clientX: e.changedTouches[i].clientX, clientY: e.changedTouches[i].clientY});
				break;
				case "move":
					event = new MouseEvent("mousemove",
					{screenX: e.changedTouches[i].screenX, screenY: e.changedTouches[i].screenY,
					clientX: e.changedTouches[i].clientX, clientY: e.changedTouches[i].clientY});
				break;
				case "cancel":
				case "end":
					event = new MouseEvent("mouseup",
					{screenX: e.changedTouches[i].screenX, screenY: e.changedTouches[i].screenY,
					clientX: e.changedTouches[i].clientX, clientY: e.changedTouches[i].clientY});
				break;
				default:
				break;
			}
			canvas.dispatchEvent(event);
		}
		
		if (e.touches.length > 0)
		{
			var plot = findPlotUnderPoint(new Point(e.pageX, e.pageY));
			if (plot != -1)
			{
				plots[plot].mouse.isDown = true;
				plots[plot].mouse.isUp = false;
			}
		}
		
		if (e.touches.length == 1 && type == "move")
			e.preventDefault();
	}
	
	function refitCanvas()
	{
		if (plots.length == 0)
			return;
		
		if (clipped)
		{
			ctx.restore();
			clipped = false;
		}
		
		var size = new Point(0, 0);
		for (var i = 0; i < plots.length; i++)
		{
			var s = plots[i].settings;
			size.x = Math.max(size.x, s.offset.x + s.plotSize.x + s.labelBleed.x);
			size.y = Math.max(size.y, s.offset.y + s.plotSize.y + s.labelSize.y);
		}			
		canvas.width = size.x + padding.x + 10;
		canvas.height = size.y + padding.y + 10;
		
		ctx.strokeStyle = "#0000FF";
		ctx.lineWidth = 2;
		ctx.strokeRect(0, 0, canvas.width, canvas.height);
		
		for (var i = 0; i < plots.length; i++)
			drawPlot(plots[i]);
	}
	
	function drawPlot(plot)
	{
		var s = plot.settings;
		
		ctx.translate(s.offset.x, s.offset.y);
		
		ctx.clearRect(-s.labelSize.x, s.labelBleed.y, s.plotSize.x + s.labelSize.x + s.labelBleed.x, s.plotSize.y + s.labelSize.y - s.labelBleed.y);
		
		if (debugBorders)
		{
			ctx.lineWidth = 0.5;
			ctx.strokeRect(-s.labelSize.x, s.labelBleed.y, s.plotSize.x + s.labelSize.x + s.labelBleed.x, s.plotSize.y + s.labelSize.y - s.labelBleed.y);
		}
		
		ctx.lineWidth = 2;
		
		//plot
		ctx.fillStyle = "#F8F8F8";
		ctx.fillRect(0, 0, s.plotSize.x, s.plotSize.y);
		ctx.fillStyle = "#000000";
		ctx.strokeStyle = "#E0E0E0";
		ctx.font = "16px Helvetica";
		ctx.textAlign = "center";
		ctx.textBaseline = "top";
		ctx.beginPath();
		for( var i = 0; i <= s.plotSize.x / s.gridSize.x; i++)
		{
			var x = i * s.gridSize.x;
			if (s.orientation=="c" || s.orientation=="d")
				x = s.plotSize.x - x;
			
			if (s.drawGrid)
			{
				ctx.moveTo(x, s.plotSize.y);
				ctx.lineTo(x, 0);
			}
			
			if (!(i % s.labelFrequency.x) && s.labelFrequency.x > 0)
			{
				var tickLabel = s.domain.x + i * s.unitPerTick.x;
				ctx.fillText( s.labelPrecision.x == -1 ? tickLabel : tickLabel.toFixed(s.labelPrecision.x), x, s.plotSize.y + 5);
			}
		}
		ctx.textAlign = "right";
		ctx.textBaseline = "middle";
		for( var i = 0; i <= s.plotSize.y / s.gridSize.y; i++)
		{
			var y = i * s.gridSize.y;
			if (!(s.orientation=="b" || s.orientation=="c"))
				y = s.plotSize.y - y;
			
			if (s.drawGrid)
			{
				ctx.moveTo(0, y);
				ctx.lineTo(s.plotSize.x, y);
			}
			
			if (!(i % s.labelFrequency.y) && s.labelFrequency.y > 0)
			{
				var tickLabel = s.range.x + i * s.unitPerTick.y;
				ctx.fillText(s.labelPrecision.y == -1 ? tickLabel : tickLabel.toFixed(s.labelPrecision.y), -5, y);
			}
		}
		ctx.stroke();
		
		//axis
		ctx.strokeStyle = "#000000";
		ctx.lineWidth = 1;
		ctx.beginPath();
		var axisOffset = new Point(
		(s.zeroBoundAxis ? Math.max(0, Math.min(s.plotSize.x, ((s.orientation=="c"||s.orientation=="d") ? s.domain.y : -s.domain.x) * s.pixelPerUnit.x)) : (s.orientation=="c"||s.orientation=="d") ? s.plotSize.x : 0),
		(s.zeroBoundAxis ? Math.min(s.plotSize.y, Math.max(0, ((s.orientation=="b"||s.orientation=="c") ? -s.range.x : s.range.y) * s.pixelPerUnit.y)) : (s.orientation=="b"||s.orientation=="c") ? 0 : s.plotSize.y));
		ctx.moveTo(axisOffset.x, 0);
		ctx.lineTo(axisOffset.x, s.plotSize.y);
		ctx.moveTo(0, axisOffset.y);
		ctx.lineTo(s.plotSize.x, axisOffset.y);
		ctx.stroke();
		
		//x axis label
		ctx.textAlign = "center";
		ctx.textBaseline = "bottom";
		ctx.font = "24px Helvetica";
		ctx.fillText(s.xAxis, s.plotSize.x * 0.5, s.plotSize.y + s.labelSize.y);
		
		//y axis label
		ctx.translate(-s.labelSize.x,  s.plotSize.y * 0.5);
		ctx.rotate(3 * Math.PI * 0.5);
		ctx.textBaseline = "top";
		ctx.fillText(s.yAxis, 0, 0);
		ctx.rotate(-3 * Math.PI * 0.5);
		ctx.translate(s.labelSize.x,  -(s.plotSize.y * 0.5));
		
		//coordinates
		if (s.drawCoords) //needs to be redone entirely
		{
			var coordOffsetY = Math.max(ctx.measureText(s.domain.x).width, ctx.measureText(s.domain.y).width);
			var coordOffsetX = coordOffsetY * 2 + ctx.measureText("y: ").width;
			ctx.textAlign = "left";
			ctx.textBaseline = "bottom";
			ctx.fillText("x: " + (isNaN(Math.round(this.mouse.move.x)) ? 0 : Math.round(this.mouse.move.x)), s.plotSize.x - coordOffsetX - 20, s.plotSize.y + s.labelSize.y);
			ctx.fillText("y: " + (isNaN(Math.round(this.mouse.move.y)) ? 0 : Math.round(this.mouse.move.y)), s.plotSize.x - coordOffsetY - 10, s.plotSize.y + s.labelSize.y);
		}
		
		ctx.translate(-s.offset.x, -s.offset.y);
	}
	
	return {
		set drawBorders(value) { debugBorders = value; },
		get drawBorders() { return debugBorders; },
		newPlot: function(settings, name)
		{
			plot = new Plot(settings, ctx);
			plots.push(plot);
			
			if (typeof name !== "undefined")
				plotNames[name] = plots.length - 1;
			
			refitCanvas();
			drawPlot(plot);
			
			return plots.length - 1;
		},
		clearPlot: function(unclip)
		{
			unclip = typeof unclip !== "undefined" ? unclip : false;
			
			if (currentPlot == undefined)
				return;
			
			if (clipped && unclip)
				ctx.restore();
			
			drawPlot(currentPlot);
			
			if (clipped)
			{
				ctx.save();
				ctx.rect(currentPlot.settings.offset.x + 1, currentPlot.settings.offset.y, currentPlot.settings.plotSize.x - 1, currentPlot.settings.plotSize.y - 1);
				ctx.clip();
			}
		},
		editPlot: function(plot, settings, reCalcLabels, redrawCanvas)
		{
			if (typeof plot === "number" && (plot < 0 || plot > plots.length - 1))
				return;
			
			plot = (typeof plot === "number" ? plots[plot] : ((typeof plot === "string" || plot instanceof String || plot.constructor == String || Object.prototype.toString.call(plot) == "[object String]") ? plots[plotNames[plot]] : plot));
			
			redrawCanvas = typeof redrawCanvas !== "undefined" ? redrawCanvas : false;
			reCalcLabels = typeof reCalcLabels !== "undefined" ? reCalcLabels : false;
			
			if (plot == undefined)
				return;
			
			if (clipped)
				ctx.restore();
			
			if (redrawCanvas)
			{
				ctx.clearRect(0,0, canvas.width, canvas.height);
				ctx.strokeStyle = "#0000FF";
				ctx.lineWidth = 2;
				ctx.strokeRect(0, 0, canvas.width, canvas.height);
			}
			
			for (var key in settings)
				if (plot.settings.hasOwnProperty(key))
					plot.settings[key] = settings[key];
			
			if (reCalcLabels)
				plot.reCalculateLabels();
			
			drawPlot(plot);
			
			if (clipped)
			{
				ctx.save();
				ctx.rect(currentPlot.settings.offset.x + 1, currentPlot.settings.offset.y, currentPlot.settings.plotSize.x - 1, currentPlot.settings.plotSize.y - 1);
				ctx.clip();
			}
		},
		selectPlot: function(plot, clear, clip)
		{
			if (typeof plot === "number" && (plot < 0 || plot > plots.length - 1))
				return;
			
			clear = typeof clear !== "undefined" ? clear : true;
			clip = typeof clip !== "undefined" ? clip : true;
			plot = (typeof plot === "number" ? plots[plot] : ((typeof plot === "string" || plot instanceof String || plot.constructor == String || Object.prototype.toString.call(plot) == "[object String]") ? plots[plotNames[plot]] : plot));
			
			if (plot == undefined)
				return;
			
			if (clipped)
				ctx.restore();
			currentPlot = plot;
			if (clear)
				drawPlot(currentPlot);
			
			if (clip)
			{
				ctx.save();
				ctx.rect(currentPlot.settings.offset.x + 1, currentPlot.settings.offset.y, currentPlot.settings.plotSize.x - 1, currentPlot.settings.plotSize.y - 1);
				ctx.clip();
				clipped = true;
			}
			else if (clipped)
				clipped = false;
		},
		get ctx() { return ctx; },
		get mouse()
		{
			if (currentPlot == undefined)
				return;
			return currentPlot.mouse;
		},
		get settings()
		{
			if (currentPlot == undefined)
				return;
			return currentPlot.settings;
		},
		pointOnPlot: function(p, plot)
		{
			if (typeof plot === "number" && (plot >= 0 && plot <= plots.length - 1))
				plot = plots[plot];
			else if (typeof plot === "string" || plot instanceof String || plot.constructor == String || Object.prototype.toString.call(plot) == "[object String]")
				plot = plots[plotNames[plot]]
			else
				currentPlot;
			
			return pointInBounds(p, currentPlot);
		},
		plotToCanvas: function(p)
		{
			var s = currentPlot.settings;
			var x = (((s.orientation=="c"||s.orientation=="d") ? s.domain.y : 2 * p.x) - p.x - ((s.orientation=="c"||s.orientation=="d") ? 0 : s.domain.x)) * s.pixelPerUnit.x + s.offset.x;
			var y = s.plotSize.y - ((((s.orientation=="b"||s.orientation=="c") ? s.range.y : 2 * p.y) - p.y - ((s.orientation=="b"||s.orientation=="c") ? 0 : s.range.x)) * s.pixelPerUnit.y) + s.offset.y;
			return new Point(x, y);
		},
		plotPoint: function(p, r, fill)
		{
			if (currentPlot == undefined)
				return;
			
			r = typeof r !== "undefined" ? r : 2;
			fill = typeof fill !== "undefined" ? fill : true;
			
			p = this.plotToCanvas(p);
			ctx.beginPath();
			ctx.arc(p.x, p.y, r, 0, 2 * Math.PI);
			if (fill)
				ctx.fill();
			else
				ctx.stroke();
		},
		plotLine: function(p1, p2)
		{
			if (currentPlot == undefined)
				return;
			
			p1 = this.plotToCanvas(p1);
			p2 = this.plotToCanvas(p2);
			app.ctx.lineCap = "round";
			ctx.beginPath();
			ctx.moveTo(p1.x, p1.y);
			ctx.lineTo(p2.x, p2.y);
			ctx.stroke();
		},
		plotSlope: function(p, slope)
		{
			if (currentPlot == undefined)
				return;
			
			var p1 = new Point(currentPlot.settings.domain.x, p.y - slope * (p.x - currentPlot.settings.domain.x));
			if (!pointInBounds(p1, currentPlot))
			{
				p1.y = p1.y < currentPlot.settings.range.x ? currentPlot.settings.range.x : currentPlot.settings.range.y;
				p1.x = p.x - (p.y - p1.y)/slope;
			}
			var p2 = new Point(currentPlot.settings.domain.y, p.y - slope * (p.x - currentPlot.settings.domain.y));
			if (!pointInBounds(p2, currentPlot))
			{
				p2.y = p2.y < currentPlot.settings.range.x ? currentPlot.settings.range.x : currentPlot.settings.range.y;
				p2.x = p.x - (p.y - p2.y)/slope;
			}
			this.plotLine(p1, p2);
			
			return new Line(p1, p2, slope, new Point(p.x, p.y));
		},
		plotPoly: function(points, closed)
		{
			var length = Object.keys(points).length;
			if (currentPlot == undefined || length < 2)
				return;
			
			closed = typeof closed !== "undefined" ? closed : false;
			
			if (typeof points == "undefined")
				return;
			
			app.ctx.lineCap = "round";
			ctx.beginPath();
			for (var i = 0; i < length - 1; i++)
			{
				var p = this.plotToCanvas(points[i]);
				
				if (i != 0)
					ctx.lineTo(p.x, p.y);
				else
					ctx.moveTo(p.x, p.y);
			}
			if (closed)
			{
				var p = this.plotToCanvas(points[0]);
				ctx.lineTo(p.x, p.y);
			}
			ctx.stroke();
		},
		plotFunction: function(func, xFunc, step, start, end)
		{
			if (currentPlot == undefined)
				return;
			
			xFunc = typeof xFunc !== "undefined" ? xFunc : true;
			step = typeof step !== "undefined" ? step : 1;
			start = typeof start !== "undefined" ? start : (xFunc ? currentPlot.settings.domain.x : currentPlot.settings.range.x);
			end = typeof end !== "undefined" ? end : (xFunc ? currentPlot.settings.domain.y : currentPlot.settings.range.y);
			
			var i = start, funcValue;
			var points = [];
			while (i < end)
			{
				funcValue = func(i);
				if (typeof funcValue !== "undefined")
					points.push(new Point(xFunc?i:funcValue, xFunc?funcValue:i));
				else
				{
					this.plotPoly(points);
					points = [];
				}
				i+= step;
				if (i > end)
					i = end;
			}
			if (typeof funcValue !== "undefined")
				points.push(new Point(xFunc?i:funcValue, xFunc?funcValue:i));
			this.plotPoly(points);
		},
		plotText: function(text, point)
		{
			if (currentPlot == undefined)
				return;
			
			point = typeof point !== "undefined" ? point : new Point(currentPlot.settings.domain.x + (currentPlot.settings.domain.y - currentPlot.settings.domain.x) * 0.5, currentPlot.settings.range.x + (currentPlot.settings.range.y - currentPlot.settings.range.x) * 0.5);
			
			point = this.plotToCanvas(point);
			ctx.fillText(text, point.x, point.y);
		}
	}
}

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
	
	var self = {
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
		mouse:
		{
			down: new Point(),
			move: new Point(),
			up: new Point(),
			isDown: false,
			isUp: true
		},
		reCalculateLabels: function() { calculateLabelSize(); calculateLabelBleed(); }
	}
	
	for (var key in settings)
		if (self.settings.hasOwnProperty(key))
			self.settings[key] = settings[key];
	
	plotSizeVar.x = self.settings.pixelPerUnit.x * (self.settings.domain.y - self.settings.domain.x);
	plotSizeVar.y = self.settings.pixelPerUnit.y * (self.settings.range.y - self.settings.range.x);
	
	calculateLabelSize();
	calculateLabelBleed();
	
	function calculateLabelSize()
	{
		var x = 0;
		var y = 0;
		var s = self.settings;
		
		ctx.font = "24px Helvetica";
		var labelPadding = ctx.measureText("M.").width;
		
		if (s.labelFrequency.y != 0)
			x += Math.max(ctx.measureText(s.range.x).width, ctx.measureText(s.range.x + Math.floor(s.plotSize.y / s.gridSize.y) * s.unitPerTick.y).width);
		else
			x += 6;
		if (s.yAxis != "")
			x += labelPadding;
		
		if (s.labelFrequency.x != 0)
			y += labelPadding;
		else
			y += 6;
		if (s.xAxis != "")
			y += labelPadding;
		if (s.yAxis != "")
		{
			ctx.font = "24px Helvetica";
			var yBleed = ctx.measureText(s.yAxis).width * 0.5 - s.plotSize.y * 0.5;
			y = yBleed > y ? yBleed : y;
		}
		
		labelSizeVar.x = x;
		labelSizeVar.y = y;
	}
	
	function calculateLabelBleed()
	{
		var s = self.settings;
		var x = 0;
		var y = s.labelFrequency.y != 0 ? -8 : 0;
		
		ctx.font = "16px Helvetica";
		
		if (s.labelFrequency.x != 0)
			x =  Math.max(s.offset.x + Math.floor(s.plotSize.x / s.gridSize.x) * s.gridSize.x + ctx.measureText(s.domain.x + Math.floor(s.plotSize.x / s.gridSize.x) * s.unitPerTick.x).width * 0.5 - (s.offset.x + s.plotSize.x), 0);
		
		ctx.font = "24px Helvetica";
		
		if (x.xAxis != "")
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