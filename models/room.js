'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Rooms extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Rooms.hasMany(models.RoomParticipants, {
        foreignKey: 'roomId',
        onDelete: 'CASCADE'
      });
      Rooms.hasMany(models.Messages, {
        foreignKey: 'roomId',
        onDelete: 'CASCADE'
      });
    }
  }
  Rooms.init({
    roomId: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'Rooms',
  });
  return Rooms;
};