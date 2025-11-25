# Project Setup Progress

- [x] Verify that the copilot-instructions.md file in the .github directory is created.
- [x] Clarify Project Requirements
- [x] Scaffold the Project
- [x] Customize the Project
- [x] Install Required Extensions
- [x] Compile the Project
- [ ] Create and Run Task
- [ ] Launch the Project
- [ ] Ensure Documentation is Complete

## Project Details
- Type: Next.js Admin Frontend
- Technologies: Next.js 14+, TypeScript, Tailwind CSS, TanStack Query, shadcn/ui, next-themes
- Features: Modern admin dashboard with sidebar and header layout

## Completed Setup
- ✅ Next.js project scaffolded with TypeScript and Tailwind CSS
- ✅ shadcn/ui components installed (button, card, separator, avatar, dropdown-menu, sheet, scroll-area)
- ✅ TanStack Query and next-themes installed
- ✅ Sidebar component with navigation menu
- ✅ Header component with search, notifications, and user menu
- ✅ Theme toggle for dark/light mode
- ✅ Responsive layout with mobile support
- ✅ Dashboard page with stats cards and placeholder sections

## Completed Setup
- ✅ Next.js project scaffolded with TypeScript and Tailwind CSS
- ✅ shadcn/ui components installed (button, card, separator, avatar, dropdown-menu, sheet, scroll-area)
- ✅ TanStack Query and next-themes installed
- ✅ Sidebar component with navigation menu
- ✅ Header component with search, notifications, and user menu
- ✅ Theme toggle for dark/light mode
- ✅ Responsive layout with mobile support
- ✅ Dashboard page with stats cards and placeholder sections

## Coding Standards & Security Guidelines

### 📋 PHẦN 1: QUY ĐỊNH CHUNG VỀ QUY TRÌNH

#### 1. Unit Testing & Logging
- ✅ **Yêu cầu**: Developer phải viết Unit Test phủ các logic quan trọng
- 📝 **Quy định PL03**: Phải lưu trữ báo cáo log chi tiết của Unit Test, có chữ ký nhân sự chịu trách nhiệm để MSC nghiệm thu
- ⚠️ **Lưu ý**: Không được fix xong rồi xóa log

#### 2. Source Code Review
- 🔍 **Rà soát 100%**: Trước khi Go-live, bắt buộc rà soát toàn bộ source code
- 🚫 **Vi phạm sở hữu trí tuệ**: Đảm bảo không có đoạn code sao chép trái phép từ bên thứ 3
- ⛔ **Lỗi nghiêm trọng**: Không tồn tại lỗi mức độ Critical hoặc High

#### 3. Quyền truy cập & Bảo mật dữ liệu
- 🔒 Developer không được lưu trữ hoặc sao chép dữ liệu thật của khách hàng ra thiết bị cá nhân

---

### 🔧 PHẦN 2: BACKEND DEVELOPER (FASTAPI - PYTHON)

**Trọng tâm**: Logic nghiệp vụ • Dữ liệu • Phân quyền • Logging

#### 1. Xác thực & Phân quyền (Auth & Access Control)

**🔐 Xác thực đa yếu tố (MFA)**
- Tích hợp MFA (OTP/Authenticator) cho tài khoản quản trị

**🛡️ Chống IDOR (Insecure Direct Object References)**
- Khi viết API lấy/sửa dữ liệu theo ID (ví dụ: `GET /ip/{id}`), phải kiểm tra quyền sở hữu hoặc quyền truy cập của user đối với ID đó
- **Mass Assignment**: Kiểm soát chặt chẽ các trường thông tin trong request khi thực hiện cập nhật

**🔑 Quản lý mật khẩu & Phiên**
- Cấm mật khẩu yếu, bắt buộc đổi mật khẩu mặc định
- Tự động khóa tài khoản sau số lần đăng nhập sai quy định (ví dụ: 5 lần)
- Thiết lập Session Timeout (hết hạn phiên) sau thời gian không hoạt động
- **CSRF**: Có cơ chế kiểm tra và chống CSRF

#### 2. Xử lý dữ liệu đầu vào (Input Validation)

**✔️ Validation**
- Validate tất cả inputs (sử dụng Pydantic)

**💉 Chống Injection (SQL, NoSQL, OS Command)**
- ❌ Tuyệt đối không cộng chuỗi SQL/Command
- ✅ Sử dụng ORM (SQLAlchemy / Tortoise) hoặc Parameterized Queries
- 🚫 Cấm dùng các hàm thực thi lệnh hệ thống (`os.system`, `subprocess`) với tham số từ người dùng

**📤 Xử lý File Upload**
- Kiểm tra file type và size
- Validate đuôi file cho phép (`.pdf`, `.docx`) bằng thư viện chuyên dụng (magic numbers)
- Chặn upload các file thực thi (`.exe`, `.sh`, `.php`...)
- Chặn các file chứa mã độc
- Đổi tên file khi lưu (khuyến nghị dùng UUID) để tránh lỗi Path Traversal

#### 3. Xử lý lỗi (Error Handling)
- ⚠️ **Nguyên tắc**: Không bao giờ để lộ Stack Trace lỗi ra ngoài môi trường Production

#### 4. Ghi nhật ký (Logging)
- 📊 **Phạm vi**: Ghi log toàn bộ hành động: Login, Logout, Thêm/Sửa/Xóa dữ liệu, Export dữ liệu
- 📝 **Nội dung log**: Phải trả lời được 4 câu hỏi: **Ai? Làm gì? Khi nào? Ở đâu?**
- 🔒 **Bảo mật log**: Tuyệt đối không log thông tin nhạy cảm như Password, Token

#### 5. Kiểm tra thư viện bên thứ 3
- 🔍 Thường xuyên quét các thư viện bên thứ 3 (sử dụng `pip-audit` hoặc tương đương)

#### 6. Cấu hình CORS
- 🌐 Thiết lập chặt chẽ các domain được phép truy cập API

---

### 🎨 PHẦN 3: FRONTEND DEVELOPER (NEXT.JS)

**Trọng tâm**: Giao diện người dùng • Lưu trữ client • XSS

#### 1. Chống tấn công phía Client

**🛡️ Chống XSS (Cross-Site Scripting)**
- ❌ Không render trực tiếp HTML từ user input (trừ khi đã qua thư viện sanitize như DOMPurify) để chống Reflected/Stored XSS
- 🔍 Kiểm soát kỹ các đoạn mã JavaScript thao tác trực tiếp với DOM

**🖱️ Chống Clickjacking**
- Đảm bảo ứng dụng không bị nhúng vào iframe của trang web khác

**🔗 Chuyển hướng an toàn**
- Kiểm tra kỹ các tham số chuyển hướng URL (ví dụ: `login?next=...`) để tránh Open Redirect (dẫn user sang trang độc hại)

#### 2. Quản lý dữ liệu phía Client

**💾 Lưu trữ cục bộ**
- 🔐 Lưu trữ thông tin nhạy cảm (API keys, Secret Key) trong environment variables, không hardcode trong source code
- 🚫 Không lưu thông tin nhạy cảm (mật khẩu, thông tin cá nhân chi tiết) vào `localStorage` hoặc `sessionStorage`
- 🍪 Token xác thực nên ưu tiên lưu trong HttpOnly Cookie

**👁️ Hiển thị thông tin**
- Không để lộ thông tin người dùng, danh sách tài khoản trên giao diện (khi chưa được phép)

#### 3. Dependencies
- 🔍 Thường xuyên chạy `npm audit` để phát hiện lỗ hổng trong các thư viện node_modules

#### 4. Security Headers
*(Cấu hình qua `next.config.js` hoặc Middleware)*

- 🔒 **Strict-Transport-Security**: Bắt buộc HTTPS
- 📎 **X-Content-Type-Options: nosniff**: Chống đoán định kiểu MIME
- 🖼️ **X-Frame-Options: DENY**: Chống Clickjacking (nhúng web vào iframe trang khác)
- 🛡️ **Content-Security-Policy (CSP)**: Kiểm soát nguồn tải script/style/img
