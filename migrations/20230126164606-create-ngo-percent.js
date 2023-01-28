'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ngo_category_bs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ngo_category_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'ngo_categories',
          key: 'id'
        }
      },
      ngo_value: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      place_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Places',
          key: 'id'
        }
      },
      status: {
        type: Sequelize.ENUM('colorActive','colorInactive'),
        allowNull: false,
        defaultValue:"colorInactive"
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
    await queryInterface.dropTable('ngo_category_b');
  }
};