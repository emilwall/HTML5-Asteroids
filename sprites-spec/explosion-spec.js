// init: set name to explosion
describe("Explosion", function () {
  var explosion, explosionPrototype;

  beforeEach(function () {
    explosionPrototype = asteroids.Explosion.prototype;
    asteroids.Explosion.prototype = { init: sinon.spy() };

    explosion = new asteroids.Explosion();
  });

  afterEach(function () {
    asteroids.Explosion.prototype = explosionPrototype;
  });

  it("should use implementation of init method from prototype", function () {
    expect(explosion.init).toBe(asteroids.Explosion.prototype.init);
  });

  it("should call init method in constructor", function () {
    sinon.assert.called(explosion.init);
    sinon.assert.calledWith(explosion.init, "explosion");
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
