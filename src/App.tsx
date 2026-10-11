import { useState, useEffect } from 'react';
import { applySeo } from './lib/seo';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import ReservationPage from './pages/ReservationPage';
import PricingPage from './pages/PricingPage';
import RoomsPage from './pages/RoomsPage';
import AmenitiesPage from './pages/AmenitiesPage';
import LocationPage from './pages/LocationPage';
import ContactPage from './pages/ContactPage';
import ConditionsPage from './pages/ConditionsPage';
import GalleryPage from './pages/GalleryPage';

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    applySeo(currentPath);
  }, [currentPath]);

  if (currentPath === '/admin' || currentPath === '/admin/') {
    return <AdminPage />;
  }

  if (currentPath === '/rezervacia' || currentPath === '/rezervacia/') {
    return <ReservationPage />;
  }

  if (currentPath === '/cennik' || currentPath === '/cennik/') {
    return <PricingPage />;
  }

  if (currentPath === '/izby' || currentPath === '/izby/') {
    return <RoomsPage />;
  }

  if (currentPath === '/vybavenie' || currentPath === '/vybavenie/') {
    return <AmenitiesPage />;
  }

  if (currentPath === '/lokalita' || currentPath === '/lokalita/') {
    return <LocationPage />;
  }

  if (currentPath === '/kontakt' || currentPath === '/kontakt/') {
    return <ContactPage />;
  }

  if (currentPath === '/podmienky' || currentPath === '/podmienky/') {
    return <ConditionsPage />;
  }

  if (currentPath === '/galeria' || currentPath === '/galeria/') {
    return <GalleryPage />;
  }

  return <HomePage />;
}

export default App;
