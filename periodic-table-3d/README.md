# Nguyên Tố — Bảng tuần hoàn 3D

Website Vite + Three.js dựa trên giao diện bảng tuần hoàn Figma hiện tại.

## Chạy trên máy

1. Cài Node.js LTS.
2. Giải nén thư mục dự án.
3. Mở Terminal tại thư mục `periodic-table-3d`.
4. Chạy:

```bash
npm install
npm run dev
```

5. Mở địa chỉ Vite in ra (thường là `http://localhost:5173`).

## Build để triển khai

```bash
npm run build
npm run preview
```

Thư mục `dist/` là bản website đã build, có thể đưa lên Netlify, Vercel hoặc hosting tĩnh.

## Tính năng

- 118 nguyên tố, bố cục bảng tuần hoàn và hai hàng họ Lantan/Actini.
- Tìm theo tên tiếng Việt, ký hiệu hoặc số hiệu nguyên tử.
- Lọc theo 9 nhóm phân loại.
- Chuyển chế độ 2D/3D cho các thẻ nguyên tố.
- Hover nâng thẻ, viền sáng và chiều sâu.
- Nhấn nguyên tố để cập nhật hồ sơ bên phải.
- Mô hình nguyên tử Three.js có quỹ đạo electron, tự xoay và có thể kéo để đổi góc nhìn.
- Nền hạt 3D, giao diện responsive và hỗ trợ reduced motion.

## Ghi chú dữ liệu

Khối lượng nguyên tử là các giá trị tiêu biểu/khối lượng đồng vị đại diện. Cấu hình electron hiển thị trong bản mẫu là thông tin học tập rút gọn; một số nguyên tố có cấu hình ngoại lệ hoặc trạng thái chưa được đo trực tiếp. Mô hình Bohr là minh họa trực quan, không phải mô hình lượng tử chính xác.
