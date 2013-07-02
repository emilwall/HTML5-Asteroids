// init: set name to explosion
describe("Explosion", function () {
  var explosion, explosionPrototype;

  beforeEach(function () {
    var fakeContext = {
      beginPath: sinon.spy(),
      moveTo: sinon.spy(),
      lineTo: sinon.spy(),
      stroke: sinon.spy(),
      save: sinon.spy(),
      restore: sinon.spy()
    };
    explosionPrototype = asteroids.Explosion.prototype;
    asteroids.Explosion.prototype = { init: sinon.spy(), context: fakeContext, die: sinon.spy() };

    explosion = new asteroids.Explosion();
    explosion.visible = true;
    explosion.scale = 2;
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

  it("should initialize ridgesH and bridgesV to false", function () {
    expect(explosion.bridgesH).toEqual(false);
    expect(explosion.bridgesV).toEqual(false);
  });

  describe("lines", function () {
    it("should be of length 5", function () {
      expect(explosion.lines.length).toEqual(5);
    });

    it("should contain arrays of length 4: [x1, y1, x2, y2]", function () {
      expect(explosion.lines[0].length).toEqual(4);
      expect(explosion.lines[4].length).toEqual(4);
    });
  });

  describe("draw", function () {
    it("should do nothing if not visible", function () {
      explosion.visible = false;

      explosion.draw();

      sinon.assert.notCalled(explosion.context.save);
    });

    it("should draw lines using beginPath, moveTo, lineTo and stroke", function () {
      explosion.draw();

      sinon.assert.called(explosion.context.beginPath);
      sinon.assert.called(explosion.context.moveTo);
      sinon.assert.called(explosion.context.lineTo);
      sinon.assert.called(explosion.context.stroke);
    });

    it("should save and restore context", function () {
      explosion.draw();

      sinon.assert.called(explosion.context.save);
      sinon.assert.called(explosion.context.restore);
    });
  });

  describe("preMove", function () {
    it("should increase scale when visible", function () {
      explosion.preMove(3);

      expect(explosion.scale).toEqual(5);
    });

    it("should not increase scale when not visible", function () {
      explosion.visible = false;

      explosion.preMove(3);

      expect(explosion.scale).toEqual(2);
    });

    it("should die when scale exceeds limit (8)", function () {
      explosion.preMove(7);

      sinon.assert.called(explosion.die);
    });

    it("should not die when scale does not exceed limit (8)", function () {
      explosion.preMove(6);

      sinon.assert.notCalled(explosion.die);
    });
  });
});
