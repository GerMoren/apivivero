const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("user", {
    email: {
      type: DataTypes.STRING,
      // allowNull: false,
      unique: {
        args: true,
        message: "Username must be unique.",
      },
      validate: {
        isEmail: true,
      },
    },
    name: {
      type: DataTypes.STRING,
      // allowNull: false,
      // validate: {
      //   notNull: {
      //     msg: "Ingresa tu nombre",
      //   },
      // },
    },
    lastname: {
      type: DataTypes.STRING,
      // allowNull: false,
      // validate: {
      //   notNull: {
      //     msg: "Ingresa tu apellido",
      //   },
      // },
    },
    password: {
      type: DataTypes.STRING,
      // allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("admin", "user"),
      defaultValue: "user",
      allowNull: true,
    },
    googleId: {
      type: DataTypes.STRING,
    },
  });
};

// Generador de Hash para seguridad de password:
//  User.methods.generateHash = function(password) {
//  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
//  };
