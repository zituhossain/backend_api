'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('population_year_places', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      year_id: {
        type: Sequelize.INTEGER
      },
      place_id: {
        type: Sequelize.INTEGER
      },
      total_population: {
        type: Sequelize.BIGINT
      },
      served_population: {
        type: Sequelize.BIGINT
      },
      male: {
        type: Sequelize.BIGINT
      },
      female: {
        type: Sequelize.BIGINT
      },
      minority: {
        type: Sequelize.BIGINT
      },
      created_by: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      createdAt: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: true
      },
      updatedAt: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: true
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('population_year_places');
  }
};