var express = require('express');
var app     = express();
var router  = express.Router();
var winston = require('winston');
const chalk = require('chalk');

/* If blocked, redirect to fishing site */
router.use(function (req, res, next) {
    if (req.cookies.blocked === "blocked") {
        res.redirect("http://www.solidhookups.com/");
        winston.warn(
            chalk.bold.underline(req.ip) + " blocked: redirecting to solidhookups.com:"
        );
    } else {
        next()
    }
})

/* GET home page. */
router.get('/', function(req, res, next) {
    var localTime = new Date ();
    var compensatedTime = ((localTime.getHours() + parseInt(process.env.TIMEZONEOFFSET)) % 24);

    if (
        app.settings.env !== "production" ||
        (date.getHours() + compensatedTime >= 23)
    ) {
        res.render('index', {
            title: 'Hookups @ CSC',
            // Included resources
            js: ['index.min.js'],
            css: ['index.min.css']
        });

        // Logs the deferral to waiting */
        winston.info(
            chalk.bold.underline(req.ip) + " connected, GET /index:"
        );

    } else {
        res.render('wait', {
            title: 'Wait for Hookups @ CSC',
            // Included resources
            js: ['wait.min.js'],
            css: ['wait.min.css']
        });

        winston.info(
            chalk.bold.underline(req.ip) + " connected, deferred to waiting screen:"
        );
        winston.info(
            "- Hour now  : " + compensatedTime
        );
        winston.info(
            "- Must wait : " + (23 - compensatedTime) + " more hours... \n"
        );
    }
});

/* GET information page. */
router.get('/information', function(req, res, next) {
    res.render('information', {
      title: 'Information',
      // Included resources
      js: ['information.min.js'],
      css: ['information.min.css']
    });
    winston.info(
        chalk.bold.underline(req.ip) + " connected: GET /information:"
    );
});

/* GET offended page. */
router.get('/offended', function(req, res, next) {
    res.render('offended', {
      title: 'So you\'re offended?',
      // Included resources
      js: ['offended.min.js'],
      css: ['offended.min.css']
    });
    winston.warn(
        chalk.bold.underline(req.ip) + " connected: GET /offended:"
    );
});

/* GET session error page. */
router.get('/session', function(req, res, next) {
    res.render('session', {
      title: 'Session Error!',
      // Included resources
      js: ['session.min.js'],
      css: ['session.min.css']
    });
    winston.info(
        chalk.bold.underline(req.ip) + " connected: GET /session:"
    );
});

router.get('/blockme', function(req,res,next){
    res.cookies('blocked', 'blocked', {maxAge: -1});
    res.redirect("/");
    winston.info(
        chalk.bold.underline(req.ip) + " connected: GET /blockme:"
    );
});

module.exports = router;
