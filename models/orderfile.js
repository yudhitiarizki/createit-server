'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderFiles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      OrderFiles.belongsTo(models.Orders, {
        foreignKey: 'orderId'
      })
    }
  }
  OrderFiles.init({
    fileId: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    orderId: {
      type: DataTypes.INTEGER
    },
    file: {
      type: DataTypes.STRING
    },
  }, {
    sequelize,
    modelName: 'OrderFiles',
  });
  return OrderFiles;
};