const express = require('express');
const router = express.Router();

const database = require('../database/database');
const { isAuthenticated } = require('../lib/isAuthenticated');
const { encryptPassword, compareCryptedPassword } = require('../lib/utils');

const util = require('util');

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
		req.flash('error', 'Error to obtain the login user information');
		return res.redirect('/settings/profile');
	}

	if (!username || !firstname || !lastname) {
		req.flash('error', 'Missing one or more user profile data');
		return res.redirect('/settings/profile');
	}

	database.getConnection(async function(error, connection) {
		if (error) {
			req.flash('error', 'Error conecting to database');
			return res.redirect('/settings/profile');
		}

		connection.query = util.promisify(connection.query);

		try {
			const QueryCheckUsername = `
				SELECT * FROM users WHERE
					username='${username}'
				AND id!='${AuthenticatedUser.id}';
			`;

			const consultedUser = await connection.query(QueryCheckUsername);

			if (consultedUser.length) {
				req.flash('error', 'The username entered is already in use');
				connection.release();
				return res.redirect('/settings/profile');
			}

		} catch (consultedUserError) {
			console.log(consultedUserError);
			connection.release();

			req.flash('error', 'An error occurred while verifying the username');
			return res.redirect('/settings/profile');
		}

		try {
			let queryUpdateProfile = `
				UPDATE users SET
					username='${username}',
					firstname='${firstname}',
					lastname='${lastname}'
				WHERE id='${AuthenticatedUser.id}';
			`;

			await connection.query(queryUpdateProfile);
			connection.release();

			req.flash('success', 'User profile updated successfully');
			return res.redirect('/settings/profile');

		} catch (errorUpdateProfile) {
			console.log(errorUpdateProfile);
			connection.release();

			req.flash('error', `An error occurred while updating the user's profile`);
		}
	});
});

router.post('/updatepassword', isAuthenticated, async (req, res) => {
	let oldPassword = '', newPassword = '', confirmPassword = '';
	let AuthenticatedUser = '';

	if (req.body && req.body.old_password) { oldPassword = req.body.old_password; }
	if (req.body && req.body.new_password) { newPassword = req.body.new_password; }
	if (req.body && req.body.confirm_password) { confirmPassword = req.body.confirm_password; }
	if (req.user) { AuthenticatedUser = req.user; }

	const checkOldPassword = await compareCryptedPassword(AuthenticatedUser.password, oldPassword);

	if (!checkOldPassword) {
		req.flash('error', `The old password is incorrect`);
		return res.redirect('/settings/account');
	}

	if (newPassword !== confirmPassword) {
		req.flash('error', `Passwords do not match`);
		return res.redirect('/settings/account');
	}

	const encryptedPassword = await encryptPassword(newPassword);

	let queryUpdatePassword = `
		UPDATE users SET
			password='${encryptedPassword}'
		WHERE id='${AuthenticatedUser.id}';
	`;

	try {
		await database.query(queryUpdatePassword);
		req.flash('success', 'Password updated successfully');

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
		req.flash('error', `Failed to get the user's login information`);
		return res.redirect('/settings/account');
	}

	if (!email) {
		req.flash('error', 'The email address has not been entered');
		return res.redirect('/settings/account');
	}

	try {
		const QueryCheckUsersEmail = `
			SELECT * FROM users WHERE
				email='${email}'
			AND id!='${AuthenticatedUser.id}';
		`;

		const checkUser = await database.query(QueryCheckUsersEmail);

		if (checkUser.length) {
			req.flash('error', 'The selected mail is already in use');
			return res.redirect('/settings/account');
		}

	} catch (error) {
		console.log(error);
		req.flash('error', 'An error occurred while checking the email address');
		return res.redirect('/settings/account');
	}

	let queryUpdateProfile = `
		UPDATE users SET
			email='${email}'
		WHERE id='${AuthenticatedUser.id}';
	`;

	try {
		await database.query(queryUpdateProfile);
		req.flash('success', 'Mail address has been updated successfully');

	} catch (error) {
		console.log(error);
		req.flash('error', 'An error occurred while updating the Mail Address');
	}

	return res.redirect('/settings/account');
});

router.post('/deleteaccount', isAuthenticated, (req, res) => {
	req.flash('info', `This function has not yet been implemented`);
	return res.redirect('/settings/account');
});

module.exports = router;
