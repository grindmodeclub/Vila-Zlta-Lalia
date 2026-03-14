import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import About from '../components/About';
import HomeCtaBanner from '../components/HomeCtaBanner';
import Footer from '../components/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-chinese-black">
      <Navigation />
      <Hero />
      <About />
      <HomeCtaBanner />
      <Footer />
    </div>
  );
}
