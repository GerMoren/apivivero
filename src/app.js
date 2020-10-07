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
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    function (token, tokenSecret, email, profile, done) {
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

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findOne({ where: { id: id } })
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
//     origin: "*",
    credentials: true,
  })
);
server.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
server.use(bodyParser.json({ limit: "50mb" }));
server.use(cookieParser());
server.use(morgan("dev"));
// server.use(googleStratergy);
server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin",
             "*",
//              "http://localhost:3001"
            ); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

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
  next();
});
server.use("/", routes);

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.send("no logeado");
  }
}

server.get("/me", isAuthenticated, function (req, res) {
  User.findOne({ where: { id: req.user.id }, include: [Order] })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      res.send("no se encontro el usuario");
    });
});

// Error catching endware.
server.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

server.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile", "openid"] })
);

server.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "http://localhost:3001/catalogo",
    failureRedirect: "http://localhost:3001/loginpage",
  })
);

module.exports = server;

// const mercadopago = require("mercadopago");

// mercadopago.configure({
//   sandbox: true,
//   access_token:
//     "TEST-7291361459687504-090121-277640c872600cf5f29c4db7d737b521-250042965",
// });

// server.post("/mercadopago/create", (req, res, next) => {
//   mercadopago.payment
//     .create({
//       description: "Buying a PS4",
//       transaction_amount: 10500,
//       payment_method_id: "rapipago",
//       notification_url: "https://83e17486c638.ngrok.io/mercadopago",
//       payer: {
//         email: "ingenieriamg91@gmail.com",

//         identification: {
//           type: "DNI",
//           number: "34123123",
//         },
//       },
//     })
//     .then(function (mpResponse) {
//       console.log(mpResponse);
//       res.send(mpResponse);
//     })
//     .catch(function (mpError) {
//       console.log(mpError);
//     });
// });

// // {
// //   action: 'payment.created',
// //   api_version: 'v1',
// //   data: { id: '29404256' },
// //   date_created: '2020-09-01T22:43:35Z',
// //   id: 6362378320,
// //   live_mode: false,
// //   type: 'payment',
// //   user_id: '250042965'
// // }

// server.post("/mercadopago", (req, res, next) => {
//   res.send();

//   const { data } = req.body;
//   mercadopago.payment
//     .get(data.id)
//     .then((values) => console.log(values.body.payer));

//   // console.log(req.headers, req.body);
// });

//mailgun
