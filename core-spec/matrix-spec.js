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

  describe("set", function () {
    it("should set values of data matrix row-wise", function () {
      matrix.set(1, 2, 3, 4, 5, 6);

      expect(matrix.data).toEqual([[1, 2, 3], [4, 5, 6]]);
    });
  });

  describe("multiply", function () {
    beforeEach(function () {
      matrix.data = [[1, 2, 3], [4, 5, 6]];
    });

    it("should return matrix-vector product", function () {
      expect(matrix.multiply(1, 2, 3)).toEqual([14, 32]);
    });

    it("should not alter matrix data", function () {
      matrix.multiply(1, 2, 3);

      expect(matrix.data).toEqual([[1, 2, 3], [4, 5, 6]]);
    });
  });
});
