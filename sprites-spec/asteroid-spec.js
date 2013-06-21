describe("Asteroid", function () {
  var spriteInit, asteroid, gameScore;

  beforeEach(function () {
    spriteInit = sinon.spy();
    sinon.stub(asteroids, "Sprite").returns({ init: spriteInit });
    sinon.stub(asteroids.Asteroid.prototype, "init");
    sinon.stub(asteroids.Game, "addSprite");
    gameScore = asteroids.Game.score;

    asteroid = new asteroids.Asteroid();
    asteroid.vel = {};
  });

  afterEach(function () {
    asteroids.Sprite.restore();
    asteroids.Asteroid.prototype.init.restore();
    asteroids.Game.addSprite.restore();
    asteroids.Game.score = gameScore;
  });

  it("should call asteroids.Asteroid.prototype.init in constructor", function () {
    expect(asteroids.Asteroid.prototype.init.called).toEqual(true);
  });

  describe("Collision", function () {
    beforeEach(function () {
      asteroid.die = sinon.spy();
      asteroid.move = sinon.spy();
      asteroid.points = asteroids.Asteroid.prototype.init.args[0][1];
    });

    it("should die when other is bullet", function () {
      var bullet = { name: "bullet" };

      asteroid.collision(bullet);

      assert(asteroid.die.called);
    });
  });
});
