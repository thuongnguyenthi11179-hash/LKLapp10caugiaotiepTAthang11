import { TeacherProfile } from '../types';
import { CLASSROOM_PHRASES } from '../data/phrases';

const STORAGE_KEY_PREFIX = 'lkl10_teacher_';
const LAST_USER_KEY = 'lkl10_last_user_id';
const ALL_TEACHERS_INDEX_KEY = 'lkl10_all_teachers_registry';

export const DEPARTMENTS = [
  'Tổ Chuyên Môn 1',
  'Tổ Chuyên Môn 2',
  'Tổ Chuyên Môn 3',
  'Tổ Chuyên Môn 4',
  'Tổ Chuyên Môn 5',
  'Tổ Bộ Môn (Anh - Tin - Nhạc - Họa - Thể dục)',
  'Tổ Văn Phòng & Ban Giám Hiệu'
] as const;

export type DepartmentType = typeof DEPARTMENTS[number] | string;

// Initial seed teachers representing Le Kim Lang Primary School
const INITIAL_SEED_TEACHERS: TeacherProfile[] = [
  {
    id: 'gv_nguyenthithuong_to2',
    fullName: 'Cô Nguyễn Thị Thương',
    department: 'Tổ Chuyên Môn 2',
    email: 'thuongnguyenthi11179@gmail.com',
    gradeLevel: 'Khối 2',
    subject: 'Giáo viên Chủ nhiệm',
    points: 275,
    completedPhraseIds: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    speakingScores: { 1: 95, 2: 90, 3: 88, 4: 92, 5: 85, 6: 90, 7: 85, 8: 92, 9: 88 },
    listeningCompleted: { 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true, 9: true },
    quizCompleted: { 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true, 9: true },
    badges: ['first_step', 'listener', 'pronunciation_pro', 'speedy_learner'],
    lastPracticeDate: new Date().toISOString(),
    practiceDates: [
      getPastDateString(0),
      getPastDateString(1),
      getPastDateString(2),
      getPastDateString(4),
      getPastDateString(5),
      getPastDateString(7)
    ],
    sessionCount: 14,
    notes: 'Tổ trưởng Tổ 2 - Rất tích cực rèn luyện và ứng dụng trên lớp.'
  },
  {
    id: 'gv_nguyenthithu_to1',
    fullName: 'Cô Nguyễn Thị Thu',
    department: 'Tổ Chuyên Môn 1',
    email: 'thunguyen.lkl@gmail.com',
    gradeLevel: 'Khối 1',
    subject: 'Giáo viên Chủ nhiệm',
    points: 215,
    completedPhraseIds: [1, 2, 3, 4, 5, 6, 8],
    speakingScores: { 1: 90, 2: 85, 3: 80, 4: 85, 5: 80, 6: 88, 8: 85 },
    listeningCompleted: { 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 8: true },
    quizCompleted: { 1: true, 2: true, 3: true, 4: true, 5: true },
    badges: ['first_step', 'listener', 'pronunciation_pro'],
    lastPracticeDate: getPastDateTime(0, 3),
    practiceDates: [
      getPastDateString(0),
      getPastDateString(1),
      getPastDateString(3),
      getPastDateString(6)
    ],
    sessionCount: 9,
    notes: 'Ứng dụng tốt câu Be kind to everyone và Listen carefully.'
  },
  {
    id: 'gv_levanhai_to1',
    fullName: 'Thầy Lê Văn Hải',
    department: 'Tổ Chuyên Môn 1',
    email: 'haile.lkl@gmail.com',
    gradeLevel: 'Khối 1',
    subject: 'Giáo viên Chủ nhiệm',
    points: 145,
    completedPhraseIds: [1, 2, 3, 5, 8],
    speakingScores: { 1: 85, 2: 80, 3: 82, 5: 78, 8: 80 },
    listeningCompleted: { 1: true, 2: true, 3: true, 5: true, 8: true },
    quizCompleted: { 1: true, 2: true, 3: true },
    badges: ['first_step', 'listener'],
    lastPracticeDate: getPastDateTime(1, 5),
    practiceDates: [
      getPastDateString(1),
      getPastDateString(2),
      getPastDateString(5)
    ],
    sessionCount: 6,
    notes: 'Tiến bộ nhanh trong phần luyện âm đuôi.'
  },
  {
    id: 'gv_dohonganh_to2',
    fullName: 'Cô Đỗ Hồng Ánh',
    department: 'Tổ Chuyên Môn 2',
    email: 'honganh.lkl@gmail.com',
    gradeLevel: 'Khối 2',
    subject: 'Giáo viên Chủ nhiệm',
    points: 175,
    completedPhraseIds: [1, 2, 3, 6, 7, 8],
    speakingScores: { 1: 88, 2: 82, 3: 85, 6: 80, 7: 85, 8: 90 },
    listeningCompleted: { 1: true, 2: true, 3: true, 6: true, 7: true, 8: true },
    quizCompleted: { 1: true, 2: true, 3: true, 6: true },
    badges: ['first_step', 'listener', 'pronunciation_pro'],
    lastPracticeDate: getPastDateTime(0, 1),
    practiceDates: [
      getPastDateString(0),
      getPastDateString(2),
      getPastDateString(4),
      getPastDateString(5)
    ],
    sessionCount: 8,
    notes: 'Học sinh hưởng ứng nhiệt tình cử chỉ TPR.'
  },
  {
    id: 'gv_tranvantoan_to3',
    fullName: 'Thầy Trần Văn Toàn',
    department: 'Tổ Chuyên Môn 3',
    email: 'toantran.lkl@gmail.com',
    gradeLevel: 'Khối 3',
    subject: 'Giáo viên Chủ nhiệm',
    points: 195,
    completedPhraseIds: [1, 2, 3, 4, 5, 9, 10],
    speakingScores: { 1: 92, 2: 85, 3: 80, 4: 90, 5: 85, 9: 88, 10: 82 },
    listeningCompleted: { 1: true, 2: true, 3: true, 4: true, 5: true, 9: true, 10: true },
    quizCompleted: { 1: true, 2: true, 3: true, 4: true, 9: true },
    badges: ['first_step', 'listener', 'pronunciation_pro'],
    lastPracticeDate: getPastDateTime(0, 6),
    practiceDates: [
      getPastDateString(0),
      getPastDateString(1),
      getPastDateString(3),
      getPastDateString(4),
      getPastDateString(7)
    ],
    sessionCount: 11,
    notes: 'Tổ trưởng Tổ 3 - Đạt chuẩn phát âm câu Work together happily.'
  },
  {
    id: 'gv_buibichphuong_to3',
    fullName: 'Cô Bùi Bích Phương',
    department: 'Tổ Chuyên Môn 3',
    email: 'phuongbui.lkl@gmail.com',
    gradeLevel: 'Khối 3',
    subject: 'Giáo viên Chủ nhiệm',
    points: 110,
    completedPhraseIds: [1, 2, 4, 9],
    speakingScores: { 1: 82, 2: 80, 4: 75, 9: 80 },
    listeningCompleted: { 1: true, 2: true, 4: true, 9: true },
    quizCompleted: { 1: true, 2: true },
    badges: ['first_step', 'listener'],
    lastPracticeDate: getPastDateTime(2, 4),
    practiceDates: [
      getPastDateString(2),
      getPastDateString(4),
      getPastDateString(8)
    ],
    sessionCount: 5,
    notes: 'Cần duy trì đều đặn thêm 2 buổi/tuần.'
  },
  {
    id: 'gv_phamthanhhang_to4',
    fullName: 'Cô Phạm Thanh Hằng',
    department: 'Tổ Chuyên Môn 4',
    email: 'hangpham.lkl@gmail.com',
    gradeLevel: 'Khối 4',
    subject: 'Giáo viên Chủ nhiệm',
    points: 230,
    completedPhraseIds: [1, 2, 3, 4, 5, 6, 8, 10],
    speakingScores: { 1: 95, 2: 90, 3: 85, 4: 88, 5: 85, 6: 82, 8: 92, 10: 90 },
    listeningCompleted: { 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 8: true, 10: true },
    quizCompleted: { 1: true, 2: true, 3: true, 4: true, 5: true, 8: true },
    badges: ['first_step', 'listener', 'pronunciation_pro', 'speedy_learner'],
    lastPracticeDate: getPastDateTime(0, 2),
    practiceDates: [
      getPastDateString(0),
      getPastDateString(1),
      getPastDateString(2),
      getPastDateString(5),
      getPastDateString(6)
    ],
    sessionCount: 12,
    notes: 'Tổ trưởng Tổ 4 - Tạo nhiều kịch bản AI thú vị cho lớp 4.'
  },
  {
    id: 'gv_hoangdinhkhang_to4',
    fullName: 'Thầy Hoàng Đình Khang',
    department: 'Tổ Chuyên Môn 4',
    email: 'khanghoang.lkl@gmail.com',
    gradeLevel: 'Khối 4',
    subject: 'Giáo viên Chủ nhiệm',
    points: 75,
    completedPhraseIds: [1, 2, 6],
    speakingScores: { 1: 78, 2: 75, 6: 72 },
    listeningCompleted: { 1: true, 2: true, 6: true },
    quizCompleted: { 1: true },
    badges: ['first_step'],
    lastPracticeDate: getPastDateTime(4, 8),
    practiceDates: [
      getPastDateString(4),
      getPastDateString(9)
    ],
    sessionCount: 3,
    notes: 'Đang bận công tác Đội, cần động viên học chuyên cần hơn.'
  },
  {
    id: 'gv_vungocdiep_to5',
    fullName: 'Cô Vũ Ngọc Diệp',
    department: 'Tổ Chuyên Môn 5',
    email: 'diepvu.lkl@gmail.com',
    gradeLevel: 'Khối 5',
    subject: 'Giáo viên Chủ nhiệm',
    points: 310,
    completedPhraseIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    speakingScores: { 1: 98, 2: 95, 3: 92, 4: 95, 5: 90, 6: 92, 7: 90, 8: 96, 9: 94, 10: 95 },
    listeningCompleted: { 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true, 9: true, 10: true },
    quizCompleted: { 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true, 9: true, 10: true },
    badges: ['first_step', 'listener', 'pronunciation_pro', 'speedy_learner', 'master'],
    lastPracticeDate: getPastDateTime(0, 1),
    practiceDates: [
      getPastDateString(0),
      getPastDateString(1),
      getPastDateString(2),
      getPastDateString(3),
      getPastDateString(5),
      getPastDateString(6),
      getPastDateString(7)
    ],
    sessionCount: 18,
    notes: 'Tổ trưởng Tổ 5 - Đạt điểm tuyệt đối 10/10 câu khẩu hiệu!'
  },
  {
    id: 'gv_dangquocbao_to5',
    fullName: 'Thầy Đặng Quốc Bảo',
    department: 'Tổ Chuyên Môn 5',
    email: 'baodang.lkl@gmail.com',
    gradeLevel: 'Khối 5',
    subject: 'Giáo viên Chủ nhiệm',
    points: 155,
    completedPhraseIds: [1, 2, 3, 5, 7, 9],
    speakingScores: { 1: 85, 2: 82, 3: 80, 5: 85, 7: 80, 9: 86 },
    listeningCompleted: { 1: true, 2: true, 3: true, 5: true, 7: true, 9: true },
    quizCompleted: { 1: true, 2: true, 3: true },
    badges: ['first_step', 'listener', 'pronunciation_pro'],
    lastPracticeDate: getPastDateTime(1, 4),
    practiceDates: [
      getPastDateString(1),
      getPastDateString(3),
      getPastDateString(5),
      getPastDateString(8)
    ],
    sessionCount: 7,
    notes: 'Lớp 5 rất thích câu Keep your classroom clean.'
  },
  {
    id: 'gv_lemaianh_tobomon',
    fullName: 'Cô Lê Mai Anh',
    department: 'Tổ Bộ Môn (Anh - Tin - Nhạc - Họa - Thể dục)',
    email: 'maianhle.lkl@gmail.com',
    gradeLevel: 'Toàn trường',
    subject: 'Tiếng Anh Tiểu học',
    points: 340,
    completedPhraseIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    speakingScores: { 1: 100, 2: 98, 3: 98, 4: 98, 5: 96, 6: 98, 7: 95, 8: 100, 9: 98, 10: 98 },
    listeningCompleted: { 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true, 9: true, 10: true },
    quizCompleted: { 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true, 9: true, 10: true },
    badges: ['first_step', 'listener', 'pronunciation_pro', 'speedy_learner', 'master'],
    lastPracticeDate: getPastDateTime(0, 1),
    practiceDates: [
      getPastDateString(0),
      getPastDateString(1),
      getPastDateString(2),
      getPastDateString(3),
      getPastDateString(4),
      getPastDateString(5),
      getPastDateString(6),
      getPastDateString(7)
    ],
    sessionCount: 20,
    notes: 'Giáo viên Tiếng Anh - Hỗ trợ hướng dẫn các đồng nghiệp trong trường.'
  },
  {
    id: 'gv_nguyentuankiet_tobomon',
    fullName: 'Thầy Nguyễn Tuấn Kiệt',
    department: 'Tổ Bộ Môn (Anh - Tin - Nhạc - Họa - Thể dục)',
    email: 'kietnguyen.lkl@gmail.com',
    gradeLevel: 'Toàn trường',
    subject: 'Tin học & GD Thể chất',
    points: 170,
    completedPhraseIds: [1, 2, 3, 5, 8, 10],
    speakingScores: { 1: 88, 2: 85, 3: 82, 5: 80, 8: 92, 10: 85 },
    listeningCompleted: { 1: true, 2: true, 3: true, 5: true, 8: true, 10: true },
    quizCompleted: { 1: true, 2: true, 3: true, 8: true },
    badges: ['first_step', 'listener', 'pronunciation_pro'],
    lastPracticeDate: getPastDateTime(0, 4),
    practiceDates: [
      getPastDateString(0),
      getPastDateString(2),
      getPastDateString(4),
      getPastDateString(6)
    ],
    sessionCount: 8,
    notes: 'Ứng dụng xuất sắc khẩu hiệu Line up quietly trong tiết thể dục.'
  },
  {
    id: 'gv_bgh_lekimlang',
    fullName: 'Thầy Lê Kim Lăng (BGH)',
    department: 'Tổ Văn Phòng & Ban Giám Hiệu',
    email: 'bgh.lekimlang@danang.gov.vn',
    gradeLevel: 'Toàn trường',
    subject: 'Ban Giám Hiệu',
    points: 260,
    completedPhraseIds: [1, 2, 3, 4, 5, 6, 8, 9, 10],
    speakingScores: { 1: 96, 2: 92, 3: 90, 4: 92, 5: 90, 6: 92, 8: 95, 9: 92, 10: 90 },
    listeningCompleted: { 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 8: true, 9: true, 10: true },
    quizCompleted: { 1: true, 2: true, 3: true, 4: true, 5: true, 8: true, 9: true, 10: true },
    badges: ['first_step', 'listener', 'pronunciation_pro', 'speedy_learner'],
    lastPracticeDate: getPastDateTime(0, 2),
    practiceDates: [
      getPastDateString(0),
      getPastDateString(1),
      getPastDateString(3),
      getPastDateString(4),
      getPastDateString(6)
    ],
    sessionCount: 13,
    notes: 'Gương mẫu rèn luyện tiếng Anh sư phạm toàn diện.'
  }
];

// Helper to format past dates (YYYY-MM-DD)
function getPastDateString(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
}

// Helper to format ISO strings with hours ago
function getPastDateTime(daysAgo: number, hoursAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(d.getHours() - hoursAgo);
  return d.toISOString();
}

/**
 * Get all teachers from localStorage, initializing with seed data if empty
 */
export function getAllTeachers(): TeacherProfile[] {
  if (typeof window === 'undefined') return INITIAL_SEED_TEACHERS;
  
  const rawIndex = localStorage.getItem(ALL_TEACHERS_INDEX_KEY);
  if (!rawIndex) {
    // Seed initial data
    try {
      localStorage.setItem(ALL_TEACHERS_INDEX_KEY, JSON.stringify(INITIAL_SEED_TEACHERS.map(t => t.id)));
      INITIAL_SEED_TEACHERS.forEach(t => {
        localStorage.setItem(STORAGE_KEY_PREFIX + t.id, JSON.stringify(t));
      });
      return INITIAL_SEED_TEACHERS;
    } catch {
      return INITIAL_SEED_TEACHERS;
    }
  }

  try {
    const ids: string[] = JSON.parse(rawIndex);
    const teachers: TeacherProfile[] = [];
    
    ids.forEach(id => {
      const itemRaw = localStorage.getItem(STORAGE_KEY_PREFIX + id);
      if (itemRaw) {
        try {
          const parsed = JSON.parse(itemRaw);
          // Migration safety: ensure department and practiceDates exist
          if (!parsed.department) parsed.department = 'Tổ Chuyên Môn 2';
          if (!parsed.practiceDates) parsed.practiceDates = [getPastDateString(0)];
          if (typeof parsed.sessionCount !== 'number') parsed.sessionCount = parsed.practiceDates.length;
          teachers.push(parsed);
        } catch {}
      }
    });

    if (teachers.length === 0) {
      // Re-seed
      localStorage.setItem(ALL_TEACHERS_INDEX_KEY, JSON.stringify(INITIAL_SEED_TEACHERS.map(t => t.id)));
      INITIAL_SEED_TEACHERS.forEach(t => {
        localStorage.setItem(STORAGE_KEY_PREFIX + t.id, JSON.stringify(t));
      });
      return INITIAL_SEED_TEACHERS;
    }

    return teachers;
  } catch {
    return INITIAL_SEED_TEACHERS;
  }
}

export function getStoredUserId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(LAST_USER_KEY);
}

export function setStoredUserId(id: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LAST_USER_KEY, id);
}

export function clearStoredUser(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(LAST_USER_KEY);
}

export function loadProfile(userId: string): TeacherProfile | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(STORAGE_KEY_PREFIX + userId);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed.department) parsed.department = 'Tổ Chuyên Môn 2';
    if (!parsed.practiceDates) parsed.practiceDates = [getPastDateString(0)];
    if (typeof parsed.sessionCount !== 'number') parsed.sessionCount = parsed.practiceDates.length;
    return parsed;
  } catch {
    return null;
  }
}

export function saveProfile(profile: TeacherProfile): void {
  if (typeof window === 'undefined') return;
  
  // Make sure today's date is in practiceDates
  const today = getPastDateString(0);
  const dates = Array.isArray(profile.practiceDates) ? [...profile.practiceDates] : [];
  if (!dates.includes(today)) {
    dates.unshift(today);
  }
  const sessionCount = (profile.sessionCount || 0) + 1;

  const toSave: TeacherProfile = {
    ...profile,
    practiceDates: dates,
    sessionCount,
    lastPracticeDate: new Date().toISOString()
  };

  localStorage.setItem(STORAGE_KEY_PREFIX + toSave.id, JSON.stringify(toSave));
  setStoredUserId(toSave.id);

  // Update Registry
  try {
    const rawIndex = localStorage.getItem(ALL_TEACHERS_INDEX_KEY);
    let ids: string[] = rawIndex ? JSON.parse(rawIndex) : [];
    if (!ids.includes(toSave.id)) {
      ids.unshift(toSave.id);
      localStorage.setItem(ALL_TEACHERS_INDEX_KEY, JSON.stringify(ids));
    }
  } catch (err) {
    console.error('Error updating teacher registry:', err);
  }
}

/**
 * Register or login a teacher with full name & department
 */
export function createOrLoginTeacher(
  fullName: string,
  department: string = 'Tổ Chuyên Môn 2',
  email: string = '',
  gradeLevel: string = 'Khối 2',
  subject: string = 'Giáo viên Chủ nhiệm',
  notes?: string
): TeacherProfile {
  // Normalize clean safe ID
  const cleanName = fullName.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
  const safeId = email.trim().toLowerCase() || `gv_${cleanName || 'lekimlang'}`;

  const existing = loadProfile(safeId);
  if (existing) {
    const today = getPastDateString(0);
    const existingDates = existing.practiceDates || [];
    const updatedDates = existingDates.includes(today) ? existingDates : [today, ...existingDates];

    const updated: TeacherProfile = {
      ...existing,
      fullName: fullName.trim() || existing.fullName,
      department: department || existing.department || 'Tổ Chuyên Môn 2',
      email: email.trim() || existing.email,
      gradeLevel: gradeLevel || existing.gradeLevel,
      subject: subject || existing.subject,
      practiceDates: updatedDates,
      sessionCount: (existing.sessionCount || 0) + 1,
      lastPracticeDate: new Date().toISOString(),
      notes: notes !== undefined ? notes : existing.notes
    };
    saveProfile(updated);
    return updated;
  }

  // Create fresh profile
  const today = getPastDateString(0);
  const newProfile: TeacherProfile = {
    id: safeId,
    fullName: fullName.trim() || 'Thầy/Cô Giáo Lê Kim Lăng',
    department: department || 'Tổ Chuyên Môn 2',
    email: email.trim(),
    gradeLevel: gradeLevel || 'Khối 2',
    subject: subject || 'Giáo viên Chủ nhiệm',
    points: 25, // Initial bonus
    completedPhraseIds: [],
    speakingScores: {},
    listeningCompleted: {},
    quizCompleted: {},
    badges: ['first_step'],
    lastPracticeDate: new Date().toISOString(),
    practiceDates: [today],
    sessionCount: 1,
    notes: notes || 'Vừa đăng ký tham gia lớp học chuyên cần.'
  };

  saveProfile(newProfile);
  return newProfile;
}

/**
 * Mark a quick attendance record for a teacher today
 */
export function markTeacherAttendanceToday(teacherId: string): TeacherProfile | null {
  const profile = loadProfile(teacherId);
  if (!profile) return null;

  const today = getPastDateString(0);
  const dates = profile.practiceDates || [];
  const updatedDates = dates.includes(today) ? dates : [today, ...dates];

  const updated: TeacherProfile = {
    ...profile,
    practiceDates: updatedDates,
    sessionCount: (profile.sessionCount || 0) + 1,
    points: profile.points + 10, // Attendance daily bonus points
    lastPracticeDate: new Date().toISOString()
  };

  saveProfile(updated);
  return updated;
}

/**
 * Delete a teacher from local records
 */
export function deleteTeacherProfile(id: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY_PREFIX + id);
  try {
    const rawIndex = localStorage.getItem(ALL_TEACHERS_INDEX_KEY);
    if (rawIndex) {
      let ids: string[] = JSON.parse(rawIndex);
      ids = ids.filter(item => item !== id);
      localStorage.setItem(ALL_TEACHERS_INDEX_KEY, JSON.stringify(ids));
    }
  } catch {}
}

/**
 * Detailed analysis of teacher learning state
 */
export function getProfileAnalysis(profile: TeacherProfile) {
  const completedCount = profile.completedPhraseIds.length;
  const totalCount = CLASSROOM_PHRASES.length;

  const speakingKeys = Object.keys(profile.speakingScores);
  const listeningKeys = Object.keys(profile.listeningCompleted);
  
  let weakSkill = 'Speaking';
  if (speakingKeys.length > 0) {
    const avgSpeaking = speakingKeys.reduce((acc, k) => acc + (profile.speakingScores[Number(k)] || 0), 0) / speakingKeys.length;
    if (avgSpeaking >= 85 && listeningKeys.length < totalCount) {
      weakSkill = 'Listening (Ngữ điệu & Nối âm)';
    } else if (avgSpeaking >= 75) {
      weakSkill = 'Ứng dụng tình huống TPR';
    } else {
      weakSkill = 'Speaking (Âm đuôi & Nhấn âm)';
    }
  } else {
    weakSkill = 'Speaking (Luyện ghi âm giọng đọc)';
  }

  const nextIncomplete = CLASSROOM_PHRASES.find(p => !profile.completedPhraseIds.includes(p.id));
  const suggestedPhrase = nextIncomplete ? nextIncomplete.phrase : CLASSROOM_PHRASES[0].phrase;

  const attendanceDays = profile.practiceDates?.length || 1;
  const diligenceRating = 
    attendanceDays >= 6 ? 'Chuyên cần xuất sắc' :
    attendanceDays >= 3 ? 'Chuyên cần tốt' :
    'Cần nhắc nhở rèn luyện thêm';

  return {
    completedCount,
    totalCount,
    weakSkill,
    suggestedPhrase,
    progressPercentage: Math.round((completedCount / totalCount) * 100),
    attendanceDays,
    diligenceRating
  };
}

/**
 * Export teacher attendance table to CSV formatted with UTF-8 BOM
 */
export function exportAttendanceToCsv(teachers: TeacherProfile[]): void {
  if (typeof window === 'undefined') return;

  const headers = [
    'STT',
    'Họ và tên Giáo viên',
    'Tổ sinh hoạt chuyên môn',
    'Khối lớp / Bộ môn',
    'Gmail / Mã định danh',
    'Số ngày học chuyên cần',
    'Tổng số lượt học',
    'Số câu đã học (trên 10 câu)',
    'Điểm nói cao nhất',
    'Tổng điểm tích lũy',
    'Ngày học gần nhất',
    'Đánh giá chuyên cần',
    'Ghi chú'
  ];

  const rows = teachers.map((t, idx) => {
    const analysis = getProfileAnalysis(t);
    const maxSpeaking = Object.values(t.speakingScores).length > 0
      ? Math.max(...Object.values(t.speakingScores))
      : 0;

    const lastDate = t.lastPracticeDate 
      ? new Date(t.lastPracticeDate).toLocaleDateString('vi-VN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        })
      : 'Chưa ghi nhận';

    return [
      idx + 1,
      `"${t.fullName.replace(/"/g, '""')}"`,
      `"${t.department.replace(/"/g, '""')}"`,
      `"${t.gradeLevel} - ${t.subject}"`,
      `"${t.email || 'N/A'}"`,
      t.practiceDates?.length || 1,
      t.sessionCount || 1,
      `${t.completedPhraseIds.length}/10`,
      maxSpeaking > 0 ? `${maxSpeaking}/100` : 'Chưa thi',
      t.points,
      `"${lastDate}"`,
      `"${analysis.diligenceRating}"`,
      `"${(t.notes || '').replace(/"/g, '""')}"`
    ].join(',');
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Bang_Theo_Doi_Chuyen_Can_GV_LKL10_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
