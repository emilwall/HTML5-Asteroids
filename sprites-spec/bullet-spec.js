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
    bullet.currentNode = { leave: sinon.spy() };
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

  it("should not collide with anything", function () {
    expect(bullet.collidesWith).toBeFalsy();
  });

  it("should set time, bridgesH and bridgesV attributes", function () {
    expect(typeof bullet.time).toEqual("number");
    expect(typeof bullet.bridgesH).toEqual("boolean");
    expect(typeof bullet.bridgesV).toEqual("boolean");
  });

  it("should define postMove to be same as asteroids.Sprite.wrapPostMove", function () {
    expect(bullet.postMove).toBe(asteroids.Sprite.wrapPostMove);
  });

  it("should override steroids.Sprite.configureTransform", function () {
    expect(typeof bullet.configureTransform).toEqual("function");
    expect(bullet.configureTransform).not.toBe(asteroids.Sprite.configureTransform);
  });

  describe("preMove", function () {
    it("should increment time when visible", function () {
      bullet.time = 7;

      bullet.preMove(5);

      expect(bullet.time).toEqual(12);
    });

    it("should not increment time when not visible", function () {
      bullet.time = 7;
      bullet.visible = false;

      bullet.preMove(5);

      expect(bullet.time).toEqual(7);
    });

    it("should set to invisible when time + delta > threshold (50)", function () {
      bullet.time = 49;

      bullet.preMove(5);

      expect(bullet.visible).toEqual(false);
    });

    it("should reset time when time + delta > threshold (50)", function () {
      bullet.time = 49;

      bullet.preMove(5);

      expect(bullet.time).toEqual(0);
    });
  });

  describe("collision", function () {
    it("should set time to 0", function () {
      bullet.time = 49;

      bullet.collision();

      expect(bullet.time).toEqual(0);
    });

    it("should set visible to false", function () {
      bullet.collision();

      expect(bullet.visible).toEqual(false);
    });

    it("should set currentNode to null", function () {
      bullet.collision();

      expect(bullet.currentNode).toBeNull();
    });

    it("should call leave method of currentNode", function () {
      var currentNode = bullet.currentNode;

      bullet.collision();

      sinon.assert.calledWith(currentNode.leave, bullet);
    });
  });

  describe("transformedPoints", function () {
    it("should return array of the x and y coordinates", function () {
      bullet.x = 3;
      bullet.y = 5;

      expect(bullet.transformedPoints()).toEqual([3, 5]);
    });
  });
});
