export default class CompleteTask {
	constructor(checkbox) {
		this.value = checkbox.checked;
		this.id = checkbox.id.split('_')[1];
		this.label = checkbox.parentElement.querySelector('.t_name');
	}

	handleResponse(response) {
		return response.json()
			.then(json => {
				if (!response.ok) {
					const error = Object.assign({}, json, {
						status: response.status,
						statusText: response.statusText
					});

					return Promise.reject(error);
				}

				return json;
			});
	}

	strikethrough() {
		if (this.value) {
			this.label.style.textDecoration = 'line-through';
			this.label.title = 'Task Completed';

		} else {
			this.label.style.textDecoration = 'none';
			this.label.removeAttribute('title');
		}
	}

	sendRequest() {
		return new Promise((resolve, reject) => {
			fetch('/tasks/completed', {
				method: 'POST',
				body: new URLSearchParams({
					'id': this.id,
					'status': this.value
				})
			}).then(this.handleResponse)
				.then(result => { resolve(result.message); })
				.catch(error => { reject(error.message); });
		});
	}
}
