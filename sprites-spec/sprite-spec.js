describe("Sprite", function() {
  beforeEach(function () {
    this.sprite = new Sprite();
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
    beforeEach(function () {
      this.g = asteroids.KEY_STATUS.g;

      this.context = this.sprite.context;
      this.sprite.context = { strokeRect: sinon.spy() };

      this.grid = this.sprite.grid;
      this.sprite.grid = [[{ enter: sinon.spy(), leave: sinon.spy() }]];

      this.sprite.x = 0;
      this.sprite.y = 0;
      this.sprite.visible = true;
    });

    afterEach(function () {
      this.sprite.grid = this.grid;
      asteroids.KEY_STATUS.g = this.g;
      this.sprite.context = this.context;
    });

    it("should do nothing if not visible", function () {
      this.sprite.visible = false;

      this.sprite.updateGrid();

      sinon.assert.notCalled(this.sprite.grid[0][0].enter);
      sinon.assert.notCalled(this.sprite.grid[0][0].leave);
    });

    it("should update currentNode when previously undefined", function () {
      var prevCurrentNode = this.sprite.currentNode;

      this.sprite.updateGrid();

      expect(this.sprite.currentNode).not.toBe(prevCurrentNode);
    });

    it("should display boundaries on context when grid activated", function () {
      asteroids.KEY_STATUS.g = true;

      this.sprite.updateGrid();

      sinon.assert.called(this.sprite.context.strokeRect);
    });

    it("should restore lineWidth and strokeStyle of context after displaying boundaries", function () {
      asteroids.KEY_STATUS.g = true;
      this.sprite.context.lineWidth = 2.0;
      this.sprite.context.strokeStyle = "white";

      this.sprite.updateGrid();

      expect(this.sprite.context.lineWidth).toBe(2.0);
      expect(this.sprite.context.strokeStyle).toBe("white");
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
    expect(typeof this.sprite.isClear).toBe("function");
  });
  
  describe("isClear", function () {
    beforeEach(function () {
      this.grid = this.sprite.grid;

      var cn = new function () {
        this.north = this;
        this.south = this;
        this.east  = this;
        this.west  = this;
        this.isEmpty = sinon.stub().returns(true);
      }
      this.sprite.grid = [[cn]];

      this.sprite.x = 0;
      this.sprite.y = 0;
    });

    afterEach(function () {
      this.sprite.grid = this.grid;
    });

    it("should return true when sprite collides with nothing", function () {
      expect(this.sprite.isClear()).toBe(true);
    });

    it("should return true when nothing to collide with", function () {
      this.sprite.collidesWith = ["asteroid"];

      expect(this.sprite.isClear()).toBe(true);
    });

    it("should return false when grid node not empty", function () {
      this.sprite.collidesWith = ["asteroid"];
      this.sprite.grid[0][0].isEmpty = sinon.stub().returns(false);

      expect(this.sprite.isClear()).toBe(false);
    });
  });

  // wrapPostMove: Set x and y to wrap around canvas edges
});
