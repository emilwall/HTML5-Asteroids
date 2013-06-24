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

    sinon.stub(asteroids, "GridNode", function () {
      this.north = this.south = this.east = this.west = this.nextSprite = null;
      this.dupe = { horizontal: null, vertical: null };
    });

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
    asteroids.GridNode.restore();
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

  it("should set canvasWidth and canvasHeight properties of asteroids.Game", function () {
    expect(asteroids.Game.canvasWidth).toEqual(canvas.width());
    expect(asteroids.Game.canvasHeight).toEqual(canvas.height());
  });

  it("should set context of canvas as attribute of self", function () {
    expect(rendering.context).toBe(canvas.getContext());
  });

  it("should set context of canvas as attribute of Text", function () {
    expect(Text.context).toBe(canvas.getContext());
  });

  it("should set face of Text to vector_battle", function () {
    expect(Text.face).toBe(vector_battle);
  });

  it("should set grid with empty grid nodes as sprite prototype property", function () {
    var upperLeft = asteroids.Sprite.prototype.grid[0][0];
    var lowerRight = asteroids.Sprite.prototype.grid[12][8];
    expect(upperLeft.nextSprite).toBeNull();
    expect(Object.keys(lowerRight).length).toEqual(Object.keys(upperLeft).length);
    expect(lowerRight).not.toBe(upperLeft);
  });

  it("should set grid links properly for nodes within grid", function () {
    var node = asteroids.Sprite.prototype.grid[1][1];
    expect(node.south).toBe(asteroids.Sprite.prototype.grid[1][2]);
    expect(node.north).toBe(asteroids.Sprite.prototype.grid[1][0]);
    expect(node.east).toBe(asteroids.Sprite.prototype.grid[2][1]);
    expect(node.west).toBe(asteroids.Sprite.prototype.grid[0][1]);
  });

  it("should set grid links properly for nodes on grid border", function () {
    var node = asteroids.Sprite.prototype.grid[12][8];
    expect(node.south).toBe(asteroids.Sprite.prototype.grid[12][0]);
    expect(node.north).toBe(asteroids.Sprite.prototype.grid[12][7]);
    expect(node.east).toBe(asteroids.Sprite.prototype.grid[0][8]);
    expect(node.west).toBe(asteroids.Sprite.prototype.grid[11][8]);
  });

  it("should add ship to asteroids.Game.sprites", function () {
    expect(asteroids.Game.sprites.some(function (sprite) {
      return sprite.name === "ship";
    })).toEqual(true);
  });

  it("should add 10 bullets to asteroids.Game.sprites", function () {
    expect(asteroids.Game.sprites.filter(function (sprite) {
      return sprite.name === "bullet";
    }).length).toEqual(10);
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
