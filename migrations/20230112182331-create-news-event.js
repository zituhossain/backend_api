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
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      division_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      district_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: true,
        values: ['youtube_url', 'news_url']
      },
      // youtube_url: {
      //   type: Sequelize.TEXT
      // },
      news_url: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      image: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      title: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      summary: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      news_time: {
        type: 'TIMESTAMP',
        allowNull: true
      },
      // joining_date: {
      //   type: Sequelize.STRING,
      //   allowNull: true
      // },
      // batch: {
      //   type: Sequelize.INTEGER
      // },
      // ability: {
      //   type: Sequelize.STRING
      // },
      // honesty: {
      //   type: Sequelize.STRING
      // },
      // qualification: {
      //   type: Sequelize.STRING
      // },
      // comments: {
      //   type: Sequelize.TEXT
      // },
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