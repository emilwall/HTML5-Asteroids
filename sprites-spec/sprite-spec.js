// init: sets name, points, vel and acc
// children: {}
// visible : false
// reap    : false
// bridgesH: true
// bridgesV: true
// collidesWith: []
// x    : 0
// y    : 0
// rot  : 0
// scale: 1
// currentNode: null
// nextSprite : null
// preMove : null
// postMove: null
/* run:
 * call move with argument
 * call updateGrid
 * save and restore context
 * call configureTransform
 * call draw
 * call findCollisionCandidates
 * call matrix.configure with state attributes
 * call checkCollisionsAgainst with result from calling findCollisionCandidates
 * three different conditional blocks: (no else if or trailing else!)
 * - bridgesH, currentNode.dupe.horizontal -> x
 * - bridgesV, currentNode.dupe.vertical -> y
 * - both -> x and y
 */
/* move:
 * Does nothing if not visible
 * sets transPoints to null
 * calls preMove iff defined
 * Update vel, pos and rot
 * calls postMove iff defined
 */
/* updateGrid:
 * Does nothing if not visible
 * Updates currentNode if moving to new grid square
 * If grid is activated, displays the boundaries on context
 */
// configureTransform: translates, rotates and scales if visible
// draw: recursively draw children, connect points with lines
// findCollisionCandidates: return first sprite from all adjacent nodes in grid
// checkCollisionsAgainst: calls checkCollision with all candidates and their nextSprites
// checkCollision: calls collision on self and other if transformed point is in path
// pointInPolygon: returns true if point is within area defined by this.points
// collision: empty function, extended by subclasses
// die: visible set to false, re-appear (reap) to true, leave node in grid
// transformedPoints: translates points and caches the result
// isClear: returns whether adjacent grids contains sprites that this can collide with
// wrapPostMove: Set x and y to wrap around canvas edges
