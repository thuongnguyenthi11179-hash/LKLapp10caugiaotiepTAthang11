# LKL10caugiaotiepTAthang11 - Ứng Dụng Rèn Luyện & Theo Dõi Chuyên Cần 10 Câu Giao Tiếp Tiếng Anh Tháng 11

Hệ thống ứng dụng công nghệ giáo dục dành riêng cho cán bộ, giáo viên **Trường Tiểu học Lê Kim Lăng** nhằm nâng cao năng lực giao tiếp tiếng Anh sư phạm trong lớp học và theo dõi việc học chuyên cần theo từng Tổ sinh hoạt chuyên môn.

---

## 🌟 Tính Năng Nổi Bật

### 1. Ghi Nhận Họ Tên Giáo Viên & Tổ Sinh Hoạt Chuyên Môn
- Điểm danh và đăng ký thông tin cá nhân hóa:
  - **Họ và tên Giáo viên**: Ghi nhận chính xác thầy cô tham gia.
  - **Tổ sinh hoạt chuyên môn**: Phân loại theo các tổ chuyên môn chuẩn của Trường Tiểu học:
    - *Tổ Chuyên Môn 1*
    - *Tổ Chuyên Môn 2*
    - *Tổ Chuyên Môn 3*
    - *Tổ Chuyên Môn 4*
    - *Tổ Chuyên Môn 5*
    - *Tổ Bộ Môn (Anh - Tin - Nhạc - Họa - Thể dục)*
    - *Tổ Văn Phòng & Ban Giám Hiệu*
  - Khối lớp và môn giảng dạy / Vị trí công tác.
  - Cho phép chuyển đổi nhanh giữa các giáo viên hoặc cập nhật hồ sơ với 1 cú nhấp chuột.

### 2. Sổ Theo Dõi Chuyên Cần Giáo Viên (Attendance Tracker)
- **Bảng Thống Kê Tổng Quan Cấp Trường**:
  - Số lượng giáo viên đã tham gia trên toàn trường.
  - Tổng số lượt rèn luyện & điểm danh chuyên cần.
  - Tỷ lệ giáo viên chuyên cần tích cực (học từ 3 buổi trở lên).
  - Tỷ lệ hoàn thành 10 câu khẩu hiệu tiếng Anh giao tiếp Tháng 11.
- **Tiến Độ Theo Từng Tổ Chuyên Môn**:
  - Thống kê tỷ lệ chuyên cần, số câu đã học trung bình, điểm thi đua của từng Tổ 1, 2, 3, 4, 5, Tổ Bộ môn.
  - Lọc danh sách giáo viên theo từng tổ chỉ với 1 thao tác.
- **Bảng Danh Sách & Lịch Sử Chuyên Cần Chi Tiết**:
  - Số ngày học chuyên cần, tổng số buổi rèn luyện.
  - Các mốc ngày cụ thể đã tham gia học tập.
  - Điểm rèn luyện phát âm cao nhất và điểm thi đua tích lũy.
  - Đánh giá chuyên cần: *Chuyên cần xuất sắc*, *Chuyên cần tốt*, *Cần nhắc nhở rèn luyện*.
- **Xuất Báo Cáo Chuyên Cần Ra File Excel (CSV)**:
  - Tự động xuất file CSV định dạng tiếng Việt UTF-8 chuẩn xác, phục vụ báo cáo Ban Giám Hiệu và Tổ chuyên môn.

### 3. Bộ 10 Câu Giao Tiếp Sư Phạm Tiếng Anh Tháng 11
1. **Be kind to everyone!** - Hãy tử tế với mọi người!
2. **Listen carefully** - Lắng nghe cẩn thận nào
3. **Help each other** - Hãy giúp đỡ lẫn nhau
4. **Never give up** - Đừng bao giờ bỏ cuộc
5. **Do your best** - Hãy cố gắng hết sức mình
6. **Speak English, please** - Làm ơn nói tiếng Anh nào
7. **Keep your classroom clean** - Giữ gìn lớp học sạch đẹp
8. **Line up quietly** - Xếp hàng ngay ngắn, trật tự
9. **Raise your hands to speak** - Giơ tay phát biểu nhé
10. **Work together happily** - Hợp tác vui vẻ cùng nhau!

---

## 🚀 Hướng Dẫn Cài Đặt & Sử Dụng

### Yêu Cầu Tiên Quyết
- Đã cài đặt [Node.js](https://nodejs.org/) (phiên bản 18 trở lên).

### Các Bước Thực Hiện
1. Cài đặt các gói phụ thuộc:
   ```bash
   npm install
   ```

2. Cấu hình biến môi trường:
   - Tạo file `.env` (hoặc sao chép từ `.env.example`).
   - Điền khóa API Gemini:
     ```env
     GEMINI_API_KEY=your_gemini_api_key_here
     ```

3. Khởi chạy ứng dụng:
   ```bash
   npm run dev
   ```
   Ứng dụng sẽ hoạt động tại địa chỉ: `http://localhost:3000`.

---
*Bản quyền phát triển phục vụ công tác bồi dưỡng giáo viên năm học 2026-2027 • Trường Tiểu học Lê Kim Lăng.*
