$(function () {
  var canvas = $("#canvas");
  var rendering = new Rendering(canvas);

  var i, j = 0;

  var paused = false;
  var showFramerate = false;
  var avgFramerate = 0;
  var frameCount = 0;
  var elapsedCounter = 0;

  var lastFrame = Date.now();
  var thisFrame;
  var elapsed;
  var delta;

  var canvasNode = canvas[0];

  // shim layer with setTimeout fallback
  // from here:
  // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
  window.requestAnimFrame = (function () {
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function (/* function */ callback, /* DOMElement */ element) {
              window.setTimeout(callback, 1000 / 60);
            };
  })();

  var mainLoop = function () {
    rendering.context.clearRect(0, 0, asteroids.Game.canvasWidth, asteroids.Game.canvasHeight);

    asteroids.Game.FSM.execute();

    if (KEY_STATUS.g) {
      rendering.drawGrid();
    }

    thisFrame = Date.now();
    elapsed = thisFrame - lastFrame;
    lastFrame = thisFrame;
    delta = elapsed / 30;

    for (i = 0; i < asteroids.Game.sprites.length; i++) {

      asteroids.Game.sprites[i].run(delta);

      if (asteroids.Game.sprites[i].reap) {
        asteroids.Game.sprites[i].reap = false;
        asteroids.Game.sprites.splice(i, 1);
        i--;
      }
    }

    // score
    var score_text = ''+asteroids.Game.score;
    Text.renderText(score_text, 18, asteroids.Game.canvasWidth - 14 * score_text.length, 20);

    // extra dudes
    for (i = 0; i < asteroids.Game.lives; i++) {
      rendering.drawExtraShip();
    }

    if (showFramerate) {
      Text.renderText(''+avgFramerate, 24, asteroids.Game.canvasWidth - 38, asteroids.Game.canvasHeight - 2);
    }

    frameCount++;
    elapsedCounter += elapsed;
    if (elapsedCounter > 1000) {
      elapsedCounter -= 1000;
      avgFramerate = frameCount;
      frameCount = 0;
    }

    if (paused) {
      Text.renderText('PAUSED', 72, asteroids.Game.canvasWidth/2 - 160, 120);
    } else {
      requestAnimFrame(mainLoop, canvasNode);
    }
  };

  mainLoop();

  $(window).keydown(function (e) {
    switch (KEY_CODES[e.keyCode]) {
      case 'f': // show framerate
        showFramerate = !showFramerate;
        break;
      case 'p': // pause
        paused = !paused;
        if (!paused) {
          // start up again
          lastFrame = Date.now();
          mainLoop();
        }
        break;
    }
  });
});
