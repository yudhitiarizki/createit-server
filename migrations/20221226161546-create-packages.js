'use strict';

const { Sequelize } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Packages', {
      packageId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      serviceId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      delivery: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      revision: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      noOfConcepts: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      noOfPage: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      maxDuration: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: true
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
    await queryInterface.dropTable('Packages');
  }
};