import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Reservation, BlockedDate } from '../../types';
import { STATUS_CONFIG, formatDate, countNights } from './shared/statusConfig';

interface Props {
  reservations: Reservation[];
  blockedDates: BlockedDate[];
  onSelectReservation: (r: Reservation) => void;
}

const MONTHS = [
  'Január', 'Február', 'Marec', 'Apríl', 'Máj', 'Jún',
  'Júl', 'August', 'September', 'Október', 'November', 'December',
];
const DAYS = ['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'];

interface DayInfo {
  date: string;
  reservations: Reservation[];
  isBlocked: boolean;
  blockReason?: string;
}

export default function AdminCalendar({ reservations, blockedDates, onSelectReservation }: Props) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  const today = now.toISOString().split('T')[0];

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  };

  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let startDow = firstDay.getDay();
  if (startDow === 0) startDow = 7;
  const blanks = startDow - 1;

  const getDayInfo = (day: number): DayInfo => {
    const d = new Date(year, month, day);
    const dateStr = d.toISOString().split('T')[0];

    const dayReservations = reservations.filter((r) => {
      return dateStr >= r.check_in && dateStr < r.check_out;
    });

    let isBlocked = false;
    let blockReason = '';
    for (const b of blockedDates) {
      if (dateStr >= b.start_date && dateStr < b.end_date) {
        isBlocked = true;
        blockReason = b.reason;
        break;
      }
    }

    return { date: dateStr, reservations: dayReservations, isBlocked, blockReason };
  };

  const getDotColor = (info: DayInfo): string => {
    if (info.isBlocked) return 'bg-slate-500';
    if (!info.reservations.length) return '';
    const statuses = info.reservations.map((r) => r.status);
    if (statuses.includes('confirmed')) return 'bg-green-400';
    if (statuses.includes('pending')) return 'bg-yellow-400';
    return 'bg-red-400';
  };

  const getBgClass = (info: DayInfo, isToday: boolean): string => {
    if (isToday) return 'ring-1 ring-brass/50';
    return '';
  };

  const hovered = hoveredDate ? (() => {
    const parts = hoveredDate.split('-');
    const d = parseInt(parts[2]);
    return getDayInfo(d);
  })() : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl text-white">Kalendár</h2>
        <div className="flex items-center gap-3">
          <button onClick={prevMonth} className="p-2 text-white/40 hover:text-white transition-colors duration-200">
            <ChevronLeft size={18} />
          </button>
          <span className="font-serif text-white min-w-[160px] text-center">
            {MONTHS[month]} {year}
          </span>
          <button onClick={nextMonth} className="p-2 text-white/40 hover:text-white transition-colors duration-200">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 text-xs">
        {[
          { dot: 'bg-green-400', label: 'Potvrdená' },
          { dot: 'bg-yellow-400', label: 'Čaká na schválenie' },
          { dot: 'bg-red-400', label: 'Zrušená/Zamietnutá' },
          { dot: 'bg-slate-500', label: 'Blokovaná' },
        ].map(({ dot, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${dot}`} />
            <span className="text-white/40">{label}</span>
          </div>
        ))}
      </div>

      <div className="bg-dark-jungle border border-white/5 rounded-lg overflow-hidden">
        <div className="grid grid-cols-7 border-b border-white/5">
          {DAYS.map((d) => (
            <div key={d} className="text-center text-white/30 text-xs py-3 font-medium">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {Array.from({ length: blanks }).map((_, i) => (
            <div key={`b${i}`} className="border-b border-r border-white/3 h-20" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const info = getDayInfo(day);
            const isToday = info.date === today;
            const isPast = info.date < today;
            const dotColor = getDotColor(info);
            const bgClass = getBgClass(info, isToday);
            const col = (blanks + i) % 7;
            const isLastCol = col === 6;

            return (
              <div
                key={day}
                onMouseEnter={() => setHoveredDate(info.date)}
                onMouseLeave={() => setHoveredDate(null)}
                className={`relative border-b border-r border-white/3 h-20 p-2 ${
                  isPast ? 'opacity-35' : ''
                } ${isLastCol ? 'border-r-0' : ''} ${
                  info.reservations.length > 0 || info.isBlocked ? 'cursor-pointer' : ''
                } hover:bg-white/3 transition-colors duration-100`}
              >
                <span
                  className={`text-xs font-medium inline-flex items-center justify-center w-6 h-6 rounded-full ${
                    isToday ? 'bg-brass text-chinese-black' : 'text-white/60'
                  } ${bgClass}`}
                >
                  {day}
                </span>

                {dotColor && (
                  <div className="mt-1 space-y-1">
                    {info.isBlocked && (
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-500 flex-shrink-0" />
                        <span className="text-slate-400 text-xs truncate leading-tight">Blokované</span>
                      </div>
                    )}
                    {info.reservations.slice(0, 2).map((r) => (
                      <div
                        key={r.id}
                        onClick={() => onSelectReservation(r)}
                        className="flex items-center gap-1 group"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${STATUS_CONFIG[r.status].dot}`} />
                        <span className="text-white/60 text-xs truncate leading-tight group-hover:text-white transition-colors duration-100">
                          {r.guest_name.split(' ')[0]}
                        </span>
                      </div>
                    ))}
                    {info.reservations.length > 2 && (
                      <span className="text-white/25 text-xs">+{info.reservations.length - 2}</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {hoveredDate && hovered && (hovered.reservations.length > 0 || hovered.isBlocked) && (
        <div className="bg-dark-jungle border border-white/8 rounded-lg p-4">
          <p className="text-white/40 text-xs mb-3">{formatDate(hoveredDate)}</p>
          {hovered.isBlocked && (
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-slate-500" />
              <span className="text-slate-300 text-sm">Blokovaný termín</span>
              {hovered.blockReason && (
                <span className="text-white/30 text-xs">– {hovered.blockReason}</span>
              )}
            </div>
          )}
          {hovered.reservations.map((r) => (
            <div
              key={r.id}
              onClick={() => onSelectReservation(r)}
              className="flex items-center justify-between p-3 rounded-sm bg-white/3 hover:bg-white/6 cursor-pointer transition-colors duration-150 mb-2 last:mb-0"
            >
              <div>
                <p className="text-white text-sm font-medium">{r.guest_name}</p>
                <p className="text-white/40 text-xs">
                  {formatDate(r.check_in)} – {formatDate(r.check_out)} · {countNights(r.check_in, r.check_out)} nocí · {r.guests_count} os.
                </p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-sm border ml-3 flex-shrink-0 ${STATUS_CONFIG[r.status].color}`}>
                {STATUS_CONFIG[r.status].label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
