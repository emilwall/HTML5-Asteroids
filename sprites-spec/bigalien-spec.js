describe("BigAlien", function () {
  beforeEach(function () {
    this.spriteInit = sinon.spy();
    sinon.stub(asteroids, "Sprite").returns({ init: this.spriteInit });
    sinon.stub(asteroids.BigAlien.prototype, "init");
    sinon.stub(asteroids.BigAlien.prototype, "wrapPostMove");
    this.bigAlien = new asteroids.BigAlien();
    this.bigAlien.vel = {};
  });

  afterEach(function () {
    asteroids.Sprite.restore();
    asteroids.BigAlien.prototype.init.restore();
    asteroids.BigAlien.prototype.wrapPostMove.restore();
  });

  it("should have newPosition, setup, preMove, collision and postMove methods", function () {
    expect(typeof this.bigAlien.newPosition).toBe("function");
    expect(typeof this.bigAlien.setup).toBe("function");
    expect(typeof this.bigAlien.preMove).toBe("function");
    expect(typeof this.bigAlien.collision).toBe("function");
    expect(typeof this.bigAlien.postMove).toBe("function");
  });

  it("should call asteroids.BigAlien.prototype.init in constructor", function () {
    expect(asteroids.BigAlien.prototype.init.called).toBeTruthy();
  });

  it("should call init of object created using asteroids.Sprite with name bigalien_top", function () {
    expect(this.spriteInit.calledWith("bigalien_top")).toBeTruthy();
  });

  it("should call init of object created using asteroids.Sprite with name bigalien_bottom", function () {
    expect(this.spriteInit.calledWith("bigalien_bottom")).toBeTruthy();
  });

  describe("setup", function () {
    beforeEach(function () {
      asteroids.AlienBullet = asteroids.AlienBullet || function () { };
      sinon.stub(asteroids, "AlienBullet").returns({});
      sinon.stub(asteroids.Game, "addSprite");
    });

    afterEach(function () {
      asteroids.Game.addSprite.restore();
      asteroids.AlienBullet.restore();
    });

    it("should set position", function () {
      this.bigAlien.x = null;
      this.bigAlien.y = null;

      this.bigAlien.setup();

      expect(typeof this.bigAlien.x).toBe("number");
      expect(typeof this.bigAlien.y).toBe("number");
    });

    it("should add 3 bullets to this.bullets", function () {
      var numBullets = this.bigAlien.bullets.length;

      this.bigAlien.setup();

      expect(this.bigAlien.bullets.length).toBe(numBullets + 3);
    });

    it("should add 3 bullets to asteroids.Game.sprites", function () {
      var numBullets = asteroids.Game.sprites.length;

      this.bigAlien.setup();

      expect(asteroids.Game.addSprite.calledThrice).toBeTruthy();
    });
  });

  describe("collision", function () {
    beforeEach(function () {
      sinon.stub(asteroids.Game, "explosionAt");
    });

    afterEach(function () {
      asteroids.Game.explosionAt.restore();
    });

    it("should set visible to false when hit by bullet", function () {
      var bullet = { name: "bullet" };
      this.bigAlien.visible = true;

      this.bigAlien.collision(bullet);

      expect(this.bigAlien.visible).toBe(false);
    });

    it("should increase score by 200 when hit by bullet", function () {
      var bullet = { name: "bullet" };
      asteroids.Game.score = 100;

      this.bigAlien.collision(bullet);

      expect(asteroids.Game.score).toBe(300);
    });
  });
});
