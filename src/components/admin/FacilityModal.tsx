import React, { useState, useEffect } from 'react';
import { X, Building2 } from 'lucide-react';
import { Facility } from '../../types';
import { ImageUploadField } from './ImageUploadField';

interface FacilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (facility: Facility) => void;
  initialFacility?: Facility | null;
}

export const FacilityModal: React.FC<FacilityModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialFacility
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Facility['category']>('Ruang Pembelajaran');
  const [quantity, setQuantity] = useState(1);
  const [condition, setCondition] = useState<Facility['condition']>('Baik');
  const [areaSqm, setAreaSqm] = useState(64);
  const [meetsPermendikbud, setMeetsPermendikbud] = useState(true);
  const [notes, setNotes] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  useEffect(() => {
    if (initialFacility) {
      setName(initialFacility.name);
      setCategory(initialFacility.category);
      setQuantity(initialFacility.quantity);
      setCondition(initialFacility.condition);
      setAreaSqm(initialFacility.areaSqm);
      setMeetsPermendikbud(initialFacility.meetsPermendikbud);
      setNotes(initialFacility.notes || '');
      setPhotoUrl(initialFacility.photoUrl || '');
    } else {
      setName('');
      setCategory('Ruang Pembelajaran');
      setQuantity(1);
      setCondition('Baik');
      setAreaSqm(64);
      setMeetsPermendikbud(true);
      setNotes('');
      setPhotoUrl('');
    }
  }, [initialFacility, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedFacility: Facility = {
      id: initialFacility ? initialFacility.id : `fac-${Date.now()}`,
      name: name.trim(),
      category,
      quantity: Number(quantity),
      condition,
      areaSqm: Number(areaSqm),
      meetsPermendikbud,
      notes: notes.trim() || undefined,
      photoUrl: photoUrl.trim() || undefined
    };

    onSave(updatedFacility);
    onClose();
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
          <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              {initialFacility ? 'Edit Sarana & Prasarana' : 'Tambah Sarpras Baru'}
            </h3>
            <p className="text-xs text-slate-500">
              Inventaris Sarpras SDN 305 Maluku Tengah
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Nama Sarana / Prasarana
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Ruang Kelas V / Laboratorium Komputer"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden text-xs"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Kategori Sarpras
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden text-xs"
              >
                <option value="Ruang Pembelajaran">Ruang Pembelajaran</option>
                <option value="Ruang Penunjang">Ruang Penunjang</option>
                <option value="Teknologi & Digital">Teknologi & Digital</option>
                <option value="Sanitasi & Olahraga">Sanitasi & Olahraga</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Jumlah Unit / Ruang
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden text-xs"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Kondisi Fisik
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden text-xs"
              >
                <option value="Baik">Baik (Siap Pakai)</option>
                <option value="Rusak Ringan">Rusak Ringan</option>
                <option value="Rusak Sedang">Rusak Sedang</option>
                <option value="Rusak Berat">Rusak Berat</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Luas Total (m²)
              </label>
              <input
                type="number"
                min="1"
                value={areaSqm}
                onChange={(e) => setAreaSqm(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden text-xs"
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 py-1">
            <input
              type="checkbox"
              id="meetsSNP"
              checked={meetsPermendikbud}
              onChange={(e) => setMeetsPermendikbud(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
            />
            <label htmlFor="meetsSNP" className="text-xs font-medium text-slate-700">
              Sesuai Standar Nasional Pendidikan (Permendikbudristek)
            </label>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Catatan / Deskripsi Fasilitas
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Fasilitas meja, kursi, proyektor, ventilasi..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden text-xs"
            />
          </div>

          <div className="pt-1">
            <ImageUploadField
              label="Foto Sarana / Prasarana"
              value={photoUrl}
              onChange={setPhotoUrl}
              placeholder="Tempel link URL foto atau klik tombol Pilih File Foto"
              helperText="Upload foto ruangan atau fasilitas dari laptop/HP Anda."
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
              Simpan Sarpras
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
