import CompleteTask from './modules/complete_task.js';

window.changeTaskStatus = function changeTaskStatus(checkbox) {
	const completeTask = new CompleteTask(checkbox);

	completeTask.sendRequest()
		.then(() => {
			completeTask.strikethrough();
		})
		.catch(error => {
			alert(`Error: ${error}`);
		});
};
