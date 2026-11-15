# ATLAS NGUYÊN TỐ — MASTER BUILD BRIEF v2.0
**Handoff cho AI coder / lập trình viên kế tiếp — 15/11/2026**

## 0. Mục tiêu sản phẩm
Xây dựng một **bảng tuần hoàn tương tác có chiều sâu, giàu giá trị học thuật, giao diện như sản phẩm xuất bản thực thụ**, không phải một dashboard AI ngẫu nhiên. Mỗi nguyên tố là một điểm truy cập vào hồ sơ khoa học: electron/orbital và minh họa vật chất có hình thái riêng. Mô hình 3D **là đối tượng có cấu trúc thật**, không phải ảnh giả lập dùng CSS.

Độc giả: học sinh THCS/THPT, sinh viên nhập môn, người học tự do. Ngôn ngữ giao diện: **tiếng Việt**.

## 1. Repository và ràng buộc kỹ thuật

- GitHub: `pkim29038-cpu/bthnthh3d`, thư mục làm việc **`periodic-table-3d/`**.
- Hosting Production: `https://periodic-table-3d-nu.vercel.app/`.
- Framework: **Vite + Vanilla JavaScript + Three.js**. Không chuyển toàn bộ dự án thành React hoặc Next.js nếu không có yêu cầu mới.
- Entry points bắt buộc: `index.html`, `element.html`, `group.html`, `period.html`. Kiểm tra cấu hình `vite.config.js` để build cả 4.
- Thiết kế theo module một chức năng/tập tin, không nhét toàn bộ code vào `main.js`.
- Dùng `npm ci`, `npm test`, `npm run build` để kiểm tra trước khi merge.
- **Không commit `node_modules` hoặc `dist`**. Đã có sự cố `Permission denied` trên Vercel do `node_modules` từ Windows.
- Các thay đổi lớn: tạo branch feature, mở Pull Request, đợi CI thành công và Preview Vercel `READY`, rồi merge `main`. Không sửa hay xóa lịch sử Git khi chưa có sự đồng ý.

### Các file của phiên bản v2
- `src/atlas-main.js`: trình diễn bảng tuần hoàn 3D + fallback 2D, tìm kiếm, lọc, tương tác chọn ô.
- `src/atlas.css`: thiết kế chung và bảng tuần hoàn.
- `src/element-atlas.js` + `src/atlas-detail.css`: hồ sơ nguyên tố thành các chương khoa học.
- `src/orbital-diagram.js`: thuật toán xếp mũi tên orbital và render sơ đồ ô.
- `src/material-viz.js`: các hình thái vật chất bằng Three.js.
- `src/collection-atlas.js` + `src/atlas-collection.css`: danh mục Nhóm/Chu kỳ.
- `src/theme.js`: chuyển sáng/tối, ghi nhớ lựa chọn.
- `src/site-nav.js`: chỉ một thanh điều hướng toàn hệ thống.
- `src/elements.js`, `src/chemistry.js`: bộ dữ liệu khoa học; cập nhật có đối chiếu nguồn.
- `scripts/verify-periodic.mjs`: kiểm tra số nguyên tố, sơ đồ, mô hình, các entry points.

## 2. Định hướng mỹ thuật (Art Direction)
**Từ khóa:** scientific atlas, museum specimen, industrial object, editorial, typographic clarity, industrial design, restrained interaction.

### Nên làm
- Giao diện sáng: giấy ngà `#F5F2EB`, nền tấm `#FFFDFA`, chữ than `#263032`, viền cát `#D8D4C9`, nhấn đồng trầm `#916C4B`.
- Giao diện tối: than đá `#11171B`, mặt `#1B2226`, chữ kem `#E9E6DD`, viền `#343E42`, nhấn đồng `#C5A78A`.
- Typography: Manrope cho tiêu đề và nội dung; DM Mono cho ký hiệu, số nguyên tử, thông số kỹ thuật.
- Tạo phân cấp bằng **kích thước chữ, khoảng trắng, đường viền, thứ tự đọc** hơn là thẻ màu.
- Dùng vệt sáng theo vật liệu 3D thực (lighting/shading), nhưng chỉ dùng hiệu ứng nhẹ ở giao diện.
- Layout desktop: tối đa khoảng 1500px, container rõ ràng, nhịp dọc 32–64px.
- Mobile: layout gọn, không cố nhét cả 18 cột bảng vào chiều ngang điện thoại; bảng 2D cuộn ngang.
- Chú thích khoa học nhỏ và rõ, không giả vờ thông số có độ chính xác cao nếu thiếu dữ liệu.

### Tuyệt đối tránh
- Neon xanh tím, nhiều màu gradient chung một màn, glow khắp nơi, card 100% bo tròn, icon và badge lặp lại cho mọi dòng.
- Hai hoặc ba thanh tab điều hướng nội dung giống nhau.
- Bảng tóm tắt thứ hai chiếm nửa màn hình cạnh bảng tuần hoàn chính.
- Dùng hình cầu trơn, chỉ đổi màu để gọi là “mô hình mẫu vật thực” cho mọi nguyên tố.
- Sao chép nguyên bố cục, asset, code hay thương hiệu từ trang tham khảo.

## 3. Bảng tuần hoàn chính — mô hình vật thể
Đây là **trải nghiệm chủ đạo**.

1. Render một **tấm bảng hình hộp chữ nhật** có độ dày, đường viền vật liệu và ánh sáng từ Three.js.
2. Có đủ **118 ô 3D** nhô khỏi mặt tấm. Hình học mặt trước và các cạnh phải có độ sâu.
3. **Chữ thuộc về vật thể**: số Z, ký hiệu, tên và nguyên tử khối đặt trong CanvasTexture trên mặt ô/mesh. Khi xoay, phóng to hoặc kéo bảng, chữ di chuyển cùng ô. Không dùng HTML tuyệt đối phủ nổi lên mô hình.
4. Bố cục chuẩn: **18 cột nhóm, 7 hàng chu kỳ**; dãy Lantan **57–71**, Actini **89–103** tách riêng; ô vị trí nhóm 3 của chu kỳ 6 và 7 dùng dải tham chiếu.
5. Dùng `OrbitControls`: drag để xoay, wheel/pinch để zoom, nút Reset camera. Không tự động quay khiến người học khó đọc.
6. Hover gợi ý ngắn; click/tap đi **thẳng `element.html?symbol=...`**, không mở bảng summary bên cạnh.
7. Tìm kiếm lọc/nhấn Enter mở nguyên tố phù hợp; không làm các ô khác bị dồn vị trí khi lọc.
8. Có chế độ **Mặt phẳng 2D thực sự**, dùng HTML links, hoạt động nếu WebGL không hỗ trợ và là chế độ mặc định phù hợp trên màn hình hẹp.
9. Hiệu năng: giới hạn `devicePixelRatio`, hủy texture/geometry khi đổi chủ đề, hạn chế re-render khi tab trình duyệt bị ẩn. Có thể xem xét instancing nếu cần nâng cấp.

**Phải kiểm tra:** drag hoạt động, click không nhầm với drag, text không đứng yên bên ngoài bảng, 118 ô không trùng, phóng to không cắt bảng, mobile cuộn ngang được.

## 4. Cấu trúc hồ sơ nguyên tố
Chỉ **một top navigation**: Bảng tuần hoàn / Nhóm / Chu kỳ. Không thêm nav ẩn giả giống mục menu chính.

### Chương 00 — Định danh (Hero)
- Z, ký hiệu, tên tiếng Việt/tiếng Anh (nếu đã xác minh), nguyên tử khối, nhóm, chu kỳ, phân loại.
- Tóm tắt khoa học **2–3 câu**, trọng tâm nguyên tố đó; không diễn giải nhạt nhòa giống nhau cho cả 118.
- Điều hướng nguyên tố trước và sau có thể ở cuối trang.

### Chương 01 — Electron & Orbital
- Cấu hình electron; xác định lớp electron; minh họa Bohr 3D kéo xoay.
- **Sơ đồ orbital ô vuông ↑↓**: phân lớp `s = 1 ô`, `p = 3`, `d = 5`, `f = 7`. Điền mỗi ô một ↑ trước rồi mới ghép ↓, không quá 2 mũi tên/ô.
- Cấu hình cho các ngoại lệ thường gặp (Cr, Cu, Ag, Au, Pd, Pt...) phải được rà soát. Với dãy f và nguyên tố nặng, **không khẳng định cấu hình gần đúng là dữ liệu chuẩn đã kiểm chứng**.
- Ghi rõ mô hình Bohr là cách minh họa lớp, không phải quỹ đạo thực tế.

### Chương 02 — Hình thái vật chất
- Sử dụng module `material-viz.js`; ưu tiên **hình dạng nhận diện được**, bề mặt gần vật chất hơn là hiệu ứng màu.
- Mẫu đã làm chuyên biệt: Fe = dầm chữ I, Cu = cuộn dây, Au = thỏi, Ag = xu, Al/Zn = tấm, Ni = trụ kim loại, C = xếp lớp than chì, S/I/Si = tinh thể, Hg/Br = giọt chất lỏng, khí = hạt phân bố hoặc phân tử đôi, U/Th = khoáng vật minh họa.
- Với nguyên tố chưa rõ dạng mẫu vật hoặc nhóm siêu nặng: hiển thị **mô hình ký hiệu** và ghi rõ chưa có mẫu vật vĩ mô đã được xác nhận.
- Khối mô phỏng hạt và khoáng vật **không nhằm mô tả bức xạ nhìn thấy được** và không nên gây hiểu nhầm rằng chất phóng xạ tự phát sáng.
- Có dòng chú thích “Mô hình minh họa, không phải ảnh mẫu vật / dữ liệu đo”.

### Chương 03 — Tính chất, ứng dụng
- Dữ liệu quan trọng: trạng thái, nhiệt độ, khối lượng riêng, độ âm điện, số oxi hóa, ứng dụng (nếu có).
- Không phát sinh giá trị giả hoặc bịa phương trình cho nguyên tố chưa có dữ liệu.
- Số liệu phải ghi rõ đơn vị, điều kiện, tính xấp xỉ khi cần. Dùng văn phong học thuật ngắn gọn.

## 5. Trang Nhóm / Chu kỳ
- Nhóm: 1–18; Chu kỳ: 1–7. Chọn mục bằng dropdown/nút nhỏ **trong nội dung**, không tạo navbar thứ hai.
- Mỗi trang có: tiêu đề đúng ngữ cảnh, giải thích, số nguyên tố, danh sách ô trực tiếp mở hồ sơ.
- Các nguyên tố khối f không được đồng loạt gọi là nhóm 3.
- Số nguyên tố 7 chu kỳ lần lượt **2, 8, 8, 18, 18, 32, 32**.

## 6. Theme, trạng thái và khả năng truy cập
- Hai theme sáng/tối, lưu bằng `localStorage`, `data-theme` ở root, áp dụng trên **cả 4 trang**.
- Cùng hệ token: surface, ink, secondary, muted, line, bronze; bảo đảm tương phản và vùng hover/focus.
- Tất cả nút phải có chức năng thật, icon có aria-label, mũi tên chọn ô cần truy cập được bằng bàn phím.
- Nếu WebGL không có, chương văn bản và 2D fallback vẫn đọc được.
- Giảm animation với `prefers-reduced-motion`; không bắt buộc tự quay.

## 7. Kiểm thử & Definition of Done
- `npm ci` và `npm run build` thành công trên Linux Vercel.
- `npm test` xác nhận 118 Z duy nhất, nhóm/chu kỳ, 15 Lantan, 15 Actini, orbital theo Hund, mô hình chuyên biệt Fe/Cu/Au/Hg/O/U, 1 navbar và theme trên 4 trang.
- Build tạo đủ `dist/index.html`, `dist/element.html`, `dist/group.html`, `dist/period.html`.
- Kiểm thử thủ công ít nhất 4 kích thước: 360px, 768px, 1280px, 1920px.
- Mở URL trực tiếp: `/element.html?symbol=Be`, `/element.html?symbol=Fe`, `/element.html?symbol=Ni`, `/element.html?symbol=U`, `/group.html?n=10`, `/period.html?n=6`.
- Kiểm tra dark/light sau reload, click mesh mở đúng nguyên tố, pan/zoom không làm mất bảng, orbital Be = 1s² 2s², Ni = [Ar] 3d⁸ 4s².
- Vercel Preview `READY` trước khi hợp nhất vào Production. Sau merge kiểm tra domain chính đang trỏ commit mới.

## 8. Cách làm việc dành cho AI coder
**Không đề xuất thay toàn bộ bằng sản phẩm khác.** Làm từng module hoàn chỉnh:
1. Đọc toàn bộ mã nguồn hiện tại và xác định nguyên nhân, không đoán dựa trên screenshot.
2. Đề xuất ngắn giải pháp, các file bị ảnh hưởng và rủi ro.
3. Tạo code production-ready đủ file, không patch lặt vặt khiến người dùng phải tìm dòng sửa thủ công.
4. Kết thúc từng bước bằng kiểm tra cú pháp/build/test và minh bạch điều chưa kiểm thử.
5. Luôn kiểm tra tính đúng khoa học trước khi mô tả hình thái nguyên tố.
6. Mọi thay đổi vào GitHub qua nhánh và PR, giữ tương thích Vercel `Root Directory=periodic-table-3d`.

## 9. Nguồn khoa học đối chiếu
- IUPAC periodic table: https://iupac.org/what-we-do/periodic-table-of-elements/
- The Open University — Putting electrons in boxes: https://www.open.edu/openlearn/mod/oucontent/view.php?id=87848&section=_unit2.1.10.3
- Royal Society of Chemistry periodic table: https://periodic-table.rsc.org/

---
### PROMPT NGẮN ĐỂ GỬI CHO AI CODER KHÁC
> Bạn là senior frontend engineer kiêm scientific visualization designer. Hãy tiếp tục phát triển dự án Atlas Nguyên Tố tại repository `pkim29038-cpu/bthnthh3d`, thư mục `periodic-table-3d/` (Vite + vanilla JS + Three.js). Bắt buộc đọc file `docs/AI_HANDOFF_BRIEF.md` cùng toàn bộ cấu trúc code. Giữ một thanh điều hướng, giao diện editorial khoa học sáng/tối, bảng tuần hoàn dạng vật thể hộp 3D xoay/zoom với chữ nằm trong texture của từng ô, một trang hồ sơ có orbital ô ↑↓ và mẫu vật 3D có hình thái khác nhau. Không dùng dashboard rối hoặc các quả cầu chỉ khác màu, không bịa mô hình thật cho nguyên tố siêu nặng. Làm thay đổi theo file hoàn chỉnh, bảo toàn 4 HTML entry, có test, CI và Vercel Preview trước khi merge. Trình bày các kết quả và giới hạn kiểm thử một cách rõ ràng.
