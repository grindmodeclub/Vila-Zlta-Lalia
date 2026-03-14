export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'rejected' | 'manual';

export interface Reservation {
  id: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  check_in: string;
  check_out: string;
  guests_count: number;
  room_type: string;
  message: string;
  status: ReservationStatus;
  total_price: number | null;
  is_manual: boolean;
  internal_note: string;
  created_at: string;
  updated_at: string;
}

export interface ReservationFormData {
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  check_in: string;
  check_out: string;
  guests_count: number;
  room_type: string;
  message: string;
}

export interface BlockedDate {
  id: string;
  start_date: string;
  end_date: string;
  reason: string;
  created_at: string;
}
