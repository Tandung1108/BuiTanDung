// 1. Tạo danh sách dữ liệu mẫu (Mảng chứa các đối tượng sản phẩm/dịch vụ)
const products = [
    { id: 1, name: "Laptop Gaming ASUS ROG", price: "25.000.000 đ", desc: "Cấu hình mạnh mẽ, chuyên chiến game nặng." },
    { id: 2, name: "Bàn phím cơ không dây", price: "1.500.000 đ", desc: "Đèn LED RGB, gõ êm, kết nối đa thiết bị." },
    { id: 3, name: "Chuột Gaming Logitech", price: "850.000 đ", desc: "Độ nhạy cao, thiết kế công thái học ôm tay." },
    { id: 4, name: "Tai nghe chống ồn ANC", price: "2.200.000 đ", desc: "Âm thanh vòm sống động, chống ồn chủ động." }
];

// 2. Viết hàm xử lý hiển thị tự động bằng vòng lặp và DOM
function renderProducts() {
    // Sử dụng DOM để tìm vị trí khung chứa trong HTML
    const container = document.getElementById("product-list");
    
    // Kiểm tra nếu không tìm thấy container thì dừng lại để tránh lỗi
    if (!container) return;

    let htmlContent = "";

    // Sử dụng vòng lặp (ví dụ: forEach) để duyệt qua từng sản phẩm trong mảng dữ liệu
    products.forEach(product => {
        // Nối chuỗi HTML động cho từng sản phẩm
        htmlContent += `
            <div style="border: 1px solid #ccc; padding: 15px; margin-bottom: 10px; border-radius: 8px;">
                <h3>${product.name}</h3>
                <p><strong>Giá:</strong> ${product.price}</p>
                <p>${product.desc}</p>
                <button onclick="alert('Đã chọn mua: ${product.name}')">Mua ngay</button>
            </div>
        `;
    });

    // Dùng DOM (innerHTML) để đưa toàn bộ chuỗi HTML vừa tạo vào trang web
    container.innerHTML = htmlContent;
}

// 3. Kích hoạt hàm khi trang web đã được tải xong (DOMContentLoaded)
document.addEventListener("DOMContentLoaded", renderProducts);