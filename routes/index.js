var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Hookups @ CSC',
        scripts: [
            'jquery.min.js',
            'bootstrap.min.js',
            'socket.io.min.js',
            'index.min.js'
        ],
        styles: [
            'index.min.css',
            'bootstrap.min.css',
        ]
    });
});


/* GET information page. */
router.get('/information', function(req, res, next) {
  res.render('information', {
    title: 'Information',
    styles: [
        'information.min.css',
    ]
  });
});

module.exports = router;
