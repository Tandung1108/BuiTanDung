// --- 1. DARK / LIGHT MODE SWITCHER (Bài 4) ---
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const themeIcon = document.getElementById('theme-icon');
const body = document.body;

themeToggleBtn.addEventListener('click', () => {
    body.classList.toggle('light-mode');
    const isLight = body.classList.contains('light-mode');
    
    if (isLight) {
        themeIcon.className = 'fa-solid fa-sun';
        localStorage.setItem('theme', 'light');
    } else {
        themeIcon.className = 'fa-solid fa-moon';
        localStorage.setItem('theme', 'dark');
    }
});

// Khôi phục trạng thái Theme từ LocalStorage (Bài 4)
window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        body.classList.add('light-mode');
        themeIcon.className = 'fa-solid fa-sun';
    }
});

// --- 2. RESPONSIVE MOBILE HAMBURGER MENU (Bài 3) ---
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// --- 3. GOOGLE SHEETS DYNAMIC DATA LOADING (Bài 5) ---
// Thay thế URL bên dưới bằng Google Apps Script Web App URL hoặc JSON endpoint của bạn
const GOOGLE_SHEETS_API_URL = "YOUR_GOOGLE_APPS_SCRIPT_URL_HERE";

async function loadProjectsFromSheets() {
    const projectGrid = document.getElementById('project-grid');
    
    // Dữ liệu mẫu minh họa nếu chưa cấu hình Google Sheets thực tế
    const mockProjects = [
        { title: "TechStore E-Commerce", category: "web", image: "https://images.unsplash.com/photo-1557821552-17105176674c?auto=format&fit=crop&w=600&q=80", link: "#" },
        { title: "AI Nexus Platform", category: "web", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80", link: "#" },
        { title: "Mobile Fitness Tracker", category: "mobile", image: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=600&q=80", link: "#" }
    ];

    try {
        let projects = mockProjects;
        if (GOOGLE_SHEETS_API_URL !== "YOUR_GOOGLE_APPS_SCRIPT_URL_HERE") {
            const response = await fetch(GOOGLE_SHEETS_API_URL);
            const data = await response.json();
            projects = data.projects || mockProjects;
        }

        renderProjects(projects);
        initCategoryFilter(projects);
    } catch (error) {
        console.error("Lỗi tải dữ liệu Google Sheets:", error);
        projectGrid.innerHTML = `<div class="loading-spinner">Không thể tải dữ liệu. Hiển thị dữ liệu mẫu thay thế.</div>`;
        renderProjects(mockProjects);
        initCategoryFilter(mockProjects);
    }
}

function renderProjects(projects) {
    const projectGrid = document.getElementById('project-grid');
    projectGrid.innerHTML = "";

    projects.forEach(p => {
        const card = document.createElement('div');
        card.className = `project-card`;
        card.setAttribute('data-category', p.category);
        card.innerHTML = `
            <img src="${p.image}" alt="${p.title}" loading="lazy">
            <div class="project-info">
                <h3>${p.title}</h3>
                <p>Ứng dụng công nghệ frontend hiện đại, tối ưu hiệu suất và giao diện.</p>
                <a href="${p.link}" class="project-link">Xem Chi Tiết <i class="fa-solid fa-arrow-right"></i></a>
            </div>
        `;
        projectGrid.appendChild(card);
    });
}

// --- 4. LỌC DANH MỤC DỰ ÁN & CUSTOM CURSOR (Bài 6) ---
function initCategoryFilter(projects) {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');
            const cards = document.querySelectorAll('.project-card');

            cards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Custom Cursor theo chuyển động chuột (Bài 6)
const cursor = document.getElementById('main-cursor');
const isMobile = window.innerWidth <= 992 || 'ontouchstart' in window;

if (!isMobile) {
    window.addEventListener('mousemove', (e) => {
        cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    });

    const interactables = document.querySelectorAll('a, button, .filter-btn');
    interactables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.width = '40px';
            cursor.style.height = '40px';
            cursor.style.backgroundColor = 'rgba(37, 99, 235, 0.4)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.width = '20px';
            cursor.style.height = '20px';
            cursor.style.backgroundColor = 'var(--primary-color)';
        });
    });
} else {
    if (cursor) cursor.style.display = 'none';
}

// Khởi chạy tải dữ liệu khi trang sẵn sàng
window.addEventListener('DOMContentLoaded', () => {
    loadProjectsFromSheets();
});