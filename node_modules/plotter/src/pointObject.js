
/**
 * An object that emits a collection of points. This object is only a template.
 * It can and should be expanded upon.
 * @class
 */
function PointObject() {

	/**
	 * An array that contains all the points in the array. 
	 * @type {Array}
	 */
	this.points = [];

	/**
	 * This function is used to add a point to the points array.
	 * @param {Object} p - The point we are adding to the points array.
	 */
	this.addPoint = function(p) {
		this.points.push(p);
	};

	/**
	 * Create a point based on the given value.
	 * @param  {number} p - the independent variable. Used to calculate the
	 * values at the specified point.
	 * @return {Object} - an object containing a series of values. These
	 * values are calculated based on the given input. 
	 */
	this.calculate = function(p) {
		return {"x":p};
	}

	/**
	 * This function iterates from the specified start point to the specified 
	 * end point and does so by a step value if one is provided. At each step,
	 * it creates a point object according to the calculate() function.
	 * 
	 * @param {number} start - The point where the function will start itrating
	 * @param {number} end - The point where the function will stop iterating.
	 * @param {number} [step = 1] - The amount by which the function iterates 
	 * at each step. 
	 */
	this.generate = function(start, end, step) {

		for (var i = start; i < end; i += step) {
			this.points.push(this.calculate(i));
		}
	};

	/**
	 * Retrieve the points array
	 * @return {Array} the points array
	 */
	this.getPoints = function() {
		return this.points;
	}

}