import { MapPin, Mail, Phone, ExternalLink, ArrowRight } from 'lucide-react';

const quickLinks = [
  { label: 'O vile', href: '/', page: true },
  { label: 'Izby', href: '/izby', page: true },
  { label: 'Vybavenie', href: '/vybavenie', page: true },
  { label: 'Cenník', href: '/cennik', page: true },
  { label: 'Lokalita', href: '/lokalita', page: true },
  { label: 'Rezervácia', href: '/rezervacia', page: true },
  { label: 'Kontakt', href: '/kontakt', page: true },
];

function navigateTo(path: string) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export default function Footer() {

  return (
    <footer className="bg-dark-jungle border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          <div>
            <button
              onClick={() => navigateTo('/')}
              className="mb-5 block"
            >
              <img
                src="/logo_lalia.webp"
                alt="Vila Žltá Ľalia"
                className="h-12 w-auto object-contain"
                style={{ mixBlendMode: 'screen' }}
              />
            </button>
            <p className="text-white/35 text-sm leading-relaxed mb-6">
              Rekreačná chata v Oščadnici pri lyžiarskom stredisku
              Veľká Rača. Pre rodiny, páry aj skupiny, celý rok.
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <MapPin size={13} className="text-brass mt-0.5 flex-shrink-0" />
                <span className="text-white/40 text-sm">Oščadnica 155, 023 01 Oščadnica, Slovensko</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Mail size={13} className="text-brass mt-0.5 flex-shrink-0" />
                <a
                  href="mailto:apartmanylalia@gmail.com"
                  className="text-white/40 hover:text-brass text-sm transition-colors duration-200"
                >
                  apartmanylalia@gmail.com
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <Phone size={13} className="text-brass mt-0.5 flex-shrink-0" />
                <a
                  href="tel:+421905535502"
                  className="text-white/40 hover:text-brass text-sm transition-colors duration-200"
                >
                  +421 905 535 502
                </a>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest text-brass/60 mb-6">Rýchle odkazy</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => navigateTo(link.href)}
                    className="text-white/40 hover:text-brass text-sm transition-colors duration-200 text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest text-brass/60 mb-6">Prevádzkovateľ</h4>
            <div className="space-y-1.5 mb-8">
              <p className="text-white/65 text-sm font-medium">SOF-MT s.r.o.</p>
              <p className="text-white/35 text-sm">Oščadnica 155, 023 01 Oščadnica</p>
              <p className="text-white/35 text-sm">IČO: 48137367</p>
              <p className="text-white/35 text-sm">IČ DPH: SK2120072944</p>
            </div>
            <button
              onClick={() => navigateTo('/rezervacia')}
              className="btn-primary text-xs w-full justify-center gap-2"
            >
              Rezervovať pobyt
              <ArrowRight size={13} />
            </button>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-white/8 to-transparent mb-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/20 text-xs">
            © {new Date().getFullYear()} SOF-MT s.r.o. Všetky práva vyhradené.
          </p>
          <a
            href="/admin"
            onClick={(e) => {
              e.preventDefault();
              window.history.pushState({}, '', '/admin');
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}
            className="flex items-center gap-1.5 text-white/15 hover:text-white/35 text-xs transition-colors duration-200"
          >
            <ExternalLink size={10} />
            Admin
          </a>
        </div>
      </div>
    </footer>
  );
}
