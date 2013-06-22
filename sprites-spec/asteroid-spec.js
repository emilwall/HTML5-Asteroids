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
