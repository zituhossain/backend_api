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
    queryInterface.addColumn('Officers', 'division_id', {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Divisions',
          key: 'id'
        }
    }),
    queryInterface.addColumn('Officers', 'district_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Districts',
        key: 'id'
      }
    }),
    queryInterface.addColumn('Officers', 'place_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Places',
        key: 'id'
      }
    }),
    queryInterface.addColumn('Officers', 'ngo_id', {
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
