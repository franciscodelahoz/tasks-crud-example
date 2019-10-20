CREATE DATABASE tasks_example;

USE tasks_example;

CREATE TABLE users (
	id INT(11) NOT NULL AUTO_INCREMENT, PRIMARY KEY (id),
	username VARCHAR(25) NOT NULL,
	firstname VARCHAR(50) NOT NULL,
	lastname VARCHAR(50) NOT NULL,
	email VARCHAR(80) NOT NULL,
	password VARCHAR(60) NOT NULL
);

DESCRIBE users;

CREATE TABLE tasks (
	id INT(11) NOT NULL AUTO_INCREMENT, PRIMARY KEY (id),
	name VARCHAR(255) NOT NULL,
	importance VARCHAR(10) NOT NULL,
	description TEXT,
	completed BOOLEAN,
	user_id INT(11),
	created_time TIMESTAMP NOT NULL DEFAULT current_timestamp,
	CONSTRAINT fk_users FOREIGN KEY (user_id) REFERENCES users(id)
);

DESCRIBE tasks;
