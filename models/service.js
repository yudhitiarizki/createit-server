'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Services extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Services.hasMany(models.Packages, {
        foreignKey: 'serviceId'
      }),
      Services.belongsTo(models.Sellers, {
        foreignKey: 'sellerId'
      }),
      Services.belongsTo(models.Categories, {
        foreignKey: 'categoryId'
      }),
      Services.hasMany(models.ServiceImages, {
        foreignKey: 'serviceId'
      }),
      Services.hasMany(models.Reviews, {
        foreignKey: 'serviceId'
      })
    }


  }
  Services.init({
    serviceId: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    sellerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Services',
  });
  return Services;
};