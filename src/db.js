require("dotenv").config();
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");
const { URL } = process.env;

const sequelize = new Sequelize(`${URL}`, {
  logging: false, // set to console.log to see the raw SQL queries
  // native: false, lets Sequelize know we can use pg-native for ~30% more speed
});
const basename = path.basename(__filename);

const modelDefiners = [];

//ATENCIOOOON, definir bien el modelo.
// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, "/models"))
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, "/models", file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach((model) => {
  model(sequelize);
});

// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring
const {
  Product,
  Category,
  User,
  Order,
  Reviews,
  Productsorder,
} = sequelize.models;

// Relaciones :

// Aca category_products se define automaticamente (con productid y categoryid)
Category.belongsToMany(Product, { through: "category_products" });
Product.belongsToMany(Category, { through: "category_products" });

//Aca usamos una tabla ya definida (le agrega price, quantity y description a (productid y orderid))
Order.belongsToMany(Product, { through: Productsorder });
Product.belongsToMany(Order, { through: Productsorder });

User.hasMany(Order);
Order.belongsTo(User);

Product.hasMany(Reviews);
Reviews.belongsTo(Product);

User.hasMany(Reviews);
Reviews.belongsTo(User);

//Hooks para limpiar y pasar a lowercase name y description de Product y Category

Product.addHook("beforeValidate", (product, options) => {
  if (product.name) {
    product.name = product.name
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/\W/g, "")
      .trim();
  }
  if (product.description) {
    product.description = product.description.toLowerCase().trim();
  }
});

Category.addHook("beforeValidate", (category, options) => {
  if (category.name) {
    category.name = category.name
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/\W/g, "")
      .trim();
  }
  if (category.description) {
    category.description = category.description.toLowerCase().trim();
  }
});

module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize, // para importart la conexión { conn } = require('./db.js');
};
