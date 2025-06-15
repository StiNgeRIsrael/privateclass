import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Benefits from './components/Benefits';
import Pricing from './components/Pricing';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <Navbar />
      <Hero />
      <Benefits />
      <About />
      <FAQ />
      <Pricing />
      <Testimonials />
      <Footer />
    </div>
  );
}

export default App;