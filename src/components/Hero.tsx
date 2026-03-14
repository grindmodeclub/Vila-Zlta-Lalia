import { ChevronDown, ArrowRight } from 'lucide-react';

function navigateTo(path: string) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export default function Hero() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="domov"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/vila_hero.webp)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-chinese-black/70 via-chinese-black/35 to-chinese-black" />
      <div className="absolute inset-0 bg-gradient-to-r from-chinese-black/45 via-transparent to-transparent" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <div className="animate-fade-in">
          <p className="section-label mb-6 tracking-[0.3em]">
            Oščadnica · Veľká Rača · Kysuce
          </p>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-[4.5rem] text-white leading-tight mb-6 tracking-tight">
            Vila Žltá Ľalia —<br />
            <span className="text-gradient italic">domov ďaleko od domu</span>
          </h1>
          <p className="text-lg md:text-xl text-white max-w-2xl mx-auto leading-relaxed font-light mb-3">
            Celá vila výhradne pre vás. Deväť lôžok, tri kúpeľne, krb, terasa,
            vonkajší bazén a kúpacia kaďa — v srdci Kysuckých Beskýd.
          </p>
          <p className="text-sm text-white max-w-lg mx-auto mb-10 tracking-wide">
            Ideálne pre rodiny, páry aj väčšie skupiny. Celý rok.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigateTo('/rezervacia')}
              className="btn-primary text-base px-9 py-4 gap-2.5"
            >
              Rezervovať pobyt
              <ArrowRight size={17} />
            </button>
            <button
              onClick={() => navigateTo('/cennik')}
              className="btn-outline text-base px-9 py-4"
            >
              Zobraziť cenník
            </button>
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 cursor-pointer hover:text-white/55 transition-colors duration-300"
        onClick={() => scrollTo('o-vile')}
      >
        <span className="text-xs tracking-[0.2em] uppercase">Objavte vilu</span>
        <ChevronDown size={17} className="animate-bounce" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-chinese-black to-transparent pointer-events-none" />
    </section>
  );
}
