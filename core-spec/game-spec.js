describe("Game", function() {
  beforeEach(function() {
    this.game = asteroids.Game;
  });

  it("should have finite state machine (FSM)", function() {
    expect(this.game.FSM).not.toBeUndefined();
  });
});
