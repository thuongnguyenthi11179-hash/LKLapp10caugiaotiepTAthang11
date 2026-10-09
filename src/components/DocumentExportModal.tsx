import React, { useState } from 'react';
import { TeacherProfile } from '../types';
import { downloadLessonPlanDocx, downloadPresentationPptx } from '../utils/docExports';
import { CLASSROOM_PHRASES } from '../data/phrases';
import { 
  FileText, 
  Presentation, 
  Printer, 
  Download, 
  X, 
  CheckCircle2, 
  Sparkles, 
  School,
  BookOpen,
  ArrowRight
} from 'lucide-react';

interface DocumentExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: TeacherProfile;
  onShowToast: (msg: string) => void;
}

export const DocumentExportModal: React.FC<DocumentExportModalProps> = ({
  isOpen,
  onClose,
  profile,
  onShowToast
}) => {
  const [isExportingDocx, setIsExportingDocx] = useState(false);
  const [isExportingPptx, setIsExportingPptx] = useState(false);

  if (!isOpen) return null;

  const handleExportDocx = async () => {
    try {
      setIsExportingDocx(true);
      await downloadLessonPlanDocx(profile.fullName, profile.department);
      onShowToast(`Đã tải về Kế hoạch bài dạy Word (.docx) chuẩn Công văn 2345!`);
    } catch (err) {
      console.error(err);
      onShowToast('Có lỗi xảy ra khi tạo file Word.');
    } finally {
      setIsExportingDocx(false);
    }
  };

  const handleExportPptx = async () => {
    try {
      setIsExportingPptx(true);
      await downloadPresentationPptx(profile.fullName, profile.department);
      onShowToast(`Đã tải về Bài giảng trình chiếu PowerPoint (.pptx) 10 câu!`);
    } catch (err) {
      console.error(err);
      onShowToast('Có lỗi xảy ra khi tạo file PowerPoint.');
    } finally {
      setIsExportingPptx(false);
    }
  };

  const handlePrintWorksheet = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      onShowToast('Vui lòng cho phép popup để in phiếu bài tập.');
      return;
    }

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Phiếu Bài Tập 10 Câu Khẩu Hiệu - Tiểu Học Lê Kim Lăng</title>
  <style>
    body { font-family: 'Times New Roman', serif; padding: 25px; line-height: 1.5; color: #1e293b; max-width: 800px; margin: 0 auto; }
    .header { text-align: center; border-bottom: 2px solid #064e3b; padding-bottom: 15px; margin-bottom: 20px; }
    .school { font-size: 14pt; font-weight: bold; text-transform: uppercase; color: #064e3b; }
    .title { font-size: 18pt; font-weight: bold; color: #0f172a; margin-top: 8px; }
    .subtitle { font-size: 12pt; font-style: italic; color: #475569; }
    .info-box { border: 1px dashed #cbd5e1; padding: 12px; margin-bottom: 20px; font-size: 12pt; }
    .section-title { font-size: 13pt; font-weight: bold; color: #064e3b; margin-top: 18px; margin-bottom: 8px; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 11pt; }
    th, td { border: 1px solid #cbd5e1; padding: 8px 10px; text-align: left; }
    th { background: #f8fafc; font-weight: bold; color: #0f172a; }
    .footer { text-align: right; margin-top: 30px; font-size: 11pt; font-style: italic; }
    @media print {
      body { padding: 0; }
      button { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="school">Trường Tiểu Học Lê Kim Lăng • Quận Cẩm Lệ</div>
    <div class="title">PHIẾU RÈN LUYỆN 10 CÂU GIAO TIẾP LỚP HỌC THÁNG 11</div>
    <div class="subtitle">(Classroom Language & Physical Reflexes - TPR)</div>
  </div>

  <div class="info-box">
    Họ và tên học sinh: ............................................................................ Lớp: ..............<br>
    Giáo viên hướng dẫn: ${profile.fullName} (${profile.department})
  </div>

  <div class="section-title">Phần 1: Bảng 10 Khẩu Hiệu Em Thuộc Lòng</div>
  <table>
    <thead>
      <tr>
        <th style="width: 8%; text-align: center;">STT</th>
        <th style="width: 32%;">Khẩu hiệu Tiếng Anh</th>
        <th style="width: 25%;">Phiên âm IPA</th>
        <th style="width: 35%;">Nghĩa Tiếng Việt & Động tác</th>
      </tr>
    </thead>
    <tbody>
      ${CLASSROOM_PHRASES.map(p => `
        <tr>
          <td style="text-align: center; font-weight: bold;">${p.id}</td>
          <td style="font-weight: bold; color: #064e3b;">${p.phrase}</td>
          <td style="font-family: monospace;">${p.ipa}</td>
          <td>${p.vietnamese} (${p.tprGestures})</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="section-title">Phần 2: Thử Thách Ghép Nối Câu Đúng</div>
  <p>1. <b>Be kind to everyone!</b> &nbsp;&nbsp;&rarr;&nbsp;&nbsp; (.......................................................................)</p>
  <p>2. <b>Keep your classroom clean</b> &nbsp;&nbsp;&rarr;&nbsp;&nbsp; (.......................................................................)</p>
  <p>3. <b>Never give up</b> &nbsp;&nbsp;&rarr;&nbsp;&nbsp; (.......................................................................)</p>
  <p>4. <b>Line up quietly</b> &nbsp;&nbsp;&rarr;&nbsp;&nbsp; (.......................................................................)</p>

  <div class="footer">
    Ngày thực hiện: ......./11/2026<br>
    Lời nhận xét của Thầy/Cô: ........................................................................................
  </div>

  <script>
    window.onload = function() { window.print(); }
  </script>
</body>
</html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-700 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1 text-xs font-semibold text-amber-300">
            <Sparkles className="w-4 h-4" />
            <span>Xuất Học Liệu Sư Phạm • Tiểu Học Lê Kim Lăng</span>
          </div>
          <h3 className="text-xl font-bold text-white">
            Bộ Tài Liệu & Slide Dạy Học 10 Câu Khẩu Hiệu
          </h3>
          <p className="text-xs text-emerald-100 mt-1">
            Tải về Kế hoạch bài dạy Word, Slide trình chiếu PowerPoint hoặc Phiếu bài tập in ấn cho học sinh.
          </p>
        </div>

        {/* Options */}
        <div className="p-6 space-y-4">
          {/* Card 1: PowerPoint Slides */}
          <div className="p-4 rounded-2xl border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all bg-slate-50 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <Presentation className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">
                  Slide Bài Giảng PowerPoint (.pptx)
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  12 slides thiết kế chuẩn 16:9, đầy đủ phiên âm IPA, cử chỉ TPR và câu hỏi củng cố lớp học.
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-200/60 text-amber-900">
                    Chiếu trên Smart TV / Bảng tương tác
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleExportPptx}
              disabled={isExportingPptx}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold text-xs shrink-0 flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExportingPptx ? 'Đang tạo...' : 'Tải .pptx'}</span>
            </button>
          </div>

          {/* Card 2: Word Lesson Plan */}
          <div className="p-4 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all bg-slate-50 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">
                  Kế Hoạch Bài Dạy Chuẩn Word (.docx)
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Đúng thể thức Công văn 2345/BGDĐT-GDTH cho giáo viên tiểu học. Gồm ma trận hoạt động và chữ ký phê duyệt.
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-200/60 text-blue-900">
                    Lưu hồ sơ Tổ CM & BGH
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleExportDocx}
              disabled={isExportingDocx}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs shrink-0 flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExportingDocx ? 'Đang tạo...' : 'Tải .docx'}</span>
            </button>
          </div>

          {/* Card 3: Printable Worksheet */}
          <div className="p-4 rounded-2xl border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all bg-slate-50 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <Printer className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">
                  In Phiếu Rèn Luyện Cho Học Sinh (A4)
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Khổ giấy A4 trình bày đẹp mắt, có phần ghi tên học sinh, bảng 10 khẩu hiệu và bài tập nối câu nhanh.
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-200/60 text-emerald-900">
                    Phát cho học sinh rèn luyện
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handlePrintWorksheet}
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shrink-0 flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In Ngay</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Hồ sơ tự động điền: <b className="text-slate-700">{profile.fullName}</b> ({profile.department})</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
