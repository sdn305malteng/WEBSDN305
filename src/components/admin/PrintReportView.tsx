import React from 'react';
import { Printer, X, Download, ShieldCheck } from 'lucide-react';
import {
  SchoolProfile,
  AccreditationItem,
  AccreditationComponent
} from '../../types';

interface PrintReportViewProps {
  profile: SchoolProfile;
  components: AccreditationComponent[];
  items: AccreditationItem[];
  stats: {
    score: number;
    percentage: number;
    complete: number;
    revision: number;
    pending: number;
    total: number;
    grade: string;
  };
  onClose: () => void;
}

export const PrintReportView: React.FC<PrintReportViewProps> = ({
  profile,
  components,
  items,
  stats,
  onClose
}) => {
  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex flex-col items-center justify-start overflow-y-auto p-4 sm:p-6 print:p-0 print:bg-white print:static print:inset-auto">
      
      {/* Top Action Bar (Hidden during Print) */}
      <div className="w-full max-w-4xl bg-slate-800 text-white rounded-xl p-4 mb-4 flex items-center justify-between shadow-lg print:hidden">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-bold">
            Pratinjau Lembar Cetak Portofolio Akreditasi IASP (Format Cetak / PDF)
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-lg flex items-center space-x-2 cursor-pointer transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / Simpan PDF</span>
          </button>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Printable Sheet (Standard A4 Paper Styling) */}
      <div className="w-full max-w-4xl bg-white text-slate-900 shadow-2xl p-8 sm:p-12 print:shadow-none print:p-0 print:max-w-none">
        
        {/* Kop Surat Resmi */}
        <div className="border-b-4 border-double border-slate-900 pb-4 mb-6 text-center">
          <div className="text-sm sm:text-base font-bold tracking-wider uppercase text-slate-800">
            Pemerintah Kabupaten Maluku Tengah
          </div>
          <div className="text-base sm:text-lg font-extrabold tracking-wider uppercase text-slate-900">
            Dinas Pendidikan dan Kebudayaan
          </div>
          <div className="text-xl sm:text-2xl font-black tracking-tight uppercase text-emerald-950 my-0.5">
            {profile.name}
          </div>
          <div className="text-xs text-slate-600">
            NPSN: {profile.npsn} | NSS: {profile.nss} | Akreditasi Saat Ini: B (Target: A)
          </div>
          <div className="text-xs text-slate-600 italic">
            Alamat: {profile.address}, {profile.village}, Kec. {profile.district}, Kab. {profile.regency}, Prov. {profile.province} - Kode Pos {profile.postalCode}
          </div>
          <div className="text-[11px] text-slate-500">
            Email: {profile.email} | Kontak Resmi: {profile.phone}
          </div>
        </div>

        {/* Document Title */}
        <div className="text-center my-6">
          <h2 className="text-base sm:text-lg font-black uppercase underline decoration-2 underline-offset-4 tracking-tight">
            Laporan Evaluasi Diri Sekolah & Pemetaan Kesiapan Akreditasi IASP
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Tahun Ajaran 2025/2026 - Periode Persiapan Visitasi Asesor BAN-S/M
          </p>
        </div>

        {/* Section 1: Ringkasan Nilai & Predikat */}
        <div className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2 border-b border-slate-300 pb-1">
            I. Rekapitulasi Capaian Skor Simulasi IASP
          </h3>

          <div className="grid grid-cols-4 gap-2 mb-4 text-center text-xs">
            <div className="border border-slate-300 p-2.5 rounded-lg bg-slate-50">
              <div className="text-slate-500 text-[10px]">Simulasi Skor Akhir</div>
              <div className="text-xl font-bold text-slate-900">{stats.score} / 100</div>
            </div>
            <div className="border border-slate-300 p-2.5 rounded-lg bg-slate-50">
              <div className="text-slate-500 text-[10px]">Predikat Akreditasi</div>
              <div className="text-xl font-bold text-emerald-700">{stats.grade} (Unggul)</div>
            </div>
            <div className="border border-slate-300 p-2.5 rounded-lg bg-slate-50">
              <div className="text-slate-500 text-[10px]">Keterpenuhan Dokumen</div>
              <div className="text-xl font-bold text-slate-900">{stats.percentage}%</div>
            </div>
            <div className="border border-slate-300 p-2.5 rounded-lg bg-slate-50">
              <div className="text-slate-500 text-[10px]">Status Berkas Lengkap</div>
              <div className="text-xl font-bold text-emerald-700">{stats.complete} dari {stats.total}</div>
            </div>
          </div>

          <table className="w-full text-xs text-left border-collapse border border-slate-300">
            <thead>
              <tr className="bg-slate-100 font-bold">
                <th className="border border-slate-300 p-2 text-center w-12">No</th>
                <th className="border border-slate-300 p-2">Komponen Penilaian IASP</th>
                <th className="border border-slate-300 p-2 text-center w-24">Bobot (%)</th>
                <th className="border border-slate-300 p-2 text-center w-28">Jumlah Butir</th>
                <th className="border border-slate-300 p-2 text-center w-28">Kelengkapan</th>
                <th className="border border-slate-300 p-2 text-center w-24">Target Skor</th>
              </tr>
            </thead>
            <tbody>
              {components.map((c, idx) => {
                const compItems = items.filter(i => i.componentId === c.id);
                const complete = compItems.filter(i => i.status === 'Lengkap').length;
                const perc = compItems.length > 0 ? Math.round((complete / compItems.length) * 100) : 0;

                return (
                  <tr key={c.id}>
                    <td className="border border-slate-300 p-2 text-center">{idx + 1}</td>
                    <td className="border border-slate-300 p-2 font-medium">{c.title}</td>
                    <td className="border border-slate-300 p-2 text-center">{c.weight}%</td>
                    <td className="border border-slate-300 p-2 text-center">{compItems.length} Butir</td>
                    <td className="border border-slate-300 p-2 text-center font-bold text-emerald-800">
                      {complete} / {compItems.length} ({perc}%)
                    </td>
                    <td className="border border-slate-300 p-2 text-center font-bold">{c.targetScore}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Section 2: Matriks 35 Butir Instrumen */}
        <div className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2 border-b border-slate-300 pb-1">
            II. Matriks Pemetaan Dokumen Bukti Fisik Per Butir
          </h3>

          <table className="w-full text-[11px] text-left border-collapse border border-slate-300">
            <thead>
              <tr className="bg-slate-100 font-bold">
                <th className="border border-slate-300 p-1.5 text-center w-10">No</th>
                <th className="border border-slate-300 p-1.5 w-44">Butir Penilaian</th>
                <th className="border border-slate-300 p-1.5">Bukti Fisik / Dokumen Acuan</th>
                <th className="border border-slate-300 p-1.5 text-center w-24">Status</th>
                <th className="border border-slate-300 p-1.5 text-center w-16">Level</th>
                <th className="border border-slate-300 p-1.5 w-32">Penanggung Jawab</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="align-top">
                  <td className="border border-slate-300 p-1.5 text-center font-bold">
                    {item.itemNumber}
                  </td>
                  <td className="border border-slate-300 p-1.5 font-medium">
                    {item.title}
                  </td>
                  <td className="border border-slate-300 p-1.5">
                    <ul className="list-disc list-inside space-y-0.5 text-[10px]">
                      {item.requiredDocuments.map((d, dIdx) => (
                        <li key={dIdx}>{d}</li>
                      ))}
                    </ul>
                    {item.documentTitle && (
                      <div className="mt-1 text-[10px] font-semibold text-emerald-800">
                        Berkas: {item.documentTitle}
                      </div>
                    )}
                  </td>
                  <td className="border border-slate-300 p-1.5 text-center font-semibold">
                    <span className={
                      item.status === 'Lengkap'
                        ? 'text-emerald-700'
                        : item.status === 'Perlu Perbaikan'
                        ? 'text-amber-700'
                        : 'text-rose-700'
                    }>
                      {item.status}
                    </span>
                  </td>
                  <td className="border border-slate-300 p-1.5 text-center font-bold">
                    Lv. {item.scoreLevel}
                  </td>
                  <td className="border border-slate-300 p-1.5 text-slate-700">
                    {item.personInCharge}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Section 3: Lembar Pengesahan */}
        <div className="mt-8 pt-4 border-t border-slate-300 text-xs">
          <div className="flex justify-between items-start text-center">
            
            <div className="w-52">
              <p>Mengetahui,</p>
              <p className="font-bold">Ketua Tim Akreditasi Sekolah</p>
              <div className="h-20" />
              <p className="font-bold underline uppercase">Fatimah Patty, S.Pd.</p>
              <p className="text-[11px] text-slate-600">NIP. 19810815 200604 2 018</p>
            </div>

            <div className="w-52">
              <p>Sepa, {currentDate}</p>
              <p className="font-bold">Kepala SD Negeri 305 Maluku Tengah</p>
              <div className="h-20" />
              <p className="font-bold underline uppercase">{profile.headmasterName}</p>
              <p className="text-[11px] text-slate-600">NIP. {profile.headmasterNip}</p>
            </div>

          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 pt-3 border-t border-slate-200 text-[10px] text-slate-400 flex justify-between">
          <span>Dicetak otomatis melalui SIM Akreditasi Digital SDN 305 Maluku Tengah</span>
          <span>Halaman 1 dari 1</span>
        </div>

      </div>

    </div>
  );
};
