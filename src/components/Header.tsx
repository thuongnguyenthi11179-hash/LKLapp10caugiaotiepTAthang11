import React from 'react';
import { TeacherProfile } from '../types';
import { 
  Sparkles, 
  Award, 
  UserCheck, 
  BookOpen, 
  Mic, 
  CheckCircle2, 
  Wand2, 
  MessageSquare,
  School,
  CalendarCheck,
  Gamepad2,
  Tv,
  FileDown
} from 'lucide-react';

interface HeaderProps {
  profile: TeacherProfile;
  currentTab: string;
  onTabChange: (tab: string) => void;
  onOpenSwitchUser: () => void;
  onOpenTvMode: () => void;
  onOpenDocumentModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  currentTab,
  onTabChange,
  onOpenSwitchUser,
  onOpenTvMode,
  onOpenDocumentModal
}) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard Cá Nhân', icon: Sparkles },
    { id: 'attendance', label: 'Theo Dõi Chuyên Cần', icon: CalendarCheck },
    { id: 'games', label: 'Đấu Trường Minigames', icon: Gamepad2, badge: 'HOT' },
    { id: 'phrases', label: '10 Câu Khẩu Hiệu', icon: BookOpen },
    { id: 'speaking', label: 'Luyện Nghe & Nói', icon: Mic },
    { id: 'quiz', label: 'Trắc Nghiệm', icon: CheckCircle2 },
    { id: 'scenario', label: 'AI Kịch Bản', icon: Wand2 },
    { id: 'chat', label: 'Hỏi Đáp Mentor AI', icon: MessageSquare }
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Top Banner / School & App Branding */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-700 to-emerald-900 text-white py-2.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center border border-white/20 shadow-inner shrink-0">
              <School className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-extrabold tracking-tight text-sm sm:text-base text-white">
                  LKL10caugiaotiepTAthang11
                </span>
                <span className="text-[10px] font-bold uppercase bg-amber-400 text-slate-900 px-2 py-0.5 rounded-full shadow-xs">
                  Tiểu Học Lê Kim Lăng
                </span>
              </div>
              <p className="text-xs text-emerald-100 hidden sm:block">
                Hệ Thống Rèn Luyện & Theo Dõi Chuyên Cần 10 Câu Giao Tiếp Tiếng Anh Tháng 11
              </p>
            </div>
          </div>

          {/* Quick Classroom Tools & Profile Capsule */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* TV Classroom Presentation Mode Button */}
            <button
              onClick={onOpenTvMode}
              title="Bật Chế Độ Trình Chiếu Toàn Màn Hình Trên Smart TV Lớp Học"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-transform active:scale-95 shadow-sm"
            >
              <Tv className="w-4 h-4" />
              <span className="hidden sm:inline">Chiếu Smart TV</span>
            </button>

            {/* Document Export (Word & PPTX) Button */}
            <button
              onClick={onOpenDocumentModal}
              title="Tải Kế Hoạch Bài Dạy Word & Slide PowerPoint"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs border border-white/20 transition-all hover:scale-[1.02] active:scale-95"
            >
              <FileDown className="w-4 h-4 text-emerald-300" />
              <span className="hidden sm:inline">Tải Slide & Giáo Án</span>
            </button>

            {/* Profile capsule with Department */}
            <div 
              onClick={onOpenSwitchUser}
              title="Nhấn để đổi giáo viên hoặc cập nhật tổ chuyên môn"
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-all px-3 py-1.5 rounded-xl border border-white/15 text-xs cursor-pointer group"
            >
              <div className="w-6 h-6 rounded-full bg-amber-300 text-slate-900 flex items-center justify-center font-bold text-xs shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                {profile.fullName.charAt(0).toUpperCase()}
              </div>
              <div className="text-left hidden md:block">
                <p className="font-bold text-white leading-tight">
                  {profile.fullName}
                </p>
                <p className="text-[10px] text-amber-200 font-medium leading-tight">
                  {profile.department || 'Tổ Chuyên Môn 2'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-amber-400/20 text-amber-300 px-2.5 py-1.5 rounded-xl border border-amber-400/30 text-xs font-semibold">
              <Award className="w-4 h-4 text-amber-300" />
              <span>{profile.points} đ</span>
            </div>

            <button
              onClick={onOpenSwitchUser}
              title="Đổi giáo viên hoặc cập nhật hồ sơ"
              className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-white/15 transition-colors border border-white/10"
            >
              <UserCheck className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-emerald-800 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-amber-400 text-slate-950' : 'bg-rose-500 text-white animate-pulse'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
