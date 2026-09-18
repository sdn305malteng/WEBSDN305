import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpenCheck,
  Award,
  Building2,
  CheckCircle2,
  AlertCircle,
  FileText,
  ExternalLink,
  Lock
} from 'lucide-react';
import {
  AccreditationComponent,
  AccreditationItem,
  IASPComponentId
} from '../types';

interface AccreditationPublicSectionProps {
  components: AccreditationComponent[];
  items: AccreditationItem[];
  onOpenAdmin: (componentFilter?: IASPComponentId) => void;
}

export const AccreditationPublicSection: React.FC<AccreditationPublicSectionProps> = ({
  components,
  items,
  onOpenAdmin
}) => {
  const [selectedCompId, setSelectedCompId] = useState<IASPComponentId>('mutu-lulusan');

  const selectedComponent = components.find(c => c.id === selectedCompId) || components[0];
  const componentItems = items.filter(i => i.componentId === selectedCompId);

  const completeCount = componentItems.filter(i => i.status === 'Lengkap').length;
  const revisionCount = componentItems.filter(i => i.status === 'Perlu Perbaikan').length;
  const pendingCount = componentItems.filter(i => i.status === 'Belum Lengkap').length;
  const percentage = componentItems.length > 0
    ? Math.round((completeCount / componentItems.length) * 100)
    : 0;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'GraduationCap':
        return <GraduationCap className="w-5 h-5" />;
      case 'BookOpenCheck':
        return <BookOpenCheck className="w-5 h-5" />;
      case 'Award':
        return <Award className="w-5 h-5" />;
      case 'Building2':
        return <Building2 className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  return (
    <section id="akreditasi" className="py-16 lg:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>Standar Akreditasi BAN-S/M</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            4 Komponen Penilaian IASP Sekolah Dasar
          </h2>
          <p className="text-base text-slate-600 mt-3 leading-relaxed">
            Menghadapi visitasi akreditasi dengan pemetaan sistematis seluruh bukti fisik, dokumen portofolio, dan indikator kinerja bermutu tinggi.
          </p>
        </div>

        {/* 4 Components Tabs / Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {components.map((comp) => {
            const isSelected = comp.id === selectedCompId;
            const compItems = items.filter(i => i.componentId === comp.id);
            const compComplete = compItems.filter(i => i.status === 'Lengkap').length;
            const compPerc = compItems.length > 0 ? Math.round((compComplete / compItems.length) * 100) : 0;

            return (
              <button
                key={comp.id}
                onClick={() => setSelectedCompId(comp.id)}
                className={`p-5 rounded-2xl text-left transition-all duration-200 cursor-pointer border ${
                  isSelected
                    ? 'bg-emerald-900 text-white border-emerald-800 shadow-md ring-2 ring-emerald-500/20'
                    : 'bg-slate-50 hover:bg-slate-100/80 text-slate-800 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isSelected ? 'bg-emerald-800 text-amber-300' : 'bg-white text-emerald-700 shadow-xs'
                  }`}>
                    {getIcon(comp.iconName)}
                  </div>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                    isSelected ? 'bg-emerald-800 text-emerald-200' : 'bg-slate-200 text-slate-700'
                  }`}>
                    Bobot: {comp.weight}%
                  </span>
                </div>

                <div className="font-extrabold text-base leading-snug">{comp.title}</div>
                <p className={`text-xs mt-1 line-clamp-2 ${isSelected ? 'text-emerald-200' : 'text-slate-500'}`}>
                  {comp.shortDesc}
                </p>

                {/* Mini progress inside tab */}
                <div className="mt-4 pt-3 border-t border-slate-200/40">
                  <div className="flex justify-between text-[11px] font-medium mb-1">
                    <span className={isSelected ? 'text-emerald-300' : 'text-slate-500'}>Kelengkapan</span>
                    <span className="font-bold">{compPerc}%</span>
                  </div>
                  <div className={`w-full h-1.5 rounded-full overflow-hidden ${isSelected ? 'bg-emerald-950' : 'bg-slate-200'}`}>
                    <div
                      className={`h-full rounded-full ${isSelected ? 'bg-amber-400' : 'bg-emerald-600'}`}
                      style={{ width: `${compPerc}%` }}
                    />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Component Detail Box */}
        <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200">
          
          {/* Header of selected component */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center space-x-2">
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-md">
                  {selectedComponent.code}
                </span>
                <span className="text-xs text-slate-500 font-medium">Target Nilai: {selectedComponent.targetScore} / 100</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {selectedComponent.title}
              </h3>
              <p className="text-sm text-slate-600 mt-0.5">
                {selectedComponent.shortDesc}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => onOpenAdmin(selectedComponent.id)}
                className="inline-flex items-center space-x-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-amber-300" />
                <span>Kelola Dokumen Butir Ini</span>
              </button>
            </div>
          </div>

          {/* Sub-standards tags */}
          <div className="py-4 border-b border-slate-200">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
              Sub-Standar / Fokus Telaah:
            </span>
            <div className="flex flex-wrap gap-2">
              {selectedComponent.subStandards.map((sub, idx) => (
                <span key={idx} className="bg-white px-3 py-1 rounded-lg text-xs font-medium text-slate-700 border border-slate-200/80 shadow-2xs">
                  {sub}
                </span>
              ))}
            </div>
          </div>

          {/* Items & Required Physical Documents List */}
          <div className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-base font-bold text-slate-900">
                Daftar Butir Penilaian & Bukti Fisik ({componentItems.length} Butir)
              </h4>
              <div className="flex items-center space-x-3 text-xs">
                <span className="flex items-center space-x-1 text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{completeCount} Lengkap</span>
                </span>
                <span className="flex items-center space-x-1 text-amber-700">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{revisionCount} Perlu Perbaikan</span>
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {componentItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-2xs hover:border-emerald-300 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        #{item.itemNumber}
                      </div>
                      <div>
                        <h5 className="text-sm font-bold text-slate-900">{item.title}</h5>
                        <p className="text-xs text-slate-600 mt-0.5">{item.indicator}</p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="shrink-0">
                      <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                        item.status === 'Lengkap'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : item.status === 'Perlu Perbaikan'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-rose-100 text-rose-800 border border-rose-200'
                      }`}>
                        {item.status === 'Lengkap' ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <AlertCircle className="w-3 h-3" />
                        )}
                        <span>{item.status}</span>
                      </span>
                    </div>
                  </div>

                  {/* Required Documents Pill List */}
                  <div className="mt-3.5 pt-3 border-t border-slate-100">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Dokumen Bukti Fisik / Portofolio Terkait:
                    </div>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-1.5 text-xs text-slate-700">
                      {item.requiredDocuments.map((doc, dIdx) => (
                        <li key={dIdx} className="flex items-center space-x-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                          <span className="truncate">{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Footer with Document Status & PIC */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap justify-between items-center text-[11px] text-slate-500">
                    <span>Penanggung Jawab: <strong className="text-slate-700">{item.personInCharge}</strong></span>
                    {item.documentTitle && (
                      <span className="text-emerald-700 font-medium truncate max-w-xs">
                        Berkas: {item.documentTitle}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Admin CTA banner at bottom of section */}
            <div className="mt-8 p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-emerald-900">
              <div className="text-xs">
                <strong>Ingin memperbarui dokumen atau mengevaluasi butir akreditasi?</strong>
                <p className="text-emerald-700">Masuk ke Portal Admin untuk mengunggah link Google Drive / berkas fisik dan mendapatkan rekomendasi AI Asesor.</p>
              </div>
              <button
                onClick={() => onOpenAdmin(selectedComponent.id)}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shrink-0 transition-colors cursor-pointer"
              >
                Buka Pengelola Berkas &rarr;
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
