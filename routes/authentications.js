const express = require('express');
const router = express.Router();
const passport = require('passport');

const { isAuthenticated, notIsAuthenticates } = require('../lib/isAuthenticated');

router.get('/signup', notIsAuthenticates, (req, res) => {
	res.render('auth/signup');
});

router.post('/signup', notIsAuthenticates, passport.authenticate('local.signup', {
	successRedirect: '/tasks',
	failureRedirect: '/auth/signup',
	failureFlash: true
}));

router.get('/signin', notIsAuthenticates, (req, res) => {
	res.render('auth/signin');
});

router.post('/signin', notIsAuthenticates, (req, res, next) => {
	passport.authenticate('local.signin', {
		successRedirect: '/tasks',
		failureRedirect: '/auth/signin',
		failureFlash: true
	})(req, res, next);
});

router.get('/logout', isAuthenticated, (req, res) => {
	req.logOut();
	res.redirect('/auth/signin');
});

module.exports = router;
