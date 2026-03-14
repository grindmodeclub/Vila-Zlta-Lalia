import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export type DayStatus = 'free' | 'pending' | 'confirmed' | 'blocked' | 'past';

export interface OccupiedRange {
  start: string;
  end: string;
  status: 'pending' | 'confirmed' | 'blocked';
}

export function useAvailability() {
  const [occupiedRanges, setOccupiedRanges] = useState<OccupiedRange[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAvailability = useCallback(async () => {
    setLoading(true);

    const [reservationsResult, blockedResult] = await Promise.all([
      supabase
        .from('reservations')
        .select('check_in, check_out, status')
        .in('status', ['pending', 'confirmed', 'manual']),
      supabase
        .from('blocked_dates')
        .select('start_date, end_date'),
    ]);

    const ranges: OccupiedRange[] = [];

    if (reservationsResult.data) {
      for (const r of reservationsResult.data) {
        ranges.push({
          start: r.check_in,
          end: r.check_out,
          status: r.status === 'manual' ? 'blocked' : (r.status as 'pending' | 'confirmed'),
        });
      }
    }

    if (blockedResult.data) {
      for (const b of blockedResult.data) {
        ranges.push({
          start: b.start_date,
          end: b.end_date,
          status: 'blocked',
        });
      }
    }

    setOccupiedRanges(ranges);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  const getDayStatus = useCallback(
    (dateStr: string): DayStatus => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const date = new Date(dateStr);
      date.setHours(0, 0, 0, 0);

      if (date < today) return 'past';

      let result: DayStatus = 'free';

      for (const range of occupiedRanges) {
        const start = new Date(range.start);
        start.setHours(0, 0, 0, 0);
        const end = new Date(range.end);
        end.setHours(0, 0, 0, 0);

        if (date >= start && date < end) {
          if (range.status === 'confirmed' || range.status === 'blocked') {
            return range.status;
          }
          result = range.status;
        }
      }

      return result;
    },
    [occupiedRanges]
  );

  const isRangeFree = useCallback(
    (checkIn: string, checkOut: string): boolean => {
      if (!checkIn || !checkOut) return false;
      const start = new Date(checkIn);
      const end = new Date(checkOut);

      for (const range of occupiedRanges) {
        const rStart = new Date(range.start);
        const rEnd = new Date(range.end);

        if (start < rEnd && end > rStart) return false;
      }

      return true;
    },
    [occupiedRanges]
  );

  return { occupiedRanges, loading, getDayStatus, isRangeFree, refresh: fetchAvailability };
}
