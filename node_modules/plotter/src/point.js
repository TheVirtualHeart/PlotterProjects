/**
 * A generic object for holding a point
 * @param {number} px - the x coordinate of the point
 * @param {number} py - the y coordinate of the point
 */
function Point(px, py) {
	this.x = px; 
	this.y = py;

	this.points = function() {
		return [{"x": this.x, "y":this.y}];
	}
}