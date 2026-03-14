import { useState } from 'react';
import { CalendarDays, Users, Home, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { ReservationFormData } from '../types';

const roomTypes = [
  'Celá vila (odporúčame)',
  'Dvojlôžkové štúdio (2 osoby)',
  'Trojlôžková izba (3 osoby)',
  'Štvorlôžková izba (4 osoby)',
];

const initialForm: ReservationFormData = {
  guest_name: '',
  guest_email: '',
  guest_phone: '',
  check_in: '',
  check_out: '',
  guests_count: 2,
  room_type: 'Celá vila (odporúčame)',
  message: '',
};

export default function ReservationForm() {
  const [form, setForm] = useState<ReservationFormData>(initialForm);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'guests_count' ? Number(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');
    setErrorMsg('');

    if (form.check_out <= form.check_in) {
      setStatus('error');
      setErrorMsg('Dátum odchodu musí byť po dátume príchodu.');
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('reservations').insert([
      {
        guest_name: form.guest_name,
        guest_email: form.guest_email,
        guest_phone: form.guest_phone,
        check_in: form.check_in,
        check_out: form.check_out,
        guests_count: form.guests_count,
        room_type: form.room_type,
        message: form.message,
        status: 'pending',
      },
    ]);

    setLoading(false);

    if (error) {
      setStatus('error');
      setErrorMsg('Nastala chyba pri odosielaní rezervácie. Skúste to prosím znova.');
    } else {
      setStatus('success');
      setForm(initialForm);
    }
  };

  if (status === 'success') {
    return (
      <section id="rezervacia" className="py-24 md:py-32 bg-chinese-black">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="w-20 h-20 rounded-full bg-brass/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-brass" />
          </div>
          <h2 className="font-serif text-white text-3xl md:text-4xl mb-4">
            Rezervácia odoslaná!
          </h2>
          <p className="text-white/60 mb-8 leading-relaxed">
            Ďakujeme za vašu rezerváciu. Potvrdenie vám zašleme na zadaný e-mail
            v čo najkratšom čase.
          </p>
          <button
            onClick={() => setStatus('idle')}
            className="btn-outline"
          >
            Vytvoriť novú rezerváciu
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="rezervacia" className="py-24 md:py-32 bg-chinese-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <p className="section-label mb-4">Rezervácia</p>
            <h2 className="section-title mb-6">
              Zarezervujte si<br />
              <span className="text-gradient">váš pobyt online</span>
            </h2>
            <p className="section-subtitle mb-10">
              Vyplňte žiadosť o rezerváciu a my vás do 24 hodín kontaktujeme
              s potvrdením, cenou a ďalšími pokynmi.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-sm bg-brass/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CalendarDays size={18} className="text-brass" />
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">Vyberte termín</h4>
                  <p className="text-white/50 text-sm">Skontrolujte dostupnosť a vyberte si dátumy pobytu.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-sm bg-brass/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Users size={18} className="text-brass" />
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">Zadajte počet hostí</h4>
                  <p className="text-white/50 text-sm">Kapacita vily je 9 osôb. Uveďte presný počet hostí.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-sm bg-brass/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Home size={18} className="text-brass" />
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">Odoslajte žiadosť</h4>
                  <p className="text-white/50 text-sm">Do 24 hodín vám odpovieme s potvrdením a platobným odkazom.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-dark-jungle border border-white/5 rounded-lg p-8">
            <h3 className="font-serif text-white text-xl mb-6">Formulár rezervácie</h3>

            {status === 'error' && (
              <div className="flex items-start gap-3 p-4 rounded-sm bg-red-900/20 border border-red-500/20 mb-6">
                <AlertCircle size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
                <p className="text-red-400 text-sm">{errorMsg}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="label-dark">Meno a priezvisko *</label>
                  <input
                    type="text"
                    name="guest_name"
                    value={form.guest_name}
                    onChange={handleChange}
                    className="input-dark"
                    placeholder="Ján Novák"
                    required
                  />
                </div>
                <div>
                  <label className="label-dark">E-mail *</label>
                  <input
                    type="email"
                    name="guest_email"
                    value={form.guest_email}
                    onChange={handleChange}
                    className="input-dark"
                    placeholder="jan@priklad.sk"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="label-dark">Telefón *</label>
                <input
                  type="tel"
                  name="guest_phone"
                  value={form.guest_phone}
                  onChange={handleChange}
                  className="input-dark"
                  placeholder="+421 900 000 000"
                  required
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="label-dark">Príchod *</label>
                  <input
                    type="date"
                    name="check_in"
                    value={form.check_in}
                    onChange={handleChange}
                    min={today}
                    className="input-dark"
                    required
                  />
                </div>
                <div>
                  <label className="label-dark">Odchod *</label>
                  <input
                    type="date"
                    name="check_out"
                    value={form.check_out}
                    onChange={handleChange}
                    min={form.check_in || today}
                    className="input-dark"
                    required
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="label-dark">Počet hostí *</label>
                  <input
                    type="number"
                    name="guests_count"
                    value={form.guests_count}
                    onChange={handleChange}
                    min={1}
                    max={9}
                    className="input-dark"
                    required
                  />
                </div>
                <div>
                  <label className="label-dark">Typ ubytovania</label>
                  <select
                    name="room_type"
                    value={form.room_type}
                    onChange={handleChange}
                    className="input-dark"
                  >
                    {roomTypes.map((r) => (
                      <option key={r} value={r} className="bg-jet">
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="label-dark">Správa / špeciálne požiadavky</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={3}
                  className="input-dark resize-none"
                  placeholder="Máte nejaké špeciálne požiadavky alebo otázky?"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Odosielam...
                  </>
                ) : (
                  'Odoslať žiadosť o rezerváciu'
                )}
              </button>

              <p className="text-white/30 text-xs text-center">
                Odoslaním formulára súhlasíte so spracovaním osobných údajov.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
