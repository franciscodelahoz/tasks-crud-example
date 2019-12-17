const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const database = require('../../database/database');
const { encryptPassword, compareCryptedPassword } = require('../utils');

passport.use('local.signup', new LocalStrategy({
	usernameField: 'u_username',
	passwordField: 'u_password',
	passReqToCallback: true
}, async (req, username, password, done) => {
	const newUser = {
		username,
		password,
		firstname: req.body.u_firstname,
		lastname: req.body.u_lastname,
		email: req.body.u_email,
		cPassword: req.body.u_cpassword
	};

	try {
		const consultedUser = await database.query('SELECT * FROM users WHERE username = ?;', [username]);

		if (consultedUser.length > 0) {
			return done(null, false, req.flash('error', 'The username is already in use'));
		}

		if (newUser.password !== newUser.cPassword) {
			return done(null, false, req.flash('error', 'The password dont match'));
		}

		delete newUser.cPassword;
		newUser.password = await encryptPassword(newUser.password);

		const InsertResult = await database.query('INSERT INTO users SET ?', newUser);
		newUser.id = InsertResult.insertId;

		return done(null, newUser);

	} catch (error) {
		console.log(error);
		return done(null, false, req.flash('error', 'An error occurred while creating the user'));
	}
}));

passport.use('local.signin', new LocalStrategy({
	usernameField: 'username',
	passwordField: 'password',
	passReqToCallback: true
}, async (req, username, password, done) => {
	const rows = await database.query('SELECT * FROM users WHERE username = ?', [username]);

	if (rows.length > 0) {
		const user = rows[0];

		if (await compareCryptedPassword(user.password, password)) {
			done(null, user, req.flash('success', `Welcome ${user.firstname} ${user.lastname}.`));

		} else {
			done(null, false, req.flash('error', 'Invalid password'));
		}

	} else {
		return done(null, false, req.flash('error', 'User not found'));
	}
}));

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser(async (id, done) =>  {
	const rows = await database.query('SELECT * FROM users WHERE id = ?', [id]);
	done(null, rows[0]);
});
