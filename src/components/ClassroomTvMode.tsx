import React, { useState, useEffect } from 'react';
import { ClassroomPhrase } from '../types';
import { CLASSROOM_PHRASES } from '../data/phrases';
import { SpeechService } from '../utils/speech';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Volume2, 
  Sparkles, 
  Maximize, 
  RotateCcw,
  HandMetal,
  BookOpen,
  School,
  Play
} from 'lucide-react';

interface ClassroomTvModeProps {
  isOpen: boolean;
  onClose: () => void;
  initialPhraseId?: number;
}

export const ClassroomTvMode: React.FC<ClassroomTvModeProps> = ({
  isOpen,
  onClose,
  initialPhraseId = 1
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(0.9);

  useEffect(() => {
    if (initialPhraseId) {
      const idx = CLASSROOM_PHRASES.findIndex(p => p.id === initialPhraseId);
      if (idx !== -1) setCurrentIdx(idx);
    }
  }, [initialPhraseId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowRight' || e.key === ' ') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIdx]);

  if (!isOpen) return null;

  const currentPhrase = CLASSROOM_PHRASES[currentIdx];

  const handleNext = () => {
    setCurrentIdx(prev => (prev < CLASSROOM_PHRASES.length - 1 ? prev + 1 : 0));
  };

  const handlePrev = () => {
    setCurrentIdx(prev => (prev > 0 ? prev - 1 : CLASSROOM_PHRASES.length - 1));
  };

  const handleSpeak = async (speed: number) => {
    setIsPlaying(true);
    await SpeechService.speak(currentPhrase.phrase, speed);
    setIsPlaying(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col justify-between p-6 sm:p-10 select-none animate-in fade-in duration-300">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600/30 border border-emerald-400/30 flex items-center justify-center text-amber-300">
            <School className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-wide text-white">
                LKL10caugiaotiepTAthang11
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-bold text-xs uppercase">
                Chế độ Smart TV Lớp Học
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Trường Tiểu học Lê Kim Lăng • Dành cho bục giảng & màn hình tương tác
            </p>
          </div>
        </div>

        {/* Speed Controls & Exit */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white/10 rounded-xl p-1 text-xs">
            <button
              onClick={() => { setPlaybackSpeed(0.75); handleSpeak(0.75); }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                playbackSpeed === 0.75 ? 'bg-amber-400 text-slate-950' : 'text-slate-300 hover:text-white'
              }`}
            >
              Đọc Chậm (0.75x)
            </button>
            <button
              onClick={() => { setPlaybackSpeed(0.9); handleSpeak(0.9); }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                playbackSpeed === 0.9 ? 'bg-amber-400 text-slate-950' : 'text-slate-300 hover:text-white'
              }`}
            >
              Chuẩn (0.9x)
            </button>
            <button
              onClick={() => { setPlaybackSpeed(1.1); handleSpeak(1.1); }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                playbackSpeed === 1.1 ? 'bg-amber-400 text-slate-950' : 'text-slate-300 hover:text-white'
              }`}
            >
              Hô Chant (1.1x)
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-rose-600/80 text-white transition-all border border-white/15"
            title="Thoát chế độ trình chiếu (Phím ESC)"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Focus Display Area */}
      <div className="flex-1 flex flex-col items-center justify-center text-center my-6 max-w-5xl mx-auto w-full space-y-6">
        {/* Category Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-bold text-sm sm:text-base">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>CÂU #{currentPhrase.id}: {currentPhrase.category.toUpperCase()}</span>
        </div>

        {/* Big English Phrase */}
        <div className="relative group cursor-pointer" onClick={() => handleSpeak(playbackSpeed)}>
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-white to-amber-200 tracking-tight drop-shadow-md transition-transform hover:scale-[1.02]">
            "{currentPhrase.phrase}"
          </h1>
          <p className="text-xl sm:text-2xl font-mono text-emerald-400 mt-3 font-semibold">
            {currentPhrase.ipa}
          </p>
        </div>

        {/* Big Vietnamese Meaning */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 max-w-3xl w-full backdrop-blur-md space-y-4">
          <p className="text-2xl sm:text-4xl font-extrabold text-amber-300">
            {currentPhrase.vietnamese}
          </p>

          {/* TPR Gestures box */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-center gap-3 text-emerald-200 text-sm sm:text-lg">
            <HandMetal className="w-6 h-6 text-amber-300 shrink-0" />
            <span className="font-semibold">Động tác TPR: </span>
            <span className="text-white font-medium">{currentPhrase.tprGestures}</span>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 italic">
            "{currentPhrase.leKimLangScenario.situation}"
          </p>
        </div>

        {/* Big Audio Play Button */}
        <button
          onClick={() => handleSpeak(playbackSpeed)}
          disabled={isPlaying}
          className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-lg sm:text-xl shadow-xl shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95"
        >
          <Volume2 className="w-7 h-7" />
          <span>{isPlaying ? 'Đang phát âm...' : 'PHÁT ÂM THANH MẪU'}</span>
        </button>
      </div>

      {/* Bottom Navigation Ribbon */}
      <div className="border-t border-white/10 pt-4 flex flex-wrap items-center justify-between gap-4">
        {/* Navigation Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrev}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Câu Trước (Phím ←)</span>
          </button>

          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all"
          >
            <span>Câu Kế Tiếp (Phím →)</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* 10 Dots / Numbers Selector */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {CLASSROOM_PHRASES.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => setCurrentIdx(idx)}
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center ${
                currentIdx === idx
                  ? 'bg-amber-400 text-slate-950 scale-110 shadow-lg'
                  : 'bg-white/10 hover:bg-white/20 text-slate-300'
              }`}
            >
              {p.id}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-400 hidden lg:block">
          Mẹo: Dùng phím Space hoặc bấm vào câu để phát âm chuẩn
        </div>
      </div>
    </div>
  );
};
