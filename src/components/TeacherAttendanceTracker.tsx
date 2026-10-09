import React, { useState } from 'react';
import { TeacherProfile } from '../types';
import { 
  DEPARTMENTS, 
  getAllTeachers, 
  saveProfile, 
  deleteTeacherProfile, 
  createOrLoginTeacher, 
  markTeacherAttendanceToday,
  exportAttendanceToCsv,
  getProfileAnalysis
} from '../utils/storage';
import { CLASSROOM_PHRASES } from '../data/phrases';
import { 
  Users, 
  CalendarCheck, 
  Award, 
  TrendingUp, 
  Search, 
  Filter, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ChevronRight, 
  Eye, 
  UserCheck, 
  Trash2, 
  Edit3, 
  AlertCircle,
  School,
  X,
  FileSpreadsheet,
  Printer,
  BarChart3,
  Bot,
  Copy,
  Check,
  Trophy,
  Flame
} from 'lucide-react';

interface TeacherAttendanceTrackerProps {
  currentProfile: TeacherProfile;
  onSwitchProfile: (profile: TeacherProfile) => void;
  onNavigateToTab: (tab: string) => void;
  onShowToast: (msg: string) => void;
}

export const TeacherAttendanceTracker: React.FC<TeacherAttendanceTrackerProps> = ({
  currentProfile,
  onSwitchProfile,
  onNavigateToTab,
  onShowToast
}) => {
  const [teachers, setTeachers] = useState<TeacherProfile[]>(() => getAllTeachers());
  const [selectedDepartment, setSelectedDepartment] = useState<string>('Tất cả');
  const [selectedDiligenceFilter, setSelectedDiligenceFilter] = useState<string>('Tất cả');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Modals
  const [selectedDetailTeacher, setSelectedDetailTeacher] = useState<TeacherProfile | null>(null);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingTeacherId, setEditingTeacherId] = useState<string | null>(null);
  const [isAiReportModalOpen, setIsAiReportModalOpen] = useState(false);
  const [copiedReport, setCopiedReport] = useState(false);

  // Form State for Add/Edit
  const [formFullName, setFormFullName] = useState('');
  const [formDepartment, setFormDepartment] = useState<string>('Tổ Chuyên Môn 2');
  const [formGradeLevel, setFormGradeLevel] = useState('Khối 2');
  const [formSubject, setFormSubject] = useState('Giáo viên Chủ nhiệm');
  const [formEmail, setFormEmail] = useState('');
  const [formNotes, setFormNotes] = useState('');

  const reloadTeachers = () => {
    setTeachers(getAllTeachers());
  };

  // Department statistics
  const departmentStats = DEPARTMENTS.map(dept => {
    const deptTeachers = teachers.filter(t => t.department === dept);
    const count = deptTeachers.length;
    const avgCompleted = count > 0 
      ? Math.round(deptTeachers.reduce((acc, t) => acc + t.completedPhraseIds.length, 0) / count) 
      : 0;
    const avgPoints = count > 0 
      ? Math.round(deptTeachers.reduce((acc, t) => acc + t.points, 0) / count) 
      : 0;
    const diligentTeachers = deptTeachers.filter(t => (t.practiceDates?.length || 0) >= 4).length;
    const diligentRate = count > 0 ? Math.round((diligentTeachers / count) * 100) : 0;

    return {
      department: dept,
      count,
      avgCompleted,
      avgPoints,
      diligentRate
    };
  });

  // Find leading department
  const leadingDept = [...departmentStats]
    .filter(d => d.count > 0)
    .sort((a, b) => (b.diligentRate * 100 + b.avgPoints) - (a.diligentRate * 100 + a.avgPoints))[0];

  // Overall statistics
  const totalTeachers = teachers.length;
  const totalSessions = teachers.reduce((acc, t) => acc + (t.sessionCount || 1), 0);
  const highlyDiligentCount = teachers.filter(t => (t.practiceDates?.length || 0) >= 5).length;
  const goodDiligentCount = teachers.filter(t => {
    const days = t.practiceDates?.length || 0;
    return days >= 3 && days < 5;
  }).length;
  const avgCompletionRate = totalTeachers > 0
    ? Math.round((teachers.reduce((acc, t) => acc + t.completedPhraseIds.length, 0) / (totalTeachers * 10)) * 100)
    : 0;

  // Build Heatmap for the 30 days of November
  const novemberDays = Array.from({ length: 30 }, (_, i) => {
    const dayNum = i + 1;
    const dayStr = dayNum < 10 ? `0${dayNum}` : `${dayNum}`;
    const dateKey = `2026-11-${dayStr}`;
    // Count how many teachers practiced on this date or matching day of month
    const count = teachers.filter(t => 
      t.practiceDates?.some(d => d.endsWith(`-${dayStr}`) || d.includes(dateKey))
    ).length;

    return {
      day: dayNum,
      dateKey,
      count,
      intensity: count >= 6 ? 'high' : count >= 3 ? 'med' : count > 0 ? 'low' : 'none'
    };
  });

  // Filtered teachers list
  const filteredTeachers = teachers.filter(t => {
    const matchesDept = selectedDepartment === 'Tất cả' || t.department === selectedDepartment;
    const matchesSearch = t.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.subject.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesDiligence = true;
    if (selectedDiligenceFilter === 'Xuất sắc') {
      matchesDiligence = (t.practiceDates?.length || 0) >= 6;
    } else if (selectedDiligenceFilter === 'Tốt') {
      const days = t.practiceDates?.length || 0;
      matchesDiligence = days >= 3 && days < 6;
    } else if (selectedDiligenceFilter === 'Cần nhắc nhở') {
      matchesDiligence = (t.practiceDates?.length || 0) < 3;
    }

    return matchesDept && matchesSearch && matchesDiligence;
  });

  const handleOpenAddModal = () => {
    setEditingTeacherId(null);
    setFormFullName('');
    setFormDepartment('Tổ Chuyên Môn 2');
    setFormGradeLevel('Khối 2');
    setFormSubject('Giáo viên Chủ nhiệm');
    setFormEmail('');
    setFormNotes('');
    setIsAddEditModalOpen(true);
  };

  const handleOpenEditModal = (t: TeacherProfile) => {
    setEditingTeacherId(t.id);
    setFormFullName(t.fullName);
    setFormDepartment(t.department || 'Tổ Chuyên Môn 2');
    setFormGradeLevel(t.gradeLevel || 'Khối 2');
    setFormSubject(t.subject || 'Giáo viên Chủ nhiệm');
    setFormEmail(t.email || '');
    setFormNotes(t.notes || '');
    setIsAddEditModalOpen(true);
  };

  const handleSaveTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFullName.trim()) return;

    if (editingTeacherId) {
      const existing = teachers.find(t => t.id === editingTeacherId);
      if (existing) {
        const updated: TeacherProfile = {
          ...existing,
          fullName: formFullName.trim(),
          department: formDepartment,
          gradeLevel: formGradeLevel,
          subject: formSubject,
          email: formEmail.trim(),
          notes: formNotes.trim()
        };
        saveProfile(updated);
        onShowToast(`Đã cập nhật thông tin giáo viên ${updated.fullName}!`);
      }
    } else {
      const created = createOrLoginTeacher(
        formFullName.trim(),
        formDepartment,
        formEmail.trim(),
        formGradeLevel,
        formSubject,
        formNotes.trim()
      );
      onShowToast(`Đã thêm mới giáo viên ${created.fullName} vào danh sách chuyên cần!`);
    }

    reloadTeachers();
    setIsAddEditModalOpen(false);
  };

  const handleDeleteTeacher = (id: string, name: string) => {
    if (confirm(`Thầy/cô có chắc muốn xóa giáo viên "${name}" khỏi danh sách theo dõi chuyên cần không?`)) {
      deleteTeacherProfile(id);
      reloadTeachers();
      onShowToast(`Đã xóa giáo viên ${name}.`);
    }
  };

  const handleQuickAttendance = (teacherId: string, name: string) => {
    const updated = markTeacherAttendanceToday(teacherId);
    if (updated) {
      reloadTeachers();
      onShowToast(`Đã ghi nhận điểm danh chuyên cần hôm nay cho ${name} (+10 điểm)!`);
    }
  };

  const handleSelectToLearn = (teacher: TeacherProfile) => {
    onSwitchProfile(teacher);
    onShowToast(`Đã kích hoạt phiên làm việc của giáo viên ${teacher.fullName}!`);
  };

  const getDepartmentColor = (dept: string) => {
    if (dept.includes('Tổ Chuyên Môn 1')) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (dept.includes('Tổ Chuyên Môn 2')) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (dept.includes('Tổ Chuyên Môn 3')) return 'bg-amber-100 text-amber-800 border-amber-200';
    if (dept.includes('Tổ Chuyên Môn 4')) return 'bg-purple-100 text-purple-800 border-purple-200';
    if (dept.includes('Tổ Chuyên Môn 5')) return 'bg-rose-100 text-rose-800 border-rose-200';
    if (dept.includes('Bộ Môn')) return 'bg-cyan-100 text-cyan-800 border-cyan-200';
    return 'bg-slate-100 text-slate-800 border-slate-200';
  };

  // Generate AI Comprehensive Report text
  const generateAiReportText = () => {
    const diligentList = teachers.filter(t => (t.practiceDates?.length || 0) >= 5).map(t => `${t.fullName} (${t.department} - ${t.points}đ)`).join(', ');
    const needReminderList = teachers.filter(t => (t.practiceDates?.length || 0) < 3).map(t => `${t.fullName} (${t.department})`).join(', ');

    return `UBND QUẬN CẨM LỆ - TP. ĐÀ NẴNG
TRƯỜNG TIỂU HỌC LÊ KIM LĂNG

BÁO CÁO TỔNG KẾT PHONG TRÀO RÈN LUYỆN CHUYÊN CẦN
10 CÂU GIAO TIẾP TIẾNG ANH LỚP HỌC THÁNG 11 (NĂM HỌC 2026-2027)

I. TÌNH HÌNH THAM GIA CHUNG:
- Tổng số giáo viên đăng ký tham gia: ${totalTeachers} thầy/cô giáo.
- Tổng số lượt rèn luyện & điểm danh ghi nhận: ${totalSessions} lượt.
- Tỷ lệ giáo viên duy trì rèn luyện chuyên cần tích cực (>= 3 ngày): ${Math.round(((highlyDiligentCount + goodDiligentCount) / totalTeachers) * 100)}%.
- Tỷ lệ thành thạo 10 câu khẩu hiệu trung bình toàn trường: ${avgCompletionRate}%.

II. KẾT QUẢ THI ĐUA THEO CÁC TỔ CHUYÊN MÔN:
${departmentStats.map((d, i) => `${i + 1}. ${d.department}:
   - Số lượng GV: ${d.count} người
   - Tỷ lệ chuyên cần: ${d.diligentRate}%
   - Điểm thi đua trung bình: ${d.avgPoints} điểm
   - Số câu thành thạo TB: ${d.avgCompleted}/10 câu`).join('\n\n')}

III. BIỂU DƯƠNG & KHEN THƯỞNG:
- Tổ chuyên môn xuất sắc dẫn đầu thi đua: ${leadingDept?.department || 'Tổ Chuyên Môn 2'} (Đạt ${leadingDept?.diligentRate}% chuyên cần).
- Danh sách giáo viên gương mẫu, rèn luyện chuyên cần xuất sắc:
  ${diligentList || 'Đang cập nhật'}

IV. TỒN TẠI & ĐỀ XUẤT CẦN ĐÔN ĐỐC THÊM:
${needReminderList ? `- Đề nghị các Tổ trưởng chuyên môn nhắc nhở, hỗ trợ thêm cho: ${needReminderList} để hoàn thành tiến độ trước ngày 30/11.` : '- 100% giáo viên đều duy trì tiến độ rèn luyện tốt.'}

V. PHƯƠNG HƯỚNG HOẠT ĐỘNG THÁNG 12:
1. Tiếp tục duy trì thói quen sử dụng 10 câu khẩu hiệu tiếng Anh trong 5 phút đầu và cuối mỗi tiết học.
2. Tích hợp các minigame tương tác trên Smart TV lớp học cho học sinh cùng tham gia.
3. Tổ chức hội thảo chia sẻ kinh nghiệm phản xạ TPR giữa các tổ khối.

                                 Đà Nẵng, ngày ..... tháng 11 năm 2026
                                 NGƯỜI LẬP BÁO CÁO / TỔ TRƯỞNG CHUYÊN MÔN
                                 (Ký và ghi rõ họ tên)`;
  };

  const handleCopyReport = () => {
    navigator.clipboard.writeText(generateAiReportText());
    setCopiedReport(true);
    onShowToast('Đã sao chép toàn bộ văn bản báo cáo chuyên môn!');
    setTimeout(() => setCopiedReport(false), 2500);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-br from-emerald-800 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-emerald-700/40">
        <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold mb-2 border border-amber-400/30">
                <CalendarCheck className="w-3.5 h-3.5" />
                <span>Trường Tiểu học Lê Kim Lăng • Tháng 11</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
                <span>Sổ Theo Dõi Chuyên Cần Giáo Viên</span>
              </h1>
              <p className="text-sm text-emerald-100 mt-1 max-w-2xl">
                Bảng tổng hợp quản lý việc ghi nhận Họ tên giáo viên và Tổ sinh hoạt chuyên môn, theo dõi tiến độ rèn luyện 10 câu khẩu hiệu tiếng Anh giao tiếp Tháng 11.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => setIsAiReportModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs sm:text-sm font-bold shadow-md shadow-amber-400/20 transition-all hover:scale-[1.02] active:scale-95"
                title="AI tự động phân tích và soạn thảo bản báo cáo gửi BGH"
              >
                <Bot className="w-4 h-4" />
                <span>AI Soạn Báo Cáo Chuyên Môn</span>
              </button>

              <button
                onClick={() => exportAttendanceToCsv(teachers)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs sm:text-sm font-semibold backdrop-blur-md border border-white/20 transition-all hover:scale-[1.02] active:scale-95 shadow-sm"
                title="Xuất file Excel để báo cáo BGH"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
                <span>Xuất File Excel</span>
              </button>

              <button
                onClick={handleOpenAddModal}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold transition-all hover:scale-[1.02] active:scale-95 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm Giáo Viên Mới</span>
              </button>
            </div>
          </div>

          {/* Core Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3.5 border border-white/10">
              <div className="flex items-center gap-2 text-xs text-emerald-200 mb-1">
                <Users className="w-4 h-4 text-amber-300" />
                <span>Tổng giáo viên</span>
              </div>
              <p className="text-2xl font-extrabold text-white">{totalTeachers} thầy/cô</p>
              <p className="text-[11px] text-emerald-200 mt-0.5">Đã đăng ký hồ sơ</p>
            </div>

            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3.5 border border-white/10">
              <div className="flex items-center gap-2 text-xs text-emerald-200 mb-1">
                <CalendarCheck className="w-4 h-4 text-emerald-300" />
                <span>Lượt rèn luyện</span>
              </div>
              <p className="text-2xl font-extrabold text-white">{totalSessions} lượt</p>
              <p className="text-[11px] text-emerald-200 mt-0.5">Học tập & điểm danh</p>
            </div>

            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3.5 border border-white/10">
              <div className="flex items-center gap-2 text-xs text-emerald-200 mb-1">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Chuyên cần tốt</span>
              </div>
              <p className="text-2xl font-extrabold text-amber-300">
                {highlyDiligentCount + goodDiligentCount} / {totalTeachers}
              </p>
              <p className="text-[11px] text-emerald-200 mt-0.5">Học từ 3 ngày trở lên</p>
            </div>

            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3.5 border border-white/10">
              <div className="flex items-center gap-2 text-xs text-emerald-200 mb-1">
                <Trophy className="w-4 h-4 text-amber-300" />
                <span>Tổ dẫn đầu thi đua</span>
              </div>
              <p className="text-base font-bold text-white truncate mt-1">
                {leadingDept?.department || 'Tổ Chuyên Môn 2'}
              </p>
              <p className="text-[11px] text-amber-300 mt-0.5">
                Chuyên cần: {leadingDept?.diligentRate || 100}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. HEATMAP LỊCH CHUYÊN CẦN THÁNG 11 & BIỂU ĐỒ SO SÁNH CÁC TỔ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Heatmap Card (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-500" />
                <span>Lịch Chuyên Cần Tháng 11 (Heatmap 30 Ngày)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Màu xanh càng đậm biểu thị số lượng giáo viên vào rèn luyện và điểm danh càng cao trong ngày.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <span>Ít</span>
              <span className="w-3 h-3 rounded bg-slate-100 border border-slate-200" />
              <span className="w-3 h-3 rounded bg-emerald-200" />
              <span className="w-3 h-3 rounded bg-emerald-400" />
              <span className="w-3 h-3 rounded bg-emerald-700" />
              <span>Nhiều</span>
            </div>
          </div>

          {/* 30 Days Grid */}
          <div className="grid grid-cols-6 sm:grid-cols-10 gap-2 pt-2">
            {novemberDays.map(d => {
              let bgStyle = 'bg-slate-100 text-slate-500 hover:border-slate-400';
              if (d.intensity === 'high') bgStyle = 'bg-emerald-700 text-white font-bold shadow-xs';
              else if (d.intensity === 'med') bgStyle = 'bg-emerald-500 text-white font-bold';
              else if (d.intensity === 'low') bgStyle = 'bg-emerald-200 text-emerald-950 font-semibold';

              return (
                <div
                  key={d.day}
                  className={`p-2.5 rounded-xl border border-transparent transition-all flex flex-col items-center justify-center text-center group cursor-pointer ${bgStyle}`}
                  title={`Ngày ${d.day}/11/2026: ${d.count} giáo viên đã rèn luyện`}
                >
                  <span className="text-xs">{d.day}</span>
                  <span className="text-[10px] opacity-80 mt-0.5">
                    {d.count > 0 ? `${d.count} GV` : '-'}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Cao điểm: Các ngày thứ 2 và thứ 6 hàng tuần sinh hoạt chuyên môn.</span>
            <span className="font-semibold text-emerald-700">Tất cả 10 câu khẩu hiệu đều được luyện tập đều đặn.</span>
          </div>
        </div>

        {/* Radar / 4 Pedagogical Dimensions Card (1 Col) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-700" />
              <span>Đánh Giá Năng Lực 4 Trục</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Phổ năng lực sư phạm trung bình toàn trường:
            </p>

            <div className="space-y-3 pt-4">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>1. Phát âm chuẩn IPA (Pronunciation)</span>
                  <span className="text-emerald-700">88%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: '88%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>2. Ngữ điệu & Nhịp điệu (Intonation)</span>
                  <span className="text-emerald-700">82%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-500 rounded-full" style={{ width: '82%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>3. Cử chỉ phản xạ TPR (Body Language)</span>
                  <span className="text-amber-700 font-bold">94%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '94%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>4. Mức độ chuyên cần (Attendance)</span>
                  <span className="text-blue-700 font-bold">85%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: '85%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-emerald-50 rounded-2xl border border-emerald-100 text-xs text-emerald-900">
            <p className="font-semibold">Nhận xét tổng quát:</p>
            <p className="text-[11px] text-emerald-800 mt-0.5">
              Giáo viên áp dụng cử chỉ TPR rất tự nhiên và nhiệt tình. Cần đẩy mạnh thêm phần âm đuôi trong các câu dài.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Department Breakdown Cards */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
              <School className="w-5 h-5 text-emerald-700" />
              <span>Tiến Độ Chuyên Cần Theo Tổ Sinh Hoạt Chuyên Môn</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Nhấn vào từng tổ để lọc nhanh danh sách giáo viên của tổ đó.
            </p>
          </div>
          {selectedDepartment !== 'Tất cả' && (
            <button
              onClick={() => setSelectedDepartment('Tất cả')}
              className="text-xs font-semibold text-emerald-700 hover:underline"
            >
              Xem tất cả các tổ
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {departmentStats.map((item) => {
            const isSelected = selectedDepartment === item.department;
            return (
              <div
                key={item.department}
                onClick={() => setSelectedDepartment(isSelected ? 'Tất cả' : item.department)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-emerald-50/80 border-emerald-500 shadow-sm ring-2 ring-emerald-500/20'
                    : 'bg-slate-50/70 border-slate-200 hover:border-slate-300 hover:bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-bold text-xs sm:text-sm text-slate-800 truncate">
                      {item.department}
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600">
                      {item.count} GV
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Tỷ lệ chuyên cần:</span>
                      <span className="font-semibold text-emerald-700">{item.diligentRate}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Đã học TB:</span>
                      <span className="font-semibold text-slate-800">{item.avgCompleted}/10 câu</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Điểm thi đua TB:</span>
                      <span className="font-semibold text-amber-700">{item.avgPoints} đ</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-semibold text-emerald-700">
                  <span>{isSelected ? 'Đang lọc tổ này' : 'Bấm để lọc tổ này'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Filter Bar & Search */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
          {/* Search box */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo họ tên giáo viên, môn học..."
              className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all text-slate-800"
            />
          </div>

          {/* Department Filter Dropdown */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
            >
              <option value="Tất cả">Tất cả các Tổ</option>
              {DEPARTMENTS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Diligence Filter */}
          <select
            value={selectedDiligenceFilter}
            onChange={(e) => setSelectedDiligenceFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
          >
            <option value="Tất cả">Mọi mức chuyên cần</option>
            <option value="Xuất sắc">Chuyên cần xuất sắc (≥ 6 ngày)</option>
            <option value="Tốt">Chuyên cần tốt (3 - 5 ngày)</option>
            <option value="Cần nhắc nhở">Cần nhắc nhở (&lt; 3 ngày)</option>
          </select>
        </div>

        <div className="text-xs font-semibold text-slate-500">
          Hiển thị: <span className="text-emerald-700 font-bold">{filteredTeachers.length}</span> / {totalTeachers} giáo viên
        </div>
      </div>

      {/* 5. Main Attendance Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4 text-center w-12">STT</th>
                <th className="py-3.5 px-4">Giáo viên</th>
                <th className="py-3.5 px-4">Tổ sinh hoạt chuyên môn</th>
                <th className="py-3.5 px-4 text-center">Số ngày chuyên cần</th>
                <th className="py-3.5 px-4">Tiến độ 10 câu</th>
                <th className="py-3.5 px-4 text-center">Điểm thi đua</th>
                <th className="py-3.5 px-4">Đánh giá chuyên cần</th>
                <th className="py-3.5 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {filteredTeachers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <Users className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-600">Không tìm thấy giáo viên nào</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Hãy thử đổi bộ lọc hoặc thêm giáo viên mới vào hệ thống.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredTeachers.map((teacher, index) => {
                  const isCurrentActive = teacher.id === currentProfile.id;
                  const analysis = getProfileAnalysis(teacher);
                  const attendanceDays = teacher.practiceDates?.length || 1;
                  const maxSpeaking = Object.values(teacher.speakingScores).length > 0
                    ? Math.max(...Object.values(teacher.speakingScores))
                    : 0;

                  return (
                    <tr 
                      key={teacher.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isCurrentActive ? 'bg-emerald-50/50 font-medium' : ''
                      }`}
                    >
                      {/* STT */}
                      <td className="py-3.5 px-4 text-center text-slate-400 font-mono text-xs">
                        {index + 1}
                      </td>

                      {/* Teacher name & subject */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                            {teacher.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-800 text-sm">
                                {teacher.fullName}
                              </span>
                              {isCurrentActive && (
                                <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">
                                  Đang học
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500">
                              {teacher.gradeLevel} • {teacher.subject}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Department */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-semibold border ${getDepartmentColor(teacher.department)}`}>
                          {teacher.department}
                        </span>
                      </td>

                      {/* Attendance days */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span className="font-bold text-slate-800 text-sm">
                            {attendanceDays} ngày
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {teacher.sessionCount || 1} buổi học
                          </span>
                        </div>
                      </td>

                      {/* Phrase progress */}
                      <td className="py-3.5 px-4 min-w-[140px]">
                        <div>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="font-bold text-slate-700">
                              {teacher.completedPhraseIds.length}/10 câu
                            </span>
                            <span className="text-slate-400 text-[11px]">
                              {analysis.progressPercentage}%
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all duration-500"
                              style={{ width: `${analysis.progressPercentage}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Points & Max Speaking */}
                      <td className="py-3.5 px-4 text-center">
                        <div>
                          <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-xs">
                            {teacher.points} đ
                          </span>
                          {maxSpeaking > 0 && (
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              Nói: {maxSpeaking}/100
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Diligence Rating */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          attendanceDays >= 6 
                            ? 'bg-emerald-100 text-emerald-800'
                            : attendanceDays >= 3
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            attendanceDays >= 6 ? 'bg-emerald-600' : attendanceDays >= 3 ? 'bg-blue-600' : 'bg-amber-600'
                          }`} />
                          <span>{analysis.diligenceRating}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* Quick attendance button */}
                          <button
                            type="button"
                            onClick={() => handleQuickAttendance(teacher.id, teacher.fullName)}
                            title="Điểm danh chuyên cần hôm nay (+10 điểm)"
                            className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 transition-colors"
                          >
                            <CalendarCheck className="w-4 h-4" />
                          </button>

                          {/* Switch to this teacher */}
                          <button
                            type="button"
                            onClick={() => handleSelectToLearn(teacher)}
                            title="Chuyển sang tài khoản giáo viên này để học tập"
                            className="p-1.5 rounded-lg text-teal-700 hover:bg-teal-50 transition-colors"
                          >
                            <UserCheck className="w-4 h-4" />
                          </button>

                          {/* View details */}
                          <button
                            type="button"
                            onClick={() => setSelectedDetailTeacher(teacher)}
                            title="Xem chi tiết lịch sử học tập & chuyên cần"
                            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Edit info */}
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(teacher)}
                            title="Chỉnh sửa họ tên & tổ chuyên môn"
                            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => handleDeleteTeacher(teacher.id, teacher.fullName)}
                            title="Xóa khỏi danh sách"
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Modal: AI Comprehensive Report */}
      {isAiReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-100 flex flex-col">
            <div className="bg-gradient-to-r from-emerald-800 to-teal-700 text-white p-6 relative">
              <button
                onClick={() => setIsAiReportModalOpen(false)}
                className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 mb-1 text-xs font-semibold text-amber-300">
                <Bot className="w-4 h-4" />
                <span>Trợ Lý Sư Phạm AI • Tiểu Học Lê Kim Lăng</span>
              </div>
              <h3 className="text-xl font-bold text-white">
                Bản Báo Cáo Chuyên Môn Đánh Giá Tháng 11
              </h3>
              <p className="text-xs text-emerald-100 mt-1">
                Tự động tổng hợp dữ liệu chuyên cần, biểu dương tổ khối dẫn đầu và kiến nghị giải pháp cho BGH.
              </p>
            </div>

            <div className="p-6 overflow-y-auto flex-1 font-mono text-xs sm:text-sm bg-slate-50 text-slate-800 whitespace-pre-wrap leading-relaxed border-b border-slate-200 select-text">
              {generateAiReportText()}
            </div>

            <div className="p-4 bg-white flex items-center justify-between gap-3">
              <span className="text-xs text-slate-500">
                Có thể dán trực tiếp vào văn bản Word hoặc in lưu hồ sơ chuyên môn.
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyReport}
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
                >
                  {copiedReport ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedReport ? 'Đã Sao Chép!' : 'Sao Chép Báo Cáo'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsAiReportModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. Modal: Add / Edit Teacher */}
      {isAddEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100">
            <div className="bg-gradient-to-r from-emerald-800 to-teal-700 text-white p-6 relative">
              <button
                onClick={() => setIsAddEditModalOpen(false)}
                className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <School className="w-5 h-5 text-amber-300" />
                <span>{editingTeacherId ? 'Chỉnh Sửa Hồ Sơ Giáo Viên' : 'Ghi Nhận Giáo Viên Mới'}</span>
              </h3>
              <p className="text-xs text-emerald-100 mt-1">
                Ghi nhận Họ tên giáo viên và Tổ sinh hoạt chuyên môn phục vụ theo dõi chuyên cần.
              </p>
            </div>

            <form onSubmit={handleSaveTeacher} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Họ và tên Giáo viên <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formFullName}
                  onChange={(e) => setFormFullName(e.target.value)}
                  placeholder="Ví dụ: Cô Nguyễn Thị Thương, Thầy Lê Văn Hải"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Tổ Sinh Hoạt Chuyên Môn <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formDepartment}
                  onChange={(e) => setFormDepartment(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white font-medium text-slate-800"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Khối lớp
                  </label>
                  <select
                    value={formGradeLevel}
                    onChange={(e) => setFormGradeLevel(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white text-slate-800 font-medium"
                  >
                    <option value="Khối 1">Khối 1</option>
                    <option value="Khối 2">Khối 2</option>
                    <option value="Khối 3">Khối 3</option>
                    <option value="Khối 4">Khối 4</option>
                    <option value="Khối 5">Khối 5</option>
                    <option value="Toàn trường">Toàn trường</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Bộ môn / Vị trí
                  </label>
                  <input
                    type="text"
                    value={formSubject}
                    onChange={(e) => setFormSubject(e.target.value)}
                    placeholder="Chủ nhiệm, Tiếng Anh..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white text-slate-800 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Email định danh <span className="text-[11px] text-slate-400 font-normal">(Tùy chọn)</span>
                </label>
                <input
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="thuongnguyenthi11179@gmail.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Ghi chú chuyên cần
                </label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Ghi chú về mức độ rèn luyện, nhiệm vụ trong tổ chuyên môn..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white text-slate-800 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddEditModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm shadow-md transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                  {editingTeacherId ? 'Lưu Thay Đổi' : 'Xác Nhận & Lưu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. Modal: Detailed Teacher Attendance History */}
      {selectedDetailTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100">
            <div className="bg-gradient-to-r from-emerald-800 to-teal-700 text-white p-6 relative">
              <button
                onClick={() => setSelectedDetailTeacher(null)}
                className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/25 flex items-center justify-center text-white font-extrabold text-lg">
                  {selectedDetailTeacher.fullName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {selectedDetailTeacher.fullName}
                  </h3>
                  <p className="text-xs text-emerald-100 mt-0.5">
                    {selectedDetailTeacher.department} • {selectedDetailTeacher.gradeLevel} ({selectedDetailTeacher.subject})
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Summary stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                  <p className="text-xs text-slate-500">Số ngày học</p>
                  <p className="text-xl font-extrabold text-emerald-700 mt-0.5">
                    {selectedDetailTeacher.practiceDates?.length || 1} ngày
                  </p>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                  <p className="text-xs text-slate-500">Hoàn thành 10 câu</p>
                  <p className="text-xl font-extrabold text-slate-800 mt-0.5">
                    {selectedDetailTeacher.completedPhraseIds.length}/10 câu
                  </p>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                  <p className="text-xs text-slate-500">Điểm thi đua</p>
                  <p className="text-xl font-extrabold text-amber-600 mt-0.5">
                    {selectedDetailTeacher.points} đ
                  </p>
                </div>
              </div>

              {/* Practice Dates list */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 flex items-center gap-2">
                  <CalendarCheck className="w-4 h-4 text-emerald-700" />
                  <span>Các ngày đã tham gia rèn luyện chuyên cần</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedDetailTeacher.practiceDates && selectedDetailTeacher.practiceDates.length > 0 ? (
                    selectedDetailTeacher.practiceDates.map(d => (
                      <span key={d} className="px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold text-xs">
                        ✓ {d}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400">Chưa ghi nhận ngày rèn luyện</span>
                  )}
                </div>
              </div>

              {/* Progress on each of the 10 phrases */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-700" />
                  <span>Chi tiết điểm luyện tập 10 câu khẩu hiệu</span>
                </h4>
                <div className="space-y-2">
                  {CLASSROOM_PHRASES.map(p => {
                    const isDone = selectedDetailTeacher.completedPhraseIds.includes(p.id);
                    const speakScore = selectedDetailTeacher.speakingScores[p.id];
                    const hasListened = selectedDetailTeacher.listeningCompleted[p.id];
                    return (
                      <div key={p.id} className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5">
                          <span className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-[10px] ${
                            isDone ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                          }`}>
                            {p.id}
                          </span>
                          <div>
                            <p className="font-bold text-slate-800">{p.phrase}</p>
                            <p className="text-[11px] text-slate-500">{p.vietnamese}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {hasListened && (
                            <span className="text-[10px] text-emerald-700 font-medium">✓ Đã nghe</span>
                          )}
                          {speakScore !== undefined ? (
                            <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold text-[11px]">
                              Nói: {speakScore}/100
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400">Chưa luyện nói</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Teacher note */}
              {selectedDetailTeacher.notes && (
                <div className="p-3.5 bg-amber-50/80 rounded-2xl border border-amber-200 text-xs text-amber-900">
                  <span className="font-bold">Ghi chú chuyên môn: </span>
                  {selectedDetailTeacher.notes}
                </div>
              )}

              {/* Action */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedDetailTeacher(null)}
                  className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleSelectToLearn(selectedDetailTeacher);
                    setSelectedDetailTeacher(null);
                  }}
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs sm:text-sm shadow-md transition-transform active:scale-95"
                >
                  Đăng Nhập Học Tiếp Bằng Hồ Sơ Này
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
