/* Requires all packages */
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var $ = require('jquery');
var session = require('express-session');
var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

/*
    Production mode specific configuration. Enables gzip content encoding, and
    minifies rendered HTML for faster content transmission.
    Of course, it logs to the console to let you know once it's enabled :P
*/
var env = app.settings.env || 'production';
if ('production' == env) {
    // Packages only required for Production
    var minifyHTML = require('express-minify-html');
    var compression = require('compression');

    console.info("App is now running in production mode.")
    console.info("Gzip content encoding and HTML minify is enabled.")

    // Uses gzip encoding for faster content encoding, and sets cache time
    app.use(
        compression(),
        express.static(__dirname + '/public', { maxAge: 31557600 })
    );

    /* Minifies the HTML when npm is run as production mode */
    app.use(minifyHTML({
        override:      true,
        exception_url: false,
        htmlMinifier: {
            removeComments:            true,
            collapseWhitespace:        true,
            collapseBooleanAttributes: true,
            removeAttributeQuotes:     true,
            removeEmptyAttributes:     true,
            minifyJS:                  true
        }
    }));
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Favicon rendering
app.use(favicon(path.join(__dirname, 'public/img', 'favicon.ico')));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());

app.use(session({
    name: 'hoocookies',
    secret: 'crazy cookie girl',
    saveUninitialized: true,
    resave: true,
    // store: new FileStore()
}));

app.session = session;

// Note: you must place sass-middleware *before* `express.static` or else it will
// not work.

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
