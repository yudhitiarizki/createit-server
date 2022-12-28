'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reviews extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Reviews.belongsTo(models.Services, {
        foreignKey: 'serviceId'
      }),
      Reviews.belongsTo(models.Orders, {
        foreignKey: 'orderId'
      })
    }
  }
  Reviews.init({
    reviewId: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    serviceId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    review: {
      type: DataTypes.TEXT
    },
    rating: {
      type: DataTypes.INTEGER
    },
  }, {
    sequelize,
    modelName: 'Reviews',
  });
  return Reviews;
};