const   staticRoutes = require('../routes/static'),
        topicRoutes = require('../routes/topics'),
        advertisementRoutes = require('../routes/advertisements'),
        postRoutes = require('../routes/posts'),
        flairRoutes = require('../routes/flairs'),
        userRoutes = require('../routes/users');

module.exports = {
    init(app) {
        app.use(staticRoutes);
        app.use(topicRoutes);
        app.use(advertisementRoutes);
        app.use(postRoutes);
        app.use(flairRoutes);
        app.use(userRoutes);
    }
}
