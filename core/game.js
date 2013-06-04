var asteroids = asteroids || {};

asteroids.Game = {
  score: 0,
  totalAsteroids: 5,
  lives: 0,

  canvasWidth: 800,
  canvasHeight: 600,

  sprites: [],
  ship: null,
  bigAlien: null,

  nextBigAlienTime: null,


  spawnAsteroids: function (count) {
    if (!count) count = this.totalAsteroids;
    for (var i = 0; i < count; i++) {
      var roid = new Asteroid();
      roid.x = Math.random() * this.canvasWidth;
      roid.y = Math.random() * this.canvasHeight;
      while (!roid.isClear()) {
        roid.x = Math.random() * this.canvasWidth;
        roid.y = Math.random() * this.canvasHeight;
      }
      roid.vel.x = Math.random() * 4 - 2;
      roid.vel.y = Math.random() * 4 - 2;
      if (Math.random() > 0.5) {
        roid.points.reverse();
      }
      roid.vel.rot = Math.random() * 2 - 1;
      asteroids.Game.sprites.push(roid);
    }
  },

  explosionAt: function (x, y) {
    var splosion = new asteroids.Explosion();
    splosion.x = x;
    splosion.y = y;
    splosion.visible = true;
    asteroids.Game.sprites.push(splosion);
  },

  FSM: {
    boot: function () {
      asteroids.Game.spawnAsteroids(5);
      this.state = 'waiting';
    },
    waiting: function () {
      Text.renderText('Press Space to Start', 36, asteroids.Game.canvasWidth/2 - 270, asteroids.Game.canvasHeight/2);
      if (KEY_STATUS.space || window.gameStart) {
        KEY_STATUS.space = false; // hack so we don't shoot right away
        window.gameStart = false;
        this.state = 'start';
      }
    },
    start: function () {
      for (var i = 0; i < asteroids.Game.sprites.length; i++) {
        if (asteroids.Game.sprites[i].name == 'asteroid') {
          asteroids.Game.sprites[i].die();
        } else if (asteroids.Game.sprites[i].name == 'bullet' ||
                   asteroids.Game.sprites[i].name == 'bigalien') {
          asteroids.Game.sprites[i].visible = false;
        }
      }

      asteroids.Game.score = 0;
      asteroids.Game.lives = 2;
      asteroids.Game.totalAsteroids = 2;
      asteroids.Game.spawnAsteroids();

      asteroids.Game.nextBigAlienTime = Date.now() + 30000 + (30000 * Math.random());

      this.state = 'spawn_ship';
    },
    spawn_ship: function () {
      asteroids.Game.ship.x = asteroids.Game.canvasWidth / 2;
      asteroids.Game.ship.y = asteroids.Game.canvasHeight / 2;
      if (asteroids.Game.ship.isClear()) {
        asteroids.Game.ship.rot = 0;
        asteroids.Game.ship.vel.x = 0;
        asteroids.Game.ship.vel.y = 0;
        asteroids.Game.ship.visible = true;
        this.state = 'run';
      }
    },
    run: function () {
      for (var i = 0; i < asteroids.Game.sprites.length; i++) {
        if (asteroids.Game.sprites[i].name == 'asteroid') {
          break;
        }
      }
      if (i == asteroids.Game.sprites.length) {
        this.state = 'new_level';
      }
      if (!asteroids.Game.bigAlien.visible &&
          Date.now() > asteroids.Game.nextBigAlienTime) {
        asteroids.Game.bigAlien.visible = true;
        asteroids.Game.nextBigAlienTime = Date.now() + (30000 * Math.random());
      }
    },
    new_level: function () {
      if (this.timer == null) {
        this.timer = Date.now();
      }
      // wait a second before spawning more asteroids
      if (Date.now() - this.timer > 1000) {
        this.timer = null;
        asteroids.Game.totalAsteroids++;
        if (asteroids.Game.totalAsteroids > 12) asteroids.Game.totalAsteroids = 12;
        asteroids.Game.spawnAsteroids();
        this.state = 'run';
      }
    },
    player_died: function () {
      if (asteroids.Game.lives < 0) {
        this.state = 'end_game';
      } else {
        if (this.timer == null) {
          this.timer = Date.now();
        }
        // wait a second before spawning
        if (Date.now() - this.timer > 1000) {
          this.timer = null;
          this.state = 'spawn_ship';
        }
      }
    },
    end_game: function () {
      Text.renderText('GAME OVER', 50, asteroids.Game.canvasWidth/2 - 160, asteroids.Game.canvasHeight/2 + 10);
      if (this.timer == null) {
        this.timer = Date.now();
      }
      // wait 5 seconds then go back to waiting state
      if (Date.now() - this.timer > 5000) {
        this.timer = null;
        this.state = 'waiting';
      }

      window.gameStart = false;
    },

    execute: function () {
      this[this.state]();
    },
    state: 'boot'
  }

};
