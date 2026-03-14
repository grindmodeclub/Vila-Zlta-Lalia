import { useEffect, useRef, useState } from 'react';
import { Mail, Phone, MapPin, Clock, ArrowRight, CheckCircle } from 'lucide-react';

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const [sent, setSent] = useState(false);

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

  const contactItems = [
    {
      icon: Phone,
      label: 'Telefón',
      value: '+421 905 535 502',
      href: 'tel:+421905535502',
    },
    {
      icon: Mail,
      label: 'E-mail',
      value: 'apartmanylalia@gmail.com',
      href: 'mailto:apartmanylalia@gmail.com',
    },
    {
      icon: MapPin,
      label: 'Adresa',
      value: 'Oščadnica 155, 023 01 Oščadnica',
      href: null,
    },
    {
      icon: Clock,
      label: 'Check-in · Check-out',
      value: '14:00 – 20:30 · 10:00 – 10:30',
      href: null,
    },
  ];

  return (
    <section id="kontakt" className="py-24 md:py-32 bg-chinese-black" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="section-label mb-4 reveal">Kontakt</p>
          <h2 className="section-title mb-4 reveal reveal-delay-1">
            Radi vám<br />
            <span className="text-gradient">odpovieme</span>
          </h2>
          <p className="section-subtitle max-w-xl mx-auto reveal reveal-delay-2">
            Máte otázky k rezervácii alebo k vybaveniu vily? Napíšte nám.
            Snažíme sa odpovedať v čo najkratšom čase.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {contactItems.map((item, i) => (
            <div
              key={item.label}
              className={`bg-dark-jungle border border-white/5 rounded-lg p-6 text-center hover:border-brass/18 transition-all duration-300 reveal reveal-delay-${i + 1 as 1 | 2 | 3 | 4}`}
            >
              <div className="w-11 h-11 rounded-sm bg-brass/8 border border-brass/12 flex items-center justify-center mx-auto mb-4">
                <item.icon size={18} className="text-brass" />
              </div>
              <p className="text-white/35 text-xs uppercase tracking-wider mb-2">{item.label}</p>
              {item.href ? (
                <a href={item.href} className="text-brass/75 hover:text-brass text-sm transition-colors duration-200">
                  {item.value}
                </a>
              ) : (
                <p className="text-white/55 text-sm">{item.value}</p>
              )}
            </div>
          ))}
        </div>

        <div className="mb-12 reveal">
          <div className="rounded-xl overflow-hidden border border-white/5" style={{ height: '380px' }}>
            <iframe
              src="https://www.google.com/maps?q=Oščadnica+155,+023+01+Oščadnica,+Slovakia&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'grayscale(30%) invert(5%)' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Vila Žltá Ľalia – mapa"
            />
          </div>
        </div>

        <div className="max-w-2xl mx-auto reveal">
          <div className="bg-dark-jungle border border-white/5 rounded-xl p-8 md:p-10">
            {sent ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-brass/10 border border-brass/20 flex items-center justify-center mx-auto mb-5">
                  <CheckCircle size={30} className="text-brass" />
                </div>
                <h3 className="font-serif text-white text-xl mb-2">Správa odoslaná</h3>
                <p className="text-white/45 text-sm mb-6">Ďakujeme. Ozveme sa vám čo najskôr.</p>
                <button onClick={() => setSent(false)} className="btn-outline text-sm">
                  Napísať ďalšiu správu
                </button>
              </div>
            ) : (
              <>
                <h3 className="font-serif text-white text-2xl mb-6 text-center">Napíšte nám správu</h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSent(true);
                    (e.target as HTMLFormElement).reset();
                  }}
                  className="space-y-5"
                >
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="label-dark">Vaše meno</label>
                      <input
                        type="text"
                        className="input-dark"
                        placeholder="Ján Novák"
                        required
                      />
                    </div>
                    <div>
                      <label className="label-dark">E-mail</label>
                      <input
                        type="email"
                        className="input-dark"
                        placeholder="jan@priklad.sk"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="label-dark">Predmet</label>
                    <input
                      type="text"
                      className="input-dark"
                      placeholder="Otázka k rezervácii..."
                      required
                    />
                  </div>
                  <div>
                    <label className="label-dark">Správa</label>
                    <textarea
                      rows={4}
                      className="input-dark resize-none"
                      placeholder="Vaša správa..."
                      required
                    />
                  </div>
                  <button type="submit" className="btn-primary w-full justify-center gap-2">
                    Odoslať správu
                    <ArrowRight size={15} />
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
