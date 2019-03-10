const express = require('express');
const router = express.Router();

const db = require('../database/database');
const { isAuthenticated } = require('../lib/isAuthenticated');
const { encryptPassword, compareCryptedPassword } = require('../lib/utils');

router.get('/', isAuthenticated, (req, res) => {
	res.redirect('settings/profile');
});

router.get('/profile', isAuthenticated, (req, res) => {
	res.render('settings/profile');
});

router.get('/account', isAuthenticated, (req, res) => {
	res.render('settings/account');
});

router.post('/updateprofile', isAuthenticated, async (req, res) => {
	let username = '', firstname = '', lastname = '';
	let AuthenticatedUser = '';

	if (req.body && req.body.username)  { username = req.body.username;   }
	if (req.body && req.body.firstname) { firstname = req.body.firstname; }
	if (req.body && req.body.lastname)  { lastname = req.body.lastname;   }
	if (req.user) { AuthenticatedUser = req.user; }

	if (!AuthenticatedUser) {
		req.flash('error', 'Error to obtaine the login user information');
		return res.redirect('/settings/profile');
	}

	if (!username || !firstname || !lastname) {
		req.flash('error', 'Some profile data is missing');
		return res.redirect('/settings/profile');
	}

	try {
		const QueryCheckUsername = `
			SELECT * FROM users WHERE
				username='${username}'
			AND id!='${AuthenticatedUser.id}';
		`;

		const check_user = await db.query(QueryCheckUsername);

		if (check_user.length) {
			req.flash('error', 'The username selected is in used');
			return res.redirect('/settings/profile');
		}

	} catch(error) {
		console.log(error);
		req.flash('error', 'A error has ocurred while is checking the user name');
		return res.redirect('/settings/profile');
	}

	let queryUpdateProfile = `
		UPDATE users SET
			username='${username}',
			firstname='${firstname}',
			lastname='${lastname}'
		WHERE id='${AuthenticatedUser.id}';
	`;

	try {
		await db.query(queryUpdateProfile);
		req.flash('success', 'Profile updated successfully');
	} catch (error) {
		console.log(error);
		req.flash('error', 'An error occurred while updating the profile');
	}

	return res.redirect('/settings/profile');
});

router.post('/updatepassword', isAuthenticated, async (req, res) => {
	let old_password = '', new_password = '', confirm_password = '';
	let AuthenticatedUser = '';

	if (req.body && req.body.old_password) { old_password = req.body.old_password; }
	if (req.body && req.body.new_password) { new_password = req.body.new_password; }
	if (req.body && req.body.confirm_password) { confirm_password = req.body.confirm_password; }
	if (req.user) { AuthenticatedUser = req.user; }

	const checkOldPassword = await compareCryptedPassword(AuthenticatedUser.password, old_password);

	if (!checkOldPassword) {
		req.flash('error', `The old password is incorrect`);
		return res.redirect('/settings/account');
	}

	if (new_password !== confirm_password) {
		req.flash('error', `The password doesn't match`);
		return res.redirect('/settings/account');
	}

	const crypt_pass = await encryptPassword(new_password);

	let queryUpdatePassword = `
		UPDATE users SET
			password='${crypt_pass}'
		WHERE id='${AuthenticatedUser.id}';
	`;

	try {
		await db.query(queryUpdatePassword);
		req.flash('success', 'password updated successfully');
	} catch (error) {
		console.log(error);
		req.flash('error', 'An error occurred while updating the password');
	}

	return res.redirect('/settings/account');
});

router.post('/update_email', isAuthenticated, async (req, res) => {
	let email = '', AuthenticatedUser = '';

	if (req.body && req.body.email) { email = req.body.email; }
	if (req.user) { AuthenticatedUser = req.user; }

	if (!AuthenticatedUser) {
		req.flash('error', 'Error to obtain the login user information');
		return res.redirect('/settings/account');
	}

	if (!email) {
		req.flash('error', 'The email is missing');
		return res.redirect('/settings/account');
	}

	try {
		const QueryCheckUsersEmail = `
			SELECT * FROM users WHERE
				email='${email}'
			AND id!='${AuthenticatedUser.id}';
		`;

		const check_user = await db.query(QueryCheckUsersEmail);

		if (check_user.length) {
			req.flash('error', 'The email selected is in used');
			return res.redirect('/settings/account');
		}

	} catch(error) {
		console.log(error);
		req.flash('error', 'A error has ocurred while is checking the user name');
		return res.redirect('/settings/account');
	}

	let queryUpdateProfile = `
		UPDATE users SET
			email='${email}'
		WHERE id='${AuthenticatedUser.id}';
	`;

	try {
		await db.query(queryUpdateProfile);
		req.flash('success', 'Email updated successfully');
	} catch (error) {
		console.log(error);
		req.flash('error', 'An error occurred while updating the profile');
	}

	return res.redirect('/settings/account');
});

router.post('/deleteaccount', isAuthenticated, (req, res) => {
	req.flash('info', `This function is not implemented`);
	return res.redirect('/settings/account');
});

module.exports = router;
