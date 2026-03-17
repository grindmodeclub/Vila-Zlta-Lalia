import { useEffect, useRef } from 'react';
import { ArrowRight, Star } from 'lucide-react';

function navigateTo(path: string) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

const seasons = [
  {
    name: 'Zimná sezóna',
    period: '4.1. – 31.3.',
    price: 130,
    minNights: 2,
    highlight: false,
  },
  {
    name: 'Letná mimosezóna',
    period: '1.4. – 30.6.',
    price: 120,
    minNights: 2,
    highlight: false,
  },
  {
    name: 'Letná sezóna',
    period: '1.7. – 31.8.',
    price: 130,
    minNights: 4,
    highlight: true,
  },
  {
    name: 'Zimná mimosezóna',
    period: '1.9. – 22.12.',
    price: 120,
    minNights: 2,
    highlight: false,
  },
];

export default function Pricing() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.06 }
    );
    section.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="cennik" className="py-24 md:py-32 bg-dark-jungle" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="section-label mb-4 reveal">Cenník</p>
          <h2 className="section-title mb-4 reveal reveal-delay-1">
            Cena za celý objekt<br />
            <span className="text-gradient">nie za osobu</span>
          </h2>
          <p className="section-subtitle max-w-xl mx-auto reveal reveal-delay-2">
            Prenajímate si celú vilu — žiadne zdieľanie s inými hosťami.
            Ceny platia za celý objekt bez ohľadu na počet hostí.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          {seasons.map((s) => (
            <div
              key={s.name}
              className={`relative rounded-lg p-6 border transition-all duration-300 ${
                s.highlight
                  ? 'bg-brass/8 border-brass/35 shadow-xl shadow-brass/5'
                  : 'bg-chinese-black border-white/5 hover:border-brass/20'
              }`}
            >
              {s.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brass text-chinese-black text-xs font-semibold px-3 py-0.5 rounded-sm tracking-wide flex items-center gap-1">
                  <Star size={10} fill="currentColor" />
                  Najobľúbenejšie
                </span>
              )}
              <p className="text-brass/60 text-xs uppercase tracking-widest mb-1">{s.period}</p>
              <h3 className="font-serif text-white text-lg mb-4">{s.name}</h3>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="font-serif text-brass text-3xl">{s.price}</span>
                <span className="text-white/40 text-sm">€ / noc</span>
              </div>
              <p className="text-white/30 text-xs mb-4">min. {s.minNights} noci</p>
              <div className="h-px bg-white/5 mb-4" />
              <p className="text-white/35 text-xs">+ 10 € za 8. a každú ďalšiu osobu</p>
            </div>
          ))}
        </div>

        <div className="grid sm:grid-cols-3 gap-5 mb-10">
          {[
            { name: 'Vianočný pobyt', period: '23.12. – 26.12.', price: 140, minNights: 3 },
            { name: 'Silvester', period: '26.12. – 3.1.', price: 200, minNights: 5 },
            { name: 'Veľkonočný pobyt', period: '3.4. – 6.4.', price: 150, minNights: 3 },
          ].map((s) => (
            <div
              key={s.name}
              className="bg-chinese-black border border-white/5 hover:border-brass/20 rounded-lg p-6 transition-all duration-300"
            >
              <p className="text-brass/60 text-xs uppercase tracking-widest mb-1">{s.period}</p>
              <h3 className="font-serif text-white text-lg mb-4">{s.name}</h3>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="font-serif text-brass text-3xl">{s.price}</span>
                <span className="text-white/40 text-sm">€ / noc</span>
              </div>
              <p className="text-white/30 text-xs mb-4">min. {s.minNights} {s.minNights === 1 ? 'noc' : s.minNights < 5 ? 'noci' : 'nocí'}</p>
              <div className="h-px bg-white/5 mb-4" />
              <p className="text-white/35 text-xs">+ 10 € za 8. a každú ďalšiu osobu</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigateTo('/cennik')}
            className="btn-outline"
          >
            Zobraziť celý cenník
            <ArrowRight size={15} />
          </button>
          <button
            onClick={() => navigateTo('/rezervacia')}
            className="btn-primary"
          >
            Rezervovať termín
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </section>
  );
}
