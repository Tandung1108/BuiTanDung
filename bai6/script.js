// --- 1. KIỂM TRA CHẾ ĐỘ TIẾT KIỆM NĂNG LƯỢNG (LOW MOTION MODE) ---
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = window.innerWidth <= 992 || 'ontouchstart' in window;

// --- 2. XỬ LÝ CUSTOM CURSOR & TRAIL (ĐUÔI SAO BĂNG VỚI LERP) ---
const cursor = document.getElementById('main-cursor');
const trails = document.querySelectorAll('.cursor-trail');

let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let cursorPosition = { x: mouse.x, y: mouse.y };
let trailPositions = Array.from(trails).map(() => ({ x: mouse.x, y: mouse.y }));

// Nội suy tuyến tính (Lerp formula) giúp chuyển động mượt mà
const lerp = (start, end, factor) => start + (end - start) * factor;

if (!isMobile && !prefersReducedMotion) {
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    // Phóng to cursor khi hover vào liên kết hoặc nút bấm
    const interactiveElements = document.querySelectorAll('a, button, .magnetic-btn');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.width = '40px';
            cursor.style.height = '40px';
            cursor.style.backgroundColor = 'rgba(0, 242, 254, 0.5)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.width = '20px';
            cursor.style.height = '20px';
            cursor.style.backgroundColor = 'var(--primary)';
        });
    });
} else {
    // Ẩn custom cursor trên mobile hoặc khi bật low-motion
    if (cursor) cursor.style.display = 'none';
    trails.forEach(t => t.style.display = 'none');
}

// --- 3. MAGNETIC BUTTONS PHYSISC ---
const magneticBtns = document.querySelectorAll('.magnetic-btn');

if (!isMobile && !prefersReducedMotion) {
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            // Kéo nút về phía chuột (hiệu ứng hút nam châm)
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0px, 0px)';
        });
    });
}

// --- 4. HIỆU ỨNG PARALLAX & ANIMATION DÙNG REQUESTANIMATIONFRAME (60FPS) ---
const parallaxLayers = document.querySelectorAll('.layer-bg');

function updateAnimations() {
    if (!prefersReducedMotion) {
        // Cập nhật vị trí Cursor chính
        cursorPosition.x = lerp(cursorPosition.x, mouse.x, 0.2);
        cursorPosition.y = lerp(cursorPosition.y, mouse.y, 0.2);
        cursor.style.transform = `translate(${cursorPosition.x}px, ${cursorPosition.y}px)`;

        // Cập nhật chuỗi vòng tròn đuôi sao băng (Trail) với độ trễ khác nhau
        trailPositions.forEach((pos, index) => {
            const nextTarget = index === 0 ? cursorPosition : trailPositions[index - 1];
            pos.x = lerp(pos.x, nextTarget.x, 0.35);
            pos.y = lerp(pos.y, nextTarget.y, 0.35);
            
            if (trails[index]) {
                trails[index].style.transform = `translate(${pos.x}px, ${pos.y}px)`;
            }
        });

        // Xử lý Parallax theo vị trí cuộn trang (Scroll Y)
        const scrollY = window.scrollY;
        parallaxLayers.forEach(layer => {
            const speed = parseFloat(layer.getAttribute('data-speed')) || 0.1;
            layer.style.transform = `translateY(${scrollY * speed}px)`;
        });
    }

    requestAnimationFrame(updateAnimations);
}

// Khởi chạy vòng lặp Animation 60fps
requestAnimationFrame(updateAnimations);