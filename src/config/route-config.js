const   staticRoutes = require('../routes/static'),
        topicRoutes = require('../routes/topics'),
        advertisementRoutes = require('../routes/advertisements'),
        postRoutes = require('../routes/posts'),
        flairRoutes = require('../routes/flairs'),
        userRoutes = require('../routes/users'),
        commentRoutes = require('../routes/comments');

module.exports = {
    init(app) {
        if(process.env.NODE_ENV.trim() === 'test') {
            const mockAuth = require('../../spec/support/mock-auth.js');
            mockAuth.fakeIt(app);
        }

        app.use(staticRoutes);
        app.use(topicRoutes);
        app.use(advertisementRoutes);
        app.use(postRoutes);
        app.use(flairRoutes);
        app.use(userRoutes);
        app.use(commentRoutes);
    }
}
