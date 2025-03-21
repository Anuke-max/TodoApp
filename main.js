// Select elements
const addButton = document.getElementById("add-btn");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");

// Function to create a new to-do item
function createTodoItem(task) {
  // Create list item
  const li = document.createElement("li");

  // Create the task text
  const taskText = document.createElement("span");
  taskText.innerText = task;
  li.appendChild(taskText);

  // Add a delete button
  const deleteButton = document.createElement("button");
  deleteButton.innerText = "Delete";
  deleteButton.classList.add("delete-btn");
  deleteButton.onclick = function() {
    li.remove();
  };
  li.appendChild(deleteButton);

  // Mark the task as completed
  taskText.onclick = function() {
    li.classList.toggle("completed");
  };

  // Append the new list item to the todo list
  todoList.appendChild(li);
}

// Event listener for the add button
addButton.addEventListener("click", function() {
  const task = todoInput.value.trim();
  if (task) {
    createTodoItem(task);
    todoInput.value = ""; // Clear the input field after adding the task
  }
});

// Allow pressing Enter to add a task
todoInput.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    addButton.click();
  }
});
