import { useEffect, useRef, useState } from 'react';
import { Bed, Bath, ArrowRight, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface Room {
  name: string;
  subtitle: string;
  capacity: string;
  size: string;
  desc: string;
  img: string;
  images?: string[];
  details: { label: string; value: string }[];
  features: string[];
  bathroom: string[];
}

const rooms: Room[] = [
  {
    name: 'Dvojlôžkové štúdio',
    subtitle: '1. podlažie',
    capacity: '2 osoby',
    size: '23 m²',
    desc: 'Priestranné štúdio s manželskou posteľou a kuchynským kútom, ideálne pre páry. Balkón s výhľadom do okolia, zatemňujúce závesy.',
    img: '/dvoj_1.webp',
    images: ['/dvoj_1.webp', '/dvoj_2.webp', '/dvoj_3.webp', '/dvoj_4.webp', '/dvoj_5.webp'],
    details: [
      { label: 'Lôžka', value: '2 (manželská posteľ)' },
      { label: 'Rozloha', value: '23 m²' },
      { label: 'Balkón', value: 'Áno' },
      { label: 'Kuchynský kút', value: 'Áno' },
    ],
    features: ['Manželská posteľ', 'Kuchynský kút', 'Pracovný stôl', 'Gauč', 'Zatemňujúce závesy', 'WiFi'],
    bathroom: ['WC', 'Sprchovací kút', 'Umývadlo', 'Sušič na vlasy', 'Uteráky'],
  },
  {
    name: 'Trojlôžková izba',
    subtitle: 'Drevený strop',
    capacity: '3 osoby',
    size: '20 m²',
    desc: 'Priestranná izba s krásnym dreveným stropom pre troch hostí. Manželská posteľ a jednolôžková, horská atmosféra a komfort.',
    img: '/troj_1.webp',
    images: ['/troj_1.webp', '/troj_2.webp', '/troj_3.webp', '/troj_4.webp'],
    details: [
      { label: 'Lôžka', value: '3 (2 + 1)' },
      { label: 'Rozloha', value: '20 m²' },
      { label: 'Strop', value: 'Drevené trámy' },
      { label: 'Úložné priestory', value: 'Áno' },
    ],
    features: ['Manželská posteľ', 'Jednolôžková posteľ', 'Pracovný stôl', 'Úložné priestory', 'WiFi'],
    bathroom: ['WC', 'Sprchovací kút', 'Umývadlo', 'Sušič na vlasy', 'Uteráky'],
  },
  {
    name: 'Štvorlôžková izba',
    subtitle: 'Zelená',
    capacity: '4 osoby',
    size: '20 m²',
    desc: 'Izba pre štyri osoby, ladená do zelenej. Manželská posteľ a poschodová posteľ. Vhodná pre rodiny s deťmi alebo skupinu priateľov.',
    img: '/stvorlozko/stvor_1.webp',
    images: ['/stvorlozko/stvor_1.webp', '/stvorlozko/stvor_2.webp', '/stvorlozko/stvor_3.webp', '/stvorlozko/stvor_4.webp', '/stvorlozko/stvor_5.webp'],
    details: [
      { label: 'Lôžka', value: '4 (2 + 2)' },
      { label: 'Rozloha', value: '20 m²' },
      { label: 'Poschodová posteľ', value: 'Áno' },
      { label: 'Závesy', value: 'Zatemňujúce' },
    ],
    features: ['Manželská posteľ', 'Poschodová posteľ', 'Pracovný stôl', 'Úložné priestory', 'WiFi'],
    bathroom: ['WC', 'Sprchovací kút', 'Umývadlo', 'Sušič na vlasy'],
  },
];

function navigateTo(path: string) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

interface LightboxProps {
  images: string[];
  startIndex: number;
  onClose: () => void;
}

function Lightbox({ images, startIndex, onClose }: LightboxProps) {
  const [current, setCurrent] = useState(startIndex);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setCurrent((c) => (c + 1) % images.length);
      if (e.key === 'ArrowLeft') setCurrent((c) => (c - 1 + images.length) % images.length);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [images.length, onClose]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) setCurrent((c) => (c + 1) % images.length);
      else setCurrent((c) => (c - 1 + images.length) % images.length);
    }
    touchStartX.current = null;
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-black flex flex-col"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0">
        <span className="text-white/50 text-sm tracking-wider">{current + 1} / {images.length}</span>
        <button
          className="w-10 h-10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors duration-200"
          onClick={onClose}
        >
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 relative flex items-center justify-center min-h-0 px-12">
        <img
          src={images[current]}
          alt={`Foto ${current + 1}`}
          className="w-full h-full object-contain"
        />

        <button
          className="absolute left-0 top-0 h-full w-12 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5 transition-colors duration-200"
          onClick={() => setCurrent((c) => (c - 1 + images.length) % images.length)}
        >
          <ChevronLeft size={28} />
        </button>

        <button
          className="absolute right-0 top-0 h-full w-12 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5 transition-colors duration-200"
          onClick={() => setCurrent((c) => (c + 1) % images.length)}
        >
          <ChevronRight size={28} />
        </button>
      </div>

      <div className="flex justify-center gap-2 py-4 flex-shrink-0">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'bg-brass w-6' : 'bg-white/25 w-1.5'}`}
          />
        ))}
      </div>
    </div>
  );
}

interface RoomGalleryProps {
  images: string[];
  roomName: string;
}

function RoomGallery({ images, roomName }: RoomGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <>
      <div className="flex flex-col h-full gap-1">
        <div
          className="relative overflow-hidden cursor-pointer flex-1 min-h-0"
          style={{ flexBasis: '70%' }}
          onClick={() => setLightboxIndex(0)}
        >
          <img
            src={images[0]}
            alt={roomName}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-chinese-black/30 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute bottom-3 right-3 bg-chinese-black/60 backdrop-blur-sm text-white/80 text-xs px-2.5 py-1.5 rounded-sm border border-white/10 opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            Zobraziť
          </div>
        </div>

        <div className="grid grid-cols-3 gap-1" style={{ flexBasis: '28%', maxHeight: '120px' }}>
          {images.slice(1, 4).map((src, i) => {
            const isLast = i === 2 && images.length > 4;
            return (
              <div
                key={src}
                className="relative overflow-hidden cursor-pointer group"
                onClick={() => setLightboxIndex(i + 1)}
              >
                <img
                  src={src}
                  alt={`${roomName} ${i + 2}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                {isLast && (
                  <div className="absolute inset-0 bg-chinese-black/55 flex items-center justify-center">
                    <span className="text-white text-lg font-semibold">+{images.length - 4}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-chinese-black/0 group-hover:bg-chinese-black/25 transition-colors duration-300" />
              </div>
            );
          })}
        </div>
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          startIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}

export default function Rooms() {
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
    <section id="izby" className="py-24 md:py-32 bg-chinese-black" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="section-label mb-4 reveal">Izby</p>
          <h2 className="section-title mb-4 reveal reveal-delay-1">
            Tri pohodlné izby<br />
            <span className="text-gradient">pre váš pokojný odpočinok</span>
          </h2>
          <p className="section-subtitle max-w-2xl mx-auto reveal reveal-delay-2">
            Vila disponuje tromi spálňami s celkovou kapacitou 9 lôžok. Každá izba má vlastnú
            kúpeľňu a toaletu. Prenajímate si celý objekt naraz.
          </p>
        </div>

        <div className="space-y-8">
          {rooms.map((room, idx) => (
            <div
              key={room.name}
              className={`card-dark overflow-hidden grid lg:grid-cols-2 reveal reveal-delay-${Math.min(idx + 1, 4) as 1 | 2 | 3 | 4}`}
            >
              <div className={`relative overflow-hidden min-h-72 lg:min-h-0 ${idx % 2 === 1 ? 'lg:col-start-2 lg:row-start-1' : ''}`}>
                {room.images && room.images.length > 1 ? (
                  <div className="relative h-72 lg:h-full lg:absolute lg:inset-0 flex flex-col">
                    <RoomGallery images={room.images} roomName={room.name} />
                    <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
                      <span className="bg-brass text-chinese-black text-xs font-semibold px-3 py-1.5 rounded-sm">
                        {room.capacity}
                      </span>
                      <span className="bg-chinese-black/80 text-white/60 text-xs px-2.5 py-1.5 rounded-sm backdrop-blur-sm">
                        {room.size}
                      </span>
                    </div>
                  </div>
                ) : (
                  <>
                    <img
                      src={room.img}
                      alt={room.name}
                      className="w-full h-72 lg:h-full object-cover hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-chinese-black/50 via-transparent to-transparent lg:hidden" />
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <span className="bg-brass text-chinese-black text-xs font-semibold px-3 py-1.5 rounded-sm">
                        {room.capacity}
                      </span>
                      <span className="bg-chinese-black/80 text-white/60 text-xs px-2.5 py-1.5 rounded-sm backdrop-blur-sm">
                        {room.size}
                      </span>
                    </div>
                  </>
                )}
              </div>

              <div className={`p-8 lg:p-10 flex flex-col justify-center ${idx % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                <div className="mb-1">
                  <span className="text-brass/55 text-xs uppercase tracking-widest">{room.subtitle}</span>
                </div>
                <h3 className="font-serif text-white text-2xl md:text-3xl mb-3">{room.name}</h3>
                <p className="text-white/50 text-sm leading-relaxed mb-6">{room.desc}</p>

                <div className="grid grid-cols-2 gap-2.5 mb-6">
                  {room.details.map((d) => (
                    <div key={d.label} className="bg-jet/20 border border-white/5 rounded-sm px-3 py-2.5">
                      <p className="text-white/30 text-xs mb-0.5">{d.label}</p>
                      <p className="text-white/75 text-sm font-medium">{d.value}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 mb-6">
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Bed size={12} className="text-brass" />
                      <span className="text-white/35 text-xs uppercase tracking-wider">Izba</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {room.features.map((f) => (
                        <span key={f} className="text-xs text-white/50 bg-white/4 border border-white/6 px-2.5 py-1 rounded-sm hover:border-brass/20 hover:text-white/70 transition-colors duration-200">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Bath size={12} className="text-brass" />
                      <span className="text-white/35 text-xs uppercase tracking-wider">Kúpeľňa</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {room.bathroom.map((b) => (
                        <span key={b} className="text-xs text-white/50 bg-white/4 border border-white/6 px-2.5 py-1 rounded-sm hover:border-brass/20 hover:text-white/70 transition-colors duration-200">
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-dark-jungle border border-white/5 rounded-lg p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 reveal">
          <div>
            <p className="text-white font-medium mb-1">Prenajímate si celý objekt</p>
            <p className="text-white/40 text-sm">
              Všetky tri izby, spoločné priestory, záhrada a wellness sú dostupné
              výhradne pre vašu skupinu počas celého pobytu.
            </p>
          </div>
          <button onClick={() => navigateTo('/rezervacia')} className="btn-primary flex-shrink-0 gap-2">
            Rezervovať pobyt
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </section>
  );
}
