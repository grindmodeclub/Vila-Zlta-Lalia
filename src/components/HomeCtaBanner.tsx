import { useEffect, useRef } from 'react';
import { BedDouble, Layers, Tag, MapPin, Mail, ArrowRight, CalendarDays } from 'lucide-react';

function navigateTo(path: string) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

const links = [
  { icon: BedDouble, label: 'Izby', desc: 'Tri spálne, 9 lôžok', href: '/izby' },
  { icon: Layers, label: 'Vybavenie', desc: 'Kuchyňa, bazén, krb...', href: '/vybavenie' },
  { icon: Tag, label: 'Cenník', desc: 'Sezónne ceny', href: '/cennik' },
  { icon: MapPin, label: 'Lokalita', desc: 'Oščadnica, Veľká Rača', href: '/lokalita' },
  { icon: Mail, label: 'Kontakt', desc: 'Napíšte nám', href: '/kontakt' },
];

export default function HomeCtaBanner() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.08 }
    );
    section.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-24 md:py-32 bg-dark-jungle" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-14">
          <p className="section-label mb-4 reveal">Objavte viac</p>
          <h2 className="section-title mb-4 reveal reveal-delay-1">
            Všetko, čo potrebujete<br />
            <span className="text-gradient">vedieť pred pobytom</span>
          </h2>
          <p className="section-subtitle max-w-xl mx-auto reveal reveal-delay-2">
            Prezrite si izby, vybavenie vily, aktuálny cenník aj informácie o lokalite —
            všetko prehľadne na jednom mieste.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
          {links.map((link, i) => (
            <button
              key={link.href}
              onClick={() => navigateTo(link.href)}
              className={`card-dark p-6 text-left group hover:border-brass/25 hover:-translate-y-0.5 transition-all duration-300 reveal reveal-delay-${i + 1 as 1 | 2 | 3 | 4 | 5}`}
            >
              <div className="w-10 h-10 rounded-sm bg-brass/8 border border-brass/12 flex items-center justify-center mb-5 group-hover:bg-brass/15 group-hover:border-brass/25 transition-all duration-300">
                <link.icon size={18} className="text-brass" />
              </div>
              <p className="font-serif text-white text-lg mb-1 group-hover:text-brass transition-colors duration-300">{link.label}</p>
              <p className="text-white/35 text-sm">{link.desc}</p>
              <div className="flex items-center gap-1 mt-4 text-brass/45 text-xs group-hover:text-brass transition-colors duration-300">
                Zobraziť <ArrowRight size={11} className="transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </button>
          ))}
        </div>

        <div className="relative overflow-hidden border border-brass/15 rounded-xl p-10 md:p-14 text-center reveal">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/sekcia.webp')" }} />
          <div className="absolute inset-0 bg-black/65 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
          <div className="relative">
            <div className="w-14 h-14 rounded-full bg-brass/10 border border-brass/20 flex items-center justify-center mx-auto mb-6">
              <CalendarDays size={22} className="text-brass" />
            </div>
            <p className="section-label mb-3">Rezervácia online</p>
            <h3 className="font-serif text-white text-2xl md:text-3xl mb-4">
              Vyberajte termín priamo<br />v interaktívnom kalendári
            </h3>
            <p className="text-white/40 text-sm md:text-base mb-8 max-w-lg mx-auto leading-relaxed">
              Skontrolujte obsadenosť, vyberte dátumy a odošlite žiadosť.
              Potvrdenie dostanete do 24 hodín.
            </p>
            <button
              onClick={() => navigateTo('/rezervacia')}
              className="btn-primary py-4 px-10 text-base"
            >
              Rezervovať pobyt
              <ArrowRight size={17} />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
