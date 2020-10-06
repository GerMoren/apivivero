const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("order", {
    state: {
      type: DataTypes.ENUM(
        "cart",
        "create",
        "process",
        "canceled",
        "completed"
      ),
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });
};
