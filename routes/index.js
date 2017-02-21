var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
      title: 'Hookups @ CSC',
      scripts: 'index.min.js',
      style: 'index.min.css'
  });
});

/* GET information page. */
router.get('/information', function(req, res, next) {
  res.render('information', {
      title: 'Information',
      script: 'information.min.js',
      style: 'information.min.css'
  });
});

module.exports = router;
