describe("Rendering", function() {
  beforeEach(function() {
    var context = {};
    context.clearRect = sinon.stub();
    context.beginPath = sinon.stub();
    context.closePath = sinon.stub();
    context.moveTo = sinon.stub();
    context.lineTo = sinon.stub();
    context.stroke = sinon.stub();
    context.save = sinon.stub();
    context.restore = sinon.stub();
    
    this.canvas = {};
    this.canvas.width = sinon.stub().returns(780);
    this.canvas.height = sinon.stub().returns(540);
    this.canvas.getContext = sinon.stub().returns(context);
    this.canvas[0] = this.canvas;

    this.rendering = new asteroids.Rendering(this.canvas);
  });

  it("should set context of canvas as attribute of self", function() {
    expect(this.rendering.context).toBeDefined();
  });

  it("should add ship to asteroids.Game.sprites", function() {
    var length = asteroids.Game.sprites.length;
    var found = false;

    for (var i = 0; i < length; i++) {
      if (asteroids.Game.sprites[i].name === "ship") {
        found = true;
        break;
      }
    }

    assert(found);
  });

  it("should add 10 bullets to asteroids.Game.sprites", function() {
    var length = asteroids.Game.sprites.length;
    var found = 0;

    for (var i = 0; i < length; i++) {
      if (asteroids.Game.sprites[i].name === "bullet") {
        found++;
      }
    }

    expect(found).toBe(10);
  });

  it("should define drawGrid method", function () {
    expect(typeof this.rendering.drawGrid).toBe("function");
  });

  describe("drawGrid", function () {
    beforeEach(function () {
      this.g = asteroids.KEY_STATUS.g;
    });

    afterEach(function () {
      asteroids.KEY_STATUS.g = this.g;
    });

    it("should call context.stroke when asteroids.KEY_STATUS.g is true", function () {
      asteroids.KEY_STATUS.g = true;

      this.rendering.drawGrid();

      expect(this.rendering.context.stroke.called).toBe(true);
    });
  });
});
