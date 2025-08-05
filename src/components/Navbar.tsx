import { Link, useLocation } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';

const enrichmentLinks = [
  { to: '/minecraft-logic', label: 'מיינקראפט וחשיבה לוגית' },
  // ניתן להוסיף כאן כתבות נוספות בעתיד
];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // סגירה אוטומטית של הדרופדאון במובייל כאשר משנים דף
  useEffect(() => {
    setIsOpen(false);
    setShowDropdown(false);
  }, [location.pathname]);

  return (
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
            <a href="#about" className="text-gray-300 hover:text-green-500 transition-colors font-rubik">עליי</a>
            <a href="#benefits" className="text-gray-300 hover:text-green-500 transition-colors font-rubik">יתרונות</a>
            <a href="#pricing" className="text-gray-300 hover:text-green-500 transition-colors font-rubik">מחירים</a>
            <a href="#testimonials" className="text-gray-300 hover:text-green-500 transition-colors font-rubik">חוות דעת</a>
            <a href="#faq" className="text-gray-300 hover:text-green-500 transition-colors font-rubik">שאלות נפוצות</a>
            <a href="#contact" className="text-gray-300 hover:text-green-500 transition-colors font-rubik">צור קשר</a>
            <div
              className="relative"
              ref={dropdownRef}
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
            >
              <button className="flex items-center text-gray-300 hover:text-green-500 font-rubik transition-colors focus:outline-none">
                העשרה <ChevronDown size={18} className="ml-1" />
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-[#232323] rounded-lg shadow-lg py-2 z-50 border border-green-600">
                  {enrichmentLinks.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={`block px-4 py-2 text-right transition-colors font-rubik ${
                        location.pathname === item.to
                          ? 'text-green-400 bg-[#232323] font-bold' // ירוק רק לדף הפעיל
                          : 'text-gray-200 hover:bg-green-600 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
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
            <a href="#about" className="block text-gray-300 hover:text-green-500 transition-colors font-rubik">עליי</a>
            <a href="#benefits" className="block text-gray-300 hover:text-green-500 transition-colors font-rubik">יתרונות</a>
            <a href="#pricing" className="block text-gray-300 hover:text-green-500 transition-colors font-rubik">מחירים</a>
            <a href="#testimonials" className="block text-gray-300 hover:text-green-500 transition-colors font-rubik">חוות דעת</a>
            <a href="#faq" className="block text-gray-300 hover:text-green-500 transition-colors font-rubik">שאלות נפוצות</a>
            <a href="#contact" className="block text-gray-300 hover:text-green-500 transition-colors font-rubik">צור קשר</a>
            <div className="border-t border-gray-700 pt-2">
              <div className="font-rubik text-gray-300 mb-1">העשרה</div>
              {enrichmentLinks.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`block px-4 py-2 text-right transition-colors font-rubik ${
                    location.pathname === item.to
                      ? 'text-green-400 bg-[#232323] font-bold'
                      : 'text-gray-200 hover:bg-green-600 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;