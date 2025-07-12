import React, { useEffect, useRef, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Benefits from './components/Benefits';
import Pricing from './components/Pricing';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Footer from './components/Footer';

const WHATSAPP_URL = "https://wa.me/972542347000";

function LeaveBehindPopup({ open, onClose }: { open: boolean, onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white rounded-lg p-8 shadow-lg max-w-xs text-center relative">
        <button onClick={onClose} className="absolute top-2 left-2 text-gray-400 hover:text-gray-700 text-xl">×</button>
        <h3 className="text-xl font-bold mb-4 text-green-600">רגע לפני שאתם עוזבים...</h3>
        <p className="mb-6 text-gray-700">יש לכם שאלה או התלבטות? נשמח לעזור לכם – דברו איתנו בוואטסאפ ונענה על כל שאלה!</p>
        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="minecraft-button flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.151-.174.2-.298.3-.497.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.007-.372-.009-.571-.009-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.099 3.205 5.077 4.372.709.306 1.262.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.617h-.001a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.999-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.991c-.003 5.45-4.437 9.884-9.88 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .06 5.435.058 12.088c0 2.137.56 4.223 1.623 6.067L.057 24l6.064-1.591a11.93 11.93 0 0 0 5.929 1.515h.005c6.554 0 11.989-5.435 11.991-12.088a11.86 11.86 0 0 0-3.501-8.434"/></svg>
          דברו איתנו בוואטסאפ
        </a>
      </div>
    </div>
  );
}

const TITLES = [
  document.title,
  "רגע! יש לנו הצעה בשבילך 🎁",
  "נשמח לעזור לך בוואטסאפ!"
];

function App() {
  const [showPopup, setShowPopup] = useState(false);
  const titleInterval = useRef<number | null>(null);
  const originalTitle = useRef(document.title);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setShowPopup(true);
        if (!titleInterval.current) {
          let i = 0;
          titleInterval.current = setInterval(() => {
            document.title = TITLES[++i % TITLES.length];
          }, 1200);
        }
      }
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        setShowPopup(true);
        if (!titleInterval.current) {
          let i = 0;
          titleInterval.current = setInterval(() => {
            document.title = TITLES[++i % TITLES.length];
          }, 1200);
        }
      } else if (document.visibilityState === 'visible') {
        if (titleInterval.current) {
          clearInterval(titleInterval.current);
          titleInterval.current = null;
          document.title = originalTitle.current;
        }
      }
    };
    const handleFocus = () => {
      if (titleInterval.current) {
        clearInterval(titleInterval.current);
        titleInterval.current = null;
        document.title = originalTitle.current;
      }
    };
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (titleInterval.current) clearInterval(titleInterval.current);
    };
  }, []);

  return (
    <>
      <LeaveBehindPopup open={showPopup} onClose={() => setShowPopup(false)} />
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
    </>
  );
}

export default App;