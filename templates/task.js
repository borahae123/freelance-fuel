let tasks = [
    {
      id: 1,
      title: 'Design landing page for client A',
      description: '',
      dueDate: '2025-05-30',
      priority: 'High',
      status: 'Pending',
    },
    {
      id: 2,
      title: 'Prepare monthly report',
      description: '',
      dueDate: '2025-06-02',
      priority: 'Medium',
      status: 'In Progress',
    },
    {
      id: 3,
      title: 'Email proposal to Rohan',
      description: '',
      dueDate: '2025-05-28',
      priority: 'Low',
      status: 'Completed',
    }
  ];

  // Elements
  const taskTableBody = document.getElementById('task-table-body');
  const tasksTodayCount = document.getElementById('tasks-today-count');
  const tasksPendingCount = document.getElementById('tasks-pending-count');
  const tasksCompletedCount = document.getElementById('tasks-completed-count');
  const tasksUpcomingCount = document.getElementById('tasks-upcoming-count');

  const openModalBtn = document.getElementById('open-modal-btn');
  const modalBg = document.getElementById('modal-bg');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const taskForm = document.getElementById('task-form');

  const searchInput = document.getElementById('search-input');
  const filterPriority = document.getElementById('filter-priority');
  const filterStatus = document.getElementById('filter-status');

  // Utils
  function formatDate(dateStr) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, options);
  }
  function isToday(dateStr) {
    const today = new Date();
    const d = new Date(dateStr);
    return d.toDateString() === today.toDateString();
  }
  function isUpcoming(dateStr) {
    const today = new Date();
    const d = new Date(dateStr);
    return d > today;
  }

  // Render tasks based on filters & search
  function renderTasks() {
    let filteredTasks = tasks;

    // Search filter
    const searchTerm = searchInput.value.toLowerCase();
    if (searchTerm) {
      filteredTasks = filteredTasks.filter(task =>
        task.title.toLowerCase().includes(searchTerm) ||
        (task.description && task.description.toLowerCase().includes(searchTerm))
      );
    }

    // Priority filter
    if (filterPriority.value) {
      filteredTasks = filteredTasks.filter(task => task.priority === filterPriority.value);
    }

    // Status filter
    if (filterStatus.value) {
      filteredTasks = filteredTasks.filter(task => task.status === filterStatus.value);
    }

    // Clear existing rows
    taskTableBody.innerHTML = '';

    if (filteredTasks.length === 0) {
      taskTableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 20px; color: #999;">No tasks found.</td></tr>`;
      updateOverviewCounts();
      return;
    }

    // Populate rows
    filteredTasks.forEach(task => {
      const tr = document.createElement('tr');

      // Task title + desc tooltip
      const titleTd = document.createElement('td');
      titleTd.textContent = task.title;
      if(task.description){
        titleTd.title = task.description;
      }

      // Due date
      const dueDateTd = document.createElement('td');
      dueDateTd.textContent = formatDate(task.dueDate);
      if (isToday(task.dueDate)) {
        dueDateTd.style.fontWeight = '700';
        dueDateTd.style.color = '#e84545'; // urgent color
      }

      // Priority
      const priorityTd = document.createElement('td');
      priorityTd.textContent = task.priority;
      priorityTd.className = {
        'High': 'priority-high',
        'Medium': 'priority-medium',
        'Low': 'priority-low'
      }[task.priority];

      // Status
      const statusTd = document.createElement('td');
      statusTd.textContent = task.status;
      statusTd.className = {
        'Pending': 'status-pending',
        'In Progress': 'status-inprogress',
        'Completed': 'status-completed'
      }[task.status];

      // Actions
      const actionsTd = document.createElement('td');

      // Complete button only if not completed
      if(task.status !== 'Completed'){
        const completeBtn = document.createElement('button');
        completeBtn.textContent = 'Complete';
        completeBtn.className = 'btn btn-complete';
        completeBtn.onclick = () => markComplete(task.id);
        actionsTd.appendChild(completeBtn);
      }

      // Delete button always
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.className = 'btn btn-delete';
      deleteBtn.onclick = () => deleteTask(task.id);
      actionsTd.appendChild(deleteBtn);

      tr.appendChild(titleTd);
      tr.appendChild(dueDateTd);
      tr.appendChild(priorityTd);
      tr.appendChild(statusTd);
      tr.appendChild(actionsTd);

      taskTableBody.appendChild(tr);
    });

    updateOverviewCounts();
  }

  // Update overview cards counts
  function updateOverviewCounts(){
    const todayTasks = tasks.filter(t => isToday(t.dueDate));
    const pendingTasks = tasks.filter(t => t.status === 'Pending');
    const completedTasks = tasks.filter(t => t.status === 'Completed');
    const upcomingTasks = tasks.filter(t => new Date(t.dueDate) > new Date());

    tasksTodayCount.textContent = todayTasks.length;
    tasksPendingCount.textContent = pendingTasks.length;
    tasksCompletedCount.textContent = completedTasks.length;
    tasksUpcomingCount.textContent = upcomingTasks.length;
  }

  // Mark task complete
  function markComplete(id) {
    const task = tasks.find(t => t.id === id);
    if(task){
      task.status = 'Completed';
      renderTasks();
    }
  }

  // Delete task
  function deleteTask(id){
    if(confirm('Are you sure you want to delete this task?')){
      tasks = tasks.filter(t => t.id !== id);
      renderTasks();
    }
  }

  // Open modal
  openModalBtn.addEventListener('click', () => {
    modalBg.classList.add('active');
  });

  // Close modal
  closeModalBtn.addEventListener('click', () => {
    modalBg.classList.remove('active');
    taskForm.reset();
  });

  // Add task form submit
  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const newTask = {
      id: Date.now(),
      title: document.getElementById('task-title').value.trim(),
      description: document.getElementById('task-desc').value.trim(),
      dueDate: document.getElementById('task-due-date').value,
      priority: document.getElementById('task-priority').value,
      status: document.getElementById('task-status').value
    };

    if(!newTask.title || !newTask.dueDate || !newTask.priority || !newTask.status){
      alert('Please fill in all required fields.');
      return;
    }

    tasks.push(newTask);
    taskForm.reset();
    modalBg.classList.remove('active');
    renderTasks();
  });

  // Filters and search handlers
  searchInput.addEventListener('input', renderTasks);
  filterPriority.addEventListener('change', renderTasks);
  filterStatus.addEventListener('change', renderTasks);

  // Initial render
  renderTasks();