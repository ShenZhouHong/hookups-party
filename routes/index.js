var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Hookups @ CSC', script: 'scripts.js' });
});

/* GET chat page. */
router.get('/chat', function(req, res, next) {
  res.render('chat', { title: 'Hooking Up ;)', script: 'chat.js' });
});

module.exports = router;
