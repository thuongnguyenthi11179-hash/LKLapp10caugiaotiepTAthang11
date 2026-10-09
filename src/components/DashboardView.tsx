import React from 'react';
import { TeacherProfile } from '../types';
import { CLASSROOM_PHRASES, BADGE_DEFINITIONS } from '../data/phrases';
import { getProfileAnalysis } from '../utils/storage';
import { SpeechService } from '../utils/speech';
import { 
  Sparkles, 
  CheckCircle, 
  Volume2, 
  Mic, 
  TrendingUp, 
  ArrowRight, 
  Award, 
  BookOpen, 
  CalendarCheck,
  Building2,
  Users,
  Gamepad2,
  Tv,
  FileDown,
  Wand2,
  MessageSquare
} from 'lucide-react';

interface DashboardViewProps {
  profile: TeacherProfile;
  onSelectPhrase: (phraseId: number) => void;
  onNavigateToTab: (tab: string) => void;
  onOpenTvMode?: () => void;
  onOpenDocumentModal?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  onSelectPhrase,
  onNavigateToTab,
  onOpenTvMode,
  onOpenDocumentModal
}) => {
  const analysis = getProfileAnalysis(profile);
  const suggestedPhraseObj = CLASSROOM_PHRASES.find(p => p.phrase === analysis.suggestedPhrase) || CLASSROOM_PHRASES[0];

  const handleQuickPlay = (e: React.MouseEvent, phrase: string) => {
    e.stopPropagation();
    SpeechService.speak(phrase, 0.9);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* 1. REQUIRED OFFICIAL DASHBOARD VIEW BLOCK */}
      <div className="bg-gradient-to-br from-emerald-800 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-emerald-700/40">
        <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-8 bottom-4 text-emerald-600/15 text-8xl font-black select-none pointer-events-none">
          LKL10-T11
        </div>

        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold mb-2 border border-amber-400/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>LKL10caugiaotiepTAthang11 • Trường Tiểu học Lê Kim Lăng</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2 flex-wrap">
                <span>Xin chào {profile.fullName}!</span>
              </h1>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-600/60 border border-emerald-400/30 text-amber-200 text-xs font-semibold">
                  {profile.department || 'Tổ Chuyên Môn 2'}
                </span>
                <span className="text-xs text-emerald-100">
                  {profile.gradeLevel} • {profile.subject}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-100/90 mt-2">
                Hệ thống rèn luyện phát âm & theo dõi chuyên cần 10 câu khẩu hiệu tiếng Anh giao tiếp Tháng 11.
              </p>
            </div>

            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/15">
              <div className="text-right">
                <p className="text-[11px] text-emerald-200 uppercase font-semibold">Điểm Thi Đua</p>
                <p className="text-xl font-bold text-amber-300">{profile.points} điểm</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center">
                <Award className="w-5 h-5 text-amber-300" />
              </div>
            </div>
          </div>

          {/* Core Metrices */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {/* Metric 1: Progress */}
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-4 border border-white/10 hover:bg-white/15 transition-colors">
              <div className="flex items-center justify-between text-xs text-emerald-200 mb-1 font-medium">
                <span>Trạng thái tiến độ</span>
                <span className="font-bold text-amber-300">{analysis.progressPercentage}%</span>
              </div>
              <p className="text-lg font-bold text-white flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Hoàn thành {analysis.completedCount}/10 câu</span>
              </p>
              {/* Progress bar */}
              <div className="w-full h-2 bg-black/25 rounded-full mt-3 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-400 to-amber-300 rounded-full transition-all duration-700"
                  style={{ width: `${analysis.progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Metric 2: Attendance Tracking */}
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-4 border border-white/10 hover:bg-white/15 transition-colors flex flex-col justify-between">
              <div>
                <div className="text-xs text-emerald-200 mb-1 font-medium flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <CalendarCheck className="w-3.5 h-3.5 text-amber-300" />
                    <span>Chuyên cần Tháng 11</span>
                  </span>
                  <span className="font-bold text-amber-300">{analysis.attendanceDays} ngày</span>
                </div>
                <p className="text-sm font-bold text-white flex items-center gap-1.5 mt-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>{analysis.diligenceRating}</span>
                </p>
                <p className="text-[11px] text-emerald-200 mt-1">
                  Đã rèn luyện {profile.sessionCount || 1} buổi trong tháng.
                </p>
              </div>

              <button
                type="button"
                onClick={() => onNavigateToTab('attendance')}
                className="mt-2 text-left text-[11px] font-semibold text-amber-300 hover:text-white transition-colors underline"
              >
                Xem sổ chuyên cần toàn trường →
              </button>
            </div>

            {/* Metric 3: Skill to Improve */}
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-4 border border-white/10 hover:bg-white/15 transition-colors">
              <div className="text-xs text-emerald-200 mb-1 font-medium flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-amber-300" />
                <span>Kỹ năng cần rèn luyện</span>
              </div>
              <p className="text-base font-bold text-white flex items-center gap-2 mt-0.5">
                <Mic className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="line-clamp-1">{analysis.weakSkill}</span>
              </p>
              <p className="text-[11px] text-emerald-200 mt-2">
                Luyện tập ghi âm phát âm để tăng độ chuẩn xác và tự tin khi đứng lớp.
              </p>
            </div>

            {/* Metric 4: Today Recommendation */}
            <div className="bg-gradient-to-r from-amber-500/20 to-emerald-500/20 backdrop-blur-xs rounded-2xl p-4 border border-amber-300/30 hover:border-amber-300/50 transition-all flex flex-col justify-between">
              <div>
                <div className="text-xs text-amber-200 mb-1 font-medium flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Gợi ý rèn luyện hôm nay</span>
                </div>
                <p className="text-sm font-bold text-amber-300 line-clamp-1 mt-0.5">
                  "{analysis.suggestedPhrase}"
                </p>
                <p className="text-[11px] text-emerald-100 line-clamp-1 mt-0.5">
                  {suggestedPhraseObj.vietnamese}
                </p>
              </div>

              <button
                onClick={() => onSelectPhrase(suggestedPhraseObj.id)}
                className="mt-3 inline-flex items-center justify-between w-full px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs transition-transform active:scale-95 shadow-xs"
              >
                <span>Học câu này ngay</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Quick Action Grid (EdTech Features) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Action 1: Attendance */}
        <button
          onClick={() => onNavigateToTab('attendance')}
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all text-left group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <CalendarCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-800 text-sm">Sổ Chuyên Cần</h3>
          <p className="text-xs text-slate-500 mt-0.5">Theo dõi GV theo Tổ CM</p>
        </button>

        {/* Action 2: Games (NEW) */}
        <button
          onClick={() => onNavigateToTab('games')}
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-amber-500 hover:shadow-md transition-all text-left group relative overflow-hidden"
        >
          <span className="absolute top-2 right-2 px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[9px] font-black uppercase">
            Mới
          </span>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Gamepad2 className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-800 text-sm">Minigames</h3>
          <p className="text-xs text-slate-500 mt-0.5">Lật thẻ & Xếp từ vui nhộn</p>
        </button>

        {/* Action 3: Classroom Smart TV Mode (NEW) */}
        <button
          onClick={onOpenTvMode}
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all text-left group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Tv className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-800 text-sm">Chiếu Smart TV</h3>
          <p className="text-xs text-slate-500 mt-0.5">Toàn màn hình cho lớp học</p>
        </button>

        {/* Action 4: Download Word & PowerPoint (NEW) */}
        <button
          onClick={onOpenDocumentModal}
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all text-left group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <FileDown className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-800 text-sm">Tải Slide & GA</h3>
          <p className="text-xs text-slate-500 mt-0.5">Xuất .docx và .pptx chuẩn</p>
        </button>

        {/* Action 5: Speaking Lab */}
        <button
          onClick={() => onNavigateToTab('speaking')}
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all text-left group"
        >
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Mic className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-800 text-sm">Phòng Luyện Nói</h3>
          <p className="text-xs text-slate-500 mt-0.5">Ghi âm & Chấm điểm AI</p>
        </button>

        {/* Action 6: 10 Slogans List */}
        <button
          onClick={() => onNavigateToTab('phrases')}
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all text-left group"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-800 text-sm">10 Khẩu Hiệu</h3>
          <p className="text-xs text-slate-500 mt-0.5">Phiên âm & Cử chỉ TPR</p>
        </button>
      </div>

      {/* Progress Cards for all 10 Classroom Slogans */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-700" />
              <span>Tiến Độ Bộ 10 Khẩu Hiệu Lớp Học Tháng 11</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Nhấn vào từng câu để học chi tiết, luyện nghe giọng chuẩn hoặc luyện phát âm với micro.
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
            {profile.completedPhraseIds.length}/10 đã thành thạo
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {CLASSROOM_PHRASES.map((item) => {
            const isCompleted = profile.completedPhraseIds.includes(item.id);
            const speakingScore = profile.speakingScores[item.id];

            return (
              <div
                key={item.id}
                onClick={() => onSelectPhrase(item.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                  isCompleted 
                    ? 'bg-emerald-50/60 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50' 
                    : 'bg-slate-50/70 border-slate-200 hover:border-slate-300 hover:bg-white hover:shadow-xs'
                }`}
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                    isCompleted 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-white text-slate-600 border border-slate-200'
                  }`}>
                    {isCompleted ? <CheckCircle className="w-4 h-4" /> : item.id}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-800 text-sm truncate">
                        {item.phrase}
                      </h4>
                      <button
                        type="button"
                        onClick={(e) => handleQuickPlay(e, item.phrase)}
                        title="Nghe phát âm chuẩn"
                        className="p-1 rounded-md text-emerald-700 hover:bg-emerald-100 transition-colors"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-xs text-slate-600 truncate mt-0.5">
                      {item.vietnamese}
                    </p>
                    
                    <p className="text-[11px] font-mono text-emerald-800 mt-1">
                      {item.ipa}
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600">
                        {item.category}
                      </span>
                      {speakingScore !== undefined && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                          Điểm nói: {speakingScore}/100
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className={`text-[11px] font-semibold px-2 py-1 rounded-lg ${
                    isCompleted 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-slate-200/70 text-slate-600'
                  }`}>
                    {isCompleted ? 'Đã thành thạo' : 'Chưa luyện'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges and Motivation for Lê Kim Lăng Teachers */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
        <h3 className="font-bold text-slate-800 text-base mb-3 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          <span>Huy Hiệu Thi Đua Sư Phạm Lê Kim Lăng</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {BADGE_DEFINITIONS.map((badge) => {
            const isUnlocked = profile.points >= badge.minPoints;
            return (
              <div
                key={badge.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-center gap-3 ${
                  isUnlocked
                    ? 'bg-amber-50/60 border-amber-200'
                    : 'bg-slate-50/50 border-slate-100 opacity-60'
                }`}
              >
                <div className="text-3xl shrink-0">
                  {badge.icon}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-xs sm:text-sm">
                    {badge.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1">
                    {badge.description}
                  </p>
                  <span className={`text-[10px] font-bold inline-block mt-1 ${
                    isUnlocked ? 'text-amber-700' : 'text-slate-400'
                  }`}>
                    {isUnlocked ? '✓ Đã mở khóa' : `Cần ${badge.minPoints} điểm`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
