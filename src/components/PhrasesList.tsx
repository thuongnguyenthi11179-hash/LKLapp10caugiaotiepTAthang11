import React, { useState } from 'react';
import { ClassroomPhrase, TeacherProfile } from '../types';
import { CLASSROOM_PHRASES } from '../data/phrases';
import { SpeechService } from '../utils/speech';
import { 
  BookOpen, 
  Volume2, 
  Play, 
  Search, 
  Filter, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  HandMetal
} from 'lucide-react';

interface PhrasesListProps {
  profile: TeacherProfile;
  onSelectPhrase: (phraseId: number) => void;
  onStartSpeaking: (phraseId: number) => void;
}

export const PhrasesList: React.FC<PhrasesListProps> = ({
  profile,
  onSelectPhrase,
  onStartSpeaking
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');

  const categories = ['Tất cả', 'Văn hóa & Đạo đức', 'Nề nếp lớp học', 'Tương tác & Ngôn ngữ', 'Khích lệ & Ý chí'];

  const filtered = CLASSROOM_PHRASES.filter(item => {
    const matchesCategory = selectedCategory === 'Tất cả' || item.category === selectedCategory;
    const matchesSearch = item.phrase.toLowerCase().includes(search.toLowerCase()) ||
                          item.vietnamese.toLowerCase().includes(search.toLowerCase()) ||
                          item.ipa.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handlePlayAudio = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    SpeechService.speak(text, 0.9);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Bộ Kiến Thức Cốt Lõi • Tiểu Học Lê Kim Lăng</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
            Bộ 10 Câu Khẩu Hiệu Giao Tiếp Tiếng Anh Tháng 11
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Khẩu hiệu tiếng Anh giao tiếp sư phạm chọn lọc dành cho giáo viên Trường Tiểu học Lê Kim Lăng.
          </p>
        </div>

        {/* Search and Category Filter */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm theo câu tiếng Anh, nghĩa tiếng Việt hoặc IPA..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-emerald-700 text-white font-semibold shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of 10 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => {
          const isCompleted = profile.completedPhraseIds.includes(item.id);
          const speakingScore = profile.speakingScores[item.id];

          return (
            <div
              key={item.id}
              onClick={() => onSelectPhrase(item.id)}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs hover:shadow-md hover:border-emerald-400 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Câu số #{item.id}
                  </span>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                    {item.category}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                      {item.phrase}
                    </h3>
                    <button
                      type="button"
                      onClick={(e) => handlePlayAudio(e, item.phrase)}
                      className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 border border-emerald-200/50 transition-colors"
                      title="Nghe phát âm chuẩn"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-sm font-semibold text-emerald-800 mt-0.5">
                    {item.vietnamese}
                  </p>

                  <p className="font-mono text-xs text-slate-600 mt-1">
                    IPA: <span className="font-semibold text-slate-800">{item.ipa}</span>
                  </p>
                </div>

                {/* Sắc thái & Cử chỉ TPR */}
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs space-y-1">
                  <p className="text-slate-700">
                    <strong className="text-slate-900">Sắc thái:</strong> {item.toneDescription}
                  </p>
                  <p className="text-slate-700 flex items-start gap-1">
                    <HandMetal className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-900">TPR:</strong> {item.tprGestures}</span>
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  {speakingScore !== undefined ? (
                    <span className="font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                      Điểm nói: {speakingScore}/100
                    </span>
                  ) : isCompleted ? (
                    <span className="font-semibold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Đã thành thạo
                    </span>
                  ) : (
                    <span className="text-slate-400">Chưa luyện nói</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onStartSpeaking(item.id);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold transition-transform active:scale-95"
                  >
                    Luyện Nói
                  </button>
                  <span className="text-emerald-700 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Chi tiết <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
