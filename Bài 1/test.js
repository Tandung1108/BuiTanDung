const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const taskCount = document.getElementById('task-count');
const clockElement = document.getElementById('real-time-clock');
const greetingText = document.getElementById('greeting-text');
const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebar = document.getElementById('sidebar');
const filterBtns = document.querySelectorAll('.filter-btn');

let tasks = JSON.parse(localStorage.getItem('cyber_tasks')) || [];
let currentFilter = 'all';

const userName = "Dũn";
greetingText.textContent = `Chào ${userName}, hệ thống đã sẵn sàng.`;

// 1. REAL-TIME CLOCK (setInterval)
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const dateStr = now.toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric', month: 'numeric' });
    
    clockElement.innerHTML = `<i class="fa-regular fa-clock"></i> ${dateStr} - ${hours}:${minutes}:${seconds}`;
}
setInterval(updateClock, 1000);
updateClock();

// 2. LOCALSTORAGE & RENDER
function saveAndRender() {
    localStorage.setItem('cyber_tasks', JSON.stringify(tasks));
    renderTasks();
}

function renderTasks() {
    taskList.innerHTML = '';
    
    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'active') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
        return true;
    });

    filteredTasks.forEach((task) => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
            <span onclick="toggleTask(${task.id})">${escapeHTML(task.text)}</span>
            <button class="delete-btn" onclick="deleteTask(${task.id})"><i class="fa-solid fa-trash-can"></i></button>
        `;
        taskList.appendChild(li);
    });

    taskCount.innerHTML = `<i class="fa-solid fa-database"></i> Tổng số tác vụ: ${tasks.length} (Đã xong: ${tasks.filter(t => t.completed).length})`;
}

// 3. THÊM TÁC VỤ & BẪY LOGIC Ô TRỐNG
function addTask() {
    const text = taskInput.value.trim();
    
    if (text === "") {
        alert("⚠️ [CẢNH BÁO AI]: Vui lòng nhập nội dung tác vụ vào hệ thống!");
        return;
    }

    const newTask = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.push(newTask);
    taskInput.value = '';
    saveAndRender();
}

// 4. TOGGLE & DELETE
function toggleTask(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    saveAndRender();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveAndRender();
}

// 5. FILTER
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-filter');
        renderTasks();
    });
});

addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('show');
});

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

renderTasks();