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
      // define association here
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
    delivery: {
      type: DataTypes.STRING,
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
      type: DataTypes.STRING,
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