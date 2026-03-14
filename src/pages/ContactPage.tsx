import Navigation from '../components/Navigation';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-chinese-black">
      <Navigation />
      <div className="pt-20">
        <Contact />
      </div>
      <Footer />
    </div>
  );
}
