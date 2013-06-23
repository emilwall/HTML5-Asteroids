describe("Matrix", function () {
  var matrix;

  beforeEach(function () {
    matrix = new asteroids.Matrix(2, 3);
  });

  it("should have configure, set and multiply methods", function () {
    expect(typeof matrix.configure).toEqual("function");
    expect(typeof matrix.set).toEqual("function");
    expect(typeof matrix.multiply).toEqual("function");
  });

  describe("configure", function () {
    beforeEach(function () {
      matrix.set = sinon.spy();
    });

    it("should call this.set", function () {
      matrix.configure();

      expect(matrix.set.called).toEqual(true);
    });
  });
});
