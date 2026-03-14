import Navigation from '../components/Navigation';
import Rules from '../components/Rules';
import Footer from '../components/Footer';

export default function ConditionsPage() {
  return (
    <div className="min-h-screen bg-chinese-black">
      <Navigation />
      <div className="pt-20">
        <Rules />
      </div>
      <Footer />
    </div>
  );
}
