let toDos = localStorage.toDos ? JSON.parse(localStorage.toDos) : [];

// temporary sortable
let sortable = () => { };

function addToDo(toDo) {
	function completeToDo(event) {
		const index = toDos.findIndex((element) => (
			element.complete == !event.target.checked &&
			element.text == event.target.parentElement.children[1].value
		));

		toDos[index].complete = event.target.checked;

		localStorage.toDos = JSON.stringify(toDos);

		updateLeftItems();

		document.getElementById('new_to_do').focus();
	}

	function focusOnNewToDo(event) {
		if (event.key == 'Enter') {
			document.getElementById('new_to_do').focus();
		}
	}

	function changeText(event) {
		const index = toDos.findIndex((element) => (
			element.complete == event.target.parentElement.children[0].checked &&
			element.text == event.target.oldValue
		));

		toDos[index].text = event.target.value.trim();

		localStorage.toDos = JSON.stringify(toDos);

		event.target.oldValue = event.target.value.trim();
	}

	const newToDoCheckBox = document.createElement('input');
	newToDoCheckBox.checked = toDo.complete;
	newToDoCheckBox.type = 'checkbox';
	newToDoCheckBox.onclick = completeToDo;

	const newToDoText = document.createElement('input');
	newToDoText.type = 'text';
	newToDoText.placeholder = 'Edit this to do...';
	newToDoText.value = toDo.text;
	newToDoText.oldValue = toDo.text;
	newToDoText.onkeyup = focusOnNewToDo;
	newToDoText.onchange = changeText;

	const newToDoCloseButton = document.createElement('span');
	newToDoCloseButton.innerText = '✕';
	newToDoCloseButton.onclick = deleteToDo;

	const newToDo = document.createElement('li');
	newToDo.className = 'to_do';
	newToDo.appendChild(newToDoCheckBox);
	newToDo.appendChild(newToDoText);
	newToDo.appendChild(newToDoCloseButton);

	// add todo
	document.getElementById('to_dos').appendChild(newToDo);

	sortable();
}

toDos.forEach(addToDo);

function updateLeftItems(event) {
	const elements = document.getElementById('to_dos').children;

	let uncheckedElements = 0;

	for (let i = 0; i < elements.length; i++) {
		if (!elements[i].firstElementChild.checked) {
			uncheckedElements++;
		}
	}

	document.getElementById('left_items').innerText = `${uncheckedElements} items left`;
}

updateLeftItems(null);

function showAllToDos(toDos) {
	for (let i = 0; i < toDos.length; i++) {
		toDos[i].style.display = 'list-item';
	}

	document.getElementById('new_to_do').focus();
}

function deleteToDo(event) {
	const parentElement = event.target.parentElement;

	toDos.splice(toDos.findIndex((element) => (
		element.complete == !event.target.value &&
		element.text == event.target.parentElement.children[1].value
	)), 1);

	localStorage.toDos = JSON.stringify(toDos);

	document.getElementById('to_dos').removeChild(parentElement);

	updateLeftItems();

	document.getElementById('new_to_do').focus();
}

document.getElementById('icon').addEventListener('click', (event) => {
	if (document.body.className == 'dark') {
		event.target.src = 'assets/icon-sun.svg';
		document.body.className = 'light';
		localStorage.theme = 'light';
	}
	else {
		event.target.src = 'assets/icon-moon.svg';
		document.body.className = 'dark';
		localStorage.theme = 'dark';
	}

	document.getElementById('new_to_do').focus();
});

document.getElementById('new_to_do').addEventListener('keyup', (event) => {
	if (event.key == 'Enter' && event.target.value.trim() != '') {
		toDos.push({
			complete: false,
			text: event.target.value.trim()
		});

		addToDo(toDos[toDos.length - 1]);

		localStorage.toDos = JSON.stringify(toDos);

		// clean text
		event.target.value = '';

		updateLeftItems();
	}
});

document.getElementById('clear_completed').addEventListener('click', (event) => {
	const toDosElement = document.getElementById('to_dos');
	const elements = toDosElement.children;

	for (let i = 0; i < elements.length; i++) {
		if (elements[i].firstElementChild.checked) {
			toDosElement.removeChild(elements[i]);
			toDos.splice(i, 1);
			i--;
		}
	}

	localStorage.toDos = JSON.stringify(toDos);

	updateLeftItems();

	document.getElementById('new_to_do').focus();
});

document.querySelectorAll('.what_show span').forEach((element) => {
	element.addEventListener('click', (event) => {
		const elements = document.getElementById('to_dos').children;

		// remove class selected from other spans
		Array.from(document.getElementsByClassName('selected')).forEach((element) => {
			element.classList.remove('selected');
		});

		switch (element.className) {
			case 'show_all':
				showAllToDos(elements);

				break;
			case 'show_active':
				showAllToDos(elements);

				for (let i = 0; i < elements.length; i++) {
					if (elements[i].firstElementChild.checked) {
						elements[i].style.display = 'none';
					}
				}

				break;
			case 'show_completed':
				showAllToDos(elements);

				for (let i = 0; i < elements.length; i++) {
					if (!elements[i].firstElementChild.checked) {
						elements[i].style.display = 'none';
					}
				}

				break;
		}

		// add class selected to these spans
		Array.from(document.getElementsByClassName(element.className)).forEach((element) => {
			element.classList.add('selected');
		});
	});
});