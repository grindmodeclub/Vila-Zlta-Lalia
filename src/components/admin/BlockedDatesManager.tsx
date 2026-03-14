import { useState } from 'react';
import { CalendarX, Plus, Trash2, RefreshCw, Info } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { BlockedDate } from '../../types';
import { formatDate, countNights } from './shared/statusConfig';

interface Props {
  blockedDates: BlockedDate[];
  loading: boolean;
  onRefresh: () => void;
  onUpdate: (dates: BlockedDate[]) => void;
}

export default function BlockedDatesManager({ blockedDates, loading, onRefresh, onUpdate }: Props) {
  const today = new Date().toISOString().split('T')[0];
  const [form, setForm] = useState({ start_date: '', end_date: '', reason: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleAdd = async () => {
    setError('');
    if (!form.start_date || !form.end_date) {
      setError('Vyplňte oba dátumy.');
      return;
    }
    if (form.end_date <= form.start_date) {
      setError('Dátum konca musí byť po dátume začiatku.');
      return;
    }
    setSaving(true);
    const { data, error: dbError } = await supabase
      .from('blocked_dates')
      .insert([{ start_date: form.start_date, end_date: form.end_date, reason: form.reason }])
      .select()
      .maybeSingle();
    if (dbError) {
      setError('Nepodarilo sa uložiť blokáciu.');
    } else if (data) {
      const updated = [...blockedDates, data as BlockedDate].sort((a, b) =>
        a.start_date.localeCompare(b.start_date)
      );
      onUpdate(updated);
      setForm({ start_date: '', end_date: '', reason: '' });
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Odstrániť blokáciu?')) return;
    await supabase.from('blocked_dates').delete().eq('id', id);
    onUpdate(blockedDates.filter((b) => b.id !== id));
  };

  const active = blockedDates.filter((b) => b.end_date >= today);
  const past = blockedDates.filter((b) => b.end_date < today);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl text-white mb-1">Blokovanie termínov</h2>
          <p className="text-white/40 text-sm">Manuálne blokované termíny sa zobrazujú ako nedostupné vo verejnom kalendári.</p>
        </div>
        <button
          onClick={onRefresh}
          className="flex items-center gap-1.5 text-white/40 hover:text-white text-xs transition-colors duration-200"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          Obnoviť
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <div className="bg-dark-jungle border border-white/5 rounded-lg p-6">
            <h3 className="font-serif text-white text-lg mb-5">Pridať blokáciu</h3>
            {error && (
              <p className="text-red-400 text-sm mb-4 bg-red-400/10 border border-red-400/20 rounded-sm px-3 py-2">
                {error}
              </p>
            )}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-dark">Dátum začiatku</label>
                  <input
                    type="date"
                    value={form.start_date}
                    min={today}
                    onChange={(e) => setForm((p) => ({ ...p, start_date: e.target.value }))}
                    className="input-dark"
                  />
                </div>
                <div>
                  <label className="label-dark">Dátum konca</label>
                  <input
                    type="date"
                    value={form.end_date}
                    min={form.start_date || today}
                    onChange={(e) => setForm((p) => ({ ...p, end_date: e.target.value }))}
                    className="input-dark"
                  />
                </div>
              </div>
              <div>
                <label className="label-dark">Dôvod (interná poznámka)</label>
                <input
                  type="text"
                  value={form.reason}
                  onChange={(e) => setForm((p) => ({ ...p, reason: e.target.value }))}
                  className="input-dark"
                  placeholder="napr. Booking.com, vlastné použitie, údržba..."
                />
              </div>
              <button
                onClick={handleAdd}
                disabled={!form.start_date || !form.end_date || saving}
                className="btn-primary w-full justify-center disabled:opacity-40"
              >
                {saving ? <RefreshCw size={14} className="animate-spin" /> : <Plus size={14} />}
                {saving ? 'Ukladám...' : 'Zablokovať termín'}
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-start gap-2.5 bg-brass/5 border border-brass/15 rounded-sm p-4">
            <Info size={14} className="text-brass/70 flex-shrink-0 mt-0.5" />
            <p className="text-white/40 text-xs leading-relaxed">
              Blokácia ihneď znemožní hosťom rezervovať dané dni. Dni sa zobrazia v&nbsp;kalendári rezervácií ako sivé (nedostupné). Použite to pre rezervácie z&nbsp;Bookingu, vlastné pobyty alebo údržbu.
            </p>
          </div>
        </div>

        <div>
          <h3 className="font-serif text-white text-lg mb-4">
            Aktívne blokácie
            {active.length > 0 && (
              <span className="ml-2 text-sm text-white/30 font-sans font-normal">({active.length})</span>
            )}
          </h3>

          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="w-6 h-6 border-2 border-brass/30 border-t-brass rounded-full animate-spin" />
            </div>
          ) : active.length === 0 ? (
            <div className="text-center py-16 bg-dark-jungle rounded-lg border border-white/5">
              <CalendarX size={28} className="text-white/15 mx-auto mb-3" />
              <p className="text-white/30 text-sm">Žiadne aktívne blokácie</p>
            </div>
          ) : (
            <div className="space-y-2">
              {active.map((b) => (
                <div
                  key={b.id}
                  className="bg-dark-jungle border border-white/5 rounded-lg p-4 flex items-center justify-between gap-4"
                >
                  <div>
                    <p className="text-white/80 text-sm font-medium">
                      {formatDate(b.start_date)} – {formatDate(b.end_date)}
                    </p>
                    {b.reason && (
                      <p className="text-white/35 text-xs mt-0.5">{b.reason}</p>
                    )}
                    <p className="text-white/20 text-xs mt-1">
                      {countNights(b.start_date, b.end_date)} nocí
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(b.id)}
                    className="text-white/20 hover:text-red-400 transition-colors duration-200 flex-shrink-0 p-1"
                    title="Odstrániť blokáciu"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {past.length > 0 && (
            <div className="mt-6">
              <h4 className="text-white/30 text-xs uppercase tracking-wider mb-3">Minulé blokácie</h4>
              <div className="space-y-2 opacity-50">
                {past.map((b) => (
                  <div
                    key={b.id}
                    className="bg-dark-jungle border border-white/5 rounded-sm p-3 flex items-center justify-between gap-4"
                  >
                    <div>
                      <p className="text-white/50 text-sm">
                        {formatDate(b.start_date)} – {formatDate(b.end_date)}
                      </p>
                      {b.reason && <p className="text-white/25 text-xs mt-0.5">{b.reason}</p>}
                    </div>
                    <button
                      onClick={() => handleDelete(b.id)}
                      className="text-white/15 hover:text-red-400 transition-colors duration-200 flex-shrink-0"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
