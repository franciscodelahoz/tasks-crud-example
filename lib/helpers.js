const { format } = require('timeago.js');
const { toBool } = require('../lib/utils');
const bcrypt = require('bcryptjs');

exports.timeago = (timestamp) => {
	return format(timestamp);
};

exports.formatTime = (timestamp) => {
	return Intl.DateTimeFormat('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		timeZoneName: 'short'
	}).format(new Date(timestamp));
};

exports.task_card_border = (importance) => {
	let className = null;
	switch(importance) {
		case 'low':
			className = 'border border-primary';
			break;
		case 'high':
			className = 'border border-warning';
			break;
		case 'critical':
			className = 'border border-danger';
			break;
		default:
			className = 'border border-success';
			break;
	}
	return className;
};

exports.task_card_background = (importance) => {
	let className = null;
	switch(importance) {
		case 'low':
			className = 'bg-primary';
			break;
		case 'high':
			className = 'bg-warning';
			break;
		case 'critical':
			className = 'bg-danger';
			break;
		default:
			className = 'bg-success';
			break;
	}
	return className;
};

exports.strikethrough = (completed) => {
	return toBool(completed) ? 'strikethrough' : '';
};

exports.checkCompleted = (completed) => {
	return toBool(completed) ? 'checked' : undefined;
};

exports.encryptPassword = async (password) => {
	const salt = await bcrypt.genSalt(10);
	return await bcrypt.hash(password, salt);
};

exports.compareCryptedPassword = async (crypted, password) => {
	return await bcrypt.compare(password, crypted);
};
