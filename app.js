/* Requires all packages */
var compression = require('compression');
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
var minifyHTML = require('express-minify-html');

var app = express();

/* Uses gzip encoding for faster content encoding, and sets cache time */
app.use(
    compression(),
    express.static(__dirname + '/public', { maxAge: 31557600 })
);

app.use(
    favicon(path.join(__dirname, 'public/img', 'favicon.ico'))
)

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

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your f\avicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
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
