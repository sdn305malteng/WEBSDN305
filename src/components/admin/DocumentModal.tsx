import React, { useState, useEffect } from 'react';
import {
  X,
  FileCheck2,
  AlertCircle
} from 'lucide-react';
import {
  AccreditationItem,
  AccreditationStatus,
  IASPComponentId
} from '../../types';

interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: AccreditationItem) => void;
  initialItem?: AccreditationItem | null;
  defaultComponentId?: IASPComponentId;
}

export const DocumentModal: React.FC<DocumentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialItem,
  defaultComponentId = 'mutu-lulusan'
}) => {
  const [componentId, setComponentId] = useState<IASPComponentId>(defaultComponentId);
  const [itemNumber, setItemNumber] = useState<number>(1);
  const [title, setTitle] = useState('');
  const [indicator, setIndicator] = useState('');
  const [requiredDocsText, setRequiredDocsText] = useState('');
  const [status, setStatus] = useState<AccreditationStatus>('Belum Lengkap');
  const [scoreLevel, setScoreLevel] = useState<1 | 2 | 3 | 4>(3);
  const [documentNumber, setDocumentNumber] = useState('');
  const [documentTitle, setDocumentTitle] = useState('');
  const [documentLink, setDocumentLink] = useState('');
  const [personInCharge, setPersonInCharge] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialItem) {
      setComponentId(initialItem.componentId);
      setItemNumber(initialItem.itemNumber);
      setTitle(initialItem.title);
      setIndicator(initialItem.indicator);
      setRequiredDocsText(initialItem.requiredDocuments.join('\n'));
      setStatus(initialItem.status);
      setScoreLevel(initialItem.scoreLevel);
      setDocumentNumber(initialItem.documentNumber || '');
      setDocumentTitle(initialItem.documentTitle || '');
      setDocumentLink(initialItem.documentLink || '');
      setPersonInCharge(initialItem.personInCharge);
      setNotes(initialItem.notes || '');
    } else {
      setComponentId(defaultComponentId);
      setItemNumber(Math.floor(Math.random() * 30) + 1);
      setTitle('');
      setIndicator('');
      setRequiredDocsText('');
      setStatus('Belum Lengkap');
      setScoreLevel(3);
      setDocumentNumber('');
      setDocumentTitle('');
      setDocumentLink('');
      setPersonInCharge('Tim Akreditasi SDN 305');
      setNotes('');
    }
  }, [initialItem, defaultComponentId, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const docs = requiredDocsText
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const updatedItem: AccreditationItem = {
      id: initialItem ? initialItem.id : `item-${Date.now()}`,
      componentId,
      itemNumber: Number(itemNumber),
      title: title.trim(),
      indicator: indicator.trim(),
      requiredDocuments: docs.length > 0 ? docs : ['Dokumen Portofolio Resmi'],
      status,
      scoreLevel,
      documentNumber: documentNumber.trim() || undefined,
      documentTitle: documentTitle.trim() || undefined,
      documentLink: documentLink.trim() || undefined,
      personInCharge: personInCharge.trim() || 'Tim Akreditasi',
      notes: notes.trim() || undefined,
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    onSave(updatedItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl p-6 sm:p-8 my-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              {initialItem ? 'Edit Dokumen Butir Akreditasi' : 'Tambah Butir & Bukti Fisik Akreditasi'}
            </h3>
            <p className="text-xs text-slate-500">
              Instrumen Akreditasi Satuan Pendidikan (IASP) SDN 305 Maluku Tengah
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Komponen IASP
              </label>
              <select
                value={componentId}
                onChange={(e) => setComponentId(e.target.value as IASPComponentId)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden text-xs"
              >
                <option value="mutu-lulusan">1. Mutu Lulusan (Bobot 35%)</option>
                <option value="proses-pembelajaran">2. Proses Pembelajaran (Bobot 29%)</option>
                <option value="mutu-guru">3. Mutu Guru (Bobot 18%)</option>
                <option value="manajemen-sekolah">4. Manajemen Sekolah (Bobot 18%)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Nomor Butir IASP
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={itemNumber}
                onChange={(e) => setItemNumber(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden text-xs"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Judul Butir Penilaian
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Kedisiplinan Peserta Didik dalam Waktu dan Tata Tertib Sekolah"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden text-xs"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Indikator Capaian / Deskripsi Standar
            </label>
            <textarea
              rows={2}
              value={indicator}
              onChange={(e) => setIndicator(e.target.value)}
              placeholder="Deskripsi perilaku, proses, atau capaian yang diukur oleh asesor..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden text-xs"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Daftar Bukti Fisik yang Diperlukan (Satu dokumen per baris)
            </label>
            <textarea
              rows={3}
              value={requiredDocsText}
              onChange={(e) => setRequiredDocsText(e.target.value)}
              placeholder="Contoh:&#10;Buku Tata Tertib Siswa&#10;Jurnal Pembiasaan 5S&#10;Foto Apel Pagi dan Upacara"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Status Kelengkapan Berkas
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as AccreditationStatus)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden text-xs"
              >
                <option value="Lengkap">Lengkap (Siap Visitasi)</option>
                <option value="Perlu Perbaikan">Perlu Perbaikan (Revisi Dokumen)</option>
                <option value="Belum Lengkap">Belum Lengkap (Belum Ada Berkas)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Level Capaian Skor (1 - 4)
              </label>
              <select
                value={scoreLevel}
                onChange={(e) => setScoreLevel(Number(e.target.value) as 1 | 2 | 3 | 4)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden text-xs"
              >
                <option value="4">Level 4 (Unggul / Membudaya Terus Menerus)</option>
                <option value="3">Level 3 (Baik / Terlaksana Konsisten)</option>
                <option value="2">Level 2 (Sedang / Terlaksana Sebagian)</option>
                <option value="1">Level 1 (Dasar / Belum Memenuhi)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Nomor SK / Kode Dokumen
              </label>
              <input
                type="text"
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.target.value)}
                placeholder="Contoh: DOC-MUT-01/2026 atau SK/421.2/..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Nama File / Judul Bundel Portofolio
              </label>
              <input
                type="text"
                value={documentTitle}
                onChange={(e) => setDocumentTitle(e.target.value)}
                placeholder="Contoh: Portofolio Kedisiplinan Siswa SDN 305"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Link Cloud / Google Drive Bukti Fisik
              </label>
              <input
                type="text"
                value={documentLink}
                onChange={(e) => setDocumentLink(e.target.value)}
                placeholder="https://drive.google.com/..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Penanggung Jawab (PIC Guru)
              </label>
              <input
                type="text"
                value={personInCharge}
                onChange={(e) => setPersonInCharge(e.target.value)}
                placeholder="Contoh: Ibu Fatimah Patty, S.Pd."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden text-xs"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Catatan Khusus / Hasil Verifikasi
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Catatan untuk tim asesor atau catatan bagian yang perlu dilengkapi..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden text-xs"
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
              Simpan Dokumen Akreditasi
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
