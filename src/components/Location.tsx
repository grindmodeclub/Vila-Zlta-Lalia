import { useEffect, useRef } from 'react';
import { MapPin, ShoppingCart, UtensilsCrossed, Bus, Brain as Train, Mountain, Bike } from 'lucide-react';

const nearbyDistances = [
  { icon: ShoppingCart, label: 'Potraviny', distance: '200 m' },
  { icon: UtensilsCrossed, label: 'Reštaurácia', distance: '2 km' },
  { icon: Bus, label: 'Zastávka autobusu', distance: '200 m' },
  { icon: Train, label: 'Vlaková stanica', distance: '3 km' },
];

const attractions = [
  {
    icon: Mountain,
    name: 'Snow Paradise Veľká Rača',
    desc: 'Lyžiarske stredisko s tratiami pre začiatočníkov aj pokročilých. Priamo pri obci Oščadnica.',
    season: 'Zima',
  },
  {
    icon: Bike,
    name: 'Bike Park Veľká Rača',
    desc: 'Jeden z najväčších bike parkov na Slovensku s tratiami rôznych náročností.',
    season: 'Leto',
  },
  {
    icon: Mountain,
    name: 'Rozhľadňa Dedovka',
    desc: 'Obľúbená turistická atrakcia s krásnym výhľadom na Kysucké Beskydy.',
    season: 'Celý rok',
  },
  {
    icon: Mountain,
    name: 'Rozhľadňa u Jantov',
    desc: 'Menšia rozhľadňa na horskom hrebeni vhodná pre rodinné výlety.',
    season: 'Celý rok',
  },
  {
    icon: Mountain,
    name: 'Slovenský orloj v Starej Bystrici',
    desc: 'Unikátny hodinový stroj symbolizujúci slovenský folklór a históriu.',
    season: 'Celý rok',
  },
  {
    icon: Mountain,
    name: 'Skalné gule Megoňky',
    desc: 'Prírodná atrakcia — guľaté skalné útvary neďaleko Oščadnice.',
    season: 'Celý rok',
  },
];

export default function Location() {
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
    <section id="lokalita" className="py-24 md:py-32 bg-chinese-black" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="section-label mb-4 reveal">Lokalita</p>
          <h2 className="section-title mb-4 reveal reveal-delay-1">
            Oščadnica —<br />
            <span className="text-gradient">srdce Kysúc a Veľkej Račy</span>
          </h2>
          <p className="section-subtitle max-w-2xl mx-auto reveal reveal-delay-2">
            Vila sa nachádza v rekreačnej oblasti Oščadnice, pri lyžiarskom stredisku
            a turistických chodníkoch Kysuckých Beskýd. Región ponúka zážitky počas
            celého roka.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16 items-start">
          <div className="reveal">
            <div className="flex items-start gap-3 mb-8 p-5 rounded-lg bg-dark-jungle border border-white/5">
              <MapPin size={17} className="text-brass mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-white font-medium mb-0.5">Vila Žltá Ľalia</p>
                <p className="text-white/55 text-sm">Oščadnica 155, 023 01 Oščadnica</p>
                <p className="text-white/30 text-xs mt-1">GPS: 49.425867, 18.864561</p>
              </div>
            </div>

            <h3 className="font-serif text-white text-xl mb-4">Vzdialenosti od vily</h3>
            <div className="grid grid-cols-2 gap-3 mb-8">
              {nearbyDistances.map((d) => (
                <div
                  key={d.label}
                  className="flex items-center gap-3 p-4 rounded-lg bg-dark-jungle border border-white/5 hover:border-brass/20 transition-colors duration-200 group"
                >
                  <d.icon size={15} className="text-brass flex-shrink-0" />
                  <div>
                    <p className="text-white/65 text-sm group-hover:text-white/80 transition-colors duration-200">{d.label}</p>
                    <p className="text-brass text-sm font-medium">{d.distance}</p>
                  </div>
                </div>
              ))}
            </div>

            <h3 className="font-serif text-white text-xl mb-3">Región a okolie</h3>
            <p className="text-white/45 text-sm leading-relaxed">
              Oščadnica leží v Kysuckom regióne na severe Slovenska, v Kysuckých Beskydách.
              Obec je vstupnou bránou do lyžiarskeho a turistického areálu Veľká Rača.
              Okolie ponúka bohatú sieť turistických chodníkov a cyklotrás vhodných pre
              všetky vekové kategórie.
            </p>
          </div>

          <div className="rounded-xl overflow-hidden border border-white/8 shadow-2xl reveal reveal-delay-2">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2633.5!2d18.8641!3d49.4259!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDnCsDI1JzMzLjEiTiAxOMKwNTEnNTIuNCJF!5e0!3m2!1ssk!2ssk!4v1700000000000"
              width="100%"
              height="420"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa – Vila Žltá Ľalia, Oščadnica 155"
              className="grayscale contrast-110 opacity-75 w-full"
            />
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-white/8 to-transparent mb-14" />

        <div>
          <div className="text-center mb-10">
            <h3 className="font-serif text-white text-2xl md:text-3xl reveal">Čo nájdete v okolí</h3>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {attractions.map((a, i) => (
              <div
                key={a.name}
                className={`card-dark p-6 group cursor-default reveal reveal-delay-${Math.min(i + 1, 6) as 1 | 2 | 3 | 4 | 5 | 6}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-sm bg-brass/8 border border-brass/10 flex items-center justify-center group-hover:bg-brass/15 group-hover:border-brass/22 transition-all duration-300">
                    <a.icon size={17} className="text-brass" />
                  </div>
                  <span className="text-xs bg-white/4 text-white/35 border border-white/6 px-2 py-1 rounded-sm">
                    {a.season}
                  </span>
                </div>
                <h4 className="font-serif text-white mb-2 group-hover:text-brass/90 transition-colors duration-300">{a.name}</h4>
                <p className="text-white/40 text-sm leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
