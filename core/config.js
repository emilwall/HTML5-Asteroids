var asteroids = asteroids || {};

asteroids.KEY_CODES = {
  32: 'space',
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down',
  70: 'f',
  71: 'g',
  72: 'h',
  80: 'p'
};

asteroids.KEY_STATUS = { keyDown: false };
for (code in asteroids.KEY_CODES) {
  asteroids.KEY_STATUS[asteroids.KEY_CODES[code]] = false;
};

$(window).keydown(function (e) {
  asteroids.KEY_STATUS.keyDown = true;
  if (asteroids.KEY_CODES[e.keyCode]) {
    e.preventDefault();
    asteroids.KEY_STATUS[asteroids.KEY_CODES[e.keyCode]] = true;
  }
}).keyup(function (e) {
  asteroids.KEY_STATUS.keyDown = false;
  if (asteroids.KEY_CODES[e.keyCode]) {
    e.preventDefault();
    asteroids.KEY_STATUS[asteroids.KEY_CODES[e.keyCode]] = false;
  }
});

asteroids.GRID_SIZE = 60;
