describe("Ship", function () {
  beforeEach(function () {
    sinon.stub(asteroids, "Sprite").returns({ init: sinon.spy() });
    sinon.stub(asteroids.Ship.prototype, "init");
    sinon.stub(asteroids.Ship.prototype, "wrapPostMove");
    sinon.stub(asteroids.Game, "explosionAt");
    this.ship = new asteroids.Ship();
    this.ship.currentNode = this.ship.currentNode || {};
    this.ship.currentNode.leave = sinon.stub();
    this.gameLives = asteroids.Game.lives;
    this.FSMstate = asteroids.Game.FSM.state;
  });

  afterEach(function () {
    asteroids.Sprite.restore();
    asteroids.Ship.prototype.init.restore();
    asteroids.Ship.prototype.wrapPostMove.restore();
    asteroids.Game.explosionAt.restore();
    asteroids.Game.lives = this.gameLives;
    asteroids.Game.FSM.state = this.FSMstate;
  });

  it("should have postMove method", function () {
    expect(typeof this.ship.postMove).toBe("function");
  });

  describe("postMove", function () {
    it("should call wrapPostMove", function () {
      this.ship.postMove();

      expect(asteroids.Ship.prototype.wrapPostMove.called).toBe(true);
    });

    it("should be wrapPostMove", function () {
      expect(this.ship.postMove).toBe(asteroids.Ship.prototype.wrapPostMove);
    });
  });

  it("should have preMove method", function () {
    expect(typeof this.ship.preMove).toBe("function");
  });

  describe("preMove", function () {
    beforeEach(function () {
      sinon.stub(Math, "random").returns(1.0);
      this.keyStatus = asteroids.KEY_STATUS;
      asteroids.KEY_STATUS = { left: false, right: false, up: false, space: false };
      this.ship.bullets = [{ vel: {}, visible: true}];
      for (var i = 0; i < 9; i++) {
        this.ship.bullets.push({ vel: {}, visible: false });
      }
      this.ship.acc = {};
      this.ship.vel = {};
      this.ship.rot = 0;
      this.ship.bulletCounter = 10;
    });

    afterEach(function () {
      Math.random.restore();
      asteroids.KEY_STATUS = this.keyStatus;
    });

    it("should set rotation velocity to zero when no key is pressed", function () {
      this.ship.vel.rot = 5;

      this.ship.preMove();

      expect(this.ship.vel.rot).toBe(0);
    });

    it("should set rotation velocity to -6 when left key is pressed", function () {
      asteroids.KEY_STATUS.left = true;
      this.ship.vel.rot = 5;

      this.ship.preMove();

      expect(this.ship.vel.rot).toBe(-6);
    });

    it("should set rotation velocity to -6 when both left and right keys are pressed", function () {
      asteroids.KEY_STATUS.left = true;
      asteroids.KEY_STATUS.right = true;
      this.ship.vel.rot = 5;

      this.ship.preMove();

      expect(this.ship.vel.rot).toBe(-6);
    });

    it("should set rotation velocity to 6 when right key is pressed", function () {
      asteroids.KEY_STATUS.right = true;
      this.ship.vel.rot = 5;

      this.ship.preMove();

      expect(this.ship.vel.rot).toBe(6);
    });

    it("should set acceleration to zero and exhaust.visible to false when up key is not pressed", function () {
      this.ship.acc.x = 0.2;
      this.ship.acc.y = 0.3;
      this.ship.children.exhaust.visible = true;

      this.ship.preMove();

      expect(this.ship.acc.x).toBe(0);
      expect(this.ship.acc.y).toBe(0);
      expect(this.ship.children.exhaust.visible).toBe(false);
    });

    it("should set acc.x to 0 and acc.y to -0.5 when up key is pressed and no rotation", function () {
      this.ship.rot = 0;
      this.ship.acc.x = 0.2;
      this.ship.acc.y = 0.3;
      asteroids.KEY_STATUS.up = true;

      this.ship.preMove();

      expect(Math.abs(this.ship.acc.x)).toBeLessThan(0.0001);
      expect(this.ship.acc.y).toBe(-0.5);
    });

    it("should set acc.x to 0.5 and acc.y to 0 when up key is pressed and rotation is 90 degrees", function () {
      this.ship.rot = 90;
      this.ship.acc.x = 0.2;
      this.ship.acc.y = 0.3;
      asteroids.KEY_STATUS.up = true;

      this.ship.preMove();

      expect(this.ship.acc.x).toBe(0.5);
      expect(Math.abs(this.ship.acc.y)).toBeLessThan(0.0001);
    });

    it("should set acc.x to roughly the same non-negative value as acc.y when up key is pressed and rotation is 135 degrees", function () {
      this.ship.rot = 135;
      this.ship.acc.x = 0.2;
      this.ship.acc.y = 0.3;
      asteroids.KEY_STATUS.up = true;

      this.ship.preMove();

      expect(this.ship.acc.x).toBeGreaterThan(0.1);
      expect(Math.abs(this.ship.acc.y - this.ship.acc.x)).toBeLessThan(0.0001);
    });

    it("should set exhaust.visible to true when up key is pressed and Math.random returns number greater than 0.1", function () {
      asteroids.KEY_STATUS.up = true;
      Math.random.returns(0.2);

      this.ship.preMove();

      expect(this.ship.children.exhaust.visible).toBe(true);
    });

    it("should set exhaust.visible to true when up key is pressed and Math.random returns number greater than 0.1", function () {
      asteroids.KEY_STATUS.up = true;
      Math.random.returns(0.1);

      this.ship.preMove();

      expect(this.ship.children.exhaust.visible).toBe(false);
    });

    it("should set first hidden bullet to visible when space pressed and bulletcounter minus delta is 0", function () {
      asteroids.KEY_STATUS.space = true;

      this.ship.preMove(10);

      expect(this.ship.bullets[1].visible).toBe(true);
    });

    it("should not set first hidden bullet to visible when space is not pressed", function () {
      this.ship.preMove(10);

      expect(this.ship.bullets[1].visible).toBe(false);
    });

    it("should not set first hidden bullet to visible when bulletcounter minus delta is greater than 0", function () {
      asteroids.KEY_STATUS.space = true;

      this.ship.preMove(9);

      expect(this.ship.bullets[1].visible).toBe(false);
    });

    it("should set position and velocity of first hidden bullet to visible when space pressed and bulletcounter minus delta is 0", function () {
      this.ship.x = 10;
      this.ship.y = 10;
      this.ship.vel.x = 10;
      this.ship.vel.y = 10;
      asteroids.KEY_STATUS.space = true;

      this.ship.preMove(10);

      expect(this.ship.bullets[1].x).toBeGreaterThan(0);
      expect(this.ship.bullets[1].y).toBeGreaterThan(0);
      expect(this.ship.bullets[1].vel.x).toBeGreaterThan(0);
      expect(this.ship.bullets[1].vel.y).toBeGreaterThan(0);
    });

    it("should reduce speed of ship when going too fast", function () {
      this.ship.vel.x = 10;
      this.ship.vel.y = 10;

      this.ship.preMove();

      expect(this.ship.vel.x).toBeLessThan(10);
      expect(this.ship.vel.y).toBeLessThan(10);
    });

    it("should not reduce speed of ship when going slow", function () {
      this.ship.vel.x = 2;
      this.ship.vel.y = 2;

      this.ship.preMove();

      expect(this.ship.vel.x).toBe(2);
      expect(this.ship.vel.y).toBe(2);
    });
  });

  it("should have collision method", function () {
    expect(typeof this.ship.collision).toBe("function");
  });

  describe("Collision", function () {
    beforeEach(function () {
      this.other = { x: 0, y: 0 };
    });

    it("should deduct lives left", function () {
      asteroids.Game.lives = 3;

      this.ship.collision(this.other);

      expect(asteroids.Game.lives).toBe(2);
    });

    it("should call asteroids.Game.explosionAt", function () {
      this.ship.collision(this.other);

      expect(asteroids.Game.explosionAt.called).toBe(true);
    });

    it("should set state of asteroids.Game.FSM to player_died", function () {
      this.ship.collision(this.other);

      expect(asteroids.Game.FSM.state).toBe("player_died");
    });

    it("should leave grid node and set it to null", function () {
      var gridNode = this.ship.currentNode;

      this.ship.collision(this.other);

      expect(gridNode.leave.called).toBe(true);
      expect(this.ship.currentNode).toBeNull();
    });

    it("should set visibility of ship to false", function () {
      this.ship.visible = true;

      this.ship.collision(this.other);

      expect(this.ship.visible).toBe(false);
    });
  });
});
