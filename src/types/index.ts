export interface TeacherProfile {
  id: string;
  fullName: string;
  department: string; // Tổ sinh hoạt chuyên môn: "Tổ Chuyên Môn 1", "Tổ Chuyên Môn 2", "Tổ Chuyên Môn 3", "Tổ Chuyên Môn 4", "Tổ Chuyên Môn 5", "Tổ Bộ Môn", "Tổ Văn Phòng & BGH"
  email: string;
  gradeLevel: string; // "Khối 1", "Khối 2", "Khối 3", "Khối 4", "Khối 5", "Toàn trường"
  subject: string; // "Giáo viên Chủ nhiệm", "Tiếng Việt / Toán", "Mỹ thuật", "Âm nhạc", "Thể dục", "Tin học", "Khác"
  points: number;
  completedPhraseIds: number[];
  speakingScores: Record<number, number>; // phraseId -> highest score (0-100)
  listeningCompleted: Record<number, boolean>;
  quizCompleted: Record<number, boolean>;
  badges: string[];
  lastPracticeDate: string;
  practiceDates: string[]; // Danh sách các ngày học (YYYY-MM-DD) để theo dõi chuyên cần
  sessionCount: number;    // Tổng số lượt/buổi vào rèn luyện
  notes?: string;          // Ghi chú chuyên cần từ tổ trưởng / BGH
}

export interface ClassroomPhrase {
  id: number;
  phrase: string;
  vietnamese: string;
  ipa: string;
  category: 'Văn hóa & Đạo đức' | 'Nề nếp lớp học' | 'Tương tác & Ngôn ngữ' | 'Khích lệ & Ý chí';
  intonation: string;
  toneDescription: string;
  pedagogicalMeaning: string;
  pronunciationTips: {
    rule: string;
    details: string;
    focusWords: string[];
  }[];
  tprGestures: string;
  leKimLangScenario: {
    situation: string;
    teacherAction: string;
    studentReaction: string;
    extensionPrompt: string;
    pedagogicalTip: string;
  };
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface SpeakingFeedback {
  rating: 'Excellent' | 'Good' | 'Keep it up';
  feedback: string;
  correction: string;
  points: number;
  encouragement: string;
}

export interface GeneratedScenario {
  situation: string;
  howToUse: string;
  followUp: string;
  tips: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'mentor';
  text: string;
  timestamp: string;
}
