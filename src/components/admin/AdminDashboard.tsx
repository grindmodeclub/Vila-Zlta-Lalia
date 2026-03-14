import { useState, useEffect, useCallback } from 'react';
import {
  LogOut, LayoutDashboard, Calendar, CalendarX, Plus, Menu, X
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Reservation, BlockedDate } from '../../types';

import DashboardOverview from './DashboardOverview';
import ReservationList from './ReservationList';
import ReservationDetail from './ReservationDetail';
import AdminCalendar from './AdminCalendar';
import BlockedDatesManager from './BlockedDatesManager';
import ManualReservationForm from './ManualReservationForm';

type AdminTab = 'dashboard' | 'reservations' | 'calendar' | 'blocked';

interface Props {
  onLogout: () => void;
}

const NAV_ITEMS: { key: AdminTab; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { key: 'dashboard', label: 'Prehľad', icon: LayoutDashboard },
  { key: 'reservations', label: 'Rezervácie', icon: Calendar },
  { key: 'calendar', label: 'Kalendár', icon: Calendar },
  { key: 'blocked', label: 'Blokovanie', icon: CalendarX },
];

export default function AdminDashboard({ onLogout }: Props) {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [resLoading, setResLoading] = useState(true);
  const [blockedLoading, setBlockedLoading] = useState(true);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [showManualForm, setShowManualForm] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const fetchReservations = useCallback(async () => {
    setResLoading(true);
    const { data } = await supabase
      .from('reservations')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setReservations(data as Reservation[]);
    setResLoading(false);
  }, []);

  const fetchBlockedDates = useCallback(async () => {
    setBlockedLoading(true);
    const { data } = await supabase
      .from('blocked_dates')
      .select('*')
      .order('start_date', { ascending: true });
    if (data) setBlockedDates(data as BlockedDate[]);
    setBlockedLoading(false);
  }, []);

  useEffect(() => {
    fetchReservations();
    fetchBlockedDates();
  }, [fetchReservations, fetchBlockedDates]);

  const pendingCount = reservations.filter((r) => r.status === 'pending').length;

  const handleSelectReservation = (r: Reservation) => {
    setSelectedReservation(r);
    setActiveTab('reservations');
  };

  const handleReservationUpdate = (updated: Reservation) => {
    setReservations((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    setSelectedReservation(updated);
  };

  const handleReservationDelete = (id: string) => {
    setReservations((prev) => prev.filter((r) => r.id !== id));
    setSelectedReservation(null);
  };

  const handleManualSaved = (r: Reservation) => {
    setReservations((prev) => [r, ...prev]);
    setShowManualForm(false);
    setSelectedReservation(r);
    setActiveTab('reservations');
  };

  const navigate = (tab: string) => {
    setActiveTab(tab as AdminTab);
    setMobileNavOpen(false);
  };

  const goHome = () => {
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <div className="min-h-screen bg-chinese-black flex flex-col">
      <header className="bg-dark-jungle border-b border-white/5 px-4 lg:px-6 py-3.5 sticky top-0 z-20 flex-shrink-0">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="lg:hidden text-white/40 hover:text-white transition-colors duration-200 p-1"
            >
              {mobileNavOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <button onClick={goHome} className="flex items-center leading-none">
              <span className="font-serif text-base text-white">Vila</span>
              <span className="font-serif text-base text-brass ml-1">Žltá Ľalia</span>
              <span className="text-white/20 mx-2 hidden sm:inline">|</span>
              <span className="text-white/40 text-sm hidden sm:inline">Admin</span>
            </button>
          </div>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => navigate(key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-sm text-sm transition-all duration-200 ${
                  activeTab === key
                    ? 'bg-brass/12 text-brass'
                    : 'text-white/45 hover:text-white hover:bg-white/4'
                }`}
              >
                <Icon size={14} />
                {label}
                {key === 'reservations' && pendingCount > 0 && (
                  <span className="bg-yellow-500/20 text-yellow-400 text-xs px-1.5 py-0.5 rounded-sm leading-none">
                    {pendingCount}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowManualForm(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-brass/10 border border-brass/25 text-brass text-xs rounded-sm hover:bg-brass/18 transition-colors duration-200"
            >
              <Plus size={13} />
              <span className="hidden sm:inline">Nová rezervácia</span>
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 text-white/35 hover:text-white text-xs transition-colors duration-200"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Odhlásiť</span>
            </button>
          </div>
        </div>

        {mobileNavOpen && (
          <div className="lg:hidden border-t border-white/5 mt-3.5 pt-3.5 space-y-1">
            {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => navigate(key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-all duration-200 ${
                  activeTab === key
                    ? 'bg-brass/12 text-brass'
                    : 'text-white/45 hover:text-white hover:bg-white/4'
                }`}
              >
                <Icon size={15} />
                {label}
                {key === 'reservations' && pendingCount > 0 && (
                  <span className="bg-yellow-500/20 text-yellow-400 text-xs px-1.5 py-0.5 rounded-sm ml-auto">
                    {pendingCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </header>

      <main className="flex-1 max-w-screen-2xl w-full mx-auto px-4 lg:px-8 py-6 lg:py-8">
        {activeTab === 'dashboard' && (
          <DashboardOverview
            reservations={reservations}
            onSelectReservation={handleSelectReservation}
            onNavigate={navigate}
          />
        )}

        {activeTab === 'reservations' && (
          <div className={`grid gap-6 ${selectedReservation ? 'lg:grid-cols-[1fr_420px]' : 'grid-cols-1 max-w-3xl'}`}>
            <ReservationList
              reservations={reservations}
              loading={resLoading}
              selected={selectedReservation}
              onSelect={setSelectedReservation}
              onRefresh={fetchReservations}
            />
            {selectedReservation && (
              <div className="lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-6rem)] lg:overflow-hidden">
                <ReservationDetail
                  reservation={selectedReservation}
                  onClose={() => setSelectedReservation(null)}
                  onUpdate={handleReservationUpdate}
                  onDelete={handleReservationDelete}
                />
              </div>
            )}
          </div>
        )}

        {activeTab === 'calendar' && (
          <AdminCalendar
            reservations={reservations}
            blockedDates={blockedDates}
            onSelectReservation={handleSelectReservation}
          />
        )}

        {activeTab === 'blocked' && (
          <BlockedDatesManager
            blockedDates={blockedDates}
            loading={blockedLoading}
            onRefresh={fetchBlockedDates}
            onUpdate={setBlockedDates}
          />
        )}
      </main>

      {showManualForm && (
        <ManualReservationForm
          onSaved={handleManualSaved}
          onClose={() => setShowManualForm(false)}
        />
      )}
    </div>
  );
}
