'use strict';
module.exports = (sequelize, DataTypes) => {
  const Topic = sequelize.define('Topic', {
    title: {
        allowNull: false,
        type: DataTypes.STRING
    },
    description: {
        allowNull: false,
        type: DataTypes.STRING
    }
  }, {});
  Topic.associate = function(models) {
    // associations can be defined here
    Topic.hasMany(models.Banner, {
        foreignKey: "topicId",
        as: "banners",
    });
    Topic.hasMany(models.Rule, {
        foreignKey: "topicId",
        as: "rules",
    });
    Topic.hasMany(models.Post, {
        foreignKey: "topicId",
        as: "posts"
    });
  };
  return Topic;
};
