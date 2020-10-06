const server = require("express").Router();

// const API_KEY = "8c2187dc7c9fd962c4e8f92e52d63f8e-7cd1ac2b-31b88aa3";
// const DOMAIN = "sandbox65c135321b814aaa8813daf82bba2367.mailgun.org";

const { API_KEY, DOMAIN } = process.env;

const mailgun = require("mailgun-js");
const mg = mailgun({ apiKey: API_KEY, domain: DOMAIN });
const { Product } = require("../db.js");

const { Order, User, Productsorder } = require("../db.js");
const { Sequelize } = require("sequelize");

server.post("/", (req, res, next) => {
  let { state, address } = req.body;
  Order.create({ state, address })
    .then((users) => {
      res.status(201);
      res.send(users.dataValues);
    })
    .catch((error) => {
      next(error);
    });
});

server.get("/", (req, res, next) => {
  const key = Object.keys(req.query);
  const status = req.query[key];
  if (status) {
    Order.findAll({ where: { state: status }, include: User })
      .then((orders) => {
        if (orders && orders.length === 0) {
          return res.json({ message: `No hay ordenes con status: ${status}` });
        }
        res.send(orders);
      })
      .catch((error) => next(error));
  } else {
    Order.findAll({ include: User })
      .then((orders) => {
        if (orders && orders.length === 0) {
          return res
            .status(400)
            .json({ message: `No se ha creado ninguna orden` });
        }
        res.send(orders);
      })
      .catch((error) => next(error));
  }
});

server.get("/:id", (req, res, next) => {
  const idOrder = req.params.id;
  Order.findOne({
    where: { id: idOrder },
    include: [User, Product],
  })
    .then((orders) => {
      res.send(orders);
    })
    .catch((error) => {
      next(error);
    });
});

server.put("/:id", (req, res, next) => {
  const { state, address } = req.body;
  if (state && address) {
    Order.update(
      { state, address },
      { where: { id: req.params.id }, returning: true }
    )
      .then((orders) => {
        sendEmail();
        res.send(orders[1][0].dataValues);
      })
      .catch((error) => next(error));
  } else if (state) {
    Order.update({ state }, { where: { id: req.params.id }, returning: true })
      .then((orders) => {
        sendEmail();
        res.send(orders[1][0].dataValues);
      })
      .catch((error) => next(error));
  } else if (address) {
    Order.update({ address }, { where: { id: req.params.id }, returning: true })
      .then((orders) => {
        sendEmail();
        res.send(orders[1][0].dataValues);
      })
      .catch((error) => next(error));
  } else {
    res
      .status(400)
      .json({ message: "Debe pasar un state o address para modificar" });
  }
});

//mailgun

sendEmail = () =>
  new Promise((resolve, reject) => {
    const data = {
      from: "morengerman91@gmail.com",
      to:
        "albertopopelka@gmail.com, cailletn@northlands.edu.ar, morengerman91@gmail.com",
      subject: "Vivero E-Commerce",
      text: "Gracias por su compra, estamos procesando su pedido",
      html: `<!DOCTYPE html>
            <html>
            <body>      
              <h1>Vivero E-Commerce</h1>
              <p>Gracias por su compra, estamos procesando su pedido...</p>      
            </body>
            </html>`,
    };

    mg.messages().send(data, (error, body) => {
      if (error) {
        return reject(error);
      }
      return resolve();
    });
  });

server.post("/mailgun", (req, res, next) => {
  sendEmail()
    .then((values) => {
      res.json({ message: "Your query has been sent" });
    })
    .catch((e) => {
      next(e);
    });
});

module.exports = server;
