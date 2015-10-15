
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
	 * Create a point based on the given value.
	 * @param  {number} x - the independent variable. Used to calculate the
	 * values at the specified point.
	 * @param {number} dx - the the step by which the independent variable is increasing
	 * @return {Object} - an object containing a series of values. These
	 * values are calculated based on the given input. 
	 */
	this.calculate = function(x, dx) {
		return {"x":x, "dx":dx};
	}

	/**
	 * This function reinitializes the PointObject. It clears the points array,
	 * but it can be used to reset differential equation values.
	 */
	this.clear = function() {
		this.points = [];
	}

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
PointObject.prototype.generate = function(start, end, step) {
	for (var i = start; i < end; i += step) {
		this.points.push(this.calculate(i, step));
	}
};

/**
 * Retrieve the points array
 * @return {Array} the points array
 */
PointObject.prototype.getPoints = function() {
	return this.points;
}

/**
 * This function is used to add a point to the points array.
 * @param {Object} p - The point we are adding to the points array.
 */
PointObject.prototype.addPoint = function(p) {
	this.points.push(p);
};
