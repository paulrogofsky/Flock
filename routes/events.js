var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

router.get('/Events/Create',function(req,res,next) {
	res.render('CreateEvent');
});

router.get('/Groups/Create', function(req, res) {
	res.render('CreateGroup');
});

router.post('/CreateEvent', function(req, res, next) {
	
});

module.exports = router;