describe("Sprite", function () {
  var sprite, keyStatus, canvasWidth, canvasHeight;

  beforeEach(function () {
    keyStatus = asteroids.KEY_STATUS;
    asteroids.KEY_STATUS = {};
    canvasWidth = asteroids.Game.canvasWidth;
    asteroids.Game.canvasWidth = 780;
    canvasHeight = asteroids.Game.canvasHeight;
    asteroids.Game.canvasHeight = 540;

    sprite = new asteroids.Sprite();
    sprite.context = { strokeRect: sinon.spy() };
    sprite.x = 0;
    sprite.y = 0;
    sprite.visible = true;

    var cn = new function () {
      this.north = this;
      this.south = this;
      this.east = this;
      this.west = this;
      this.isEmpty = sinon.stub().returns(true);
      this.enter = sinon.spy();
      this.leave = sinon.spy();
    }();
    sprite.grid = [[cn]];
  });

  afterEach(function () {
    asteroids.KEY_STATUS = keyStatus;
    asteroids.Game.canvasWidth = canvasWidth;
    asteroids.Game.canvasHeight = canvasHeight;
  });

  // init: sets name, points, vel and acc
  // children: {}
  // visible : false
  // reap    : false
  // bridgesH: true
  // bridgesV: true
  // collidesWith: []
  // x    : 0
  // y    : 0
  // rot  : 0
  // scale: 1
  // currentNode: null
  // nextSprite : null
  // preMove : null
  // postMove: null
  /* run:
   * call move with argument
   * call updateGrid
   * save and restore context
   * call configureTransform
   * call draw
   * call findCollisionCandidates
   * call matrix.configure with state attributes
   * call checkCollisionsAgainst with result from calling findCollisionCandidates
   * three different conditional blocks: (no else if or trailing else!)
   * - bridgesH, currentNode.dupe.horizontal -> x
   * - bridgesV, currentNode.dupe.vertical -> y
   * - both -> x and y
   */
  /* move:
   * Does nothing if not visible
   * sets transPoints to null
   * calls preMove iff defined
   * Update vel, pos and rot
   * calls postMove iff defined
   */
  /* updateGrid:
   * Updates currentNode if moving to new grid square
   * If grid is activated, displays the boundaries on context
   */
  describe("isClear", function () {
    it("should do nothing if not visible", function () {
      sprite.visible = false;

      sprite.updateGrid();

      sinon.assert.notCalled(sprite.grid[0][0].enter);
      sinon.assert.notCalled(sprite.grid[0][0].leave);
    });

    it("should update currentNode when previously undefined", function () {
      var prevCurrentNode = sprite.currentNode;

      sprite.updateGrid();

      expect(sprite.currentNode).not.toBe(prevCurrentNode);
    });

    it("should display boundaries on context when grid activated", function () {
      asteroids.KEY_STATUS.g = true;

      sprite.updateGrid();

      sinon.assert.called(sprite.context.strokeRect);
    });

    it("should restore lineWidth and strokeStyle of context after displaying boundaries", function () {
      asteroids.KEY_STATUS.g = true;
      sprite.context.lineWidth = 2.0;
      sprite.context.strokeStyle = "white";

      sprite.updateGrid();

      expect(sprite.context.lineWidth).toEqual(2.0);
      expect(sprite.context.strokeStyle).toEqual("white");
    });
  });

  // configureTransform: translates, rotates and scales if visible
  // draw: recursively draw children, connect points with lines
  // findCollisionCandidates: return first sprite from all adjacent nodes in grid
  // checkCollisionsAgainst: calls checkCollision with all candidates and their nextSprites
  // checkCollision: calls collision on self and other if transformed point is in path
  // pointInPolygon: returns true if point is within area defined by this.points
  // collision: empty function, extended by subclasses
  // die: visible set to false, re-appear (reap) to true, leave node in grid
  // transformedPoints: translates points and caches the result
  // isClear: returns whether adjacent grids contains sprites that this can collide with
  it("should define isClear method", function () {
    expect(typeof sprite.isClear).toEqual("function");
  });

  describe("isClear", function () {
    it("should return true when sprite collides with nothing", function () {
      expect(sprite.isClear()).toEqual(true);
    });

    it("should return true when nothing to collide with", function () {
      sprite.collidesWith = ["asteroid"];

      expect(sprite.isClear()).toEqual(true);
    });

    it("should return false when grid node not empty", function () {
      sprite.collidesWith = ["asteroid"];
      sprite.grid[0][0].isEmpty = sinon.stub().returns(false);

      expect(sprite.isClear()).toEqual(false);
    });
  });

  // wrapPostMove: Set x and y to wrap around canvas edges
  describe("wrapPostMove", function () {
    it("should set x to zero when exceeding canvasWidth", function () {
      sprite.x = asteroids.Game.canvasWidth + 1;

      sprite.wrapPostMove();

      expect(sprite.x).toEqual(0);
    });

    it("should not change x when not exceeding canvasWidth", function () {
      sprite.x = asteroids.Game.canvasWidth;

      sprite.wrapPostMove();

      expect(sprite.x).toEqual(asteroids.Game.canvasWidth);
    });
  });
});
