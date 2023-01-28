'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    queryInterface.addColumn('Ngos', 'type', {
      type: Sequelize.ENUM('regular','other'),
      allowNull: false,
      defaultValue:"regular"

      
    }),
    queryInterface.addColumn('Places', 'ngo_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Ngos',
        key: 'id'
      }
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
