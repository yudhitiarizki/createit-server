'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notifications extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */ 
    static associate(models) {
      Notifications.belongsTo(models.Users, {
        foreignKey: 'userId'
      })
    }
  }
  Notifications.init({
    notifId: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    userId: {
      type: DataTypes.INTEGER
    },
    type: {
      type: DataTypes.STRING
    },
    isRead: {
      type: DataTypes.INTEGER
    },
    message: {
      allowNull: false,
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'Notifications',
  });
  return Notifications;
};