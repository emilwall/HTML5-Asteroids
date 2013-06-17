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

    describe("start", function () {
      beforeEach(function () {
        sinon.stub(Date, "now").returns(1371304246157);
        sinon.stub(Math, "random").returns(0.5);
        sinon.stub(asteroids.Game, "spawnAsteroids");
        asteroids.Game.FSM.state = "start";
        this.sprites = asteroids.Game.sprites;
        asteroids.Game.sprites = [];
        this.score = asteroids.Game.score;
        this.lives = asteroids.Game.lives;
        this.totalAsteroids = asteroids.Game.totalAsteroids;
        this.nextBigAlienTime = asteroids.Game.nextBigAlienTime;
      });

      afterEach(function () {
        Date.now.restore();
        Math.random.restore();
        asteroids.Game.spawnAsteroids.restore();
        asteroids.Game.sprites = this.sprites;
        asteroids.Game.score = this.score;
        asteroids.Game.lives = this.lives;
        asteroids.Game.totalAsteroids = this.totalAsteroids;
        asteroids.Game.nextBigAlienTime = this.nextBigAlienTime;
      });

      it("should set state to spawn_ship", function () {
        asteroids.Game.FSM.start();

        expect(asteroids.Game.FSM.state).toBe("spawn_ship");
      });

      it("should call spawnAsteroids", function () {
        asteroids.Game.FSM.start();

        expect(asteroids.Game.spawnAsteroids.called).toBeTruthy();
      });

      it("should call die on all asteroids in asteroids.Game.sprites", function () {
        var asteroid = { name: "asteroid", die: sinon.spy() };
        asteroids.Game.sprites.push(asteroid);

        asteroids.Game.FSM.start();

        expect(asteroid.die.called).toBeTruthy();
      });

      it("should not call die on sprites that are not asteroids in asteroids.Game.sprites", function () {
        var sprite = { name: "ship", die: sinon.spy() };
        asteroids.Game.sprites.push(sprite);

        asteroids.Game.FSM.start();

        expect(sprite.die.called).toBeFalsy();
      });

      it("should set visible to false on bullets and bigalien in asteroids.Game.sprites", function () {
        var bullet = { name: "bullet", visible: true };
        var bigAlien = { name: "bigalien", visible: true };
        asteroids.Game.sprites.push(bullet);
        asteroids.Game.sprites.push(bigAlien);

        asteroids.Game.FSM.start();

        expect(bullet.visible).toBeFalsy();
        expect(bigAlien.visible).toBeFalsy();
      });

      it("should not set visible to false on other than bullets and bigalien in asteroids.Game.sprites", function () {
        var sprite = { name: "ship", visible: true };
        asteroids.Game.sprites.push(sprite);

        asteroids.Game.FSM.start();

        expect(sprite.visible).toBeTruthy();
      });

      it("should set score, lives and totalAsteroids to 0, 2 and 2 respectively", function () {
        asteroids.Game.score = 1;
        asteroids.Game.lives = 1;
        asteroids.Game.totalAsteroids = 1;

        asteroids.Game.FSM.start();

        expect(asteroids.Game.score).toBe(0);
        expect(asteroids.Game.lives).toBe(2);
        expect(asteroids.Game.totalAsteroids).toBe(2);
      });

      it("should set asteroids.Game.nextBigAlienTime to time in the future", function () {
        var now = Date.now();

        asteroids.Game.FSM.start();

        expect(asteroids.Game.nextBigAlienTime).toBeGreaterThan(now);
      });
    });

    describe("spawn_ship", function () {
      beforeEach(function () {
        asteroids.Game.FSM.state = "spawn_ship";
        this.ship = asteroids.Game.ship;
        asteroids.Game.ship = { vel: {}, isClear: sinon.stub().returns(true) };
      });

      afterEach(function () {
        asteroids.Game.ship = this.ship;
      });

      it("should set state to run when ship is clear", function () {
        asteroids.Game.FSM.spawn_ship();

        expect(asteroids.Game.FSM.state).toBe("run");
      });

      it("should not change state when ship is not clear", function () {
        asteroids.Game.ship = { vel: {}, isClear: sinon.stub().returns(false) };

        asteroids.Game.FSM.spawn_ship();

        expect(asteroids.Game.FSM.state).not.toBe("run");
      });

      it("should set x and y coordinates of ship", function () {
        asteroids.Game.FSM.spawn_ship();

        expect(asteroids.Game.ship.x).toBeDefined();
        expect(asteroids.Game.ship.y).toBeDefined();
      });

      it("should set visible to true and reset rotation and velocity of ship when clear", function () {
        asteroids.Game.FSM.spawn_ship();

        expect(asteroids.Game.ship.rot).toBe(0);
        expect(asteroids.Game.ship.vel.x).toBe(0);
        expect(asteroids.Game.ship.vel.y).toBe(0);
        expect(asteroids.Game.ship.visible).toBeTruthy();
      });

      it("should not set visible, rotation and velocity of ship when not clear", function () {
        asteroids.Game.ship = { vel: {}, isClear: sinon.stub().returns(false) };

        asteroids.Game.FSM.spawn_ship();

        expect(asteroids.Game.ship.rot).toBeUndefined();
        expect(asteroids.Game.ship.vel.x).toBeUndefined();
        expect(asteroids.Game.ship.vel.y).toBeUndefined();
        expect(asteroids.Game.ship.visible).toBeUndefined();
      });
    });

    describe("run", function () {
      beforeEach(function () {
        sinon.stub(Date, "now").returns(1371304246157);
        sinon.stub(Math, "random").returns(0.5);
        asteroids.Game.FSM.state = "start";
        this.sprites = asteroids.Game.sprites;
        asteroids.Game.sprites = [];
        this.bigAlien = asteroids.Game.bigAlien;
        asteroids.Game.bigAlien = { visible: false };
        this.nextBigAlienTime = asteroids.Game.nextBigAlienTime;
      });

      afterEach(function () {
        Date.now.restore();
        Math.random.restore();
        asteroids.Game.sprites = this.sprites;
        asteroids.Game.bigAlien = this.bigAlien;
        asteroids.Game.nextBigAlienTime = this.nextBigAlienTime;
      });

      it("should set state to new_level when no asteroids among Game.sprites", function () {
        asteroids.Game.sprites.push({ name: "bullet" });

        asteroids.Game.FSM.run();

        expect(asteroids.Game.FSM.state).toBe("new_level");
      });

      it("should not set state to new_level when asteroids among Game.sprites", function () {
        asteroids.Game.sprites.push({ name: "asteroid" });

        asteroids.Game.FSM.run();

        expect(asteroids.Game.FSM.state).not.toBe("new_level");
      });

      it("should set bigAlien to visible when nextBigAlienTime has passed", function () {
        asteroids.Game.nextBigAlienTime = Date.now() - 1;

        asteroids.Game.FSM.run();

        expect(asteroids.Game.bigAlien.visible).toBeTruthy();
      });

      it("should not set bigAlien to visible unless nextBigAlienTime has passed", function () {
        asteroids.Game.nextBigAlienTime = Date.now() + 1;

        asteroids.Game.FSM.run();

        expect(asteroids.Game.bigAlien.visible).toBeFalsy();
      });

      it("should set new value of nextBigAlienTime when nextBigAlienTime has passed", function () {
        asteroids.Game.nextBigAlienTime = Date.now();

        asteroids.Game.FSM.run();

        expect(asteroids.Game.nextBigAlienTime).toBeGreaterThan(Date.now());
      });
    });

    describe("new_level", function () {
      beforeEach(function () {
        sinon.stub(Date, "now").returns(1371304246157);
        sinon.stub(asteroids.Game, "spawnAsteroids");
        asteroids.Game.FSM.state = "new_level";
        this.totalAsteroids = asteroids.Game.totalAsteroids;
        this.timer = asteroids.Game.FSM.timer;
        asteroids.Game.FSM.timer = Date.now() - 1000;
      });

      afterEach(function () {
        Date.now.restore();
        asteroids.Game.spawnAsteroids.restore();
        asteroids.Game.totalAsteroids = this.totalAsteroids;
        asteroids.Game.FSM.timer = this.timer;
      });

      it("should set state to run when one second has passed since this.timer", function () {
        asteroids.Game.FSM.new_level();

        expect(asteroids.Game.FSM.state).toBe("run");
      });

      it("should not change state unless one second has passed since this.timer", function () {
        asteroids.Game.FSM.timer = Date.now() - 999;

        asteroids.Game.FSM.new_level();

        expect(asteroids.Game.FSM.state).not.toBe("run");
      });

      it("should set this.timer to Date.now() if previously null", function () {
        asteroids.Game.FSM.timer = null;

        asteroids.Game.FSM.new_level();

        expect(asteroids.Game.FSM.timer).toBe(Date.now());
      });

      it("should set timer to null when changing state", function () {
        asteroids.Game.FSM.new_level();

        expect(asteroids.Game.FSM.timer).toBeNull();
      });

      it("should increment totalAsteroids when changing state", function () {
        var totalAsteroids = asteroids.Game.totalAsteroids;

        asteroids.Game.FSM.new_level();

        expect(asteroids.Game.totalAsteroids).toBe(totalAsteroids + 1);
      });

      it("should not increment totalAsteroids past 12", function () {
        asteroids.Game.totalAsteroids = 12;

        asteroids.Game.FSM.new_level();

        expect(asteroids.Game.totalAsteroids).toBe(12);
      });

      it("should call spawnAsteroids when changing state", function () {
        asteroids.Game.FSM.new_level();

        expect(asteroids.Game.spawnAsteroids.called).toBeTruthy();
      });

      it("should not call spawnAsteroids unless changing state", function () {
        asteroids.Game.FSM.timer = Date.now();

        asteroids.Game.FSM.new_level();

        expect(asteroids.Game.spawnAsteroids.called).toBeFalsy();
      });
    });

    describe("player_died", function () {
      beforeEach(function () {
        sinon.stub(Date, "now").returns(1371304246157);
        asteroids.Game.FSM.state = "player_died";
        this.lives = asteroids.Game.lives;
        asteroids.Game.lives = 2;
        this.timer = asteroids.Game.FSM.timer;
        asteroids.Game.FSM.timer = Date.now() - 1000;
      });

      afterEach(function () {
        Date.now.restore();
        asteroids.Game.lives = this.lives;
        asteroids.Game.FSM.timer = this.timer;
      });

      it("should set state to end_game when lives are -1 or fewer", function () {
        asteroids.Game.lives = -1;

        asteroids.Game.FSM.player_died();

        expect(asteroids.Game.FSM.state).toBe("end_game");
      });

      it("should set state to spawn_ship when lives left and one second has passed", function () {
        asteroids.Game.FSM.player_died();

        expect(asteroids.Game.FSM.state).toBe("spawn_ship");
      });

      it("should set this.timer to Date.now() when previously null", function () {
        asteroids.Game.FSM.timer = null

        asteroids.Game.FSM.player_died();

        expect(asteroids.Game.FSM.timer).toBe(Date.now());
      });

      it("should set this.timer to null when state is set to spawn_ship", function () {
        asteroids.Game.FSM.player_died();

        expect(asteroids.Game.FSM.timer).toBeNull();
      });
    });

    describe("end_game", function () {
      beforeEach(function () {
        sinon.stub(Text, "renderText");
        sinon.stub(Date, "now").returns(1371304246157);
        asteroids.Game.FSM.state = "end_game";
        this.timer = asteroids.Game.FSM.timer;
        asteroids.Game.FSM.timer = Date.now() - 1000;
        window.gameStart = true;
      });

      afterEach(function () {
        Text.renderText.restore();
        Date.now.restore();
      });

      it("should call Text.renderText with GAME OVER", function () {
        asteroids.Game.FSM.end_game();

        expect(Text.renderText.args[0][0]).toBe("GAME OVER");
      });

      it("should set this.timer to Date.now() when previously null", function () {
        asteroids.Game.FSM.timer = null

        asteroids.Game.FSM.end_game();

        expect(asteroids.Game.FSM.timer).toBe(Date.now());
      });

      it("should not change state to waiting before 5 seconds", function () {
        asteroids.Game.FSM.end_game();

        expect(asteroids.Game.FSM.state).not.toBe("waiting");
      });

      it("should change state to waiting after 5 seconds", function () {
        asteroids.Game.FSM.timer = Date.now() - 5000;

        asteroids.Game.FSM.end_game();

        expect(asteroids.Game.FSM.state).toBe("waiting");
      });

      it("should set window.gameStart to false", function () {
        asteroids.Game.FSM.end_game();

        expect(window.gameStart).toBeFalsy();
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
