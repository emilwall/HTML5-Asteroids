var asteroids = asteroids || {};

asteroids.Asteroid = function () {
  this.init("asteroid",
            [-10,   0,
              -5,   7,
              -3,   4,
               1,  10,
               5,   4,
              10,   0,
               5,  -6,
               2, -10,
              -4, -10,
              -4,  -5]);

  this.visible = true;
  this.scale = 6;
  this.postMove = this.wrapPostMove;

  this.collidesWith = ["ship", "bullet", "bigalien", "alienbullet"];

  this.collision = function (other) {
    if (other.name == "bullet") asteroids.Game.score += 120 / this.scale;
    this.scale /= 3;
    if (this.scale > 0.5) {
      // break into fragments
      for (var i = 0; i < 3; i++) {
        var roid = $.extend(true, {}, this);
        roid.vel.x = Math.random() * 6 - 3;
        roid.vel.y = Math.random() * 6 - 3;
        if (Math.random() > 0.5) {
          roid.points.reverse();
        }
        roid.vel.rot = Math.random() * 2 - 1;
        roid.move(roid.scale * 3); // give them a little push
        asteroids.Game.sprites.push(roid);
      }
    }
    asteroids.Game.explosionAt(other.x, other.y);
    this.die();
  };

  this.moveToSafePosition = function (width, height) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    while (!this.isClear()) {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
    }
  }
};
asteroids.Asteroid.prototype = new Sprite();
