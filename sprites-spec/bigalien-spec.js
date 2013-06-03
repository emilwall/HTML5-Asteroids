describe("BigAlien", function() {
  beforeEach(function() {
    this.bigAlien = new asteroids.BigAlien();
  });

  it("should have newPosition, setup, preMove, collision and postMove methods", function() {
    expect(typeof this.bigAlien.newPosition).toBe("function");
    expect(typeof this.bigAlien.setup).toBe("function");
    expect(typeof this.bigAlien.preMove).toBe("function");
    expect(typeof this.bigAlien.collision).toBe("function");
    expect(typeof this.bigAlien.postMove).toBe("function");
  });

  describe("Collision", function() {
    it("should set visible to false when hit by bullet", function() {
      var bullet = { name: "bullet" };
      this.bigAlien.visible = true;

      this.bigAlien.collision(bullet);

      expect(this.bigAlien.visible).toBe(false);
    });
  });
});
