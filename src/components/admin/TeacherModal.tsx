import React, { useState, useEffect } from 'react';
import { X, UserPlus, Users, FolderGit2, GitBranch, CheckCircle2, AlertCircle, ExternalLink, Loader2 } from 'lucide-react';
import { GitHubConfig, Teacher } from '../../types';
import { ImageUploadField } from './ImageUploadField';

interface TeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (teacher: Teacher) => void;
  onSaveWithGitHub?: (teacher: Teacher, commitToGitHub: boolean, commitMessage?: string) => Promise<{ success: boolean; commitUrl?: string; message?: string; error?: string }>;
  initialTeacher?: Teacher | null;
  githubConfig?: GitHubConfig;
  onOpenGitHubConfig?: () => void;
}

export const TeacherModal: React.FC<TeacherModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onSaveWithGitHub,
  initialTeacher,
  githubConfig,
  onOpenGitHubConfig
}) => {
  const [name, setName] = useState('');
  const [nip, setNip] = useState('');
  const [nuptk, setNuptk] = useState('');
  const [role, setRole] = useState('Guru Kelas');
  const [education, setEducation] = useState('S1 PGSD');
  const [certificationStatus, setCertificationStatus] = useState<'Tersertifikasi' | 'Dalam Proses' | 'Belum'>('Tersertifikasi');
  const [gender, setGender] = useState<'Laki-laki' | 'Perempuan'>('Perempuan');
  const [assignedClass, setAssignedClass] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [achievementsText, setAchievementsText] = useState('');

  // GitHub Sync State
  const hasGitHubToken = Boolean(githubConfig?.token && githubConfig.token.trim().length > 0);
  const [commitToGitHub, setCommitToGitHub] = useState(hasGitHubToken);
  const [commitMessage, setCommitMessage] = useState('');
  const [isSubmittingWithGitHub, setIsSubmittingWithGitHub] = useState(false);
  const [githubFeedback, setGithubFeedback] = useState<{ type: 'success' | 'error'; text: string; commitUrl?: string } | null>(null);

  useEffect(() => {
    if (initialTeacher) {
      setName(initialTeacher.name);
      setNip(initialTeacher.nip);
      setNuptk(initialTeacher.nuptk || '');
      setRole(initialTeacher.role);
      setEducation(initialTeacher.education);
      setCertificationStatus(initialTeacher.certificationStatus);
      setGender(initialTeacher.gender);
      setAssignedClass(initialTeacher.assignedClass || '');
      setPhotoUrl(initialTeacher.photoUrl || '');
      setAchievementsText(initialTeacher.achievements ? initialTeacher.achievements.join(', ') : '');
      setCommitMessage(`Perbarui data guru: ${initialTeacher.name} (${initialTeacher.nip}) - SDN 305 Maluku Tengah`);
    } else {
      setName('');
      setNip('');
      setNuptk('');
      setRole('Guru Kelas');
      setEducation('S1 PGSD');
      setCertificationStatus('Tersertifikasi');
      setGender('Perempuan');
      setAssignedClass('Kelas I');
      setPhotoUrl('');
      setAchievementsText('');
      setCommitMessage('Tambah data guru baru - SDN 305 Maluku Tengah');
    }
    setCommitToGitHub(Boolean(githubConfig?.token && githubConfig.token.trim().length > 0));
    setGithubFeedback(null);
    setIsSubmittingWithGitHub(false);
  }, [initialTeacher, isOpen, githubConfig?.token]);

  if (!isOpen) return null;

  const buildTeacherObject = (): Teacher => {
    const achs = achievementsText
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    return {
      id: initialTeacher ? initialTeacher.id : `t-${Date.now()}`,
      name: name.trim(),
      nip: nip.trim(),
      nuptk: nuptk.trim() || undefined,
      role: role.trim(),
      education: education.trim(),
      certificationStatus,
      gender,
      assignedClass: assignedClass.trim() || undefined,
      photoUrl: photoUrl.trim() || undefined,
      achievements: achs.length > 0 ? achs : undefined
    };
  };

  const handleSaveLocalOnly = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const updatedTeacher = buildTeacherObject();
    onSave(updatedTeacher);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedTeacher = buildTeacherObject();

    if (commitToGitHub && onSaveWithGitHub && hasGitHubToken) {
      setIsSubmittingWithGitHub(true);
      setGithubFeedback(null);
      try {
        const res = await onSaveWithGitHub(updatedTeacher, true, commitMessage);
        setIsSubmittingWithGitHub(false);
        if (res.success) {
          setGithubFeedback({
            type: 'success',
            text: res.message || 'Data guru berhasil disimpan dan dikomit ke GitHub!',
            commitUrl: res.commitUrl
          });
          setTimeout(() => {
            onClose();
          }, 1400);
        } else {
          setGithubFeedback({
            type: 'error',
            text: res.error || 'Gagal komit ke GitHub. Data tetap disimpan di penyimpanan lokal aplikasi.'
          });
        }
      } catch (err: any) {
        setIsSubmittingWithGitHub(false);
        setGithubFeedback({
          type: 'error',
          text: err?.message || 'Terjadi kesalahan saat komit ke GitHub.'
        });
      }
    } else {
      onSave(updatedTeacher);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 sm:p-8 my-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              {initialTeacher ? 'Edit Data Guru & Tendik' : 'Tambah Guru & Tendik Baru'}
            </h3>
            <p className="text-xs text-slate-500">
              SD Negeri 305 Maluku Tengah
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Nama Lengkap & Gelar
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Fatimah Patty, S.Pd."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden text-xs"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                NIP (Nomor Induk Pegawai)
              </label>
              <input
                type="text"
                value={nip}
                onChange={(e) => setNip(e.target.value)}
                placeholder="19810815 200604 2 018"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden text-xs"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                NUPTK (Jika Ada)
              </label>
              <input
                type="text"
                value={nuptk}
                onChange={(e) => setNuptk(e.target.value)}
                placeholder="4532759660300013"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Jabatan / Tugas Mengajar
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Guru Kelas I / Guru PAI"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden text-xs"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Rombel / Tugas Tambahan
              </label>
              <input
                type="text"
                value={assignedClass}
                onChange={(e) => setAssignedClass(e.target.value)}
                placeholder="Kelas 1 (Fase A) / Koord. P5"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Pendidikan Terakhir
              </label>
              <input
                type="text"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                placeholder="S1 PGSD / S2 Manajemen"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden text-xs"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Status Sertifikasi Pendidik
              </label>
              <select
                value={certificationStatus}
                onChange={(e) => setCertificationStatus(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden text-xs"
              >
                <option value="Tersertifikasi">Tersertifikasi</option>
                <option value="Dalam Proses">Dalam Proses (PPG)</option>
                <option value="Belum">Belum Sertifikasi</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Jenis Kelamin
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden text-xs"
              >
                <option value="Perempuan">Perempuan</option>
                <option value="Laki-laki">Laki-laki</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Prestasi / Penghargaan (Pisahkan koma)
              </label>
              <input
                type="text"
                value={achievementsText}
                onChange={(e) => setAchievementsText(e.target.value)}
                placeholder="Guru Penggerak, Finalis Inovasi..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden text-xs"
              />
            </div>
          </div>

          <div className="pt-1">
            <ImageUploadField
              label="Foto Profil Guru / Tenaga Kependidikan"
              value={photoUrl}
              onChange={setPhotoUrl}
              placeholder="Tempel link URL foto atau klik tombol Pilih File Foto"
              helperText="Upload pas foto resmi atau foto kegiatan mengajar dari perangkat Anda."
            />
          </div>

          {/* GITHUB INTEGRATION PANEL */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 font-bold text-slate-800">
                <FolderGit2 className="w-4 h-4 text-emerald-700" />
                <span>Koneksi Repositori GitHub</span>
              </div>
              {onOpenGitHubConfig && (
                <button
                  type="button"
                  onClick={onOpenGitHubConfig}
                  className="text-[11px] text-emerald-700 hover:text-emerald-900 font-semibold underline cursor-pointer"
                >
                  {hasGitHubToken ? 'Ubah Pengaturan' : 'Hubungkan GitHub'}
                </button>
              )}
            </div>

            {hasGitHubToken ? (
              <div className="space-y-2 text-[11px]">
                <div className="flex items-center justify-between text-slate-600 bg-white p-2 rounded-lg border border-slate-200">
                  <span>Target: <strong className="font-mono text-slate-800">{githubConfig?.owner}/{githubConfig?.repo}</strong> ({githubConfig?.branch})</span>
                  <span className="font-mono text-[10px] text-slate-500">{githubConfig?.filePath}</span>
                </div>

                <label className="flex items-center space-x-2 cursor-pointer font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={commitToGitHub}
                    onChange={(e) => setCommitToGitHub(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                  />
                  <span>Komit perubahan ini langsung ke GitHub saat disimpan</span>
                </label>

                {commitToGitHub && (
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-600 mb-0.5">
                      Pesan Komit (Commit Message)
                    </label>
                    <input
                      type="text"
                      value={commitMessage}
                      onChange={(e) => setCommitMessage(e.target.value)}
                      placeholder="Pesan komit..."
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-800 font-mono text-[11px] focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="text-[11px] text-slate-600 flex items-start space-x-2 bg-white p-2 rounded-lg border border-slate-200">
                <GitBranch className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  Token GitHub belum diatur. Anda dapat menyimpan perubahan ke lokal, atau hubungkan GitHub untuk sinkronisasi otomatis.
                </div>
              </div>
            )}

            {/* GitHub Feedback Status */}
            {githubFeedback && (
              <div className={`p-2.5 rounded-lg border flex items-start space-x-2 text-[11px] ${
                githubFeedback.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}>
                {githubFeedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1">
                  <div>{githubFeedback.text}</div>
                  {githubFeedback.commitUrl && (
                    <a
                      href={githubFeedback.commitUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center space-x-1 font-bold underline text-emerald-800"
                    >
                      <span>Buka komit di GitHub</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="pt-3 flex flex-wrap items-center justify-end gap-2 border-t border-slate-200 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmittingWithGitHub}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 rounded-xl font-bold transition-colors cursor-pointer"
            >
              Batal
            </button>

            {hasGitHubToken && commitToGitHub ? (
              <button
                type="submit"
                disabled={isSubmittingWithGitHub}
                className="inline-flex items-center space-x-2 px-5 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-400 text-white rounded-xl font-bold shadow-xs transition-colors cursor-pointer"
              >
                {isSubmittingWithGitHub ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Mengirim Komit ke GitHub...</span>
                  </>
                ) : (
                  <>
                    <FolderGit2 className="w-4 h-4 text-amber-300" />
                    <span>Simpan & Komit ke GitHub</span>
                  </>
                )}
              </button>
            ) : (
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold shadow-xs transition-colors cursor-pointer"
              >
                Simpan Data GTK
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
