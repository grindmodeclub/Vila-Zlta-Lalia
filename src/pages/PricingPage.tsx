import { Check, ArrowRight, Star, Info, Car, Sparkles, Flame, Bed, Zap, Waves, Wifi, PawPrint, Dog, Bath } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

function navigateTo(path: string) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

const allSeasons = [
  {
    name: 'Zimná sezóna',
    period: '4. januára – 31. marca',
    shortPeriod: '4.1. – 31.3.',
    price: 130,
    minNights: 2,
    highlight: false,
    badge: null,
  },
  {
    name: 'Letná mimosezóna',
    period: '1. apríla – 30. júna',
    shortPeriod: '1.4. – 30.6.',
    price: 120,
    minNights: 2,
    highlight: false,
    badge: null,
  },
  {
    name: 'Veľkonočný pobyt',
    period: '3. apríla – 6. apríla',
    shortPeriod: '3.4. – 6.4.',
    price: 150,
    minNights: 3,
    highlight: false,
    badge: 'Špeciálny termín',
  },
  {
    name: 'Letná sezóna',
    period: '1. júla – 31. augusta',
    shortPeriod: '1.7. – 31.8.',
    price: 130,
    minNights: 4,
    highlight: true,
    badge: 'Najpopulárnejší',
  },
  {
    name: 'Letná sezóna variant',
    period: '1. júla – 31. augusta',
    shortPeriod: '1.7. – 31.8.',
    price: 140,
    minNights: 3,
    highlight: false,
    badge: null,
  },
  {
    name: 'Zimná mimosezóna',
    period: '1. septembra – 22. decembra',
    shortPeriod: '1.9. – 22.12.',
    price: 120,
    minNights: 2,
    highlight: false,
    badge: null,
  },
  {
    name: 'Vianočný pobyt',
    period: '23. decembra – 25. decembra',
    shortPeriod: '23.12. – 25.12.',
    price: 140,
    minNights: 2,
    highlight: false,
    badge: 'Špeciálny termín',
  },
  {
    name: 'Silvester',
    period: '26. decembra – 3. januára',
    shortPeriod: '26.12. – 3.1.',
    price: 200,
    minNights: 5,
    highlight: false,
    badge: 'Špeciálny termín',
  },
];

const included = [
  { icon: Car, label: 'Parkovanie' },
  { icon: Sparkles, label: 'Záverečné upratovanie' },
  { icon: Flame, label: 'Drevo do krbu' },
  { icon: Bed, label: 'Posteľná bielizeň' },
  { icon: Zap, label: 'Spotreba energie' },
  { icon: Waves, label: 'Vonkajší bazén' },
  { icon: Wifi, label: 'Internetové pripojenie' },
];

const extras = [
  { icon: Info, label: 'Rekreačný poplatok', price: '1 € / osoba / noc', note: 'od 3 rokov' },
  { icon: PawPrint, label: 'Domáce zviera', price: '15 € / pobyt', note: null },
  { icon: Bath, label: 'Kúpacia kaďa', price: '80 € / pobyt', note: null },
  { icon: Dog, label: 'Vratná kaucia', price: '100 € / pobyt', note: 'vrátená po odchode' },
];

function nightLabel(n: number) {
  if (n === 1) return 'noc';
  if (n < 5) return 'noci';
  return 'nocí';
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-chinese-black">
      <Navigation />

      <div className="pt-28 pb-24">
        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-14">
            <p className="section-label mb-4">Cenník</p>
            <h1 className="section-title mb-4">
              Transparentné ceny<br />
              <span className="text-gradient">za celý objekt</span>
            </h1>
            <p className="section-subtitle max-w-xl mx-auto">
              Prenajímate si celú vilu — žiadne zdieľanie s inými hosťami.
              Cena platí za celý objekt bez ohľadu na počet osôb (do 7 osôb).
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
            {allSeasons.slice(0, 4).map((s) => (
              <SeasonCard key={s.name + s.price} season={s} />
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
            {allSeasons.slice(4).map((s) => (
              <SeasonCard key={s.name + s.price} season={s} />
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">

            <div className="bg-dark-jungle border border-white/5 rounded-xl p-8">
              <h2 className="font-serif text-white text-xl mb-2">Čo je zahrnuté v cene</h2>
              <p className="text-white/40 text-sm mb-6">Všetko nižšie je súčasťou základnej ceny pobytu.</p>
              <div className="grid grid-cols-1 gap-3">
                {included.map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-sm bg-brass/8 border border-brass/15 flex items-center justify-center flex-shrink-0">
                      <Icon size={14} className="text-brass" />
                    </div>
                    <div className="flex items-center gap-2 flex-1">
                      <Check size={12} className="text-brass/60 flex-shrink-0" />
                      <span className="text-white/70 text-sm">{label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-dark-jungle border border-white/5 rounded-xl p-8">
              <h2 className="font-serif text-white text-xl mb-2">Doplatky na mieste</h2>
              <p className="text-white/40 text-sm mb-6">Tieto poplatky sa uhradia pri príchode alebo počas pobytu.</p>
              <div className="space-y-4">
                {extras.map(({ icon: Icon, label, price, note }) => (
                  <div key={label} className="flex items-start gap-3 py-3.5 border-b border-white/5 last:border-0">
                    <div className="w-8 h-8 rounded-sm bg-white/3 border border-white/8 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon size={14} className="text-white/40" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white/70 text-sm">{label}</p>
                      {note && <p className="text-white/30 text-xs mt-0.5">{note}</p>}
                    </div>
                    <span className="text-brass text-sm font-medium flex-shrink-0">{price}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-dark-jungle border border-white/5 rounded-xl p-8 mb-12">
            <div className="flex items-start gap-3 mb-5">
              <Info size={16} className="text-brass/60 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-white font-medium mb-1">Dôležité informácie</h3>
                <p className="text-white/40 text-sm">Prečítajte si podmienky pred odoslaním rezervácie.</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { title: 'Príplatok za osobu', desc: '+ 10 € za každú 8. a ďalšiu osobu (do max. 9 osôb)' },
                { title: 'Min. počet osôb', desc: 'Minimálne 1 osoba, maximálne 9 osôb' },
                { title: 'Záloha', desc: 'Platba formou zálohovej platby pri potvrdení' },
                { title: 'Storno podmienky', desc: '100 % zálohy pri zrušení do 7 dní pred nástupom' },
                { title: 'Check-in / Check-out', desc: 'Príchod od 14:00 · Odchod do 10:30' },
                { title: 'Osobitné termíny', desc: 'Veľká noc, Vianoce a Silvester majú vlastné podmienky' },
              ].map(({ title, desc }) => (
                <div key={title} className="bg-white/2 border border-white/5 rounded-sm p-4">
                  <p className="text-white/70 text-sm font-medium mb-1">{title}</p>
                  <p className="text-white/40 text-xs leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden bg-dark-jungle border border-brass/15 rounded-xl p-10 md:p-14 text-center">
            <div className="absolute inset-0 bg-gradient-to-b from-brass/3 to-transparent pointer-events-none" />
            <div className="relative">
              <p className="section-label mb-3">Pripravení rezervovať?</p>
              <h2 className="font-serif text-white text-2xl md:text-3xl mb-3">
                Vyberte si termín a rezervujte online
              </h2>
              <p className="text-white/45 text-sm md:text-base mb-8 max-w-lg mx-auto leading-relaxed">
                Skontrolujte dostupnosť v kalendári a odošlite žiadosť.
                Potvrdenie dostanete do 24 hodín.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigateTo('/rezervacia')}
                  className="btn-primary py-4 px-8 text-base justify-center"
                >
                  Rezervovať termín
                  <ArrowRight size={17} />
                </button>
                <button
                  onClick={() => navigateTo('/rezervacia')}
                  className="btn-outline py-4 px-8 text-base justify-center"
                >
                  Overiť dostupnosť
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}

interface SeasonCardProps {
  season: typeof allSeasons[0];
}

function SeasonCard({ season: s }: SeasonCardProps) {
  return (
    <div
      className={`relative rounded-lg border transition-all duration-300 overflow-hidden ${
        s.highlight
          ? 'bg-brass/8 border-brass/35 shadow-xl shadow-brass/5'
          : 'bg-dark-jungle border-white/5 hover:border-brass/20'
      }`}
    >
      {s.badge && (
        <div
          className={`absolute top-0 right-0 text-xs font-medium px-3 py-1 rounded-bl-sm tracking-wide ${
            s.highlight
              ? 'bg-brass text-chinese-black'
              : 'bg-white/8 text-white/50'
          }`}
        >
          {s.badge && (
            <span className="flex items-center gap-1">
              {s.highlight && <Star size={9} fill="currentColor" />}
              {s.badge}
            </span>
          )}
        </div>
      )}

      <div className="p-6">
        <p className="text-brass/55 text-xs uppercase tracking-widest mb-1">{s.shortPeriod}</p>
        <h3 className="font-serif text-white text-lg leading-tight mb-4">{s.name}</h3>

        <div className="flex items-baseline gap-1 mb-1">
          <span className="font-serif text-brass text-3xl">{s.price}</span>
          <span className="text-white/35 text-sm">€ / noc</span>
        </div>
        <p className="text-white/30 text-xs mb-4">
          min. {s.minNights} {nightLabel(s.minNights)}
        </p>

        <div className="h-px bg-white/5 mb-4" />

        <p className="text-white/30 text-xs mb-5">+ 10 € za 8. a každú ďalšiu osobu</p>

        <button
          onClick={() => navigateTo('/rezervacia')}
          className={`w-full py-2.5 text-xs font-medium tracking-wide rounded-sm transition-all duration-300 flex items-center justify-center gap-1.5 ${
            s.highlight
              ? 'bg-brass text-chinese-black hover:bg-brass/90'
              : 'border border-brass/25 text-brass/80 hover:bg-brass/8 hover:border-brass/40'
          }`}
        >
          Rezervovať
          <ArrowRight size={12} />
        </button>
      </div>
    </div>
  );
}
