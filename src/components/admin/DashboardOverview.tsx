import { Calendar, Clock, CheckCircle, Users, TrendingUp, ArrowRight } from 'lucide-react';
import type { Reservation } from '../../types';
import { STATUS_CONFIG, formatDate, countNights } from './shared/statusConfig';

interface Props {
  reservations: Reservation[];
  onSelectReservation: (r: Reservation) => void;
  onNavigate: (tab: string) => void;
}

export default function DashboardOverview({ reservations, onSelectReservation, onNavigate }: Props) {
  const today = new Date().toISOString().split('T')[0];

  const pending = reservations.filter((r) => r.status === 'pending');
  const confirmed = reservations.filter((r) => r.status === 'confirmed');
  const upcoming = confirmed
    .filter((r) => r.check_in >= today)
    .sort((a, b) => a.check_in.localeCompare(b.check_in))
    .slice(0, 5);

  const thisMonthStart = new Date();
  thisMonthStart.setDate(1);
  thisMonthStart.setHours(0, 0, 0, 0);
  const thisMonthStr = thisMonthStart.toISOString().split('T')[0];
  const confirmedThisMonth = confirmed.filter((r) => r.check_in >= thisMonthStr).length;

  const daysAhead = 30;
  const aheadDate = new Date();
  aheadDate.setDate(aheadDate.getDate() + daysAhead);
  const aheadStr = aheadDate.toISOString().split('T')[0];
  const occupiedDaysNext30 = confirmed.reduce((acc, r) => {
    if (r.check_out > today && r.check_in < aheadStr) {
      const start = r.check_in < today ? today : r.check_in;
      const end = r.check_out > aheadStr ? aheadStr : r.check_out;
      acc += countNights(start, end);
    }
    return acc;
  }, 0);
  const occupancyPct = Math.min(100, Math.round((occupiedDaysNext30 / daysAhead) * 100));

  const stats = [
    {
      label: 'Čakajúce rezervácie',
      value: pending.length,
      icon: Clock,
      color: 'text-yellow-400',
      bg: 'bg-yellow-400/10 border-yellow-400/20',
      tab: 'reservations',
    },
    {
      label: 'Potvrdené rezervácie',
      value: confirmed.length,
      icon: CheckCircle,
      color: 'text-green-400',
      bg: 'bg-green-400/10 border-green-400/20',
      tab: 'reservations',
    },
    {
      label: 'Potvrdené tento mesiac',
      value: confirmedThisMonth,
      icon: TrendingUp,
      color: 'text-brass',
      bg: 'bg-brass/10 border-brass/20',
      tab: 'reservations',
    },
    {
      label: 'Obsadenosť (30 dní)',
      value: `${occupancyPct}%`,
      icon: Calendar,
      color: 'text-sky-400',
      bg: 'bg-sky-400/10 border-sky-400/20',
      tab: 'calendar',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-2xl text-white mb-1">Prehľad</h2>
        <p className="text-white/40 text-sm">Aktuálny stav rezervácií Vila Žltá Ľalia</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg, tab }) => (
          <button
            key={label}
            onClick={() => onNavigate(tab)}
            className={`p-5 rounded-lg border text-left transition-all duration-200 hover:scale-[1.02] ${bg}`}
          >
            <div className="flex items-start justify-between mb-3">
              <Icon size={18} className={color} />
              <ArrowRight size={13} className="text-white/20" />
            </div>
            <p className={`text-3xl font-serif mb-1 ${color}`}>{value}</p>
            <p className="text-white/40 text-xs leading-tight">{label}</p>
          </button>
        ))}
      </div>

      {pending.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-lg text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
              Nové rezervácie na schválenie
            </h3>
            <button
              onClick={() => onNavigate('reservations')}
              className="text-brass/70 hover:text-brass text-xs transition-colors duration-200 flex items-center gap-1"
            >
              Zobraziť všetky <ArrowRight size={12} />
            </button>
          </div>
          <div className="space-y-3">
            {pending.slice(0, 3).map((r) => (
              <div
                key={r.id}
                onClick={() => onSelectReservation(r)}
                className="bg-dark-jungle border border-yellow-400/10 rounded-lg p-4 cursor-pointer hover:border-yellow-400/25 transition-all duration-200 group"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-medium truncate">{r.guest_name}</span>
                      <span className="text-xs px-2 py-0.5 rounded-sm border text-yellow-400 bg-yellow-400/10 border-yellow-400/20 flex-shrink-0">
                        {STATUS_CONFIG[r.status].label}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-white/40">
                      <span>{formatDate(r.check_in)} – {formatDate(r.check_out)}</span>
                      <span>{r.guests_count} os. · {countNights(r.check_in, r.check_out)} nocí</span>
                    </div>
                  </div>
                  <ArrowRight size={14} className="text-white/20 group-hover:text-brass flex-shrink-0 transition-colors duration-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-lg text-white">Najbližšie príchody</h3>
          <button
            onClick={() => onNavigate('calendar')}
            className="text-brass/70 hover:text-brass text-xs transition-colors duration-200 flex items-center gap-1"
          >
            Otvoriť kalendár <ArrowRight size={12} />
          </button>
        </div>
        {upcoming.length === 0 ? (
          <div className="bg-dark-jungle border border-white/5 rounded-lg p-8 text-center">
            <Users size={28} className="text-white/15 mx-auto mb-3" />
            <p className="text-white/30 text-sm">Žiadne plánované príchody</p>
          </div>
        ) : (
          <div className="bg-dark-jungle border border-white/5 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-white/30 text-xs font-normal px-5 py-3">Hosť</th>
                  <th className="text-left text-white/30 text-xs font-normal px-5 py-3 hidden sm:table-cell">Príchod</th>
                  <th className="text-left text-white/30 text-xs font-normal px-5 py-3 hidden md:table-cell">Odchod</th>
                  <th className="text-left text-white/30 text-xs font-normal px-5 py-3 hidden sm:table-cell">Hostia</th>
                  <th className="text-right text-white/30 text-xs font-normal px-5 py-3">Stav</th>
                </tr>
              </thead>
              <tbody>
                {upcoming.map((r, i) => (
                  <tr
                    key={r.id}
                    onClick={() => onSelectReservation(r)}
                    className={`cursor-pointer hover:bg-white/3 transition-colors duration-150 ${
                      i < upcoming.length - 1 ? 'border-b border-white/5' : ''
                    }`}
                  >
                    <td className="px-5 py-3.5">
                      <p className="text-white text-sm font-medium">{r.guest_name}</p>
                      <p className="text-white/35 text-xs truncate">{r.room_type}</p>
                    </td>
                    <td className="px-5 py-3.5 hidden sm:table-cell text-white/60 text-sm">{formatDate(r.check_in)}</td>
                    <td className="px-5 py-3.5 hidden md:table-cell text-white/60 text-sm">{formatDate(r.check_out)}</td>
                    <td className="px-5 py-3.5 hidden sm:table-cell text-white/60 text-sm">{r.guests_count}</td>
                    <td className="px-5 py-3.5 text-right">
                      <span className={`text-xs px-2 py-0.5 rounded-sm border ${STATUS_CONFIG[r.status].color}`}>
                        {STATUS_CONFIG[r.status].label}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
