const   User = require('./models').User,
        bcrypt = require('bcryptjs'),
        Post = require('./models').Post,
        Comment = require('./models').Comment,
        Favorite = require('./models').Favorite;

module.exports = {

    createUser(newUser, callback) {
        const   salt = bcrypt.genSaltSync(),
                hashedPassword = bcrypt.hashSync(newUser.password, salt);

        return User.create({
            email: newUser.email,
            password: hashedPassword
        })
        .then((user) => {
            callback(null, user);
        })
        .catch((err) => {
            callback(err);
        });
    },
    getUser(id, callback) {
        let result = {};
        User.findById(id)
        .then((user) => {
            if(!user) {
                callback(404);
            } else {
                result["user"] = user;
                Post.scope({method: ["lastFiveFor", id]}).all()
                .then((posts) => {
                    result["posts"] = posts;
                    Comment.scope({method: ["lastFiveFor", id]}).all()
                    .then((comments) => {
                        result["comments"] = comments;
                        Favorite.scope({method: ["allFavoritedFor", id]}).all()
                        .then((favorites) => {
                            result["favorites"] = favorites;
                            callback(null, result);
                        })
                        .catch((err) => {
                            callback(err);
                        });
                    });
                });
            }
        });
    }
}
