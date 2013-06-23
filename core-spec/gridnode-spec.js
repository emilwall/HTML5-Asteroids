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

  describe("leave", function () {
    it("should remove sprite from grid node", function () {
      gridNode.nextSprite = sprite;

      gridNode.leave(sprite);

      expect(gridNode.nextSprite).toBeNull();
    });

    it("should be able to remove sprite when several sprites in grid node", function () {
      sprite.nextSprite = anotherSprite;
      gridNode.nextSprite = sprite;

      gridNode.leave(sprite);

      expect(gridNode.nextSprite).toBe(anotherSprite);
      expect(anotherSprite.nextSprite).toBeNull();
      expect(sprite.nextSprite).toBeNull();
    });
  });

  describe("eachSprite", function () {
    it("should call the callback once for every sprite in grid node", function () {
      var callback = sinon.spy();
      sprite.nextSprite = anotherSprite;
      gridNode.nextSprite = sprite;

      gridNode.eachSprite(null, callback);

      expect(callback.callCount).toEqual(2);
    });

    it("should not call the callback when no sprite in grid node", function () {
      var callback = sinon.spy();

      gridNode.eachSprite(null, callback);

      expect(callback.called).toEqual(false);
    });

    it("should call the callback with the supplied object as this", function () {
      var callback = function (sprite) { this.sprites.push(sprite) },
          object = { sprites: [] };
      sprite.nextSprite = anotherSprite;
      gridNode.nextSprite = sprite;

      gridNode.eachSprite(object, callback);

      expect(object.sprites).toContain(sprite);
      expect(object.sprites).toContain(anotherSprite);
    });
  });
  // eachSprite: call the callback on every sprite in grid node
  // isEmpty: checks whether grid node contains any sprites with name in collidables
});
