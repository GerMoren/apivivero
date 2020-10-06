const { Product, conn } = require("../../src/db.js");
const { expect } = require("chai");

describe("Product model", () => {
  before(() =>
    conn.authenticate().catch((err) => {
      console.error("Unable to connect to the database:", err);
    })
  );
  beforeEach("Sincroniza y limpia tu base de datos", () =>
    Product.sync({ force: true })
  );
  describe("Definitions", () => {
    it("tiene la definición de name esperada", () => {
      expect(Product.tableAttributes.name).to.be.an("object");
    });
    it("tiene la definición de description esperada", () => {
      expect(Product.tableAttributes.description).to.be.an("object");
    });
    it("tiene la definición de price esperada", () => {
      expect(Product.tableAttributes.price).to.be.an("object");
    });
    it("tiene la definición de stock esperada", () => {
      expect(Product.tableAttributes.stock).to.be.an("object");
    });
    it("tiene la definición de image esperada", () => {
      expect(Product.tableAttributes.image).to.be.an("object");
    });
  });

  describe("Validators", () => {
    describe("name", () => {
      it("should throw an error if name is null", (done) => {
        Product.create({})
          .then(() => done(new Error("It requires a valid name")))
          .catch(() => done());
      });
      it("tiene la definición de schema esperado", () => {
        expect(Product.tableAttributes.name).to.be.an("object");
      });
      it("error con un name invalido", function (done) {
        Product.create({
          name: "",
          description: "hola",
          price: 300,
          image: "buffer",
          stock: 300,
        })
          .then(() => done("No debería haberse creado"))
          .catch(() => done());
      });
      it("requiere un name", () => {
        const product = Product.build();
        return product
          .validate()
          .then(() => {
            throw new Error("Promise should have rejected");
          })
          .catch((err) => {
            expect(err).to.exist;
            expect(err).to.be.an("error");
          });
      });
    });
    describe("description", () => {
      it("should throw an error if description is null", (done) => {
        Product.create({})
          .then(() => done(new Error("It requires a valid description")))
          .catch(() => done());
      });
      it("tiene la definición de schema esperado", () => {
        expect(Product.tableAttributes.description).to.be.an("object");
      });
      it("error con un description invalido", function (done) {
        Product.create({
          name: "hola",
          description: "",
          price: 300,
          image: "buffer",
          stock: 300,
        })
          .then(() => done("No debería haberse creado"))
          .catch(() => done());
      });
      it("requiere un description", () => {
        const product = Product.build();
        return product
          .validate()
          .then(() => {
            throw new Error("Promise should have rejected");
          })
          .catch((err) => {
            expect(err).to.exist;
            expect(err).to.be.an("error");
          });
      });
    });
    describe("price", () => {
      it("should throw an error if price is null", (done) => {
        Product.create({})
          .then(() => done(new Error("It requires a valid price")))
          .catch(() => done());
      });
      it("tiene la definición de schema esperado", () => {
        expect(Product.tableAttributes.price).to.be.an("object");
      });
      it("error con un price invalido", function (done) {
        Product.create({
          name: "hola",
          description: "hola",
          price: "-5",
          image: "buffer",
          stock: 300,
        })
          .then(() => done("No debería haberse creado, no hay precio negativo"))
          .catch(() => done());
      });
      it("requiere un price", () => {
        const product = Product.build();
        return product
          .validate()
          .then(() => {
            throw new Error("Promise should have rejected");
          })
          .catch((err) => {
            expect(err).to.exist;
            expect(err).to.be.an("error");
          });
      });
    });
    describe("stock", () => {
      it("should throw an error if stock is null", (done) => {
        Product.create({})
          .then(() => done(new Error("It requires a valid stock")))
          .catch(() => done());
      });
      it("tiene la definición de schema esperado", () => {
        expect(Product.tableAttributes.stock).to.be.an("object");
      });
      it("error con un stock invalido", function (done) {
        Product.create({
          name: "hola",
          description: "hola",
          price: 5,
          image: "buffer",
          stock: -20,
        })
          .then(() => done("No debería haberse creado, no hay stock negativo"))
          .catch(() => done());
      });
      it("requiere un stock", () => {
        const product = Product.build();
        return product
          .validate()
          .then(() => {
            throw new Error("Promise should have rejected");
          })
          .catch((err) => {
            expect(err).to.exist;
            expect(err).to.be.an("error");
          });
      });
    });
    describe("image", () => {
      it("should throw an error if image is null", (done) => {
        Product.create({})
          .then(() => done(new Error("It requires a valid image")))
          .catch(() => done());
      });
      it("tiene la definición de schema esperado", () => {
        expect(Product.tableAttributes.image).to.be.an("object");
      });
      it("requiere un image", () => {
        const product = Product.build();
        return product
          .validate()
          .then(() => {
            throw new Error("Promise should have rejected");
          })
          .catch((err) => {
            expect(err).to.exist;
            expect(err).to.be.an("error");
          });
      });
    });
  });
});
