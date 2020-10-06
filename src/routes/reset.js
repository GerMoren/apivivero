const server = require("express").Router();
const bcrypt = require("bcryptjs");
const {
  User,
  Order,
  Productsorder,
  Product,
  Toresetpassword,
} = require("../db.js");

server.post("/", (req, res, next) => {
  const { email } = req.body;

  Toresetpassword.create({ email })
    .then((users) => {
      res.status(201);
      res.send(users.dataValues);
    })
    .catch((error) => {
      res.status(400);
      res.send(error);
    });
});

server.post("/user", (req, res, next) => {
  const { email } = req.body;
  Toresetpassword.findOne({ where: { email: email } })
    .then((response) => {
      if (!response) {
        return res.send(null);
      }
      res.send(response.dataValues);
    })
    .catch((err) => {
      res.send(err);
    });
});

server.get("/", (req, res, next) => {
  Toresetpassword.findAll()
    .then((users) => {
      res.status(201);
      res.send(users);
    })
    .catch((error) => {
      res.status(400);
      res.send(error);
    });
});

server.put("/passwordupdate", (req, res, next) => {
  let { email, password, adminReset } = req.body;
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(password, salt, function (err, hash) {
      var password = hash;
      User.update(
        { password: password },
        { where: { email: email }, returning: true }
      )
        .then((response) => {})
        .catch((error) => {
          res.json(error);
        });
      if (adminReset) {
        Toresetpassword.destroy({ where: { email: email } });
      }
      res.json({ message: "actualizado correctamente" });
    });
  });
});

module.exports = server;
