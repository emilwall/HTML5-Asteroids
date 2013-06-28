describe("AlienBullet", function () {
  var alienBullet, alienBulletPrototype;

  beforeEach(function () {
    var fakeContext = {
      beginPath: sinon.spy(),
      closePath: sinon.spy(),
      moveTo: sinon.spy(),
      lineTo: sinon.spy(),
      stroke: sinon.spy(),
      save: sinon.spy(),
      restore: sinon.spy()
    };
    alienBulletPrototype = asteroids.AlienBullet.prototype;
    asteroids.AlienBullet.prototype = { init: sinon.spy(), context: fakeContext };

    alienBullet = new asteroids.AlienBullet();
    alienBullet.visible = true;
    alienBullet.vel = {};
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

  describe("draw", function () {
    it("should do nothing when not visible", function () {
      alienBullet.visible = false;
      alienBullet.context = null; // would cause exception if the method did anything

      alienBullet.draw();
    });

    it("should call save and then restore of context", function () {
      alienBullet.draw();

      sinon.assert.callOrder(alienBullet.context.save, alienBullet.context.restore);
    });

    it("should draw line on canvas", function () {
      alienBullet.draw();

      sinon.assert.called(alienBullet.context.lineTo);
      sinon.assert.called(alienBullet.context.stroke);
    });
  });
});
