import { useState } from 'react';
import { CalendarDays, CheckCircle, RefreshCw, Info, AlertTriangle, Clock, Shield, ArrowRight } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import AvailabilityCalendar from '../components/reservation/AvailabilityCalendar';
import ReservationBookingForm from '../components/reservation/ReservationBookingForm';
import { useAvailability } from '../hooks/useAvailability';

type Step = 'calendar' | 'form' | 'success';

const SLOVAK_MONTHS_GEN = [
  'januára', 'februára', 'marca', 'apríla', 'mája', 'júna',
  'júla', 'augusta', 'septembra', 'októbra', 'novembra', 'decembra',
];

function formatDateSk(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return `${d.getDate()}. ${SLOVAK_MONTHS_GEN[d.getMonth()]} ${d.getFullYear()}`;
}

function nightCount(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0;
  const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  return Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24)));
}

function goHome() {
  window.history.pushState({}, '', '/');
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export default function ReservationPage() {
  const { getDayStatus, isRangeFree, loading, refresh } = useAvailability();

  const [step, setStep] = useState<Step>('calendar');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [rangeError, setRangeError] = useState('');

  const nights = nightCount(checkIn, checkOut);
  const rangeSelected = !!(checkIn && checkOut && nights > 0);
  const rangeFree = rangeSelected && isRangeFree(checkIn, checkOut);

  const handleContinue = () => {
    setRangeError('');
    if (!checkIn || !checkOut) {
      setRangeError('Vyberte prosím dátum príchodu aj odchodu.');
      return;
    }
    if (checkOut <= checkIn) {
      setRangeError('Dátum odchodu musí byť neskôr ako dátum príchodu.');
      return;
    }
    if (nights < 1) {
      setRangeError('Minimálna dĺžka pobytu je 1 noc.');
      return;
    }
    if (!isRangeFree(checkIn, checkOut)) {
      setRangeError('Zvolený termín nie je dostupný. Niektoré dni sú obsadené alebo blokované.');
      return;
    }
    setStep('form');
  };

  const handleSuccess = () => {
    refresh();
  };

  const handleReset = () => {
    setCheckIn('');
    setCheckOut('');
    setRangeError('');
    setStep('calendar');
    refresh();
  };

  return (
    <div className="min-h-screen bg-chinese-black">
      <Navigation />

      <div className="pt-28 pb-24">
        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-12">
            <p className="section-label mb-4">Online rezervácia</p>
            <h1 className="section-title mb-4">
              Rezervujte si pobyt<br />
              <span className="text-gradient">priamo online</span>
            </h1>
            <p className="section-subtitle max-w-xl mx-auto">
              Vyberte si voľný termín, vyplňte kontaktné údaje a odošlite žiadosť.
              Potvrdenie dostanete do 24 hodín.
            </p>
          </div>

          {step === 'success' ? (
            <div className="max-w-2xl mx-auto">
              <div className="bg-dark-jungle border border-white/5 rounded-xl p-10 md:p-14 text-center">
                <div className="w-20 h-20 rounded-full bg-brass/10 border border-brass/20 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={38} className="text-brass" />
                </div>
                <h2 className="font-serif text-white text-3xl mb-4">
                  Rezervácia odoslaná!
                </h2>
                <p className="text-white/55 leading-relaxed mb-2">
                  Vaša žiadosť o rezerváciu bola úspešne prijatá.
                </p>
                <p className="text-white/55 leading-relaxed mb-8">
                  Termín je dočasne zablokovaný pre ostatných návštevníkov.
                  Majiteľka vás kontaktuje do{' '}
                  <strong className="text-white/80">24 hodín</strong>{' '}
                  s potvrdením a ďalšími informáciami o platbe a pobyte.
                </p>

                <div className="grid sm:grid-cols-3 gap-4 mb-10">
                  {[
                    { icon: Clock, title: 'Do 24 hodín', desc: 'Dostanete potvrdenie' },
                    { icon: Shield, title: 'Bezpečne', desc: 'Termín je zablokovaný' },
                    { icon: CalendarDays, title: 'Flexibilne', desc: 'Možnosť zmeny termínu' },
                  ].map(({ icon: Icon, title, desc }) => (
                    <div key={title} className="bg-white/3 border border-white/5 rounded-sm p-4">
                      <Icon size={18} className="text-brass mb-2 mx-auto" />
                      <p className="text-white text-sm font-medium mb-0.5">{title}</p>
                      <p className="text-white/40 text-xs">{desc}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button onClick={handleReset} className="btn-outline">
                    <RefreshCw size={15} />
                    Nová rezervácia
                  </button>
                  <button onClick={goHome} className="btn-primary">
                    Späť na úvod
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-5 gap-8 items-start">

              <div className="lg:col-span-3">
                <div className="bg-dark-jungle border border-white/5 rounded-xl p-6 md:p-8 mb-5">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-serif text-white text-xl">Kalendár obsadenosti</h2>
                    <button
                      onClick={refresh}
                      className="flex items-center gap-1.5 text-white/25 hover:text-white/60 text-xs transition-colors duration-200"
                    >
                      <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
                      Obnoviť
                    </button>
                  </div>

                  <AvailabilityCalendar
                    getDayStatus={getDayStatus}
                    selectedCheckIn={checkIn}
                    selectedCheckOut={checkOut}
                    onSelectCheckIn={(d) => {
                      setCheckIn(d);
                      setCheckOut('');
                      setRangeError('');
                    }}
                    onSelectCheckOut={(d) => {
                      setCheckOut(d);
                      setRangeError('');
                    }}
                    loading={loading}
                  />
                </div>

                <div className="bg-dark-jungle border border-white/5 rounded-sm px-5 py-4">
                  <div className="flex items-start gap-3">
                    <Info size={14} className="text-brass/50 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-white/45 text-sm mb-1">
                        <strong className="text-white/65">Ako rezervovať:</strong> Kliknite na deň príchodu, potom na deň odchodu.
                      </p>
                      <p className="text-white/30 text-xs">
                        Minimálna dĺžka pobytu: 1 noc · Check-in od 14:00 · Check-out do 10:30
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="bg-dark-jungle border border-white/5 rounded-xl p-6 md:p-8 sticky top-24">
                  {step === 'calendar' ? (
                    <>
                      <h2 className="font-serif text-white text-xl mb-6">Váš výber</h2>

                      <div className="space-y-1 mb-6">
                        <div className="flex justify-between items-center py-3.5 border-b border-white/5">
                          <div>
                            <p className="text-white/35 text-xs uppercase tracking-wider mb-0.5">Príchod</p>
                            <p className={`font-medium ${checkIn ? 'text-white' : 'text-white/20'}`}>
                              {checkIn ? formatDateSk(checkIn) : '—'}
                            </p>
                          </div>
                          <CalendarDays size={16} className={checkIn ? 'text-brass' : 'text-white/10'} />
                        </div>

                        <div className="flex justify-between items-center py-3.5 border-b border-white/5">
                          <div>
                            <p className="text-white/35 text-xs uppercase tracking-wider mb-0.5">Odchod</p>
                            <p className={`font-medium ${checkOut ? 'text-white' : 'text-white/20'}`}>
                              {checkOut ? formatDateSk(checkOut) : '—'}
                            </p>
                          </div>
                          <CalendarDays size={16} className={checkOut ? 'text-brass' : 'text-white/10'} />
                        </div>

                        <div className="flex justify-between items-center py-3.5">
                          <p className="text-white/35 text-xs uppercase tracking-wider">Počet nocí</p>
                          <p className={`font-serif text-2xl ${nights > 0 ? 'text-brass' : 'text-white/15'}`}>
                            {nights > 0 ? nights : '—'}
                          </p>
                        </div>
                      </div>

                      {rangeError && (
                        <div className="flex items-start gap-2.5 p-3.5 rounded-sm bg-red-900/15 border border-red-500/20 mb-4">
                          <AlertTriangle size={13} className="text-red-400 mt-0.5 flex-shrink-0" />
                          <p className="text-red-400 text-xs leading-relaxed">{rangeError}</p>
                        </div>
                      )}

                      {rangeSelected && rangeFree && !rangeError && (
                        <div className="flex items-center gap-2 p-3 rounded-sm bg-green-500/8 border border-green-500/15 mb-4">
                          <CheckCircle size={13} className="text-green-400 flex-shrink-0" />
                          <p className="text-green-400 text-xs">Termín je voľný — môžete pokračovať</p>
                        </div>
                      )}

                      {rangeSelected && !rangeFree && !rangeError && (
                        <div className="flex items-center gap-2 p-3 rounded-sm bg-red-900/15 border border-red-500/20 mb-4">
                          <AlertTriangle size={13} className="text-red-400 flex-shrink-0" />
                          <p className="text-red-400 text-xs">Tento termín nie je dostupný</p>
                        </div>
                      )}

                      <button
                        onClick={handleContinue}
                        disabled={!checkIn || !checkOut || !rangeFree}
                        className="btn-primary w-full justify-center py-4 text-base disabled:opacity-35 disabled:cursor-not-allowed"
                      >
                        Pokračovať k rezervácii
                        <ArrowRight size={16} />
                      </button>

                      {(checkIn || checkOut) && (
                        <button
                          onClick={() => { setCheckIn(''); setCheckOut(''); setRangeError(''); }}
                          className="mt-3 w-full text-center text-white/25 hover:text-white/50 text-xs py-1 transition-colors duration-200"
                        >
                          Zrušiť výber
                        </button>
                      )}

                      <div className="mt-6 pt-5 border-t border-white/5 space-y-2.5">
                        {[
                          { icon: Clock, text: 'Potvrdenie do 24 hodín' },
                          { icon: Shield, text: 'Termín okamžite zablokovaný' },
                          { icon: CalendarDays, text: 'Bezplatné zrušenie do 14 dní' },
                        ].map(({ icon: Icon, text }) => (
                          <div key={text} className="flex items-center gap-2.5">
                            <Icon size={13} className="text-brass/50 flex-shrink-0" />
                            <span className="text-white/35 text-xs">{text}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <ReservationBookingForm
                      checkIn={checkIn}
                      checkOut={checkOut}
                      onBack={() => { setStep('calendar'); setRangeError(''); }}
                      onSuccess={handleSuccess}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
