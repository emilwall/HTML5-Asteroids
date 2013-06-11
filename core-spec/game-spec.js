describe("Game", function() {
  it("should have finite state machine (FSM)", function() {
    expect(asteroids.Game.FSM).not.toBeUndefined();
  });

  it("should define explosionAt method", function() {
    expect(typeof asteroids.Game.explosionAt).toBe("function");
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
