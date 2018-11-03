require('dotenv').config();
const   path = require('path'),
        viewsFolder = path.join(__dirname, '..', 'views'),
        bodyParser = require('body-parser'),
        expressValidator = require('express-validator'),
        session = require('express-session'),
        flash = require('express-flash');

module.exports = {
    init(app, express) {
        app.set('views', viewsFolder);
        app.set('view engine', 'ejs');
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(expressValidator());
        app.use(session({
            secret: process.env.cookieSecret,
            resave: false,
            saveUninitialized: false,
            cookie: { maxAge: 60000 }
        }));
        app.use(flash());
        app.use(express.static(path.join(__dirname, '..', 'assets')));
    }
}
