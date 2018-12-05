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

    Post.hasMany(models.Favorite, {
      foreignKey: "postId",
      as: "favorites"
    });

    Post.afterCreate((post, callback) => {
     return models.Favorite.create({
       userId: post.userId,
       postId: post.id
     });
   });

  };

  Post.prototype.getPoints = function(callback){
       if(this.votes === undefined) {
           return this.getVotes({
               where: {
                   postId: this.id
               }
           })
           .then((votes) => {
               callback(votes.map((v) => {return v.value}).reduce((prev, next) => {return prev + next}));
           });
       } else {
           if(this.votes.length === 0) return 0;

           return this.votes
             .map((v) => { return v.value })
             .reduce((prev, next) => { return prev + next });
       }
   };

   Post.prototype.hasUpvoteFor = function(providedUserId, callback) {
       return this.getVotes({
           where: {
               userId: providedUserId,
               postId: this.id,
               value: 1
           }
       })
       .then((votes) => {
           if(votes) {
               callback(true);
           } else {
               callback(false);
           }
       })
   }

   Post.prototype.hasDownvoteFor = function(providedUserId, callback) {
       return this.getVotes({
           where: {
               userId: providedUserId,
               postId: this.id,
               value: -1
           }
       })
       .then((vote) => {
           if(vote) {
               callback(true);
           } else {
               callback(false);
           }
       })
   }

   Post.prototype.getFavoriteFor = function(userId){
     return this.favorites.find((favorite) => { return favorite.userId == userId });
   };

  return Post;
};
