const express = require('express');
const router = express.Router();

const database = require('../database/database');

router.get('/profile/:user', async (req, res) => {
	let UserToSearch = '', UserInformation = {}, _Error = false;
	let Found = false;

	if (req.params && req.params.user) {
		UserToSearch = req.params.user;
	}

	try {
		const SelectUser = `
			SELECT
				a.username as username,
				a.firstname as firstname,
				a.lastname as lastname,
				(select count(*) from tasks x where x.user_id = a.id) as tasks_count,
				(select count(*) from tasks x where x.user_id = a.id and x.completed = 1) as tasks_completed
			from
				users a
			where a.username = '${UserToSearch}';
		`;

		userConsult = await database.query(SelectUser);

		if (userConsult.length) {
			UserInformation = userConsult[0];
			Found = true;
		}

	} catch (error) {
		console.log(error);
		_Error = true;
	}

	res.render('account/profile', {
		UserInformation: UserInformation,
		Found: Found,
		_Error: _Error
	});
});

module.exports = router;
