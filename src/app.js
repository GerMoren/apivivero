const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const routes = require("./routes/index.js");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const Strategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const config = require("../config.js");
require("./db.js");
//Modelo de usuario
const { User, Review, Order, Products_Order } = require("./db.js");

passport.use(
  new Strategy({ usernameField: "email", passwordField: "password" }, function (
    username,
    password,
    done
  ) {
    User.findOne({ where: { email: username } })
      .then((user) => {
        if (!user) {
          return done(null, false);
        }
        bcrypt.compare(password, user.password).then((res) => {
          if (res) {
            return done(null, user);
          }
          return done(null, false);
        });
      })
      .catch((err) => {
        return done(err);
      });
  })
);

passport.use(
  new GoogleStrategy(
    {
      clientID: config.clientId,
      clientSecret: config.secret,
      callbackURL: config.callback,
      // userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    function (accessToken, refreshToken, profile, done) {
      User.findOrCreate({
        where: {
          googleId: profile.id,
          email: profile.emails[0].value,
          lastname: profile.name.familyName,
          name: profile.name.givenName,
          password: profile.id,
        },
      })
        .then((res) => {
          return res[0];
        })
        .then((user) => {
          done(null, user);
        })
        .catch((err) => done(err));
    }
  )
);

// Configuración de la persistencia de la sesión autenticada

// Para recuperar los datos de la sesión autenticada Passport necesita dos métodos para
// serializar y deserializar al usuario de la sesión. Para ello la forma más práctica de hacerlo
// es serializando el ID del usuario para luego al deserealizar a partir de dicho ID obtener
// los demás datos de ese usuario. Esto permite que la información almacenada en la sesión sea
// lo más simple y pequeña posible

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

// Al deserealizar la información del usuario va a quedar almacenada en req.user
passport.deserializeUser(function (id, done) {
  User.findByPk(id)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      return done(err);
    });
});

const server = express();
//Middlewares
//Usamos el modulo cors para las politics cors

server.name = "API";
server.use(
  cors({
    origin: "https://vivero.vercel.app",
    credentials: true,
  })
);

server.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
server.use(bodyParser.json({ limit: "50mb" }));
server.use(cookieParser());
server.use(morgan("dev"));
// server.use(googleStratergy);

server.use(
  session({
    secret: "clasificado",
    resave: false,
    saveUninitialized: false,
  })
);

server.use(passport.initialize());
server.use(passport.session());

server.use((req, res, next) => {
  console.log(req.session);
  console.log(req.user);
  next();
});

server.use((req, res, next) => {
  // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Origin", "https://vivero.vercel.app");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

server.use("/", routes);

// Error catching endware.
server.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
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
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile", "openid"] }),
  function (req, res) {
    console.log("inicio de sesion exitoso");
    res.json(req.user);
  }
);

server.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "https://vivero.vercel.app/catalogo",
    failureRedirect: "https://vivero.vercel.app/loginpage",
  })
);

module.exports = server;
