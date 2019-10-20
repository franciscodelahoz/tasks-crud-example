const bcrypt = require('bcryptjs');

function toBool(value) {
	if (value === true  || value === 1 || value === 'true'  || value === '1' || value === 'True') {
		return true;
	}

	if (value === false || value === 0 || value === 'false' || value === '0' || value === 'False') {
		return false;
	}
}

async function encryptPassword(password) {
	const salt = await bcrypt.genSalt(10);
	return await bcrypt.hash(password, salt);
}

async function compareCryptedPassword(crypted, password) {
	return await bcrypt.compare(password, crypted);
}

module.exports = {
	toBool,
	encryptPassword,
	compareCryptedPassword
};
