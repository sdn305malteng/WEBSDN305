import React from 'react';
import {
  Award,
  Users,
  Building2,
  FileCheck2,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  CheckCircle2
} from 'lucide-react';
import { SchoolProfile } from '../types';

interface HeroSectionProps {
  profile: SchoolProfile;
  stats: {
    score: number;
    percentage: number;
    complete: number;
    revision: number;
    pending: number;
    total: number;
    grade: string;
  };
  totalStudents: number;
  totalTeachers: number;
  totalFacilities: number;
  onOpenAdmin: () => void;
  onNavigateToAccreditation: () => void;
  onPrintPreview: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  profile,
  stats,
  totalStudents,
  totalTeachers,
  totalFacilities,
  onOpenAdmin,
  onNavigateToAccreditation,
  onPrintPreview
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-900 text-white py-16 lg:py-24 border-b border-emerald-900/50">
      {/* Background Decorative Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Heading & School Mission Intro */}
          <div className="lg:col-span-7 space-y-6">
            {/* Accreditation Badge */}
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-semibold backdrop-blur-xs">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Menyongsong Visitasi BAN-S/M 2026 • Target Akreditasi A (Unggul)</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Pusat Pendidikan & Tata Kelola Mutu{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-200">
                SDN 305 Maluku Tengah
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              Mewujudkan lingkungan belajar yang berkarakter, inklusif, dan berakar pada kearifan budaya Maluku.
              Dipadukan dengan sistem digital manajemen bukti fisik akreditasi IASP SD untuk memastikan transparansi dan akuntabilitas mutu.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={onOpenAdmin}
                className="inline-flex items-center space-x-2 px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-emerald-900/30 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Kelola Akreditasi (Admin)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onNavigateToAccreditation}
                className="inline-flex items-center space-x-2 px-5 py-3.5 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-600/60 text-white font-semibold text-sm rounded-xl backdrop-blur-xs transition-colors cursor-pointer"
              >
                <FileCheck2 className="w-4 h-4 text-amber-400" />
                <span>Lihat 4 Komponen IASP</span>
              </button>

              <button
                onClick={onPrintPreview}
                className="inline-flex items-center space-x-2 px-4 py-3.5 bg-slate-800/40 hover:bg-slate-800 text-slate-300 hover:text-white text-sm font-medium rounded-xl border border-slate-700 transition-colors cursor-pointer"
              >
                <span>Cetak Portofolio</span>
              </button>
            </div>

            {/* Verification highlights */}
            <div className="pt-4 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-400">
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>KOSP Kurikulum Merdeka</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>TPPK Ramah Anak Resmi</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Dapodik & BOS Terverifikasi</span>
              </span>
            </div>
          </div>

          {/* Right Column: Accreditation Readiness Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-emerald-500/30 p-6 shadow-2xl backdrop-blur-md">
              
              {/* Card Header */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-700/60">
                <div>
                  <div className="text-xs uppercase tracking-wider text-emerald-400 font-bold">
                    Instrumen Akreditasi Satuan Pendidikan (IASP)
                  </div>
                  <h3 className="text-lg font-bold text-white mt-0.5">
                    Indeks Kesiapan Visitasi
                  </h3>
                </div>
                <div className="flex items-center space-x-1 bg-amber-400/10 border border-amber-400/30 px-2.5 py-1 rounded-lg">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-amber-300">Grade: {stats.grade}</span>
                </div>
              </div>

              {/* Score & Progress Bar */}
              <div className="my-5">
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-xs text-slate-400">Kelengkapan Bukti Fisik</span>
                  <span className="text-2xl font-black text-emerald-400">{stats.percentage}%</span>
                </div>
                <div className="w-full bg-slate-700/70 h-3 rounded-full overflow-hidden p-0.5">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(5, stats.percentage))}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 mt-2">
                  <span>{stats.complete} dari {stats.total} butir lengkap</span>
                  <span>Simulasi Skor: <strong className="text-white">{stats.score} / 100</strong></span>
                </div>
              </div>

              {/* Status Breakdown Grid */}
              <div className="grid grid-cols-3 gap-2.5 pt-2 text-center">
                <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-3">
                  <div className="text-xl font-bold text-emerald-400">{stats.complete}</div>
                  <div className="text-[11px] text-slate-300 font-medium mt-0.5">Dokumen Lengkap</div>
                </div>
                <div className="bg-amber-950/30 border border-amber-500/30 rounded-xl p-3">
                  <div className="text-xl font-bold text-amber-400">{stats.revision}</div>
                  <div className="text-[11px] text-slate-300 font-medium mt-0.5">Perlu Perbaikan</div>
                </div>
                <div className="bg-rose-950/30 border border-rose-500/30 rounded-xl p-3">
                  <div className="text-xl font-bold text-rose-400">{stats.pending}</div>
                  <div className="text-[11px] text-slate-300 font-medium mt-0.5">Belum Lengkap</div>
                </div>
              </div>

              {/* Principal & Info Footer inside card */}
              <div className="mt-5 pt-4 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-300">
                <div>
                  <div className="text-slate-400 text-[10px]">Kepala Sekolah:</div>
                  <div className="font-semibold text-white">{profile.headmasterName}</div>
                </div>
                <button
                  onClick={onOpenAdmin}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-colors cursor-pointer text-xs"
                >
                  Kelola Berkas &rarr;
                </button>
              </div>

            </div>
          </div>

        </div>

        {/* Bottom Key Metric Counters */}
        <div className="mt-14 pt-8 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white leading-none">{totalStudents}</div>
              <div className="text-xs text-slate-400 mt-1">Peserta Didik (6 Rombel)</div>
            </div>
          </div>

          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-lg bg-teal-500/20 flex items-center justify-center text-teal-400 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white leading-none">{totalTeachers}</div>
              <div className="text-xs text-slate-400 mt-1">Pendidik & Tendik (GTK)</div>
            </div>
          </div>

          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white leading-none">{totalFacilities}</div>
              <div className="text-xs text-slate-400 mt-1">Fasilitas & Sarpras Terdata</div>
            </div>
          </div>

          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white leading-none">{stats.total} Butir</div>
              <div className="text-xs text-slate-400 mt-1">Standar IASP Terpetakan</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
