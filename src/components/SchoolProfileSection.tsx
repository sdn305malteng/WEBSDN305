import React from 'react';
import {
  SchoolProfile,
  StudentCohort
} from '../types';
import {
  Compass,
  Target,
  Check,
  Building,
  Users,
  Quote,
  ShieldCheck
} from 'lucide-react';

interface SchoolProfileSectionProps {
  profile: SchoolProfile;
  studentCohorts: StudentCohort[];
}

export const SchoolProfileSection: React.FC<SchoolProfileSectionProps> = ({
  profile,
  studentCohorts
}) => {
  const totalMale = studentCohorts.reduce((acc, c) => acc + c.male, 0);
  const totalFemale = studentCohorts.reduce((acc, c) => acc + c.female, 0);
  const grandTotal = studentCohorts.reduce((acc, c) => acc + c.total, 0);

  return (
    <section id="profil" className="py-16 lg:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Profil Resmi Satuan Pendidikan</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Mengenal Lebih Dekat SDN 305 Maluku Tengah
          </h2>
          <p className="text-base text-slate-600 mt-3 leading-relaxed">
            Berkomitmen mewujudkan pelayanan pendidikan berkualitas, adil, berkarakter, dan berdaya saing bagi anak-anak bangsa di Kabupaten Maluku Tengah.
          </p>
        </div>

        {/* Headmaster Welcome Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 lg:p-10 border border-slate-200/80 shadow-xs mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-4 flex flex-col items-center text-center">
              <div className="relative w-44 h-44 rounded-2xl overflow-hidden shadow-lg border-4 border-emerald-50 mb-4 bg-slate-100">
                <img
                  src={profile.headmasterPhotoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400"}
                  alt={profile.headmasterName}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="text-lg font-bold text-slate-900">{profile.headmasterName}</h3>
              <p className="text-xs font-semibold text-emerald-700 mt-0.5">Kepala SDN 305 Maluku Tengah</p>
              <p className="text-xs text-slate-500 mt-0.5">NIP. {profile.headmasterNip}</p>
            </div>

            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center space-x-2 text-emerald-700">
                <Quote className="w-8 h-8 opacity-40 rotate-180" />
                <span className="text-xs font-bold uppercase tracking-wider">Sambutan Kepala Satuan Pendidikan</span>
              </div>
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed italic font-serif">
                "{profile.headmasterSpeech}"
              </p>
              <div className="pt-2 flex items-center space-x-3 text-xs text-slate-500 font-medium">
                <span className="bg-slate-100 px-3 py-1 rounded-md">Motto: {profile.motto}</span>
              </div>
            </div>

          </div>
        </div>

        {/* Vision & Mission Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          
          {/* Vision Card */}
          <div className="bg-emerald-900 text-white rounded-2xl p-8 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-800 flex items-center justify-center text-amber-300 mb-6">
                <Compass className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">Arah & Pandangan Masa Depan</span>
              <h3 className="text-2xl font-black tracking-tight text-white mt-1 mb-4">Visi Sekolah</h3>
              <p className="text-lg text-emerald-100 font-medium leading-relaxed bg-emerald-950/40 p-5 rounded-xl border border-emerald-700/50">
                "{profile.vision}"
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-emerald-800 text-xs text-emerald-300 flex justify-between items-center">
              <span>Kurikulum: {profile.curriculum}</span>
              <span className="font-semibold text-amber-300">Target Akreditasi A (Unggul)</span>
            </div>
          </div>

          {/* Mission Card */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 mb-6">
                <Target className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Langkah Operasional</span>
              <h3 className="text-2xl font-black tracking-tight text-slate-900 mt-1 mb-4">Misi Sekolah</h3>
              
              <ul className="space-y-3">
                {profile.missions.map((mission, index) => (
                  <li key={index} className="flex items-start space-x-3 text-sm text-slate-700">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <span className="leading-snug">{mission}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Strategic Goals Mini Section */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Tujuan Strategis:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                {profile.goals.map((g, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{g}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Official Identity & Student Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Identity Table */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
            <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Identitas Satuan Pendidikan Resmi</h3>
                <p className="text-xs text-slate-500">Data Pokok Pendidikan (Dapodik Kemdikbudristek)</p>
              </div>
            </div>

            <div className="divide-y divide-slate-100 text-sm">
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-500">Nama Sekolah</span>
                <span className="font-semibold text-slate-900 text-right">{profile.name}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-500">Nomor Pokok Sekolah Nasional (NPSN)</span>
                <span className="font-mono font-bold text-emerald-700">{profile.npsn}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-500">Nomor Statistik Sekolah (NSS)</span>
                <span className="font-mono text-slate-800">{profile.nss}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-500">Bentuk Pendidikan & Status</span>
                <span className="font-medium text-slate-800">{profile.status} (Pemerintah Kabupaten Maluku Tengah)</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-500">Kurikulum yang Diterapkan</span>
                <span className="font-medium text-slate-800">{profile.curriculum}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-500">Alamat Lengkap</span>
                <span className="font-medium text-slate-800 text-right max-w-xs">{profile.address}, {profile.village}, Kec. {profile.district}, {profile.regency}, {profile.province} {profile.postalCode}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-500">Kontak Resmi / Telepon</span>
                <span className="font-medium text-slate-800">{profile.phone} / {profile.email}</span>
              </div>
            </div>
          </div>

          {/* Student Cohort Breakdown */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
            <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Peserta Didik per Rombel</h3>
                <p className="text-xs text-slate-500">Tahun Ajaran 2025/2026 Semester Genap</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                    <th className="py-2.5 px-3">Rombel</th>
                    <th className="py-2.5 px-3 text-center">L</th>
                    <th className="py-2.5 px-3 text-center">P</th>
                    <th className="py-2.5 px-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {studentCohorts.map((cohort, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-2 px-3 font-semibold text-slate-800">{cohort.grade}</td>
                      <td className="py-2 px-3 text-center text-slate-600">{cohort.male}</td>
                      <td className="py-2 px-3 text-center text-slate-600">{cohort.female}</td>
                      <td className="py-2 px-3 text-right font-bold text-emerald-800">{cohort.total} siswa</td>
                    </tr>
                  ))}
                  <tr className="bg-emerald-50/70 font-bold text-slate-900">
                    <td className="py-2.5 px-3">Jumlah Total</td>
                    <td className="py-2.5 px-3 text-center text-emerald-900">{totalMale}</td>
                    <td className="py-2.5 px-3 text-center text-emerald-900">{totalFemale}</td>
                    <td className="py-2.5 px-3 text-right text-emerald-900">{grandTotal} siswa</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4 p-3 bg-slate-50 rounded-xl text-slate-600 text-xs flex justify-between items-center">
              <span>Rasio Guru : Siswa = 1 : 16</span>
              <span className="font-semibold text-emerald-700">6 Rombel Aktif</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
