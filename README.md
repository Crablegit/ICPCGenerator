# 🦀 Crab's ICPC Generator

Ứng dụng web tạo **ACM-ICPC Team Notebook** chuẩn form LaTeX theo mô hình [codes2pdf](https://github.com/Erfaniaa/codes2pdf), kết nối trực tiếp với **Overleaf API** mà không tốn bất kỳ chi phí máy ảo hay cài đặt phức tạp nào!

---

## ✨ Tính năng chính

- 🚀 **1-Click Overleaf API**: Bấm **"Generate Notebook"** -> Hiện hộp thoại *"Give me a star ⭐"* -> Bấm *"Ok bro 🚀"* để mở ngay mã nguồn sang Overleaf và xuất PDF chuẩn TeX Live 100% miễn phí.
- 🌓 **Chuyển đổi Light Mode & Dark Mode**: Tích hợp nút chuyển đổi giao diện sáng/tối chuẩn phong cách Apple ngay góc phải thanh header, lưu lại tùy chọn theo trình duyệt.
- 📑 **Mục lục Table of Contents cố định trực quan**:
  - Toàn bộ khung bên phải là bản xem trước mục lục chuẩn ACM-ICPC (3 cột ngang, khổ A4 Landscape, đường chấm dẫn dot leaders và số trang).
  - Tích hợp 2 nút thao tác chính ngay trên thanh tiêu đề mục lục: **Reset All** và **Generate Notebook**.
  - Click vào bất kỳ thuật toán nào để mở cửa sổ chỉnh sửa code nhanh chóng.
- 📁 **2 cách nạp đề mục & mã nguồn**:
  - **Tải trọn bộ Folder / ZIP**: Đút toàn bộ các file vào từng folder theo chuyên đề, gom tất cả vào một folder lớn rồi chọn hoặc kéo thả vào web. Hệ thống tự động phân loại cây thư mục thành các Category/Section.
  - **Tải lên từng đề mục thủ công**: Tạo các mục chính (1 Algorithms, 2 DP Optimizations, 3 Data structures...), nạp từng file code vào mục đó.
- ⬇️ **Tự động cuộn xuống khi thêm Category**: Khi bấm *"Add Category"*, danh sách sẽ tự động cuộn mượt mà xuống cuối cùng và kích hoạt sẵn chế độ đổi tên để bạn gõ tên mục mới ngay lập tức.
- 🏫 **Tải ảnh Logo trường (Tùy chọn)**:
  - Cho phép **Upload** hoặc **Paste (Ctrl + V)** ảnh logo trường học trực tiếp từ clipboard.
  - Logo được hiển thị nhỏ nhắn, trang nhã nằm ngang hàng với chữ *Team Notebook*.
- 🧹 **Tính năng Reset & Clear linh hoạt**:
  - Nút **Eraser** cho từng mục: Xóa toàn bộ file trong mục đó.
  - Nút **Reset All**: Đặt lại toàn bộ notebook về trạng thái ban đầu chỉ với 1 cú click.

---

## 🚀 Cài đặt & Khởi chạy cục bộ

```bash
# Di chuyển vào thư mục dự án
cd icpc-notebook-generator

# Cài đặt thư viện
npm install

# Chạy server phát triển
npm run dev
```

Truy cập: [http://localhost:3000](http://localhost:3000)

---

## 🌐 Triển khai lên Vercel & Supabase

1. **Deploy Vercel**:
   - Push mã nguồn lên GitHub.
   - Truy cập [vercel.com](https://vercel.com) > Import repository > Bấm **Deploy**.
2. **Cấu hình Supabase (Tùy chọn)**:
   - Thêm biến môi trường `NEXT_PUBLIC_SUPABASE_URL` và `NEXT_PUBLIC_SUPABASE_ANON_KEY` vào file `.env.local` hoặc phần Settings trên Vercel.

---

## 📜 Credits

- **Created by:** Crabrian
  - **Github:** [https://github.com/Crablegit](https://github.com/Crablegit)
  - **Linkedin:** [https://www.linkedin.com/in/brianthecrab/](https://www.linkedin.com/in/brianthecrab/)
  - **Discord:** `brianthecrab`
- **Template Credit:** [https://github.com/Erfaniaa/codes2pdf](https://github.com/Erfaniaa/codes2pdf)
