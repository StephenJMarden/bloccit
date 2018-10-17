const   staticRoutes = require('../routes/static'),
        topicRoutes = require('../routes/topics');

module.exports = {
    init(app) {
        app.use(staticRoutes);
        app.use(topicRoutes);
    }
}
