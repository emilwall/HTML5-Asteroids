// init: set name to explosion
describe("Explosion", function () {
  var explosion;

  beforeEach(function () {
    explosion = new asteroids.Explosion();
  });

  it("should have init method", function () {
    expect(typeof explosion.init).toEqual("function");
  });

  describe("init", function () {
    it("should set name to explosion", function () {
      expect(explosion.name).toEqual("explosion");
    });
  });
});

// bridgesH, bridgesV = false
// lines should be of length 5 and contain arrays of length 4: [x1, y1, x2, y2]
/* draw:
 * do nothing if not visible
 * draw lines using beginPath, moveTo, lineTo and stroke
 * save and restore context
 */
// preMove: Increase scale, die if scale exceeds limit (8).
// Inherits from asteroids.Sprite
