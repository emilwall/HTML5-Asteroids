describe("Game", function () {
  var stubGrid = function () {
    Sprite.prototype.grid = [[{
      enter: sinon.spy(),
      leave: sinon.spy(),
      isEmpty: sinon.stub().returns(true)
    }]];
    var node = Sprite.prototype.grid[0][0];
    node.north = node;
    node.south = node;
    node.east = node;
    node.west = node;
  }

  beforeEach(function () {
    this.spriteGrid = Sprite.prototype.grid;
    stubGrid();
    this.width = asteroids.Game.canvasWidth;
    asteroids.Game.canvasWidth = 0;
    this.height = asteroids.Game.canvasHeight;
    asteroids.Game.canvasHeight = 0;
    sinon.stub(asteroids.Game, "addSprite");
    sinon.stub(asteroids.Game, "removeSprite");
  });

  afterEach(function () {
    Sprite.prototype.grid = this.spriteGrid;
    asteroids.Game.canvasWidth = this.width;
    asteroids.Game.canvasHeight = this.height;
    asteroids.Game.addSprite.restore();
    asteroids.Game.removeSprite.restore();
  });

  it("should have finite state machine (FSM)", function () {
    expect(asteroids.Game.FSM).not.toBeUndefined();
  });

  it("should define spawnAsteroids, explosionAt and updateSprites methods", function () {
    expect(typeof asteroids.Game.spawnAsteroids).toBe("function");
    expect(typeof asteroids.Game.explosionAt).toBe("function");
    expect(typeof asteroids.Game.updateSprites).toBe("function");
  });

  describe("spawnAsteroids", function () {
    it("should call addSprite this.totalAsteroids number of times when called without argument", function () {
      asteroids.Game.totalAsteroids = 5;

      asteroids.Game.spawnAsteroids();

      expect(asteroids.Game.addSprite.callCount).toBe(5);
    });
  });

  describe("explosionAt", function () {
    it("should call addSprite with explosion with set x, y and visible attributes", function () {
      asteroids.Game.explosionAt(5, 7);

      var explosion = asteroids.Game.addSprite.args[0][0];

      expect(explosion.x).toBe(5);
      expect(explosion.y).toBe(7);
      expect(explosion.visible).toBe(true);
    });
  });

  describe("updateSprites", function () {
    beforeEach(function () {
      this.sprite1 = { run: sinon.stub(), reap: true };
      this.sprite2 = { run: sinon.stub(), reap: false };
      this.sprite3 = { run: sinon.stub(), reap: true };
      asteroids.Game.sprites.push(this.sprite1);
      asteroids.Game.sprites.push(this.sprite2);
      asteroids.Game.sprites.push(this.sprite3);
    });

    afterEach(function () {
      asteroids.Game.sprites.pop();
      asteroids.Game.sprites.pop();
      asteroids.Game.sprites.pop();
    });

    it("should call run on sprites with truthy reappear value", function () {
      var delta = 7;

      asteroids.Game.updateSprites(delta);

      expect(this.sprite1.run.calledWith(delta)).toBeTruthy();
    });

    it("should call removeSprite on sprites with truthy reappear value", function () {
      asteroids.Game.updateSprites(1);

      expect(asteroids.Game.removeSprite.calledWith(0)).toBeTruthy();
      expect(asteroids.Game.removeSprite.calledWith(1)).toBeFalsy();
      expect(asteroids.Game.removeSprite.calledWith(2)).toBeTruthy();
    });
  });
});
