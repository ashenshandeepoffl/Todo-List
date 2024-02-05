document.addEventListener('DOMContentLoaded', function () {
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');
    const filterOptions = document.getElementById('filterOptions');
    const addTaskBtn = document.getElementById('addTaskBtn');

    // Load tasks from local storage on page load
    loadTasks();

    addTaskBtn.addEventListener('click', addTask);
    filterOptions.addEventListener('change', filterTasks);

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            const task = {
                text: taskText,
                completed: false
            };
            addTaskToDOM(task);
            saveTaskToLocalStorage(task);
            taskInput.value = '';
        }
    }

    function addTaskToDOM(task) {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="${task.completed ? 'completed' : ''}">${task.text}</span>
            <div>
                <button onclick="toggleTaskCompletion(this)">Complete</button>
                <button onclick="removeTask(this)">Remove</button>
            </div>
        `;
        taskList.appendChild(li);
    }

    function toggleTaskCompletion(button) {
        const li = button.parentElement.parentElement;
        const span = li.querySelector('span');
        const tasks = getTasksFromLocalStorage();
        const taskIndex = Array.from(li.parentElement.children).indexOf(li);
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        saveTasksToLocalStorage(tasks);
        span.classList.toggle('completed');
    }

    function removeTask(button) {
        const li = button.parentElement.parentElement;
        const tasks = getTasksFromLocalStorage();
        const taskIndex = Array.from(li.parentElement.children).indexOf(li);
        tasks.splice(taskIndex, 1);
        saveTasksToLocalStorage(tasks);
        li.remove();
    }

    function filterTasks() {
        const filterValue = filterOptions.value;
        const tasks = taskList.getElementsByTagName('li');

        for (const task of tasks) {
            switch (filterValue) {
                case 'all':
                    task.style.display = 'flex';
                    break;
                case 'completed':
                    task.style.display = task.querySelector('span').classList.contains('completed') ? 'flex' : 'none';
                    break;
                case 'active':
                    task.style.display = task.querySelector('span').classList.contains('completed') ? 'none' : 'flex';
                    break;
            }
        }
    }

    function saveTaskToLocalStorage(task) {
        const tasks = getTasksFromLocalStorage();
        tasks.push(task);
        saveTasksToLocalStorage(tasks);
    }

    function getTasksFromLocalStorage() {
        return JSON.parse(localStorage.getItem('tasks')) || [];
    }

    function saveTasksToLocalStorage(tasks) {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = getTasksFromLocalStorage();
        for (const task of tasks) {
            addTaskToDOM(task);
        }
    }
});
