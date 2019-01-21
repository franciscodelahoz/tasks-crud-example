const mysql = require('mysql');
const { promisify } = require('util');

const pool = mysql.createPool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE
});

pool.getConnection((error, connection) => {
	if (error) {
		if (error.code === 'PROTOCOL_CONNECTION_LOST') {
			throw 'DATABASE CONNECTION WAS CLOSED';
		}

		if (error.code === 'ER_CON_COUNT_ERROR') {
			throw 'DATABASE HAS TO MANY CONNECTIONS';
		}

		if (error.code === 'ECONNREFUSED') {
			throw 'DATABASE CONNECTION WAS REFUSED';
		}
	}

	if (connection) { connection.release(); }
	console.log('CONNECTED TO DB');
	return;
});

pool.query = promisify(pool.query);

module.exports = pool;
