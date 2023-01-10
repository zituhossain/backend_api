'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {

      id: {
    
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    
      },
      username: {
    
        type: Sequelize.STRING,
        allowNull: false,
    
      },
    
      email: {
    
        type: Sequelize.STRING,
        allowNull: false,
    
      },
      firstname: {
    
        type: Sequelize.STRING,
        allowNull: false,
    
      },
      lastname: {
    
        type: Sequelize.STRING,
        allowNull: true,
    
      },
      password1: {
    
        type: Sequelize.TEXT,
        allowNull: false,
    
      },
      password2: {
    
        type: Sequelize.TEXT,
        allowNull: false,
    
      },
      office_id: {
    
        type: Sequelize.BIGINT,
        allowNull: false,
    
      },
      phone: {
    
        type: Sequelize.STRING,
        allowNull: false,
    
      },
      status: {
    
        type: Sequelize.STRING,
        allowNull: false,
        values: ['active', 'pending', 'deleted']
    
      },
      role_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'User_role',
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
    await queryInterface.dropTable('Users');
  }
};