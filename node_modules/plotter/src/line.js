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
} 