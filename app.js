/* Requires all packages */
var express             = require('express');
var path                = require('path');
var favicon             = require('serve-favicon');
var logger              = require('morgan');
var cookieParser        = require('cookie-parser');
var bodyParser          = require('body-parser');
var $                   = require('jquery');
var sessionMiddleware   = require('express-session');
var index               = require('./routes/index');
var users               = require('./routes/users');
var winston             = require('winston');
const chalk             = require('chalk');

var app = express();
app.enable('trust proxy')  // This gives us correct IP from our reverse-proxy

var env = app.settings.env || 'production';

// Configure winston logger to use command line mode
winston.cli();

winston.info(chalk.bold.red(`
        __  __            __
       / / / /___  ____  / /____  ______  _____
      / /_/ / __ \\/ __ \\/ //_/ / / / __ \\/ ___/
     / __  / /_/ / /_/ / ,< / /_/ / /_/ (__  )
    /_/ /_/\\____/\\____/_/|_|\\__,_/ .___/____/
                                /_/
    `) + "\n" +
    chalk.bold.blue("Hello! Welcome to ") + chalk.bold.red("Hookups💋") + "\n"
);

/*
    Production mode specific configuration. Enables gzip content encoding, and
    minifies rendered HTML for faster content transmission.
    Of course, it logs to the console to let you know once it's enabled :P
*/
if ('production' == env) {
    // Packages only required for Production
    var minifyHTML  = require('express-minify-html');
    var compression = require('compression');

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

    winston.info(
        chalk.bold.red("Hookups💋 ") + "is currently " +
        chalk.underline("in production mode") + ":" + "\n" +
        "\t " + "gzip content encoding and HTML minify are enabled." + "\n" +
        "\t " + "For development mode, set " +
        chalk.underline("NODE_ENV=development") + "\n"
    );
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Favicon rendering
app.use(favicon(path.join(__dirname, 'public/img', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());

var session = sessionMiddleware({
    secret: 'crazy cookie girl',
    saveUninitialized: true,
    resave: true,
    // store: new FileStore()
});

app.use(session);

app.session = session;

// Note: you must place sass-middleware *before* `express.static` or else it will
// not work.

/*
    Make sure to use gzip on all resources during production, and set an one
    year long cache-expiry header. Otherwise, files are not to be cached, so
    production changes show up instantly.
*/
if ('production' == env) {
    app.use(
        compression(),
        express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 })
    );
}
else {
    app.use(express.static(path.join(__dirname, 'public'), { maxAge: 0 }));
    winston.info(
        chalk.bold.red("Hookups💋 ") + "is currently " +
        chalk.underline("in development mode") + ":" + "\n" +
        "\t " + "gzip content encoding and HTML minify are " +
        chalk.underline("disabled") + "." + "\n" +
        "\t " + "For production mode, set " +
        chalk.underline("NODE_ENV=production") + "\n"
    );
}

/*
    Logs the startup date of the server, so we can properly check if the
    timezone and opening hours are set properly.
*/
var localTime = new Date();
var compensatedTime = ((localTime.getHours() + parseInt(process.env.TIMEZONEOFFSET)) % 24);

winston.info(
    "Current hour is (rounded down): ~" + compensatedTime + ":00."
);
if ('production' == env) {
    winston.warn(
        "Please note that " + chalk.bold.underline.red("opening hours are in effect")
    );
    winston.warn("Hookups💋 will only be open from 23:00 to 1:00\n");
}
if ('production' !== env) {
    winston.warn(
        "Please note that " + chalk.bold.underline.blue("opening hours are NOT in effect\n")
    );
}

winston.info(
    "In order to exit " + chalk.bold.red("Hookups💋") + ", press " +
    chalk.underline("CTL+C") + "\n"
);

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
    res.render('error', {
      title: 'error',
      // Included resources
      js: ['error.min.js'],
      css: ['error.min.css']
    });
});

module.exports = app;
