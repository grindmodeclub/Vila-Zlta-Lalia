import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Domov', href: '/' },
  { label: 'Izby', href: '/izby' },
  { label: 'Vybavenie', href: '/vybavenie' },
  { label: 'Cenník', href: '/cennik' },
  { label: 'Galéria', href: '/galeria' },
  { label: 'Lokalita', href: '/lokalita' },
  { label: 'Podmienky', href: '/podmienky' },
  { label: 'Kontakt', href: '/kontakt' },
];

function navigateTo(path: string) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handlePop = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []);

  const isHome = currentPath === '/' || currentPath === '';
  const isSubPage = !isHome;

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    navigateTo(href);
  };

  const handleLogoClick = () => {
    setMenuOpen(false);
    navigateTo('/');
  };

  const handleReservationClick = () => {
    setMenuOpen(false);
    navigateTo('/rezervacia');
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled || isSubPage
            ? 'bg-chinese-black/95 backdrop-blur-md border-b border-white/5 shadow-2xl py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <button onClick={handleLogoClick} className="flex items-center">
            <img
              src="/logo_lalia.webp"
              alt="Vila Žltá Ľalia"
              className="h-10 w-auto object-contain"
              style={{ mixBlendMode: 'screen' }}
            />
          </button>

          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive =
                link.href === '/'
                  ? currentPath === '/' || currentPath === ''
                  : currentPath === link.href || currentPath.startsWith(link.href + '/');
              return (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className={`text-sm tracking-wide transition-all duration-200 relative group ${
                    isActive ? 'text-brass' : 'text-white/70 hover:text-white'
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-px bg-brass transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </button>
              );
            })}
            <button
              onClick={handleReservationClick}
              className={`btn-primary text-xs ml-1 ${currentPath === '/rezervacia' ? 'opacity-60 cursor-default' : ''}`}
            >
              Rezervovať
            </button>
          </div>

          <button
            className="lg:hidden text-white/80 hover:text-white p-1"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-chinese-black/98 backdrop-blur-md flex flex-col pt-24 px-8">
          <div className="flex flex-col gap-6">
            {navLinks.map((link) => {
              const isActive =
                link.href === '/'
                  ? currentPath === '/' || currentPath === ''
                  : currentPath === link.href || currentPath.startsWith(link.href + '/');
              return (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className={`text-left text-2xl font-serif transition-colors duration-200 border-b border-white/5 pb-4 ${
                    isActive ? 'text-brass' : 'text-white/80 hover:text-brass'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
            <button
              onClick={handleReservationClick}
              className="btn-primary justify-center mt-4 text-base"
            >
              Rezervovať pobyt
            </button>
          </div>
        </div>
      )}
    </>
  );
}
