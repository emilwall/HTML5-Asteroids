describe("AlienBullet", function () {
  var alienBullet;

  beforeEach(function () {
    alienBullet = new asteroids.AlienBullet();
  });

  it("should have init method", function () {
    expect(typeof alienBullet.init).toEqual("function");
  });

  // init: set name of object
  /* draw:
   * do nothing if not visible
   * call save and then restore of context
   * draw line on canvas
   */
  // Inherits from bullet
});
