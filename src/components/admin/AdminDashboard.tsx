import React, { useState } from 'react';
import {
  LayoutDashboard,
  FileCheck2,
  Sparkles,
  School,
  Users,
  Building2,
  Newspaper,
  Database,
  Printer,
  LogOut,
  ExternalLink,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  Edit2,
  Trash2,
  Copy,
  Check,
  Send,
  Loader2,
  FileText,
  MessageSquare,
  Award,
  RefreshCw,
  Download,
  Upload,
  BookOpen,
  FolderGit2,
  GitBranch
} from 'lucide-react';
import {
  SchoolProfile,
  AccreditationItem,
  AccreditationComponent,
  Teacher,
  Facility,
  NewsItem,
  IASPComponentId,
  AccreditationStatus,
  GitHubConfig,
  SchoolFullData
} from '../../types';
import {
  pullTeachersFromGitHub,
  pushTeachersToGitHub,
  pullFullDatabaseFromGitHub,
  pushFullDatabaseToGitHub
} from '../../utils/githubService';
import { importAllDataFromJSON } from '../../utils/storage';

interface AdminDashboardProps {
  profile: SchoolProfile;
  components: AccreditationComponent[];
  items: AccreditationItem[];
  teachers: Teacher[];
  facilities: Facility[];
  news: NewsItem[];
  stats: {
    score: number;
    percentage: number;
    complete: number;
    revision: number;
    pending: number;
    total: number;
    grade: string;
  };
  initialComponentFilter?: IASPComponentId;
  onSaveProfile: (profile: SchoolProfile) => void;
  onSaveItem: (item: AccreditationItem) => void;
  onDeleteItem: (id: string) => void;
  onSaveTeacher: (teacher: Teacher) => void;
  onDeleteTeacher: (id: string) => void;
  onSaveFacility: (facility: Facility) => void;
  onDeleteFacility: (id: string) => void;
  onSaveNews: (newsItem: NewsItem) => void;
  onDeleteNews: (id: string) => void;
  onResetData: () => void;
  onOpenPrint: () => void;
  onExitAdmin: () => void;
  onOpenItemModal: (item?: AccreditationItem | null, compId?: IASPComponentId) => void;
  onOpenTeacherModal: (teacher?: Teacher | null) => void;
  onOpenFacilityModal: (facility?: Facility | null) => void;
  onOpenNewsModal: (news?: NewsItem | null) => void;
  githubConfig: GitHubConfig;
  onSaveGitHubConfig: (config: GitHubConfig) => void;
  onTeachersUpdated: (teachers: Teacher[]) => void;
  onOpenGitHubSyncModal: () => void;
  allSchoolData?: SchoolFullData;
  onAllSchoolDataUpdated?: (data: Partial<SchoolFullData>) => void;
}

type AdminTab =
  | 'overview'
  | 'documents'
  | 'ai-advisor'
  | 'school-profile'
  | 'teachers'
  | 'facilities'
  | 'news'
  | 'backup';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  profile,
  components,
  items,
  teachers,
  facilities,
  news,
  stats,
  initialComponentFilter,
  onSaveProfile,
  onSaveItem,
  onDeleteItem,
  onSaveTeacher,
  onDeleteTeacher,
  onSaveFacility,
  onDeleteFacility,
  onSaveNews,
  onDeleteNews,
  onResetData,
  onOpenPrint,
  onExitAdmin,
  onOpenItemModal,
  onOpenTeacherModal,
  onOpenFacilityModal,
  onOpenNewsModal,
  githubConfig,
  onSaveGitHubConfig,
  onTeachersUpdated,
  onOpenGitHubSyncModal,
  allSchoolData,
  onAllSchoolDataUpdated
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>(
    initialComponentFilter ? 'documents' : 'overview'
  );

  // GitHub Sync State for Teachers & Database
  const [isPullingTeachers, setIsPullingTeachers] = useState(false);
  const [isPushingTeachers, setIsPushingTeachers] = useState(false);
  const [isPullingDb, setIsPullingDb] = useState(false);
  const [isPushingDb, setIsPushingDb] = useState(false);
  const [gitHubBannerMsg, setGitHubBannerMsg] = useState<{ type: 'success' | 'error'; text: string; commitUrl?: string } | null>(null);

  const handleQuickPullDatabase = async () => {
    if (!window.confirm(`Tarik dan pulihkan data sekolah dari repositori GitHub ${githubConfig.owner}/${githubConfig.repo}? Seluruh data lokal akan disinkronkan sesuai data di GitHub.`)) {
      return;
    }
    setIsPullingDb(true);
    setGitHubBannerMsg(null);
    try {
      const res = await pullFullDatabaseFromGitHub(githubConfig);
      setIsPullingDb(false);
      if (res.success && res.database) {
        if (onAllSchoolDataUpdated) {
          onAllSchoolDataUpdated(res.database);
        }
        if (res.database.teachers) {
          onTeachersUpdated(res.database.teachers);
        }
        setGitHubBannerMsg({
          type: 'success',
          text: `Seluruh data sekolah (Profil, 35 Butir IASP, Guru, Sarpras, Berita, Siswa) berhasil ditarik dari GitHub!`
        });
      } else {
        setGitHubBannerMsg({
          type: 'error',
          text: res.error || 'Gagal menarik database dari GitHub.'
        });
      }
    } catch (err: any) {
      setIsPullingDb(false);
      setGitHubBannerMsg({
        type: 'error',
        text: err?.message || 'Terjadi kesalahan saat menarik data database dari GitHub.'
      });
    }
  };

  const handleQuickPushDatabase = async () => {
    if (!githubConfig.token?.trim()) {
      onOpenGitHubSyncModal();
      return;
    }
    if (!allSchoolData) {
      alert('Data sekolah tidak ditemukan.');
      return;
    }
    if (!window.confirm(`Amankan dan simpan SELURUH data sekolah ke repositori GitHub ${githubConfig.owner}/${githubConfig.repo}? Data Anda tidak akan hilang.`)) {
      return;
    }

    setIsPushingDb(true);
    setGitHubBannerMsg(null);
    try {
      const commitMsg = `Cadangan Database Lengkap SDN 305 Maluku Tengah (${new Date().toLocaleDateString('id-ID')})`;
      const res = await pushFullDatabaseToGitHub(githubConfig, allSchoolData, commitMsg);
      setIsPushingDb(false);
      if (res.success) {
        const updated = {
          ...githubConfig,
          lastSyncedAt: new Date().toISOString(),
          lastCommitSha: res.commitSha,
          lastCommitUrl: res.commitUrl,
        };
        onSaveGitHubConfig(updated);
        setGitHubBannerMsg({
          type: 'success',
          text: `Berhasil! Seluruh data sekolah tersimpan permanen di cloud GitHub! (SHA: ${res.commitSha?.slice(0, 7)})`,
          commitUrl: res.commitUrl
        });
      } else {
        setGitHubBannerMsg({
          type: 'error',
          text: res.error || res.message || 'Gagal menyimpan database ke GitHub.'
        });
      }
    } catch (err: any) {
      setIsPushingDb(false);
      setGitHubBannerMsg({
        type: 'error',
        text: err?.message || 'Terjadi kesalahan saat komit database ke GitHub.'
      });
    }
  };

  const handleQuickPullTeachers = async () => {
    setIsPullingTeachers(true);
    setGitHubBannerMsg(null);
    try {
      const res = await pullTeachersFromGitHub(githubConfig);
      setIsPullingTeachers(false);
      if (res.success && res.teachers) {
        onTeachersUpdated(res.teachers);
        setGitHubBannerMsg({
          type: 'success',
          text: `Berhasil menarik ${res.teachers.length} data guru dari GitHub (${githubConfig.owner}/${githubConfig.repo})!`
        });
      } else {
        setGitHubBannerMsg({
          type: 'error',
          text: res.error || 'Gagal menarik data guru dari GitHub.'
        });
      }
    } catch (err: any) {
      setIsPullingTeachers(false);
      setGitHubBannerMsg({
        type: 'error',
        text: err?.message || 'Terjadi kesalahan saat menarik data dari GitHub.'
      });
    }
  };

  const handleQuickPushAllTeachers = async () => {
    if (!githubConfig.token?.trim()) {
      onOpenGitHubSyncModal();
      return;
    }
    if (!window.confirm(`Unggah dan komit seluruh ${teachers.length} data guru ke repositori ${githubConfig.owner}/${githubConfig.repo}?`)) {
      return;
    }

    setIsPushingTeachers(true);
    setGitHubBannerMsg(null);
    try {
      const commitMsg = `Sinkronisasi menyeluruh: ${teachers.length} guru SDN 305 Maluku Tengah`;
      const res = await pushTeachersToGitHub(githubConfig, teachers, commitMsg);
      setIsPushingTeachers(false);
      if (res.success) {
        const updated = {
          ...githubConfig,
          lastSyncedAt: new Date().toISOString(),
          lastCommitSha: res.commitSha,
          lastCommitUrl: res.commitUrl,
        };
        onSaveGitHubConfig(updated);
        setGitHubBannerMsg({
          type: 'success',
          text: `Komit berhasil dikirim ke GitHub! (SHA: ${res.commitSha?.slice(0, 7)})`,
          commitUrl: res.commitUrl
        });
      } else {
        setGitHubBannerMsg({
          type: 'error',
          text: res.error || res.message || 'Gagal mengirim komit ke GitHub.'
        });
      }
    } catch (err: any) {
      setIsPushingTeachers(false);
      setGitHubBannerMsg({
        type: 'error',
        text: err?.message || 'Terjadi kesalahan saat komit ke GitHub.'
      });
    }
  };

  // Document Filtering
  const [docCompFilter, setDocCompFilter] = useState<string>(
    initialComponentFilter || 'all'
  );
  const [docStatusFilter, setDocStatusFilter] = useState<string>('all');
  const [docSearch, setDocSearch] = useState<string>('');

  // AI Advisor State
  const [aiSubTab, setAiSubTab] = useState<'advice' | 'generator' | 'interview'>('advice');
  const [selectedAiComponent, setSelectedAiComponent] = useState<string>('mutu-lulusan');
  const [aiAnalysisResult, setAiAnalysisResult] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // AI Document Generator State
  const [docType, setDocType] = useState<string>('Surat Keputusan (SK)');
  const [docTitleInput, setDocTitleInput] = useState<string>('SK Tim Pencegahan dan Penanganan Kekerasan (TPPK) SDN 305');
  const [docDetailsInput, setDocDetailsInput] = useState<string>('Melibatkan guru kelas, komite sekolah, dan orang tua murid untuk menciptakan iklim sekolah bebas kekerasan.');
  const [generatedDraft, setGeneratedDraft] = useState<string>('');
  const [isGeneratingDraft, setIsGeneratingDraft] = useState<boolean>(false);

  // AI Interview Simulator State
  const [interviewRole, setInterviewRole] = useState<string>('Guru Kelas');
  const [interviewTopic, setInterviewTopic] = useState<string>('Proses Pembelajaran Berdiferensiasi dan Asesmen Kurikulum Merdeka');
  const [interviewResult, setInterviewResult] = useState<string>('');
  const [isSimulatingInterview, setIsSimulatingInterview] = useState<boolean>(false);

  // Copy feedback
  const [copied, setCopied] = useState<boolean>(false);

  // Profile Edit State
  const [editProfile, setEditProfile] = useState<SchoolProfile>({ ...profile });
  const [profileSavedToast, setProfileSavedToast] = useState<boolean>(false);

  // Filtered Documents
  const filteredItems = items.filter((item) => {
    if (docCompFilter !== 'all' && item.componentId !== docCompFilter) return false;
    if (docStatusFilter !== 'all' && item.status !== docStatusFilter) return false;
    if (docSearch.trim()) {
      const q = docSearch.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchInd = item.indicator.toLowerCase().includes(q);
      const matchPic = item.personInCharge.toLowerCase().includes(q);
      const matchDoc = item.documentTitle?.toLowerCase().includes(q) || false;
      const matchNumber = item.itemNumber.toString().includes(q);
      if (!matchTitle && !matchInd && !matchPic && !matchDoc && !matchNumber) return false;
    }
    return true;
  });

  // Handle Quick Status Toggle
  const handleToggleStatus = (item: AccreditationItem) => {
    let nextStatus: AccreditationStatus = 'Lengkap';
    if (item.status === 'Lengkap') nextStatus = 'Perlu Perbaikan';
    else if (item.status === 'Perlu Perbaikan') nextStatus = 'Belum Lengkap';
    else nextStatus = 'Lengkap';

    onSaveItem({
      ...item,
      status: nextStatus,
      lastUpdated: new Date().toISOString().split('T')[0]
    });
  };

  // AI Call 1: Accreditation Advice
  const handleRunAiAnalysis = async () => {
    setIsAnalyzing(true);
    setAiAnalysisResult('');
    try {
      const comp = components.find((c) => c.id === selectedAiComponent);
      const compItems = items.filter((i) => i.componentId === selectedAiComponent);

      const response = await fetch('/api/ai/accreditation-advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          component: comp?.title || selectedAiComponent,
          items: compItems,
          schoolProfile: profile
        })
      });

      const data = await response.json();
      if (data.advice) {
        setAiAnalysisResult(data.advice);
      } else {
        setAiAnalysisResult('Maaf, tidak dapat menerima rekomendasi dari AI saat ini. Silakan coba kembali.');
      }
    } catch (err) {
      console.error(err);
      setAiAnalysisResult('Gagal menghubungi asisten AI. Pastikan server backend sedang berjalan.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // AI Call 2: Generate Document Draft
  const handleGenerateDraft = async () => {
    setIsGeneratingDraft(true);
    setGeneratedDraft('');
    try {
      const response = await fetch('/api/ai/generate-instrument-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentType: docType,
          title: docTitleInput,
          details: docDetailsInput,
          schoolProfile: profile
        })
      });

      const data = await response.json();
      if (data.draft) {
        setGeneratedDraft(data.draft);
      } else {
        setGeneratedDraft('Gagal membuat draf dokumen. Silakan coba beberapa saat lagi.');
      }
    } catch (err) {
      console.error(err);
      setGeneratedDraft('Terjadi kendala jaringan saat menghubungi AI generator.');
    } finally {
      setIsGeneratingDraft(false);
    }
  };

  // AI Call 3: Interview Simulator
  const handleSimulateInterview = async () => {
    setIsSimulatingInterview(true);
    setInterviewResult('');
    try {
      const response = await fetch('/api/ai/simulate-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: interviewRole,
          topic: interviewTopic,
          schoolProfile: profile
        })
      });

      const data = await response.json();
      if (data.simulation) {
        setInterviewResult(data.simulation);
      } else {
        setInterviewResult('Gagal menghasilkan simulasi wawancara.');
      }
    } catch (err) {
      console.error(err);
      setInterviewResult('Terjadi kesalahan saat menghubungi simulasi wawancara AI.');
    } finally {
      setIsSimulatingInterview(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveProfileForm = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(editProfile);
    setProfileSavedToast(true);
    setTimeout(() => setProfileSavedToast(false), 3000);
  };

  // Backup JSON Export
  const handleExportJson = () => {
    const backupData = {
      profile,
      components,
      items,
      teachers,
      facilities,
      news,
      exportedAt: new Date().toISOString()
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `backup-akreditasi-sdn305-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      
      {/* Top Navigation Bar */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-amber-300 shrink-0 shadow-xs">
              <School className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-sm sm:text-base tracking-tight">
                  Panel Admin Akreditasi
                </span>
                <span className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-md hidden sm:inline-block">
                  SDN 305 Maluku Tengah
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Sistem Tata Kelola Bukti Fisik IASP BAN-S/M
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={onOpenPrint}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 flex items-center space-x-1.5 cursor-pointer transition-colors"
              title="Cetak Laporan Lengkap"
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Cetak Laporan EDS</span>
            </button>

            <button
              onClick={onExitAdmin}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg flex items-center space-x-1.5 cursor-pointer transition-colors shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lihat Web Publik</span>
            </button>

            <button
              onClick={onExitAdmin}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"
              title="Keluar dari Admin"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      {/* Admin Layout Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col lg:flex-row gap-6">
        
        {/* Left Sidebar Menu */}
        <aside className="w-full lg:w-64 shrink-0">
          <nav className="bg-white rounded-2xl border border-slate-200 p-3 shadow-2xs space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Ringkasan Kesiapan</span>
            </button>

            <button
              onClick={() => setActiveTab('documents')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'documents'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center space-x-3">
                <FileCheck2 className="w-4 h-4" />
                <span>Bukti Fisik IASP</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                activeTab === 'documents' ? 'bg-emerald-900 text-emerald-200' : 'bg-slate-100 text-slate-600'
              }`}>
                {items.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('ai-advisor')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'ai-advisor'
                  ? 'bg-gradient-to-r from-emerald-800 to-teal-800 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-800'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Asisten AI Asesor</span>
              </div>
              <span className="text-[10px] bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded font-extrabold">
                AI
              </span>
            </button>

            <div className="pt-2 pb-1 border-t border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3.5">
                Data Master Sekolah
              </span>
            </div>

            <button
              onClick={() => setActiveTab('school-profile')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'school-profile'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <School className="w-4 h-4" />
              <span>Profil & Visi Misi</span>
            </button>

            <button
              onClick={() => setActiveTab('teachers')}
              className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'teachers'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Users className="w-4 h-4" />
                <span>Guru & Tendik (GTK)</span>
              </div>
              <div className="flex items-center space-x-1">
                {githubConfig.token && (
                  <span title="Terhubung ke GitHub" className="w-2 h-2 rounded-full bg-emerald-400"></span>
                )}
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600">
                  {teachers.length}
                </span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('facilities')}
              className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'facilities'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Building2 className="w-4 h-4" />
                <span>Sarana & Prasarana</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600">
                {facilities.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('news')}
              className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'news'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Newspaper className="w-4 h-4" />
                <span>Berita & Agenda</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600">
                {news.length}
              </span>
            </button>

            <div className="pt-2 pb-1 border-t border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3.5">
                Pemeliharaan
              </span>
            </div>

            <button
              onClick={() => setActiveTab('backup')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'backup'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Backup & Ekspor Data</span>
            </button>
          </nav>

          {/* Mini Quick Stats Card in Sidebar */}
          <div className="mt-4 bg-emerald-950 text-white rounded-2xl p-4 border border-emerald-800/80 shadow-xs hidden lg:block">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                Predikat BAN-S/M
              </span>
              <span className="text-xs font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded">
                Grade: {stats.grade}
              </span>
            </div>
            <div className="text-2xl font-black text-white">{stats.score} <span className="text-xs text-slate-400 font-normal">/ 100</span></div>
            <div className="text-[11px] text-emerald-200 mt-1">
              {stats.complete} dari {stats.total} dokumen bukti fisik telah terverifikasi.
            </div>
          </div>
        </aside>

        {/* Main Admin Content Area */}
        <main className="flex-1 min-w-0">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Top Banner Stats */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900">
                      Evaluasi Diri Sekolah & Kesiapan Visitasi Akreditasi
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      SD Negeri 305 Maluku Tengah - Target Akreditasi A (Unggul) 2026
                    </p>
                  </div>
                  <button
                    onClick={onOpenPrint}
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-amber-300" />
                    <span>Cetak Lembar Evaluasi</span>
                  </button>
                </div>

                {/* Score Big Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                    <div className="text-slate-500 text-xs font-medium">Skor Simulasi Total</div>
                    <div className="text-3xl font-black text-slate-900 mt-1">{stats.score}</div>
                    <div className="text-[11px] text-emerald-700 font-semibold mt-1">Predikat: {stats.grade}</div>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
                    <div className="text-emerald-800 text-xs font-medium">Dokumen Lengkap</div>
                    <div className="text-3xl font-black text-emerald-700 mt-1">{stats.complete}</div>
                    <div className="text-[11px] text-emerald-800 font-semibold mt-1">{stats.percentage}% dari total butir</div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl">
                    <div className="text-amber-800 text-xs font-medium">Perlu Perbaikan</div>
                    <div className="text-3xl font-black text-amber-700 mt-1">{stats.revision}</div>
                    <div className="text-[11px] text-amber-800 font-semibold mt-1">Perlu revisi data</div>
                  </div>

                  <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl">
                    <div className="text-rose-800 text-xs font-medium">Belum Lengkap</div>
                    <div className="text-3xl font-black text-rose-700 mt-1">{stats.pending}</div>
                    <div className="text-[11px] text-rose-800 font-semibold mt-1">Belum ada portofolio</div>
                  </div>
                </div>
              </div>

              {/* Progress per 4 Components */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
                <h3 className="text-base font-bold text-slate-900 mb-4">
                  Kesiapan per Komponen IASP (4 Standar Utama)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {components.map((comp) => {
                    const compItems = items.filter(i => i.componentId === comp.id);
                    const compComplete = compItems.filter(i => i.status === 'Lengkap').length;
                    const compPerc = compItems.length > 0 ? Math.round((compComplete / compItems.length) * 100) : 0;

                    return (
                      <div
                        key={comp.id}
                        className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                              {comp.code} (Bobot {comp.weight}%)
                            </span>
                            <h4 className="font-bold text-slate-900 text-sm mt-1">{comp.title}</h4>
                          </div>
                          <span className="text-lg font-black text-slate-800">{compPerc}%</span>
                        </div>

                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-3 mb-2">
                          <div
                            className="bg-emerald-600 h-full rounded-full transition-all"
                            style={{ width: `${compPerc}%` }}
                          />
                        </div>

                        <div className="flex justify-between items-center text-[11px] text-slate-500">
                          <span>{compComplete} dari {compItems.length} butir lengkap</span>
                          <button
                            onClick={() => {
                              setDocCompFilter(comp.id);
                              setActiveTab('documents');
                            }}
                            className="text-emerald-700 font-bold hover:underline cursor-pointer"
                          >
                            Kelola Butir &rarr;
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Needed Callout */}
              {stats.pending > 0 || stats.revision > 0 ? (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                        Perhatian: Terdapat {stats.revision + stats.pending} Butir Membutuhkan Kelengkapan
                      </h4>
                      <p className="text-xs text-amber-800 mt-0.5">
                        Gunakan tombol "Asisten AI Asesor" untuk mendapatkan rekomendasi dan draf instrumen resmi secara instan.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('ai-advisor')}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shrink-0 transition-colors cursor-pointer"
                  >
                    Buka Asisten AI &rarr;
                  </button>
                </div>
              ) : null}

            </div>
          )}

          {/* TAB 2: DOCUMENTS / PHYSICAL EVIDENCE */}
          {activeTab === 'documents' && (
            <div className="space-y-4">
              
              {/* Header & Filter Controls */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Manajemen Berkas & Bukti Fisik Akreditasi IASP
                    </h3>
                    <p className="text-xs text-slate-500">
                      Kelola 35 butir instrumen, tautan bukti fisik Google Drive, dan status verifikasi.
                    </p>
                  </div>
                  <button
                    onClick={() => onOpenItemModal(null, docCompFilter !== 'all' ? (docCompFilter as IASPComponentId) : 'mutu-lulusan')}
                    className="inline-flex items-center space-x-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Butir / Bukti Fisik</span>
                  </button>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
                  <div className="sm:col-span-4 relative">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Cari butir, dokumen, atau PIC..."
                      value={docSearch}
                      onChange={(e) => setDocSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>

                  <div className="sm:col-span-5">
                    <select
                      value={docCompFilter}
                      onChange={(e) => setDocCompFilter(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 text-slate-800"
                    >
                      <option value="all">Semua Komponen IASP ({items.length} Butir)</option>
                      {components.map(c => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-3">
                    <select
                      value={docStatusFilter}
                      onChange={(e) => setDocStatusFilter(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 text-slate-800"
                    >
                      <option value="all">Semua Status ({items.length})</option>
                      <option value="Lengkap">Lengkap</option>
                      <option value="Perlu Perbaikan">Perlu Perbaikan</option>
                      <option value="Belum Lengkap">Belum Lengkap</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Document List Items */}
              <div className="space-y-3">
                {filteredItems.length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-500">
                    <FileCheck2 className="w-10 h-10 mx-auto text-slate-400 mb-2" />
                    <p className="font-semibold text-sm">Tidak ditemukan butir dokumen yang sesuai kriteria.</p>
                    <p className="text-xs mt-1">Coba sesuaikan kata kunci pencarian atau reset filter.</p>
                  </div>
                ) : (
                  filteredItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs hover:border-emerald-400 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="flex items-start space-x-3">
                          <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                            #{item.itemNumber}
                          </span>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 uppercase">
                                {item.componentId.replace('-', ' ')}
                              </span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                                Level {item.scoreLevel}
                              </span>
                            </div>
                            <h4 className="font-bold text-slate-900 text-sm mt-1">{item.title}</h4>
                            <p className="text-xs text-slate-600 mt-0.5">{item.indicator}</p>
                          </div>
                        </div>

                        {/* Status button & action controls */}
                        <div className="flex items-center space-x-2 shrink-0 self-end sm:self-start">
                          <button
                            onClick={() => handleToggleStatus(item)}
                            className={`px-2.5 py-1 rounded-full text-xs font-bold cursor-pointer transition-colors flex items-center space-x-1 ${
                              item.status === 'Lengkap'
                                ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300'
                                : item.status === 'Perlu Perbaikan'
                                ? 'bg-amber-100 hover:bg-amber-200 text-amber-800 border border-amber-300'
                                : 'bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-300'
                            }`}
                            title="Klik untuk mengubah status kelengkapan"
                          >
                            {item.status === 'Lengkap' ? (
                              <CheckCircle2 className="w-3 h-3" />
                            ) : (
                              <AlertCircle className="w-3 h-3" />
                            )}
                            <span>{item.status}</span>
                          </button>

                          <button
                            onClick={() => onOpenItemModal(item)}
                            className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-slate-100 rounded-lg cursor-pointer"
                            title="Edit Butir"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              if (window.confirm(`Hapus butir "${item.title}"?`)) {
                                onDeleteItem(item.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                            title="Hapus Butir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Required documents list */}
                      <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                            Bukti Fisik Wajib:
                          </span>
                          <ul className="space-y-0.5 text-slate-700">
                            {item.requiredDocuments.map((doc, dIdx) => (
                              <li key={dIdx} className="flex items-center space-x-1.5 truncate">
                                <span className="w-1 h-1 rounded-full bg-emerald-600 shrink-0" />
                                <span className="truncate">{doc}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                            Status Berkas & PIC:
                          </span>
                          <div className="space-y-1 text-slate-600">
                            <div>
                              PIC: <strong className="text-slate-800">{item.personInCharge}</strong>
                            </div>
                            {item.documentTitle && (
                              <div className="text-emerald-800 font-semibold truncate">
                                Judul: {item.documentTitle}
                              </div>
                            )}
                            {item.documentLink ? (
                              <a
                                href={item.documentLink}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center space-x-1 text-emerald-700 hover:underline text-[11px]"
                              >
                                <ExternalLink className="w-3 h-3" />
                                <span>Buka Dokumen Google Drive</span>
                              </a>
                            ) : (
                              <span className="text-[11px] text-slate-400 italic">
                                Belum ada tautan file cloud
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>
          )}

          {/* TAB 3: AI ADVISOR (GEMINI API FULL-STACK) */}
          {activeTab === 'ai-advisor' && (
            <div className="space-y-6">
              
              {/* Header Box */}
              <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30 mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Kecerdasan Buatan Terintegrasi (Google Gemini 2.5)</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                  Asisten Cerdas Akreditasi SDN 305 Maluku Tengah
                </h3>
                <p className="text-xs sm:text-sm text-emerald-200 mt-2 max-w-2xl leading-relaxed">
                  Ditenagai model AI untuk membantu tim akreditasi sekolah menelaah kesenjangan bukti fisik IASP, menyusun draf dokumen SK/SOP resmi, serta melakukan simulasi wawancara asesor visitasi.
                </p>

                {/* Sub Tab Switcher */}
                <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-emerald-800/80">
                  <button
                    onClick={() => setAiSubTab('advice')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      aiSubTab === 'advice'
                        ? 'bg-amber-400 text-slate-950 shadow-sm'
                        : 'bg-emerald-950/60 hover:bg-emerald-950 text-emerald-200 border border-emerald-700/60'
                    }`}
                  >
                    1. Telaah Kesiapan Standar IASP
                  </button>

                  <button
                    onClick={() => setAiSubTab('generator')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      aiSubTab === 'generator'
                        ? 'bg-amber-400 text-slate-950 shadow-sm'
                        : 'bg-emerald-950/60 hover:bg-emerald-950 text-emerald-200 border border-emerald-700/60'
                    }`}
                  >
                    2. Generator Draf Dokumen / SK Resmi
                  </button>

                  <button
                    onClick={() => setAiSubTab('interview')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      aiSubTab === 'interview'
                        ? 'bg-amber-400 text-slate-950 shadow-sm'
                        : 'bg-emerald-950/60 hover:bg-emerald-950 text-emerald-200 border border-emerald-700/60'
                    }`}
                  >
                    3. Simulasi Wawancara Asesor Visitasi
                  </button>
                </div>
              </div>

              {/* SUBTAB 1: ADVICE / AUDIT */}
              {aiSubTab === 'advice' && (
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
                  <div>
                    <h4 className="text-base font-bold text-slate-900">
                      Analisis & Rekomendasi Asesor AI untuk Komponen IASP
                    </h4>
                    <p className="text-xs text-slate-500">
                      Pilih komponen yang ingin ditelaah. AI akan menganalisis data butir saat ini dan memberikan langkah taktis untuk meraih Level 4 (Unggul).
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <select
                      value={selectedAiComponent}
                      onChange={(e) => setSelectedAiComponent(e.target.value)}
                      className="px-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-600"
                    >
                      {components.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.title} (Bobot {c.weight}%)
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={handleRunAiAnalysis}
                      disabled={isAnalyzing}
                      className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-400 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer transition-colors"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Menganalisis Kesiapan...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-amber-300" />
                          <span>Mulai Telaah Kesiapan Asesor AI</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* AI Output Card */}
                  {aiAnalysisResult && (
                    <div className="mt-4 p-6 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
                        <span className="text-xs font-bold text-emerald-800 flex items-center space-x-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Hasil Telaah Asesor AI:</span>
                        </span>
                        <button
                          onClick={() => copyToClipboard(aiAnalysisResult)}
                          className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center space-x-1 cursor-pointer"
                        >
                          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copied ? 'Tersalin!' : 'Salin Rekomendasi'}</span>
                        </button>
                      </div>
                      <div className="text-xs text-slate-800 whitespace-pre-line font-sans leading-relaxed space-y-2">
                        {aiAnalysisResult}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* SUBTAB 2: DOCUMENT GENERATOR */}
              {aiSubTab === 'generator' && (
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
                  <div>
                    <h4 className="text-base font-bold text-slate-900">
                      Generator Otomatis Draf Dokumen & SK Akreditasi
                    </h4>
                    <p className="text-xs text-slate-500">
                      Buat draf surat keputusan resmi, SOP sekolah, notula rapat, atau laporan program sesuai standar tata naskah dinas pendidikan.
                    </p>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Jenis Dokumen
                        </label>
                        <select
                          value={docType}
                          onChange={(e) => setDocType(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:ring-2 focus:ring-emerald-600 text-xs"
                        >
                          <option value="Surat Keputusan (SK) Kepala Sekolah">Surat Keputusan (SK) Kepala Sekolah</option>
                          <option value="Standar Operasional Prosedur (SOP)">Standar Operasional Prosedur (SOP)</option>
                          <option value="Program Kerja & Rencana Aksi">Program Kerja & Rencana Aksi</option>
                          <option value="Notula & Berita Acara Rapat">Notula & Berita Acara Rapat</option>
                          <option value="Instrumen Evaluasi & Refleksi Guru">Instrumen Evaluasi & Refleksi Guru</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Judul Dokumen yang Diperlukan
                        </label>
                        <input
                          type="text"
                          value={docTitleInput}
                          onChange={(e) => setDocTitleInput(e.target.value)}
                          placeholder="Contoh: SK Pembentukan Tim Literasi dan Numerasi Sekolah"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:ring-2 focus:ring-emerald-600 text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Poin Penting / Muatan Khusus (Kearifan Lokal / Konteks SDN 305)
                      </label>
                      <textarea
                        rows={2}
                        value={docDetailsInput}
                        onChange={(e) => setDocDetailsInput(e.target.value)}
                        placeholder="Contoh: Pembiasaan membaca 15 menit sebelum belajar, pojok baca tiap kelas..."
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:ring-2 focus:ring-emerald-600 text-xs"
                      />
                    </div>

                    <button
                      onClick={handleGenerateDraft}
                      disabled={isGeneratingDraft || !docTitleInput.trim()}
                      className="inline-flex items-center space-x-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-400 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer transition-colors"
                    >
                      {isGeneratingDraft ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Menyusun Draf Dokumen Resmi...</span>
                        </>
                      ) : (
                        <>
                          <FileText className="w-4 h-4 text-amber-300" />
                          <span>Buat Draf Dokumen Sekarang</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Generated Draft Display */}
                  {generatedDraft && (
                    <div className="mt-4 p-6 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
                        <span className="text-xs font-bold text-emerald-800">
                          Draf Dokumen Berhasil Dibuat:
                        </span>
                        <button
                          onClick={() => copyToClipboard(generatedDraft)}
                          className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center space-x-1 cursor-pointer"
                        >
                          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copied ? 'Tersalin!' : 'Salin Seluruh Teks Draf'}</span>
                        </button>
                      </div>
                      <div className="text-xs text-slate-800 whitespace-pre-line font-mono leading-relaxed bg-white p-4 rounded-lg border border-slate-200 overflow-x-auto">
                        {generatedDraft}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* SUBTAB 3: INTERVIEW SIMULATOR */}
              {aiSubTab === 'interview' && (
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
                  <div>
                    <h4 className="text-base font-bold text-slate-900">
                      Simulasi Wawancara Visitasi Asesor BAN-S/M
                    </h4>
                    <p className="text-xs text-slate-500">
                      Latih Kepala Sekolah, Dewan Guru, atau Komite dalam menjawab pertanyaan kritis tim asesor dengan pembuktian bukti fisik otentik.
                    </p>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Peran yang Diwawancarai
                        </label>
                        <select
                          value={interviewRole}
                          onChange={(e) => setInterviewRole(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:ring-2 focus:ring-emerald-600 text-xs"
                        >
                          <option value="Kepala Sekolah">Kepala Sekolah (Manajerial, KOSP & RKAS)</option>
                          <option value="Guru Kelas">Guru Kelas (Pembelajaran & Asesmen)</option>
                          <option value="Guru Mapel PAI / PJOK">Guru Mapel PAI / PJOK</option>
                          <option value="Komite Sekolah & Orang Tua">Komite Sekolah & Orang Tua Murid</option>
                          <option value="Peserta Didik">Peserta Didik (Karakter & Iklim Sekolah)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Fokus Topik Wawancara
                        </label>
                        <input
                          type="text"
                          value={interviewTopic}
                          onChange={(e) => setInterviewTopic(e.target.value)}
                          placeholder="Contoh: Pelaksanaan Asesmen Diagnostik dan Pembelajaran Berdiferensiasi"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:ring-2 focus:ring-emerald-600 text-xs"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleSimulateInterview}
                      disabled={isSimulatingInterview}
                      className="inline-flex items-center space-x-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-400 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer transition-colors"
                    >
                      {isSimulatingInterview ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Menyiapkan Sesi Simulasi Asesor...</span>
                        </>
                      ) : (
                        <>
                          <MessageSquare className="w-4 h-4 text-amber-300" />
                          <span>Mulai Simulasi Pertanyaan Asesor</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Interview Result Display */}
                  {interviewResult && (
                    <div className="mt-4 p-6 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
                        <span className="text-xs font-bold text-emerald-800">
                          Skenario Pertanyaan & Tips Jawaban Asesor:
                        </span>
                        <button
                          onClick={() => copyToClipboard(interviewResult)}
                          className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center space-x-1 cursor-pointer"
                        >
                          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copied ? 'Tersalin!' : 'Salin Tanya Jawab'}</span>
                        </button>
                      </div>
                      <div className="text-xs text-slate-800 whitespace-pre-line font-sans leading-relaxed space-y-2 bg-white p-4 rounded-lg border border-slate-200">
                        {interviewResult}
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          )}

          {/* TAB 4: SCHOOL PROFILE */}
          {activeTab === 'school-profile' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Edit Profil & Identitas Resmi Sekolah
                  </h3>
                  <p className="text-xs text-slate-500">
                    Informasi ini tampil di seluruh header, kop laporan akreditasi, dan halaman publik.
                  </p>
                </div>
                {profileSavedToast && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-md flex items-center space-x-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Profil Berhasil Diperbarui!</span>
                  </span>
                )}
              </div>

              <form onSubmit={handleSaveProfileForm} className="space-y-4 text-xs">
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Nama Satuan Pendidikan
                    </label>
                    <input
                      type="text"
                      value={editProfile.name}
                      onChange={(e) => setEditProfile({ ...editProfile, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-bold focus:ring-2 focus:ring-emerald-600 text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      NPSN
                    </label>
                    <input
                      type="text"
                      value={editProfile.npsn}
                      onChange={(e) => setEditProfile({ ...editProfile, npsn: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-mono focus:ring-2 focus:ring-emerald-600 text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      NSS
                    </label>
                    <input
                      type="text"
                      value={editProfile.nss}
                      onChange={(e) => setEditProfile({ ...editProfile, nss: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-mono focus:ring-2 focus:ring-emerald-600 text-xs"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Nama Kepala Sekolah & Gelar
                    </label>
                    <input
                      type="text"
                      value={editProfile.headmasterName}
                      onChange={(e) => setEditProfile({ ...editProfile, headmasterName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-emerald-600 text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      NIP Kepala Sekolah
                    </label>
                    <input
                      type="text"
                      value={editProfile.headmasterNip}
                      onChange={(e) => setEditProfile({ ...editProfile, headmasterNip: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-mono focus:ring-2 focus:ring-emerald-600 text-xs"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Sambutan Resmi Kepala Sekolah
                  </label>
                  <textarea
                    rows={3}
                    value={editProfile.headmasterSpeech}
                    onChange={(e) => setEditProfile({ ...editProfile, headmasterSpeech: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-emerald-600 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Visi Sekolah
                  </label>
                  <textarea
                    rows={2}
                    value={editProfile.vision}
                    onChange={(e) => setEditProfile({ ...editProfile, vision: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-emerald-600 text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Misi Sekolah (Satu butir per baris)
                  </label>
                  <textarea
                    rows={5}
                    value={editProfile.missions.join('\n')}
                    onChange={(e) => setEditProfile({
                      ...editProfile,
                      missions: e.target.value.split('\n').filter(s => s.trim().length > 0)
                    })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-emerald-600 text-xs"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Alamat Sekolah
                    </label>
                    <input
                      type="text"
                      value={editProfile.address}
                      onChange={(e) => setEditProfile({ ...editProfile, address: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-emerald-600 text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Desa / Negeri & Kecamatan
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={editProfile.village}
                        onChange={(e) => setEditProfile({ ...editProfile, village: e.target.value })}
                        placeholder="Desa Sepa"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-emerald-600 text-xs"
                      />
                      <input
                        type="text"
                        value={editProfile.district}
                        onChange={(e) => setEditProfile({ ...editProfile, district: e.target.value })}
                        placeholder="Kec. Amahai"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-emerald-600 text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Nomor Telepon
                    </label>
                    <input
                      type="text"
                      value={editProfile.phone}
                      onChange={(e) => setEditProfile({ ...editProfile, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-emerald-600 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Email Resmi Sekolah
                    </label>
                    <input
                      type="email"
                      value={editProfile.email}
                      onChange={(e) => setEditProfile({ ...editProfile, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-emerald-600 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Motto Sekolah
                    </label>
                    <input
                      type="text"
                      value={editProfile.motto}
                      onChange={(e) => setEditProfile({ ...editProfile, motto: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-emerald-600 text-xs"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-xs cursor-pointer transition-colors"
                  >
                    Simpan Perubahan Profil
                  </button>
                </div>

              </form>
            </div>
          )}

          {/* TAB 5: TEACHERS */}
          {activeTab === 'teachers' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
              {/* Header & GitHub Action Bar */}
              <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-bold text-slate-900">
                      Manajemen Dewan Guru & Tenaga Kependidikan ({teachers.length} Orang)
                    </h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      githubConfig.token
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}>
                      {githubConfig.token ? 'GitHub Aktif' : 'GitHub Belum Terhubung'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Kelola data GTK, NIP, kualifikasi, sertifikasi, dan sinkronisasi berkas otomatis ke GitHub.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* GitHub Config Button */}
                  <button
                    type="button"
                    onClick={onOpenGitHubSyncModal}
                    className="inline-flex items-center space-x-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                    title="Pengaturan Repositori GitHub"
                  >
                    <FolderGit2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Koneksi GitHub</span>
                  </button>

                  {/* Pull from GitHub */}
                  <button
                    type="button"
                    onClick={handleQuickPullTeachers}
                    disabled={isPullingTeachers}
                    className="inline-flex items-center space-x-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 disabled:opacity-50 text-blue-800 border border-blue-200 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    title="Tarik data guru terbaru dari GitHub"
                  >
                    {isPullingTeachers ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Menarik...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5" />
                        <span>Tarik dari GitHub</span>
                      </>
                    )}
                  </button>

                  {/* Push to GitHub */}
                  <button
                    type="button"
                    onClick={handleQuickPushAllTeachers}
                    disabled={isPushingTeachers || !githubConfig.token}
                    className="inline-flex items-center space-x-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 disabled:opacity-50 text-emerald-800 border border-emerald-300 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    title="Komit seluruh data guru saat ini ke repositori GitHub"
                  >
                    {isPushingTeachers ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Mengunggah...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        <span>Komit Guru</span>
                      </>
                    )}
                  </button>

                  {/* Push Database */}
                  <button
                    type="button"
                    onClick={handleQuickPushDatabase}
                    disabled={isPushingDb || !githubConfig.token}
                    className="inline-flex items-center space-x-1.5 px-3 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                    title="Amankan seluruh database sekolah ke repositori GitHub"
                  >
                    {isPushingDb ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Menyimpan...</span>
                      </>
                    ) : (
                      <>
                        <Database className="w-3.5 h-3.5" />
                        <span>Amankan Seluruh Data</span>
                      </>
                    )}
                  </button>

                  {/* Add New Teacher */}
                  <button
                    onClick={() => onOpenTeacherModal(null)}
                    className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-emerald-400" />
                    <span>Tambah GTK Baru</span>
                  </button>
                </div>
              </div>

              {/* GitHub Status Banner */}
              {gitHubBannerMsg && (
                <div className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                  gitHubBannerMsg.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}>
                  <div className="flex items-center space-x-2">
                    {gitHubBannerMsg.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                    <span>{gitHubBannerMsg.text}</span>
                    {gitHubBannerMsg.commitUrl && (
                      <a
                        href={gitHubBannerMsg.commitUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center space-x-1 font-bold underline text-emerald-800 hover:text-emerald-950 ml-2"
                      >
                        <span>Lihat di GitHub</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <button
                    onClick={() => setGitHubBannerMsg(null)}
                    className="text-slate-400 hover:text-slate-700 font-bold px-2 py-0.5"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Repo Details Pill */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 text-slate-600">
                <div className="flex flex-wrap items-center gap-2">
                  <GitBranch className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Repositori Terhubung:</span>
                  <a
                    href={`https://github.com/${githubConfig.owner}/${githubConfig.repo}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono font-bold text-slate-900 underline hover:text-emerald-700 inline-flex items-center space-x-1"
                  >
                    <span>{githubConfig.owner}/{githubConfig.repo}</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                  <span className="text-slate-300">|</span>
                  <span>Branch:</span>
                  <span className="font-mono font-semibold text-slate-700">{githubConfig.branch}</span>
                  <span className="text-slate-300">|</span>
                  <span>Berkas Guru:</span>
                  <span className="font-mono text-slate-700">{githubConfig.filePath}</span>
                </div>
                {githubConfig.lastSyncedAt ? (
                  <div className="text-slate-500 text-[10px]">
                    Sinkron: {new Date(githubConfig.lastSyncedAt).toLocaleTimeString('id-ID')}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={onOpenGitHubSyncModal}
                    className="text-emerald-700 hover:underline font-bold text-[10px] cursor-pointer"
                  >
                    {githubConfig.token ? 'Terkoneksi' : 'Klik untuk lengkapi Token'}
                  </button>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                      <th className="py-2.5 px-3">Nama & Gelar</th>
                      <th className="py-2.5 px-3">NIP / NUPTK</th>
                      <th className="py-2.5 px-3">Jabatan & Tugas</th>
                      <th className="py-2.5 px-3">Pendidikan</th>
                      <th className="py-2.5 px-3">Sertifikasi</th>
                      <th className="py-2.5 px-3 text-right">Aksi & GitHub</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {teachers.map((teacher) => (
                      <tr key={teacher.id} className="hover:bg-slate-50/70">
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-900">{teacher.name}</div>
                          <div className="text-[11px] text-slate-500">{teacher.gender}</div>
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-700">
                          <div>{teacher.nip}</div>
                          {teacher.nuptk && <div className="text-[10px] text-slate-400">NUPTK: {teacher.nuptk}</div>}
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-medium text-slate-800">{teacher.role}</span>
                          {teacher.assignedClass && (
                            <div className="text-[11px] text-emerald-700 font-semibold">{teacher.assignedClass}</div>
                          )}
                        </td>
                        <td className="py-3 px-3 text-slate-600">{teacher.education}</td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            teacher.certificationStatus === 'Tersertifikasi'
                              ? 'bg-emerald-100 text-emerald-800'
                              : teacher.certificationStatus === 'Dalam Proses'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {teacher.certificationStatus}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right space-x-1.5 whitespace-nowrap">
                          <button
                            onClick={() => onOpenTeacherModal(teacher)}
                            className="inline-flex items-center space-x-1 px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 rounded-lg font-bold cursor-pointer transition-colors"
                            title="Edit Data Guru & Komit ke GitHub"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Hapus data ${teacher.name}?`)) {
                                onDeleteTeacher(teacher.id);
                              }
                            }}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer transition-colors"
                            title="Hapus Guru"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: FACILITIES */}
          {activeTab === 'facilities' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Inventaris Sarana & Prasarana Sekolah ({facilities.length} Item)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Kelola data ruang kelas, lab, sanitasi, dan kepatuhan standar SNP.
                  </p>
                </div>
                <button
                  onClick={() => onOpenFacilityModal(null)}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Sarpras Baru</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                      <th className="py-2.5 px-3">Nama Fasilitas</th>
                      <th className="py-2.5 px-3">Kategori</th>
                      <th className="py-2.5 px-3">Unit / Luas</th>
                      <th className="py-2.5 px-3">Kondisi</th>
                      <th className="py-2.5 px-3">Standar SNP</th>
                      <th className="py-2.5 px-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {facilities.map((fac) => (
                      <tr key={fac.id} className="hover:bg-slate-50/70">
                        <td className="py-3 px-3 font-bold text-slate-900">
                          {fac.name}
                          {fac.notes && <p className="font-normal text-[11px] text-slate-500">{fac.notes}</p>}
                        </td>
                        <td className="py-3 px-3 text-slate-600">{fac.category}</td>
                        <td className="py-3 px-3 font-mono text-slate-700">{fac.quantity} Unit / {fac.areaSqm} m²</td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            fac.condition === 'Baik'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {fac.condition}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="text-emerald-700 font-medium">
                            {fac.meetsPermendikbud ? '✓ Memenuhi SNP' : 'Proses'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right space-x-1">
                          <button
                            onClick={() => onOpenFacilityModal(fac)}
                            className="p-1 text-slate-500 hover:text-emerald-700 rounded cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Hapus ${fac.name}?`)) {
                                onDeleteFacility(fac.id);
                              }
                            }}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 7: NEWS */}
          {activeTab === 'news' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Manajemen Berita & Pengumuman ({news.length} Artikel)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Publikasikan berita kesiapan visitasi, kegiatan pembelajaran, dan prestasi siswa.
                  </p>
                </div>
                <button
                  onClick={() => onOpenNewsModal(null)}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Berita Baru</span>
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {news.map((item) => (
                  <div key={item.id} className="py-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                          {item.category}
                        </span>
                        {item.isImportant && (
                          <span className="bg-amber-400 text-slate-950 text-[10px] font-bold px-1.5 py-0.5 rounded">
                            Penting
                          </span>
                        )}
                        <span className="text-[11px] text-slate-400">{item.date} • Oleh {item.author}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                      <p className="text-xs text-slate-600 line-clamp-2">{item.summary}</p>
                    </div>

                    <div className="flex items-center space-x-1 shrink-0">
                      <button
                        onClick={() => onOpenNewsModal(item)}
                        className="p-1.5 text-slate-500 hover:text-emerald-700 rounded-lg cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Hapus berita "${item.title}"?`)) {
                            onDeleteNews(item.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: BACKUP & GITHUB CLOUD */}
          {activeTab === 'backup' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Cadangan (Backup) & Sinkronisasi Cloud GitHub
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Pastikan seluruh data yang sudah Anda isi aman dan tidak hilang dengan menyimpannya ke GitHub atau mengunduh cadangan lokal.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onOpenGitHubSyncModal}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
                >
                  <FolderGit2 className="w-4 h-4 text-emerald-400" />
                  <span>Pengaturan GitHub</span>
                </button>
              </div>

              {/* SECTION 1: GITHUB CLOUD PERSISTENCE */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                      <FolderGit2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-bold text-sm text-white">Repositori Resmi SDN 305</h4>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          githubConfig.token
                            ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50'
                            : 'bg-amber-500/30 text-amber-300 border border-amber-500/50'
                        }`}>
                          {githubConfig.token ? 'Token Terkonfigurasi' : 'Token Belum Terhubung'}
                        </span>
                      </div>
                      <a
                        href={`https://github.com/${githubConfig.owner}/${githubConfig.repo}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-400 hover:text-emerald-300 text-xs font-mono underline inline-flex items-center space-x-1 mt-0.5"
                      >
                        <span>https://github.com/{githubConfig.owner}/{githubConfig.repo}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={handleQuickPullDatabase}
                      disabled={isPullingDb}
                      className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 cursor-pointer transition-colors shadow-xs"
                      title="Tarik seluruh data terbaru dari GitHub"
                    >
                      {isPullingDb ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Menarik...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          <span>Tarik dari GitHub</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleQuickPushDatabase}
                      disabled={isPushingDb || !githubConfig.token}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 cursor-pointer transition-colors shadow-xs"
                      title="Amankan seluruh database sekolah ke GitHub"
                    >
                      {isPushingDb ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Menyimpan...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-3.5 h-3.5" />
                          <span>Amankan Seluruh Data ke GitHub</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Menyimpan profil sekolah, 35 butir instrumen akreditasi, data guru ({teachers.length} orang), sarpras, berita, dan statistik siswa ke berkas <code className="font-mono bg-slate-800 px-1.5 py-0.5 rounded text-emerald-300 border border-slate-700">data/sdn305_database.json</code> di branch <strong className="font-mono text-white">{githubConfig.branch}</strong>.
                </p>
              </div>

              {/* SECTION 2: LOCAL JSON BACKUP & RESTORE */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Export Card */}
                <div className="p-6 rounded-2xl border border-emerald-200 bg-emerald-50/50 flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center mb-3">
                      <Download className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">Unduh Cadangan Lengkap (.JSON)</h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Simpan seluruh data akreditasi, GTK, dan sarpras ke dalam satu berkas file .JSON di komputer/laptop sekolah.
                    </p>
                  </div>

                  <button
                    onClick={handleExportJson}
                    className="mt-6 w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download File Cadangan (.JSON)</span>
                  </button>
                </div>

                {/* Reset to Default Card */}
                <div className="p-6 rounded-2xl border border-rose-200 bg-rose-50/40 flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center mb-3">
                      <RefreshCw className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">Kembalikan ke Data Awal</h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Jika terjadi kesalahan pengisian data, Anda dapat memulihkan seluruh data contoh resmi SDN 305 Maluku Tengah.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      if (window.confirm('Apakah Anda yakin ingin memulihkan seluruh data ke setelan awal resmi SDN 305 Maluku Tengah?')) {
                        onResetData();
                      }
                    }}
                    className="mt-6 w-full py-2.5 bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center space-x-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Reset Seluruh Data ke Default</span>
                  </button>
                </div>

              </div>
            </div>
          )}

        </main>

      </div>

    </div>
  );
};
