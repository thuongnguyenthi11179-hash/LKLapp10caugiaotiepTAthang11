import React, { useState } from 'react';
import { ClassroomPhrase, TeacherProfile } from '../types';
import { CLASSROOM_PHRASES } from '../data/phrases';
import { SpeechService } from '../utils/speech';
import { 
  CheckCircle2, 
  HelpCircle, 
  Award, 
  Sparkles, 
  RotateCcw, 
  ArrowRight, 
  Volume2, 
  BookOpen,
  Check,
  X
} from 'lucide-react';

interface InteractiveQuizProps {
  profile: TeacherProfile;
  onAddPoints: (points: number, phraseId: number) => void;
}

export const InteractiveQuiz: React.FC<InteractiveQuizProps> = ({
  profile,
  onAddPoints
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentItem = CLASSROOM_PHRASES[currentIdx];
  const totalQuestions = CLASSROOM_PHRASES.length;

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentItem.quiz.correctIndex;
    if (isCorrect) {
      setScore(prev => prev + 1);
      onAddPoints(25, currentItem.id);
    }
  };

  const handleNext = () => {
    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setQuizFinished(false);
  };

  const handleSpeakPhrase = (phrase: string) => {
    SpeechService.speak(phrase, 0.9);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300 max-w-3xl mx-auto">
      {/* Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold mb-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Thử Thách Tương Tác Sư Phạm</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
            Bài Tập Trắc Nghiệm & Điền Từ
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Củng cố phản xạ sư phạm và cách dùng 10 câu khẩu hiệu trong tình huống lớp học thực tế.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 rounded-xl border border-amber-200">
          <Award className="w-4 h-4 text-amber-600" />
          <span className="text-xs font-bold text-amber-900">
            {profile.points} điểm tích lũy
          </span>
        </div>
      </div>

      {!quizFinished ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold border-b border-slate-100 pb-3">
            <span>Câu hỏi {currentIdx + 1} / {totalQuestions}</span>
            <span className="text-emerald-700">Đã trả lời đúng: {score} câu</span>
          </div>

          {/* Question Text */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md">
              Chủ đề: {currentItem.category}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-800 leading-snug pt-1">
              {currentItem.quiz.question}
            </h3>
          </div>

          {/* Options List */}
          <div className="space-y-3">
            {currentItem.quiz.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrectOpt = idx === currentItem.quiz.correctIndex;

              let btnStyle = 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300';
              if (isAnswered) {
                if (isCorrectOpt) {
                  btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-200';
                } else if (isSelected) {
                  btnStyle = 'bg-red-50 border-red-500 text-red-950 ring-2 ring-red-200';
                } else {
                  btnStyle = 'bg-slate-50/50 border-slate-200 text-slate-400 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswered}
                  className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between gap-3 ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-xs shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="font-medium">{opt}</span>
                  </div>

                  {isAnswered && (
                    <div>
                      {isCorrectOpt && <Check className="w-5 h-5 text-emerald-600 shrink-0" />}
                      {isSelected && !isCorrectOpt && <X className="w-5 h-5 text-red-600 shrink-0" />}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Answer explanation if answered */}
          {isAnswered && (
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2 animate-in fade-in duration-200">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                <span className="font-bold text-xs uppercase text-emerald-900">
                  {selectedOption === currentItem.quiz.correctIndex ? 'Chính xác! (+25 điểm)' : 'Chưa chính xác'}
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {currentItem.quiz.explanation}
              </p>
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => handleSpeakPhrase(currentItem.phrase)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-emerald-300 text-emerald-800 text-xs font-semibold hover:bg-emerald-50"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Nghe lại câu chuẩn: "{currentItem.phrase}"</span>
                </button>
              </div>
            </div>
          )}

          {/* Next Button */}
          {isAnswered && (
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
              >
                <span>{currentIdx < totalQuestions - 1 ? 'Câu tiếp theo' : 'Xem kết quả'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Quiz Finished Summary */
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-md text-center space-y-5 animate-in zoom-in-95 duration-200">
          <div className="w-20 h-20 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto text-3xl">
            🏆
          </div>

          <div>
            <h3 className="text-2xl font-extrabold text-slate-800">
              Chúc Mừng Thầy/Cô Đã Hoàn Thành!
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              Thầy/cô đã trả lời đúng <strong className="text-emerald-700">{score}/{totalQuestions}</strong> câu hỏi sư phạm.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 max-w-md mx-auto">
            <p className="text-xs font-bold uppercase text-emerald-800">Lời khen từ LKL-Mentor</p>
            <p className="text-xs text-emerald-950 mt-1 italic">
              "Thầy cô đã nắm rất vững ngữ cảnh ứng dụng của các câu khẩu hiệu. Hãy tự tin áp dụng ngay vào các tiết học tại Trường Tiểu học Lê Kim Lăng nhé!"
            </p>
          </div>

          <div className="pt-4 flex items-center justify-center gap-3">
            <button
              onClick={handleRestart}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs sm:text-sm transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Làm Lại Thử Thách</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
