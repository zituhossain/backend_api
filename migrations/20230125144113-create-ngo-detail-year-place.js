'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ngo_detail_year_places', {
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
      ngo_amount: {
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
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ngo_detail_year_places');
  }
};