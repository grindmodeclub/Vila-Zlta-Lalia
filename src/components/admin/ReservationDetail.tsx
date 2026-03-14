import { useState } from 'react';
import { X, CheckCircle, XCircle, Clock, Trash2, MessageSquare, CreditCard as Edit3, Save, Phone, Mail, Users, Calendar, StickyNote, Ban } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Reservation, ReservationStatus } from '../../types';
import { STATUS_CONFIG, formatDate, countNights, ROOM_TYPES } from './shared/statusConfig';

interface Props {
  reservation: Reservation;
  onClose: () => void;
  onUpdate: (updated: Reservation) => void;
  onDelete: (id: string) => void;
}

export default function ReservationDetail({ reservation, onClose, onUpdate, onDelete }: Props) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState({
    guest_name: reservation.guest_name,
    guest_email: reservation.guest_email,
    guest_phone: reservation.guest_phone,
    check_in: reservation.check_in,
    check_out: reservation.check_out,
    guests_count: reservation.guests_count,
    room_type: reservation.room_type,
    message: reservation.message,
    internal_note: reservation.internal_note || '',
    total_price: reservation.total_price ?? '',
  });

  const handleSave = async () => {
    setSaving(true);
    const { data, error } = await supabase
      .from('reservations')
      .update({
        guest_name: form.guest_name,
        guest_email: form.guest_email,
        guest_phone: form.guest_phone,
        check_in: form.check_in,
        check_out: form.check_out,
        guests_count: Number(form.guests_count),
        room_type: form.room_type,
        message: form.message,
        internal_note: form.internal_note,
        total_price: form.total_price === '' ? null : Number(form.total_price),
        updated_at: new Date().toISOString(),
      })
      .eq('id', reservation.id)
      .select()
      .maybeSingle();
    if (!error && data) {
      onUpdate(data as Reservation);
      setEditing(false);
    }
    setSaving(false);
  };

  const handleStatusChange = async (status: ReservationStatus) => {
    const { data, error } = await supabase
      .from('reservations')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', reservation.id)
      .select()
      .maybeSingle();
    if (!error && data) onUpdate(data as Reservation);
  };

  const handleDelete = async () => {
    if (!confirm('Naozaj chcete natrvalo vymazať túto rezerváciu?')) return;
    setDeleting(true);
    await supabase.from('reservations').delete().eq('id', reservation.id);
    onDelete(reservation.id);
  };

  const r = reservation;

  return (
    <div className="bg-dark-jungle border border-white/5 rounded-lg h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 flex-shrink-0">
        <div className="flex items-center gap-3">
          <h3 className="font-serif text-white">Detail rezervácie</h3>
          {r.is_manual && (
            <span className="text-xs px-2 py-0.5 rounded-sm bg-white/5 text-white/35 border border-white/8">
              Manuálna
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1.5 text-white/40 hover:text-white text-xs transition-colors duration-200 px-3 py-1.5 rounded-sm border border-white/8 hover:border-white/20"
            >
              <Edit3 size={12} />
              Upraviť
            </button>
          )}
          <button onClick={onClose} className="text-white/30 hover:text-white transition-colors duration-200 p-1">
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
        {!editing ? (
          <>
            <div className="flex items-center gap-3">
              <span className={`text-sm px-2.5 py-1 rounded-sm border ${STATUS_CONFIG[r.status].color}`}>
                {STATUS_CONFIG[r.status].label}
              </span>
              <span className="text-white/30 text-xs">
                Prijaté {formatDate(r.created_at)}
              </span>
            </div>

            <div className="space-y-1">
              <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Hosť</p>
              <p className="text-white font-medium text-lg">{r.guest_name}</p>
              {r.guest_email && (
                <a href={`mailto:${r.guest_email}`} className="flex items-center gap-2 text-brass/80 hover:text-brass text-sm transition-colors duration-200">
                  <Mail size={13} />
                  {r.guest_email}
                </a>
              )}
              {r.guest_phone && (
                <a href={`tel:${r.guest_phone}`} className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors duration-200">
                  <Phone size={13} />
                  {r.guest_phone}
                </a>
              )}
            </div>

            <div className="border-t border-white/5 pt-5">
              <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Pobyt</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Príchod', value: formatDate(r.check_in), icon: Calendar },
                  { label: 'Odchod', value: formatDate(r.check_out), icon: Calendar },
                  { label: 'Noci', value: String(countNights(r.check_in, r.check_out)), icon: Clock },
                  { label: 'Hostia', value: `${r.guests_count} os.`, icon: Users },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="bg-white/3 rounded-sm p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Icon size={11} className="text-white/30" />
                      <span className="text-white/35 text-xs">{label}</span>
                    </div>
                    <span className="text-white text-sm font-medium">{value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 bg-white/3 rounded-sm p-3">
                <p className="text-white/35 text-xs mb-1">Ubytovanie</p>
                <p className="text-white text-sm">{r.room_type}</p>
              </div>
              {r.total_price !== null && r.total_price !== undefined && (
                <div className="mt-3 bg-brass/5 border border-brass/15 rounded-sm p-3">
                  <p className="text-white/35 text-xs mb-1">Cena</p>
                  <p className="text-brass font-medium">{r.total_price.toLocaleString('sk-SK')} €</p>
                </div>
              )}
            </div>

            {r.message && (
              <div className="border-t border-white/5 pt-5">
                <p className="text-white/40 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <MessageSquare size={11} />
                  Správa hosťa
                </p>
                <p className="text-white/60 text-sm leading-relaxed bg-white/3 rounded-sm p-3">{r.message}</p>
              </div>
            )}

            {r.internal_note && (
              <div className="border-t border-white/5 pt-5">
                <p className="text-white/40 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <StickyNote size={11} />
                  Interná poznámka
                </p>
                <p className="text-white/60 text-sm leading-relaxed bg-brass/5 border border-brass/10 rounded-sm p-3">
                  {r.internal_note}
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-4">
            <p className="text-white/40 text-xs uppercase tracking-wider">Úprava rezervácie</p>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="label-dark">Meno hosťa</label>
                <input
                  type="text"
                  value={form.guest_name}
                  onChange={(e) => setForm((p) => ({ ...p, guest_name: e.target.value }))}
                  className="input-dark"
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
                  />
                </div>
                <div>
                  <label className="label-dark">Telefón</label>
                  <input
                    type="text"
                    value={form.guest_phone}
                    onChange={(e) => setForm((p) => ({ ...p, guest_phone: e.target.value }))}
                    className="input-dark"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label-dark">Príchod</label>
                  <input
                    type="date"
                    value={form.check_in}
                    onChange={(e) => setForm((p) => ({ ...p, check_in: e.target.value }))}
                    className="input-dark"
                  />
                </div>
                <div>
                  <label className="label-dark">Odchod</label>
                  <input
                    type="date"
                    value={form.check_out}
                    min={form.check_in}
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
                <label className="label-dark">Správa hosťa</label>
                <textarea
                  rows={3}
                  value={form.message}
                  onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                  className="input-dark resize-none"
                />
              </div>
              <div>
                <label className="label-dark">Interná poznámka (len pre admin)</label>
                <textarea
                  rows={2}
                  value={form.internal_note}
                  onChange={(e) => setForm((p) => ({ ...p, internal_note: e.target.value }))}
                  className="input-dark resize-none"
                  placeholder="Osobná poznámka, info z Bookingu..."
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex-shrink-0 px-6 py-4 border-t border-white/5 space-y-2">
        {editing ? (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 bg-brass text-chinese-black py-2.5 rounded-sm text-sm font-medium hover:bg-brass/90 transition-colors duration-200 disabled:opacity-50"
            >
              <Save size={14} />
              {saving ? 'Ukladám...' : 'Uložiť zmeny'}
            </button>
            <button
              onClick={() => setEditing(false)}
              className="px-4 py-2.5 border border-white/10 text-white/50 hover:text-white rounded-sm text-sm transition-colors duration-200"
            >
              Zrušiť
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-2">
              {r.status !== 'confirmed' && (
                <button
                  onClick={() => handleStatusChange('confirmed')}
                  className="flex items-center justify-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 py-2.5 rounded-sm text-sm hover:bg-green-500/20 transition-colors duration-200"
                >
                  <CheckCircle size={13} />
                  Potvrdiť
                </button>
              )}
              {r.status !== 'rejected' && (
                <button
                  onClick={() => handleStatusChange('rejected')}
                  className="flex items-center justify-center gap-2 bg-orange-500/10 border border-orange-500/20 text-orange-400 py-2.5 rounded-sm text-sm hover:bg-orange-500/20 transition-colors duration-200"
                >
                  <Ban size={13} />
                  Zamietnuť
                </button>
              )}
              {r.status !== 'pending' && (
                <button
                  onClick={() => handleStatusChange('pending')}
                  className="flex items-center justify-center gap-2 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 py-2.5 rounded-sm text-sm hover:bg-yellow-500/20 transition-colors duration-200"
                >
                  <Clock size={13} />
                  Čaká
                </button>
              )}
              {r.status !== 'cancelled' && (
                <button
                  onClick={() => handleStatusChange('cancelled')}
                  className="flex items-center justify-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 py-2.5 rounded-sm text-sm hover:bg-red-500/20 transition-colors duration-200"
                >
                  <XCircle size={13} />
                  Zrušiť
                </button>
              )}
            </div>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="w-full flex items-center justify-center gap-2 text-white/20 hover:text-red-400 py-2 text-xs transition-colors duration-200"
            >
              <Trash2 size={12} />
              {deleting ? 'Vymazávam...' : 'Vymazať rezerváciu'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
