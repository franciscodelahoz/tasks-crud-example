const express = require('express');
const router = express.Router();

const { isAuthenticated } = require('../lib/isAuthenticated');

router.get('/profile', isAuthenticated, (req, res) => {
	res.render('account/profile');
});

module.exports = router;
