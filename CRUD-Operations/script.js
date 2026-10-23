
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const message = document.getElementById("message");

// Read saved tasks from localStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Used to identify which task is being edited
let editingId = null;

// Save tasks in the browser
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Display all tasks
function displayTasks() {
    taskList.innerHTML = "";

    tasks.forEach(function (task) {
        const li = document.createElement("li");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        checkbox.addEventListener("change", function () {
            task.completed = checkbox.checked;
            saveTasks();
            displayTasks();
        });

        const span = document.createElement("span");
        span.className = "task-text";
        span.textContent = task.title;

        if (task.completed) {
            span.classList.add("completed");
        }

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.className = "edit-btn";

        editBtn.addEventListener("click", function () {
            taskInput.value = task.title;
            editingId = task.id;
            addBtn.textContent = "Update Task";
            taskInput.focus();
            message.textContent = "";
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete-btn";

        deleteBtn.addEventListener("click", function () {
            tasks = tasks.filter(function (item) {
                return item.id !== task.id;
            });

            if (editingId === task.id) {
                resetForm();
            }

            saveTasks();
            displayTasks();
        });

        li.append(checkbox, span, editBtn, deleteBtn);
        taskList.appendChild(li);
    });
}

// Add a new task or update an existing task
function addOrUpdateTask() {
    const title = taskInput.value.trim();

    if (title === "") {
        message.textContent = "Please enter a task!";
        return;
    }

    message.textContent = "";

    if (editingId !== null) {
        const task = tasks.find(function (item) {
            return item.id === editingId;
        });

        if (task) {
            task.title = title;
        }
    } else {
        const newTask = {
            id: Date.now(),
            title: title,
            completed: false
        };

        tasks.push(newTask);
    }

    saveTasks();
    resetForm();
    displayTasks();
}

// Reset input after adding or updating
function resetForm() {
    taskInput.value = "";
    editingId = null;
    addBtn.textContent = "Add Task";
}

// Button click event
addBtn.addEventListener("click", addOrUpdateTask);

// Enter key support
taskInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        addOrUpdateTask();
    }
});

// Show saved tasks when the page loads
displayTasks();
