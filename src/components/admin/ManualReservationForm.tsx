import { useState } from 'react';
import { Save, X, RefreshCw } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Reservation, ReservationStatus } from '../../types';
import { ROOM_TYPES } from './shared/statusConfig';

interface Props {
  onSaved: (r: Reservation) => void;
  onClose: () => void;
}

const EMPTY_FORM = {
  guest_name: '',
  guest_email: '',
  guest_phone: '',
  check_in: '',
  check_out: '',
  guests_count: 2,
  room_type: ROOM_TYPES[0],
  message: '',
  internal_note: '',
  total_price: '',
  status: 'confirmed' as ReservationStatus,
};

export default function ManualReservationForm({ onSaved, onClose }: Props) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const handleSave = async () => {
    setError('');
    if (!form.guest_name.trim()) { setError('Meno hosťa je povinné.'); return; }
    if (!form.check_in || !form.check_out) { setError('Vyplňte dátumy pobytu.'); return; }
    if (form.check_out <= form.check_in) { setError('Dátum odchodu musí byť po príchode.'); return; }

    setSaving(true);
    const { data, error: dbError } = await supabase
      .from('reservations')
      .insert([{
        guest_name: form.guest_name.trim(),
        guest_email: form.guest_email.trim(),
        guest_phone: form.guest_phone.trim(),
        check_in: form.check_in,
        check_out: form.check_out,
        guests_count: Number(form.guests_count),
        room_type: form.room_type,
        message: form.message.trim(),
        internal_note: form.internal_note.trim(),
        total_price: form.total_price === '' ? null : Number(form.total_price),
        status: form.status,
        is_manual: true,
      }])
      .select()
      .maybeSingle();

    if (dbError) {
      setError('Nepodarilo sa uložiť rezerváciu.');
    } else if (data) {
      onSaved(data as Reservation);
    }
    setSaving(false);
  };

  const statusOptions: { value: ReservationStatus; label: string }[] = [
    { value: 'confirmed', label: 'Potvrdená' },
    { value: 'manual', label: 'Manuálna blokácia' },
    { value: 'pending', label: 'Čaká na schválenie' },
  ];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4 py-8">
      <div className="bg-dark-jungle border border-white/10 rounded-lg w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 flex-shrink-0">
          <h3 className="font-serif text-white text-lg">Nová rezervácia (manuálna)</h3>
          <button onClick={onClose} className="text-white/30 hover:text-white transition-colors duration-200">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {error && (
            <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-sm px-3 py-2">
              {error}
            </p>
          )}

          <div>
            <label className="label-dark">Meno hosťa *</label>
            <input
              type="text"
              value={form.guest_name}
              onChange={(e) => setForm((p) => ({ ...p, guest_name: e.target.value }))}
              className="input-dark"
              placeholder="Meno a priezvisko"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-dark">E-mail</label>
              <input
                type="email"
                value={form.guest_email}
                onChange={(e) => setForm((p) => ({ ...p, guest_email: e.target.value }))}
                className="input-dark"
                placeholder="Nepovinné"
              />
            </div>
            <div>
              <label className="label-dark">Telefón</label>
              <input
                type="text"
                value={form.guest_phone}
                onChange={(e) => setForm((p) => ({ ...p, guest_phone: e.target.value }))}
                className="input-dark"
                placeholder="Nepovinné"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-dark">Príchod *</label>
              <input
                type="date"
                value={form.check_in}
                onChange={(e) => setForm((p) => ({ ...p, check_in: e.target.value }))}
                className="input-dark"
              />
            </div>
            <div>
              <label className="label-dark">Odchod *</label>
              <input
                type="date"
                value={form.check_out}
                min={form.check_in || today}
                onChange={(e) => setForm((p) => ({ ...p, check_out: e.target.value }))}
                className="input-dark"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-dark">Počet hostí</label>
              <input
                type="number"
                min={1}
                max={9}
                value={form.guests_count}
                onChange={(e) => setForm((p) => ({ ...p, guests_count: Number(e.target.value) }))}
                className="input-dark"
              />
            </div>
            <div>
              <label className="label-dark">Cena (€)</label>
              <input
                type="number"
                min={0}
                value={form.total_price}
                onChange={(e) => setForm((p) => ({ ...p, total_price: e.target.value }))}
                className="input-dark"
                placeholder="Nepovinné"
              />
            </div>
          </div>

          <div>
            <label className="label-dark">Ubytovanie</label>
            <select
              value={form.room_type}
              onChange={(e) => setForm((p) => ({ ...p, room_type: e.target.value }))}
              className="input-dark"
            >
              {ROOM_TYPES.map((rt) => (
                <option key={rt} value={rt}>{rt}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label-dark">Stav rezervácie</label>
            <select
              value={form.status}
              onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as ReservationStatus }))}
              className="input-dark"
            >
              {statusOptions.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label-dark">Interná poznámka</label>
            <textarea
              rows={2}
              value={form.internal_note}
              onChange={(e) => setForm((p) => ({ ...p, internal_note: e.target.value }))}
              className="input-dark resize-none"
              placeholder="napr. Rezervácia z Bookingu, telefonicky..."
            />
          </div>

          <div>
            <label className="label-dark">Správa / poznámka hosťa</label>
            <textarea
              rows={2}
              value={form.message}
              onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
              className="input-dark resize-none"
              placeholder="Nepovinné"
            />
          </div>
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-white/5 flex-shrink-0">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 bg-brass text-chinese-black py-2.5 rounded-sm text-sm font-medium hover:bg-brass/90 transition-colors duration-200 disabled:opacity-50"
          >
            {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
            {saving ? 'Ukladám...' : 'Uložiť rezerváciu'}
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2.5 border border-white/10 text-white/50 hover:text-white rounded-sm text-sm transition-colors duration-200"
          >
            Zrušiť
          </button>
        </div>
      </div>
    </div>
  );
}
