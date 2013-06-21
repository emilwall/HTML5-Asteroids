describe("BigAlien", function () {
  beforeEach(function () {
    this.spriteInit = sinon.spy();
    sinon.stub(asteroids, "Sprite").returns({ init: this.spriteInit });
    sinon.stub(asteroids.BigAlien.prototype, "init");
    sinon.stub(asteroids.BigAlien.prototype, "wrapPostMove");
    sinon.stub(Math, "random");
    this.gameCanvasWidth = asteroids.Game.canvasWidth;
    asteroids.Game.canvasWidth = 780;
    this.gameCanvasHeight = asteroids.Game.canvasHeight;
    asteroids.Game.canvasHeight = 540;
    this.bigAlien = new asteroids.BigAlien();
    this.bigAlien.vel = {};
  });

  afterEach(function () {
    asteroids.Sprite.restore();
    asteroids.BigAlien.prototype.init.restore();
    asteroids.BigAlien.prototype.wrapPostMove.restore();
    Math.random.restore();
    asteroids.Game.canvasWidth = this.gameCanvasWidth;
    asteroids.Game.canvasHeight = this.gameCanvasHeight
  });

  it("should have newPosition, setup, preMove, collision and postMove methods", function () {
    expect(typeof this.bigAlien.newPosition).toEqual("function");
    expect(typeof this.bigAlien.setup).toEqual("function");
    expect(typeof this.bigAlien.preMove).toEqual("function");
    expect(typeof this.bigAlien.collision).toEqual("function");
    expect(typeof this.bigAlien.postMove).toEqual("function");
  });

  it("should call asteroids.BigAlien.prototype.init in constructor", function () {
    expect(asteroids.BigAlien.prototype.init.called).toEqual(true);
  });

  it("should call init of object created using asteroids.Sprite with name bigalien_top", function () {
    expect(this.spriteInit.calledWith("bigalien_top")).toEqual(true);
  });

  it("should call init of object created using asteroids.Sprite with name bigalien_bottom", function () {
    expect(this.spriteInit.calledWith("bigalien_bottom")).toEqual(true);
  });

  describe("newPosition", function () {
    it("should set x-position to -20 when Math.random returns small number", function () {
      Math.random.returns(0);

      this.bigAlien.newPosition();

      expect(this.bigAlien.x).toEqual(-20);
    });

    it("should set horizontal velocity to 1.5 when Math.random returns small number", function () {
      Math.random.returns(0.4);

      this.bigAlien.newPosition();

      expect(this.bigAlien.vel.x).toEqual(1.5);
    });

    it("should set x-position to canvas width + 20 when Math.random returns large number", function () {
      Math.random.returns(1);

      this.bigAlien.newPosition();

      expect(this.bigAlien.x).toEqual(asteroids.Game.canvasWidth + 20);
    });

    it("should set horizontal velocity to -1.5 when Math.random returns large number", function () {
      Math.random.returns(0.6);

      this.bigAlien.newPosition();

      expect(this.bigAlien.vel.x).toEqual(-1.5);
    });

    it("should set y-position to a random value between zero and canvasHeight", function () {
      Math.random.returns(0.5);

      this.bigAlien.newPosition();

      expect(this.bigAlien.y).toEqual(Math.random() * asteroids.Game.canvasHeight);
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

      expect(this.bigAlien.newPosition.called).toEqual(true);
    });

    it("should add 3 bullets to this.bullets", function () {
      var numBullets = this.bigAlien.bullets.length;

      this.bigAlien.setup();

      expect(this.bigAlien.bullets.length).toEqual(numBullets + 3);
    });

    it("should add 3 bullets to asteroids.Game.sprites", function () {
      var numBullets = asteroids.Game.sprites.length;

      this.bigAlien.setup();

      expect(asteroids.Game.addSprite.calledThrice).toEqual(true);
    });
  });

  describe("preMove", function () {
    beforeEach(function () {
      var fakeNode = function () { this.east = this.west = this.nextSprite = this; };
      this.bigAlien.currentNode = new function () {
        this.north = new fakeNode();
        this.south = new fakeNode();
      }();
      this.bigAlien.vel = { x: 0, y: 0, rot: 0 };
      this.bigAlien.bulletCounter = 0;
      this.bigAlien.bullets = [{ visible: false, vel: {} }];
    });

    it("should not change velocity, bulletCounter or bullets when currentNode is null", function () {
      this.bigAlien.currentNode = null;

      this.bigAlien.preMove();

      expect(this.bigAlien.vel).toEqual({ x: 0, y: 0, rot: 0 });
      expect(this.bigAlien.bulletCounter).toEqual(0);
      expect(this.bigAlien.bullets[0].visible).toEqual(false);
    });

    it("should set vel.y to 1 when north grid contains sprites and south grid doesn't", function () {
      this.bigAlien.currentNode.south.nextSprite = null;

      this.bigAlien.preMove();

      expect(this.bigAlien.vel).toEqual({ x: 0, y: 1, rot: 0 });
    });

    it("should set vel.y to -1 when south grid contains sprites and north grid doesn't", function () {
      this.bigAlien.currentNode.north.nextSprite = null;

      this.bigAlien.preMove();

      expect(this.bigAlien.vel).toEqual({ x: 0, y: -1, rot: 0 });
    });

    it("should negate vel.y when both north and south grids contain sprites and Math.random returns number smaller than 0.01", function () {
      this.bigAlien.vel = { x: 0, y: 1, rot: 0 };
      Math.random.returns(0.005);

      this.bigAlien.preMove();

      expect(this.bigAlien.vel).toEqual({ x: 0, y: -1, rot: 0 });
    });

    it("should not change vel.y when both north and south grids contain sprites and Math.random returns 0.01 or greater", function () {
      this.bigAlien.vel = { x: 0, y: 1, rot: 0 };
      Math.random.returns(0.01);

      this.bigAlien.preMove();

      expect(this.bigAlien.vel).toEqual({ x: 0, y: 1, rot: 0 });
    });

    it("should subtract delta from this.bulletCounter", function () {
      this.bigAlien.bulletCounter = 7

      this.bigAlien.preMove(3);

      expect(this.bigAlien.bulletCounter).toEqual(4);
    });

    it("should set this.bulletCounter to 22 when this.bulletCounter - delta <= zero", function () {
      this.bigAlien.preMove(1);

      expect(this.bigAlien.bulletCounter).toEqual(22);
    });

    it("should set first hidden bullet to visible when this.bulletCounter - delta <= zero", function () {
      this.bigAlien.preMove(0);

      expect(this.bigAlien.bullets[0].visible).toEqual(true);
    });

    it("should set position of first hidden bullet when this.bulletCounter - delta <= zero", function () {
      this.bigAlien.x = 3;
      this.bigAlien.y = 5;

      this.bigAlien.preMove(0);

      expect(this.bigAlien.bullets[0].x).toBeGreaterThan(0);
      expect(this.bigAlien.bullets[0].y).toBeGreaterThan(0);
    });

    it("should set velocity of first hidden bullet using Math.random when this.bulletCounter - delta <= zero", function () {
      this.bigAlien.preMove(0);

      expect(Math.random.called).toEqual(true);
      expect(typeof this.bigAlien.bullets[0].vel.x).toEqual("number");
      expect(typeof this.bigAlien.bullets[0].vel.y).toEqual("number");
    });
  });

  describe("collision", function () {
    beforeEach(function () {
      sinon.stub(asteroids.Game, "explosionAt");
      this.bigAlien.newPosition = sinon.stub();
      this.gameScore = asteroids.Game.score;
      this.sprite = { name: "sprite" };
    });

    afterEach(function () {
      asteroids.Game.score = this.gameScore;
      asteroids.Game.explosionAt.restore();
    });

    it("should set visible to false", function () {
      this.bigAlien.visible = true;

      this.bigAlien.collision(this.sprite);

      expect(this.bigAlien.visible).toEqual(false);
    });

    it("should increase score by 200 when hit by bullet", function () {
      this.sprite.name = "bullet";
      asteroids.Game.score = 100;

      this.bigAlien.collision(this.sprite);

      expect(asteroids.Game.score).toEqual(300);
    });

    it("should not increase score when hit by asteroid", function () {
      this.sprite.name = "asteroid";
      asteroids.Game.score = 100;

      this.bigAlien.collision(this.sprite);

      expect(asteroids.Game.score).toEqual(100);
    });

    it("should call asteroids.Game.explosionAt", function () {
      this.bigAlien.collision(this.sprite);

      expect(asteroids.Game.explosionAt.called).toEqual(true);
    });

    it("should call asteroids.Game.explosionAt", function () {
      this.bigAlien.collision(this.sprite);

      expect(this.bigAlien.newPosition.called).toEqual(true);
    });
  });

  describe("postMove", function () {
    beforeEach(function () {
      this.bigAlien.newPosition = sinon.stub();
      this.bigAlien.x = -21;
      this.bigAlien.y = 0;
      this.bigAlien.vel.x = 1.5;
      this.bigAlien.vel.y = 1;
      this.bigAlien.visible = true;
    });

    it("should wrap around in vertical direction when above canvas", function () {
      this.bigAlien.y = -1;

      this.bigAlien.postMove();

      expect(this.bigAlien.y).toEqual(asteroids.Game.canvasHeight);
    });

    it("should wrap around in vertical direction when below canvas", function () {
      this.bigAlien.y = asteroids.Game.canvasHeight + 1;

      this.bigAlien.postMove();

      expect(this.bigAlien.y).toEqual(0);
    });

    it("should not wrap around in vertical direction when on canvas bottom border", function () {
      this.bigAlien.y = asteroids.Game.canvasHeight;

      this.bigAlien.postMove();

      expect(this.bigAlien.y).toEqual(asteroids.Game.canvasHeight);
    });

    it("should not hide and set new position when heading towards canvas from left", function () {
      this.bigAlien.postMove();

      expect(this.bigAlien.visible).toEqual(true);
      expect(this.bigAlien.newPosition.called).toEqual(false);
    });

    it("should hide and set new position when leaving canvas at left side", function () {
      this.bigAlien.vel.x *= -1;

      this.bigAlien.postMove();

      expect(this.bigAlien.visible).toEqual(false);
      expect(this.bigAlien.newPosition.called).toEqual(true);
    });

    it("should not hide and set new position when heading towards canvas from right", function () {
      this.bigAlien.x = asteroids.Game.canvasWidth + 21;
      this.bigAlien.vel.x *= -1;

      this.bigAlien.postMove();

      expect(this.bigAlien.visible).toEqual(true);
      expect(this.bigAlien.newPosition.called).toEqual(false);
    });

    it("should hide and set new position when leaving canvas at right side", function () {
      this.bigAlien.x = asteroids.Game.canvasWidth + 21;

      this.bigAlien.postMove();

      expect(this.bigAlien.visible).toEqual(false);
      expect(this.bigAlien.newPosition.called).toEqual(true);
    });
  });
});
