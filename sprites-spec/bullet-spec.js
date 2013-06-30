describe("Bullet", function () {
  var bullet, bulletPrototype;

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
    bulletPrototype = asteroids.Bullet.prototype;
    asteroids.Bullet.prototype = { init: sinon.spy(), context: fakeContext };

    bullet = new asteroids.Bullet();
    bullet.visible = true;
    bullet.vel = {};
  });

  afterEach(function () {
    asteroids.Bullet.prototype = bulletPrototype;
  });

  it("should use implementation of init method from prototype", function () {
    expect(bullet.init).toBe(asteroids.Bullet.prototype.init);
  });

  it("should call init method in constructor", function () {
    sinon.assert.called(bullet.init);
    sinon.assert.calledWith(bullet.init, "bullet", [0, 0]);
  });

  describe("draw", function () {
    it("should do nothing when not visible", function () {
      bullet.visible = false;
      bullet.context = null; // would cause exception if the method did anything

      bullet.draw();
    });

    it("should call save and then restore of context", function () {
      bullet.draw();

      sinon.assert.callOrder(bullet.context.save, bullet.context.restore);
    });

    it("should draw on canvas", function () {
      bullet.draw();

      sinon.assert.called(bullet.context.lineTo);
      sinon.assert.called(bullet.context.stroke);
    });
  });

  // does not collide with anything (asteroids and aliens check this themselves)
  // sets time, bridgesH and bridgesV attributes
  // defines postMove to be same as asteroids.Sprite.wrapPostMove
  // defines configureTransform as empty function (why?)
  /* preMove:
   * do nothing if not visible
   * set to invisible AND reset time if time > threshold (50)
   */
  // collision: This method essentially does the same as preMove when time > threshold, but is it ever called?
  // transformedPoints: returns array of the x and y coordinates
  // Inherits from asteroids.Sprite
});
