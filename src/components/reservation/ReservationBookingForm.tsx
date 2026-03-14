import { useState } from 'react';
import { Users, MessageSquare, CheckSquare, Loader2, AlertCircle, ArrowLeft, Phone, Mail, User, CheckCircle, Clock, Shield, CalendarDays, ArrowRight, RefreshCw } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Props {
  checkIn: string;
  checkOut: string;
  onBack: () => void;
  onSuccess: () => void;
}

interface FormData {
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  guests_count: number;
  message: string;
  agreed: boolean;
}

const initialForm: FormData = {
  guest_name: '',
  guest_email: '',
  guest_phone: '',
  guests_count: 2,
  message: '',
  agreed: false,
};

const SLOVAK_MONTHS_GEN = [
  'januára', 'februára', 'marca', 'apríla', 'mája', 'júna',
  'júla', 'augusta', 'septembra', 'októbra', 'novembra', 'decembra',
];

function formatDateSk(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getDate()}. ${SLOVAK_MONTHS_GEN[d.getMonth()]} ${d.getFullYear()}`;
}

function nightCount(checkIn: string, checkOut: string): number {
  const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)));
}

function nightLabel(n: number): string {
  if (n === 1) return 'noc';
  if (n < 5) return 'noci';
  return 'nocí';
}

function navigateTo(path: string) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export default function ReservationBookingForm({ checkIn, checkOut, onBack, onSuccess }: Props) {
  const [form, setForm] = useState<FormData>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const nights = nightCount(checkIn, checkOut);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setForm((p) => ({ ...p, [name]: (e.target as HTMLInputElement).checked }));
    } else if (name === 'guests_count') {
      setForm((p) => ({ ...p, guests_count: Math.min(9, Math.max(1, Number(value))) }));
    } else {
      setForm((p) => ({ ...p, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.agreed) {
      setError('Prosím potvrďte, že ste sa oboznámili s pravidlami pobytu.');
      return;
    }

    setLoading(true);
    setError('');

    const { error: insertError } = await supabase.from('reservations').insert([{
      guest_name: form.guest_name.trim(),
      guest_email: form.guest_email.trim(),
      guest_phone: form.guest_phone.trim(),
      check_in: checkIn,
      check_out: checkOut,
      guests_count: form.guests_count,
      room_type: 'Celá vila',
      message: form.message.trim(),
      status: 'pending',
      is_manual: false,
    }]);

    setLoading(false);

    if (insertError) {
      console.error('Insert error:', insertError);
      setError('Nastala chyba pri odosielaní. Skúste to prosím znova.');
    } else {
      setSubmitted(true);
      onSuccess();
    }
  };

  if (submitted) {
    return (
      <div className="animate-fade-up text-center">
        <div className="w-16 h-16 rounded-full bg-brass/10 border border-brass/20 flex items-center justify-center mx-auto mb-5">
          <CheckCircle size={28} className="text-brass" strokeWidth={1.5} />
        </div>

        <p className="text-brass/70 text-xs uppercase tracking-widest mb-2">Žiadosť prijatá</p>
        <h2 className="font-serif text-white text-2xl mb-3">Rezervácia odoslaná!</h2>
        <p className="text-white/50 text-sm leading-relaxed mb-6">
          Ďakujeme, <strong className="text-white/75">{form.guest_name}</strong>.
          Majiteľka vás kontaktuje do <strong className="text-white/75">24 hodín</strong>.
        </p>

        <div className="bg-brass/6 border border-brass/15 rounded-lg px-4 py-3 mb-5 text-left">
          <p className="text-white/35 text-xs uppercase tracking-wider mb-2">Rezervovaný termín</p>
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-white font-medium text-sm">{formatDateSk(checkIn)}</p>
              <p className="text-white/35 text-xs mt-0.5">Check-in od 14:00</p>
            </div>
            <div className="flex items-center gap-1.5 px-2 flex-shrink-0">
              <div className="w-4 h-px bg-brass/30" />
              <div className="bg-brass/15 border border-brass/25 rounded-sm px-2 py-1">
                <span className="font-serif text-brass text-sm">{nights}</span>
                <span className="text-white/35 text-xs ml-1">{nightLabel(nights)}</span>
              </div>
              <div className="w-4 h-px bg-brass/30" />
            </div>
            <div className="text-right">
              <p className="text-white font-medium text-sm">{formatDateSk(checkOut)}</p>
              <p className="text-white/35 text-xs mt-0.5">Check-out do 10:30</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-6">
          {[
            { icon: Clock, title: 'Do 24 hodín', desc: 'Potvrdenie' },
            { icon: Shield, title: 'Zablokovaný', desc: 'Termín' },
            { icon: CalendarDays, title: 'Flexibilne', desc: 'Úprava' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white/3 border border-white/5 rounded-lg p-2.5 text-center">
              <Icon size={14} className="text-brass mb-1 mx-auto" />
              <p className="text-white text-xs font-medium">{title}</p>
              <p className="text-white/35 text-[10px]">{desc}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2.5">
          <button
            onClick={() => navigateTo('/')}
            className="btn-primary w-full justify-center py-3"
          >
            Späť na úvod
            <ArrowRight size={15} />
          </button>
          <button
            onClick={() => {
              setSubmitted(false);
              setForm(initialForm);
              setError('');
              onBack();
            }}
            className="btn-outline w-full justify-center py-3"
          >
            <RefreshCw size={14} />
            Nová rezervácia
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-up">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-white/40 hover:text-brass text-sm transition-colors duration-200 mb-5"
      >
        <ArrowLeft size={14} />
        Zmeniť termín
      </button>

      <div className="bg-brass/8 border border-brass/20 rounded-lg p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-white/40 text-xs uppercase tracking-wider mb-0.5">Termín pobytu</p>
            <p className="text-white font-medium text-sm">
              {formatDateSk(checkIn)} — {formatDateSk(checkOut)}
            </p>
            <p className="text-white/35 text-xs mt-0.5">check-in od 14:00 · check-out do 10:30</p>
          </div>
          <div className="flex items-baseline gap-1.5 bg-brass/10 border border-brass/20 px-3.5 py-2 rounded-sm flex-shrink-0">
            <span className="font-serif text-brass text-2xl">{nights}</span>
            <span className="text-white/40 text-xs">{nightLabel(nights)}</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-3 p-3.5 rounded-sm bg-red-900/20 border border-red-500/20 mb-5">
          <AlertCircle size={14} className="text-red-400 mt-0.5 flex-shrink-0" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label-dark">
            <span className="flex items-center gap-1.5"><User size={10} />Meno a priezvisko *</span>
          </label>
          <input
            type="text"
            name="guest_name"
            value={form.guest_name}
            onChange={handleChange}
            className="input-dark"
            placeholder="Ján Novák"
            required
            autoComplete="name"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label-dark">
              <span className="flex items-center gap-1.5"><Mail size={10} />E-mail *</span>
            </label>
            <input
              type="email"
              name="guest_email"
              value={form.guest_email}
              onChange={handleChange}
              className="input-dark"
              placeholder="jan@priklad.sk"
              required
              autoComplete="email"
            />
          </div>
          <div>
            <label className="label-dark">
              <span className="flex items-center gap-1.5"><Phone size={10} />Telefón *</span>
            </label>
            <input
              type="tel"
              name="guest_phone"
              value={form.guest_phone}
              onChange={handleChange}
              className="input-dark"
              placeholder="+421 900 000 000"
              required
              autoComplete="tel"
            />
          </div>
        </div>

        <div>
          <label className="label-dark">
            <span className="flex items-center gap-1.5"><Users size={10} />Počet hostí *</span>
          </label>
          <div className="relative">
            <Users size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="number"
              name="guests_count"
              value={form.guests_count}
              onChange={handleChange}
              min={1}
              max={9}
              className="input-dark pl-10"
              required
            />
          </div>
          <p className="text-white/25 text-xs mt-1">Maximálna kapacita: 9 osôb</p>
        </div>

        <div>
          <label className="label-dark">
            <span className="flex items-center gap-1.5"><MessageSquare size={10} />Správa / špeciálne požiadavky</span>
          </label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            rows={3}
            className="input-dark resize-none"
            placeholder="Máte špeciálne požiadavky, otázky alebo nás chcete niečo vedieť?"
          />
        </div>

        <div
          className={`flex items-start gap-3 p-4 rounded-sm border cursor-pointer select-none transition-all duration-200 ${
            form.agreed
              ? 'border-brass/30 bg-brass/5'
              : 'border-white/8 hover:border-white/15'
          }`}
          onClick={() => setForm((p) => ({ ...p, agreed: !p.agreed }))}
        >
          <div
            className={`w-5 h-5 flex-shrink-0 rounded-sm border flex items-center justify-center mt-0.5 transition-all duration-200 ${
              form.agreed ? 'bg-brass border-brass' : 'border-white/20'
            }`}
          >
            {form.agreed && <CheckSquare size={13} className="text-chinese-black" />}
          </div>
          <p className="text-white/50 text-sm leading-relaxed">
            Oboznámil/a som sa s{' '}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                navigateTo('/lokalita');
              }}
              className="text-brass/80 hover:text-brass underline underline-offset-2 transition-colors duration-200"
            >
              pravidlami pobytu a stornovacími podmienkami
            </button>
            {' '}a súhlasím s nimi. *
          </p>
        </div>

        <button
          type="submit"
          disabled={loading || !form.agreed}
          className="btn-primary w-full justify-center py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 size={17} className="animate-spin" />
              Odosielam rezerváciu...
            </>
          ) : (
            'Odoslať žiadosť o rezerváciu'
          )}
        </button>

        <p className="text-white/20 text-xs text-center leading-relaxed">
          Odoslaním formulára súhlasíte so spracovaním osobných údajov na účely vybavenia rezervácie.
          Žiadosť nie je záväznou rezerváciou — potvrdenie dostanete do 24 hodín.
        </p>
      </form>
    </div>
  );
}
