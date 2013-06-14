describe("Ship", function () {
  beforeEach(function () {
    this.ship = new asteroids.Ship();
    this.ship.currentNode = this.ship.currentNode || {};
    this.ship.currentNode.leave = sinon.stub();
    sinon.stub(asteroids.Game, "explosionAt");
    this.gameLives = asteroids.Game.lives;
  });

  afterEach(function () {
    asteroids.Game.explosionAt.restore();
    asteroids.Game.lives = this.gameLives;
  });

  it("should have collision method", function () {
    expect(typeof this.ship.collision).toBe("function");
  });

  describe("Collision", function () {
    it("should deduct lives left when colliding with asteroid", function () {
      var roid = { name: "asteroid", x: 0, y: 0 };
      asteroids.Game.lives = 3;

      this.ship.collision(roid);

      expect(asteroids.Game.lives).toBe(2);
    });
  });

  it("should have preMove method", function () {
    expect(typeof this.ship.collision).toBe("function");
  });

  describe("preMove", function () {
    it("should set rotation velocity to zero when no key is pressed", function () {
      this.ship.vel.rot = 5;

      this.ship.preMove(3);

      expect(this.ship.vel.rot).toBe(0);
    });
  });
});
