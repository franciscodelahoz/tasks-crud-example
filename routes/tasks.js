const express = require('express');
const router = express.Router();

const database = require('../database/database');
const helpers = require('../lib/helpers');
const { toBool } = require('../lib/utils');

const { isAuthenticated } = require('../lib/isAuthenticated');

router.get('/', isAuthenticated, async (req, res) => {
	const tasks = await database.query('SELECT * FROM tasks WHERE userid = ?;', [req.user.id]);

	res.render('tasks_layout/tasks_list', {
		tasks: tasks,
		timeago: helpers.timeago,
		formatTime: helpers.formatTime,
		taskCardBorder: helpers.taskCardBorder,
		strikethrough: helpers.strikethrough,
		checkCompleted: helpers.checkCompleted,
		taskCardBackground: helpers.taskCardBackground
	});
});

router.get('/add', isAuthenticated, (req, res) => {
	res.render('tasks_layout/add_tasks');
});

router.post('/add', isAuthenticated, async (req, res) => {
	const NewTask = {
		name: req.body.t_name,
		importance: req.body.t_importance,
		description: req.body.t_description,
		completed: false,
		userid: req.user.id
	};

	try {
		await database.query('INSERT INTO tasks SET ?', [NewTask]);
		req.flash('success', 'Task added successfully');

	} catch (error) {
		console.log(error);
		req.flash('error', 'An error occurred while creating the task');
	}

	res.redirect('/tasks');
});

router.post('/completed', isAuthenticated, async (req, res) => {
	const id = req.body.id;
	const status = toBool(req.body.status);

	try {
		await database.query('UPDATE tasks SET completed = ? WHERE id = ?', [status, id]);
		return res.status(200).json({ message: status ? 'Taks Completed' : 'Task not completed' });

	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'An error occurred updating the status of the task' });
	}
});

router.get('/delete/:id', isAuthenticated, async (req, res) => {
	const id = req.params.id;

	try {
		await database.query('DELETE FROM tasks WHERE id = ?', [id]);
		req.flash('success', 'Task deleted successfully');

	} catch (error) {
		console.log(error);
		req.flash('error', 'There was an error deleting the task');
	}

	res.redirect('/tasks');
});

router.get('/edit/:id', isAuthenticated, async (req, res) => {
	const id = req.params.id;

	try {
		const selectedTask = await database.query('SELECT * FROM tasks WHERE id = ?', [id]);
		const task = selectedTask[0];

		res.render('tasks_layout/edit_tasks',  { task: task, toBool: toBool });

	} catch (error) {
		console.log(error);
		req.flash('error', 'An error occurred while loading task information');
		res.redirect('/tasks');
	}
});

router.post('/edit/:id', isAuthenticated, async (req, res) => {
	const id = req.params.id;
	const EditTask = {
		name: req.body.t_name,
		importance: req.body.t_importance,
		description: req.body.t_description,
		completed: req.body.t_completed ? true : false
	};

	try {
		await database.query('UPDATE tasks SET ? WHERE id = ?', [EditTask, id]);
		req.flash('success', 'Task edited successfully');

	} catch (error) {
		console.log(error);
		req.flash('error', 'An error occurred while updating the task');
	}

	res.redirect('/tasks');
});

module.exports = router;
