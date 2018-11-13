const   Post = require('./models').Post,
        Topic = require('./models').Topic,
        Authorizer = require('../../src/policies/post'),
        Comment = require("./models").Comment,
        User = require("./models").User,
        Vote = require("./models").Vote;

module.exports = {
    addPost(newPost, callback) {
        return Post.create(newPost)
        .then((post) => {
            callback(null, post);
        })
        .catch((err) => {
            callback(err);
        });
    },
    getPost(id, callback) {
        return Post.findById(id, {
            include: [
                {model: Comment, as: "comments", include: [
                    {model: User }
                ]}, {model: Vote, as: "votes"}
            ]
        })
        .then((post) => {
            callback(null, post);
        })
        .catch((err) => {
            callback(err);
        })
    },
    deletePost(req, callback) {
        return Post.findById(req.params.id)
        .then((post) => {
            const authorized = new Authorizer(req.user, post).destroy();

            if(authorized) {
                post.destroy()
                .then((res) => {
                    callback(null, post);
                });
            } else {
                req.flash("notice", "You are not authorized to do that.");
                callback(401);
            }
        })
        .catch((err) => {
            console.log(err);
            callback(err);
        });
    },
    updatePost(req, updatedPost, callback) {
        return Post.findById(req.params.id)
        .then((post) => {
            if(!post) {
                return callback("Post not found");
            }

            const authorized = new Authorizer(req.user, post).update();

            if(authorized) {
                post.update(updatedPost, {
                    fields: Object.keys(updatedPost)
                })
                .then(() => {
                    callback(null, post);
                })
                .catch((err) => {
                    callback(err);
                });
            } else {
                req.flash("You are not authorized to do that");
                callback("Forbidden");
            }
        });
    }
}
