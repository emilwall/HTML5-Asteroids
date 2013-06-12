describe("Game", function() {
  it("should have finite state machine (FSM)", function() {
    expect(asteroids.Game.FSM).not.toBeUndefined();
  });

  it("should define spawnAsteroids, explosionAt and updateSprites methods", function() {
    expect(typeof asteroids.Game.spawnAsteroids).toBe("function");
    expect(typeof asteroids.Game.explosionAt).toBe("function");
    expect(typeof asteroids.Game.updateSprites).toBe("function");
  });

  describe("spawnAsteroids", function() {
    it("should spawn this.totalAsteroids number of asteroids when called without argument", function() {
      var prevLength = asteroids.Game.sprites.length;
      asteroids.Game.totalAsteroids = 5;
      
      asteroids.Game.spawnAsteroids();
      
      expect(asteroids.Game.sprites.length).toBe(prevLength + asteroids.Game.totalAsteroids);
    });
  });

  describe("explosionAt", function() {
    beforeEach(function () {
      this.sprites = asteroids.Game.sprites;
      asteroids.Game.sprites = [];
    });

    afterEach(function () {
      asteroids.Game.sprites = this.sprites;
    });

    it("should add explosion to sprites", function() {
      var prevLength = asteroids.Game.sprites.length;

      asteroids.Game.explosionAt(0, 0);

      expect(asteroids.Game.sprites.length).toBe(prevLength + 1);
    });

    it("should set x, y and visible of explosion added to sprites", function() {
      var index = asteroids.Game.sprites.length;

      asteroids.Game.explosionAt(5, 7);
      var explosion = asteroids.Game.sprites[index];

      expect(explosion.x).toBe(5);
      expect(explosion.y).toBe(7);
      expect(explosion.visible).toBe(true);
    });
  });
});
