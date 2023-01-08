'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Orders extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Orders.belongsTo(models.Users, {
        foreignKey: 'userId'
      }),
      Orders.belongsTo(models.Packages, {
        foreignKey: 'packageId'
      }),
      Orders.hasOne(models.Reviews, {
        foreignKey: 'orderId'
      }),
      Orders.hasMany(models.OrderNotes, {
        foreignKey: 'orderId'
      })
      Orders.hasMany(models.OrderFiles, {
        foreignKey: 'orderId'
      })
    }
  }
  Orders.init({
    orderId: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true, 
      type: DataTypes.INTEGER
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    packageId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: false
    },
    note: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false
    },
    response: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    revisionLeft: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Orders',
  });
  return Orders;
};