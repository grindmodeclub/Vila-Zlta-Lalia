import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const images = [
  { src: '/vila_hero.webp', alt: 'Vila Žltá Ľalia' },
  { src: '/prva_foto_sekcia.webp', alt: 'Vila exteriér' },
  { src: '/druha_foto_sekcia.webp', alt: 'Vila okolie' },
  { src: '/tretia_foto_sekcia.webp', alt: 'Vila interiér' },
  { src: '/stvrta_foto_sekcia.webp', alt: 'Vila detail' },
  { src: '/a296-vila-zlta-lalia-20240627-120442-8965.webp', alt: 'Vila exteriér' },
  { src: '/a296-vila-zlta-lalia-20240627-120727-1248.webp', alt: 'Terasa s posedením' },
  { src: '/a296-vila-zlta-lalia-20240627-120753-4294.webp', alt: 'Drevená socha' },
  { src: '/a296-vila-zlta-lalia-20231213-005244-5082.webp', alt: 'Vitajte' },
  { src: '/a296-vila-zlta-lalia-20231213-005244-3676.webp', alt: 'Priestory pre oslavu' },
  { src: '/a296-vila-zlta-lalia-20231213-005244-8274.webp', alt: 'Sála pre oslavy' },
  { src: '/a296-vila-zlta-lalia-20251116-153919-1498.webp', alt: 'Vila jeseň' },
  { src: '/a296-vila-zlta-lalia-20251116-153919-4574.webp', alt: 'Vila jeseň' },
];

export default function GalleryPage() {
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (lightbox === null) return;
      if (e.key === 'Escape') setLightbox(null);
      if (e.key === 'ArrowRight') setLightbox((p) => ((p ?? 0) + 1) % images.length);
      if (e.key === 'ArrowLeft') setLightbox((p) => ((p ?? 0) - 1 + images.length) % images.length);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightbox]);

  useEffect(() => {
    document.body.style.overflow = lightbox !== null ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [lightbox]);

  return (
    <div className="min-h-screen bg-chinese-black">
      <Navigation />

      <div className="pt-28 pb-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="section-label mb-4">Fotogaléria</p>
          <h1 className="section-title mb-4">
            Vila Žltá Ľalia<br />
            <span className="text-gradient">v obrazoch</span>
          </h1>
          <p className="section-subtitle max-w-lg mx-auto">
            Prezrite si exteriér, interiér aj priestory pre oslavy.
          </p>
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-3 space-y-3">
          {images.map((img, i) => (
            <button
              key={img.src}
              onClick={() => setLightbox(i)}
              className="relative group w-full block overflow-hidden rounded-lg focus:outline-none"
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
            </button>
          ))}
        </div>
      </div>

      <Footer />

      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/92 flex items-center justify-center"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-5 right-5 text-white/60 hover:text-white transition-colors z-10"
            onClick={() => setLightbox(null)}
          >
            <X size={30} />
          </button>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors z-10 p-2"
            onClick={(e) => { e.stopPropagation(); setLightbox((lightbox - 1 + images.length) % images.length); }}
          >
            <ChevronLeft size={40} />
          </button>
          <img
            src={images[lightbox].src}
            alt={images[lightbox].alt}
            className="max-h-[88vh] max-w-[88vw] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors z-10 p-2"
            onClick={(e) => { e.stopPropagation(); setLightbox((lightbox + 1) % images.length); }}
          >
            <ChevronRight size={40} />
          </button>
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/40 text-sm">
            {lightbox + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  );
}
