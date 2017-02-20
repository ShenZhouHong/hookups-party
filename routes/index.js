var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
      title: 'Hookups @ CSC',
      scripts: ['chat.js', 'scripts.js'],
      style: 'style.css'
  });
});

/* GET chat page. */
router.get('/chat', function(req, res, next) {
  res.render('chat', {
      title: 'Hooking Up ;)',
      scripts: ['chat.js'],
      style: 'chat.css'
  });
});

/* GET information page. */
router.get('/information', function(req, res, next) {
  res.render('information', {
      title: 'Information',
      script: 'information.js',
      style: 'information.css'
  });
});

module.exports = router;
