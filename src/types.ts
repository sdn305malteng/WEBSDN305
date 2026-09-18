export type AccreditationStatus = 'Lengkap' | 'Perlu Perbaikan' | 'Belum Lengkap';

export type IASPComponentId = 'mutu-lulusan' | 'proses-pembelajaran' | 'mutu-guru' | 'manajemen-sekolah';

export interface AccreditationComponent {
  id: IASPComponentId;
  code: string;
  title: string;
  shortDesc: string;
  weight: number; // Persentase bobot penilaian IASP SD
  targetScore: number;
  iconName: string;
  subStandards: string[];
}

export interface AccreditationItem {
  id: string;
  componentId: IASPComponentId;
  itemNumber: number; // Butir IASP (misal Butir 1 s.d. 35)
  title: string;
  indicator: string;
  requiredDocuments: string[];
  status: AccreditationStatus;
  scoreLevel: 1 | 2 | 3 | 4; // Level capaian 1 (dasar), 2 (sedang), 3 (baik), 4 (unggul)
  documentNumber?: string;
  documentTitle?: string;
  documentLink?: string;
  personInCharge: string;
  notes?: string;
  lastUpdated: string;
}

export interface SchoolProfile {
  name: string;
  npsn: string;
  nss: string;
  status: 'Negeri' | 'Swasta';
  accreditationGrade: 'A' | 'B' | 'C' | 'Belum Terakreditasi';
  accreditationScore: number;
  accreditationYear: number;
  nextAccreditationYear: number;
  curriculum: string;
  address: string;
  village: string;
  district: string; // Kecamatan
  regency: string; // Kabupaten Maluku Tengah
  province: string;
  postalCode: string;
  email: string;
  phone: string;
  headmasterName: string;
  headmasterNip: string;
  headmasterSpeech: string;
  headmasterPhotoUrl?: string;
  vision: string;
  missions: string[];
  goals: string[];
  motto: string;
}

export interface Teacher {
  id: string;
  name: string;
  nip: string;
  nuptk?: string;
  role: string;
  education: string;
  certificationStatus: 'Tersertifikasi' | 'Dalam Proses' | 'Belum';
  gender: 'Laki-laki' | 'Perempuan';
  assignedClass?: string;
  phone?: string;
  photoUrl?: string;
  achievements?: string[];
}

export interface Facility {
  id: string;
  name: string;
  category: 'Ruang Pembelajaran' | 'Ruang Penunjang' | 'Sanitasi & Olahraga' | 'Teknologi & Digital';
  quantity: number;
  condition: 'Baik' | 'Rusak Ringan' | 'Rusak Sedang' | 'Rusak Berat';
  areaSqm: number;
  meetsPermendikbud: boolean;
  notes?: string;
  photoUrl?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  category: 'Akreditasi' | 'Kegiatan' | 'Prestasi' | 'Pengumuman' | 'Kurikulum';
  date: string;
  author: string;
  summary: string;
  content: string;
  imageUrl?: string;
  isImportant?: boolean;
}

export interface StudentCohort {
  grade: string; // Kelas 1 s.d. 6
  classes: number;
  male: number;
  female: number;
  total: number;
}

export interface InterviewQA {
  question: string;
  idealAnswer: string;
  evidenceTip: string;
}

export interface GitHubConfig {
  token: string;
  owner: string;
  repo: string;
  branch: string;
  filePath: string;
  databaseFilePath?: string;
  authorName: string;
  authorEmail: string;
  lastSyncedAt?: string;
  lastCommitSha?: string;
  lastCommitUrl?: string;
}

export interface SchoolFullData {
  schoolProfile: SchoolProfile;
  accreditationItems: AccreditationItem[];
  teachers: Teacher[];
  facilities: Facility[];
  news: NewsItem[];
  studentCohorts: StudentCohort[];
  version?: string;
  exportedAt?: string;
  syncedFromGitHub?: boolean;
}

export interface GitHubCommitResult {
  success: boolean;
  message: string;
  commitSha?: string;
  commitUrl?: string;
  updatedAt?: string;
  error?: string;
}
