const server = require("express").Router();
const session = require("express-session");
const passport = require("passport");
const { User, Toresetpassword, Order } = require("../db.js");
const { Sequelize } = require("sequelize");

server.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/auth/login" }),
  function (req, res) {
    let { email } = req.body;
    Toresetpassword.findOne({ where: { email: email } }).then((user) => {
      if (!user) {
        // console.log("en el post del login", req.user);
        res.status(200).send({
          id: req.user.id,
          role: req.user.role,
          name: req.user.name,
          lastname: req.user.lastname,
        });
      } else {
        res.status(200);
        res.json({ message: "Necesitas cambiar tu password." });
      }
    });
  }
);

server.get("/login", function (req, res) {
  // console.log("estoy en el get de login");
  res.status(401).send({ message: "Fallo el inicio de sesion" });
});

server.get("/logout", function (req, res) {
  // req.session.destroy(function (e) {
  req.logout();
  // res
  //   .status(205)
  //   // res.redirect("https://mail.google.com/mail/u/0/?logout&hl=en");
  //   // .send({ message: "Deslogeado correctamente" });
  //   // });
  //   .send(req.user);
  // req.logout();
  res.cookie("connect.sid", "", { expires: new Date(1), path: "/" });
  // req.logout();
  // // res.clearCookie("connect.sid", { path: "/" });
  // // res.redirect("/");
  req.session = null;
  // req.session.destroy(function (err) {
  //   if (err) {
  //     return next(err);
  //   }
  //   // The response should indicate that the user is no longer authenticated.
  //   console.log(req.isAuthenticated());
  res.clearCookie("connect.sid");
  return res.send({ authenticated: req.isAuthenticated() });
  // });
  // req.session.destroy((err) => {
  //   if (!err) {
  //     res
  //       .status(200)
  //       .clearCookie("connect.sid", { path: "/" })
  //       .json({ status: "Success" });
  //   } else {
  //     res.send(err);
  //   }
  // });
  // res.redirect("/");
});

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.send(req.isAuthenticated());
  }
}

server.get("/me", isAuthenticated, function (req, res) {
  console.log("dentro del /me", req.user);
  User.findOne({ where: req.user.id }, { include: [Order] })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      res.send("no se encontro el usuario");
    });
});

server.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile", "openid"] }),
  function (req, res) {
    console.log("inicio de sesion exitoso");
    res.json(req.user);
  }
);

server.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "https://vivero.vercel.app/catalogo",
    failureRedirect: "https://vivero.vercel.app/loginpage",
  })
);

module.exports = server;
