document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput')
    const addTaskBtn = document.getElementById('addTaskBtn')
    const taskList = document.getElementById('taskList')
    let selectedColor = '#f9f9f9'

    // Load tasks from localStorage
    loadTasks()

    // Add event listeners for color options
    const colorOptions = document.querySelectorAll('.color-option')
    colorOptions.forEach(option => {
        option.addEventListener('click', () => {
            selectedColor = option.getAttribute('data-color')
            colorOptions.forEach(opt => opt.classList.remove('selected'))
            option.classList.add('selected')
            document.body.style.backgroundColor = selectedColor // Change background color of the entire page
        })
    })

    addTaskBtn.addEventListener('click', () => {
        const taskText = taskInput.value.trim()
        if (taskText !== '') {
            addTask(taskText, selectedColor)
            saveTask(taskText, selectedColor)
            taskInput.value = ''
        }
    })

    taskInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            addTaskBtn.click()
        }
    })

    function addTask(taskText, color, completed = false) {
        const li = document.createElement('li')
        li.className = 'task-item'
        li.style.backgroundColor = color

        if (completed) {
            li.classList.add('completed')
        }

        const span = document.createElement('span')
        span.textContent = taskText
        span.addEventListener('click', () => {
            li.classList.toggle('completed')
            updateTask(taskText, color, li.classList.contains('completed'))
        })

        const editBtn = document.createElement('button')
        editBtn.className = 'edit-btn'
        editBtn.textContent = 'Edit'
        editBtn.addEventListener('click', () => {
            const newTaskText = prompt('Edit task:', taskText)
            if (newTaskText && newTaskText.trim() !== '') {
                span.textContent = newTaskText.trim()
                updateTaskText(taskText, newTaskText.trim(), color)
                taskText = newTaskText.trim()
            }
        })

        const deleteBtn = document.createElement('button')
        deleteBtn.className = 'delete-btn'
        deleteBtn.textContent = 'Delete'
        deleteBtn.addEventListener('click', () => {
            taskList.removeChild(li)
            deleteTask(taskText, color)
        })

        li.appendChild(span)
        li.appendChild(editBtn)
        li.appendChild(deleteBtn)
        taskList.appendChild(li)
    }

    function saveTask(taskText, color) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || []
        tasks.push({ text: taskText, color: color, completed: false })
        localStorage.setItem('tasks', JSON.stringify(tasks))
    }

    function loadTasks() {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || []
        tasks.forEach(task => addTask(task.text, task.color, task.completed))
    }

    function deleteTask(taskText, color) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || []
        tasks = tasks.filter(task => task.text !== taskText || task.color !== color)
        localStorage.setItem('tasks', JSON.stringify(tasks))
    }

    function updateTask(taskText, color, completed) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || []
        tasks = tasks.map(task => {
            if (task.text === taskText && task.color === color) {
                task.completed = completed
            }
            return task
        })
        localStorage.setItem('tasks', JSON.stringify(tasks))
    }

    function updateTaskText(oldText, newText, color) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || []
        tasks = tasks.map(task => {
            if (task.text === oldText && task.color === color) {
                task.text = newText
            }
            return task
        })
        localStorage.setItem('tasks', JSON.stringify(tasks))
    }
})
