document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const emptyState = document.getElementById('empty-state');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    let currentFilter = 'all';
    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
        updateEmptyState();
    }

    function updateEmptyState() {
        const visibleTodos = todoList.querySelectorAll('.todo-item:not(.hidden)');
        if (visibleTodos.length === 0) {
            let message = 'No tasks yet. Add one to get started!';
            if (currentFilter === 'completed') {
                message = 'No completed tasks yet.';
            } else if (currentFilter === 'pending') {
                message = 'No pending tasks.';
            }
            emptyState.querySelector('p').textContent = message;
            emptyState.classList.add('visible');
        } else {
            emptyState.classList.remove('visible');
        }
    }

    function filterTodos(filter) {
        currentFilter = filter;
        const todoItems = todoList.querySelectorAll('.todo-item');
        
        todoItems.forEach(item => {
            const isCompleted = item.classList.contains('completed');
            if (filter === 'all' || 
                (filter === 'completed' && isCompleted) || 
                (filter === 'pending' && !isCompleted)) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });
        
        updateEmptyState();
    }

    function createTodoElement(todo) {
        const todoItem = document.createElement('div');
        todoItem.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        if (currentFilter !== 'all' && 
            ((currentFilter === 'completed' && !todo.completed) || 
             (currentFilter === 'pending' && todo.completed))) {
            todoItem.classList.add('hidden');
        }
        
        todoItem.innerHTML = `
            <div class="todo-content">
                <button class="complete-btn ${todo.completed ? 'completed' : ''}" aria-label="Toggle completion">
                    ${todo.completed ? 
                        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>' :
                        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle></svg>'
                    }
                </button>
                <span class="todo-text">${todo.text}</span>
            </div>
            <div class="todo-actions">
                <button class="delete-btn" aria-label="Delete todo">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
            </div>
        `;

        const deleteBtn = todoItem.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            todos = todos.filter(t => t.id !== todo.id);
            todoItem.remove();
            saveTodos();
        });

        const completeBtn = todoItem.querySelector('.complete-btn');
        completeBtn.addEventListener('click', () => {
            todo.completed = !todo.completed;
            todoItem.classList.toggle('completed');
            completeBtn.classList.toggle('completed');
            completeBtn.innerHTML = todo.completed ? 
                '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>' :
                '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle></svg>';
            
            if (currentFilter !== 'all') {
                todoItem.classList.add('hidden');
            }
            
            saveTodos();
        });

        return todoItem;
    }

    function renderTodos() {
        todoList.innerHTML = '';
        todos.forEach(todo => {
            todoList.appendChild(createTodoElement(todo));
        });
        updateEmptyState();
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            filterTodos(button.dataset.filter);
        });
    });

    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = todoInput.value.trim();
        if (text) {
            const todo = {
                id: Date.now(),
                text,
                completed: false
            };
            todos.push(todo);
            if (currentFilter !== 'completed') {
                todoList.appendChild(createTodoElement(todo));
            }
            todoInput.value = '';
            saveTodos();
        }
    });

    renderTodos();
});