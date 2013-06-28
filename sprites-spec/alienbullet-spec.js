describe("AlienBullet", function () {
  var alienBullet, alienBulletPrototype;

  beforeEach(function () {
    alienBulletPrototype = asteroids.AlienBullet.prototype;
    asteroids.AlienBullet.prototype = { init: sinon.spy() };

    alienBullet = new asteroids.AlienBullet();
  });

  afterEach(function () {
    asteroids.AlienBullet.prototype = alienBulletPrototype;
  });

  it("should use implementation of init method from prototype", function () {
    expect(alienBullet.init).toBe(asteroids.AlienBullet.prototype.init);
  });

  it("should call init method in constructor", function () {
    sinon.assert.called(alienBullet.init);
  });

  /* draw:
   * do nothing if not visible
   * call save and then restore of context
   * draw line on canvas
   */
});
