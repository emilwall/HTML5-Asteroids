describe("Asteroid", function() {
  beforeEach(function() {
    this.asteroid = new asteroids.Asteroid();
    sinon.stub(asteroids.Game, "addSprite");
    this.gameScore = asteroids.Game.score;
  });

  afterEach(function () {
    asteroids.Game.addSprite.restore();
    asteroids.Game.score = this.gameScore;
  });

  describe("Collision", function () {

    beforeEach(function () {
      this.asteroid.die = sinon.spy();
    });

    it("should die when other is bullet", function() {
      var bullet = { name: "bullet" };

      this.asteroid.collision(bullet);

      assert(this.asteroid.die.called);
    });
  });
});
