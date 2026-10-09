import React, { useState } from 'react';
import { TeacherProfile } from './types';
import { CLASSROOM_PHRASES, BADGE_DEFINITIONS } from './data/phrases';
import { 
  getStoredUserId, 
  loadProfile, 
  saveProfile, 
  createOrLoginTeacher 
} from './utils/storage';
import { Header } from './components/Header';
import { LoginModal } from './components/LoginModal';
import { DashboardView } from './components/DashboardView';
import { TeacherAttendanceTracker } from './components/TeacherAttendanceTracker';
import { EducationalGames } from './components/EducationalGames';
import { ClassroomTvMode } from './components/ClassroomTvMode';
import { DocumentExportModal } from './components/DocumentExportModal';
import { PhrasesList } from './components/PhrasesList';
import { LessonDetailModal } from './components/LessonDetailModal';
import { SpeakingLab } from './components/SpeakingLab';
import { ScenarioGenerator } from './components/ScenarioGenerator';
import { InteractiveQuiz } from './components/InteractiveQuiz';
import { MentorChat } from './components/MentorChat';
import { Sparkles } from 'lucide-react';

export default function App() {
  const [profile, setProfile] = useState<TeacherProfile>(() => {
    const storedId = getStoredUserId();
    if (storedId) {
      const loaded = loadProfile(storedId);
      if (loaded) return loaded;
    }
    // Default initial profile
    return createOrLoginTeacher(
      'Cô Nguyễn Thị Thương',
      'Tổ Chuyên Môn 2',
      'thuongnguyenthi11179@gmail.com',
      'Khối 2',
      'Giáo viên Chủ nhiệm'
    );
  });

  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [selectedPhraseId, setSelectedPhraseId] = useState<number>(1);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isTvModeOpen, setIsTvModeOpen] = useState<boolean>(false);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleSelectPhraseForDetail = (phraseId: number) => {
    setSelectedPhraseId(phraseId);
    setIsLessonModalOpen(true);
  };

  const handleStartSpeaking = (phraseId: number) => {
    setSelectedPhraseId(phraseId);
    setCurrentTab('speaking');
  };

  const handleMarkListeningComplete = (phraseId: number) => {
    setProfile(prev => {
      const isFirstTime = !prev.listeningCompleted[phraseId];
      const updatedListening = { ...prev.listeningCompleted, [phraseId]: true };
      
      let updatedCompleted = [...prev.completedPhraseIds];
      if (prev.speakingScores[phraseId] && !updatedCompleted.includes(phraseId)) {
        updatedCompleted.push(phraseId);
      }

      const addedPoints = isFirstTime ? 15 : 0;
      const newPoints = prev.points + addedPoints;

      const newBadges = [...prev.badges];
      BADGE_DEFINITIONS.forEach(b => {
        if (newPoints >= b.minPoints && !newBadges.includes(b.id)) {
          newBadges.push(b.id);
          showToast(`Chúc mừng! Thầy/Cô đã đạt huy hiệu "${b.title}" ${b.icon}`);
        }
      });

      const updated: TeacherProfile = {
        ...prev,
        listeningCompleted: updatedListening,
        completedPhraseIds: updatedCompleted,
        points: newPoints,
        badges: newBadges
      };

      saveProfile(updated);
      if (isFirstTime) {
        showToast(`+15 điểm sư phạm! Đã hoàn thành nghe câu #${phraseId}.`);
      }
      return updated;
    });
  };

  const handleUpdateScore = (phraseId: number, score: number, pointsBonus: number) => {
    setProfile(prev => {
      const currentHighest = prev.speakingScores[phraseId] || 0;
      const newHighest = Math.max(currentHighest, score);
      const updatedScores = { ...prev.speakingScores, [phraseId]: newHighest };

      let updatedCompleted = [...prev.completedPhraseIds];
      if (score >= 70 && !updatedCompleted.includes(phraseId)) {
        updatedCompleted.push(phraseId);
      }

      const newPoints = prev.points + pointsBonus;

      const newBadges = [...prev.badges];
      BADGE_DEFINITIONS.forEach(b => {
        if (newPoints >= b.minPoints && !newBadges.includes(b.id)) {
          newBadges.push(b.id);
          showToast(`Chúc mừng! Thầy/Cô đã đạt huy hiệu "${b.title}" ${b.icon}`);
        }
      });

      const updated: TeacherProfile = {
        ...prev,
        speakingScores: updatedScores,
        completedPhraseIds: updatedCompleted,
        points: newPoints,
        badges: newBadges
      };

      saveProfile(updated);
      showToast(`+${pointsBonus} điểm! Đã ghi nhận kết quả luyện nói câu #${phraseId}.`);
      return updated;
    });
  };

  const handleAddQuizPoints = (points: number, phraseId: number) => {
    setProfile(prev => {
      const updatedQuiz = { ...prev.quizCompleted, [phraseId]: true };
      const newPoints = prev.points + points;

      const newBadges = [...prev.badges];
      BADGE_DEFINITIONS.forEach(b => {
        if (newPoints >= b.minPoints && !newBadges.includes(b.id)) {
          newBadges.push(b.id);
          showToast(`Chúc mừng! Thầy/Cô đã đạt huy hiệu "${b.title}" ${b.icon}`);
        }
      });

      const updated: TeacherProfile = {
        ...prev,
        quizCompleted: updatedQuiz,
        points: newPoints,
        badges: newBadges
      };

      saveProfile(updated);
      showToast(`+${points} điểm! Câu trả lời chính xác.`);
      return updated;
    });
  };

  const handleAddGamePoints = (pointsBonus: number, reason: string) => {
    setProfile(prev => {
      const newPoints = prev.points + pointsBonus;
      const newBadges = [...prev.badges];
      BADGE_DEFINITIONS.forEach(b => {
        if (newPoints >= b.minPoints && !newBadges.includes(b.id)) {
          newBadges.push(b.id);
          showToast(`Chúc mừng! Thầy/Cô đã đạt huy hiệu "${b.title}" ${b.icon}`);
        }
      });

      const updated: TeacherProfile = {
        ...prev,
        points: newPoints,
        badges: newBadges
      };

      saveProfile(updated);
      showToast(`+${pointsBonus} điểm! ${reason}`);
      return updated;
    });
  };

  const handleSaveLogin = (
    fullName: string, 
    department: string, 
    email: string, 
    gradeLevel: string, 
    subject: string
  ) => {
    const newOrExisting = createOrLoginTeacher(fullName, department, email, gradeLevel, subject);
    setProfile(newOrExisting);
    setIsLoginModalOpen(false);
    showToast(`Chào mừng thầy/cô ${newOrExisting.fullName} (${newOrExisting.department}) đã đăng nhập!`);
  };

  const handleSwitchProfile = (targetProfile: TeacherProfile) => {
    setProfile(targetProfile);
    setIsLoginModalOpen(false);
    showToast(`Đã chuyển sang tài khoản giáo viên: ${targetProfile.fullName} (${targetProfile.department})`);
  };

  const currentPhraseObj = CLASSROOM_PHRASES.find(p => p.id === selectedPhraseId) || CLASSROOM_PHRASES[0];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* App Header */}
      <Header
        profile={profile}
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onOpenSwitchUser={() => setIsLoginModalOpen(true)}
        onOpenTvMode={() => setIsTvModeOpen(true)}
        onOpenDocumentModal={() => setIsDocumentModalOpen(true)}
      />

      {/* Main Workspace Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6">
        {currentTab === 'dashboard' && (
          <DashboardView
            profile={profile}
            onSelectPhrase={handleSelectPhraseForDetail}
            onNavigateToTab={setCurrentTab}
            onOpenTvMode={() => setIsTvModeOpen(true)}
            onOpenDocumentModal={() => setIsDocumentModalOpen(true)}
          />
        )}

        {currentTab === 'attendance' && (
          <TeacherAttendanceTracker
            currentProfile={profile}
            onSwitchProfile={handleSwitchProfile}
            onNavigateToTab={setCurrentTab}
            onShowToast={showToast}
          />
        )}

        {currentTab === 'games' && (
          <EducationalGames
            profile={profile}
            onAddGamePoints={handleAddGamePoints}
          />
        )}

        {currentTab === 'phrases' && (
          <PhrasesList
            profile={profile}
            onSelectPhrase={handleSelectPhraseForDetail}
            onStartSpeaking={handleStartSpeaking}
          />
        )}

        {currentTab === 'speaking' && (
          <SpeakingLab
            profile={profile}
            selectedPhraseId={selectedPhraseId}
            onSelectPhrase={setSelectedPhraseId}
            onUpdateScore={handleUpdateScore}
          />
        )}

        {currentTab === 'quiz' && (
          <InteractiveQuiz
            profile={profile}
            onAddPoints={handleAddQuizPoints}
          />
        )}

        {currentTab === 'scenario' && (
          <ScenarioGenerator
            profile={profile}
          />
        )}

        {currentTab === 'chat' && (
          <MentorChat
            profile={profile}
          />
        )}
      </main>

      {/* Detail Lesson Modal */}
      <LessonDetailModal
        phrase={currentPhraseObj}
        isOpen={isLessonModalOpen}
        onClose={() => setIsLessonModalOpen(false)}
        onStartSpeaking={handleStartSpeaking}
        onMarkListeningComplete={handleMarkListeningComplete}
      />

      {/* Login / Profile Switcher Modal */}
      <LoginModal
        currentProfile={profile}
        isOpen={isLoginModalOpen}
        onSave={handleSaveLogin}
        onSelectExisting={handleSwitchProfile}
        onClose={() => setIsLoginModalOpen(false)}
      />

      {/* Smart TV Classroom Mode */}
      <ClassroomTvMode
        isOpen={isTvModeOpen}
        onClose={() => setIsTvModeOpen(false)}
        initialPhraseId={selectedPhraseId}
      />

      {/* Document & Slide Export Modal */}
      <DocumentExportModal
        isOpen={isDocumentModalOpen}
        onClose={() => setIsDocumentModalOpen(false)}
        profile={profile}
        onShowToast={showToast}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900 text-white text-xs sm:text-sm font-semibold shadow-2xl border border-slate-700 animate-in slide-in-from-bottom-3 duration-200">
          <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 mt-8">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="font-bold text-slate-700 text-sm">
            LKL10caugiaotiepTAthang11 • Trường Tiểu học Lê Kim Lăng
          </p>
          <p className="text-xs text-slate-500">
            Hệ thống rèn luyện 10 câu giao tiếp tiếng Anh sư phạm Tháng 11 & Theo dõi chuyên cần giáo viên theo Tổ sinh hoạt chuyên môn.
          </p>
          <p className="text-[11px] text-slate-400">
            Ứng dụng phương pháp phản xạ toàn thân TPR & Thiết kế bài giảng tiểu học tích cực.
          </p>
        </div>
      </footer>
    </div>
  );
}
