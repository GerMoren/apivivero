const server = require("express").Router();
const { Product } = require("../db.js");
const { Category } = require("../db.js");
const { Sequelize } = require("sequelize");

//Hacemos un post a /products/category

server.post("/", (req, res, next) => {
  let { name, description } = req.body; //Requerimos los params

  name = name.trim();
  description = description.trim();

  if (!name || !description) {
    var error = new Error(`Parametros: {name, description} missing`);
    error.status = 400;
    next(error);
  }

  if (name === "" || description === "") {
    return res.status(400).send("name y description no pueden estar vacios");
  }

  Category.create({ name, description })
    .then((category) => {
      res.status(201);
      res.send(category.dataValues);
    })
    .catch((error) => {
      next(error);
    });
});

server.delete("/:id", (req, res, next) => {
  Category.destroy({
    where: {
      id: req.params.id,
    },
  })
    // Devuelve cantidad de rows eliminadas
    .then(function (deleted) {
      if (deleted > 0) {
        res.status(200).json({
          message: `Categoria con id: ${req.params.id} borrada satisfactoriamente`,
        });
      } else {
        res.status(400).json({ message: "No se elimino categoria" });
      }
    })
    .catch((error) => next(error));
});

server.put("/:id", (req, res, next) => {
  let { name, description } = req.body;
  if (!name || !description) {
    var error = new Error(`Parametros: {name, description} missing`);
    error.status = 400;
    next(error);
  }

  name = name.trim();
  description = description.trim();

  if (name === "" || description === "") {
    return res.status(400).send("Nombre y descripcion no pueden estar vacios");
  }

  Category.update(
    { name, description },
    { where: { id: req.params.id }, returning: true }
  )
    // Devuelve un arreglo: [cant.rowsupdated, actual row]
    .then((categories) => {
      if (categories[0] === 0) {
        res.status(400).json({ message: "No se actualizo la categoria" });
      } else {
        res.send(categories[1][0].dataValues);
      }
    })
    .catch((error) => next(error));
});

//Hacemos un get a /products/category/ y nos traemos el arreglo de categorias
//Ademas le pasamos un query con el id de la categoria que estamos buscando.
server.get("/", (req, res, next) => {
  const key = Object.keys(req.query);
  let idCategoria = req.query[key]; //req.query.value = 1
  // Devuelve Productos en Categorias(array)
  if (idCategoria && idCategoria.length > 0) {
    Category.findAll({
      where: { id: idCategoria },
      include: Product,
    })
      .then((categories) => {
        return res.send(categories);
      })
      .catch((error) => {
        next(error);
      });
  }
  //Devuelve el listado de categorias
  else {
    Category.findAll()
      .then((category) => {
        if (category.length === 0) {
          return res
            .status(404)
            .send({ message: "No se ha creado ninguna categoria" });
        }
        res.send(category);
      })
      .catch((error) => next(error));
  }
});

//Hacemos un get a /products/category/:nameCategory para buscar por name de categoria.

// server.get("/:nameCategory", (req, res, next) => {
//   Category.findOne({
//     where: {
//       name: req.params.nameCategory,
//     },
//     include: Product,
//   })
//     .then((category) => {
//       if (!category) {
//         return res.send({
//           message: `No existe la categoria: ${req.params.nameCategory}`,
//         });
//       }
//       if (category.products.length === 0) {
//         return res.send({
//           message: `La categoria: ${req.params.nameCategory} no tiene productos asociados`,
//         });
//       }
//       res.send(category.products);
//     })
//     .catch((error) => next(error));
// });

server.get("/:id", (req, res, next) => {
  Category.findOne({
    where: {
      id: req.params.id,
    },
  })
    .then((category) => {
      if (!category) {
        return res.send({
          message: `No existe la categoria: ${req.params.id}`,
        });
      }

      res.send(category);
    })
    .catch((error) => next(error));
});

module.exports = server;
