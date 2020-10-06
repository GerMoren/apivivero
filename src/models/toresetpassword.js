const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("toresetpassword", {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
                args: true,
                message: 'Username must be unique.',
            }
    },
      // validate: {
      //   isEmail: true,
      // },
})
}
