import React, { useState } from 'react';
import {
  Building2,
  CheckCircle2,
  AlertTriangle,
  Maximize2,
  Layers,
  Sparkles
} from 'lucide-react';
import { Facility } from '../types';

interface FacilitiesSectionProps {
  facilities: Facility[];
  onOpenAdmin: () => void;
}

export const FacilitiesSection: React.FC<FacilitiesSectionProps> = ({
  facilities,
  onOpenAdmin
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('Semua');

  const categories = [
    'Semua',
    'Ruang Pembelajaran',
    'Ruang Penunjang',
    'Teknologi & Digital',
    'Sanitasi & Olahraga'
  ];

  const filtered = activeCategory === 'Semua'
    ? facilities
    : facilities.filter(f => f.category === activeCategory);

  return (
    <section id="sarpras" className="py-16 lg:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Building2 className="w-3.5 h-3.5" />
            <span>Standar Sarana & Prasarana</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Sarana & Prasarana Pendukung Pembelajaran
          </h2>
          <p className="text-base text-slate-600 mt-3 leading-relaxed">
            Pemenuhan sarana dan prasarana berstandar Permendikbudristek untuk menunjang kenyamanan belajar siswa, literasi digital, dan bukti fisik akreditasi IASP.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((facility) => (
            <div
              key={facility.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Photo */}
                <div className="relative h-44 bg-slate-100 overflow-hidden">
                  <img
                    src={facility.photoUrl || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=600'}
                    alt={facility.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  
                  {/* Condition Badge */}
                  <div className="absolute top-3 right-3">
                    <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-xs ${
                      facility.condition === 'Baik'
                        ? 'bg-emerald-500 text-white'
                        : facility.condition === 'Rusak Ringan'
                        ? 'bg-amber-500 text-white'
                        : 'bg-rose-500 text-white'
                    }`}>
                      {facility.condition === 'Baik' ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <AlertTriangle className="w-3 h-3" />
                      )}
                      <span>Kondisi {facility.condition}</span>
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 text-white">
                    <span className="text-[11px] bg-slate-900/80 px-2 py-0.5 rounded-md backdrop-blur-xs font-medium">
                      {facility.category}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 space-y-2">
                  <h4 className="font-bold text-slate-900 text-base leading-snug">{facility.name}</h4>
                  
                  <div className="flex items-center space-x-4 text-xs text-slate-500 pt-1">
                    <div className="flex items-center space-x-1">
                      <Layers className="w-3.5 h-3.5 text-slate-400" />
                      <span>{facility.quantity} Unit / Ruang</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{facility.areaSqm} m²</span>
                    </div>
                  </div>

                  {facility.notes && (
                    <p className="text-xs text-slate-600 pt-2 leading-relaxed">
                      {facility.notes}
                    </p>
                  )}
                </div>
              </div>

              <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-emerald-700 font-semibold flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>{facility.meetsPermendikbud ? 'Sesuai Standar SNP' : 'Proses Peningkatan'}</span>
                </span>
                <span className="text-slate-400">KIB Sarpras</span>
              </div>
            </div>
          ))}
        </div>

        {/* Banner */}
        <div className="mt-12 p-6 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              Dokumentasi Lengkap Sarana & Prasarana Sekolah
            </h4>
            <p className="text-xs text-slate-600 mt-0.5">
              Buku Inventaris Barang (KIB A s.d. E) dan SOP Penggunaan Sarpras tersedia di ruang berkas admin akreditasi.
            </p>
          </div>
          <button
            onClick={onOpenAdmin}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shrink-0 transition-colors cursor-pointer"
          >
            Kelola Sarpras di Admin
          </button>
        </div>

      </div>
    </section>
  );
};
