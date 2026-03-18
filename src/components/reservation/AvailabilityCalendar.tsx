import { useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { DayStatus } from '../../hooks/useAvailability';

interface Props {
  getDayStatus: (date: string) => DayStatus;
  selectedCheckIn: string;
  selectedCheckOut: string;
  onSelectCheckIn: (date: string) => void;
  onSelectCheckOut: (date: string) => void;
  loading?: boolean;
}

const SLOVAK_MONTHS = [
  'Január', 'Február', 'Marec', 'Apríl', 'Máj', 'Jún',
  'Júl', 'August', 'September', 'Október', 'November', 'December',
];

const SLOVAK_DAYS_SHORT = ['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'];

function toDateStr(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number): number {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

const isUnavailable = (status: DayStatus) =>
  status === 'past' || status === 'confirmed' || status === 'blocked' || status === 'pending';

const statusStyle: Record<DayStatus, string> = {
  free: 'text-white/80 hover:bg-brass/20 hover:text-brass cursor-pointer',
  pending: 'bg-yellow-500/12 text-yellow-500/50 cursor-not-allowed',
  confirmed: 'bg-red-500/12 text-red-400/50 cursor-not-allowed',
  blocked: 'bg-white/4 text-white/18 cursor-not-allowed',
  past: 'text-white/18 cursor-not-allowed',
};

const statusTooltip: Record<DayStatus, string> = {
  free: 'Voľné',
  pending: 'Čaká na potvrdenie — termín je rezervovaný',
  confirmed: 'Obsadené',
  blocked: 'Blokované',
  past: '',
};

export default function AvailabilityCalendar({
  getDayStatus,
  selectedCheckIn,
  selectedCheckOut,
  onSelectCheckIn,
  onSelectCheckOut,
  loading = false,
}: Props) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const goToPrev = () => {
    if (viewMonth === 0) { setViewYear((y) => y - 1); setViewMonth(11); }
    else setViewMonth((m) => m - 1);
  };

  const goToNext = () => {
    if (viewMonth === 11) { setViewYear((y) => y + 1); setViewMonth(0); }
    else setViewMonth((m) => m + 1);
  };

  const isPrevDisabled =
    viewYear < today.getFullYear() ||
    (viewYear === today.getFullYear() && viewMonth <= today.getMonth());

  const MIN_NIGHTS = 2;

  const isTooClose = (dateStr: string): boolean => {
    if (!selectedCheckIn || selectedCheckOut) return false;
    const checkInDate = new Date(selectedCheckIn);
    const date = new Date(dateStr);
    const diff = Math.round((date.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 && diff < MIN_NIGHTS;
  };

  const handleDayClick = useCallback(
    (dateStr: string, status: DayStatus) => {
      if (isUnavailable(status)) return;

      if (!selectedCheckIn || (selectedCheckIn && selectedCheckOut)) {
        onSelectCheckIn(dateStr);
        onSelectCheckOut('');
      } else {
        if (dateStr <= selectedCheckIn) {
          onSelectCheckIn(dateStr);
          onSelectCheckOut('');
        } else {
          const checkInDate = new Date(selectedCheckIn);
          const date = new Date(dateStr);
          const diff = Math.round((date.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
          if (diff < MIN_NIGHTS) return;
          onSelectCheckOut(dateStr);
        }
      }
    },
    [selectedCheckIn, selectedCheckOut, onSelectCheckIn, onSelectCheckOut]
  );

  const isInRange = (dateStr: string) => {
    if (!selectedCheckIn || !selectedCheckOut) return false;
    return dateStr > selectedCheckIn && dateStr < selectedCheckOut;
  };

  const renderMonth = (year: number, month: number) => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfWeek(year, month);
    const cells: React.ReactNode[] = [];

    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${i}`} />);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = toDateStr(year, month, d);
      const status = getDayStatus(dateStr);
      const isCheckIn = dateStr === selectedCheckIn;
      const isCheckOut = dateStr === selectedCheckOut;
      const inRange = isInRange(dateStr);
      const unavailable = isUnavailable(status);
      const tooClose = isTooClose(dateStr);

      let cellClass = '';
      if (isCheckIn || isCheckOut) {
        cellClass = 'bg-brass text-chinese-black font-semibold rounded-sm cursor-pointer';
      } else if (inRange) {
        cellClass = 'bg-brass/15 text-brass/80 rounded-none';
      } else if (tooClose) {
        cellClass = 'text-white/18 cursor-not-allowed';
      } else {
        cellClass = statusStyle[status];
      }

      cells.push(
        <button
          key={dateStr}
          onClick={() => handleDayClick(dateStr, status)}
          disabled={unavailable || tooClose}
          title={tooClose ? 'Minimálny pobyt sú 2 noci' : statusTooltip[status]}
          className={`
            relative text-sm h-9 w-full flex items-center justify-center
            transition-all duration-150 select-none rounded-sm
            ${cellClass}
          `}
        >
          {d}
          {status === 'pending' && !isCheckIn && !isCheckOut && (
            <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-yellow-500/60" />
          )}
          {status === 'confirmed' && !isCheckIn && !isCheckOut && (
            <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="w-full h-px bg-red-400/25 absolute" style={{ transform: 'rotate(-45deg)' }} />
            </span>
          )}
        </button>
      );
    }

    return cells;
  };

  return (
    <div className={`transition-opacity duration-300 ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPrev}
          disabled={isPrevDisabled}
          className="w-8 h-8 flex items-center justify-center rounded-sm hover:bg-white/5 text-white/50 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft size={16} />
        </button>
        <h3 className="font-serif text-white text-base">
          {SLOVAK_MONTHS[viewMonth]} {viewYear}
        </h3>
        <button
          onClick={goToNext}
          className="w-8 h-8 flex items-center justify-center rounded-sm hover:bg-white/5 text-white/50 hover:text-white transition-all"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {SLOVAK_DAYS_SHORT.map((d) => (
          <div key={d} className="text-center text-xs text-white/25 py-1 font-medium">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-px">
        {renderMonth(viewYear, viewMonth)}
      </div>

      <div className="mt-5 grid grid-cols-2 sm:flex sm:flex-wrap gap-x-5 gap-y-2.5">
        {[
          { swatch: 'bg-white/20', label: 'Voľné' },
          { swatch: 'bg-yellow-500/20 ring-1 ring-yellow-500/20', dot: true, label: 'Čaká na potvrdenie' },
          { swatch: 'bg-red-500/15', label: 'Obsadené' },
          { swatch: 'bg-white/5', label: 'Blokované' },
          { swatch: 'bg-brass/80', label: 'Váš výber' },
        ].map(({ swatch, dot, label }) => (
          <div key={label} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-sm flex-shrink-0 ${swatch} flex items-center justify-center`}>
              {dot && <span className="w-1 h-1 rounded-full bg-yellow-500/80 block" />}
            </div>
            <span className="text-white/35 text-xs">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
