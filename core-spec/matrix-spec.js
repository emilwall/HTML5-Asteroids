describe("Matrix", function () {
  beforeEach(function () {
    this.matrix = new asteroids.Matrix(2, 3);
  });

  it("should have configure, set and multiply methods", function () {
    expect(typeof this.matrix.configure).toEqual("function");
    expect(typeof this.matrix.set).toEqual("function");
    expect(typeof this.matrix.multiply).toEqual("function");
  });
});
