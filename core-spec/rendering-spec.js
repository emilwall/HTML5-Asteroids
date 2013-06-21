describe("Rendering", function () {
  var canvas, canvasWidth, canvasHeight, sprites, context, grid, matrix, ship, bigAlien, keyStatus, rendering;

  beforeEach(function () {
    var fakeContext = {};
    fakeContext.clearRect = sinon.spy();
    fakeContext.beginPath = sinon.spy();
    fakeContext.closePath = sinon.spy();
    fakeContext.moveTo = sinon.spy();
    fakeContext.lineTo = sinon.spy();
    fakeContext.stroke = sinon.spy();
    fakeContext.save = sinon.spy();
    fakeContext.restore = sinon.spy();

    canvas = {};
    canvas.width = sinon.stub().returns(780);
    canvas.height = sinon.stub().returns(540);
    canvas.getContext = sinon.stub().returns(fakeContext);
    canvas[0] = canvas;

    canvasWidth = asteroids.Game.canvasWidth;
    canvasHeight = asteroids.Game.canvasHeight;
    sprites = asteroids.Game.sprites;
    context = asteroids.Sprite.prototype.context;
    grid = asteroids.Sprite.prototype.grid;
    matrix = asteroids.Sprite.prototype.matrix;
    ship = asteroids.Game.ship;
    bigAlien = asteroids.Game.bigAlien;
    keyStatus = asteroids.KEY_STATUS;
    asteroids.KEY_STATUS = {};

    rendering = new asteroids.Rendering(canvas);
  });

  afterEach(function () {
    asteroids.Game.canvasWidth = canvasWidth;
    asteroids.Game.canvasHeight = canvasHeight;
    asteroids.Game.sprites = sprites;
    asteroids.Sprite.prototype.context = context;
    asteroids.Sprite.prototype.grid = grid;
    asteroids.Sprite.prototype.matrix = matrix;
    asteroids.Game.ship = ship;
    asteroids.Game.bigAlien = bigAlien;
    asteroids.KEY_STATUS = keyStatus;
  });

  it("should set context of canvas as attribute of self", function () {
    expect(rendering.context).toBeDefined();
  });

  it("should add ship to asteroids.Game.sprites", function () {
    var length = asteroids.Game.sprites.length;
    var found = false;

    for (var i = 0; i < length; i++) {
      if (asteroids.Game.sprites[i].name === "ship") {
        found = true;
        break;
      }
    }

    assert(found);
  });

  it("should add 10 bullets to asteroids.Game.sprites", function () {
    var length = asteroids.Game.sprites.length;
    var found = 0;

    for (var i = 0; i < length; i++) {
      if (asteroids.Game.sprites[i].name === "bullet") {
        found++;
      }
    }

    expect(found).toEqual(10);
  });

  it("should define drawGrid method", function () {
    expect(typeof rendering.drawGrid).toEqual("function");
  });

  describe("drawGrid", function () {
    it("should call context.stroke when asteroids.KEY_STATUS.g is true", function () {
      asteroids.KEY_STATUS.g = true;

      rendering.drawGrid();

      expect(rendering.context.stroke.called).toEqual(true);
    });
  });
});
