'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Users.hasOne(models.Sellers, {
        foreignKey: 'userId'
      }),
      Users.hasMany(models.Notifications, {
        foreignKey: 'userId'
      }),
      Users.hasMany(models.Orders, {
        foreignKey: 'userId'
      })
    }
  }
  Users.init({ 
    userId: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    firstName: {
      type: DataTypes.STRING
    },
    lastName: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING
    },
    username: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING
    },
    role: {
      type: DataTypes.INTEGER
    },
    phoneNumber: {
      type: DataTypes.STRING
    },
    refreshToken: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'Users',
  });
  return Users;
};