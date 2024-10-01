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
        const taskSpan = document.createElement('span');
        taskSpan.textContent = taskText;

        // Copy button
        const copyBtn = document.createElement('button');
        copyBtn.textContent = 'Copy';
        copyBtn.classList.add('copyBtn');
        copyBtn.addEventListener('click', function () {
            navigator.clipboard.writeText(taskText).then(() => {
                copyBtn.textContent = 'Copied!'; // Change text to "Copied!"
                copyBtn.style.backgroundColor = '#2ecc71'; // Optional: Change button color on success

                // Revert back to 'Copy' after 2 seconds
                setTimeout(() => {
                    copyBtn.textContent = 'Copy';
                    copyBtn.style.backgroundColor = ''; // Reset color to default
                }, 2000);
            });
        });

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('deleteBtn');
        deleteBtn.addEventListener('click', function () {
            li.remove();
            deleteTask(taskText);
        });

        li.appendChild(taskSpan);
        li.appendChild(copyBtn);
        li.appendChild(deleteBtn);
        
        // Add the new task at the top of the list
        taskList.insertBefore(li, taskList.firstChild);
    }

    // Save the task to Chrome's storage
    function saveTask(taskText) {
        chrome.storage.local.get('tasks', function (data) {
            const tasks = data.tasks || [];
            tasks.unshift(taskText); // Add new task at the start of the array
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
