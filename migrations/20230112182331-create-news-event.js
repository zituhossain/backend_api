'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('News_events', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      place_id: {
        type: Sequelize.INTEGER
      },
      division_id: {
        type: Sequelize.INTEGER
      },
      district_id: {
        type: Sequelize.INTEGER
      },
      youtube_url: {
        type: Sequelize.TEXT
      },
      news_url: {
        type: Sequelize.TEXT
      },
      image: {
        type: Sequelize.TEXT
      },
      title: {
        type: Sequelize.TEXT
      },
      description: {
        type: Sequelize.TEXT
      },
      joining_date: {
        type: Sequelize.STRING,
        allowNull: true
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
    await queryInterface.dropTable('News_events');
  }
};