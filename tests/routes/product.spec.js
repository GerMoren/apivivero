/* eslint-disable import/no-extraneous-dependencies */
const { expect } = require("chai");
const session = require("supertest-session");
const app = require("../../src/app.js");
const { Product, conn } = require("../../src/db.js");

const agent = session(app);
const product = {
  name: "producto",
  price: 300,
  stock: 25,
  description: "description",
};

describe("PRODUCT routes", () => {
  before(() =>
    conn.authenticate().catch((err) => {
      console.error("Unable to connect to the database:", err);
    })
  );
  beforeEach(() =>
    Product.sync({ force: true }).then(() => Product.create(product))
  );
  describe("GET /products", () => {
    xit("should get 200", () => agent.get("/products/").expect(200));
  });
});
