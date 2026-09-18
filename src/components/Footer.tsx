import React from 'react';
import {
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Award,
  ExternalLink
} from 'lucide-react';
import { SchoolProfile } from '../types';

interface FooterProps {
  profile: SchoolProfile;
  onNavigate: (sectionId: string) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  profile,
  onNavigate,
  onOpenAdmin
}) => {
  return (
    <footer id="kontak" className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1: School Identity */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-amber-300">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="text-lg font-bold text-white tracking-tight">
                  SDN 305 MALUKU TENGAH
                </span>
                <p className="text-xs text-emerald-400">Dinas Pendidikan & Kebudayaan Maluku Tengah</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Mendidik dengan hati, berlandaskan iman, taqwa, ilmu pengetahuan, serta kearifan lokal Maluku. Siap menyongsong visitasi akreditasi BAN-S/M dengan tata kelola sekolah yang unggul dan transparan.
            </p>

            <div className="flex items-center space-x-3 pt-2">
              <span className="inline-flex items-center space-x-1.5 bg-slate-800 text-emerald-400 px-3 py-1 rounded-md text-xs font-mono border border-slate-700">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>NPSN: {profile.npsn}</span>
              </span>
              <span className="inline-flex items-center space-x-1.5 bg-slate-800 text-amber-400 px-3 py-1 rounded-md text-xs font-mono border border-slate-700">
                <Award className="w-3.5 h-3.5" />
                <span>NSS: {profile.nss}</span>
              </span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Navigasi Halaman
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('beranda')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Beranda Utama
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('profil')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Profil & Visi Misi Sekolah
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('akreditasi')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  4 Komponen IASP Akreditasi
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('gtk')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Direktori Pendidik & Tendik (GTK)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('sarpras')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Sarana & Prasarana Sekolah
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('berita')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Berita & Agenda
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact Info & Address */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Kontak & Lokasi Sekolah
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  {profile.address}, {profile.village}, Kec. {profile.district}, {profile.regency}, {profile.province} {profile.postalCode}
                </span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{profile.phone}</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{profile.email}</span>
              </div>
            </div>

            <div className="pt-3">
              <button
                onClick={onOpenAdmin}
                className="w-full px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                Masuk Ruang Kerja Admin Akreditasi
              </button>
            </div>
          </div>

        </div>

        {/* Copyright & Disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <div>
            &copy; {new Date().getFullYear()} SD Negeri 305 Maluku Tengah. Semua Hak Dilindungi.
          </div>
          <div className="flex items-center space-x-4">
            <span>Standar IASP BAN-S/M Kemendikbudristek RI</span>
            <span>•</span>
            <span>Kabupaten Maluku Tengah</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
