const express = require('express');
const router = express.Router();

const { isAuthenticated } = require('../lib/isAuthenticated');

router.get('/profile', isAuthenticated, (req, res) => {
	res.render('settings/profile');
});

router.get('/account', isAuthenticated, (req, res) => {
	res.render('settings/account');
});

module.exports = router;
