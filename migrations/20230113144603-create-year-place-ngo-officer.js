'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('year_place_ngo_officers', {
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
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Places',
          key: 'id'
        }
      },
      ngo_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Ngos',
          key: 'id'
        }
      },
      officer_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Officers',
          key: 'id'
        }
      },
      served_population: {
        type: Sequelize.BIGINT
      },
      percent_served: {
        type: Sequelize.INTEGER
      },
      rank: {
        type: Sequelize.TINYINT
      },
      field: {
        type: Sequelize.STRING
      },
      createdAt: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
      },
      updatedAt: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('year_place_ngo_officers');
  }
};