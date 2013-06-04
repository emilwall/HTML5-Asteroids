Rendering = function (canvas) {
  asteroids.Game.canvasWidth  = canvas.width();
  asteroids.Game.canvasHeight = canvas.height();

  this.context = canvas[0].getContext("2d");

  Text.context = this.context;
  Text.face = vector_battle;

  var gridWidth = Math.round(asteroids.Game.canvasWidth / GRID_SIZE);
  var gridHeight = Math.round(asteroids.Game.canvasHeight / GRID_SIZE);
  var grid = new Array(gridWidth);
  for (var i = 0; i < gridWidth; i++) {
    grid[i] = new Array(gridHeight);
    for (var j = 0; j < gridHeight; j++) {
      grid[i][j] = new GridNode();
    }
  }

  // set up the positional references
  for (var i = 0; i < gridWidth; i++) {
    for (var j = 0; j < gridHeight; j++) {
      var node   = grid[i][j];
      node.north = grid[i][(j == 0) ? gridHeight-1 : j-1];
      node.south = grid[i][(j == gridHeight-1) ? 0 : j+1];
      node.west  = grid[(i == 0) ? gridWidth-1 : i-1][j];
      node.east  = grid[(i == gridWidth-1) ? 0 : i+1][j];
    }
  }

  // set up borders
  for (var i = 0; i < gridWidth; i++) {
    grid[i][0].dupe.vertical            =  asteroids.Game.canvasHeight;
    grid[i][gridHeight-1].dupe.vertical = -asteroids.Game.canvasHeight;
  }

  for (var j = 0; j < gridHeight; j++) {
    grid[0][j].dupe.horizontal           =  asteroids.Game.canvasWidth;
    grid[gridWidth-1][j].dupe.horizontal = -asteroids.Game.canvasWidth;
  }

  var sprites = [];
  asteroids.Game.sprites = sprites;

  // so all the sprites can use it
  Sprite.prototype.context = this.context;
  Sprite.prototype.grid    = grid;
  Sprite.prototype.matrix  = new asteroids.Matrix(2, 3);

  var ship = new asteroids.Ship();

  ship.x = asteroids.Game.canvasWidth / 2;
  ship.y = asteroids.Game.canvasHeight / 2;

  sprites.push(ship);

  ship.bullets = [];
  for (var i = 0; i < 10; i++) {
    var bull = new Bullet();
    ship.bullets.push(bull);
    sprites.push(bull);
  }
  asteroids.Game.ship = ship;

  var bigAlien = new asteroids.BigAlien();
  bigAlien.setup();
  sprites.push(bigAlien);
  asteroids.Game.bigAlien = bigAlien;

  this.extraDude = new asteroids.Ship();
  this.extraDude.scale = 0.6;
  this.extraDude.visible = true;
  this.extraDude.preMove = null;
  this.extraDude.children = [];

  this.drawGrid = function() {
    this.context.beginPath();
    for (var i = 0; i < gridWidth; i++) {
      this.context.moveTo(i * GRID_SIZE, 0);
      this.context.lineTo(i * GRID_SIZE, asteroids.Game.canvasHeight);
    }
    for (var j = 0; j < gridHeight; j++) {
      this.context.moveTo(0, j * GRID_SIZE);
      this.context.lineTo(asteroids.Game.canvasWidth, j * GRID_SIZE);
    }
    this.context.closePath();
    this.context.stroke();
  };
};
