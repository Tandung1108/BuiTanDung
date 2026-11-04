// Cấu hình dữ liệu cho từng Theme thương hiệu (Màu sắc, Font chữ, Hình ảnh Banner)
const themesConfig = {
    blue: {
        primary: "#2563eb",
        hover: "#1d4ed8",
        glow: "rgba(37, 99, 235, 0.3)",
        font: "'Plus Jakarta Sans', sans-serif",
        banner: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80"
    },
    green: {
        primary: "#10b981",
        hover: "#059669",
        glow: "rgba(16, 185, 129, 0.3)",
        font: "'Outfit', sans-serif",
        banner: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=1000&q=80"
    },
    pink: {
        primary: "#ec4899",
        hover: "#db2777",
        glow: "rgba(236, 72, 153, 0.3)",
        font: "'Space Grotesk', sans-serif",
        banner: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80"
    }
};

// DOM Elements
const body = document.body;
const themeButtons = document.querySelectorAll('.theme-btn');
const colorPicker = document.getElementById('custom-color-picker');
const modeToggleBtn = document.getElementById('mode-toggle-btn');
const modeIcon = document.getElementById('mode-icon');
const modeText = document.getElementById('mode-text');
const bannerImg = document.getElementById('banner-img');

// --- HÀM ÁP DỤNG THEME THƯƠNG HIỆU ---
function applyTheme(themeName) {
    const config = themesConfig[themeName];
    if (!config) return;

    // Cập nhật CSS Variables vào :root
    document.documentElement.style.setProperty('--primary-color', config.primary);
    document.documentElement.style.setProperty('--primary-hover', config.hover);
    document.documentElement.style.setProperty('--primary-glow', config.glow);
    document.documentElement.style.setProperty('--font-family', config.font);

    // Đồng bộ thay đổi hình ảnh Banner
    bannerImg.style.opacity = '0';
    setTimeout(() => {
        bannerImg.src = config.banner;
        bannerImg.style.opacity = '1';
    }, 250);

    // Cập nhật trạng thái active cho các nút chọn theme
    themeButtons.forEach(btn => {
        if (btn.getAttribute('data-theme') === themeName) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Lưu vào LocalStorage
    localStorage.setItem('selected_theme', themeName);
    localStorage.removeItem('custom_color'); // Xóa custom màu nếu chọn theme sẵn
}

// --- HÀM ÁP DỤNG MÀU TÙY CHỌN (CUSTOM COLOR PICKER) ---
function applyCustomColor(hexColor) {
    document.documentElement.style.setProperty('--primary-color', hexColor);
    // Tính toán lại màu glow tương ứng
    const r = parseInt(hexColor.substr(1,2), 16);
    const g = parseInt(hexColor.substr(3,2), 16);
    const b = parseInt(hexColor.substr(5,2), 16);
    const glowRgba = `rgba(${r}, ${g}, ${b}, 0.3)`;
    
    document.documentElement.style.setProperty('--primary-glow', glowRgba);

    // Xóa active các nút theme định sẵn vì đang dùng màu custom
    themeButtons.forEach(btn => btn.classList.remove('active'));

    // Lưu vào LocalStorage
    localStorage.setItem('custom_color', hexColor);
    localStorage.removeItem('selected_theme');
}

// --- HÀM CHUYỂN ĐỔI DARK / LIGHT MODE ---
function toggleDarkMode(isLight) {
    if (isLight) {
        body.classList.add('light-mode');
        modeIcon.className = 'fa-solid fa-sun';
        modeText.textContent = 'Light';
        localStorage.setItem('color_mode', 'light');
    } else {
        body.classList.remove('light-mode');
        modeIcon.className = 'fa-solid fa-moon';
        modeText.textContent = 'Dark';
        localStorage.setItem('color_mode', 'dark');
    }
}

// --- KHỞI TẠO TRẠNG THÁI KHI LOAD TRANG (LOCALSTORAGE & SYSTEM PREFERENCE) ---
window.addEventListener('DOMContentLoaded', () => {
    // 1. Kiểm tra LocalStorage cho chế độ Dark/Light Mode
    const savedMode = localStorage.getItem('color_mode');
    if (savedMode) {
        toggleDarkMode(savedMode === 'light');
    } else {
        // Tự động nhận diện hệ thống bằng window.matchMedia nếu chưa lưu lần nào
        const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
        toggleDarkMode(prefersLight);
    }

    // 2. Kiểm tra LocalStorage cho Theme thương hiệu hoặc Custom Color
    const savedTheme = localStorage.getItem('selected_theme');
    const savedCustomColor = localStorage.getItem('custom_color');

    if (savedCustomColor) {
        colorPicker.value = savedCustomColor;
        applyCustomColor(savedCustomColor);
    } else if (savedTheme && themesConfig[savedTheme]) {
        applyTheme(savedTheme);
    } else {
        applyTheme('blue'); // Mặc định ban đầu
    }
});

// --- LẮNG NGHE SỰ KIỆN TƯƠNG TÁC ---

// 1. Click chọn các Theme cố định
themeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const themeName = button.getAttribute('data-theme');
        applyTheme(themeName);
    });
});

// 2. Thay đổi màu sắc từ Color Picker
colorPicker.addEventListener('input', (e) => {
    applyCustomColor(e.target.value);
});

// 3. Click nút chuyển đổi Dark/Light Mode
modeToggleBtn.addEventListener('click', () => {
    const isCurrentlyLight = body.classList.contains('light-mode');
    toggleDarkMode(!isCurrentlyLight);
});