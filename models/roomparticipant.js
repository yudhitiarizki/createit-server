'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RoomParticipants extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      RoomParticipants.belongsTo(models.Rooms, {
        foreignKey: 'roomId'
      })
    }
  }
  RoomParticipants.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    roomId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    role: {
      type: DataTypes.TEXT,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'RoomParticipants',
  });
  return RoomParticipants;
};