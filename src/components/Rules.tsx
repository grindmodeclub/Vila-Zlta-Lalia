import { useEffect, useRef } from 'react';
import {
  Clock, UserCheck, Cigarette, Accessibility,
  PawPrint, Users, Phone, Info, AlertTriangle, CheckCircle
} from 'lucide-react';

const infoBlocks = [
  {
    icon: Clock,
    title: 'Check-in a check-out',
    items: [
      { label: 'Príchod (check-in)', value: '14:00 – 20:30' },
      { label: 'Odchod (check-out)', value: '10:00 – 10:30' },
    ],
  },
  {
    icon: UserCheck,
    title: 'Komunikácia',
    items: [
      { label: 'Jazyky', value: 'Slovenčina, čeština, poľština' },
      { label: 'Majiteľ v objekte', value: 'Nie' },
    ],
  },
  {
    icon: Info,
    title: 'Technické info',
    items: [
      { label: 'Typ ubytovania', value: 'Chata, ID 296' },
      { label: 'Kúrenie', value: 'Radiátory, krb' },
      { label: 'Mobilný signál', value: 'Telekom, Orange, O2, 4ka' },
    ],
  },
];

const rules = [
  { icon: CheckCircle, type: 'ok', text: 'Preferujeme rodiny s deťmi a hostí starších ako 25 rokov.' },
  { icon: CheckCircle, type: 'ok', text: 'V objekte je možné ubytovať iba jednu skupinu hostí naraz.' },
  { icon: CheckCircle, type: 'ok', text: 'Domáce zviera je povolené (iba malá rasa) po predchádzajúcej dohode a za poplatok.' },
  { icon: Cigarette, type: 'warn', text: 'Fajčenie v interiéri nie je dovolené.' },
  { icon: AlertTriangle, type: 'warn', text: 'Hlučné oslavy a párty nie sú akceptované.' },
  { icon: Accessibility, type: 'info', text: 'Objekt nie je bezbariérový.' },
];

export default function Rules() {
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
    <section id="pravidla" className="py-24 md:py-32 bg-dark-jungle" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="section-label mb-4 reveal">Prevádzkové informácie</p>
          <h2 className="section-title mb-4 reveal reveal-delay-1">
            Podmienky pobytu<br />
            <span className="text-gradient">a dôležité informácie</span>
          </h2>
          <p className="section-subtitle max-w-xl mx-auto reveal reveal-delay-2">
            Pred rezerváciou si prosím prečítajte podmienky pobytu, check-in časy
            a pravidlá ubytovacieho zariadenia.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 mb-8">
          {infoBlocks.map((block, i) => (
            <div
              key={block.title}
              className={`bg-chinese-black border border-white/5 rounded-lg p-6 reveal reveal-delay-${i + 1 as 1 | 2 | 3}`}
            >
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-white/5">
                <div className="w-9 h-9 rounded-sm bg-brass/8 border border-brass/10 flex items-center justify-center">
                  <block.icon size={16} className="text-brass" />
                </div>
                <h3 className="font-serif text-white">{block.title}</h3>
              </div>
              <dl className="space-y-3">
                {block.items.map((item) => (
                  <div key={item.label}>
                    <dt className="text-white/30 text-xs uppercase tracking-wider mb-0.5">{item.label}</dt>
                    <dd className="text-white/70 text-sm">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div className="bg-chinese-black border border-white/5 rounded-lg p-6 reveal reveal-delay-1">
            <h3 className="font-serif text-white text-lg mb-5">Pravidlá ubytovania</h3>
            <ul className="space-y-3.5">
              {rules.map((rule, i) => (
                <li key={i} className="flex items-start gap-3">
                  <rule.icon
                    size={14}
                    className={`mt-0.5 flex-shrink-0 ${
                      rule.type === 'ok'
                        ? 'text-brass'
                        : rule.type === 'warn'
                        ? 'text-amber-400/65'
                        : 'text-white/25'
                    }`}
                  />
                  <span className="text-white/55 text-sm leading-relaxed">{rule.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-chinese-black border border-white/5 rounded-lg p-6 reveal reveal-delay-2">
            <h3 className="font-serif text-white text-lg mb-5">Storno podmienky</h3>
            <div className="p-4 bg-amber-400/5 border border-amber-400/12 rounded-sm mb-4">
              <div className="flex items-start gap-2.5">
                <AlertTriangle size={14} className="text-amber-400/65 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white/70 text-sm font-medium mb-1">Storno min. 10 dní pred nástupom</p>
                  <p className="text-white/45 text-sm leading-relaxed">
                    Pri zrušení rezervácie menej ako 10 dní pred dátumom príchodu
                    účtujeme <strong className="text-white/65">100 % zo zálohovej platby</strong>.
                  </p>
                </div>
              </div>
            </div>
            <p className="text-white/35 text-xs leading-relaxed mb-5">
              Zálohová platba je splatná po potvrdení rezervácie. Podmienky stornovania
              môžu byť upresnené v záväznej potvrdzovacej správe.
            </p>

            <div className="pt-5 border-t border-white/5">
              <h4 className="text-white/40 text-xs uppercase tracking-wider mb-3">Kontakt pre rezervácie</h4>
              <div className="flex items-center gap-2 text-sm mb-2">
                <Phone size={12} className="text-brass" />
                <span className="text-white/35">Telefón: doplniť neskôr</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users size={12} className="text-brass" />
                <a href="mailto:apartmanylalia@gmail.com" className="text-brass/65 hover:text-brass transition-colors duration-200">
                  apartmanylalia@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
