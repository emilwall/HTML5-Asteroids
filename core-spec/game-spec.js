describe("Game", function () {
  var stubGrid = function () {
    asteroids.Sprite.prototype.grid = [[{
      enter: sinon.spy(),
      leave: sinon.spy(),
      isEmpty: sinon.stub().returns(true)
    }]];
    var node = asteroids.Sprite.prototype.grid[0][0];
    node.north = node;
    node.south = node;
    node.east = node;
    node.west = node;
  }

  beforeEach(function () {
    this.spritePrototypeDefined = asteroids.Sprite && asteroids.Sprite.prototype;
    if (this.spritePrototypeDefined) {
      this.spriteGrid = asteroids.Sprite.prototype.grid;
    } else {
      asteroids.Sprite = asteroids.Sprite || {};
      asteroids.Sprite.prototype = {}
    }
    stubGrid();
    this.width = asteroids.Game.canvasWidth;
    asteroids.Game.canvasWidth = 0;
    this.height = asteroids.Game.canvasHeight;
    asteroids.Game.canvasHeight = 0;

    sinon.stub(asteroids.Game, "addSprite");
    sinon.stub(asteroids.Game, "removeSprite");

    this.asteroidFake = {
      moveToSafePosition: sinon.spy(),
      vel: {},
      points: { reverse: sinon.spy() }
    };
    asteroids.Asteroid = asteroids.Asteroid || function () { };
    sinon.stub(asteroids, "Asteroid").returns(this.asteroidFake);

    asteroids.Explosion = asteroids.Explosion || function () { };
    sinon.stub(asteroids, "Explosion").returns(this.asteroidFake);
  });

  afterEach(function () {
    if (this.spritePrototypeDefined) {
      asteroids.Sprite.prototype.grid = this.spriteGrid;
    } else {
      delete asteroids.Sprite.prototype;
    }
    asteroids.Game.canvasWidth = this.width;
    asteroids.Game.canvasHeight = this.height;
    asteroids.Game.addSprite.restore();
    asteroids.Game.removeSprite.restore();
    asteroids.Asteroid.restore();
    asteroids.Explosion.restore();
  });

  it("should have finite state machine (FSM)", function () {
    expect(asteroids.Game.FSM).toBeDefined();
  });

  describe("FSM", function () {
    it("should have boot, waiting, start, spawn_ship, run, new_level, player_died and end_game states", function () {
      expect(asteroids.Game.FSM.boot).toBeDefined();
      expect(asteroids.Game.FSM.waiting).toBeDefined();
      expect(asteroids.Game.FSM.start).toBeDefined();
      expect(asteroids.Game.FSM.spawn_ship).toBeDefined();
      expect(asteroids.Game.FSM.run).toBeDefined();
      expect(asteroids.Game.FSM.new_level).toBeDefined();
      expect(asteroids.Game.FSM.player_died).toBeDefined();
      expect(asteroids.Game.FSM.end_game).toBeDefined();
    });

    describe("boot", function () {
      beforeEach(function () {
        sinon.stub(asteroids.Game, "spawnAsteroids");
        asteroids.Game.FSM.state = "boot";
      });

      afterEach(function () {
        asteroids.Game.spawnAsteroids.restore();
      });

      it("should call spawnAsteroids", function () {
        asteroids.Game.FSM.boot();

        expect(asteroids.Game.spawnAsteroids.called).toBeTruthy();
      });

      it("should set state to waiting", function () {
        asteroids.Game.FSM.boot();

        expect(asteroids.Game.FSM.state).toBe("waiting");
      });
    });

    describe("waiting", function () {
      beforeEach(function () {
        sinon.stub(Text, "renderText");
        asteroids.Game.FSM.state = "waiting";
        this.KEY_STATUS = asteroids.KEY_STATUS;
        asteroids.KEY_STATUS = { space: false };
        window.gameStart = false;
      });

      afterEach(function () {
        Text.renderText.restore();
        asteroids.KEY_STATUS = this.KEY_STATUS;
      });

      it("should call Text.renderText with Press Space to Start", function () {
        asteroids.Game.FSM.waiting();

        expect(Text.renderText.called).toBeTruthy();
        expect(Text.renderText.args[0][0]).toBe("Press Space to Start");
      });

      it("should set state to start when space is pressed", function () {
        asteroids.KEY_STATUS.space = true;

        asteroids.Game.FSM.waiting();

        expect(asteroids.Game.FSM.state).toBe("start");
      });

      it("should set state to start when window.gameStart is true", function () {
        window.gameStart = true;

        asteroids.Game.FSM.waiting();

        expect(asteroids.Game.FSM.state).toBe("start");
      });

      it("should not set state when space is not pressed and window.gameStart is false", function () {
        asteroids.Game.FSM.waiting();

        expect(asteroids.Game.FSM.state).toBe("waiting");
      });

      it("should set state KEY_STATUS.space to false when setting state to start", function () {
        asteroids.KEY_STATUS.space = true;

        asteroids.Game.FSM.waiting();

        expect(asteroids.KEY_STATUS.space).toBeFalsy();
      });
    });
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
