'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Packages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Packages.belongsTo(models.Services, {
        foreignKey: 'serviceId'
      }),

      Packages.hasMany(models.Orders, {
        foreignKey: 'packageId'
      })
    }
  }
  Packages.init({
    packageId: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    serviceId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    delivery: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    revision: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    noOfConcepts: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    noOfPage: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    maxDuration: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Packages',
  });
  return Packages;
};