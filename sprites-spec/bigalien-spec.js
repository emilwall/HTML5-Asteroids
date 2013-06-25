describe("BigAlien", function () {
  var spriteInit, gameCanvasWidth, gameCanvasHeight, bigAlien;

  beforeEach(function () {
    spriteInit = sinon.spy();
    sinon.stub(asteroids, "Sprite").returns({ init: spriteInit });
    sinon.stub(asteroids.BigAlien.prototype, "init");
    sinon.stub(asteroids.BigAlien.prototype, "wrapPostMove");
    sinon.stub(Math, "random");
    gameCanvasWidth = asteroids.Game.canvasWidth;
    asteroids.Game.canvasWidth = 780;
    gameCanvasHeight = asteroids.Game.canvasHeight;
    asteroids.Game.canvasHeight = 540;
    bigAlien = new asteroids.BigAlien();
    bigAlien.vel = {};
  });

  afterEach(function () {
    asteroids.Sprite.restore();
    asteroids.BigAlien.prototype.init.restore();
    asteroids.BigAlien.prototype.wrapPostMove.restore();
    Math.random.restore();
    asteroids.Game.canvasWidth = gameCanvasWidth;
    asteroids.Game.canvasHeight = gameCanvasHeight
  });

  it("should have newPosition, setup, preMove, collision and postMove methods", function () {
    expect(typeof bigAlien.newPosition).toEqual("function");
    expect(typeof bigAlien.setup).toEqual("function");
    expect(typeof bigAlien.preMove).toEqual("function");
    expect(typeof bigAlien.collision).toEqual("function");
    expect(typeof bigAlien.postMove).toEqual("function");
  });

  it("should call asteroids.BigAlien.prototype.init in constructor", function () {
    sinon.assert.called(asteroids.BigAlien.prototype.init);
  });

  it("should call init of object created using asteroids.Sprite with name bigalien_top", function () {
    expect(spriteInit.calledWith("bigalien_top")).toEqual(true);
  });

  it("should call init of object created using asteroids.Sprite with name bigalien_bottom", function () {
    expect(spriteInit.calledWith("bigalien_bottom")).toEqual(true);
  });

  describe("newPosition", function () {
    it("should set x-position to -20 when Math.random returns small number", function () {
      Math.random.returns(0);

      bigAlien.newPosition();

      expect(bigAlien.x).toEqual(-20);
    });

    it("should set horizontal velocity to 1.5 when Math.random returns small number", function () {
      Math.random.returns(0.4);

      bigAlien.newPosition();

      expect(bigAlien.vel.x).toEqual(1.5);
    });

    it("should set x-position to canvas width + 20 when Math.random returns large number", function () {
      Math.random.returns(1);

      bigAlien.newPosition();

      expect(bigAlien.x).toEqual(asteroids.Game.canvasWidth + 20);
    });

    it("should set horizontal velocity to -1.5 when Math.random returns large number", function () {
      Math.random.returns(0.6);

      bigAlien.newPosition();

      expect(bigAlien.vel.x).toEqual(-1.5);
    });

    it("should set y-position to a random value between zero and canvasHeight", function () {
      Math.random.returns(0.5);

      bigAlien.newPosition();

      expect(bigAlien.y).toEqual(Math.random() * asteroids.Game.canvasHeight);
    });
  });

  describe("setup", function () {
    beforeEach(function () {
      asteroids.AlienBullet = asteroids.AlienBullet || function () { };
      sinon.stub(asteroids, "AlienBullet").returns({});
      sinon.stub(asteroids.Game, "addSprite");
      bigAlien.newPosition = sinon.stub();
    });

    afterEach(function () {
      asteroids.Game.addSprite.restore();
      asteroids.AlienBullet.restore();
    });

    it("should set position using newPosition", function () {
      bigAlien.setup();

      sinon.assert.called(bigAlien.newPosition);
    });

    it("should add 3 bullets to this.bullets", function () {
      var numBullets = bigAlien.bullets.length;

      bigAlien.setup();

      expect(bigAlien.bullets.length).toEqual(numBullets + 3);
    });

    it("should add 3 bullets to asteroids.Game.sprites", function () {
      var numBullets = asteroids.Game.sprites.length;

      bigAlien.setup();

      expect(asteroids.Game.addSprite.calledThrice).toEqual(true);
    });
  });

  describe("preMove", function () {
    beforeEach(function () {
      var fakeNode = function () { this.east = this.west = this.nextSprite = this; };
      bigAlien.currentNode = new function () {
        this.north = new fakeNode();
        this.south = new fakeNode();
      }();
      bigAlien.vel = { x: 0, y: 0, rot: 0 };
      bigAlien.bulletCounter = 0;
      bigAlien.bullets = [{ visible: false, vel: {} }];
    });

    it("should not change velocity, bulletCounter or bullets when currentNode is null", function () {
      bigAlien.currentNode = null;

      bigAlien.preMove();

      expect(bigAlien.vel).toEqual({ x: 0, y: 0, rot: 0 });
      expect(bigAlien.bulletCounter).toEqual(0);
      expect(bigAlien.bullets[0].visible).toEqual(false);
    });

    it("should set vel.y to 1 when north grid contains sprites and south grid doesn't", function () {
      bigAlien.currentNode.south.nextSprite = null;

      bigAlien.preMove();

      expect(bigAlien.vel).toEqual({ x: 0, y: 1, rot: 0 });
    });

    it("should set vel.y to -1 when south grid contains sprites and north grid doesn't", function () {
      bigAlien.currentNode.north.nextSprite = null;

      bigAlien.preMove();

      expect(bigAlien.vel).toEqual({ x: 0, y: -1, rot: 0 });
    });

    it("should negate vel.y when both north and south grids contain sprites and Math.random returns number smaller than 0.01", function () {
      bigAlien.vel = { x: 0, y: 1, rot: 0 };
      Math.random.returns(0.005);

      bigAlien.preMove();

      expect(bigAlien.vel).toEqual({ x: 0, y: -1, rot: 0 });
    });

    it("should not change vel.y when both north and south grids contain sprites and Math.random returns 0.01 or greater", function () {
      bigAlien.vel = { x: 0, y: 1, rot: 0 };
      Math.random.returns(0.01);

      bigAlien.preMove();

      expect(bigAlien.vel).toEqual({ x: 0, y: 1, rot: 0 });
    });

    it("should subtract delta from this.bulletCounter", function () {
      bigAlien.bulletCounter = 7

      bigAlien.preMove(3);

      expect(bigAlien.bulletCounter).toEqual(4);
    });

    it("should set this.bulletCounter to 22 when this.bulletCounter - delta <= zero", function () {
      bigAlien.preMove(1);

      expect(bigAlien.bulletCounter).toEqual(22);
    });

    it("should set first hidden bullet to visible when this.bulletCounter - delta <= zero", function () {
      bigAlien.preMove(0);

      expect(bigAlien.bullets[0].visible).toEqual(true);
    });

    it("should set position of first hidden bullet when this.bulletCounter - delta <= zero", function () {
      bigAlien.x = 3;
      bigAlien.y = 5;

      bigAlien.preMove(0);

      expect(bigAlien.bullets[0].x).toBeGreaterThan(0);
      expect(bigAlien.bullets[0].y).toBeGreaterThan(0);
    });

    it("should set velocity of first hidden bullet using Math.random when this.bulletCounter - delta <= zero", function () {
      bigAlien.preMove(0);

      sinon.assert.called(Math.random);
      expect(typeof bigAlien.bullets[0].vel.x).toEqual("number");
      expect(typeof bigAlien.bullets[0].vel.y).toEqual("number");
    });
  });

  describe("collision", function () {
    var gameScore, other;

    beforeEach(function () {
      sinon.stub(asteroids.Game, "explosionAt");
      bigAlien.newPosition = sinon.stub();
      gameScore = asteroids.Game.score;
      other = { name: "sprite" };
    });

    afterEach(function () {
      asteroids.Game.score = gameScore;
      asteroids.Game.explosionAt.restore();
    });

    it("should set visible to false", function () {
      bigAlien.visible = true;

      bigAlien.collision(other);

      expect(bigAlien.visible).toEqual(false);
    });

    it("should increase score by 200 when hit by bullet", function () {
      other.name = "bullet";
      asteroids.Game.score = 100;

      bigAlien.collision(other);

      expect(asteroids.Game.score).toEqual(300);
    });

    it("should not increase score when hit by asteroid", function () {
      other.name = "asteroid";
      asteroids.Game.score = 100;

      bigAlien.collision(other);

      expect(asteroids.Game.score).toEqual(100);
    });

    it("should call asteroids.Game.explosionAt", function () {
      bigAlien.collision(other);

      sinon.assert.called(asteroids.Game.explosionAt);
    });

    it("should call asteroids.Game.explosionAt", function () {
      bigAlien.collision(other);

      sinon.assert.called(bigAlien.newPosition);
    });
  });

  describe("postMove", function () {
    beforeEach(function () {
      bigAlien.newPosition = sinon.stub();
      bigAlien.x = -21;
      bigAlien.y = 0;
      bigAlien.vel.x = 1.5;
      bigAlien.vel.y = 1;
      bigAlien.visible = true;
    });

    it("should wrap around in vertical direction when above canvas", function () {
      bigAlien.y = -1;

      bigAlien.postMove();

      expect(bigAlien.y).toEqual(asteroids.Game.canvasHeight);
    });

    it("should wrap around in vertical direction when below canvas", function () {
      bigAlien.y = asteroids.Game.canvasHeight + 1;

      bigAlien.postMove();

      expect(bigAlien.y).toEqual(0);
    });

    it("should not wrap around in vertical direction when on canvas bottom border", function () {
      bigAlien.y = asteroids.Game.canvasHeight;

      bigAlien.postMove();

      expect(bigAlien.y).toEqual(asteroids.Game.canvasHeight);
    });

    it("should not hide and set new position when heading towards canvas from left", function () {
      bigAlien.postMove();

      expect(bigAlien.visible).toEqual(true);
      sinon.assert.notCalled(bigAlien.newPosition);
    });

    it("should hide and set new position when leaving canvas at left side", function () {
      bigAlien.vel.x *= -1;

      bigAlien.postMove();

      expect(bigAlien.visible).toEqual(false);
      sinon.assert.called(bigAlien.newPosition);
    });

    it("should not hide and set new position when heading towards canvas from right", function () {
      bigAlien.x = asteroids.Game.canvasWidth + 21;
      bigAlien.vel.x *= -1;

      bigAlien.postMove();

      expect(bigAlien.visible).toEqual(true);
      sinon.assert.notCalled(bigAlien.newPosition);
    });

    it("should hide and set new position when leaving canvas at right side", function () {
      bigAlien.x = asteroids.Game.canvasWidth + 21;

      bigAlien.postMove();

      expect(bigAlien.visible).toEqual(false);
      sinon.assert.called(bigAlien.newPosition);
    });
  });
});
