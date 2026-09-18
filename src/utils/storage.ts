import {
  AccreditationComponent,
  AccreditationItem,
  Facility,
  NewsItem,
  SchoolProfile,
  StudentCohort,
  Teacher,
  GitHubConfig,
  GitHubCommitResult,
  SchoolFullData
} from '../types';
import {
  ACCREDITATION_COMPONENTS,
  INITIAL_ACCREDITATION_ITEMS,
  INITIAL_FACILITIES,
  INITIAL_NEWS,
  INITIAL_SCHOOL_PROFILE,
  INITIAL_STUDENT_COHORTS,
  INITIAL_TEACHERS
} from '../data/initialData';

const KEYS = {
  PROFILE: 'sdn305_school_profile',
  ACCREDITATION_ITEMS: 'sdn305_accreditation_items',
  TEACHERS: 'sdn305_teachers',
  FACILITIES: 'sdn305_facilities',
  NEWS: 'sdn305_news',
  STUDENTS: 'sdn305_student_cohorts',
  ADMIN_AUTH: 'sdn305_admin_auth_state',
  GITHUB_CONFIG: 'sdn305_github_config'
};

export const DEFAULT_GITHUB_CONFIG: GitHubConfig = {
  token: '',
  owner: 'sdn305malteng',
  repo: 'sdn305malukutengah',
  branch: 'main',
  filePath: 'data/teachers.json',
  databaseFilePath: 'data/sdn305_database.json',
  authorName: 'Admin SDN 305 Maluku Tengah',
  authorEmail: 'ruslilussy789@gmail.com'
};

export function getStoredGitHubConfig(): GitHubConfig {
  try {
    const raw = localStorage.getItem(KEYS.GITHUB_CONFIG);
    if (!raw) return DEFAULT_GITHUB_CONFIG;
    const parsed = JSON.parse(raw);
    // Auto-migrate to exact requested repository
    const owner = (!parsed.owner || parsed.owner === 'ruslilussy789') ? 'sdn305malteng' : parsed.owner;
    const repo = (!parsed.repo || parsed.repo === 'sdn-305-maluku-tengah') ? 'sdn305malukutengah' : parsed.repo;
    return {
      ...DEFAULT_GITHUB_CONFIG,
      ...parsed,
      owner,
      repo,
      databaseFilePath: parsed.databaseFilePath || 'data/sdn305_database.json'
    };
  } catch (e) {
    return DEFAULT_GITHUB_CONFIG;
  }
}

export function saveGitHubConfig(config: GitHubConfig): void {
  try {
    localStorage.setItem(KEYS.GITHUB_CONFIG, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save github config', e);
  }
}

// Profile
export function getStoredProfile(): SchoolProfile {
  try {
    const raw = localStorage.getItem(KEYS.PROFILE);
    if (!raw) return INITIAL_SCHOOL_PROFILE;
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_SCHOOL_PROFILE;
  }
}

export function saveProfile(profile: SchoolProfile): void {
  try {
    localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile', e);
  }
}

export const loadSchoolProfile = getStoredProfile;
export const saveSchoolProfile = saveProfile;

// Components
export function loadAccreditationComponents(): AccreditationComponent[] {
  return ACCREDITATION_COMPONENTS;
}

// Items
export function getStoredAccreditationItems(): AccreditationItem[] {
  try {
    const raw = localStorage.getItem(KEYS.ACCREDITATION_ITEMS);
    if (!raw) return INITIAL_ACCREDITATION_ITEMS;
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_ACCREDITATION_ITEMS;
  }
}

export function saveAccreditationItems(items: AccreditationItem[]): void {
  try {
    localStorage.setItem(KEYS.ACCREDITATION_ITEMS, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save accreditation items', e);
  }
}

export const loadAccreditationItems = getStoredAccreditationItems;

export function saveAccreditationItem(item: AccreditationItem): AccreditationItem[] {
  const current = getStoredAccreditationItems();
  const index = current.findIndex(i => i.id === item.id);
  let updated: AccreditationItem[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = item;
  } else {
    updated = [item, ...current];
  }
  saveAccreditationItems(updated);
  return updated;
}

export function deleteAccreditationItem(id: string): AccreditationItem[] {
  const current = getStoredAccreditationItems();
  const updated = current.filter(i => i.id !== id);
  saveAccreditationItems(updated);
  return updated;
}

// Teachers
export function getStoredTeachers(): Teacher[] {
  try {
    const raw = localStorage.getItem(KEYS.TEACHERS);
    if (!raw) return INITIAL_TEACHERS;
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_TEACHERS;
  }
}

export function saveTeachers(teachers: Teacher[]): void {
  try {
    localStorage.setItem(KEYS.TEACHERS, JSON.stringify(teachers));
  } catch (e) {
    console.error('Failed to save teachers', e);
  }
}

export const loadTeachers = getStoredTeachers;

export function saveTeacher(teacher: Teacher): Teacher[] {
  const current = getStoredTeachers();
  const index = current.findIndex(t => t.id === teacher.id);
  let updated: Teacher[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = teacher;
  } else {
    updated = [teacher, ...current];
  }
  saveTeachers(updated);
  return updated;
}

export function deleteTeacher(id: string): Teacher[] {
  const current = getStoredTeachers();
  const updated = current.filter(t => t.id !== id);
  saveTeachers(updated);
  return updated;
}

// Facilities
export function getStoredFacilities(): Facility[] {
  try {
    const raw = localStorage.getItem(KEYS.FACILITIES);
    if (!raw) return INITIAL_FACILITIES;
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_FACILITIES;
  }
}

export function saveFacilities(facilities: Facility[]): void {
  try {
    localStorage.setItem(KEYS.FACILITIES, JSON.stringify(facilities));
  } catch (e) {
    console.error('Failed to save facilities', e);
  }
}

export const loadFacilities = getStoredFacilities;

export function saveFacility(facility: Facility): Facility[] {
  const current = getStoredFacilities();
  const index = current.findIndex(f => f.id === facility.id);
  let updated: Facility[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = facility;
  } else {
    updated = [facility, ...current];
  }
  saveFacilities(updated);
  return updated;
}

export function deleteFacility(id: string): Facility[] {
  const current = getStoredFacilities();
  const updated = current.filter(f => f.id !== id);
  saveFacilities(updated);
  return updated;
}

// News
export function getStoredNews(): NewsItem[] {
  try {
    const raw = localStorage.getItem(KEYS.NEWS);
    if (!raw) return INITIAL_NEWS;
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_NEWS;
  }
}

export function saveNews(news: NewsItem[]): void {
  try {
    localStorage.setItem(KEYS.NEWS, JSON.stringify(news));
  } catch (e) {
    console.error('Failed to save news', e);
  }
}

export const loadNews = getStoredNews;

export function saveNewsItem(newsItem: NewsItem): NewsItem[] {
  const current = getStoredNews();
  const index = current.findIndex(n => n.id === newsItem.id);
  let updated: NewsItem[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = newsItem;
  } else {
    updated = [newsItem, ...current];
  }
  saveNews(updated);
  return updated;
}

export function deleteNewsItem(id: string): NewsItem[] {
  const current = getStoredNews();
  const updated = current.filter(n => n.id !== id);
  saveNews(updated);
  return updated;
}

// Students
export function getStoredStudents(): StudentCohort[] {
  try {
    const raw = localStorage.getItem(KEYS.STUDENTS);
    if (!raw) return INITIAL_STUDENT_COHORTS;
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_STUDENT_COHORTS;
  }
}

export function saveStudents(students: StudentCohort[]): void {
  try {
    localStorage.setItem(KEYS.STUDENTS, JSON.stringify(students));
  } catch (e) {
    console.error('Failed to save students', e);
  }
}

export const loadStudentCohorts = getStoredStudents;

// Admin Auth
export function getAdminAuthState(): boolean {
  try {
    return localStorage.getItem(KEYS.ADMIN_AUTH) === 'true';
  } catch (e) {
    return false;
  }
}

export function setAdminAuthState(state: boolean): void {
  try {
    localStorage.setItem(KEYS.ADMIN_AUTH, state ? 'true' : 'false');
  } catch (e) {
    console.error('Failed to set admin auth', e);
  }
}

// Full bundle of all school data
export function getAllSchoolData(): SchoolFullData {
  return {
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    schoolProfile: getStoredProfile(),
    accreditationItems: getStoredAccreditationItems(),
    teachers: getStoredTeachers(),
    facilities: getStoredFacilities(),
    news: getStoredNews(),
    studentCohorts: getStoredStudents(),
  };
}

export function saveAllSchoolData(data: Partial<SchoolFullData>): boolean {
  try {
    if (data.schoolProfile) saveProfile(data.schoolProfile);
    if (data.accreditationItems) saveAccreditationItems(data.accreditationItems);
    if (data.teachers) saveTeachers(data.teachers);
    if (data.facilities) saveFacilities(data.facilities);
    if (data.news) saveNews(data.news);
    if (data.studentCohorts) saveStudents(data.studentCohorts);
    return true;
  } catch (e) {
    console.error('Failed to save all school data', e);
    return false;
  }
}

// Full export to JSON for backup
export function exportAllDataToJSON(): string {
  const bundle = {
    exportDate: new Date().toISOString(),
    school: 'SDN 305 Maluku Tengah',
    profile: getStoredProfile(),
    accreditationItems: getStoredAccreditationItems(),
    teachers: getStoredTeachers(),
    facilities: getStoredFacilities(),
    news: getStoredNews(),
    students: getStoredStudents()
  };
  return JSON.stringify(bundle, null, 2);
}

// Import all data from JSON
export function importAllDataFromJSON(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);
    if (data.profile) saveProfile(data.profile);
    if (data.accreditationItems) saveAccreditationItems(data.accreditationItems);
    if (data.teachers) saveTeachers(data.teachers);
    if (data.facilities) saveFacilities(data.facilities);
    if (data.news) saveNews(data.news);
    if (data.students) saveStudents(data.students);
    return true;
  } catch (e) {
    console.error('Failed to parse import data', e);
    return false;
  }
}

// Reset data to factory defaults
export function resetAllDataToDefault(): void {
  saveProfile(INITIAL_SCHOOL_PROFILE);
  saveAccreditationItems(INITIAL_ACCREDITATION_ITEMS);
  saveTeachers(INITIAL_TEACHERS);
  saveFacilities(INITIAL_FACILITIES);
  saveNews(INITIAL_NEWS);
  saveStudents(INITIAL_STUDENT_COHORTS);
}

export const resetToInitialData = resetAllDataToDefault;

// Calculate readiness score & statistics
export function calculateAccreditationStats(
  items: AccreditationItem[],
  components?: AccreditationComponent[]
) {
  const totalItems = items.length;
  if (totalItems === 0) {
    return { score: 0, percentage: 0, complete: 0, revision: 0, pending: 0, total: 0, grade: 'C' };
  }

  const complete = items.filter(i => i.status === 'Lengkap').length;
  const revision = items.filter(i => i.status === 'Perlu Perbaikan').length;
  const pending = items.filter(i => i.status === 'Belum Lengkap').length;

  // Level 1 = 25%, Level 2 = 50%, Level 3 = 75%, Level 4 = 100%
  const totalScorePoints = items.reduce((acc, curr) => acc + (curr.scoreLevel * 25), 0);
  const averageScore = Math.round(totalScorePoints / totalItems);
  const percentage = Math.round((complete / totalItems) * 100);

  let grade = 'C';
  if (averageScore >= 91) grade = 'A (Unggul)';
  else if (averageScore >= 81) grade = 'B (Baik)';
  else if (averageScore >= 71) grade = 'C (Cukup)';
  else grade = 'TT (Tidak Terakreditasi)';

  return {
    score: averageScore,
    percentage,
    complete,
    revision,
    pending,
    total: totalItems,
    grade
  };
}
