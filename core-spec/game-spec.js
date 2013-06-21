describe("Game", function () {
  var spritePrototypeDefined, spriteGrid, canvasWidth, canvasHeight, asteroidFake

  beforeEach(function () {
    spritePrototypeDefined = asteroids.Sprite && asteroids.Sprite.prototype;
    if (spritePrototypeDefined) {
      spriteGrid = asteroids.Sprite.prototype.grid;
    } else {
      asteroids.Sprite = asteroids.Sprite || {};
      asteroids.Sprite.prototype = {}
    }

    asteroids.Sprite.prototype.grid = [[new function () {
      this.enter = sinon.spy();
      this.leave = sinon.spy();
      this.isEmpty = sinon.stub().returns(true);
      this.north = this.south = this.east = this.west = this;
    }()]];

    canvasWidth = asteroids.Game.canvasWidth;
    asteroids.Game.canvasWidth = 0;
    canvasHeight = asteroids.Game.canvasHeight;
    asteroids.Game.canvasHeight = 0;

    sinon.stub(asteroids.Game, "addSprite");
    sinon.stub(asteroids.Game, "removeSprite");

    asteroidFake = {
      moveToSafePosition: sinon.spy(),
      vel: {},
      points: { reverse: sinon.spy() }
    };
    asteroids.Asteroid = asteroids.Asteroid || function () { };
    sinon.stub(asteroids, "Asteroid").returns(asteroidFake);

    asteroids.Explosion = asteroids.Explosion || function () { };
    sinon.stub(asteroids, "Explosion").returns(asteroidFake);
  });

  afterEach(function () {
    if (spritePrototypeDefined) {
      asteroids.Sprite.prototype.grid = spriteGrid;
    } else {
      delete asteroids.Sprite.prototype;
    }
    asteroids.Game.canvasWidth = canvasWidth;
    asteroids.Game.canvasHeight = canvasHeight;
    asteroids.Game.addSprite.restore();
    asteroids.Game.removeSprite.restore();
    asteroids.Asteroid.restore();
    asteroids.Explosion.restore();
  });

  it("should have finite state machine (FSM)", function () {
    expect(asteroids.Game.FSM).toBeDefined();
  });

  describe("FSM", function () {
    beforeEach(function () {
      sinon.stub(Text, "renderText");
      sinon.stub(asteroids.Game, "spawnAsteroids");
      sinon.stub(Date, "now").returns(1371304246157);
      sinon.stub(Math, "random").returns(0.5);

      this.state = asteroids.Game.FSM.state;
      this.sprites = asteroids.Game.sprites;
      asteroids.Game.sprites = [];
      this.score = asteroids.Game.score;
      this.lives = asteroids.Game.lives;
      this.totalAsteroids = asteroids.Game.totalAsteroids;
      this.bigAlien = asteroids.Game.bigAlien;
      asteroids.Game.bigAlien = { visible: false };
      this.nextBigAlienTime = asteroids.Game.nextBigAlienTime;
      this.ship = asteroids.Game.ship;
      asteroids.Game.ship = { vel: {}, isClear: sinon.stub().returns(true) };
      this.timer = asteroids.Game.FSM.timer;
    });

    afterEach(function () {
      Text.renderText.restore();
      asteroids.Game.spawnAsteroids.restore();
      Date.now.restore();
      Math.random.restore();

      asteroids.Game.FSM.state = this.state;
      asteroids.Game.sprites = this.sprites;
      asteroids.Game.score = this.score;
      asteroids.Game.lives = this.lives;
      asteroids.Game.totalAsteroids = this.totalAsteroids;
      asteroids.Game.bigAlien = this.bigAlien;
      asteroids.Game.nextBigAlienTime = this.nextBigAlienTime;
      asteroids.Game.ship = this.ship;
      asteroids.Game.FSM.timer = this.timer;
    });

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

    it("should have boot as starting state", function () {
      expect(asteroids.Game.FSM.state).toEqual("boot");
    });

    describe("boot", function () {
      it("should call spawnAsteroids", function () {
        asteroids.Game.FSM.boot();

        expect(asteroids.Game.spawnAsteroids.called).toEqual(true);
      });

      it("should set state to waiting", function () {
        asteroids.Game.FSM.boot();

        expect(asteroids.Game.FSM.state).toEqual("waiting");
      });
    });

    describe("waiting", function () {
      beforeEach(function () {
        asteroids.Game.FSM.state = "waiting";
        this.KEY_STATUS = asteroids.KEY_STATUS;
        asteroids.KEY_STATUS = { space: false };
        window.gameStart = false;
      });

      afterEach(function () {
        asteroids.KEY_STATUS = this.KEY_STATUS;
      });

      it("should call Text.renderText with Press Space to Start", function () {
        asteroids.Game.FSM.waiting();

        expect(Text.renderText.called).toEqual(true);
        expect(Text.renderText.args[0][0]).toEqual("Press Space to Start");
      });

      it("should set state to start when space is pressed", function () {
        asteroids.KEY_STATUS.space = true;

        asteroids.Game.FSM.waiting();

        expect(asteroids.Game.FSM.state).toEqual("start");
      });

      it("should set state to start when window.gameStart is true", function () {
        window.gameStart = true;

        asteroids.Game.FSM.waiting();

        expect(asteroids.Game.FSM.state).toEqual("start");
      });

      it("should not set state when space is not pressed and window.gameStart is false", function () {
        asteroids.Game.FSM.waiting();

        expect(asteroids.Game.FSM.state).toEqual("waiting");
      });

      it("should set state KEY_STATUS.space to false when setting state to start", function () {
        asteroids.KEY_STATUS.space = true;

        asteroids.Game.FSM.waiting();

        expect(asteroids.KEY_STATUS.space).toEqual(false);
      });
    });

    describe("start", function () {
      it("should set state to spawn_ship", function () {
        asteroids.Game.FSM.start();

        expect(asteroids.Game.FSM.state).toEqual("spawn_ship");
      });

      it("should call spawnAsteroids", function () {
        asteroids.Game.FSM.start();

        expect(asteroids.Game.spawnAsteroids.called).toEqual(true);
      });

      it("should call die on all asteroids in asteroids.Game.sprites", function () {
        var asteroid = { name: "asteroid", die: sinon.spy() };
        asteroids.Game.sprites.push(asteroid);

        asteroids.Game.FSM.start();

        expect(asteroid.die.called).toEqual(true);
      });

      it("should not call die on sprites that are not asteroids in asteroids.Game.sprites", function () {
        var sprite = { name: "ship", die: sinon.spy() };
        asteroids.Game.sprites.push(sprite);

        asteroids.Game.FSM.start();

        expect(sprite.die.called).toEqual(false);
      });

      it("should set visible to false on bullets and bigalien in asteroids.Game.sprites", function () {
        var bullet = { name: "bullet", visible: true };
        var bigAlien = { name: "bigalien", visible: true };
        asteroids.Game.sprites.push(bullet);
        asteroids.Game.sprites.push(bigAlien);

        asteroids.Game.FSM.start();

        expect(bullet.visible).toEqual(false);
        expect(bigAlien.visible).toEqual(false);
      });

      it("should not set visible to false on other than bullets and bigalien in asteroids.Game.sprites", function () {
        var sprite = { name: "ship", visible: true };
        asteroids.Game.sprites.push(sprite);

        asteroids.Game.FSM.start();

        expect(sprite.visible).toEqual(true);
      });

      it("should set score, lives and totalAsteroids to 0, 2 and 2 respectively", function () {
        asteroids.Game.score = 1;
        asteroids.Game.lives = 1;
        asteroids.Game.totalAsteroids = 1;

        asteroids.Game.FSM.start();

        expect(asteroids.Game.score).toEqual(0);
        expect(asteroids.Game.lives).toEqual(2);
        expect(asteroids.Game.totalAsteroids).toEqual(2);
      });

      it("should set asteroids.Game.nextBigAlienTime to time in the future", function () {
        var now = Date.now();

        asteroids.Game.FSM.start();

        expect(asteroids.Game.nextBigAlienTime).toBeGreaterThan(now);
      });
    });

    describe("spawn_ship", function () {
      it("should set state to run when ship is clear", function () {
        asteroids.Game.FSM.spawn_ship();

        expect(asteroids.Game.FSM.state).toEqual("run");
      });

      it("should not change state when ship is not clear", function () {
        asteroids.Game.ship = { vel: {}, isClear: sinon.stub().returns(false) };

        asteroids.Game.FSM.spawn_ship();

        expect(asteroids.Game.FSM.state).not.toEqual("run");
      });

      it("should set x and y coordinates of ship", function () {
        asteroids.Game.FSM.spawn_ship();

        expect(asteroids.Game.ship.x).toBeDefined();
        expect(asteroids.Game.ship.y).toBeDefined();
      });

      it("should set visible to true and reset rotation and velocity of ship when clear", function () {
        asteroids.Game.FSM.spawn_ship();

        expect(asteroids.Game.ship.rot).toEqual(0);
        expect(asteroids.Game.ship.vel.x).toEqual(0);
        expect(asteroids.Game.ship.vel.y).toEqual(0);
        expect(asteroids.Game.ship.visible).toEqual(true);
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
      it("should set state to new_level when no asteroids among Game.sprites", function () {
        asteroids.Game.sprites.push({ name: "bullet" });

        asteroids.Game.FSM.run();

        expect(asteroids.Game.FSM.state).toEqual("new_level");
      });

      it("should not set state to new_level when asteroids among Game.sprites", function () {
        asteroids.Game.sprites.push({ name: "asteroid" });

        asteroids.Game.FSM.run();

        expect(asteroids.Game.FSM.state).not.toEqual("new_level");
      });

      it("should set bigAlien to visible when nextBigAlienTime has passed", function () {
        asteroids.Game.nextBigAlienTime = Date.now() - 1;

        asteroids.Game.FSM.run();

        expect(asteroids.Game.bigAlien.visible).toEqual(true);
      });

      it("should not set bigAlien to visible unless nextBigAlienTime has passed", function () {
        asteroids.Game.nextBigAlienTime = Date.now() + 1;

        asteroids.Game.FSM.run();

        expect(asteroids.Game.bigAlien.visible).toEqual(false);
      });

      it("should set new value of nextBigAlienTime when nextBigAlienTime has passed", function () {
        asteroids.Game.nextBigAlienTime = Date.now();

        asteroids.Game.FSM.run();

        expect(asteroids.Game.nextBigAlienTime).toBeGreaterThan(Date.now());
      });
    });

    describe("new_level", function () {
      it("should set state to run when one second has passed since this.timer", function () {
        asteroids.Game.FSM.timer = Date.now() - 1000;

        asteroids.Game.FSM.new_level();

        expect(asteroids.Game.FSM.state).toEqual("run");
      });

      it("should not change state unless one second has passed since this.timer", function () {
        asteroids.Game.FSM.timer = Date.now() - 999;

        asteroids.Game.FSM.new_level();

        expect(asteroids.Game.FSM.state).not.toEqual("run");
      });

      it("should set this.timer to Date.now() if previously null", function () {
        asteroids.Game.FSM.timer = null;

        asteroids.Game.FSM.new_level();

        expect(asteroids.Game.FSM.timer).toEqual(Date.now());
      });

      it("should set timer to null when changing state", function () {
        asteroids.Game.FSM.timer = Date.now() - 1000;

        asteroids.Game.FSM.new_level();

        expect(asteroids.Game.FSM.timer).toBeNull();
      });

      it("should increment totalAsteroids when changing state", function () {
        asteroids.Game.FSM.timer = Date.now() - 1000;
        var totalAsteroids = asteroids.Game.totalAsteroids;

        asteroids.Game.FSM.new_level();

        expect(asteroids.Game.totalAsteroids).toEqual(totalAsteroids + 1);
      });

      it("should not increment totalAsteroids past 12", function () {
        asteroids.Game.FSM.timer = Date.now() - 1000;
        asteroids.Game.totalAsteroids = 12;

        asteroids.Game.FSM.new_level();

        expect(asteroids.Game.totalAsteroids).toEqual(12);
      });

      it("should call spawnAsteroids when changing state", function () {
        asteroids.Game.FSM.timer = Date.now() - 1000;
        asteroids.Game.FSM.new_level();

        expect(asteroids.Game.spawnAsteroids.called).toEqual(true);
      });

      it("should not call spawnAsteroids unless changing state", function () {
        asteroids.Game.FSM.timer = Date.now();

        asteroids.Game.FSM.new_level();

        expect(asteroids.Game.spawnAsteroids.called).toEqual(false);
      });
    });

    describe("player_died", function () {
      it("should set state to end_game when lives are -1 or fewer", function () {
        asteroids.Game.lives = -1;

        asteroids.Game.FSM.player_died();

        expect(asteroids.Game.FSM.state).toEqual("end_game");
      });

      it("should set state to spawn_ship when lives left and one second has passed", function () {
        asteroids.Game.lives = 2;
        asteroids.Game.FSM.timer = Date.now() - 1000;

        asteroids.Game.FSM.player_died();

        expect(asteroids.Game.FSM.state).toEqual("spawn_ship");
      });

      it("should set this.timer to Date.now() when previously null", function () {
        asteroids.Game.FSM.timer = null

        asteroids.Game.FSM.player_died();

        expect(asteroids.Game.FSM.timer).toEqual(Date.now());
      });

      it("should set this.timer to null when changing state to spawn_ship", function () {
        asteroids.Game.lives = 2;
        asteroids.Game.FSM.timer = Date.now() - 1000;

        asteroids.Game.FSM.player_died();

        expect(asteroids.Game.FSM.timer).toBeNull();
      });
    });

    describe("end_game", function () {
      it("should call Text.renderText with GAME OVER", function () {
        asteroids.Game.FSM.end_game();

        expect(Text.renderText.args[0][0]).toEqual("GAME OVER");
      });

      it("should set this.timer to Date.now() when previously null", function () {
        asteroids.Game.FSM.timer = null

        asteroids.Game.FSM.end_game();

        expect(asteroids.Game.FSM.timer).toEqual(Date.now());
      });

      it("should not change state to waiting before 5 seconds", function () {
        asteroids.Game.FSM.timer = Date.now() - 1000;

        asteroids.Game.FSM.end_game();

        expect(asteroids.Game.FSM.state).not.toEqual("waiting");
      });

      it("should change state to waiting after 5 seconds", function () {
        asteroids.Game.FSM.timer = Date.now() - 5000;

        asteroids.Game.FSM.end_game();

        expect(asteroids.Game.FSM.state).toEqual("waiting");
      });

      it("should set window.gameStart to false", function () {
        window.gameStart = true;

        asteroids.Game.FSM.end_game();

        expect(window.gameStart).toEqual(false);
      });
    });

    describe("execute", function () {
      beforeEach(function () {
        sinon.stub(asteroids.Game.FSM, "boot");
        sinon.stub(asteroids.Game.FSM, "end_game");
      });

      afterEach(function () {
        asteroids.Game.FSM.boot.restore();
        asteroids.Game.FSM.end_game.restore();
      });

      it("should call function with same name as this.state", function () {
        asteroids.Game.FSM.state = "boot";

        asteroids.Game.FSM.execute();

        expect(asteroids.Game.FSM.boot.called).toEqual(true);
      });

      it("should call end_game when this.state = end_game", function () {
        asteroids.Game.FSM.state = "end_game";

        asteroids.Game.FSM.execute();

        expect(asteroids.Game.FSM.end_game.called).toEqual(true);
      });
    });
  });

  it("should define spawnAsteroids, explosionAt and updateSprites methods", function () {
    expect(typeof asteroids.Game.spawnAsteroids).toEqual("function");
    expect(typeof asteroids.Game.explosionAt).toEqual("function");
    expect(typeof asteroids.Game.updateSprites).toEqual("function");
  });

  describe("spawnAsteroids", function () {
    it("should call addSprite this.totalAsteroids number of times when called without argument", function () {
      asteroids.Game.totalAsteroids = 5;

      asteroids.Game.spawnAsteroids();

      expect(asteroids.Game.addSprite.callCount).toEqual(5);
    });
  });

  describe("explosionAt", function () {
    it("should call addSprite with explosion with set x, y and visible attributes", function () {
      asteroids.Game.explosionAt(5, 7);

      var explosion = asteroids.Game.addSprite.args[0][0];

      expect(explosion.x).toEqual(5);
      expect(explosion.y).toEqual(7);
      expect(explosion.visible).toEqual(true);
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

      expect(this.sprite1.run.calledWith(delta)).toEqual(true);
    });

    it("should call removeSprite on sprites with truthy reappear value", function () {
      asteroids.Game.updateSprites(1);

      expect(asteroids.Game.removeSprite.calledWith(0)).toEqual(true);
      expect(asteroids.Game.removeSprite.calledWith(1)).toEqual(false);
      expect(asteroids.Game.removeSprite.calledWith(2)).toEqual(true);
    });
  });
});
