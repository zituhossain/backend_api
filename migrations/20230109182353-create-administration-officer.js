'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Administration_officers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      district_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Districts',
          key: 'id'
        }
      },
      division_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Divisions',
          key: 'id'
        }
      },
      place_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Places',
          key: 'id'
        }
      },
      administration_office_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Administration_offices',
          key: 'id'
        }
      },
      ordering: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false
      },
      designation: {
        type: Sequelize.STRING,
        allowNull: false
      },
      joining_date: {
        type: Sequelize.STRING,
        allowNull: false
      },
      batch: {
        type: Sequelize.INTEGER
      },
      ability: {
        type: Sequelize.STRING
      },
      honesty: {
        type: Sequelize.STRING
      },
      qualification: {
        type: Sequelize.STRING
      },
      comments: {
        type: Sequelize.TEXT
      },
      filename: {
        type: Sequelize.STRING
      },
      created_by: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      updated_by: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable('Administration_officers');
  }
};