'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class News_event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  News_event.init({
    place_id: DataTypes.INTEGER,
    division_id: DataTypes.INTEGER,
    district_id: DataTypes.INTEGER,
    // youtube_url: DataTypes.TEXT,
    type: DataTypes.STRING,
    news_url: DataTypes.TEXT,
    image: DataTypes.TEXT,
    title: DataTypes.TEXT,
    description: DataTypes.TEXT,
    summary: DataTypes.TEXT,
    news_time: DataTypes.TEXT,
    // joining_date: DataTypes.STRING,
    // batch: DataTypes.INTEGER,
    // ability: DataTypes.STRING,
    // honesty: DataTypes.STRING,
    // qualification: DataTypes.STRING,
    // comments: DataTypes.TEXT,
  }, {
    sequelize,
    tableName: 'news_events',
    modelName: 'News_event',
  });
  News_event.associate = models => {
    News_event.belongsTo(models.Division, {
      foreignKey: 'division_id',
    });
    News_event.belongsTo(models.District, {
      foreignKey: 'district_id',
    });
    News_event.belongsTo(models.Place, {
      foreignKey: 'place_id',
    });
  }
  return News_event;
};