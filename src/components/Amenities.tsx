import { useEffect, useRef } from 'react';
import {
  Flame, Sofa, Gamepad2, Tv2, UtensilsCrossed,
  Zap, Coffee, Refrigerator, Waves, Dumbbell,
  TreePine, Bike, Baby, Wifi, Car,
  ShowerHead, Shield, ArrowRight
} from 'lucide-react';

const categories = [
  {
    title: 'Spoločenská miestnosť',
    items: [
      { icon: Flame, label: 'Krb / kachle' },
      { icon: Sofa, label: 'Gauč a sedenie' },
      { icon: Tv2, label: 'Televízor' },
      { icon: UtensilsCrossed, label: 'Jedálenské posedenie' },
      { icon: Gamepad2, label: 'Spoločenské hry' },
    ],
  },
  {
    title: 'Kuchyňa',
    items: [
      { icon: Zap, label: 'Elektrická rúra' },
      { icon: Flame, label: 'Plynový sporák' },
      { icon: Zap, label: 'Mikrovlnná rúra' },
      { icon: Coffee, label: 'Rýchlovarná kanvica' },
      { icon: Refrigerator, label: 'Chladnička + mraznička' },
      { icon: Zap, label: 'Hriankovač + toastovač' },
    ],
  },
  {
    title: 'Wellness a relax',
    items: [
      { icon: Waves, label: 'Kúpacia kaďa' },
      { icon: Waves, label: 'Vonkajší bazén' },
      { icon: Flame, label: 'Ohnisko' },
      { icon: TreePine, label: 'Prestrešená terasa' },
      { icon: UtensilsCrossed, label: 'Gril a kotlík' },
      { icon: Sofa, label: 'Vonkajšie posedenie' },
      { icon: TreePine, label: 'Záhradná hojdačka' },
    ],
  },
  {
    title: 'Šport a voľný čas',
    items: [
      { icon: Dumbbell, label: 'Šípky' },
      { icon: Gamepad2, label: 'Stolný futbal' },
      { icon: Bike, label: 'Priestor na odloženie bicyklov a lyží' },
    ],
  },
  {
    title: 'Pre rodiny s deťmi',
    items: [
      { icon: Baby, label: 'Detská postieľka' },
      { icon: Baby, label: 'Hračky pre deti' },
      { icon: Baby, label: 'Detské ihrisko so šmykľavkou, pieskoviskom a záhradným domčekom' },
    ],
  },
  {
    title: 'Základné služby',
    items: [
      { icon: Wifi, label: 'WiFi internet' },
      { icon: Car, label: 'Parkovanie (3 miesta)' },
      { icon: ShowerHead, label: 'Ložné prádlo + uteráky' },
    ],
  },
];

function navigateTo(path: string) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export default function Amenities() {
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
    <section id="vybavenie" className="py-24 md:py-32 bg-dark-jungle" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="section-label mb-4 reveal">Vybavenie</p>
          <h2 className="section-title mb-4 reveal reveal-delay-1">
            Kompletné vybavenie<br />
            <span className="text-gradient">objektu a areálu</span>
          </h2>
          <p className="section-subtitle max-w-2xl mx-auto reveal reveal-delay-2">
            Vila je vybavená nadštandardne — od plnohodnotnej kuchyne cez wellness prvky
            až po detské vybavenie. Nemusíte si prinášať skoro nič.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {categories.map((cat, i) => (
            <div
              key={cat.title}
              className={`bg-chinese-black border border-white/5 rounded-lg p-6 hover:border-brass/18 transition-all duration-300 reveal reveal-delay-${Math.min(i + 1, 6) as 1 | 2 | 3 | 4 | 5 | 6}`}
            >
              <h3 className="font-serif text-white text-lg mb-5 pb-3 border-b border-white/5">
                {cat.title}
              </h3>
              <ul className="space-y-3">
                {cat.items.map((item) => (
                  <li key={item.label} className="flex items-center gap-3 group">
                    <div className="w-7 h-7 rounded-sm bg-brass/8 flex items-center justify-center flex-shrink-0 group-hover:bg-brass/15 transition-colors duration-200">
                      <item.icon size={13} className="text-brass" />
                    </div>
                    <span className="text-white/60 text-sm group-hover:text-white/80 transition-colors duration-200">{item.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="bg-chinese-black border border-white/5 rounded-lg p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 reveal">
          <div>
            <p className="text-white font-medium mb-1">Všetko k dispozícii od príchodu</p>
            <p className="text-white/40 text-sm max-w-xl">
              Ložné prádlo, uteráky aj základné vybavenie kúpeľní sú zahrnuté v cene pobytu.
              Majiteľ sa počas vášho pobytu v objekte nezdržiava.
            </p>
          </div>
          <button
            onClick={() => navigateTo('/rezervacia')}
            className="btn-outline flex-shrink-0 gap-2"
          >
            Rezervovať pobyt
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </section>
  );
}
