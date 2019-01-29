const bcrypt = require('bcryptjs');

exports.toBool = (value) => {
	if (value == true  || value == 1 || value == 'true'  || value == '1' || value == 'True' ) { return true;  }
	if (value == false || value == 0 || value == 'false' || value == '0' || value == 'False') { return false; }
};

exports.encryptPassword = async (password) => {
	const salt = await bcrypt.genSalt(10);
	return await bcrypt.hash(password, salt);
};

exports.compareCryptedPassword = async (crypted, password) => {
	return await bcrypt.compare(password, crypted);
};
