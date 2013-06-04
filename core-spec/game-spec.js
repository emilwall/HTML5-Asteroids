describe("Game", function() {
  beforeEach(function() {
    this.game = asteroids.Game;
  });

  it("should have finite state machine (FSM)", function() {
    expect(this.game.FSM).not.toBeUndefined();
  });

  it("should define explosionAt method", function() {
    expect(typeof this.game.explosionAt).toBe("function");
  });

  describe("explosionAt", function() {
    it("should add explosion to sprites", function() {
      var prevLength = asteroids.Game.sprites.length;

      this.game.explosionAt(0, 0);

      expect(asteroids.Game.sprites.length).toBe(prevLength + 1);
    });

    it("should set x, y and visible of explosion added to sprites", function() {
      var index = asteroids.Game.sprites.length;

      this.game.explosionAt(5, 7);
      var explosion = asteroids.Game.sprites[index];

      expect(explosion.x).toBe(5);
      expect(explosion.y).toBe(7);
      expect(explosion.visible).toBe(true);
    });
  });
});
