import React, { useState } from 'react';
import { ClassroomPhrase, GeneratedScenario, TeacherProfile } from '../types';
import { CLASSROOM_PHRASES } from '../data/phrases';
import { SpeechService } from '../utils/speech';
import { 
  Wand2, 
  Sparkles, 
  School, 
  Copy, 
  Check, 
  Volume2, 
  BookOpen, 
  MessageSquare, 
  Lightbulb,
  Heart,
  HelpCircle
} from 'lucide-react';

interface ScenarioGeneratorProps {
  profile: TeacherProfile;
}

export const ScenarioGenerator: React.FC<ScenarioGeneratorProps> = ({ profile }) => {
  const [selectedPhrase, setSelectedPhrase] = useState<ClassroomPhrase>(CLASSROOM_PHRASES[0]);
  const [selectedGrade, setSelectedGrade] = useState<string>(profile.gradeLevel || 'Khối 2');
  const [customContext, setCustomContext] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [scenarioResult, setScenarioResult] = useState<GeneratedScenario | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const presetSituations = [
    'Học sinh nói chuyện riêng khi cô đang giao bài tập nhóm',
    'Tranh nhau bút chì màu và thước kẻ trong giờ Mỹ thuật',
    'Một em học sinh nản lòng, khóc vì bài tập Toán khó',
    'Các em chen lấn khi xếp hàng xuống nhà ăn bán trú',
    'Nhiều bạn cùng nhao nhao nói tự do không giơ tay',
    'Giờ ra chơi học sinh vô tình xả rác quanh bồn hoa sân trường'
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    setScenarioResult(null);

    try {
      const response = await fetch('/api/gemini/scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phrase: selectedPhrase.phrase,
          grade: selectedGrade,
          context: customContext || 'Tình huống sinh hoạt và học tập thực tế tại trường Tiểu học Lê Kim Lăng'
        })
      });

      const data = await response.json();
      if (data.scenario) {
        setScenarioResult(data.scenario);
      } else {
        // Fallback to phrase's built-in scenario
        setScenarioResult({
          situation: selectedPhrase.leKimLangScenario.situation,
          howToUse: selectedPhrase.leKimLangScenario.teacherAction,
          followUp: selectedPhrase.leKimLangScenario.extensionPrompt,
          tips: selectedPhrase.leKimLangScenario.pedagogicalTip
        });
      }
    } catch (err) {
      console.error(err);
      setScenarioResult({
        situation: selectedPhrase.leKimLangScenario.situation,
        howToUse: selectedPhrase.leKimLangScenario.teacherAction,
        followUp: selectedPhrase.leKimLangScenario.extensionPrompt,
        tips: selectedPhrase.leKimLangScenario.pedagogicalTip
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!scenarioResult) return;
    const textToCopy = `KỊCH BẢN SƯ PHẠM TIỂU HỌC LÊ KIM LĂNG
Khẩu hiệu: "${selectedPhrase.phrase}" (${selectedPhrase.vietnamese})
Khối lớp: ${selectedGrade}

1. Tình huống:
${scenarioResult.situation}

2. Cách dùng:
${scenarioResult.howToUse}

3. Mở rộng:
${scenarioResult.followUp}

4. Mẹo sư phạm:
${scenarioResult.tips}`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeakPhrase = () => {
    SpeechService.speak(selectedPhrase.phrase, 0.9);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-semibold mb-1">
              <Wand2 className="w-3.5 h-3.5" />
              <span>AI Pedagogical Assistant • Trường Tiểu học Lê Kim Lăng</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
              Sáng Tạo Kịch Bản Sư Phạm & Bài Giảng Mini
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              AI tự động thiết kế kịch bản xử lý tình huống lớp học chân thực, giúp giáo viên ứng dụng tự nhiên 10 câu khẩu hiệu tiếng Anh.
            </p>
          </div>
        </div>
      </div>

      {/* Generator Form & Result Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Configuration Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Thiết Lập Yêu Cầu Kịch Bản</span>
            </h3>

            {/* Phrase select */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Câu khẩu hiệu cốt lõi:
              </label>
              <select
                value={selectedPhrase.id}
                onChange={(e) => {
                  const found = CLASSROOM_PHRASES.find(p => p.id === Number(e.target.value));
                  if (found) setSelectedPhrase(found);
                }}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
              >
                {CLASSROOM_PHRASES.map((p) => (
                  <option key={p.id} value={p.id}>
                    #{p.id}: {p.phrase} - {p.vietnamese}
                  </option>
                ))}
              </select>
            </div>

            {/* Grade select */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Khối lớp áp dụng:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Khối 1', 'Khối 2', 'Khối 3', 'Khối 4', 'Khối 5', 'Toàn trường'].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setSelectedGrade(g)}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all ${
                      selectedGrade === g
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Situational Context */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Ngữ cảnh lớp học cụ thể:
              </label>
              <textarea
                rows={3}
                value={customContext}
                onChange={(e) => setCustomContext(e.target.value)}
                placeholder="Mô tả tình huống thực tế hoặc chọn gợi ý bên dưới (ví dụ: giờ sinh hoạt lớp, học sinh tranh cãi, lúc chuẩn bị vào lớp...)"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            {/* Quick Presets */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                Gợi ý tình huống nhanh tại trường Lê Kim Lăng:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {presetSituations.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCustomContext(item)}
                    className="text-[11px] px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-emerald-100 hover:text-emerald-900 text-slate-600 border border-slate-200 transition-colors text-left"
                  >
                    + {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Wand2 className="w-4 h-4" />
                <span>{isGenerating ? 'AI đang tạo kịch bản sư phạm...' : 'Tạo Kịch Bản Sư Phạm Với AI'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Output Column - STRICTLY FOLLOWING OUTPUT FORMAT 3 */}
        <div className="lg:col-span-7 space-y-4">
          {scenarioResult ? (
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-emerald-200 shadow-md space-y-5 animate-in fade-in duration-300">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <School className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-base">
                      Kịch Bản Ứng Dụng (AI Generated)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Áp dụng cho {selectedGrade} • Trường Tiểu học Lê Kim Lăng
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSpeakPhrase}
                    className="p-2 rounded-xl text-emerald-700 hover:bg-emerald-50 border border-emerald-200 transition-colors"
                    title="Nghe câu khẩu hiệu"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Đã sao chép!' : 'Sao chép'}</span>
                  </button>
                </div>
              </div>

              {/* Phrase Banner */}
              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Khẩu hiệu mục tiêu:</span>
                  <p className="text-base sm:text-lg font-extrabold text-emerald-950">
                    "{selectedPhrase.phrase}"
                  </p>
                  <p className="text-xs text-emerald-800">
                    {selectedPhrase.vietnamese}
                  </p>
                </div>
                <span className="font-mono text-xs text-emerald-800 bg-white px-2.5 py-1 rounded-lg border border-emerald-200">
                  {selectedPhrase.ipa}
                </span>
              </div>

              {/* 3 MANDATED OUTPUT FIELDS */}
              <div className="space-y-4">
                {/* Field 1: Tình huống */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <School className="w-4 h-4 text-emerald-600" />
                    <span>Tình huống:</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                    {scenarioResult.situation}
                  </p>
                </div>

                {/* Field 2: Cách dùng */}
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Cách dùng (Hướng dẫn giáo viên thực hiện):</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-amber-950 leading-relaxed font-medium">
                    {scenarioResult.howToUse}
                  </p>
                </div>

                {/* Field 3: Mở rộng */}
                <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 space-y-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-teal-900 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-teal-600" />
                    <span>Mở rộng (Câu hỏi gợi mở cho học sinh):</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-teal-950 leading-relaxed font-medium">
                    {scenarioResult.followUp}
                  </p>
                </div>

                {/* Field 4: Mẹo sư phạm */}
                {scenarioResult.tips && (
                  <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-1">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                      <Lightbulb className="w-4 h-4 text-blue-600" />
                      <span>Mẹo Sư Phạm & Tâm Lý Tiểu Học:</span>
                    </h4>
                    <p className="text-xs text-blue-950 leading-relaxed">
                      {scenarioResult.tips}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-10 border border-dashed border-slate-300 text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
                <Wand2 className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-800 text-base">
                Chưa có kịch bản được tạo
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
                Chọn câu khẩu hiệu và ngữ cảnh ở cột bên trái, sau đó nhấn "Tạo Kịch Bản Sư Phạm Với AI" để hệ thống thiết kế bài học cho thầy cô.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
