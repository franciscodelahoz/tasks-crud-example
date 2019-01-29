const express = require('express');
const router = express.Router();

router.get('/profile/:user', (req, res) => {
	res.render('account/profile');
});

module.exports = router;
