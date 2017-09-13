var express = require('express');
var app = express();
var router = express.Router();

router.use(function (req, res, next) {
    if (req.cookies.blocked === "blocked") {
        res.redirect("http://www.solidhookups.com/");
    } else {
        next()
    }
})

/* GET home page. */
router.get('/', function(req, res, next) {
    var date = new Date ();
    var target = new Date();
    target.setHours(23);
    target.setMinutes(00);
    target.setSeconds(0);
    if (app.settings.env !== "production" || (target.getTime() - date.getTime()) <= 0) {
        res.render('index', {
            title: 'Hookups @ CSC',
            // Included resources
            js: ['index.min.js'],
            css: ['index.min.css']
        });
    } else {
        res.render('wait', {
            title: 'Wait for Hookups @ CSC',
            // Included resources
            js: ['wait.min.js'],
            css: ['wait.min.css']
        });
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
});

/* GET session error page. */
router.get('/session', function(req, res, next) {
    res.render('session', {
      title: 'Session Error!',
      // Included resources
      js: ['session.min.js'],
      css: ['session.min.css']
    });
});

router.get('/blockme', function(req,res,next){
    res.cookies('blocked', 'blocked', {maxAge: -1});
    res.redirect("/");
});

module.exports = router;
