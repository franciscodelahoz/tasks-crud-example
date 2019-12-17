const { format } = require('timeago.js');
const { toBool } = require('../lib/utils');

function timeago(timestamp) {
	return format(timestamp);
}

function formatTime(timestamp) {
	return Intl.DateTimeFormat('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		timeZoneName: 'short'
	}).format(new Date(timestamp));
}

function taskCardBorder(importance) {
	let className = null;

	switch (importance) {
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
}

function taskCardBackground(importance) {
	let className = null;

	switch (importance) {
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
}

function strikethrough(completed) {
	return toBool(completed) ? 'strikethrough' : '';
}

function checkCompleted(completed) {
	return toBool(completed) ? 'checked' : undefined;
}

module.exports = {
	timeago,
	formatTime,
	taskCardBorder,
	taskCardBackground,
	strikethrough,
	checkCompleted
};
