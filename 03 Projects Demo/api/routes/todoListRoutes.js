'use strict';

module.exports = function (app) {
	var todoList = require('../controllers/todoListController');

	// todoList Routes
	app.route('/tasks')
		.get(todoList.list_all_tasks)
		.post(todoList.create_a_task);

	app.route('/tasks/:taskId')
		.get(todoList.read_a_task)
		.put(todoList.update_a_task)
		.delete(todoList.delete_a_task);

	app.route('/search-tasks/:textSearch')
		.get(todoList.search_a_task)

	app.route('/search-tasks-paginate/:textSearch/:qtt/:pageIdx')
		.get(todoList.search_paginate)

	app.route('/tasks-paginate/:qtt/:pageIdx')
		.get(todoList.get_task_paginate)

	app.route('/upload')
		.post(todoList.upload)
};
