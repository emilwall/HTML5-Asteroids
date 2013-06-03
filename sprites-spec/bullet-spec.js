// init: set name (and coordinates (0, 0)?)
// does not collide with anything (asteroids and aliens check this themselves)
// sets time, bridgesH and bridgesV attributes
// defines postMove to be same as Sprite.wrapPostMove
// defined configureTransform as empty function (why?)
/* draw:
 * do nothing if not visible
 * call save and then restore of context
 * draw square (dot) on canvas
 */
/* preMove:
 * do nothing if not visible
 * set to invisible AND reset time if time > threshold (50)
 */
// collision: This method essentially does the same as preMove when time > threshold, but is it ever called?
// transformedPoints: returns array of the x and y coordinates
// Inherits from Sprite
