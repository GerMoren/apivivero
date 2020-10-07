const server = require("express").Router();
const bcrypt = require("bcryptjs");
const { User, Order, Productsorder, Product, Reviews } = require("../db.js");
const { response } = require("../app.js");

server.post("/", (req, res, next) => {
  let { email, name, lastname, password, role } = req.body;
  if (email && name && lastname && password) {
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(password, salt, function (err, hash) {
        // Store hash in your password DB.
        const newUser = {
          email: email,
          name: name,
          lastname: lastname,
          password: hash,
          role: role,
        };
        User.findAll()
          .then((users) => {
            if (users && users.length === 0) {
              newUser.role = "admin";
              User.create(newUser)
                .then((users) => {
                  res.status(201);
                  return res.send(users.dataValues);
                })
                .catch((error) => {
                  res.status(400);
                  return res.send(error);
                });
            }
            User.create(newUser)
              .then((users) => {
                res.status(201);
                return res.send(users.dataValues);
              })
              .catch((error) => {
                res.status(400);
                return res.send(error);
              });
          })
          .catch((error) => next(error));
      });
    });
  } else {
    return res
      .status(400)
      .json({ message: "Debe pasar los parametros requeridos." });
  }
});

server.put("/:id", (req, res, next) => {
  let { email, name, lastname, password, role } = req.body;
  if (email || name || lastname || password || role) {
    User.update(
      { email, name, lastname, password, role },
      { where: { id: req.params.id }, returning: true }
    )
      .then((users) => {
        res.send(users[1][0].dataValues);
      })
      .catch((error) => next(error));
  } else {
    res.status(400).json({ message: "Debe pasar los parametros a modificar" });
  }
});

server.get("/:id", (req, res, next) => {
  User.findByPk({
    where: { id: req.params.id },
    include: [Order, Reviews],
  })
    .then((user) => {
      if (!user) {
        return res.status(400).json({ message: "No se encontro el usuario" });
      }
      return res.send(user);
    })
    .catch((error) => next(error));
});

server.get("/", (req, res, next) => {
  User.findAll({ include: [Order, Reviews] })
    .then((users) => {
      if (users && users.length === 0) {
        return res.send([]);
      }
      res.send(users);
    })
    .catch((error) => next(error));
});

server.delete("/:id", (req, res, next) => {
  const idUser = req.params.id;
  User.destroy({ where: { id: idUser } })
    .then((users) => {
      if (users > 0) {
        return res
          .status(200)
          .json({ message: "El Usuario se ha borrado satisfactoriamente." });
      } else {
        return res.sendStatus(400, {
          message: `No hay ningun usuario con el id: ${idUser}`,
        });
      }
    })
    .catch((error) => next(error));
});

server.post("/:userid/cart", async (req, res, next) => {
  const idUser = req.params.userid;
  const { idProduct, quantity, price } = req.body;
  try {
    //Buscamos si el producto Existe
    const product = await Product.findOne({ where: { id: idProduct } });
    if (!product) {
      return res.send({ message: "no existe el producto a agregar" });
    }
    //Buscamos o creamos orden tipo carrito
    const order = await Order.findOrCreate({
      where: { userId: idUser, state: "cart" },
    });
    //Chequeamos que el producto no este en la orden, sino lo agregamos
    const inCart = await order[0].hasProduct(product);
    if (!inCart) {
      const add = await order[0].addProduct(idProduct, {
        through: { price: price, quantity: quantity },
      });
    }
    //Buscamos los productos asociados a esa orden y los resp
    const productsInOrder = await order[0].getProducts();

    res.send(productsInOrder);
  } catch (error) {
    next(error);
  }
});

server.get("/:idUser/cart", (req, res, next) => {
  Order.findOrCreate({
    where: { userId: req.params.idUser, state: "cart" },
    include: Product,
  })
    .then((order) => {
      res.send(order[0]);
    })
    .catch((err) => next(err));
});

//Esto resetea el carrito
server.delete("/:idUser/cart/", (req, res, next) => {
  var userId = req.params.idUser;
  Order.findOne({
    where: { userId: userId, state: "cart" },
  })
    .then((order) => {
      order.setProducts([]);
      res.send({ message: "Se limpio el carrito" });
    })
    .catch((error) => next(error));
});

server.delete("/:iduser/cart/:idproduct", async (req, res, next) => {
  const idUser = req.params.iduser;
  const idProduct = req.params.idproduct;

  try {
    //busco producto y orden a eliminar
    const product = await Product.findOne({ where: { id: idProduct } });
    const order = await Order.findOne({
      where: { userId: idUser, state: "cart" },
    });

    if (product && order) {
      const rm = await order.removeProduct(product);
      if (rm > 0) {
        return res.send({ message: "Producto eliminado del carrito", rm });
      } else {
        return res.send({ message: "No se elimino producto del carrito", rm });
      }
    } else {
      return res.send({ message: "No se encontreo el product o la order" });
    }
  } catch (error) {
    next(error);
  }
});

server.put("/:idUser/cart", async (req, res, next) => {
  const { quantity, idProducto } = req.body;
  const idUser = req.params.idUser;
  if (quantity && idProducto) {
    try {
      //Obtengo producto y orden a modificar
      const product = await Product.findOne({ where: { id: idProducto } });
      const order = await Order.findOne({
        where: { userId: idUser, state: "cart" },
      });

      if (product && order) {
        const price = product.dataValues.price;
        //Elimino producto de la tabla ordersproduct
        const rm = await order.removeProduct(product);
        //Agrego prodcuto en la tabla con quantity nueva
        const add = await order.addProduct(idProducto, {
          through: { price: price, quantity: quantity },
        });
        return res.send({ message: "Producto modificado" });
      } else {
        return res.send({ message: "No se encontreo el product o la order" });
      }
    } catch (error) {
      next(error);
    }
  } else {
    res.status(400).json({ message: "Debe pasar los parametros necesarios" });
  }
});

// Esta en verdad vendria a ser la password update

server.put("/:id/passwordUpdate", (req, res, next) => {
  let { password } = req.body;
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(password, salt, function (err, hash) {
      var password = hash;
      User.update(
        { password },
        { where: { id: req.params.id }, returning: true }
      )
        .then((response) => {
          res.json(response);
        })
        .catch((error) => {
          res.json(error);
        });
    });
  });
});

server.put("/:id/passwordReset", (req, res, next) => {
  let password2 = " ";

  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(password2, salt, function (err, hash) {
      var password = hash;
      User.update(
        { password },
        { where: { id: req.params.id }, returning: true }
      )
        .then((response) => {
          res.json(response);
        })
        .catch((error) => {
          res.json(error);
        });
    });
  });
});

server.get("/:idUser/orders", (req, res, next) => {
  User.findAll({
    where: { id: req.params.idUser },
    include: Order,
  })
    .then((orders) => {
      if (orders && orders.length === 0) {
        res.status(400).json({
          message: `No hay ningun usuario con el id: ${req.params.idUser}`,
        });
      }
      res.send(orders);
    })
    .catch((error) => next(error));
});

module.exports = server;
