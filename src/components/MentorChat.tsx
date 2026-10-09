import React, { useState, useRef, useEffect } from 'react';
import { TeacherProfile, ChatMessage } from '../types';
import { SpeechService } from '../utils/speech';
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  School, 
  Volume2, 
  User, 
  RotateCcw,
  Bot
} from 'lucide-react';

interface MentorChatProps {
  profile: TeacherProfile;
}

export const MentorChat: React.FC<MentorChatProps> = ({ profile }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'mentor',
      text: `Xin chào thầy/cô ${profile.fullName} (${profile.department || 'Tổ chuyên môn'})! Tôi là Trợ lý Sư phạm AI thuộc hệ thống LKL10caugiaotiepTAthang11 Trường Tiểu học Lê Kim Lăng. Thầy cô đang gặp băn khoăn gì về cách phát âm, ngữ điệu hay kịch bản ứng dụng 10 câu khẩu hiệu Tháng 11 vào lớp học của mình không ạ?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const quickQuestions = [
    'Cách nhắc học sinh lớp 1 giữ trật tự nhẹ nhàng mà hiệu quả?',
    'Mẹo phát âm nối âm trong câu "Never give up" và "Help each other"?',
    'Khi học sinh tranh giành đồ dùng thì nên dùng câu nào và làm cử chỉ gì?',
    'Cách kết hợp vỗ tay (Clap chant) với câu "Do your best"?'
  ];

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/mentor-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          teacherName: profile.fullName,
          currentPhrase: ''
        })
      });

      const data = await response.json();
      const mentorReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'mentor',
        text: data.reply || 'LKL-Mentor luôn sẵn sàng đồng hành cùng thầy cô!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, mentorReply]);
    } catch (err) {
      console.error(err);
      const fallbackReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'mentor',
        text: `Thầy/cô ${profile.fullName} hãy luôn nhớ: Đối với học sinh tiểu học Lê Kim Lăng, một nụ cười tươi và cử chỉ tay (TPR) dứt khoát có sức mạnh hơn vạn lời nói. Hãy nói to, rõ ràng và kèm lời khích lệ ngay khi các em thực hiện đúng nhé!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackReply]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 pb-12 animate-in fade-in duration-300 max-w-4xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-1">
            <School className="w-3.5 h-3.5" />
            <span>Tư Vấn Sư Phạm 24/7 • Tiểu Học Lê Kim Lăng</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
            Hỏi Đáp Cùng LKL-Mentor
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Chuyên gia hỗ trợ thầy cô xử lý tình huống lớp học, phương pháp TPR và phát âm khẩu hiệu tiếng Anh.
          </p>
        </div>
      </div>

      {/* Chat Window */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[580px] overflow-hidden">
        {/* Messages list */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/50">
          {messages.map((msg) => {
            const isMentor = msg.sender === 'mentor';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] sm:max-w-[78%] ${
                  isMentor ? 'mr-auto' : 'ml-auto flex-row-reverse'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs shrink-0 font-bold ${
                  isMentor
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-amber-400 text-slate-900 shadow-xs'
                }`}>
                  {isMentor ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                <div className="space-y-1">
                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isMentor
                        ? 'bg-white text-slate-800 border border-slate-200 shadow-xs'
                        : 'bg-emerald-700 text-white shadow-sm'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                  </div>

                  <div className={`flex items-center gap-2 text-[10px] text-slate-400 px-1 ${
                    isMentor ? 'justify-start' : 'justify-end'
                  }`}>
                    <span>{msg.timestamp}</span>
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 max-w-[80%] mr-auto items-center">
              <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs shrink-0">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs text-xs text-slate-500">
                LKL-Mentor đang suy nghĩ lời khuyên sư phạm cho thầy cô...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-slate-100/70 border-t border-slate-200 flex gap-2 overflow-x-auto no-scrollbar">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(q)}
              disabled={isLoading}
              className="text-[11px] whitespace-nowrap px-3 py-1.5 rounded-full bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-200 transition-colors shrink-0 disabled:opacity-50"
            >
              💡 {q}
            </button>
          ))}
        </div>

        {/* Input box */}
        <div className="p-3.5 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập câu hỏi hoặc tình huống cần tư vấn..."
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white"
            />

            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2.5 sm:px-5 sm:py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs sm:text-sm shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Gửi</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
