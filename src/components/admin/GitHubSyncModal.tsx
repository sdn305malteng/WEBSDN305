import React, { useState } from 'react';
import {
  X,
  GitBranch,
  FolderGit2,
  Key,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Upload,
  Download,
  Copy,
  Check,
  Loader2,
  ShieldCheck,
  FileCode2,
  Sparkles,
  Database,
  Users,
  FileJson
} from 'lucide-react';
import { GitHubConfig, SchoolFullData, Teacher } from '../../types';
import {
  testGitHubConnection,
  pullTeachersFromGitHub,
  pushTeachersToGitHub,
  pullFullDatabaseFromGitHub,
  pushFullDatabaseToGitHub,
  GitHubTestResult
} from '../../utils/githubService';
import { exportAllDataToJSON, importAllDataFromJSON } from '../../utils/storage';

interface GitHubSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: GitHubConfig;
  onSaveConfig: (config: GitHubConfig) => void;
  currentTeachers: Teacher[];
  onTeachersUpdated: (teachers: Teacher[]) => void;
  allSchoolData?: SchoolFullData;
  onAllSchoolDataUpdated?: (data: Partial<SchoolFullData>) => void;
}

export const GitHubSyncModal: React.FC<GitHubSyncModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  currentTeachers,
  onTeachersUpdated,
  allSchoolData,
  onAllSchoolDataUpdated
}) => {
  const [localConfig, setLocalConfig] = useState<GitHubConfig>(config);
  const [showToken, setShowToken] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<GitHubTestResult | null>(null);

  // Sync state
  const [isPullingTeachers, setIsPullingTeachers] = useState(false);
  const [isPushingTeachers, setIsPushingTeachers] = useState(false);
  const [isPullingDb, setIsPullingDb] = useState(false);
  const [isPushingDb, setIsPushingDb] = useState(false);

  const [feedbackMsg, setFeedbackMsg] = useState<{
    type: 'success' | 'error';
    text: string;
    commitUrl?: string;
  } | null>(null);

  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'config' | 'database' | 'teachers' | 'offline' | 'preview'>('database');
  const [previewMode, setPreviewMode] = useState<'teachers' | 'database'>('database');

  if (!isOpen) return null;

  const repoUrl = `https://github.com/${localConfig.owner}/${localConfig.repo}`;

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    setFeedbackMsg(null);

    const result = await testGitHubConnection(localConfig);
    setTestResult(result);
    setIsTesting(false);

    if (result.success) {
      onSaveConfig(localConfig);
    }
  };

  // Full Database Actions
  const handlePushDatabase = async () => {
    if (!localConfig.token.trim()) {
      alert('Silakan masukkan Personal Access Token (PAT) GitHub terlebih dahulu.');
      setActiveTab('config');
      return;
    }

    if (!allSchoolData) {
      alert('Data sekolah tidak ditemukan.');
      return;
    }

    if (!window.confirm(`Amankan dan komit SELURUH data sekolah ke repositori GitHub ${localConfig.owner}/${localConfig.repo}?`)) {
      return;
    }

    setIsPushingDb(true);
    setFeedbackMsg(null);
    const message = `Cadangan Database SDN 305 Maluku Tengah (${new Date().toLocaleDateString('id-ID')})`;
    const result = await pushFullDatabaseToGitHub(localConfig, allSchoolData, message);
    setIsPushingDb(false);

    if (result.success) {
      setFeedbackMsg({
        type: 'success',
        text: `Sukses! Seluruh data sekolah (Profil, 35 Butir IASP, Guru, Sarpras, Berita, Siswa) tersimpan aman di repositori GitHub!`,
        commitUrl: result.commitUrl
      });
      const updated = {
        ...localConfig,
        lastSyncedAt: new Date().toISOString(),
        lastCommitSha: result.commitSha,
        lastCommitUrl: result.commitUrl
      };
      setLocalConfig(updated);
      onSaveConfig(updated);
    } else {
      setFeedbackMsg({
        type: 'error',
        text: result.error || result.message || 'Gagal menyimpan database ke GitHub.'
      });
    }
  };

  const handlePullDatabase = async () => {
    if (!window.confirm('Tarik seluruh data dari repositori GitHub? Seluruh data profil, akreditasi, guru, dan sarpras lokal akan diperbarui mengikuti data di GitHub.')) {
      return;
    }

    setIsPullingDb(true);
    setFeedbackMsg(null);
    const result = await pullFullDatabaseFromGitHub(localConfig);
    setIsPullingDb(false);

    if (result.success && result.database) {
      if (onAllSchoolDataUpdated) {
        onAllSchoolDataUpdated(result.database);
      }
      if (result.database.teachers) {
        onTeachersUpdated(result.database.teachers);
      }
      setFeedbackMsg({
        type: 'success',
        text: result.message || 'Seluruh data sekolah berhasil dipulihkan dari repositori GitHub!'
      });
    } else {
      setFeedbackMsg({
        type: 'error',
        text: result.error || 'Gagal menarik data sekolah dari GitHub.'
      });
    }
  };

  // Teacher Only Actions
  const handlePullTeachers = async () => {
    if (!window.confirm('Tarik data guru dari GitHub? Data guru lokal akan diperbarui sesuai berkas data/teachers.json di GitHub.')) {
      return;
    }

    setIsPullingTeachers(true);
    setFeedbackMsg(null);
    const result = await pullTeachersFromGitHub(localConfig);
    setIsPullingTeachers(false);

    if (result.success && result.teachers) {
      onTeachersUpdated(result.teachers);
      setFeedbackMsg({
        type: 'success',
        text: `Berhasil menarik ${result.teachers.length} data guru dari GitHub!`
      });
    } else {
      setFeedbackMsg({
        type: 'error',
        text: result.error || 'Gagal menarik data guru dari GitHub.'
      });
    }
  };

  const handlePushTeachers = async () => {
    if (!localConfig.token.trim()) {
      alert('Silakan masukkan Personal Access Token (PAT) GitHub terlebih dahulu.');
      setActiveTab('config');
      return;
    }

    if (!window.confirm(`Unggah & komit seluruh ${currentTeachers.length} data guru ke repositori ${localConfig.owner}/${localConfig.repo}?`)) {
      return;
    }

    setIsPushingTeachers(true);
    setFeedbackMsg(null);
    const message = `Sinkronisasi guru: ${currentTeachers.length} guru SDN 305 Maluku Tengah`;
    const result = await pushTeachersToGitHub(localConfig, currentTeachers, message);
    setIsPushingTeachers(false);

    if (result.success) {
      setFeedbackMsg({
        type: 'success',
        text: `Sukses! Berkas ${localConfig.filePath} di GitHub telah diperbarui.`,
        commitUrl: result.commitUrl
      });
      const updated = {
        ...localConfig,
        lastSyncedAt: new Date().toISOString(),
        lastCommitSha: result.commitSha,
        lastCommitUrl: result.commitUrl
      };
      setLocalConfig(updated);
      onSaveConfig(updated);
    } else {
      setFeedbackMsg({
        type: 'error',
        text: result.error || result.message || 'Gagal mengirim komit ke GitHub.'
      });
    }
  };

  // Offline Backup / Restore
  const handleDownloadOfflineJson = () => {
    const jsonStr = exportAllDataToJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sdn305_malukutengah_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleUploadOfflineJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const success = importAllDataFromJSON(text);
        if (success) {
          const parsed = JSON.parse(text);
          if (onAllSchoolDataUpdated) {
            onAllSchoolDataUpdated(parsed);
          }
          if (parsed.teachers) {
            onTeachersUpdated(parsed.teachers);
          }
          setFeedbackMsg({
            type: 'success',
            text: 'Berkas cadangan JSON berhasil diimpor dan seluruh data sekolah telah dipulihkan!'
          });
        } else {
          setFeedbackMsg({
            type: 'error',
            text: 'Format berkas JSON cadangan tidak valid.'
          });
        }
      } catch (err: any) {
        setFeedbackMsg({
          type: 'error',
          text: 'Gagal membaca berkas cadangan: ' + err.message
        });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleSaveAndClose = () => {
    onSaveConfig(localConfig);
    onClose();
  };

  const copyJsonPreview = () => {
    const targetData = previewMode === 'database' ? allSchoolData : currentTeachers;
    navigator.clipboard.writeText(JSON.stringify(targetData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isConfigured = Boolean(localConfig.owner && localConfig.repo && localConfig.token);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6 relative flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-lg font-bold">Sinkronisasi & Keamanan Data GitHub</h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  isConfigured ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {isConfigured ? 'Token Siap' : 'Token Belum Diisi'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Hubungkan ke repositori resmi agar seluruh data SDN 305 Maluku Tengah aman dan tidak hilang
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Repository Highlight Banner */}
        <div className="bg-emerald-950/40 border-b border-emerald-800/30 px-6 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-2 text-emerald-300">
            <GitBranch className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Target Repositori:</span>
            <span className="font-mono font-bold text-white bg-emerald-900/60 px-2 py-0.5 rounded">
              {localConfig.owner}/{localConfig.repo}
            </span>
            <span className="text-emerald-400 font-mono text-[11px]">({localConfig.branch})</span>
          </div>
          <a
            href={repoUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center space-x-1 text-emerald-400 hover:text-white font-bold underline text-[11px]"
          >
            <span>Buka di GitHub</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-2 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('database')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center space-x-2 cursor-pointer transition-colors whitespace-nowrap ${
              activeTab === 'database'
                ? 'border-emerald-600 text-emerald-800 bg-white rounded-t-lg border-t border-x border-slate-200'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Database Lengkap (Cloud)</span>
          </button>

          <button
            onClick={() => setActiveTab('teachers')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center space-x-2 cursor-pointer transition-colors whitespace-nowrap ${
              activeTab === 'teachers'
                ? 'border-emerald-600 text-emerald-800 bg-white rounded-t-lg border-t border-x border-slate-200'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Data Guru ({currentTeachers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('config')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center space-x-2 cursor-pointer transition-colors whitespace-nowrap ${
              activeTab === 'config'
                ? 'border-emerald-600 text-emerald-800 bg-white rounded-t-lg border-t border-x border-slate-200'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Pengaturan Token PAT</span>
          </button>

          <button
            onClick={() => setActiveTab('offline')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center space-x-2 cursor-pointer transition-colors whitespace-nowrap ${
              activeTab === 'offline'
                ? 'border-emerald-600 text-emerald-800 bg-white rounded-t-lg border-t border-x border-slate-200'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Cadangan Offline (.JSON)</span>
          </button>

          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center space-x-2 cursor-pointer transition-colors whitespace-nowrap ${
              activeTab === 'preview'
                ? 'border-emerald-600 text-emerald-800 bg-white rounded-t-lg border-t border-x border-slate-200'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5" />
            <span>Pratinjau JSON</span>
          </button>
        </div>

        {/* Global Feedback Banner */}
        {feedbackMsg && (
          <div className={`mx-6 mt-4 p-3.5 rounded-xl border flex items-start justify-between text-xs ${
            feedbackMsg.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}>
            <div className="flex items-start space-x-2">
              {feedbackMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div>
                <span className="font-semibold">{feedbackMsg.text}</span>
                {feedbackMsg.commitUrl && (
                  <div className="mt-1">
                    <a
                      href={feedbackMsg.commitUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center space-x-1 text-emerald-800 hover:text-emerald-950 underline font-mono text-[11px]"
                    >
                      <span>Lihat bukti komit di repositori GitHub</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => setFeedbackMsg(null)}
              className="text-slate-400 hover:text-slate-700 font-bold px-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          
          {/* TAB 1: FULL DATABASE (CLOUD) */}
          {activeTab === 'database' && (
            <div className="space-y-5">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
                <div className="flex items-center space-x-2 text-emerald-900 font-bold text-sm">
                  <Database className="w-4 h-4 text-emerald-700" />
                  <span>Perlindungan Data Menyeluruh SDN 305 Maluku Tengah</span>
                </div>
                <p className="text-emerald-800 text-xs leading-relaxed">
                  Fitur ini menjawab permintaan Anda: <strong>"hubungkan ke link ini agar data yang sudah saya isi tidak hilang begitu saja"</strong>.
                  Data sekolah (Profil, 35 Butir Instrumen Akreditasi IASP, Bukti Fisik, Guru, Sarpras, Berita, dan Siswa) akan disimpan langsung ke repositori GitHub <strong className="font-mono">{localConfig.owner}/{localConfig.repo}</strong> pada berkas <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-emerald-200">data/sdn305_database.json</code>.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Push Full Database Card */}
                <div className="p-5 rounded-2xl border-2 border-emerald-500/40 bg-emerald-50/40 flex flex-col justify-between hover:border-emerald-600 transition-all shadow-xs">
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div className="font-bold text-slate-900 text-sm">Amankan Seluruh Data ke GitHub (Push)</div>
                    <p className="text-slate-600 text-xs leading-relaxed">
                      Unggah seluruh database sekolah yang saat ini Anda isi ke repositori GitHub. Data akan tersimpan permanen di cloud GitHub dan tidak akan hilang meskipun browser dibersihkan atau ditutup.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handlePushDatabase}
                    disabled={isPushingDb}
                    className="mt-5 w-full py-3 bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-300 text-white font-bold rounded-xl flex items-center justify-center space-x-2 cursor-pointer shadow-xs transition-colors"
                  >
                    {isPushingDb ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Mengamankan ke GitHub...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        <span>Amankan & Komit Seluruh Data</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Pull Full Database Card */}
                <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col justify-between hover:border-slate-300 transition-all">
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-blue-700 text-white flex items-center justify-center">
                      <Download className="w-5 h-5" />
                    </div>
                    <div className="font-bold text-slate-900 text-sm">Tarik & Pulihkan Data dari GitHub (Pull)</div>
                    <p className="text-slate-600 text-xs leading-relaxed">
                      Ambil seluruh berkas database terbaru dari repositori GitHub dan perbarui tampilan aplikasi SDN 305 secara instan.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handlePullDatabase}
                    disabled={isPullingDb}
                    className="mt-5 w-full py-3 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-300 text-white font-bold rounded-xl flex items-center justify-center space-x-2 cursor-pointer shadow-xs transition-colors"
                  >
                    {isPullingDb ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Mengambil dari GitHub...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>Tarik & Pulihkan Seluruh Data</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TEACHERS ONLY */}
          {activeTab === 'teachers' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 flex items-start space-x-2.5">
                <Users className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <p className="text-xs leading-relaxed">
                  Sinkronisasi khusus dewan guru ke berkas <code className="font-mono bg-white px-1 py-0.5 rounded border border-slate-200 text-slate-900">{localConfig.filePath}</code>. Saat Anda mengedit guru di formulir, tombol komit GitHub juga otomatis tersedia.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Push Teachers */}
                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="font-bold text-slate-900 text-sm">Komit Semua Guru ({currentTeachers.length})</div>
                    <p className="text-slate-600 text-[11px]">
                      Simpan dan komit data guru saat ini ke <code className="font-mono">{localConfig.filePath}</code>.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handlePushTeachers}
                    disabled={isPushingTeachers}
                    className="mt-4 w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-300 text-white font-bold rounded-xl flex items-center justify-center space-x-2 cursor-pointer transition-colors"
                  >
                    {isPushingTeachers ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Mengunggah...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        <span>Komit Data Guru</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Pull Teachers */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="font-bold text-slate-900 text-sm">Tarik Data Guru</div>
                    <p className="text-slate-600 text-[11px]">
                      Ambil pembaruan guru dari berkas <code className="font-mono">{localConfig.filePath}</code> di GitHub.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handlePullTeachers}
                    disabled={isPullingTeachers}
                    className="mt-4 w-full py-2.5 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-300 text-white font-bold rounded-xl flex items-center justify-center space-x-2 cursor-pointer transition-colors"
                  >
                    {isPullingTeachers ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Menarik Guru...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5" />
                        <span>Tarik Guru dari GitHub</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CONFIG & TOKEN */}
          {activeTab === 'config' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 flex items-start space-x-3">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold">Personal Access Token (PAT) GitHub</div>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    Token GitHub diperlukan untuk melakukan komit (menyimpan berkas) ke repositori <strong>sdn305malteng/sdn305malukutengah</strong>. Pastikan token memiliki cakupan izin (scope) <strong>repo</strong>.
                  </p>
                  <a
                    href="https://github.com/settings/tokens/new?scopes=repo&description=SDN305-DataSekolah"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1 text-emerald-700 hover:text-emerald-900 font-bold underline text-[11px] pt-0.5"
                  >
                    <span>Klik di sini untuk membuat Personal Access Token di GitHub</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-bold text-slate-700 uppercase tracking-wider">
                      Personal Access Token (PAT)
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowToken(!showToken)}
                      className="text-[11px] text-emerald-700 hover:underline cursor-pointer"
                    >
                      {showToken ? 'Sembunyikan' : 'Tampilkan'}
                    </button>
                  </div>
                  <input
                    type={showToken ? 'text' : 'password'}
                    value={localConfig.token}
                    onChange={(e) => setLocalConfig({ ...localConfig, token: e.target.value })}
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Pemilik Akun / Organisasi
                    </label>
                    <input
                      type="text"
                      value={localConfig.owner}
                      onChange={(e) => setLocalConfig({ ...localConfig, owner: e.target.value })}
                      placeholder="sdn305malteng"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono font-bold focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Nama Repositori
                    </label>
                    <input
                      type="text"
                      value={localConfig.repo}
                      onChange={(e) => setLocalConfig({ ...localConfig, repo: e.target.value })}
                      placeholder="sdn305malukutengah"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono font-bold focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Branch Target
                    </label>
                    <input
                      type="text"
                      value={localConfig.branch}
                      onChange={(e) => setLocalConfig({ ...localConfig, branch: e.target.value })}
                      placeholder="main"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Berkas Database Lengkap
                    </label>
                    <input
                      type="text"
                      value={localConfig.databaseFilePath || 'data/sdn305_database.json'}
                      onChange={(e) => setLocalConfig({ ...localConfig, databaseFilePath: e.target.value })}
                      placeholder="data/sdn305_database.json"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Nama Penulis Komit
                    </label>
                    <input
                      type="text"
                      value={localConfig.authorName}
                      onChange={(e) => setLocalConfig({ ...localConfig, authorName: e.target.value })}
                      placeholder="Admin SDN 305 Maluku Tengah"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Email Penulis Komit
                    </label>
                    <input
                      type="email"
                      value={localConfig.authorEmail}
                      onChange={(e) => setLocalConfig({ ...localConfig, authorEmail: e.target.value })}
                      placeholder="ruslilussy789@gmail.com"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Connection Test Button */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleTestConnection}
                    disabled={isTesting || !localConfig.owner || !localConfig.repo}
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-bold rounded-xl shadow-xs cursor-pointer transition-colors"
                  >
                    {isTesting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Menguji ke GitHub API...</span>
                      </>
                    ) : (
                      <>
                        <GitBranch className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Uji Koneksi Repositori</span>
                      </>
                    )}
                  </button>

                  {localConfig.lastSyncedAt && (
                    <span className="text-[11px] text-slate-500">
                      Terakhir sinkron: {new Date(localConfig.lastSyncedAt).toLocaleString('id-ID')}
                    </span>
                  )}
                </div>

                {/* Test Result Display */}
                {testResult && (
                  <div className={`mt-3 p-4 rounded-xl border ${
                    testResult.success ? 'bg-emerald-50/80 border-emerald-200' : 'bg-rose-50 border-rose-200'
                  }`}>
                    {testResult.success ? (
                      <div className="space-y-2 text-slate-800">
                        <div className="flex items-center space-x-2 text-emerald-800 font-bold">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Repositori Terhubung: {testResult.repo?.fullName}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] bg-white p-2.5 rounded-lg border border-emerald-100">
                          <div>
                            <span className="text-slate-500">Akses: </span>
                            <span className="font-semibold">{testResult.repo?.private ? 'Privat' : 'Publik'}</span>
                          </div>
                          <div>
                            <span className="text-slate-500">Default Branch: </span>
                            <span className="font-mono font-semibold">{testResult.repo?.defaultBranch}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start space-x-2 text-rose-800">
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-bold">Koneksi Gagal</div>
                          <p className="text-[11px] mt-0.5 leading-relaxed">{testResult.error}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: OFFLINE BACKUP */}
          {activeTab === 'offline' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-700">
                <p className="text-xs leading-relaxed">
                  Selain penyimpanan cloud GitHub, Anda juga dapat mengunduh salinan berkas cadangan offline (.JSON) langsung ke komputer/laptop sekolah.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
                      <Download className="w-4 h-4" />
                    </div>
                    <div className="font-bold text-slate-900 text-sm">Unduh File Cadangan (.JSON)</div>
                    <p className="text-slate-600 text-[11px]">
                      Simpan seluruh data sekolah saat ini ke dalam satu file .JSON di laptop Anda.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleDownloadOfflineJson}
                    className="mt-4 w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl flex items-center justify-center space-x-2 cursor-pointer transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh File Cadangan</span>
                  </button>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center">
                      <Upload className="w-4 h-4" />
                    </div>
                    <div className="font-bold text-slate-900 text-sm">Pulihkan dari File (.JSON)</div>
                    <p className="text-slate-600 text-[11px]">
                      Pulihkan seluruh data sekolah dari file cadangan yang sebelumnya pernah Anda unduh.
                    </p>
                  </div>
                  <label className="mt-4 w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl flex items-center justify-center space-x-2 cursor-pointer transition-colors text-center">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Pilih File Cadangan JSON</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleUploadOfflineJson}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: JSON PREVIEW */}
          {activeTab === 'preview' && (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setPreviewMode('database')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                      previewMode === 'database' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    Database Lengkap
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewMode('teachers')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                      previewMode === 'teachers' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    Dewan Guru ({currentTeachers.length})
                  </button>
                </div>

                <button
                  type="button"
                  onClick={copyJsonPreview}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg flex items-center space-x-1.5 cursor-pointer transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Tersalin!' : 'Salin JSON'}</span>
                </button>
              </div>

              <div className="bg-slate-900 text-slate-100 font-mono text-[11px] p-4 rounded-xl max-h-80 overflow-y-auto leading-relaxed">
                <pre>
                  {JSON.stringify(
                    previewMode === 'database' ? allSchoolData : currentTeachers,
                    null,
                    2
                  )}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-slate-500">
            {localConfig.lastCommitSha && (
              <span className="font-mono">
                Commit: {localConfig.lastCommitSha.slice(0, 7)}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 font-semibold rounded-xl text-xs cursor-pointer"
            >
              Tutup
            </button>
            <button
              type="button"
              onClick={handleSaveAndClose}
              className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-xs cursor-pointer transition-colors"
            >
              Simpan Pengaturan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
