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

  describe("setup", function() {
    it("should set position", function() {
      this.bigAlien.x = null;
      this.bigAlien.y = null;

      this.bigAlien.setup();

      expect(typeof this.bigAlien.x).toBe("number");
      expect(typeof this.bigAlien.y).toBe("number");
    });
  });

  describe("collision", function() {
    it("should set visible to false when hit by bullet", function() {
      var bullet = { name: "bullet" };
      this.bigAlien.visible = true;

      this.bigAlien.collision(bullet);

      expect(this.bigAlien.visible).toBe(false);
    });

    it("should increase score by 200 when hit by bullet", function() {
      var bullet = { name: "bullet" };
      asteroids.Game.score = 100;

      this.bigAlien.collision(bullet);

      expect(asteroids.Game.score).toBe(300);
    });
  });
});
