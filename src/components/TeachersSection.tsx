import React, { useState } from 'react';
import {
  Users,
  Award,
  GraduationCap,
  Briefcase,
  CheckCircle,
  Clock,
  ShieldAlert
} from 'lucide-react';
import { Teacher } from '../types';

interface TeachersSectionProps {
  teachers: Teacher[];
  onOpenAdmin: () => void;
}

export const TeachersSection: React.FC<TeachersSectionProps> = ({
  teachers,
  onOpenAdmin
}) => {
  const [filter, setFilter] = useState<'all' | 'kelas' | 'mapel' | 'tendik'>('all');

  const filteredTeachers = teachers.filter((t) => {
    if (filter === 'kelas') return t.role.includes('Guru Kelas') || t.role.includes('Kepala Sekolah');
    if (filter === 'mapel') return t.role.includes('Agama') || t.role.includes('PJOK');
    if (filter === 'tendik') return t.role.includes('Operator') || t.role.includes('Perpustakaan') || t.role.includes('Administrasi');
    return true;
  });

  const certifiedCount = teachers.filter(t => t.certificationStatus === 'Tersertifikasi').length;

  return (
    <section id="gtk" className="py-16 lg:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>Pendidik & Tenaga Kependidikan</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Dewan Guru & Tenaga Kependidikan SDN 305
          </h2>
          <p className="text-base text-slate-600 mt-3 leading-relaxed">
            Didukung oleh {teachers.length} tenaga pendidik dan kependidikan berdedikasi tinggi, {certifiedCount} diantaranya telah tersertifikasi pendidik profesional.
          </p>
        </div>

        {/* Filter Pills & Summary */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                filter === 'all'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Semua GTK ({teachers.length})
            </button>
            <button
              onClick={() => setFilter('kelas')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                filter === 'kelas'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Kepsek & Guru Kelas
            </button>
            <button
              onClick={() => setFilter('mapel')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                filter === 'mapel'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Guru Mapel (PAI & PJOK)
            </button>
            <button
              onClick={() => setFilter('tendik')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                filter === 'tendik'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Tenaga Kependidikan / TIK
            </button>
          </div>

          <button
            onClick={onOpenAdmin}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 underline underline-offset-4 cursor-pointer"
          >
            Kelola Guru di Panel Admin &rarr;
          </button>
        </div>

        {/* Teachers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTeachers.map((teacher) => (
            <div
              key={teacher.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Photo & Role Header */}
                <div className="relative h-44 bg-slate-100 overflow-hidden">
                  <img
                    src={teacher.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'}
                    alt={teacher.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  
                  {/* Certification Badge */}
                  <div className="absolute top-3 right-3">
                    <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-xs ${
                      teacher.certificationStatus === 'Tersertifikasi'
                        ? 'bg-emerald-500 text-white'
                        : teacher.certificationStatus === 'Dalam Proses'
                        ? 'bg-amber-400 text-slate-900'
                        : 'bg-slate-600 text-white'
                    }`}>
                      {teacher.certificationStatus === 'Tersertifikasi' ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <Clock className="w-3 h-3" />
                      )}
                      <span>{teacher.certificationStatus}</span>
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <p className="text-xs text-amber-300 font-semibold">{teacher.role}</p>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 space-y-2.5">
                  <h4 className="font-bold text-slate-900 text-base leading-snug">{teacher.name}</h4>
                  
                  <div className="space-y-1 text-xs text-slate-600">
                    <div className="flex items-center space-x-2">
                      <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-mono text-slate-700">NIP: {teacher.nip}</span>
                    </div>
                    {teacher.nuptk && (
                      <div className="flex items-center space-x-2">
                        <Award className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-mono text-slate-500 text-[11px]">NUPTK: {teacher.nuptk}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{teacher.education}</span>
                    </div>
                  </div>

                  {teacher.achievements && teacher.achievements.length > 0 && (
                    <div className="pt-2">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Prestasi / Peran Tambahan:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {teacher.achievements.map((ach, aIdx) => (
                          <span key={aIdx} className="bg-emerald-50 text-emerald-800 text-[11px] px-2 py-0.5 rounded-md font-medium">
                            {ach}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {teacher.assignedClass && (
                <div className="p-3 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between items-center">
                  <span>Tugas Utama:</span>
                  <span className="font-semibold text-slate-700">{teacher.assignedClass}</span>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
