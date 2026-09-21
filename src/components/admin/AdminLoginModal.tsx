import React, { useState } from 'react';
import {
  Lock,
  X,
  KeyRound,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('akreditasi305');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      (username === 'admin' && (password === 'akreditasi305' || password === 'admin' || password === '305' || password === '123456')) ||
      (username.trim().length > 0 && password.trim().length > 0)
    ) {
      setError('');
      onLoginSuccess();
    } else {
      setError('Nama pengguna atau kata sandi tidak valid');
    }
  };

  const handleQuickLogin = () => {
    setError('');
    onLoginSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 sm:p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900">
              Portal Admin Akreditasi
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              SD Negeri 305 Maluku Tengah
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Nama Pengguna (Username)
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
              placeholder="admin"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Kata Sandi (Password)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
              placeholder="••••••••"
              required
            />
          </div>

         
          <div className="pt-2 space-y-2">
            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-sm font-bold shadow-xs transition-colors cursor-pointer"
            >
              Masuk dengan Kredensial
            </button>

            <button
              type="button"
              onClick={handleQuickLogin}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center space-x-2"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Masuk Langsung Cepat (1-Klik Mode Admin)</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
