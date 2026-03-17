import { useEffect, useRef } from 'react';
import { Users, Bath, Flame, Wifi, Car, Waves, TreePine, Shield, ArrowRight } from 'lucide-react';

const highlights = [
  { icon: Users, value: '9', unit: 'lôžok', desc: 'Kapacita pre celú rodinu alebo skupinu priateľov' },
  { icon: Bath, value: '3 + 1', unit: 'kúpeľne / WC', desc: '3 kúpeľne s toaletou a 1 samostatná toaleta' },
  { icon: Waves, value: 'Bazén', unit: '+ kaďa', desc: 'Kúpacia kaďa a vonkajší bazén priamo pri vile' },
  { icon: Flame, value: 'Krb', unit: '+ terasa', desc: 'Spoločenská miestnosť s krbom, zastrešená terasa a ohnisko' },
  { icon: Wifi, value: 'WiFi', unit: 'zadarmo', desc: 'Bezdrôtové pripojenie na internet v celom objekte' },
  { icon: Car, value: '3', unit: 'park. miesta', desc: 'Bezplatné parkovanie priamo pri vile' },
  { icon: TreePine, value: 'Príroda', unit: 'na dosah', desc: 'Turistika, cyklistika, lyžovačka — všetko blízko' },
  { icon: Shield, value: 'Súkromie', unit: 'garantované', desc: 'Celý objekt výhradne pre vašu skupinu po celý pobyt' },
];

const galleryImages = [
  { src: '/prva_foto_sekcia.webp', alt: 'Obývacia izba s jedálňou', caption: 'Obývacia izba s jedálňou' },
  { src: '/druha_foto_sekcia.webp', alt: 'Kúpacia kaďa a bazén', caption: 'Kúpacia kaďa a bazén' },
  { src: '/tretia_foto_sekcia.webp', alt: 'Útulná obývacia izba', caption: 'Útulná obývacia izba' },
  { src: '/stvrta_foto_sekcia.webp', alt: 'Terasa a záhrada', caption: 'Terasa a záhrada' },
];

function navigateTo(path: string) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export default function About() {
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

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="o-vile" className="py-24 md:py-32 bg-dark-jungle" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <p className="section-label mb-4 reveal">O vile</p>
            <h2 className="section-title mb-6 reveal reveal-delay-1">
              Komfortné ubytovanie<br />
              <span className="text-gradient">pre celú skupinu</span>
            </h2>
            <p className="section-subtitle mb-5 reveal reveal-delay-2">
              Vila Žltá Ľalia je rekreačná chata v Oščadnici, v srdci Kysúc,
              situovaná v rekreačnej oblasti pri lyžiarskom stredisku Veľká Rača.
              Objekt prenajímame výhradne jednej skupine hostí — celá vila je
              po dobu pobytu len pre vás.
            </p>
            <p className="section-subtitle mb-5 reveal reveal-delay-3">
              Interiér tvorí kompletne vybavená kuchyňa, spoločenská miestnosť
              s krbom a televízorom, tri spálne, tri kúpeľne s toaletou a jedna
              samostatná toaleta. K dispozícii je zastrešená terasa, gril, ohnisko,
              kúpacia kaďa a vonkajší bazén.
            </p>
            <p className="section-subtitle mb-5 reveal reveal-delay-4">
              Vila je vhodná pre rodiny s deťmi, páry, turistov aj väčšie skupiny —
              v zime na lyžovačku, v lete na turistiku, na jar aj jeseň
              na pokojný oddych v prírode.
            </p>
            <p className="section-subtitle mb-10 reveal reveal-delay-5">
              Súčasťou areálu je aj detské ihrisko so šmykľavkou, pieskoviskom
              a plastovým záhradným domčekom.
            </p>
            <div className="flex flex-wrap gap-3 reveal reveal-delay-6">
              <button onClick={() => navigateTo('/rezervacia')} className="btn-primary">
                Rezervovať pobyt
                <ArrowRight size={15} />
              </button>
              <button onClick={() => scrollTo('izby')} className="btn-outline">
                Zobraziť izby
              </button>
            </div>
          </div>

          <div className="relative reveal reveal-delay-2">
            <div className="grid grid-cols-2 gap-3">
              {galleryImages.map((img, i) => (
                <div
                  key={img.src}
                  className={`relative group overflow-hidden rounded-lg ${
                    i === 1 ? 'mt-8' : i === 2 ? '-mt-4' : i === 3 ? 'mt-4' : ''
                  }`}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="h-52 w-full object-cover transition-transform duration-700 group-hover:scale-106"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-chinese-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                  <span className="absolute bottom-2.5 left-3 text-white/90 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    {img.caption}
                  </span>
                </div>
              ))}
            </div>
            <div className="absolute -bottom-5 -left-5 w-28 h-28 border border-brass/18 rounded-lg pointer-events-none" />
            <div className="absolute -top-5 -right-5 w-16 h-16 border border-brass/12 rounded-lg pointer-events-none" />
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-white/8 to-transparent mb-16" />

        <div>
          <div className="text-center mb-12">
            <p className="section-label mb-3 reveal">Prečo Vila Žltá Ľalia</p>
            <h3 className="font-serif text-white text-2xl md:text-3xl reveal reveal-delay-1">
              Všetko, čo potrebujete pre dokonalý pobyt
            </h3>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {highlights.map((h, i) => (
              <div
                key={h.value + h.unit}
                className={`card-dark p-6 group cursor-default reveal reveal-delay-${Math.min(i + 1, 8) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8}`}
              >
                <div className="w-10 h-10 rounded-sm bg-brass/8 border border-brass/10 flex items-center justify-center mb-4 group-hover:bg-brass/15 group-hover:border-brass/22 transition-all duration-300">
                  <h.icon size={18} className="text-brass" />
                </div>
                <div className="mb-2">
                  <span className="font-serif text-brass text-xl">{h.value}</span>
                  <span className="text-white/40 text-xs ml-1.5">{h.unit}</span>
                </div>
                <p className="text-white/45 text-sm leading-relaxed">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
