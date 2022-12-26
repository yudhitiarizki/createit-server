'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderNotes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */ 
    static associate(models) {
      OrderNotes.belongsTo(models.Orders, {
        foreignKey: 'orderId'
      })
    }
  }
  OrderNotes.init({
    noteId: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    orderId: {
      type: DataTypes.INTEGER
    },
    note: {
      type: DataTypes.STRING
    },
  }, {
    sequelize,
    modelName: 'OrderNotes',
  });
  return OrderNotes;
};