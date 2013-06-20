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
    expect(asteroids.BigAlien.prototype.init.called).toBe(true);
  });

  it("should call init of object created using asteroids.Sprite with name bigalien_top", function () {
    expect(this.spriteInit.calledWith("bigalien_top")).toBe(true);
  });

  it("should call init of object created using asteroids.Sprite with name bigalien_bottom", function () {
    expect(this.spriteInit.calledWith("bigalien_bottom")).toBe(true);
  });

  describe("newPosition", function () {
    beforeEach(function () {
      sinon.stub(Math, "random");
      this.gameCanvasWidth = asteroids.Game.canvasWidth;
      asteroids.Game.canvasWidth = 780;
      this.gameCanvasHeight = asteroids.Game.canvasHeight;
      asteroids.Game.canvasHeight = 540;
    });

    afterEach(function () {
      Math.random.restore();
      asteroids.Game.canvasWidth = this.gameCanvasWidth;
      asteroids.Game.canvasHeight = this.gameCanvasHeight
    });

    it("should set x-position to -20 when Math.random returns small number", function () {
      Math.random.returns(0);

      this.bigAlien.newPosition();

      expect(this.bigAlien.x).toBe(-20);
    });

    it("should set horizontal velocity to 1.5 when Math.random returns small number", function () {
      Math.random.returns(0.4);

      this.bigAlien.newPosition();

      expect(this.bigAlien.vel.x).toBe(1.5);
    });

    it("should set x-position to canvas width + 20 when Math.random returns large number", function () {
      Math.random.returns(1);

      this.bigAlien.newPosition();

      expect(this.bigAlien.x).toBe(asteroids.Game.canvasWidth + 20);
    });

    it("should set horizontal velocity to -1.5 when Math.random returns large number", function () {
      Math.random.returns(0.6);

      this.bigAlien.newPosition();

      expect(this.bigAlien.vel.x).toBe(-1.5);
    });

    it("should set y-position to a random value between zero and canvasHeight", function () {
      Math.random.returns(0.5);

      this.bigAlien.newPosition();

      expect(this.bigAlien.y).toBe(Math.random() * asteroids.Game.canvasHeight);
    });
  });

  describe("setup", function () {
    beforeEach(function () {
      asteroids.AlienBullet = asteroids.AlienBullet || function () { };
      sinon.stub(asteroids, "AlienBullet").returns({});
      sinon.stub(asteroids.Game, "addSprite");
      this.bigAlien.newPosition = sinon.stub();
    });

    afterEach(function () {
      asteroids.Game.addSprite.restore();
      asteroids.AlienBullet.restore();
    });

    it("should set position using newPosition", function () {
      this.bigAlien.setup();

      expect(this.bigAlien.newPosition.called).toBe(true);
    });

    it("should add 3 bullets to this.bullets", function () {
      var numBullets = this.bigAlien.bullets.length;

      this.bigAlien.setup();

      expect(this.bigAlien.bullets.length).toBe(numBullets + 3);
    });

    it("should add 3 bullets to asteroids.Game.sprites", function () {
      var numBullets = asteroids.Game.sprites.length;

      this.bigAlien.setup();

      expect(asteroids.Game.addSprite.calledThrice).toBe(true);
    });
  });

  describe("preMove", function () {
    beforeEach(function () {
      sinon.stub(Math, "random").returns(0.5);
      var fakeNode = function () { this.east = this.west = this.nextSprite = this; };
      this.bigAlien.currentNode = new function () {
        this.north = new fakeNode();
        this.south = new fakeNode();
      }();
      this.bigAlien.vel = {};
      this.bigAlien.bulletCounter = 0;
      this.bigAlien.bullets = [{ visible: false, vel: {} }];
    });

    afterEach(function () {
      Math.random.restore();
    });

    it("should not change velocity, bulletCounter or bullets when currentNode is null", function () {
      this.bigAlien.currentNode = null;

      this.bigAlien.preMove();

      expect(this.bigAlien.vel).toEqual({});
      expect(this.bigAlien.bulletCounter).toBe(0);
      expect(this.bigAlien.bullets[0].visible).toBe(false);
    });

    it("should set vel.y to 1 when north grid contains more sprites than south grid", function () {
      this.bigAlien.currentNode.south.nextSprite = null;

      this.bigAlien.preMove();

      expect(this.bigAlien.vel).toEqual({ y: 1 });
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
