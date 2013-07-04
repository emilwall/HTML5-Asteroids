describe("Sprite", function () {
  var sprite, keyStatus, canvasWidth, canvasHeight;

  beforeEach(function () {
    sinon.stub($, "isFunction").returns(true);

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
    $.isFunction.restore();
    asteroids.KEY_STATUS = keyStatus;
    asteroids.Game.canvasWidth = canvasWidth;
    asteroids.Game.canvasHeight = canvasHeight;
  });

  describe("init", function () {
    it("should set name, points, vel and acc", function () {
      sprite.init("name", [1, 2, 3]);

      expect(sprite.name).toEqual("name");
      expect(sprite.points).toEqual([1, 2, 3]);
    });

    it("should set vel and acc", function () {
      sprite.init();

      expect(sprite.vel).toBeDefined();
      expect(sprite.acc).toBeDefined();
    });
  });

  it("should set attributes to default values", function () {
    expect(sprite.children).toEqual({});
    // expect(sprite.visible).toEqual(false); // This fails due to beforeEach!
    expect(sprite.reap).toEqual(false);
    expect(sprite.bridgesH).toEqual(true);
    expect(sprite.bridgesV).toEqual(true);
    expect(sprite.collidesWith).toEqual([]);
    expect(sprite.x).toEqual(0);
    expect(sprite.y).toEqual(0);
    expect(sprite.rot).toEqual(0);
    expect(sprite.scale).toEqual(1);
    expect(sprite.currentNode).toBeNull();
    expect(sprite.nextSprite).toBeNull();
    expect(sprite.preMove).toBeNull();
    expect(sprite.postMove).toBeNull();
  });

  describe("run", function () {
    var checkCollisionsAgainstStub;

    beforeEach(function () {
      sprite.move = sinon.spy();
      sprite.updateGrid = sinon.spy();
      sprite.configureTransform = sinon.spy();
      sprite.draw = sinon.spy();
      sprite.findCollisionCandidates = sinon.stub().returns({ name: "fake" });
      sprite.context = { save: sinon.spy(), restore: sinon.spy() };
      sprite.matrix = { configure: sinon.spy() };
      sprite.checkCollisionsAgainst = sinon.spy();
      checkCollisionsAgainstStub = function f() {
        if (this.x === 780) {
          f.calledWithModifiedX = true;
        }
        if (this.y === 540) {
          f.calledWithModifiedY = true;
        }
      };
      checkCollisionsAgainstStub.calledWithModifiedX = false;
      checkCollisionsAgainstStub.calledWithModifiedY = false;
      sprite.currentNode = { dupe: { horizontal: 780, vertical: 540 } };
    });

    it("should call move with argument", function () {
      sprite.run("arg");

      sinon.assert.calledWith(sprite.move, "arg");
    });

    it("should call updateGrid", function () {
      sprite.run();

      sinon.assert.called(sprite.updateGrid);
    });

    it("should call configureTransform", function () {
      sprite.run();

      sinon.assert.called(sprite.configureTransform);
    });

    it("should call draw", function () {
      sprite.run();

      sinon.assert.called(sprite.draw);
    });

    it("should call findCollisionCandidates", function () {
      sprite.run();

      sinon.assert.called(sprite.findCollisionCandidates);
    });

    it("should checkCollisionsAgainst with result from calling findCollisionCandidates", function () {
      sprite.run();

      sinon.assert.calledWith(sprite.checkCollisionsAgainst, { name: "fake" });
    });

    it("should save and restore context", function () {
      sprite.run();

      sinon.assert.called(sprite.context.save);
      sinon.assert.called(sprite.context.restore);
    });

    it("should call matrix.configure with state attributes", function () {
      sprite.rot = 1;
      sprite.scale = 2;
      sprite.x = 3;
      sprite.y = 4;

      sprite.run();

      sinon.assert.calledWith(sprite.matrix.configure, 1, 2, 3, 4);
    });

    it("should check for collisions on duplicates", function () {
      sprite.checkCollisionsAgainst = checkCollisionsAgainstStub;

      sprite.run();

      expect(sprite.checkCollisionsAgainst.calledWithModifiedX).toEqual(true);
      expect(sprite.checkCollisionsAgainst.calledWithModifiedY).toEqual(true);
    });

    it("should not check for collisions on duplicates when no horizontal or vertical bridges", function () {
      sprite.bridgesH = false;
      sprite.bridgesV = false;
      sprite.checkCollisionsAgainst = checkCollisionsAgainstStub;

      sprite.run();

      expect(sprite.checkCollisionsAgainst.calledWithModifiedX).toEqual(false);
      expect(sprite.checkCollisionsAgainst.calledWithModifiedY).toEqual(false);
    });

    it("should not check for collisions on duplicates when not at grid border", function () {
      sprite.currentNode = { dupe: { horizontal: null, vertical: null } };
      sprite.checkCollisionsAgainst = checkCollisionsAgainstStub;

      sprite.run();

      expect(sprite.checkCollisionsAgainst.calledWithModifiedX).toEqual(false);
      expect(sprite.checkCollisionsAgainst.calledWithModifiedY).toEqual(false);
    });

    it("should check for collisions on vertical duplicates when at top or bottom of grid", function () {
      sprite.currentNode = { dupe: { horizontal: null, vertical: 540 } };
      sprite.checkCollisionsAgainst = checkCollisionsAgainstStub;

      sprite.run();

      expect(sprite.checkCollisionsAgainst.calledWithModifiedX).toEqual(false);
      expect(sprite.checkCollisionsAgainst.calledWithModifiedY).toEqual(true);
    });

    it("should check for collisions on horizontal duplicates when at left or right of grid", function () {
      sprite.currentNode = { dupe: { horizontal: 780, vertical: null } };
      sprite.checkCollisionsAgainst = checkCollisionsAgainstStub;

      sprite.run();

      expect(sprite.checkCollisionsAgainst.calledWithModifiedX).toEqual(true);
      expect(sprite.checkCollisionsAgainst.calledWithModifiedY).toEqual(false);
    });
  });

  describe("move", function () {
    beforeEach(function () {
      sprite.preMove = sinon.spy();
      sprite.postMove = sinon.spy();
      sprite.vel = { x: 0, y: 0 };
      sprite.acc = { x: 0, y: 0 };
    });

    it("should do nothing if not visible", function () {
      sprite.visible = false;

      sprite.move();

      sinon.assert.notCalled($.isFunction);
    });

    it("should clear transformed points cache", function () {
      sprite.move();

      expect(sprite.transPoints).toBeNull();
    });

    it("should call preMove when defined", function () {
      sprite.move();

      sinon.assert.called(sprite.preMove);
    });

    it("should not call preMove when not defined", function () {
      $.isFunction.returns(false);

      sprite.move();

      sinon.assert.notCalled(sprite.preMove);
    });

    it("should call postMove when defined", function () {
      sprite.move();

      sinon.assert.called(sprite.preMove);
    });

    it("should not call postMove when not defined", function () {
      $.isFunction.returns(false);

      sprite.move();

      sinon.assert.notCalled(sprite.preMove);
    });
  });

  // move: Update vel, pos and rot
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
