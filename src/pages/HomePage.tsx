import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import About from '../components/About';
import EventSection from '../components/EventSection';
import HomeCtaBanner from '../components/HomeCtaBanner';
import Footer from '../components/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-chinese-black">
      <Navigation />
      <Hero />
      <About />
      <EventSection />
      <HomeCtaBanner />
      <Footer />
    </div>
  );
}
