describe("GridNode", function() {
  beforeEach(function () {
    this.gridNode = new asteroids.GridNode();
  });

  it("should have enter, leave, eachSprite and isEmpty methods", function() {
    expect(typeof this.gridNode.enter).toBe("function");
    expect(typeof this.gridNode.leave).toBe("function");
    expect(typeof this.gridNode.eachSprite).toBe("function");
    expect(typeof this.gridNode.isEmpty).toBe("function");
  });
  // Initialize north, south, east, west, nextSprite to null (or at least something not undefined)
  // Initialize dupe as object with null horizontal and vertical attributes
  // enter: add sprite to grid node
  // leave: remove sprite from grid node
  // eachSprite: call the callback on every sprite in grid node
  // isEmpty: checks whether grid node contains any sprites with name in collidables
});
