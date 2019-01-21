exports.isAuthenticated = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	} else {
		return res.redirect('/auth/signin');
	}
};

exports.notIsAuthenticates = (req, res, next) => {
	if (!req.isAuthenticated()) {
		return next();
	} else {
		return res.redirect('/tasks');
	}
};
