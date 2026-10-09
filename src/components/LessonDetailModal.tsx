import React, { useState } from 'react';
import { ClassroomPhrase } from '../types';
import { SpeechService } from '../utils/speech';
import { 
  X, 
  Volume2, 
  Play, 
  Sparkles, 
  BookOpen, 
  Lightbulb, 
  Smile, 
  HandMetal, 
  ArrowRight,
  School,
  CheckCircle2,
  Mic
} from 'lucide-react';

interface LessonDetailModalProps {
  phrase: ClassroomPhrase | null;
  isOpen: boolean;
  onClose: () => void;
  onStartSpeaking: (phraseId: number) => void;
  onMarkListeningComplete: (phraseId: number) => void;
}

export const LessonDetailModal: React.FC<LessonDetailModalProps> = ({
  phrase,
  isOpen,
  onClose,
  onStartSpeaking,
  onMarkListeningComplete
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState<number>(0.9);

  if (!isOpen || !phrase) return null;

  const handlePlayAudio = async (speed: number) => {
    setPlaySpeed(speed);
    setIsPlaying(true);
    await SpeechService.speak(phrase.phrase, speed);
    setIsPlaying(false);
    onMarkListeningComplete(phrase.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-100 my-8">
        {/* Header Modal */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-700 text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold mb-2 border border-amber-400/30">
            <School className="w-3.5 h-3.5" />
            <span>Bài Học Chi Tiết #{phrase.id} • Tiểu Học Lê Kim Lăng</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {phrase.phrase}
          </h2>
          <p className="text-sm sm:text-base text-emerald-100 mt-1 font-medium">
            {phrase.vietnamese}
          </p>
        </div>

        {/* Content Body - STRICTLY FOLLOWING OUTPUT FORMAT */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Format Section 1: Phrase & Audio Controls */}
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                  Audio Sample & Nghe Phát Âm Mẫu
                </span>
                <p className="text-xs text-slate-600 mt-0.5">
                  Mô tả âm thanh: <strong className="text-emerald-900 font-semibold">{phrase.toneDescription}</strong>
                </p>
              </div>

              {/* Listening Speed buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePlayAudio(0.9)}
                  disabled={isPlaying}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition-all shadow-xs"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Nghe Chuẩn (1.0x)</span>
                </button>

                <button
                  onClick={() => handlePlayAudio(0.65)}
                  disabled={isPlaying}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-emerald-800 border border-emerald-300 font-semibold text-xs transition-all"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Chậm Sư Phạm (0.75x)</span>
                </button>
              </div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-emerald-200 flex items-center justify-between">
              <div>
                <p className="text-[11px] text-slate-500 uppercase font-semibold">Phiên âm quốc tế chuẩn (IPA)</p>
                <p className="font-mono text-base sm:text-lg font-bold text-emerald-900">
                  {phrase.ipa}
                </p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-medium">
                {phrase.category}
              </span>
            </div>
          </div>

          {/* Format Section 2: Pronunciation Details */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span>Pronunciation & Mẹo Đọc Ngữ Điệu</span>
            </h3>

            <div className="text-xs text-slate-700 bg-amber-50/60 p-3 rounded-xl border border-amber-200/70">
              <span className="font-bold text-amber-900">Ngữ điệu (Intonation):</span> {phrase.intonation}
            </div>

            <div className="space-y-2.5 pt-1">
              {phrase.pronunciationTips.map((tip, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <p className="font-bold text-slate-800 mb-0.5">
                    • {tip.rule}
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    {tip.details}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Format Section 3: Pedagogical Meaning */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>Meaning & Ý Nghĩa Sư Phạm</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {phrase.pedagogicalMeaning}
            </p>
          </div>

          {/* TPR & Gestures for Classroom */}
          <div className="bg-teal-50/60 border border-teal-200 rounded-2xl p-4 sm:p-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-teal-900 flex items-center gap-2 mb-2">
              <HandMetal className="w-4 h-4 text-teal-700" />
              <span>Cử Chỉ Toàn Thân (TPR) Dành Cho Thầy Cô</span>
            </h3>
            <p className="text-xs sm:text-sm text-teal-900 leading-relaxed">
              {phrase.tprGestures}
            </p>
          </div>

          {/* School Scenario Sample */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <School className="w-4 h-4 text-emerald-700" />
              <span>Tình Huống Mẫu Tại Trường Lê Kim Lăng</span>
            </h3>
            <p className="text-xs text-slate-700">
              <strong className="text-slate-900">Bối cảnh:</strong> {phrase.leKimLangScenario.situation}
            </p>
            <p className="text-xs text-slate-700">
              <strong className="text-emerald-800">Thầy cô nói:</strong> {phrase.leKimLangScenario.teacherAction}
            </p>
            <p className="text-xs text-slate-700">
              <strong className="text-amber-800">Phản xạ học trò:</strong> {phrase.leKimLangScenario.studentReaction}
            </p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900"
          >
            Đóng
          </button>

          <button
            onClick={() => {
              onClose();
              onStartSpeaking(phrase.id);
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
          >
            <Mic className="w-4 h-4" />
            <span>Luyện Nói Câu Này Ngay</span>
          </button>
        </div>
      </div>
    </div>
  );
};
