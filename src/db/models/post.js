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

    Post.hasMany(models.Vote, {
      foreignKey: "postId",
      as: "votes"
    });
  };

  Post.prototype.getPoints = function(){

     if(this.votes === undefined || this.votes.length === 0) return 0;

     return this.votes
       .map((v) => { return v.value })
       .reduce((prev, next) => { return prev + next });
   };

   Post.prototype.hasUpvoteFor = function(providedUserId) {
       if(this.votes === undefined) return false;

       for(let i = 0; i < this.votes.length; i++) {
           if(this.votes[i].value === 1 && this.votes[i].userId === providedUserId) return true;
       }

       return false;
   }

   Post.prototype.hasDownvoteFor = function(providedUserId) {
       if(this.votes === undefined) return false;

       for(let i = 0; i < this.votes.length; i++) {
           if(this.votes[i].value === -1 && this.votes[i].userId === providedUserId) return true;
       }
   }

  return Post;
};
