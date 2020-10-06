const server = require("express").Router();
const { Product } = require("../db.js");
const { Sequelize } = require("sequelize");

//Hacemos un get a /search ? si un key es = a valor

server.get("/", (req, res, next) => {
  const key = Object.keys(req.query);
  const valor = req.query[key];
  Product.findAll({
    where: {
      [Sequelize.Op.or]: [
        //Es lo mismo que el || pero en sequelize
        { name: { [Sequelize.Op.like]: `%${valor}%` } }, //Pasa como variable el valor obtenido de query
        { description: { [Sequelize.Op.like]: `%${valor}%` } },
      ],
    },
  })
    .then((products) => {
      if (products.length === 0) {
        return res.json({ message: "No se encontraron resultados" });
      }
      res.send(products);
    })
    .catch((error) => next(error));
});

module.exports = server;
