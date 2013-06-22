describe("GridNode", function () {
  var gridNode, sprite, anotherSprite;

  beforeEach(function () {
    gridNode = new asteroids.GridNode();
    sprite = { nextSprite: null };
    anotherSprite = { nextSprite: null };
  });

  it("should have enter, leave, eachSprite and isEmpty methods", function () {
    expect(typeof gridNode.enter).toEqual("function");
    expect(typeof gridNode.leave).toEqual("function");
    expect(typeof gridNode.eachSprite).toEqual("function");
    expect(typeof gridNode.isEmpty).toEqual("function");
  });

  it("should initialize north, south, east, west and nextSprite to null", function () {
    expect(gridNode.north).toBeNull();
    expect(gridNode.south).toBeNull();
    expect(gridNode.east).toBeNull();
    expect(gridNode.west).toBeNull();
    expect(gridNode.nextSprite).toBeNull();
  });

  it("should initialize dupe as object with null horizontal and vertical attributes", function () {
    expect(gridNode.dupe).toEqual({ horizontal: null, vertical: null });
  });

  describe("enter", function () {
    it("should add sprite to grid node", function () {
      gridNode.enter(sprite);

      expect(gridNode.nextSprite).toBe(sprite);
    });

    it("should be able to add several sprites to grid node", function () {
      gridNode.enter(sprite);
      gridNode.enter(anotherSprite);

      expect(gridNode.nextSprite).toBe(anotherSprite);
      expect(gridNode.nextSprite.nextSprite).toBe(sprite);
    });
  });
  // leave: remove sprite from grid node
  // eachSprite: call the callback on every sprite in grid node
  // isEmpty: checks whether grid node contains any sprites with name in collidables
});
