var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');


router.get('/CreateGroup', function(req, res) {
	res.render('CreateGroup');
});

module.exports = router;