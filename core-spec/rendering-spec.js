describe("Rendering", function () {
  var canvas, canvasWidth, canvasHeight, sprites, context, prevGrid, grid, matrix, ship, bigAlien, keyStatus, rendering;

  var spritesWithName = function (name) {
    return asteroids.Game.sprites.filter(function (sprite) {
      return sprite.name === name;
    });
  };

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
    sinon.stub(asteroids, "Matrix").returns([[0, 0, 0], [0, 0, 0]]);
    sinon.stub(asteroids, "BigAlien").returns({ name: "bigalien", setup: sinon.stub() });
    sinon.stub(asteroids, "Ship").returns({ name: "ship" });

    canvasWidth = asteroids.Game.canvasWidth;
    canvasHeight = asteroids.Game.canvasHeight;
    sprites = asteroids.Game.sprites;
    context = asteroids.Sprite.prototype.context;
    prevGrid = asteroids.Sprite.prototype.grid;
    matrix = asteroids.Sprite.prototype.matrix;
    ship = asteroids.Game.ship;
    bigAlien = asteroids.Game.bigAlien;
    keyStatus = asteroids.KEY_STATUS;
    asteroids.KEY_STATUS = {};

    rendering = new asteroids.Rendering(canvas);
    grid = asteroids.Sprite.prototype.grid;
  });

  afterEach(function () {
    asteroids.GridNode.restore();
    asteroids.Matrix.restore();
    asteroids.BigAlien.restore();
    asteroids.Ship.restore();
    asteroids.Game.canvasWidth = canvasWidth;
    asteroids.Game.canvasHeight = canvasHeight;
    asteroids.Game.sprites = sprites;
    asteroids.Sprite.prototype.context = context;
    asteroids.Sprite.prototype.grid = prevGrid;
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
    var upperLeft = grid[0][0];
    var lowerRight = grid[12][8];
    expect(upperLeft.nextSprite).toBeNull();
    expect(Object.keys(lowerRight).length).toEqual(Object.keys(upperLeft).length);
    expect(lowerRight).not.toBe(upperLeft);
  });

  it("should set grid links properly for nodes within grid", function () {
    var node = grid[1][1];
    expect(node.south).toBe(grid[1][2]);
    expect(node.north).toBe(grid[1][0]);
    expect(node.east).toBe(grid[2][1]);
    expect(node.west).toBe(grid[0][1]);
  });

  it("should set grid links properly for nodes on grid border", function () {
    var node = grid[12][8];
    expect(node.south).toBe(grid[12][0]);
    expect(node.north).toBe(grid[12][7]);
    expect(node.east).toBe(grid[0][8]);
    expect(node.west).toBe(grid[11][8]);
  });

  it("should set both dupe properties for upper left node in grid", function () {
    expect(typeof grid[0][0].dupe.horizontal).toEqual("number");
    expect(typeof grid[0][0].dupe.vertical).toEqual("number");
  });

  it("should set both dupe properties for upper right node in grid", function () {
    expect(typeof grid[12][0].dupe.horizontal).toEqual("number");
    expect(typeof grid[12][0].dupe.vertical).toEqual("number");
  });

  it("should set both dupe properties for lower left node in grid", function () {
    expect(typeof grid[0][8].dupe.horizontal).toEqual("number");
    expect(typeof grid[0][8].dupe.vertical).toEqual("number");
  });

  it("should set both dupe properties for lower right node in grid", function () {
    expect(typeof grid[12][8].dupe.horizontal).toEqual("number");
    expect(typeof grid[12][8].dupe.vertical).toEqual("number");
  });

  it("should set horizontal dupe properties for leftmost and rightmost nodes in grid", function () {
    expect(typeof grid[0][3].dupe.horizontal).toEqual("number");
    expect(typeof grid[12][5].dupe.horizontal).toEqual("number");
  });

  it("should not set vertical dupe properties for leftmost and rightmost nodes in grid", function () {
    expect(grid[0][3].dupe.vertical).toBeNull();
    expect(grid[12][5].dupe.vertical).toBeNull();
  });

  it("should set vertical dupe properties for upper and lower nodes in grid", function () {
    expect(typeof grid[3][0].dupe.vertical).toEqual("number");
    expect(typeof grid[5][8].dupe.vertical).toEqual("number");
  });

  it("should not set horizontal dupe properties for upper and lower nodes in grid", function () {
    expect(grid[3][0].dupe.horizontal).toBeNull();
    expect(grid[5][8].dupe.horizontal).toBeNull();
  });

  it("should not set dupe properties for nodes not on grid border", function () {
    expect(grid[7][3].dupe.horizontal).toBeNull();
    expect(grid[4][4].dupe.vertical).toBeNull();
  });

  it("should set context of canvas as sprite prototype property", function () {
    expect(asteroids.Sprite.prototype.context).toBe(rendering.context);
  });

  it("should set matrix as sprite prototype property", function () {
    expect(asteroids.Sprite.prototype.matrix).toEqual(new asteroids.Matrix());
  });

  it("should add ship to asteroids.Game.sprites", function () {
    expect(spritesWithName("ship").length).toEqual(1);
  });

  it("should set bigAlien as property of asteroids.Game", function () {
    var ship = spritesWithName("ship")[0];

    expect(asteroids.Game.ship).toBe(ship);
  });

  it("should set starting position of ship to middle of screen", function () {
    var ship = spritesWithName("ship")[0];

    expect(ship.x).toEqual(asteroids.Game.canvasWidth / 2);
    expect(ship.y).toEqual(asteroids.Game.canvasHeight / 2);
  });

  it("should add 10 bullets to ship", function () {
    var ship = spritesWithName("ship")[0];

    expect(ship.bullets.length).toEqual(10);
  });

  it("should add 10 bullets to asteroids.Game.sprites", function () {
    expect(spritesWithName("bullet").length).toEqual(10);
  });

  it("should add bigAlien to asteroids.Game.sprites", function () {
    expect(spritesWithName("bigalien").length).toEqual(1);
  });

  it("should call setup method of bigAlien before adding it to asteroids.Game.sprites", function () {
    var bigalien = spritesWithName("bigalien")[0];

    sinon.assert.called(bigalien.setup);
  });

  it("should set bigAlien as property of asteroids.Game", function () {
    var bigalien = spritesWithName("bigalien")[0];

    expect(asteroids.Game.bigAlien).toBe(bigalien);
  });

  it("should define drawGrid method", function () {
    expect(typeof rendering.drawGrid).toEqual("function");
  });

  describe("drawGrid", function () {
    it("should call context.stroke when asteroids.KEY_STATUS.g is true", function () {
      asteroids.KEY_STATUS.g = true;

      rendering.drawGrid();

      sinon.assert.called(rendering.context.stroke);
    });
  });
});
