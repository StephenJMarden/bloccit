const   staticRoutes = require('../routes/static'),
        topicRoutes = require('../routes/topics'),
        advertisementRoutes = require('../routes/advertisements'),
        postRoutes = require('../routes/posts');

module.exports = {
    init(app) {
        app.use(staticRoutes);
        app.use(topicRoutes);
        app.use(advertisementRoutes);
        app.use(postRoutes);
    }
}
