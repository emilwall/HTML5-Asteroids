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
  });

  it("should set context of canvas as attribute of self", function() {
    var rendering = new Rendering(this.canvas);

    expect(rendering.context).toBeDefined();
  });
});
