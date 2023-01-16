'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('RoomParticipants', {
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      roomId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Rooms', key: 'roomId' },
        onDelete: 'CASCADE',
      },
      role: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('RoomParticipants');
  }
};