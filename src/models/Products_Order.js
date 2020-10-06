const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define("productsorder", {
    price: {
      type: DataTypes.DECIMAL(10, 2),
      // allowNull: false,
      validate: {
        min: 0,
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      // allowNull: false,
      validate: {
        min: 0,
        isInt: true,
      },
    },
  });
};
