exports.isAuthenticated = (req, res, next) => {
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
};

exports.notIsAuthenticates = (req, res, next) => {
	if (!req.isAuthenticated()) {
		return next();
	} else {
		return res.redirect('/tasks');
	}
};
