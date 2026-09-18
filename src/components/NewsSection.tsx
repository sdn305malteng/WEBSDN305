import React, { useState } from 'react';
import {
  Calendar,
  User,
  ArrowRight,
  Sparkles,
  X,
  Newspaper
} from 'lucide-react';
import { NewsItem } from '../types';

interface NewsSectionProps {
  news: NewsItem[];
  onOpenAdmin: () => void;
}

export const NewsSection: React.FC<NewsSectionProps> = ({ news, onOpenAdmin }) => {
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);

  return (
    <section id="berita" className="py-16 lg:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
              <Newspaper className="w-3.5 h-3.5" />
              <span>Kabar & Informasi Sekolah</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Berita & Agenda SDN 305 Maluku Tengah
            </h2>
            <p className="text-base text-slate-600 mt-2">
              Perkembangan persiapan akreditasi, kegiatan belajar, karya P5, dan prestasi murid.
            </p>
          </div>

          <div className="mt-4 md:mt-0">
            <button
              onClick={onOpenAdmin}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-2xs cursor-pointer"
            >
              + Tambah Berita di Admin
            </button>
          </div>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {news.map((item) => (
            <article
              key={item.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer"
              onClick={() => setSelectedArticle(item)}
            >
              <div>
                <div className="relative h-44 bg-slate-100 overflow-hidden">
                  <img
                    src={item.imageUrl || 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&q=80&w=800'}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-slate-900/80 text-white text-[10px] font-bold px-2.5 py-1 rounded-md backdrop-blur-xs">
                      {item.category}
                    </span>
                  </div>
                  {item.isImportant && (
                    <div className="absolute top-3 right-3">
                      <span className="bg-amber-500 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-md flex items-center space-x-1">
                        <Sparkles className="w-3 h-3" />
                        <span>Penting</span>
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex items-center space-x-3 text-[11px] text-slate-400 mb-2">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{item.date}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <User className="w-3 h-3" />
                      <span>{item.author}</span>
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-emerald-700 transition-colors line-clamp-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                    {item.summary}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0">
                <span className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-700 group-hover:text-emerald-800">
                  <span>Baca Selengkapnya</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </article>
          ))}
        </div>

      </div>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl p-6 sm:p-8">
            <div className="flex justify-between items-start mb-4">
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-md">
                {selectedArticle.category}
              </span>
              <button
                onClick={() => setSelectedArticle(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
              {selectedArticle.title}
            </h3>

            <div className="flex items-center space-x-3 text-xs text-slate-500 my-3 pb-3 border-b border-slate-100">
              <span>{selectedArticle.date}</span>
              <span>•</span>
              <span>Oleh: {selectedArticle.author}</span>
            </div>

            {selectedArticle.imageUrl && (
              <div className="rounded-xl overflow-hidden mb-5 max-h-72">
                <img
                  src={selectedArticle.imageUrl}
                  alt={selectedArticle.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line font-serif space-y-4">
              {selectedArticle.content}
            </div>

            <div className="mt-8 pt-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Tutup Berita
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
