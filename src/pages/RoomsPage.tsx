import Navigation from '../components/Navigation';
import Rooms from '../components/Rooms';
import Footer from '../components/Footer';

export default function RoomsPage() {
  return (
    <div className="min-h-screen bg-chinese-black">
      <Navigation />
      <div className="pt-20">
        <Rooms />
      </div>
      <Footer />
    </div>
  );
}
