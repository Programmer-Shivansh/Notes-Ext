document.addEventListener('DOMContentLoaded', function () {
    const taskInput = document.getElementById('newTask');
    const taskList = document.getElementById('taskList');
    const addTaskBtn = document.getElementById('addTaskBtn');

    // Load saved tasks
    chrome.storage.local.get('tasks', function (data) {
        if (data.tasks) {
            data.tasks.forEach((task) => addTaskToDOM(task));
        }
    });

    // Add a new task
    addTaskBtn.addEventListener('click', function () {
        const taskText = taskInput.value.trim();
        if (taskText) {
            addTaskToDOM(taskText);
            saveTask(taskText);
            taskInput.value = '';
        }
    });

    // Function to add task to the DOM
    function addTaskToDOM(taskText) {
        const li = document.createElement('li');
        li.textContent = taskText;

        // Copy button
        const copyBtn = document.createElement('button');
        copyBtn.textContent = 'Copy';
        copyBtn.addEventListener('click', function () {
            navigator.clipboard.writeText(taskText);
        });

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', function () {
            li.remove();
            deleteTask(taskText);
        });

        li.appendChild(copyBtn);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    }

    // Save the task to Chrome's storage
    function saveTask(taskText) {
        chrome.storage.local.get('tasks', function (data) {
            const tasks = data.tasks || [];
            tasks.push(taskText);
            chrome.storage.local.set({ tasks });
        });
    }

    // Delete task from storage
    function deleteTask(taskText) {
        chrome.storage.local.get('tasks', function (data) {
            const tasks = data.tasks || [];
            const updatedTasks = tasks.filter((task) => task !== taskText);
            chrome.storage.local.set({ tasks: updatedTasks });
        });
    }
});
