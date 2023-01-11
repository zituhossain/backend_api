'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ngo_details_info_point_wises', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      details: {
        type: Sequelize.STRING
      },
      place_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Places',
          key: 'id'
        }
      },
      ngo_details_info_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'ngo_details_infos',
          key: 'id'
        }
      },
      createdby: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('ngo_details_info_point_wises');
  }
};