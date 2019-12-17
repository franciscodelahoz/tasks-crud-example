function isAuthenticated(req, res, next) {
	if (req.method === 'GET') {
		if (req.isAuthenticated()) {
			return next();

		} else {
			return res.redirect('/auth/signin');
		}

	} else {
		if (req.isAuthenticated()) {
			return next();

		} else {
			return res.sendStatus(401);
		}
	}
}

function notIsAuthenticates(req, res, next) {
	if (!req.isAuthenticated()) {
		return next();

	} else {
		return res.redirect('/tasks');
	}
}

module.exports = {
	isAuthenticated,
	notIsAuthenticates
};
