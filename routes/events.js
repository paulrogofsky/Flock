var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

router.get('/CreateEvent',function(req,res,next) {
	res.render('CreateEvent');
});

router.get('/CreateGroup', function(req, res) {
	res.render('CreateGroup');
});

module.exports = router;