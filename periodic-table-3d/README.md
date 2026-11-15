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


## Trang khám phá mới (nhánh feature/period-group-element-explorer)

- `/group.html?n=10` — danh sách nguyên tố trong nhóm 10, điều hướng nhanh nhóm 1–18.
- `/period.html?n=4` — nguyên tố chu kỳ 4, điều hướng chu kỳ 1–7.
- `/element.html?symbol=Ni` — hồ sơ Niken; thay `Ni` bằng bất kỳ ký hiệu trong 118 nguyên tố.
- Mở các trang mới từ thanh điều hướng hoặc nút **Khám phá hồ sơ đầy đủ** trong bảng tuần hoàn.

Trang nguyên tố gồm: thông tin định danh, các thuộc tính nền tảng có sẵn, cấu hình electron, phân bố lớp, mô hình 3D có thể xoay/zoom, chế độ Bohr/đám mây/hạt nhân, phép so sánh mol, ví dụ phản ứng được kiểm tra và ứng dụng thực tế đã biên soạn.

**Lưu ý quan trọng về dữ liệu:** một số tính chất như độ âm điện, khối lượng riêng, nhiệt độ nóng chảy/sôi, số oxi hóa và phương trình phản ứng chỉ có sẵn với những nguyên tố đã được biên soạn. Dấu gạch ngang hoặc ghi chú thiếu dữ liệu có nghĩa là chưa được bổ sung, không khẳng định tính chất đó bằng 0. Mô hình Bohr, đám mây điểm và hạt nhân đều có tính minh họa; số hạt nhân được giới hạn để trình duyệt chạy mượt. Khối lượng mol dùng các giá trị nguyên tử khối tham khảo, và so sánh chỉ được tính khi có giá trị số.

### Triển khai Vercel

Đặt **Root Directory** là `periodic-table-3d`, framework **Vite**, Build Command `npm run build`, Output Directory `dist`. Dự án dùng cấu hình `vite.config.js` cho cả bốn trang HTML, bảo đảm liên kết trực tiếp tới `/element.html`, `/group.html`, và `/period.html` hoạt động sau khi build. Trong nhánh tính năng này không thay đổi Firebase hay dịch vụ backend.

### Cập nhật tính năng

Dữ liệu mới thuộc `src/chemistry.js`; mã trang nằm tại `src/explorer.js`; style riêng tại `src/explorer.css`. Thông tin chi tiết chỉ cần cập nhật ở `elementFacts` và `reactionExamples`, không trộn vào mã giao diện.


## Atlas Nguyên Tố v2 — giao diện editorial, mô hình 3D dạng vật thể

**Dự án hiện tại dùng entry points mới**:

| URL | Mã điều khiển | Mô tả |
|---|---|---|
| `/` | `src/atlas-main.js` | Bảng tuần hoàn 3D dạng tấm bảng, các ô nổi với chữ trực tiếp trên CanvasTexture; chọn ô mở hồ sơ; fallback 2D. |
| `/element.html?symbol=Fe` | `src/element-atlas.js` | Hồ sơ theo 3 chương: tổng quan; cấu hình electron, orbital ↑↓ và nguyên tử 3D; mẫu vật 3D và tính chất. |
| `/group.html?n=10` | `src/collection-atlas.js` | Danh mục các nguyên tố trong nhóm. |
| `/period.html?n=4` | `src/collection-atlas.js` | Danh mục các nguyên tố trong chu kỳ. |

**Module chính**: `site-nav.js` (một thanh điều hướng); `theme.js` (sáng/tối ghi nhớ trên mọi trang); `orbital-diagram.js` (Hund/Pauli); `material-viz.js` (mô hình hình thái đặc trưng), `atlas.css`, `atlas-detail.css`, `atlas-collection.css`.

`src/main.js` và `src/explorer.js` còn trong repository để tham khảo lịch sử nhưng không còn là entry point đang dùng. Không sửa các file cũ nếu muốn thay đổi giao diện v2.

```sh
cd periodic-table-3d
npm ci
npm test
npm run dev
npm run build
```

Các mô hình vật chất chỉ là minh họa diễn giải. Một số nguyên tố hiếm/siêu nặng không có mẫu vật đủ để xác định hình dạng ngoài đời; không tạo minh họa giả định như thể có dữ liệu quan sát.

**Hướng dẫn đầy đủ cho AI coder và maintainer:** [AI_HANDOFF_BRIEF.md](docs/AI_HANDOFF_BRIEF.md).

> Khi deploy Vercel: **Root Directory** là `periodic-table-3d`, framework Vite, build `npm run build`, output `dist`. Không commit `node_modules/`.
