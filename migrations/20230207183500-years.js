'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('years', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      bn_name: {
        type: Sequelize.STRING
      },
      bn_term: {
        type: Sequelize.STRING
      }
     
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('years');
  }
};