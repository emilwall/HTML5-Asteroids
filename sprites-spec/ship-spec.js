describe("Ship", function () {
  var ship, gameLives, FSMstate, keyStatus;

  beforeEach(function () {
    sinon.stub(asteroids, "Sprite").returns({ init: sinon.spy() });
    sinon.stub(asteroids.Ship.prototype, "init");
    sinon.stub(asteroids.Ship.prototype, "wrapPostMove");
    sinon.stub(asteroids.Game, "explosionAt");
    sinon.stub(Math, "random").returns(1.0);
    keyStatus = asteroids.KEY_STATUS;
    asteroids.KEY_STATUS = { left: false, right: false, up: false, space: false };
    ship = new asteroids.Ship();
    ship.currentNode = ship.currentNode || {};
    ship.currentNode.leave = sinon.stub();
    gameLives = asteroids.Game.lives;
    FSMstate = asteroids.Game.FSM.state;
  });

  afterEach(function () {
    asteroids.Sprite.restore();
    asteroids.Ship.prototype.init.restore();
    asteroids.Ship.prototype.wrapPostMove.restore();
    asteroids.Game.explosionAt.restore();
    Math.random.restore();
    asteroids.KEY_STATUS = keyStatus;
    asteroids.Game.lives = gameLives;
    asteroids.Game.FSM.state = FSMstate;
  });

  it("should have postMove method", function () {
    expect(typeof ship.postMove).toEqual("function");
  });

  describe("postMove", function () {
    it("should call wrapPostMove", function () {
      ship.postMove();

      expect(asteroids.Ship.prototype.wrapPostMove.called).toEqual(true);
    });

    it("should be wrapPostMove", function () {
      expect(ship.postMove).toBe(asteroids.Ship.prototype.wrapPostMove);
    });
  });

  it("should have preMove method", function () {
    expect(typeof ship.preMove).toEqual("function");
  });

  describe("preMove", function () {
    beforeEach(function () {
      ship.bullets = [{ vel: {}, visible: true}];
      for (var i = 0; i < 9; i++) {
        ship.bullets.push({ vel: {}, visible: false });
      }
      ship.acc = {};
      ship.vel = {};
      ship.rot = 0;
      ship.bulletCounter = 10;
    });

    it("should set rotation velocity to zero when no key is pressed", function () {
      ship.vel.rot = 5;

      ship.preMove();

      expect(ship.vel.rot).toEqual(0);
    });

    it("should set rotation velocity to -6 when left key is pressed", function () {
      asteroids.KEY_STATUS.left = true;
      ship.vel.rot = 5;

      ship.preMove();

      expect(ship.vel.rot).toEqual(-6);
    });

    it("should set rotation velocity to -6 when both left and right keys are pressed", function () {
      asteroids.KEY_STATUS.left = true;
      asteroids.KEY_STATUS.right = true;
      ship.vel.rot = 5;

      ship.preMove();

      expect(ship.vel.rot).toEqual(-6);
    });

    it("should set rotation velocity to 6 when right key is pressed", function () {
      asteroids.KEY_STATUS.right = true;
      ship.vel.rot = 5;

      ship.preMove();

      expect(ship.vel.rot).toEqual(6);
    });

    it("should set acceleration to zero and exhaust.visible to false when up key is not pressed", function () {
      ship.acc.x = 0.2;
      ship.acc.y = 0.3;
      ship.children.exhaust.visible = true;

      ship.preMove();

      expect(ship.acc.x).toEqual(0);
      expect(ship.acc.y).toEqual(0);
      expect(ship.children.exhaust.visible).toEqual(false);
    });

    it("should set acc.x to 0 and acc.y to -0.5 when up key is pressed and no rotation", function () {
      ship.rot = 0;
      ship.acc.x = 0.2;
      ship.acc.y = 0.3;
      asteroids.KEY_STATUS.up = true;

      ship.preMove();

      expect(ship.acc.x).toBeCloseTo(0, 10);
      expect(ship.acc.y).toEqual(-0.5);
    });

    it("should set acc.x to 0.5 and acc.y to 0 when up key is pressed and rotation is 90 degrees", function () {
      ship.rot = 90;
      ship.acc.x = 0.2;
      ship.acc.y = 0.3;
      asteroids.KEY_STATUS.up = true;

      ship.preMove();

      expect(ship.acc.x).toEqual(0.5);
      expect(ship.acc.y).toBeCloseTo(0, 10);
    });

    it("should set acc.x to roughly the same non-negative value as acc.y when up key is pressed and rotation is 135 degrees", function () {
      ship.rot = 135;
      ship.acc.x = 0.2;
      ship.acc.y = 0.3;
      asteroids.KEY_STATUS.up = true;

      ship.preMove();

      expect(ship.acc.x).toBeGreaterThan(0.1);
      expect(ship.acc.y).toBeCloseTo(ship.acc.x, 10);
    });

    it("should set exhaust.visible to true when up key is pressed and Math.random returns number greater than 0.1", function () {
      asteroids.KEY_STATUS.up = true;
      Math.random.returns(0.2);

      ship.preMove();

      expect(ship.children.exhaust.visible).toEqual(true);
    });

    it("should set exhaust.visible to true when up key is pressed and Math.random returns number greater than 0.1", function () {
      asteroids.KEY_STATUS.up = true;
      Math.random.returns(0.1);

      ship.preMove();

      expect(ship.children.exhaust.visible).toEqual(false);
    });

    it("should set first hidden bullet to visible when space pressed and bulletcounter minus delta is 0", function () {
      asteroids.KEY_STATUS.space = true;

      ship.preMove(10);

      expect(ship.bullets[1].visible).toEqual(true);
    });

    it("should not set first hidden bullet to visible when space is not pressed", function () {
      ship.preMove(10);

      expect(ship.bullets[1].visible).toEqual(false);
    });

    it("should not set first hidden bullet to visible when bulletcounter minus delta is greater than 0", function () {
      asteroids.KEY_STATUS.space = true;

      ship.preMove(9);

      expect(ship.bullets[1].visible).toEqual(false);
    });

    it("should set position and velocity of first hidden bullet to visible when space pressed and bulletcounter minus delta is 0", function () {
      ship.x = 10;
      ship.y = 10;
      ship.vel.x = 10;
      ship.vel.y = 10;
      asteroids.KEY_STATUS.space = true;

      ship.preMove(10);

      expect(ship.bullets[1].x).toBeGreaterThan(0);
      expect(ship.bullets[1].y).toBeGreaterThan(0);
      expect(ship.bullets[1].vel.x).toBeGreaterThan(0);
      expect(ship.bullets[1].vel.y).toBeGreaterThan(0);
    });

    it("should reduce speed of ship when going too fast", function () {
      ship.vel.x = 10;
      ship.vel.y = 10;

      ship.preMove();

      expect(ship.vel.x).toBeLessThan(10);
      expect(ship.vel.y).toBeLessThan(10);
    });

    it("should not reduce speed of ship when going slow", function () {
      ship.vel.x = 2;
      ship.vel.y = 2;

      ship.preMove();

      expect(ship.vel.x).toEqual(2);
      expect(ship.vel.y).toEqual(2);
    });
  });

  it("should have collision method", function () {
    expect(typeof ship.collision).toEqual("function");
  });

  describe("Collision", function () {
    var other;

    beforeEach(function () {
      other = { x: 0, y: 0 };
    });

    it("should deduct lives left", function () {
      asteroids.Game.lives = 3;

      ship.collision(other);

      expect(asteroids.Game.lives).toEqual(2);
    });

    it("should call asteroids.Game.explosionAt", function () {
      ship.collision(other);

      expect(asteroids.Game.explosionAt.called).toEqual(true);
    });

    it("should set state of asteroids.Game.FSM to player_died", function () {
      ship.collision(other);

      expect(asteroids.Game.FSM.state).toEqual("player_died");
    });

    it("should leave grid node and set it to null", function () {
      var gridNode = ship.currentNode;

      ship.collision(other);

      expect(gridNode.leave.called).toEqual(true);
      expect(ship.currentNode).toBeNull();
    });

    it("should set visibility of ship to false", function () {
      ship.visible = true;

      ship.collision(other);

      expect(ship.visible).toEqual(false);
    });
  });
});
