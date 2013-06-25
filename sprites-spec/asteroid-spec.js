describe("Asteroid", function () {
  var fakeAsteroid, spriteInit, asteroid, gameScore;

  beforeEach(function () {
    fakeAsteroid = { vel: {}, scale: 2, move: sinon.spy(), points: { reverse: sinon.spy() } };
    sinon.stub($, "extend").returns(fakeAsteroid);
    sinon.stub(Math, "random").returns(0.5);
    spriteInit = sinon.spy();
    sinon.stub(asteroids, "Sprite").returns({ init: spriteInit });
    sinon.stub(asteroids.Asteroid.prototype, "init");
    sinon.stub(asteroids.Asteroid.prototype, "wrapPostMove");
    sinon.stub(asteroids.Asteroid.prototype, "isClear", function () { return asteroid.isClear.callCount >= 10; });
    sinon.stub(asteroids.Game, "addSprite");
    sinon.stub(asteroids.Game, "explosionAt");
    gameScore = asteroids.Game.score;
    asteroids.Game.score = 0;

    asteroid = new asteroids.Asteroid();
    asteroid.vel = {};
  });

  afterEach(function () {
    $.extend.restore();
    Math.random.restore();
    asteroids.Sprite.restore();
    asteroids.Asteroid.prototype.init.restore();
    asteroids.Asteroid.prototype.wrapPostMove.restore();
    asteroids.Asteroid.prototype.isClear.restore();
    asteroids.Game.addSprite.restore();
    asteroids.Game.explosionAt.restore();
    asteroids.Game.score = gameScore;
  });

  it("should call asteroids.Asteroid.prototype.init in constructor", function () {
    sinon.assert.called(asteroids.Asteroid.prototype.init);
  });

  describe("postMove", function () {
    it("should call wrapPostMove", function () {
      asteroid.postMove();

      sinon.assert.called(asteroids.Asteroid.prototype.wrapPostMove);
    });

    it("should be wrapPostMove", function () {
      expect(asteroid.postMove).toBe(asteroids.Asteroid.prototype.wrapPostMove);
    });
  });

  it("should be able to collide with ship", function () {
    expect(asteroid.collidesWith).toContain("ship");
  });

  it("should be able to collide with bullet", function () {
    expect(asteroid.collidesWith).toContain("bullet");
  });

  it("should be able to collide with bigalien", function () {
    expect(asteroid.collidesWith).toContain("bigalien");
  });

  it("should be able to collide with alienbullet", function () {
    expect(asteroid.collidesWith).toContain("alienbullet");
  });

  it("should not be able to collide with other asteroids", function () {
    expect(asteroid.collidesWith).not.toContain("asteroid");
  });

  describe("Collision", function () {
    var other;

    beforeEach(function () {
      asteroid.die = sinon.spy();
      asteroid.move = sinon.spy();
      asteroid.points = asteroids.Asteroid.prototype.init.args[0][1];
      other = { name: "bullet" };
    });

    it("should call this.die", function () {
      asteroid.collision(other);

      sinon.assert.called(asteroid.die);
    });

    it("should increase score with 120 / this.scale when other is bullet", function () {
      asteroid.scale = 2;

      asteroid.collision(other);

      expect(asteroids.Game.score).toEqual(60);
    });

    it("should not increase score when other is ship", function () {
      other.name = "ship";

      asteroid.collision(other);

      expect(asteroids.Game.score).toEqual(0);
    });

    it("should not increase score when other is alienbullet", function () {
      other.name = "alienbullet";

      asteroid.collision(other);

      expect(asteroids.Game.score).toEqual(0);
    });

    it("should not increase score when other is bigalien", function () {
      other.name = "bigalien";

      asteroid.collision(other);

      expect(asteroids.Game.score).toEqual(0);
    });

    it("should divide this.scale with 3", function () {
      asteroid.scale = 2;

      asteroid.collision(other);

      expect(asteroid.scale).toBeCloseTo(0.667, 3);
    });

    it("should divide this.scale with 3 once for every call", function () {
      asteroid.scale = 12;

      asteroid.collision(other);
      asteroid.collision(other);
      asteroid.collision(other);

      expect(asteroid.scale).toBeCloseTo(0.444, 3);
    });

    it("should add 3 asteroids to game when this.scale > 0.5", function () {
      asteroid.collision(other);

      expect(asteroids.Game.addSprite.callCount).toEqual(3);
    });

    it("should not add asteroids to game when this.scale <= 0.5", function () {
      asteroid.scale = 0.5;

      asteroid.collision(other);

      sinon.assert.notCalled(asteroids.Game.addSprite);
    });

    it("should perform deep copy with $.extend when adding new asteroids to game", function () {
      asteroid.collision(other);

      expect($.extend.calledWith(true, {}, asteroid)).toEqual(true);
      expect($.extend.calledWith(false)).toEqual(false);
    });

    it("should reverse points of new asteroids when Math.random() > 0.5", function () {
      Math.random.returns(0.75);

      asteroid.collision(other);

      sinon.assert.called(fakeAsteroid.points.reverse);
    });

    it("should reverse points of new asteroids when Math.random() <= 0.5", function () {
      asteroid.collision(other);

      sinon.assert.notCalled(fakeAsteroid.points.reverse);
    });

    it("should set velocity of new asteroids using Math.random()", function () {
      asteroid.scale = 60;
      asteroid.collision(other);
      var prevVel = { x: fakeAsteroid.vel.x, y: fakeAsteroid.vel.y, rot: fakeAsteroid.vel.rot };
      asteroid.collision(other);

      expect(fakeAsteroid.vel).toEqual(prevVel);

      Math.random.returns(0.25);
      asteroid.collision(other);

      expect(fakeAsteroid.vel).not.toEqual(prevVel);
    });

    it("should call move method of new asteroids", function () {
      asteroid.collision(other);

      expect(fakeAsteroid.move.calledWith(fakeAsteroid.scale * 3)).toEqual(true);
    });
  });

  describe("moveToSafePosition", function () {
    it("should set x and y coordinates", function () {
      asteroid.x = asteroid.y = null;

      asteroid.moveToSafePosition();

      expect(typeof asteroid.x).toBe("number");
      expect(typeof asteroid.y).toBe("number");
    });

    it("should call this.isClear", function () {
      asteroid.moveToSafePosition();

      expect(asteroid.isClear.called).toBe(true);
    });

    it("should set position using Math.random until this.isClear returns true", function () {
      asteroid.moveToSafePosition(780, 540);

      expect(Math.random.callCount).toBe(20);
      expect(asteroid.isClear.callCount).toBe(10);
    });
  });
});
