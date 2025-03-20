const apiUrl = '';  // Replace with your API Gateway URL

window.addEventListener('load', () => {
    const nameInput = document.querySelector('#name');
    const newTodoForm = document.querySelector('#new-todo-form');
    const username = localStorage.getItem('username') || '';

    nameInput.value = username;

    nameInput.addEventListener('change', (e) => {
        localStorage.setItem('username', e.target.value);
    });

    newTodoForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const todo = {
            content: e.target.elements.content.value,
            category: e.target.elements.category.value,
            done: false,
            createdAt: new Date().getTime(),
        };

        // POST request to create a new todo in MongoDB
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(todo),
        });

        const result = await response.json();
        DisplayTodos();  // Refresh the todo list
        e.target.reset();
    });

    DisplayTodos();  // Display todos on page load
});

// Fetch and display todos from MongoDB
async function DisplayTodos() {
    const todoList = document.querySelector('#todo-list');
    todoList.innerHTML = "";

    const response = await fetch(apiUrl);
    const todos = await response.json();

    todos.forEach(todo => {
        const todoItem = document.createElement('div');
        todoItem.classList.add('todo-item');

        const label = document.createElement('label');
        const input = document.createElement('input');
        const span = document.createElement('span');
        const content = document.createElement('div');
        const actions = document.createElement('div');
        const edit = document.createElement('button');
        const deleteButton = document.createElement('button');

        input.type = 'checkbox';
        input.checked = todo.done;
        span.classList.add('bubble');
        if (todo.category === 'personal') {
            span.classList.add('personal');
        } else {
            span.classList.add('business');
        }
        content.classList.add('todo-content');
        actions.classList.add('actions');
        edit.classList.add('edit');
        deleteButton.classList.add('delete');

        content.innerHTML = `<input type="text" value="${todo.content}" readonly>`;
        edit.innerHTML = 'Edit';
        deleteButton.innerHTML = 'Delete';

        label.appendChild(input);
        label.appendChild(span);
        actions.appendChild(edit);
        actions.appendChild(deleteButton);
        todoItem.appendChild(label);
        todoItem.appendChild(content);
        todoItem.appendChild(actions);

        todoList.appendChild(todoItem);

        if (todo.done) {
            todoItem.classList.add('done');
        }

        input.addEventListener('change', async (e) => {
            todo.done = e.target.checked;

            // PATCH request to update todo in MongoDB
            await fetch(`${apiUrl}/${todo._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ done: todo.done }),
            });

            DisplayTodos();  // Refresh the todo list
        });

        edit.addEventListener('click', (e) => {
            const input = content.querySelector('input');
            input.removeAttribute('readonly');
            input.focus();
            input.addEventListener('blur', async (e) => {
                input.setAttribute('readonly', true);
                todo.content = e.target.value;

                // PATCH request to update todo content in MongoDB
                await fetch(`${apiUrl}/${todo._id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ content: todo.content }),
                });

                DisplayTodos();  // Refresh the todo list
            });
        });

        deleteButton.addEventListener('click', async () => {
            // DELETE request to remove todo from MongoDB
            await fetch(`${apiUrl}/${todo._id}`, {
                method: 'DELETE',
            });

            DisplayTodos();  // Refresh the todo list
        });
    });
}
