const   express = require('express'),
        router = express.Router(),
        flairController = require('../controllers/flairController');

router.get('/flairs', flairController.index);
router.get('/flairs/new', flairController.new);
router.get('/flairs/:id', flairController.show);
router.post('/flairs/create', flairController.create);
router.get('/flairs/:id/edit', flairController.edit);
router.post('/flairs/:id/update', flairController.update);
router.post('/flairs/:id/destroy', flairController.destroy);

module.exports = router;
