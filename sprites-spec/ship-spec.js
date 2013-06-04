describe("Ship", function() {
  beforeEach(function() {
    this.ship = new asteroids.Ship();
    asteroids.Game.explosionAt = sinon.stub();
    this.ship.currentNode = this.ship.currentNode || {};
    this.ship.currentNode.leave = sinon.stub();
  });

  it("should have collision method", function() {
    expect(typeof this.ship.collision).toBe("function");
  });
  
  describe("Collision", function() {
    it("should deduct lives left when colliding with asteroid", function() {
      var roid = { name: "asteroid", x: 0, y: 0 };
      asteroids.Game.lives = 3;
      
      this.ship.collision(roid);
      
      expect(asteroids.Game.lives).toBe(2);
    });
  });
});
