document.addEventListener('DOMContentLoaded', () => {
  // To-Do List Logic
  const todoListEl = document.getElementById('todo-list');
  const todoForm = document.getElementById('todo-form');
  const todoInput = document.getElementById('todo-input');

  // Load tasks from localStorage or default list
  let tasks = JSON.parse(localStorage.getItem('todoTasks')) || [
    { text: 'Finish UI for client A', done: false },
    { text: 'Send invoice to client B', done: false },
    { text: 'Research design trends', done: false },
  ];

  function saveTasks() {
    localStorage.setItem('todoTasks', JSON.stringify(tasks));
  }

  function renderTasks() {
    todoListEl.innerHTML = '';
    tasks.forEach((task, idx) => {
      const li = document.createElement('li');
      li.className = task.done ? 'completed' : '';
      li.innerHTML = `
        <input type="checkbox" data-idx="${idx}" ${task.done ? 'checked' : ''} />
        <span>${task.text}</span>
      `;
      todoListEl.appendChild(li);
    });
  }

  // Toggle task done
  todoListEl.addEventListener('change', e => {
    if (e.target.matches('input[type="checkbox"]')) {
      const idx = e.target.getAttribute('data-idx');
      tasks[idx].done = e.target.checked;
      saveTasks();
      renderTasks();
    }
  });

  // Add new task
  todoForm.addEventListener('submit', e => {
    e.preventDefault();
    const val = todoInput.value.trim();
    if (!val) return;
    tasks.push({ text: val, done: false });
    saveTasks();
    renderTasks();
    todoInput.value = '';
  });

  renderTasks();

  // Collapsible sections logic
  document.querySelectorAll('.collapsible-header').forEach(header => {
    header.addEventListener('click', () => {
      const content = header.nextElementSibling;
      const isCollapsed = content.classList.toggle('collapsed');
      header.classList.toggle('collapsed', isCollapsed);
    });
  });

  // Animate progress bars on load
  const progressBars = document.querySelectorAll('.progress-bar');
  progressBars.forEach(bar => {
    const percent = bar.getAttribute('data-progress');
    setTimeout(() => {
      bar.style.width = percent + '%';
    }, 300);
  });
});
