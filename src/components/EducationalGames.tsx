import React, { useState, useEffect } from 'react';
import { TeacherProfile } from '../types';
import { CLASSROOM_PHRASES } from '../data/phrases';
import { SpeechService } from '../utils/speech';
import confetti from 'canvas-confetti';
import { 
  Gamepad2, 
  Sparkles, 
  Award, 
  RotateCcw, 
  CheckCircle2, 
  Timer, 
  Volume2, 
  ArrowRight, 
  Flame,
  HelpCircle,
  Trophy,
  Star,
  Shuffle
} from 'lucide-react';

interface EducationalGamesProps {
  profile: TeacherProfile;
  onAddGamePoints: (points: number, reason: string) => void;
}

type GameMode = 'menu' | 'memory' | 'scramble' | 'blitz';

interface MemoryCard {
  uid: string;
  phraseId: number;
  type: 'english' | 'vietnamese';
  text: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export const EducationalGames: React.FC<EducationalGamesProps> = ({
  profile,
  onAddGamePoints
}) => {
  const [activeGame, setActiveGame] = useState<GameMode>('menu');

  // ----------------------------------------------------
  // GAME 1: MEMORY MATCH STATE
  // ----------------------------------------------------
  const [memoryCards, setMemoryCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<MemoryCard[]>([]);
  const [memoryMoves, setMemoryMoves] = useState(0);
  const [memoryTimer, setMemoryTimer] = useState(0);
  const [isMemoryRunning, setIsMemoryRunning] = useState(false);
  const [memoryWon, setMemoryWon] = useState(false);

  const initMemoryGame = () => {
    // Pick 6 random phrases out of 10
    const shuffledPhrases = [...CLASSROOM_PHRASES].sort(() => 0.5 - Math.random()).slice(0, 6);
    const cards: MemoryCard[] = [];

    shuffledPhrases.forEach(p => {
      cards.push({
        uid: `en_${p.id}`,
        phraseId: p.id,
        type: 'english',
        text: p.phrase,
        isFlipped: false,
        isMatched: false
      });
      cards.push({
        uid: `vi_${p.id}`,
        phraseId: p.id,
        type: 'vietnamese',
        text: `${p.vietnamese} (${p.tprGestures})`,
        isFlipped: false,
        isMatched: false
      });
    });

    // Shuffle cards
    setMemoryCards(cards.sort(() => 0.5 - Math.random()));
    setFlippedCards([]);
    setMemoryMoves(0);
    setMemoryTimer(0);
    setIsMemoryRunning(true);
    setMemoryWon(false);
  };

  useEffect(() => {
    let interval: any = null;
    if (isMemoryRunning && !memoryWon) {
      interval = setInterval(() => setMemoryTimer(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isMemoryRunning, memoryWon]);

  const handleCardClick = (card: MemoryCard) => {
    if (card.isFlipped || card.isMatched || flippedCards.length >= 2) return;

    if (card.type === 'english') {
      SpeechService.speak(card.text, 0.9);
    }

    const newCards = memoryCards.map(c => 
      c.uid === card.uid ? { ...c, isFlipped: true } : c
    );
    setMemoryCards(newCards);

    const newFlipped = [...flippedCards, card];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMemoryMoves(m => m + 1);
      const [first, second] = newFlipped;

      if (first.phraseId === second.phraseId && first.type !== second.type) {
        // Matched!
        setTimeout(() => {
          setMemoryCards(prev => prev.map(c => 
            c.phraseId === first.phraseId ? { ...c, isMatched: true } : c
          ));
          setFlippedCards([]);

          // Check if game won
          const remaining = newCards.filter(c => !c.isMatched && c.phraseId !== first.phraseId);
          if (remaining.length === 0) {
            setMemoryWon(true);
            setIsMemoryRunning(false);
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            onAddGamePoints(50, 'Hoàn thành Trò chơi Lật Thẻ Ghi Nhớ');
          }
        }, 500);
      } else {
        // Not matched
        setTimeout(() => {
          setMemoryCards(prev => prev.map(c => 
            c.uid === first.uid || c.uid === second.uid ? { ...c, isFlipped: false } : c
          ));
          setFlippedCards([]);
        }, 1100);
      }
    }
  };

  // ----------------------------------------------------
  // GAME 2: SENTENCE BUILDER / SCRAMBLE STATE
  // ----------------------------------------------------
  const [scrambleIdx, setScrambleIdx] = useState(0);
  const [shuffledWords, setShuffledWords] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [scrambleStatus, setScrambleStatus] = useState<'playing' | 'correct' | 'wrong'>('playing');
  const [scrambleScore, setScrambleScore] = useState(0);

  const initScrambleRound = (idx: number) => {
    const phraseObj = CLASSROOM_PHRASES[idx];
    const words = phraseObj.phrase.replace(/[!,?.]/g, '').split(' ');
    // Shuffle words
    const shuffled = [...words].sort(() => 0.5 - Math.random());
    setShuffledWords(shuffled);
    setSelectedWords([]);
    setScrambleStatus('playing');
  };

  const startScrambleGame = () => {
    setScrambleIdx(0);
    setScrambleScore(0);
    initScrambleRound(0);
    setActiveGame('scramble');
  };

  const handleSelectWord = (word: string, index: number) => {
    if (scrambleStatus === 'correct') return;
    const newSelected = [...selectedWords, word];
    setSelectedWords(newSelected);

    const newShuffled = [...shuffledWords];
    newShuffled.splice(index, 1);
    setShuffledWords(newShuffled);

    // Check if sentence complete
    const targetWords = CLASSROOM_PHRASES[scrambleIdx].phrase.replace(/[!,?.]/g, '').split(' ');
    if (newSelected.length === targetWords.length) {
      if (newSelected.join(' ').toLowerCase() === targetWords.join(' ').toLowerCase()) {
        setScrambleStatus('correct');
        setScrambleScore(s => s + 20);
        SpeechService.speak(CLASSROOM_PHRASES[scrambleIdx].phrase, 0.9);
        confetti({ particleCount: 50, spread: 60 });
        onAddGamePoints(20, `Xếp đúng câu #${CLASSROOM_PHRASES[scrambleIdx].id}`);
      } else {
        setScrambleStatus('wrong');
      }
    }
  };

  const handleResetCurrentScramble = () => {
    initScrambleRound(scrambleIdx);
  };

  const handleNextScramble = () => {
    if (scrambleIdx < CLASSROOM_PHRASES.length - 1) {
      const nextIdx = scrambleIdx + 1;
      setScrambleIdx(nextIdx);
      initScrambleRound(nextIdx);
    } else {
      confetti({ particleCount: 120, spread: 80 });
      alert(`Xuất sắc! Thầy/cô đã hoàn thành thử thách xếp 10 câu với ${scrambleScore} điểm!`);
      setActiveGame('menu');
    }
  };

  // ----------------------------------------------------
  // GAME 3: SPEED LISTENING BLITZ STATE
  // ----------------------------------------------------
  const [blitzIdx, setBlitzIdx] = useState(0);
  const [blitzScore, setBlitzScore] = useState(0);
  const [blitzTimeLeft, setBlitzTimeLeft] = useState(10);
  const [blitzActive, setBlitzActive] = useState(false);
  const [blitzOptions, setBlitzOptions] = useState<string[]>([]);
  const [blitzAnswered, setBlitzAnswered] = useState<string | null>(null);

  const startBlitzGame = () => {
    setBlitzIdx(0);
    setBlitzScore(0);
    setActiveGame('blitz');
    initBlitzQuestion(0);
  };

  const initBlitzQuestion = (idx: number) => {
    const current = CLASSROOM_PHRASES[idx];
    const correct = current.vietnamese;
    const wrong = CLASSROOM_PHRASES
      .filter(p => p.id !== current.id)
      .map(p => p.vietnamese)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    
    const allOptions = [correct, ...wrong].sort(() => 0.5 - Math.random());
    setBlitzOptions(allOptions);
    setBlitzTimeLeft(10);
    setBlitzAnswered(null);
    setBlitzActive(true);

    // Auto speak
    SpeechService.speak(current.phrase, 0.9);
  };

  useEffect(() => {
    let timer: any = null;
    if (blitzActive && blitzTimeLeft > 0 && !blitzAnswered) {
      timer = setInterval(() => setBlitzTimeLeft(t => t - 1), 1000);
    } else if (blitzTimeLeft === 0 && !blitzAnswered) {
      setBlitzAnswered('TIME_OUT');
      setBlitzActive(false);
    }
    return () => clearInterval(timer);
  }, [blitzActive, blitzTimeLeft, blitzAnswered]);

  const handleBlitzChoose = (option: string) => {
    if (blitzAnswered) return;
    setBlitzAnswered(option);
    setBlitzActive(false);

    const isCorrect = option === CLASSROOM_PHRASES[blitzIdx].vietnamese;
    if (isCorrect) {
      const bonus = Math.max(10, blitzTimeLeft * 2);
      setBlitzScore(s => s + bonus);
      confetti({ particleCount: 40, spread: 50 });
      onAddGamePoints(bonus, 'Phản xạ nghe chính xác câu khẩu hiệu');
    }
  };

  const handleNextBlitz = () => {
    if (blitzIdx < CLASSROOM_PHRASES.length - 1) {
      const next = blitzIdx + 1;
      setBlitzIdx(next);
      initBlitzQuestion(next);
    } else {
      confetti({ particleCount: 150, spread: 90 });
      alert(`Hoàn thành thử thách phản xạ nhanh! Tổng điểm đạt được: ${blitzScore} điểm.`);
      setActiveGame('menu');
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-800 via-emerald-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold mb-2 border border-amber-400/30">
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>Đấu Trường Minigames Tương Tác • Lê Kim Lăng</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <span>Đấu Trường Rèn Luyện 10 Câu Khẩu Hiệu</span>
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1">
            Ứng dụng phương pháp Gamification giúp giáo viên thuộc làu câu khẩu hiệu và có thể dùng trực tiếp trò chơi này để dạy học sinh trên lớp!
          </p>
        </div>

        {activeGame !== 'menu' && (
          <button
            onClick={() => setActiveGame('menu')}
            className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs flex items-center gap-2 backdrop-blur-md transition-all"
          >
            <span>← Quay lại chọn trò chơi</span>
          </button>
        )}
      </div>

      {/* GAME SELECTOR MENU */}
      {activeGame === 'menu' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Game 1 Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-emerald-500 hover:shadow-xl transition-all flex flex-col justify-between group">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Shuffle className="w-7 h-7" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700">
                Ghi nhớ & Phản xạ
              </span>
              <h3 className="text-lg font-bold text-slate-800 mt-2">
                Lật Thẻ Ghi Nhớ (Memory Match)
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Lật các cặp thẻ tương ứng giữa câu khẩu hiệu tiếng Anh và nghĩa tiếng Việt kèm động tác TPR. Luyện khả năng ghi nhớ siêu tốc!
              </p>
            </div>

            <button
              onClick={() => { initMemoryGame(); setActiveGame('memory'); }}
              className="mt-5 w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95"
            >
              <span>Bắt Đầu Chơi Ngay</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Game 2 Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-amber-500 hover:shadow-xl transition-all flex flex-col justify-between group">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Trophy className="w-7 h-7" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-50 text-amber-700">
                Ngữ pháp & Trật tự từ
              </span>
              <h3 className="text-lg font-bold text-slate-800 mt-2">
                Xếp Từ Thành Câu (Sentence Builder)
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Các từ trong câu bị xáo trộn vị trí. Nhấp chọn các từ theo đúng thứ tự để tạo thành câu khẩu hiệu chuẩn xác.
              </p>
            </div>

            <button
              onClick={startScrambleGame}
              className="mt-5 w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95"
            >
              <span>Bắt Đầu Chơi Ngay</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Game 3 Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-blue-500 hover:shadow-xl transition-all flex flex-col justify-between group">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Flame className="w-7 h-7" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-50 text-blue-700">
                Nghe & Tốc độ 10s
              </span>
              <h3 className="text-lg font-bold text-slate-800 mt-2">
                Phản Xạ Nhanh (Listening Blitz)
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Nghe âm thanh câu khẩu hiệu phát ra và chọn nghĩa chuẩn xác trong vòng 10 giây. Càng nhanh điểm càng cao!
              </p>
            </div>

            <button
              onClick={startBlitzGame}
              className="mt-5 w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95"
            >
              <span>Bắt Đầu Chơi Ngay</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* GAME 1: MEMORY MATCH ARENA */}
      {activeGame === 'memory' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-800">
                Thử Thách Lật Thẻ Ghi Nhớ (6 Cặp Khẩu Hiệu)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Tìm các cặp tương ứng giữa câu tiếng Anh và nghĩa tiếng Việt / động tác TPR.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-xl text-xs font-semibold text-slate-700">
                <Timer className="w-4 h-4 text-emerald-700" />
                <span>Thời gian: {memoryTimer}s</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-xl text-xs font-semibold text-slate-700">
                <span>Số lượt lật: {memoryMoves}</span>
              </div>
              <button
                onClick={initMemoryGame}
                className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
                title="Chơi lại ván mới"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {memoryWon ? (
            <div className="py-12 text-center space-y-4 animate-in zoom-in-95 duration-300">
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-inner">
                <Award className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-slate-800">
                Chúc Mừng Thầy/Cô Đã Chiến Thắng!
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Đã hoàn thành toàn bộ 6 cặp thẻ ghi nhớ trong <b>{memoryTimer} giây</b> với <b>{memoryMoves} lượt lật</b>. Thầy cô được cộng thêm <b>+50 điểm sư phạm</b>!
              </p>
              <button
                onClick={initMemoryGame}
                className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition-transform active:scale-95"
              >
                Chơi Ván Khác
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
              {memoryCards.map(card => {
                const isOpen = card.isFlipped || card.isMatched;
                return (
                  <div
                    key={card.uid}
                    onClick={() => handleCardClick(card)}
                    className={`h-32 sm:h-36 rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 select-none border ${
                      card.isMatched
                        ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-500/20 opacity-80 cursor-default'
                        : isOpen
                        ? 'bg-white border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                        : 'bg-gradient-to-br from-emerald-800 to-teal-900 border-emerald-700 hover:scale-[1.02] shadow-sm text-white'
                    }`}
                  >
                    {isOpen ? (
                      <div>
                        <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-md ${
                          card.type === 'english' ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
                        }`}>
                          {card.type === 'english' ? 'Tiếng Anh' : 'Tiếng Việt / TPR'}
                        </span>
                        <p className={`font-bold mt-2 ${
                          card.type === 'english' ? 'text-emerald-900 text-sm sm:text-base' : 'text-slate-700 text-xs sm:text-sm'
                        }`}>
                          {card.text}
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1">
                        <Sparkles className="w-6 h-6 text-amber-300 opacity-60" />
                        <span className="text-xs font-bold text-emerald-200 uppercase tracking-widest mt-1">
                          LKL-10
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* GAME 2: SENTENCE BUILDER ARENA */}
      {activeGame === 'scramble' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="text-xs font-bold uppercase text-amber-700">
                Câu #{CLASSROOM_PHRASES[scrambleIdx].id} / 10
              </div>
              <h3 className="text-lg font-bold text-slate-800">
                Thử Thách Xếp Từ: "{CLASSROOM_PHRASES[scrambleIdx].vietnamese}"
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-3 py-1.5 bg-amber-100 text-amber-900 font-bold rounded-xl text-xs">
                Điểm tích lũy: {scrambleScore} đ
              </span>
              <button
                onClick={handleResetCurrentScramble}
                className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
                title="Xếp lại câu này"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Target Placement Area */}
          <div className="min-h-24 p-5 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl flex flex-wrap items-center justify-center gap-2.5">
            {selectedWords.length === 0 ? (
              <span className="text-xs text-slate-400">
                Nhấp chọn các từ bên dưới theo đúng thứ tự để tạo thành câu...
              </span>
            ) : (
              selectedWords.map((word, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 rounded-xl bg-emerald-700 text-white font-bold text-base shadow-sm animate-in zoom-in-95 duration-150"
                >
                  {word}
                </span>
              ))
            )}
          </div>

          {/* Shuffled Word Bank */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {shuffledWords.map((word, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectWord(word, idx)}
                className="px-5 py-2.5 rounded-xl bg-white border border-slate-300 hover:border-emerald-600 hover:bg-emerald-50 text-slate-800 font-bold text-base shadow-xs transition-transform active:scale-95"
              >
                {word}
              </button>
            ))}
          </div>

          {/* Feedback & Actions */}
          {scrambleStatus === 'correct' && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-wrap items-center justify-between gap-3 animate-in fade-in duration-200">
              <div className="flex items-center gap-2.5 text-emerald-900">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-bold text-sm">Chính xác! (+20 điểm)</p>
                  <p className="text-xs text-emerald-700">
                    "{CLASSROOM_PHRASES[scrambleIdx].phrase}" — {CLASSROOM_PHRASES[scrambleIdx].ipa}
                  </p>
                </div>
              </div>

              <button
                onClick={handleNextScramble}
                className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 transition-transform active:scale-95 shadow-sm"
              >
                <span>Câu Tiếp Theo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {scrambleStatus === 'wrong' && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between gap-3">
              <p className="text-xs text-rose-800 font-semibold">
                Thứ tự từ chưa chính xác. Thầy/cô hãy nhấn nút làm lại để xếp lại nhé!
              </p>
              <button
                onClick={handleResetCurrentScramble}
                className="px-4 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700"
              >
                Xếp lại
              </button>
            </div>
          )}
        </div>
      )}

      {/* GAME 3: SPEED LISTENING BLITZ ARENA */}
      {activeGame === 'blitz' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="text-xs font-bold uppercase text-blue-700">
                Phản xạ #{blitzIdx + 1} / 10
              </div>
              <h3 className="text-lg font-bold text-slate-800">
                Nghe & Chọn Nghĩa Nhanh Trong 10 Giây
              </h3>
            </div>

            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold ${
                blitzTimeLeft <= 3 ? 'bg-rose-100 text-rose-800 animate-pulse' : 'bg-slate-100 text-slate-800'
              }`}>
                <Timer className="w-4 h-4" />
                <span>Còn: {blitzTimeLeft}s</span>
              </div>
              <span className="px-3 py-1.5 bg-blue-100 text-blue-900 font-bold rounded-xl text-xs">
                Điểm: {blitzScore} đ
              </span>
            </div>
          </div>

          {/* Audio Replay Button */}
          <div className="py-6 text-center space-y-3">
            <button
              onClick={() => SpeechService.speak(CLASSROOM_PHRASES[blitzIdx].phrase, 0.9)}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-lg shadow-blue-500/20 transition-transform active:scale-95"
            >
              <Volume2 className="w-6 h-6" />
              <span>Nghe Lại Câu Khẩu Hiệu</span>
            </button>
            <p className="text-xs text-slate-400">
              Hãy chọn nhanh nghĩa tiếng Việt và phản xạ tương ứng bên dưới:
            </p>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {blitzOptions.map((opt, idx) => {
              const isChosen = blitzAnswered === opt;
              const isCorrectAnswer = opt === CLASSROOM_PHRASES[blitzIdx].vietnamese;

              let btnStyle = 'bg-slate-50 border-slate-200 hover:border-blue-500 text-slate-800';
              if (blitzAnswered) {
                if (isCorrectAnswer) {
                  btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold';
                } else if (isChosen) {
                  btnStyle = 'bg-rose-100 border-rose-500 text-rose-950';
                } else {
                  btnStyle = 'bg-slate-50 border-slate-200 opacity-50';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={blitzAnswered !== null}
                  onClick={() => handleBlitzChoose(opt)}
                  className={`p-4 rounded-2xl border text-left text-sm font-medium transition-all ${btnStyle}`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-white/80 border border-slate-200 flex items-center justify-center font-bold text-xs shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Next Button when answered */}
          {blitzAnswered && (
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleNextBlitz}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-transform active:scale-95"
              >
                <span>Câu Tiếp Theo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
