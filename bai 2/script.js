// --- 1. DỮ LIỆU THỜI TIẾT MẪU (Array & Objects) ---
const weatherData = [
    {
        city: "Biên Hòa",
        temp: 34,
        humidity: "65%",
        condition: "Nắng",
        icon: "fa-sun",
        theme: "theme-sunny",
        advice: "Nhiệt độ trên 30°C khá oi bức! Hãy nhớ mang theo kem chống nắng, kính râm và uống đủ nước lọc nhé."
    },
    {
        city: "Đà Lạt",
        temp: 14,
        humidity: "88%",
        condition: "Mưa",
        icon: "fa-cloud-rain",
        theme: "theme-rainy",
        advice: "Nhiệt độ dưới 15°C cực kỳ lạnh! Bắt buộc phải mặc áo len dày, khăn choàng cổ và mang theo ô/dù."
    },
    {
        city: "Vũng Tàu",
        temp: 28,
        humidity: "75%",
        condition: "Mây",
        icon: "fa-cloud-sun",
        theme: "theme-cloudy",
        advice: "Thời tiết mát mẻ và nhiều mây. Rất lý tưởng để dạo biển, tuy nhiên hãy chuẩn bị một chiếc áo khoác nhẹ."
    }
];

// --- 2. KHỞI TẠO BIẾN & LOCALSTORAGE ---
const citySelect = document.getElementById('city-select');
const weatherDisplayArea = document.getElementById('weather-display-area');
const aiSuggestionText = document.getElementById('ai-suggestion-text');

const placeInput = document.getElementById('place-input');
const timeInput = document.getElementById('time-input');
const addPlaceBtn = document.getElementById('add-place-btn');
const itineraryList = document.getElementById('itinerary-list');
const itineraryCount = document.getElementById('itinerary-count');
const filterChips = document.querySelectorAll('.filter-chip');
const exportBtn = document.getElementById('export-btn');

const countdownTarget = document.getElementById('countdown-target');
const setCountdownBtn = document.getElementById('set-countdown-btn');
const countdownDisplay = document.getElementById('countdown-display');

// Đọc dữ liệu từ LocalStorage hoặc khởi tạo mặc định
let itineraries = JSON.parse(localStorage.getItem('travel_itineraries')) || [
    { id: 1, place: "Khu du lịch Bửu Long", time: "08:30 - Sáng", completed: false },
    { id: 2, place: "Quảng trường trung tâm Biên Hòa", time: "16:00 - Chiều", completed: true }
];

let selectedCityName = localStorage.getItem('selected_city') || weatherData[0].city;
let currentFilter = 'all';

// --- 3. ĐỒNG HỒ THỜI GIAN THỰC (setInterval) ---
function updateLiveClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('vi-VN');
    document.querySelector('#live-clock span').textContent = timeString;
}
setInterval(updateLiveClock, 1000);
updateLiveClock();

// --- 4. WEATHER MODULE RENDER ---
function initCitySelector() {
    citySelect.innerHTML = '';
    weatherData.forEach(item => {
        const option = document.createElement('option');
        option.value = item.city;
        option.textContent = item.city;
        if (item.city === selectedCityName) {
            option.selected = true;
        }
        citySelect.appendChild(option);
    });
}

function updateWeatherDisplay() {
    const currentData = weatherData.find(w => w.city === selectedCityName) || weatherData[0];
    
    // Đổi theme background toàn trang theo thời tiết
    document.body.className = currentData.theme;

    weatherDisplayArea.innerHTML = `
        <div class="weather-main-info">
            <div>
                <h2 style="font-size: 1.5rem; color: #fff;">${currentData.city}</h2>
                <p style="color: #94a3b8; font-size: 0.95rem; margin-top: 4px;">Tình trạng: <b style="color: #00f2fe;">${currentData.condition}</b></p>
            </div>
            <div class="temp-big">${currentData.temp}°C</div>
            <i class="fa-solid ${currentData.icon} weather-icon-pulse" style="color: #00f2fe;"></i>
        </div>
        <div class="weather-details-grid">
            <div class="weather-detail-item"><i class="fa-solid fa-droplet" style="color: #38bdf8;"></i> Độ ẩm: ${currentData.humidity}</div>
            <div class="weather-detail-item"><i class="fa-solid fa-wind" style="color: #34d399;"></i> Gió: 12 km/h</div>
        </div>
    `;

    // Cập nhật Smart AI Suggestions (Mở rộng 1)
    aiSuggestionText.textContent = currentData.advice;
}

// Lắng nghe sự kiện thay đổi thành phố
citySelect.addEventListener('change', (e) => {
    selectedCityName = e.target.value;
    localStorage.setItem('selected_city', selectedCityName);
    updateWeatherDisplay();
});

// --- 5. ITINERARY MODULE (CRUD & LOCALSTORAGE) ---
function saveAndRenderItinerary() {
    localStorage.setItem('travel_itineraries', JSON.stringify(itineraries));
    renderItineraries();
}

function renderItineraries() {
    itineraryList.innerHTML = '';

    const filtered = itineraries.filter(item => {
        if (currentFilter === 'active') return !item.completed;
        if (currentFilter === 'completed') return item.completed;
        return true;
    });

    filtered.forEach(item => {
        const li = document.createElement('li');
        li.className = `itinerary-item ${item.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
            <div class="itinerary-info" onclick="toggleItinerary(${item.id})">
                <h4>${escapeHTML(item.place)}</h4>
                <p><i class="fa-regular fa-clock"></i> ${escapeHTML(item.time)}</p>
            </div>
            <button class="delete-item-btn" onclick="deleteItinerary(${item.id})"><i class="fa-solid fa-trash-can"></i></button>
        `;
        itineraryList.appendChild(li);
    });

    const completedCount = itineraries.filter(i => i.completed).length;
    itineraryCount.textContent = `Tổng số: ${itineraries.length} địa điểm (Đã đến: ${completedCount})`;
}

function addItinerary() {
    const place = placeInput.value.trim();
    const time = timeInput.value.trim();

    if (place === "" || time === "") {
        alert("⚠️ Vui lòng nhập đầy đủ Tên địa điểm và Thời gian ghé thăm!");
        return;
    }

    const newItem = {
        id: Date.now(),
        place: place,
        time: time,
        completed: false
    };

    itineraries.push(newItem);
    placeInput.value = '';
    timeInput.value = '';
    saveAndRenderItinerary();
}

function toggleItinerary(id) {
    itineraries = itineraries.map(item => {
        if (item.id === id) {
            return { ...item, completed: !item.completed };
        }
        return item;
    });
    saveAndRenderItinerary();
}

function deleteItinerary(id) {
    itineraries = itineraries.filter(item => item.id !== id);
    saveAndRenderItinerary();
}

// Bộ lọc (Filter chips)
filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
        filterChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        currentFilter = chip.getAttribute('data-filter');
        renderItineraries();
    });
});

addPlaceBtn.addEventListener('click', addItinerary);
placeInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addItinerary(); });
timeInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addItinerary(); });

// --- 6. MỞ RỘNG 2: EXPORT TO TEXT (.TXT) ---
exportBtn.addEventListener('click', () => {
    if (itineraries.length === 0) {
        alert("Danh sách lịch trình đang trống, không thể xuất file!");
        return;
    }

    let content = `=== KẾ HOẠCH DU LỊCH & LỊCH TRÌNH NEXUS ===\n`;
    content += `Khu vực: ${selectedCityName}\n`;
    content += `Ngày xuất báo cáo: ${new Date().toLocaleString('vi-VN')}\n`;
    content += `--------------------------------------------------\n\n`;

    itineraries.forEach((item, index) => {
        content += `${index + 1}. Địa điểm: ${item.place}\n`;
        content += `   Thời gian: ${item.time}\n`;
        content += `   Trạng thái: ${item.completed ? 'Đã đến' : 'Chưa đến'}\n`;
        content += `--------------------------------------------------\n`;
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Lich-Trinh-Du-Lich-${selectedCityName}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

// --- 7. MỞ RỘNG 3: COUNTDOWN TIMER ---
let countdownInterval = null;
setCountdownBtn.addEventListener('click', () => {
    const targetVal = countdownTarget.value;
    if (!targetVal) {
        alert("Vui lòng chọn thời gian khởi hành!");
        return;
    }

    const targetTime = new Date(targetVal).getTime();
    
    if (countdownInterval) clearInterval(countdownInterval);

    countdownInterval = setInterval(() => {
        const now = new Date().getTime();
        const distance = targetTime - now;

        if (distance < 0) {
            clearInterval(countdownInterval);
            countdownDisplay.innerHTML = `<span style="color: #ef4444;">Đã đến thời gian khởi hành! Chúc chuyến đi tuyệt vời!</span>`;
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        countdownDisplay.innerHTML = `
            <span>${String(days).padStart(2, '0')}</span>d : 
            <span>${String(hours).padStart(2, '0')}</span>h : 
            <span>${String(minutes).padStart(2, '0')}</span>m : 
            <span>${String(seconds).padStart(2, '0')}</span>s
        `;
    }, 1000);
});

// Hàm chống XSS cơ bản
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

// Khởi chạy hệ thống lần đầu
initCitySelector();
updateWeatherDisplay();
renderItineraries();