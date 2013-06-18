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
      this.keyStatus = asteroids.KEY_STATUS;
      asteroids.KEY_STATUS = { left: false, right: false, up: false, space: false };
      this.ship.acc = {};
      this.ship.vel = {};
    });

    afterEach(function () {
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
  });
});
