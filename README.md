Asteroids
=========

To run the game, simply download a clone of this repo, **git clone git@github.com:emilwall/HTML5-Asteroids.git**, and open index.html in a browser that supports html5 canvas.

Tests
-----

The tests are designed to run with JsTestDriver with a Jasmine plugin.

To run the tests locally on your computer:
- Dedicate a terminal (or a tab in your terminal) to run the command **java -jar bin/JsTestDriver-1.3.5.jar --port 9999**
- Open one or several browsers and navigate to **localhost:9999/**
- Run **java -jar bin/JsTestDriver-1.3.5.jar --tests all** in a terminal
- To run only a subset of the tests, replace **all** with a suitable regexp to match the test names