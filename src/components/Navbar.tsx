import { Link, useLocation, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { Menu, X, AlertTriangle } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleRegisterClick = () => {
    setShowWarning(true);
    setTimeout(() => {
      setShowWarning(false);
      navigate('/checkout');
    }, 2000); // מעבר לדף ההרשמה אחרי 2 שניות
  };

  return (
    <>
      {/* אזהרה ניסיוני */}
      {showWarning && (
        <div className="fixed top-20 left-4 right-4 z-50 bg-yellow-500/90 backdrop-blur-md border border-yellow-400 rounded-lg p-4 shadow-lg animate-in slide-in-from-top-2">
          <div className="flex items-center gap-3 text-yellow-900">
            <AlertTriangle size={20} className="flex-shrink-0" />
            <div>
              <p className="font-bold">מערכת ניסיונית</p>
              <p className="text-sm">במידה ותקלה, אנא צרו קשר בוואטסאפ: 054-234-7000</p>
            </div>
            <button 
              onClick={() => setShowWarning(false)}
              className="ml-auto text-yellow-900 hover:text-yellow-700"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-[#1a1a1a]/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="text-2xl font-handjet text-green-500 hover:text-green-400 transition-colors">
              סטינגר ישראל
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8 space-x-reverse">
              <Link to="/#about" className="text-gray-300 hover:text-green-500 transition-colors font-rubik">עליי</Link>
              <Link to="/#benefits" className="text-gray-300 hover:text-green-500 transition-colors font-rubik">יתרונות</Link>
              <Link to="/#pricing" className="text-gray-300 hover:text-green-500 transition-colors font-rubik">מחירים</Link>
              <Link to="/#testimonials" className="text-gray-300 hover:text-green-500 transition-colors font-rubik">חוות דעת</Link>
              <Link to="/#faq" className="text-gray-300 hover:text-green-500 transition-colors font-rubik">שאלות נפוצות</Link>
              
              {/* כפתור הרשמה עם תגית */}
              <div className="relative">
                <button
                  onClick={handleRegisterClick}
                  className="relative bg-green-500 hover:bg-green-600 text-black font-bold py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  הרשמה לשיעור
                  {/* תגית "בניסיון" */}
                  <span className="absolute -top-2 -left-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full border-2 border-[#1a1a1a] animate-pulse">
                    בניסיון
                  </span>
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-gray-300 hover:text-green-500 transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          <div className={`md:hidden transition-all duration-300 ease-in-out ${
            isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          } overflow-hidden`}>
            <div className="py-4 space-y-4">
              <Link to="/#about" className="block text-gray-300 hover:text-green-500 transition-colors font-rubik">עליי</Link>
              <Link to="/#benefits" className="block text-gray-300 hover:text-green-500 transition-colors font-rubik">יתרונות</Link>
              <Link to="/#pricing" className="block text-gray-300 hover:text-green-500 transition-colors font-rubik">מחירים</Link>
              <Link to="/#testimonials" className="block text-gray-300 hover:text-green-500 transition-colors font-rubik">חוות דעת</Link>
              <Link to="/#faq" className="block text-gray-300 hover:text-green-500 transition-colors font-rubik">שאלות נפוצות</Link>
              
              {/* כפתור הרשמה למובייל */}
              <div className="pt-4 border-t border-gray-600">
                <div className="relative">
                  <button
                    onClick={handleRegisterClick}
                    className="relative w-full bg-green-500 hover:bg-green-600 text-black font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg"
                  >
                    הרשמה לשיעור
                    {/* תגית "בניסיון" למובייל */}
                    <span className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full border-2 border-[#1a1a1a] animate-pulse">
                      בניסיון
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;