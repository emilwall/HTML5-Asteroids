describe("Ship", function () {
  beforeEach(function () {
    sinon.stub(asteroids, "Sprite").returns({ init: sinon.spy() });
    sinon.stub(asteroids.Ship.prototype, "init");
    sinon.stub(asteroids.Ship.prototype, "wrapPostMove");
    this.ship = new asteroids.Ship();
    this.ship.currentNode = this.ship.currentNode || {};
    this.ship.currentNode.leave = sinon.stub();
    sinon.stub(asteroids.Game, "explosionAt");
    this.gameLives = asteroids.Game.lives;
  });

  afterEach(function () {
    asteroids.Sprite.restore();
    asteroids.Ship.prototype.init.restore();
    asteroids.Ship.prototype.wrapPostMove.restore();
    asteroids.Game.explosionAt.restore();
    asteroids.Game.lives = this.gameLives;
  });

  it("should have collision method", function () {
    expect(typeof this.ship.collision).toBe("function");
  });

  describe("Collision", function () {
    it("should deduct lives left when colliding with asteroid", function () {
      var roid = { name: "asteroid", x: 0, y: 0 };
      asteroids.Game.lives = 3;

      this.ship.collision(roid);

      expect(asteroids.Game.lives).toBe(2);
    });
  });

  it("should have postMove method", function () {
    expect(typeof this.ship.postMove).toBe("function");
  });

  describe("postMove", function () {
    it("should call wrapPostMove", function () {
      this.ship.postMove();

      expect(asteroids.Ship.prototype.wrapPostMove.called).toBeTruthy();
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
      this.ship.acc = {};
      this.ship.vel = {};
      this.ship.rot = 0;
    });

    afterEach(function () {
      Math.random.restore();
      asteroids.KEY_STATUS = this.keyStatus;
    });

    it("should set rotation velocity to zero when no key is pressed", function () {
      this.ship.vel.rot = 5;

      this.ship.preMove(3);

      expect(this.ship.vel.rot).toBe(0);
    });

    it("should set rotation velocity to -6 when left key is pressed", function () {
      asteroids.KEY_STATUS.left = true;
      this.ship.vel.rot = 5;

      this.ship.preMove(3);

      expect(this.ship.vel.rot).toBe(-6);
    });

    it("should set rotation velocity to -6 when both left and right keys are pressed", function () {
      asteroids.KEY_STATUS.left = true;
      asteroids.KEY_STATUS.right = true;
      this.ship.vel.rot = 5;

      this.ship.preMove(3);

      expect(this.ship.vel.rot).toBe(-6);
    });

    it("should set rotation velocity to 6 when right key is pressed", function () {
      asteroids.KEY_STATUS.right = true;
      this.ship.vel.rot = 5;

      this.ship.preMove(3);

      expect(this.ship.vel.rot).toBe(6);
    });

    it("should set acceleration to zero and exhaust.visible to false when up key is not pressed", function () {
      this.ship.acc.x = 0.2;
      this.ship.acc.y = 0.3;
      this.ship.children.exhaust.visible = true;

      this.ship.preMove(3);

      expect(this.ship.acc.x).toBe(0);
      expect(this.ship.acc.y).toBe(0);
      expect(this.ship.children.exhaust.visible).toBeFalsy();
    });

    it("should set acc.x to 0 and acc.y to -0.5 when up key is pressed and no rotation", function () {
      this.ship.rot = 0;
      this.ship.acc.x = 0.2;
      this.ship.acc.y = 0.3;
      asteroids.KEY_STATUS.up = true;

      this.ship.preMove(3);

      expect(Math.abs(this.ship.acc.x)).toBeLessThan(0.0001);
      expect(this.ship.acc.y).toBe(-0.5);
    });

    it("should set acc.x to 0.5 and acc.y to 0 when up key is pressed and rotation is 90 degrees", function () {
      this.ship.rot = 90;
      this.ship.acc.x = 0.2;
      this.ship.acc.y = 0.3;
      asteroids.KEY_STATUS.up = true;

      this.ship.preMove(3);

      expect(this.ship.acc.x).toBe(0.5);
      expect(Math.abs(this.ship.acc.y)).toBeLessThan(0.0001);
    });

    it("should set acc.x to roughly the same non-negative value as acc.y when up key is pressed and rotation is 135 degrees", function () {
      this.ship.rot = 135;
      this.ship.acc.x = 0.2;
      this.ship.acc.y = 0.3;
      asteroids.KEY_STATUS.up = true;

      this.ship.preMove(3);

      expect(this.ship.acc.x).toBeGreaterThan(0.1);
      expect(Math.abs(this.ship.acc.y - this.ship.acc.x)).toBeLessThan(0.0001);
    });

    it("should set exhaust.visible to true when up key is pressed and Math.random returns number greater than 0.1", function () {
      asteroids.KEY_STATUS.up = true;
      Math.random.returns(0.2);

      this.ship.preMove(3);

      expect(this.ship.children.exhaust.visible).toBeTruthy();
    });

    it("should set exhaust.visible to true when up key is pressed and Math.random returns number greater than 0.1", function () {
      asteroids.KEY_STATUS.up = true;
      Math.random.returns(0.1);

      this.ship.preMove(3);

      expect(this.ship.children.exhaust.visible).toBeFalsy();
    });
  });
});
