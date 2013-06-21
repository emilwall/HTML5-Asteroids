/* Sets keydown and keyup events on window using jQuery:
 * Always sets keyDown attribute of KEY_STATUS
 * If defined as key_code, preventDefault of the event and set KEY_STATUS
 */

describe("Config", function () {
  it("should define KEY_CODES object", function () {
    expect(typeof asteroids.KEY_CODES).toEqual("object");
  });

  describe("KEY_CODES", function () {
    it("should map numbers to logical names", function () {
      expect(asteroids.KEY_CODES[32]).toEqual("space");
    });
  });

  it("should define KEY_STATUS object", function () {
    expect(typeof asteroids.KEY_STATUS).toEqual("object");
  });

  describe("KEY_STATUS", function () {
    it("should have keyDown attribute", function () {
      expect(asteroids.KEY_STATUS.keyDown).toBeDefined();
    });

    it("should have a boolean for each key code", function () {
      expect(typeof asteroids.KEY_STATUS["space"]).toEqual("boolean");
      expect(typeof asteroids.KEY_STATUS["left"]).toEqual("boolean");
      expect(typeof asteroids.KEY_STATUS["p"]).toEqual("boolean");
    });
  });

  it("should define GRID_SIZE to 60", function () {
    expect(asteroids.GRID_SIZE).toEqual(60);
  });
});
