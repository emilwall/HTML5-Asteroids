// init: set name to explosion
describe("Explosion", function () {
  beforeEach(function () {
    this.explosion = new asteroids.Explosion();
  });

  it("should have init method", function () {
    expect(typeof this.explosion.init).toBe("function");
  });

  describe("init", function () {
    it("should set name to explosion", function () {
      expect(this.explosion.name).toBe("explosion");
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
