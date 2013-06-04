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

KEY_STATUS = { keyDown:false };
for (code in asteroids.KEY_CODES) {
  KEY_STATUS[asteroids.KEY_CODES[code]] = false;
};

$(window).keydown(function (e) {
  KEY_STATUS.keyDown = true;
  if (asteroids.KEY_CODES[e.keyCode]) {
    e.preventDefault();
    KEY_STATUS[asteroids.KEY_CODES[e.keyCode]] = true;
  }
}).keyup(function (e) {
  KEY_STATUS.keyDown = false;
  if (asteroids.KEY_CODES[e.keyCode]) {
    e.preventDefault();
    KEY_STATUS[asteroids.KEY_CODES[e.keyCode]] = false;
  }
});

GRID_SIZE = 60;
