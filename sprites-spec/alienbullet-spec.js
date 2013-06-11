describe("AlienBullet", function() {
  beforeEach(function () {
    this.alienBullet = new AlienBullet();
  });

  it("should have init method", function() {
    expect(typeof this.alienBullet.init).toBe("function");
  });

  // init: set name of object
  /* draw:
   * do nothing if not visible
   * call save and then restore of context
   * draw line on canvas
   */
  // Inherits from bullet
});
