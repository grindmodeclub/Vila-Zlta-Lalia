import Navigation from '../components/Navigation';
import Location from '../components/Location';
import Footer from '../components/Footer';

export default function LocationPage() {
  return (
    <div className="min-h-screen bg-chinese-black">
      <Navigation />
      <div className="pt-20">
        <Location />
      </div>
      <Footer />
    </div>
  );
}
