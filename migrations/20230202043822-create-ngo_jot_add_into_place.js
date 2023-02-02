'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ngo_jot_add_into_places', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
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
      
      division_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Divisions',
          key: 'id'
        }
      },
      district_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Districts',
          key: 'id'
        }
      },
      ngo_jot_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'ngo_jots',
          key: 'id'
        }
      },
      percent: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      updated_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id'
        }
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
    await queryInterface.dropTable('ngo_jot_add_into_places');
  }
};