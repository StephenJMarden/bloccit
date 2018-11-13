'use strict';
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    title: {
        allowNull: false,
        type: DataTypes.STRING
    },
    body: {
        allowNull: false,
        type: DataTypes.STRING
    },
    topicId: {
        allowNull: false,
        type: DataTypes.INTEGER
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
  }, {});
  Post.associate = function(models) {
    // associations can be defined here
    Post.belongsTo(models.Topic, {
        foreignKey: "topicId",
        onDelete: "CASCADE"
    });

    Post.belongsTo(models.User, {
        foreignKey: "userId",
        onDelete: "CASCADE"
    });

    Post.hasMany(models.Comment, {
      foreignKey: "postId",
      as: "comments"
    });
  };
  return Post;
};
