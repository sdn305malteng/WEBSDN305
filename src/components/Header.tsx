import React, { useState } from 'react';
import {
  GraduationCap,
  ShieldCheck,
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  Lock,
  UserCheck
} from 'lucide-react';
import { SchoolProfile } from '../types';

interface HeaderProps {
  profile: SchoolProfile;
  stats?: {
    score: number;
    percentage: number;
    complete: number;
    revision: number;
    pending: number;
    total: number;
    grade: string;
  };
  readinessPercentage?: number;
  isAdminLoggedIn?: boolean;
  onOpenAdmin?: () => void;
  onOpenAdminLogin?: () => void;
  activeSection?: string;
  onNavigate: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  stats,
  readinessPercentage,
  isAdminLoggedIn = false,
  onOpenAdmin,
  onOpenAdminLogin,
  activeSection = 'beranda',
  onNavigate
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const displayReadiness = readinessPercentage ?? stats?.percentage ?? 85;

  const handleAdminAction = () => {
    if (onOpenAdmin) {
      onOpenAdmin();
    } else if (onOpenAdminLogin) {
      onOpenAdminLogin();
    }
  };

  const navLinks = [
    { id: 'beranda', label: 'Beranda' },
    { id: 'profil', label: 'Profil Sekolah' },
    { id: 'akreditasi', label: 'Standar Akreditasi' },
    { id: 'gtk', label: 'Pendidik & Tendik' },
    { id: 'sarpras', label: 'Sarana Prasarana' },
    { id: 'berita', label: 'Berita & Agenda' },
    { id: 'kontak', label: 'Kontak' }
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Notification Bar */}
      <div className="bg-emerald-900 text-emerald-100 text-xs py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <span className="flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-300" />
              <span>{profile.village}, {profile.district}, {profile.regency}</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-300" />
              <span>{profile.phone}</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <Mail className="w-3.5 h-3.5 text-emerald-300" />
              <span>{profile.email}</span>
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="inline-flex items-center space-x-1 text-emerald-200 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>NPSN: {profile.npsn}</span>
            </span>
            <span className="bg-emerald-800 text-emerald-200 px-2 py-0.5 rounded-full text-[11px] font-semibold border border-emerald-700">
              Kesiapan Akreditasi: {displayReadiness}%
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & School Identity */}
          <div
            onClick={() => handleNavClick('beranda')}
            className="flex items-center space-x-3.5 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-200">
              <GraduationCap className="w-7 h-7 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-extrabold tracking-tight text-slate-900 leading-none group-hover:text-emerald-700 transition-colors">
                  SDN 305 MALUKU TENGAH
                </span>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded-sm border border-amber-300">
                  IASP SD
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Dinas Pendidikan dan Kebudayaan Kab. Maluku Tengah
              </p>
            </div>
          </div>

          {/* Desktop Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors duration-150 ${
                    isActive
                      ? 'text-emerald-700 bg-emerald-50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Action Admin CTA */}
          <div className="flex items-center space-x-3">
            <button
              id="btn-admin-header"
              type="button"
              onClick={handleAdminAction}
              className={`inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-bold shadow-xs transition-all duration-200 cursor-pointer ${
                isAdminLoggedIn
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white ring-2 ring-emerald-500 ring-offset-2'
                  : 'bg-slate-900 hover:bg-emerald-800 text-white hover:shadow-md'
              }`}
            >
              {isAdminLoggedIn ? (
                <>
                  <UserCheck className="w-4 h-4 text-emerald-300" />
                  <span>Panel Admin Aktif</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span>Admin & Akreditasi</span>
                </>
              )}
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
              aria-label="Buka Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-1 shadow-lg">
          <div className="mb-3 px-2 py-2 bg-emerald-50 rounded-lg text-xs text-emerald-900 flex justify-between items-center">
            <span>NPSN: <strong>{profile.npsn}</strong></span>
            <span>Kesiapan Akreditasi: <strong>{displayReadiness}%</strong></span>
          </div>
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
                activeSection === link.id
                  ? 'bg-emerald-100 text-emerald-900 font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 border-t border-slate-100">
            <button
              id="btn-admin-drawer"
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                handleAdminAction();
              }}
              className="w-full mt-1 flex items-center justify-center space-x-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold cursor-pointer"
            >
              <Lock className="w-4 h-4 text-amber-300" />
              <span>{isAdminLoggedIn ? 'Masuk ke Dashboard Admin' : 'Login Admin Akreditasi'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
