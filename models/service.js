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
      })
    }

    static associate(models) {
      Services.belongsTo(models.Sellers, {
        foreignKey: 'sellerId'
      })
    }

    static associate(models) {
      Services.belongsTo(models.Categories, {
        foreignKey: 'categoryId'
      })
    }

    static associate(models) {
      Services.hasMany(models.ServiceImages, {
        foreignKey: 'sellerId'
      })
    }

    static associate(models) {
      Services.hasMany(models.Reviews, {
        foreignKey: 'sellerId'
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