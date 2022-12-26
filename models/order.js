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
      })
    }

    static associate(models) {
      Orders.hasMany(models.Packages, {
        foreignKey: 'orderId'
      })
    }

    static associate(models) {
      Orders.hasOne(models.Reviews, {
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
    paymentProof: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false
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