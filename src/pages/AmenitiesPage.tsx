import Navigation from '../components/Navigation';
import Amenities from '../components/Amenities';
import Footer from '../components/Footer';

export default function AmenitiesPage() {
  return (
    <div className="min-h-screen bg-chinese-black">
      <Navigation />
      <div className="pt-20">
        <Amenities />
      </div>
      <Footer />
    </div>
  );
}
