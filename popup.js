document.addEventListener('DOMContentLoaded', function () {
    const taskInput = document.getElementById('newTask');
    const taskList = document.getElementById('taskList');
    const addTaskBtn = document.getElementById('addTaskBtn');

    // Load saved tasks
    chrome.storage.local.get('tasks', function (data) {
        if (data.tasks) {
            data.tasks.forEach((task) => addTaskToDOM(task.text, task.completed));
        }
    });

    // Add a new task
    addTaskBtn.addEventListener('click', function () {
        const taskText = taskInput.value.trim();
        if (taskText) {
            addTaskToDOM(taskText, false);
            saveTask({ text: taskText, completed: false });
            taskInput.value = '';
        }
    });
    taskInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') { // Check if the pressed key is Enter
            event.preventDefault(); // Prevent the default action (like form submission)
            const taskText = taskInput.value.trim();
            if (taskText) {
                addTaskToDOM(taskText, false);
                saveTask({ text: taskText, completed: false });
                taskInput.value = '';
            }
        }
    });
    // Function to add task to the DOM
    function addTaskToDOM(taskText, completed) {
        const li = document.createElement('li');
        const taskSpan = document.createElement('span');
        taskSpan.textContent = taskText;
        taskSpan.classList.add('task-text');
        if (completed) {
            taskSpan.classList.add('completed');
        }

        // Copy button (small edit logo)
        const copyBtn = document.createElement('button');
        copyBtn.innerHTML = '<i class="fas fa-copy"></i>'; // Using Font Awesome copy icon
        copyBtn.classList.add('copyBtn');
        copyBtn.addEventListener('click', function () {
            navigator.clipboard.writeText(taskText).then(() => {
                copyBtn.innerHTML = '<i class="fas fa-check"></i>'; // Change to check icon on success
                setTimeout(() => {
                    copyBtn.innerHTML = '<i class="fas fa-copy"></i>'; // Change back to copy icon
                }, 2000);
            });
        });

        // Delete button (small delete logo)
        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>'; // Using Font Awesome trash icon
        deleteBtn.classList.add('deleteBtn');
        deleteBtn.addEventListener('click', function () {
            li.remove();
            deleteTask(taskText);
        });

        // Edit button (small edit logo)
        const editBtn = document.createElement('button');
        editBtn.innerHTML = '<i class="fas fa-edit"></i>'; // Using Font Awesome edit icon
        editBtn.classList.add('editBtn');
        editBtn.addEventListener('click', function () {
            const newText = prompt("Edit task:", taskText);
            if (newText && newText.trim() !== '') {
                updateTaskText(taskText, newText.trim());
                taskSpan.textContent = newText.trim();
                taskText = newText.trim(); // Update the taskText variable
            }
        });

        li.appendChild(taskSpan);
        li.appendChild(copyBtn);   // Append copy button
        li.appendChild(editBtn);    // Append edit button
        li.appendChild(deleteBtn);  // Append delete button

        taskList.insertBefore(li, taskList.firstChild); // Add task to top
    }

    // Save the task to Chrome's storage
    function saveTask(task) {
        chrome.storage.local.get('tasks', function (data) {
            const tasks = data.tasks || [];
            tasks.unshift(task); // Add new task at the start of the array
            chrome.storage.local.set({ tasks });
        });
    }

    // Update task text in storage
    function updateTaskText(oldText, newText) {
        chrome.storage.local.get('tasks', function (data) {
            const tasks = data.tasks.map((task) => {
                if (task.text === oldText) {
                    task.text = newText;
                }
                return task;
            });
            chrome.storage.local.set({ tasks });
        });
    }

    // Delete task from storage
    function deleteTask(taskText) {
        chrome.storage.local.get('tasks', function (data) {
            const tasks = data.tasks.filter((task) => task.text !== taskText);
            chrome.storage.local.set({ tasks });
        });
    }
});
