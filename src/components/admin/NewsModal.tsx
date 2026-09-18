import React, { useState, useEffect } from 'react';
import { X, Newspaper } from 'lucide-react';
import { NewsItem } from '../../types';
import { ImageUploadField } from './ImageUploadField';

interface NewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newsItem: NewsItem) => void;
  initialNews?: NewsItem | null;
}

export const NewsModal: React.FC<NewsModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialNews
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<NewsItem['category']>('Akreditasi');
  const [date, setDate] = useState('');
  const [author, setAuthor] = useState('Admin Akreditasi');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isImportant, setIsImportant] = useState(false);

  useEffect(() => {
    if (initialNews) {
      setTitle(initialNews.title);
      setCategory(initialNews.category);
      setDate(initialNews.date);
      setAuthor(initialNews.author);
      setSummary(initialNews.summary);
      setContent(initialNews.content);
      setImageUrl(initialNews.imageUrl || '');
      setIsImportant(Boolean(initialNews.isImportant));
    } else {
      setTitle('');
      setCategory('Akreditasi');
      const now = new Date();
      setDate(now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }));
      setAuthor('Tim Akreditasi SDN 305');
      setSummary('');
      setContent('');
      setImageUrl('');
      setIsImportant(false);
    }
  }, [initialNews, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const updatedItem: NewsItem = {
      id: initialNews ? initialNews.id : `news-${Date.now()}`,
      title: title.trim(),
      slug: slug || `berita-${Date.now()}`,
      category,
      date: date.trim(),
      author: author.trim(),
      summary: summary.trim(),
      content: content.trim(),
      imageUrl: imageUrl.trim() || undefined,
      isImportant
    };

    onSave(updatedItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl p-6 sm:p-8 my-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <Newspaper className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              {initialNews ? 'Edit Berita / Pengumuman' : 'Tambah Berita / Pengumuman'}
            </h3>
            <p className="text-xs text-slate-500">
              Informasi Resmi SDN 305 Maluku Tengah
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Judul Berita / Pengumuman
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Rapat Koordinasi Persiapan Visitasi Akreditasi"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden text-xs"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Kategori
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden text-xs"
              >
                <option value="Akreditasi">Akreditasi</option>
                <option value="Kegiatan">Kegiatan Siswa</option>
                <option value="Prestasi">Prestasi</option>
                <option value="Pengumuman">Pengumuman</option>
                <option value="Kurikulum">Kurikulum Merdeka</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Tanggal Publikasi
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="15 Maret 2026"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden text-xs"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Penulis / Kontributor
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Admin Akreditasi / Tim Humas"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden text-xs"
              required
            />
          </div>

          <div className="pt-1">
            <ImageUploadField
              label="Foto Kegiatan / Gambar Utama Berita"
              value={imageUrl}
              onChange={setImageUrl}
              placeholder="Tempel link URL foto atau klik tombol Pilih File Foto"
              helperText="Pilih foto langsung dari galeri HP atau laptop Anda, atau tempel link URL foto."
            />
          </div>

          <div className="flex items-center space-x-2 py-1">
            <input
              type="checkbox"
              id="isImportant"
              checked={isImportant}
              onChange={(e) => setIsImportant(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
            />
            <label htmlFor="isImportant" className="text-xs font-medium text-slate-700">
              Tandai sebagai Berita Penting / Prioritas
            </label>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Ringkasan Singkat (Lead Paragraph)
            </label>
            <textarea
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Satu atau dua kalimat ringkasan yang muncul pada kartu berita..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden text-xs"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Isi Lengkap Artikel Berita
            </label>
            <textarea
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tuliskan berita lengkap di sini..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden text-xs"
              required
            />
          </div>

          <div className="pt-4 flex justify-end space-x-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold shadow-xs transition-colors cursor-pointer"
            >
              Simpan Berita
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
