describe("Matrix", function () {
  beforeEach(function () {
    this.matrix = new asteroids.Matrix(2, 3);
  });

  it("should have configure, set and multiply methods", function () {
    expect(typeof this.matrix.configure).toBe("function");
    expect(typeof this.matrix.set).toBe("function");
    expect(typeof this.matrix.multiply).toBe("function");
  });
});
