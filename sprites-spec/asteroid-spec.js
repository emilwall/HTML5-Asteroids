describe("Asteroid", function() {
  beforeEach(function() {
    this.asteroid = new asteroids.Asteroid();
  });

  it("should have collision method", function() {
    expect(typeof this.asteroid.collision).toBe("function");
  });
  
  describe("Collision", function() {

    beforeEach(function() {
      this.asteroid.die = sinon.spy();
    });

    it("should die when other is bullet", function() {
      var bullet = { name: "bullet" };

      this.asteroid.collision(bullet);

      assert(this.asteroid.die.called);
    });
  });
});
