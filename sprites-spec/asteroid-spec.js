describe("Asteroid", function () {
  var asteroid, gameScore;

  beforeEach(function () {
    asteroid = new asteroids.Asteroid();
    sinon.stub(asteroids.Game, "addSprite");
    gameScore = asteroids.Game.score;
  });

  afterEach(function () {
    asteroids.Game.addSprite.restore();
    asteroids.Game.score = gameScore;
  });

  describe("Collision", function () {
    beforeEach(function () {
      asteroid.die = sinon.spy();
    });

    it("should die when other is bullet", function () {
      var bullet = { name: "bullet" };

      asteroid.collision(bullet);

      assert(asteroid.die.called);
    });
  });
});
