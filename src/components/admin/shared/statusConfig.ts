import type { ReservationStatus } from '../../../types';

export const STATUS_CONFIG: Record<ReservationStatus, { label: string; color: string; dot: string }> = {
  pending: {
    label: 'Čaká na schválenie',
    color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    dot: 'bg-yellow-400',
  },
  confirmed: {
    label: 'Potvrdená',
    color: 'text-green-400 bg-green-400/10 border-green-400/20',
    dot: 'bg-green-400',
  },
  cancelled: {
    label: 'Zrušená',
    color: 'text-red-400 bg-red-400/10 border-red-400/20',
    dot: 'bg-red-400',
  },
  rejected: {
    label: 'Zamietnutá',
    color: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
    dot: 'bg-orange-400',
  },
  manual: {
    label: 'Manuálna blokácia',
    color: 'text-slate-400 bg-slate-400/10 border-slate-400/20',
    dot: 'bg-slate-400',
  },
};

export const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('sk-SK', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

export const formatDateShort = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('sk-SK', {
    day: 'numeric',
    month: 'numeric',
  });

export const countNights = (checkIn: string, checkOut: string) => {
  const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  return Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24)));
};

export const ROOM_TYPES = [
  'Celá vila (odporúčame)',
  'Dvojlôžkové štúdio',
  'Trojlôžková izba',
  'Štvorlôžková izba',
];
