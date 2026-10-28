// Dữ liệu mẫu danh sách sản phẩm/dịch vụ của nhóm
const danhSachSanPham = [
    { id: 1, name: "Laptop Gaming ASUS", price: "22.500.000đ", image: "laptop.jpg" },
    { id: 2, name: "Bàn phím cơ không dây", price: "1.450.000đ", image: "keyboard.jpg" },
    { id: 3, name: "Chuột Gaming Logitech", price: "850.000đ", image: "mouse.jpg" },
    { id: 4, name: "Tai nghe chống ồn ANC", price: "2.100.000đ", image: "headphone.jpg" }
];

// Hàm tự động sinh giao diện từ dữ liệu mẫu
function renderProducts() {
    const container = document.getElementById("product-container");
    
    if (!container) return;

    let htmlContent = "";

    // Sử dụng vòng lặp duyệt qua từng sản phẩm để tạo mã HTML động
    danhSachSanPham.forEach(product => {
        htmlContent += `
            <div class="product-card">
                <h3>${product.name}</h3>
                <p class="price">Giá: ${product.price}</p>
                <button onclick="alert('Đã thêm ${product.name} vào giỏ hàng!')">Mua ngay</button>
            </div>
        `;
    });

    container.innerHTML = htmlContent;
}

// Kích hoạt hàm khi trang web đã tải xong
document.addEventListener("DOMContentLoaded", renderProducts);