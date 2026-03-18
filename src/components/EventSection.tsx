import { useEffect, useRef, useState } from 'react';
import { PartyPopper, Users, X, ChevronLeft, ChevronRight } from 'lucide-react';

const images = [
  { src: '/ChatGPT_Image_Mar_18,_2026_at_01_54_24_PM.webp', alt: 'Priestory pre oslavu' },
  { src: '/ChatGPT_Image_Mar_18,_2026_at_01_58_09_PM.webp', alt: 'Sála pre rodinné oslavy' },
];

export default function EventSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [lightbox, setLightbox] = useState<number | null>(null);

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

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (lightbox === null) return;
      if (e.key === 'Escape') setLightbox(null);
      if (e.key === 'ArrowRight') setLightbox((prev) => (prev === null ? null : (prev + 1) % images.length));
      if (e.key === 'ArrowLeft') setLightbox((prev) => (prev === null ? null : (prev - 1 + images.length) % images.length));
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightbox]);

  return (
    <>
      <section className="py-24 md:py-32 bg-chinese-black" ref={sectionRef}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            <div className="reveal">
              <p className="section-label mb-4">Rodinné oslavy</p>
              <h2 className="section-title mb-6">
                Oslavujte priamo<br />
                <span className="text-gradient">pri vile</span>
              </h2>
              <p className="section-subtitle mb-8 leading-relaxed">
                Ubytovaní hostia si môžu po dohode s ubytovateľom usporiadať rodinnú oslavu
                pre max. 32 osôb v externých priestoroch vzdialených od Vily cca 30 metrov.
              </p>
              <div className="flex items-start gap-4 p-5 border border-brass/12 rounded-lg bg-dark-jungle/60 reveal reveal-delay-2">
                <div className="w-10 h-10 rounded-sm bg-brass/8 border border-brass/12 flex items-center justify-center shrink-0 mt-0.5">
                  <Users size={18} className="text-brass" />
                </div>
                <div>
                  <p className="text-white font-medium mb-1">Kapacita až 32 osôb</p>
                  <p className="text-white/40 text-sm leading-relaxed">
                    Externé priestory sú len 30 metrov od vily — pohodlne dostupné
                    počas celého pobytu. Využitie po dohode s ubytovateľom.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-5 border border-brass/12 rounded-lg bg-dark-jungle/60 mt-3 reveal reveal-delay-3">
                <div className="w-10 h-10 rounded-sm bg-brass/8 border border-brass/12 flex items-center justify-center shrink-0 mt-0.5">
                  <PartyPopper size={18} className="text-brass" />
                </div>
                <div>
                  <p className="text-white font-medium mb-1">Ideálne pre rodinné stretnutia</p>
                  <p className="text-white/40 text-sm leading-relaxed">
                    Narodeniny, výročia, posedenia s rodinou — priestory sú prispôsobené
                    pre príjemné spoločné chvíle.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 reveal reveal-delay-2">
              {images.map((img, i) => (
                <button
                  key={img.src}
                  onClick={() => setLightbox(i)}
                  className={`relative group overflow-hidden rounded-lg focus:outline-none ${
                    i === 1 ? 'mt-8' : ''
                  }`}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="h-60 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              ))}
            </div>

          </div>
        </div>
      </section>

      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
            onClick={() => setLightbox(null)}
          >
            <X size={28} />
          </button>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
            onClick={(e) => { e.stopPropagation(); setLightbox((lightbox - 1 + images.length) % images.length); }}
          >
            <ChevronLeft size={36} />
          </button>
          <img
            src={images[lightbox].src}
            alt={images[lightbox].alt}
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
            onClick={(e) => { e.stopPropagation(); setLightbox((lightbox + 1) % images.length); }}
          >
            <ChevronRight size={36} />
          </button>
        </div>
      )}
    </>
  );
}
