var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Hookups @ CSC',
        // Included resources
        js: ['index.min.js'],
        css: ['index.min.css']
    });
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

module.exports = router;
