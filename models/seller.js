'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Sellers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Sellers.belongsTo(models.Users, {
        foreignKey: 'userId'
      }),
      Sellers.hasMany(models.Services, {
        foreignKey: 'sellerId'
      })
    }
  }
  Sellers.init({
    sellerId: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    photoProfile: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    noRekening: {
      type: DataTypes.STRING,
      allowNull: false
    },
    bankName: {
      type: DataTypes.STRING,
      allowNull: false
    }, 
    cardHolder: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isVerified: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Sellers',
  });
  return Sellers;
};