# 🦀 Crab's ICPC Generator

Ứng dụng web tạo **ACM-ICPC Team Notebook** chuẩn form LaTeX theo mô hình [codes2pdf](https://github.com/Erfaniaa/codes2pdf), kết nối trực tiếp với **Overleaf API** mà không tốn bất kỳ chi phí máy ảo hay cài đặt phức tạp nào!

---

## ✨ Tính năng chính

- 🚀 **1-Click Overleaf API**: Bấm **"Generate Notebook"** -> Hiện hộp thoại *"Give me a star ⭐"* -> Bấm *"Ok bro 🚀"* để mở ngay mã nguồn sang Overleaf và xuất PDF chuẩn TeX Live 100% miễn phí.
- 📁 **2 cách nạp đề mục & mã nguồn**:
  - **Tải trọn bộ Folder / ZIP**: Đút toàn bộ các file vào từng folder theo chuyên đề, gom tất cả vào một folder lớn rồi chọn hoặc kéo thả vào web. Hệ thống tự động phân loại cây thư mục thành các Category/Section.
  - **Tải lên từng đề mục thủ công**: Tạo các mục chính (1 Algorithms, 2 DP Optimizations, 3 Data structures...), nạp từng file code vào mục đó.
- 🏫 **Tải ảnh Logo trường (Tùy chọn)**:
  - Cho phép **Upload** hoặc **Paste (Ctrl + V)** ảnh logo trường học trực tiếp từ clipboard.
  - Logo được hiển thị nhỏ nhắn, trang nhã nằm ngang hàng với chữ *Team Notebook*.
- 🧹 **Tính năng Reset & Clear linh hoạt**:
  - Nút **Eraser** cho từng mục: Xóa toàn bộ file trong mục đó.
  - Nút **Reset All**: Đặt lại toàn bộ notebook về trạng thái ban đầu chỉ với 1 cú click.
- 📑 **Mục lục Table of Contents chuẩn ICPC**:
  - 3 cột định dạng A4 Landscape.
  - Đường chấm dẫn (dot leaders) và số trang trực quan y hệt mẫu tài liệu chuẩn.
- 🎨 **Giao diện Apple Fluid-Interface**:
  - Thiết kế theo nguyên lý Apple Fluid UI (Framer Motion springs, vật liệu mờ Translucent Glassmorphism, phản hồi xúc giác ngay khi chạm con trỏ).

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

## 📜 Credits & Bản quyền

- **Tạo bởi:** Crabrian
  - **Github:** [https://github.com/Crablegit](https://github.com/Crablegit)
  - **Linkedin:** [https://www.linkedin.com/in/brianthecrab/](https://www.linkedin.com/in/brianthecrab/)
  - **Discord:** `brianthecrab`
- **Template Credit:** 
  - Template lấy từ [https://github.com/Erfaniaa/codes2pdf](https://github.com/Erfaniaa/codes2pdf).
  - Website chỉ hỗ trợ việc sử dụng template mà không cần cài đặt các thư viện TeX phức tạp hay tốn phí máy chủ.
