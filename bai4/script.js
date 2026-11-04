// --- 1. STICKY HEADER ĐỔI MÀU KHI CUỘN ---
window.addEventListener('scroll', () => {
    const header = document.getElementById('site-header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// --- 2. MOBILE HAMBURGER MENU ---
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Đóng menu khi click vào link trên mobile
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// --- 3. TABS THÔNG SỐ KỸ THUẬT ---
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Xóa class active cũ
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        // Thêm class active cho tab được chọn
        button.classList.add('active');
        const targetTab = document.getElementById(button.getAttribute('data-tab'));
        if (targetTab) {
            targetTab.classList.add('active');
        }
    });
});

// --- 4. POPUP KHUYẾN MÃI SAU 10 GIÂY ---
const promoModal = document.getElementById('promo-modal');
const closeModal = document.getElementById('close-modal');

setTimeout(() => {
    promoModal.classList.add('active');
}, 10000); // 10 giây

closeModal.addEventListener('click', () => {
    promoModal.classList.remove('active');
});

// Đóng modal khi click ra vùng tối ngoài
window.addEventListener('click', (e) => {
    if (e.target === promoModal) {
        promoModal.classList.remove('active');
    }
});

// --- 5. HỆ THỐNG ĐA NGÔN NGỮ (I18N) - VI / EN ---
const translations = {
    vi: {
        nav_home: "Trang Chủ",
        nav_products: "Bộ Sưu Tập",
        nav_specs: "Thông Số",
        nav_story: "Thương Hiệu",
        nav_cta: "Khám Phá Ngay",
        hero_sub: "TUYỆT TÁC THỜI GIAN ĐỈNH CAO",
        hero_title: "Biểu Tượng Của Sự Xa Xỉ & Đẳng Cấp",
        hero_desc: "Được chế tác thủ công bởi những nghệ nhân hàng đầu thế giới, mang lại vẻ đẹp vĩnh cửu đi cùng năm tháng.",
        hero_btn1: "Xem Bộ Sưu Tập",
        hero_btn2: "Câu Chuyện Thương Hiệu",
        prod_badge: "ĐỘC QUYỀN HẠN CHẾ",
        prod_title: "Bộ Sưu Tập Hoàng Gia",
        prod_desc: "Mỗi chiếc đồng hồ là một tuyên ngôn về phong cách và quyền lực cá nhân.",
        p1_desc: "Vỏ vàng nguyên khối 18K, mặt kính sapphire chống trầy xước tuyệt đối.",
        p2_desc: "Thiết kế lộ cơ tinh xảo, phối màu đen tuyền huyền bí kết hợp sắc vàng.",
        p3_desc: "Tác phẩm nghệ thuật vượt thời gian với độ chính xác chuẩn Thụy Sĩ.",
        buy_btn: "Đặt Mua Ngay",
        spec_badge: "ĐỘ CHÍNH XÁC HOÀN HẢO",
        spec_title: "Thông Số Kỹ Thuật Đỉnh Cao",
        spec_desc: "Khám phá công nghệ chế tác ẩn giấu bên trong lớp vỏ xa xỉ.",
        tab1_title: "Bộ Máy (Movement)",
        tab2_title: "Chất Liệu (Materials)",
        tab3_title: "Chống Nước (Water)",
        m_heading: "Caliber A900 Automatic In-House",
        m_desc: "Sử dụng bộ máy cơ tự lên cót độc quyền với 42 chân kính (jewels), tần số dao động 28,800 vph, đảm bảo năng lượng dự trữ lên đến 72 giờ liên tục mà không cần đeo.",
        mat_heading: "Vàng 18K & Kính Sapphire Nguyên Khối",
        mat_desc: "Toàn bộ phần vỏ được đúc từ vàng nguyên khối 18K đánh bóng thủ công. Mặt kính làm từ tinh thể sapphire chống lóa, độ cứng đạt điểm 9 trên thang đo Mohs.",
        w_heading: "Khả Năng Chống Nước Đến 100 Mét",
        w_desc: "Hệ thống gioăng kép thế hệ mới cùng núm vặn khóa ren screw-down crown bảo vệ tối đa bộ máy trước áp lực nước dưới độ sâu lên tới 100 mét (10 ATM).",
        story_badge: "DI SẢN & NGHỆ THUẬT",
        story_title: "Hành Trình Định Nghĩa Lại Sự Hoàn Hảo",
        story_desc1: "Được thành lập tại Geneva, Thụy Sĩ, AURELIA ra đời với sứ mệnh tôn vinh thời gian – tài sản quý giá nhất của nhân loại. Chúng tôi không chỉ sản xuất đồng hồ, chúng tôi lưu giữ khoảnh khắc bằng cơ khí chính xác đỉnh cao.",
        story_desc2: "Mỗi chiếc đồng hồ tiêu tốn hơn 300 giờ làm việc thủ công của các bậc thầy nghệ nhân trước khi xuất xưởng.",
        stat1: "Thủ Công Thụy Sĩ",
        stat2: "Giờ Chế Tác",
        footer_desc: "Tuyệt tác thời gian dành riêng cho những quý ông và quý cô định hình phong cách dẫn đầu.",
        footer_col1: "Liên Kết Nhanh",
        footer_col2: "Bảo Mật & Hỗ Trợ",
        footer_col3: "Đăng Ký Nhận Tin VIP"
    },
    en: {
        nav_home: "Home",
        nav_products: "Collections",
        nav_specs: "Specifications",
        nav_story: "Brand Story",
        nav_cta: "Explore Now",
        hero_sub: "THE ULTIMATE MASTERPIECE OF TIME",
        hero_title: "Symbol of Luxury & Prestige",
        hero_desc: "Handcrafted by world-class artisans, bringing eternal beauty that transcends through time.",
        hero_btn1: "View Collections",
        hero_btn2: "Our Heritage",
        prod_badge: "EXCLUSIVE LIMITED EDITION",
        prod_title: "The Royal Collection",
        prod_desc: "Each timepiece is a statement of personal style and ultimate authority.",
        p1_desc: "18K solid gold case, absolute scratch-resistant sapphire crystal glass.",
        p2_desc: "Exquisite skeleton design, mysterious obsidian black combined with gold accents.",
        p3_desc: "A timeless work of art with Swiss-certified precision.",
        buy_btn: "Order Now",
        spec_badge: "PERFECT PRECISION",
        spec_title: "Ultimate Technical Specs",
        spec_desc: "Discover the craftsmanship hidden beneath the luxury exterior.",
        tab1_title: "Movement",
        tab2_title: "Materials",
        tab3_title: "Water Resistance",
        m_heading: "Caliber A900 Automatic In-House",
        m_desc: "Equipped with an exclusive automatic self-winding movement featuring 42 jewels, 28,800 vph oscillation frequency, ensuring up to 72 hours of continuous power reserve.",
        mat_heading: "18K Solid Gold & Sapphire Crystal",
        mat_desc: "The entire case is cast from hand-polished 18K solid gold. The crystal glass is made of anti-reflective sapphire crystal, achieving 9 on the Mohs hardness scale.",
        w_heading: "Water Resistance Up to 100 Meters",
        w_desc: "Next-generation dual gasket system and screw-down crown provide maximum protection against water pressure at depths of up to 100 meters (10 ATM).",
        story_badge: "HERITAGE & ART",
        story_title: "Redefining Perfection",
        story_desc1: "Founded in Geneva, Switzerland, AURELIA was born with the mission to honor time – humanity's most precious asset. We don't just manufacture watches; we preserve moments through supreme precision mechanics.",
        story_desc2: "Each timepiece demands over 300 hours of meticulous handcrafting by master artisans before leaving the workshop.",
        stat1: "Swiss Handcrafted",
        stat2: "Crafting Hours",
        footer_desc: "A masterpiece of time designed exclusively for gentlemen and ladies shaping the vanguard of style.",
        footer_col1: "Quick Links",
        footer_col2: "Security & Support",
        footer_col3: "VIP Newsletter"
    }
};

let currentLang = 'vi';
const langToggleBtn = document.getElementById('lang-toggle');
const langTextSpan = document.getElementById('lang-text');

langToggleBtn.addEventListener('click', () => {
    currentLang = currentLang === 'vi' ? 'en' : 'vi';
    langTextSpan.textContent = currentLang === 'vi' ? 'EN' : 'VI';
    
    // Cập nhật tất cả các thẻ có attribute data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[currentLang][key]) {
            element.textContent = translations[currentLang][key];
        }
    });
});