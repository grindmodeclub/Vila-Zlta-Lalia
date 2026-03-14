import { Calendar, Users, ChevronRight, RefreshCw, Filter, Search } from 'lucide-react';
import type { Reservation, ReservationStatus } from '../../types';
import { STATUS_CONFIG, formatDate, countNights } from './shared/statusConfig';

type FilterOption = 'all' | ReservationStatus;

interface Props {
  reservations: Reservation[];
  loading: boolean;
  selected: Reservation | null;
  onSelect: (r: Reservation) => void;
  onRefresh: () => void;
}

import { useState } from 'react';

export default function ReservationList({ reservations, loading, selected, onSelect, onRefresh }: Props) {
  const [filter, setFilter] = useState<FilterOption>('all');
  const [search, setSearch] = useState('');

  const filtered = reservations
    .filter((r) => filter === 'all' || r.status === filter)
    .filter((r) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        r.guest_name.toLowerCase().includes(q) ||
        r.guest_email.toLowerCase().includes(q) ||
        r.guest_phone.toLowerCase().includes(q)
      );
    });

  const counts: Record<FilterOption, number> = {
    all: reservations.length,
    pending: reservations.filter((r) => r.status === 'pending').length,
    confirmed: reservations.filter((r) => r.status === 'confirmed').length,
    cancelled: reservations.filter((r) => r.status === 'cancelled').length,
    rejected: reservations.filter((r) => r.status === 'rejected').length,
    manual: reservations.filter((r) => r.status === 'manual').length,
  };

  const filterOptions: { key: FilterOption; label: string }[] = [
    { key: 'all', label: 'Všetky' },
    { key: 'pending', label: 'Čakajúce' },
    { key: 'confirmed', label: 'Potvrdené' },
    { key: 'rejected', label: 'Zamietnuté' },
    { key: 'cancelled', label: 'Zrušené' },
    { key: 'manual', label: 'Manuálne' },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-serif text-2xl text-white">Rezervácie</h2>
        <button
          onClick={onRefresh}
          className="flex items-center gap-1.5 text-white/40 hover:text-white text-xs transition-colors duration-200"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          Obnoviť
        </button>
      </div>

      <div className="relative mb-4">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Hľadať podľa mena, emailu..."
          className="input-dark pl-9 text-sm"
        />
      </div>

      <div className="flex flex-wrap gap-1.5 mb-5">
        {filterOptions.map(({ key, label }) => (
          counts[key] > 0 || key === 'all' ? (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs transition-all duration-200 border ${
                filter === key
                  ? 'bg-brass/15 border-brass/30 text-brass'
                  : 'bg-dark-jungle border-white/5 text-white/50 hover:border-white/15 hover:text-white/80'
              }`}
            >
              {key !== 'all' && (
                <span className={`w-1.5 h-1.5 rounded-full ${key in STATUS_CONFIG ? STATUS_CONFIG[key as ReservationStatus].dot : 'bg-white/30'}`} />
              )}
              {label}
              <span className={`ml-0.5 ${filter === key ? 'text-brass/70' : 'text-white/30'}`}>
                {counts[key]}
              </span>
            </button>
          ) : null
        ))}
      </div>

      <div className="flex items-center gap-2 text-white/30 text-xs mb-4">
        <Filter size={11} />
        {filtered.length} rezervácií
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-brass/30 border-t-brass rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
          <Calendar size={32} className="text-white/15 mb-3" />
          <p className="text-white/30 text-sm">Žiadne rezervácie</p>
        </div>
      ) : (
        <div className="space-y-2 overflow-y-auto flex-1 pr-1">
          {filtered.map((r) => {
            const isSelected = selected?.id === r.id;
            return (
              <div
                key={r.id}
                onClick={() => onSelect(r)}
                className={`rounded-lg p-4 cursor-pointer transition-all duration-150 border group ${
                  isSelected
                    ? 'bg-brass/8 border-brass/30'
                    : 'bg-dark-jungle border-white/5 hover:border-white/12'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-white text-sm font-medium truncate">{r.guest_name}</span>
                      {r.is_manual && (
                        <span className="text-xs px-1.5 py-0.5 rounded-sm bg-white/5 text-white/35 border border-white/8 flex-shrink-0">
                          Manuálna
                        </span>
                      )}
                      <span className={`text-xs px-2 py-0.5 rounded-sm border flex-shrink-0 ${STATUS_CONFIG[r.status].color}`}>
                        {STATUS_CONFIG[r.status].label}
                      </span>
                    </div>
                    <p className="text-white/35 text-xs truncate mb-2">{r.guest_email || r.guest_phone}</p>
                    <div className="flex flex-wrap gap-3 text-xs text-white/40">
                      <span className="flex items-center gap-1">
                        <Calendar size={10} />
                        {formatDate(r.check_in)} – {formatDate(r.check_out)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users size={10} />
                        {r.guests_count} os. · {countNights(r.check_in, r.check_out)} nocí
                      </span>
                    </div>
                  </div>
                  <ChevronRight
                    size={14}
                    className={`flex-shrink-0 mt-0.5 transition-colors duration-150 ${
                      isSelected ? 'text-brass' : 'text-white/20 group-hover:text-white/40'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
