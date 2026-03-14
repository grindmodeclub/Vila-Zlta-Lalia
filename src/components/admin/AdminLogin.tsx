import { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react';

const ADMIN_EMAIL = 'apartmanylalia@gmail.com';
const ADMIN_PASSWORD = 'Apartmanylalia2026';

interface Props {
  onLogin: (success: boolean) => void;
}

export default function AdminLogin({ onLogin }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        onLogin(true);
      } else {
        setError('Nesprávny e-mail alebo heslo.');
        setLoading(false);
      }
    }, 600);
  };

  const goHome = () => {
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <div className="min-h-screen bg-chinese-black flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <button onClick={goHome} className="inline-block mb-8">
            <span className="font-serif text-3xl text-white">Vila </span>
            <span className="font-serif text-3xl text-brass">Žltá Ľalia</span>
          </button>
          <h1 className="font-serif text-2xl text-white mb-2">Administrácia</h1>
          <p className="text-white/40 text-sm">Prihlásenie pre správu rezervácií</p>
        </div>

        <div className="bg-dark-jungle border border-white/5 rounded-lg p-8">
          {error && (
            <div className="flex items-center gap-3 p-3.5 rounded-sm bg-red-900/20 border border-red-500/20 mb-6">
              <AlertCircle size={15} className="text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label-dark">E-mail</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-dark pl-10"
                  placeholder="admin@priklad.sk"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="label-dark">Heslo</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-dark pl-10 pr-10"
                  placeholder="••••••••••"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center mt-2 disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-chinese-black/30 border-t-chinese-black rounded-full animate-spin" />
                  Prihlasovanie...
                </span>
              ) : (
                'Prihlásiť sa'
              )}
            </button>
          </form>
        </div>

        <button
          onClick={goHome}
          className="mt-6 text-white/30 hover:text-white/60 text-sm text-center w-full transition-colors duration-200"
        >
          ← Späť na web
        </button>
      </div>
    </div>
  );
}
