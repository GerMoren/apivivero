const { Category, conn } = require("../../src/db.js");
const { expect } = require("chai");

describe("Category model", () => {
  before(() =>
    conn.authenticate().catch((err) => {
      console.error("Unable to connect to the database:", err);
    })
  );
  beforeEach("Sincroniza y limpia tu base de datos", () =>
    Category.sync({ force: true })
  );
  describe("Definitions", () => {
    it("tiene la definición de name esperada", () => {
      expect(Category.tableAttributes.name).to.be.an("object");
    });
    it("tiene la definición de description esperada", () => {
      expect(Category.tableAttributes.description).to.be.an("object");
    });
  });

  describe("Validators", () => {
    describe("name", () => {
      it("should throw an error if name is null", (done) => {
        Category.create({})
          .then(() => done(new Error("It requires a valid name")))
          .catch(() => done());
      });
      it("tiene la definición de schema esperado", () => {
        expect(Category.tableAttributes.name).to.be.an("object");
      });
      it("error con un name invalido", function (done) {
        Category.create({
          name: "",
          description: "hola",
        })
          .then(() => done("No debería haberse creado"))
          .catch(() => done());
      });
      it("requiere un name", () => {
        const category = Category.build();
        return category
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
        Category.create({})
          .then(() => done(new Error("It requires a valid description")))
          .catch(() => done());
      });
      it("tiene la definición de schema esperado", () => {
        expect(Category.tableAttributes.description).to.be.an("object");
      });
      it("error con un description invalido", function (done) {
        Category.create({
          name: "hola",
          description: "",
        })
          .then(() => done("No debería haberse creado"))
          .catch(() => done());
      });
      it("requiere un description", () => {
        const category = Category.build();
        return category
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
