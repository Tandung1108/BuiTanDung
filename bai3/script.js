// Thay link Web App Google Apps Script của bạn vào đây
const GOOGLE_SCRIPT_URL = "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";
const MAX_SEATS = 50;

const form = document.getElementById('registration-form');
const fullNameInput = document.getElementById('fullname');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const submitBtn = document.getElementById('submit-btn');
const btnText = submitBtn.querySelector('.btn-text');
const spinner = submitBtn.querySelector('.spinner');

const nameError = document.getElementById('name-error');
const emailError = document.getElementById('email-error');
const phoneError = document.getElementById('phone-error');

const successModal = document.getElementById('success-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const qrCodeImg = document.getElementById('qr-code-img');
const seatCounter = document.getElementById('seat-counter');

// --- 1. KIỂM TRA SỐ LỖI & SEAT COUNTER KHI LOAD TRANG ---
window.addEventListener('DOMContentLoaded', async () => {
    await checkSeatAvailability();
});

async function checkSeatAvailability() {
    try {
        if (GOOGLE_SCRIPT_URL === "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE") {
            seatCounter.innerHTML = `<i class="fa-solid fa-users"></i> Chỗ ngồi: Đang cấu hình hệ thống`;
            return;
        }

        const response = await fetch(GOOGLE_SCRIPT_URL);
        const data = await response.json();
        const currentRegistered = data.totalRows || 0;

        if (currentRegistered >= MAX_SEATS) {
            seatCounter.innerHTML = `<i class="fa-solid fa-ban"></i> 🔴 Sự kiện đã Hết chỗ (50/50)`;
            seatCounter.style.color = "#ef4444";
            seatCounter.style.borderColor = "rgba(239, 68, 68, 0.3)";
            form.innerHTML = `<div style="text-align: center; padding: 20px; color: #ef4444; font-weight: 600;">Rất tiếc, sự kiện đã đạt giới hạn 50 người đăng ký! Cổng đăng ký đã đóng.</div>`;
        } else {
            seatCounter.innerHTML = `<i class="fa-solid fa-users"></i> Số chỗ còn lại: ${MAX_SEATS - currentRegistered} / ${MAX_SEATS}`;
        }
    } catch (error) {
        console.error("Lỗi khi kiểm tra chỗ ngồi:", error);
        seatCounter.innerHTML = `<i class="fa-solid fa-users"></i> Tổng số chỗ: 50`;
    }
}

// --- 2. REAL-TIME VALIDATION ---
function validateName() {
    if (fullNameInput.value.trim() === "") {
        nameError.textContent = "Họ và tên không được để trống.";
        return false;
    }
    nameError.textContent = "";
    return true;
}

function validateEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
        emailError.textContent = "Địa chỉ email không hợp lệ.";
        return false;
    }
    emailError.textContent = "";
    return true;
}

function validatePhone() {
    const phoneRegex = /(84|0[35789])+([0-9]{8})\b/;
    if (!phoneRegex.test(phoneInput.value.trim())) {
        phoneError.textContent = "Số điện thoại không hợp lệ (Ví dụ: 0912345678).";
        return false;
    }
    phoneError.textContent = "";
    return true;
}

fullNameInput.addEventListener('input', validateName);
emailInput.addEventListener('input', validateEmail);
phoneInput.addEventListener('input', validatePhone);

// --- 3. XỬ LÝ SUBMIT & ASYNC/AWAIT GỬI GOOGLE SHEETS ---
form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Ngăn trang web load lại

    // Kiểm tra toàn bộ validation trước khi gửi
    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isPhoneValid = validatePhone();

    if (!isNameValid || !isEmailValid || !isPhoneValid) {
        return;
    }

    const formData = {
        fullname: fullNameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim()
    };

    // Bật trạng thái Loading (Khóa nút bấm tránh double-click)
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    spinner.style.display = 'inline-block';

    try {
        if (GOOGLE_SCRIPT_URL !== "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE") {
            // Gửi dữ liệu bằng Async/Await fetch API tới Google Sheets
            await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
        } else {
            // Giả lập độ trễ mạng nếu chưa cấu hình link Apps Script thật
            await new Promise(resolve => setTimeout(resolve, 1500));
        }

        // Tạo Mã QR Check-in bằng QuickChart API chứa thông tin người dùng
        const qrText = `CHECK-IN SỰ KIỆN AI NEXUS\nHọ tên: ${formData.fullname}\nEmail: ${formData.email}\nSĐT: ${formData.phone}`;
        const qrApiUrl = `https://quickchart.io/qr?text=${encodeURIComponent(qrText)}&size=200&format=png`;
        qrCodeImg.src = qrApiUrl;

        // Hiển thị Modal thành công
        successModal.style.display = 'flex';
        form.reset();

    } catch (error) {
        console.error("Lỗi gửi dữ liệu:", error);
        alert("Đã có lỗi xảy ra trong quá trình gửi dữ liệu. Vui lòng thử lại!");
    } finally {
        // Tắt trạng thái Loading
        submitBtn.disabled = false;
        btnText.style.display = 'inline-block';
        spinner.style.display = 'none';
    }
});

closeModalBtn.addEventListener('click', () => {
    successModal.style.display = 'none';
    location.reload(); // Tải lại để cập nhật số lượng chỗ ngồi
});