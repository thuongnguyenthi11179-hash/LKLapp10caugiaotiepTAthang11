import React, { useState, useEffect } from 'react';
import { TeacherProfile } from '../types';
import { DEPARTMENTS, getAllTeachers } from '../utils/storage';
import { School, User, Mail, Sparkles, Check, Users, PlusCircle } from 'lucide-react';

interface LoginModalProps {
  currentProfile: TeacherProfile | null;
  isOpen: boolean;
  onSave: (fullName: string, department: string, email: string, gradeLevel: string, subject: string) => void;
  onSelectExisting?: (teacher: TeacherProfile) => void;
  onClose?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  currentProfile,
  isOpen,
  onSave,
  onSelectExisting,
  onClose
}) => {
  const [tabMode, setTabMode] = useState<'form' | 'existing'>('form');
  const [fullName, setFullName] = useState(currentProfile?.fullName || 'Cô Nguyễn Thị Thương');
  const [department, setDepartment] = useState(currentProfile?.department || 'Tổ Chuyên Môn 2');
  const [email, setEmail] = useState(currentProfile?.email || 'thuongnguyenthi11179@gmail.com');
  const [gradeLevel, setGradeLevel] = useState(currentProfile?.gradeLevel || 'Khối 2');
  const [subject, setSubject] = useState(currentProfile?.subject || 'Giáo viên Chủ nhiệm');
  const [existingTeachers, setExistingTeachers] = useState<TeacherProfile[]>([]);

  useEffect(() => {
    if (isOpen) {
      setExistingTeachers(getAllTeachers());
      if (currentProfile) {
        setFullName(currentProfile.fullName);
        setDepartment(currentProfile.department || 'Tổ Chuyên Môn 2');
        setEmail(currentProfile.email || '');
        setGradeLevel(currentProfile.gradeLevel || 'Khối 2');
        setSubject(currentProfile.subject || 'Giáo viên Chủ nhiệm');
      }
    }
  }, [isOpen, currentProfile]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;
    onSave(
      fullName.trim() || 'Thầy/Cô Lê Kim Lăng',
      department || 'Tổ Chuyên Môn 2',
      email.trim(),
      gradeLevel,
      subject
    );
  };

  const gradeOptions = ['Khối 1', 'Khối 2', 'Khối 3', 'Khối 4', 'Khối 5', 'Toàn trường'];
  const subjectOptions = [
    'Giáo viên Chủ nhiệm',
    'Tiếng Việt / Toán',
    'Tiếng Anh',
    'Mỹ thuật',
    'Âm nhạc',
    'Giáo dục Thể chất',
    'Tin học & Công nghệ',
    'Tổng phụ trách Đội',
    'Ban Giám Hiệu'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100">
        {/* Header visual */}
        <div className="bg-gradient-to-br from-emerald-800 to-teal-700 text-white p-6 sm:p-7 relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/25 flex items-center justify-center shadow-inner shrink-0">
              <School className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-200 text-xs font-semibold mb-1">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>LKL10caugiaotiepTAthang11 • Trường TH Lê Kim Lăng</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Đăng Nhập & Ghi Nhận Hồ Sơ
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100 mt-1">
                Ghi rõ Họ tên giáo viên và Tổ sinh hoạt chuyên môn để theo dõi việc học chuyên cần.
              </p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          {existingTeachers.length > 0 && (
            <div className="mt-4 flex rounded-xl bg-black/20 p-1">
              <button
                type="button"
                onClick={() => setTabMode('form')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  tabMode === 'form' ? 'bg-white text-emerald-800 shadow-sm' : 'text-emerald-100 hover:text-white'
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Ghi danh / Nhập mới</span>
              </button>
              <button
                type="button"
                onClick={() => setTabMode('existing')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  tabMode === 'existing' ? 'bg-white text-emerald-800 shadow-sm' : 'text-emerald-100 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Chọn từ danh sách GV ({existingTeachers.length})</span>
              </button>
            </div>
          )}
        </div>

        {/* Existing Teachers quick-pick */}
        {tabMode === 'existing' ? (
          <div className="p-6 max-h-[380px] overflow-y-auto space-y-2">
            <p className="text-xs text-slate-500 mb-2">
              Chọn giáo viên để đăng nhập và tiếp tục theo dõi tiến độ chuyên cần:
            </p>
            {existingTeachers.map(teacher => (
              <div
                key={teacher.id}
                onClick={() => {
                  if (onSelectExisting) {
                    onSelectExisting(teacher);
                  } else {
                    onSave(teacher.fullName, teacher.department, teacher.email || '', teacher.gradeLevel, teacher.subject);
                  }
                }}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  currentProfile?.id === teacher.id
                    ? 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500'
                    : 'bg-slate-50 border-slate-200 hover:border-emerald-400 hover:bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {teacher.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 text-sm">{teacher.fullName}</div>
                    <div className="text-xs text-slate-500">
                      <span className="font-medium text-emerald-700">{teacher.department}</span> • {teacher.gradeLevel}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-amber-600 block">{teacher.points} đ</span>
                  <span className="text-[10px] text-slate-400">{teacher.practiceDates?.length || 1} ngày học</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Form Body */
          <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-3.5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Họ và tên Giáo viên <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ví dụ: Cô Nguyễn Thị Thương, Thầy Lê Văn Hải"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all text-slate-800 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Tổ Sinh Hoạt Chuyên Môn <span className="text-rose-500">*</span>
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white text-slate-800 font-semibold"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Khối lớp giảng dạy
                </label>
                <select
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white text-slate-800 font-medium"
                >
                  {gradeOptions.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Bộ môn / Vị trí
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white text-slate-800 font-medium"
                >
                  {subjectOptions.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Địa chỉ Gmail định danh <span className="text-slate-400 text-[11px] font-normal">(Tùy chọn)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ví dụ: thuongnguyenthi11179@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all text-slate-800"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                * Không yêu cầu mật khẩu. Hệ thống tự động ghi nhận chuyên cần theo ngày.
              </p>
            </div>

            {/* Action buttons */}
            <div className="pt-3 flex items-center justify-end gap-3">
              {onClose && currentProfile && (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Đóng
                </button>
              )}
              <button
                type="submit"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm shadow-md shadow-emerald-900/10 transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                <Check className="w-4 h-4" />
                <span>Vào Dashboard Học Tập</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
