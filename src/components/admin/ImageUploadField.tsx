import React, { useRef } from 'react';
import { Upload, Link as LinkIcon, Image as ImageIcon, X } from 'lucide-react';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  helperText?: string;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  value,
  onChange,
  placeholder = 'https://... atau klik tombol upload file di bawah',
  helperText = 'Mendukung upload foto dari galeri/HP/laptop (JPG, PNG, WebP) atau link URL.'
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (max 2MB for localStorage safety)
    if (file.size > 2.5 * 1024 * 1024) {
      alert('Ukuran file terlalu besar (maksimal 2.5 MB). Silakan pilih foto dengan resolusi lebih kecil atau gunakan tautan URL.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        onChange(base64);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleClear = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block font-bold text-slate-700 uppercase tracking-wider text-xs">
          {label}
        </label>
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="text-[11px] text-rose-600 hover:text-rose-700 font-medium flex items-center space-x-1 cursor-pointer"
          >
            <X className="w-3 h-3" />
            <span>Hapus Foto</span>
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        {/* URL Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <LinkIcon className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            value={value.startsWith('data:image') ? '[Foto Terunggah dari Perangkat]' : value}
            onChange={(e) => {
              if (!value.startsWith('data:image')) {
                onChange(e.target.value);
              }
            }}
            readOnly={value.startsWith('data:image')}
            placeholder={placeholder}
            className={`w-full pl-9 pr-3 py-2 rounded-xl border text-slate-800 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden ${
              value.startsWith('data:image') ? 'bg-slate-100 border-slate-300 font-mono text-[11px]' : 'border-slate-300'
            }`}
          />
        </div>

        {/* Upload Button */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full sm:w-auto px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl font-semibold text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer whitespace-nowrap"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Pilih File Foto</span>
          </button>
        </div>
      </div>

      {/* Preview if image exists */}
      {value ? (
        <div className="flex items-center space-x-3 p-2 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="w-16 h-12 rounded-lg bg-slate-200 overflow-hidden shrink-0 border border-slate-300 relative">
            <img
              src={value}
              alt="Pratinjau Foto"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              onError={(e) => {
                // fallback on error
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div className="text-xs text-slate-600 truncate flex-1">
            <span className="font-semibold text-slate-800 block truncate">Pratinjau Foto Terpilih</span>
            <span className="text-[11px] text-slate-500">
              {value.startsWith('data:image') ? 'Foto lokal siap disimpan' : 'Foto dari tautan web'}
            </span>
          </div>
        </div>
      ) : (
        <p className="text-[11px] text-slate-500 flex items-center space-x-1">
          <ImageIcon className="w-3 h-3 text-slate-400 shrink-0" />
          <span>{helperText}</span>
        </p>
      )}
    </div>
  );
};
