import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-[#1a1a1a]/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="#" className="text-2xl font-handjet text-green-500 hover:text-green-400 transition-colors">
            סטינגר ישראל
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8 space-x-reverse">
            <a href="#about" className="text-gray-300 hover:text-green-500 transition-colors font-rubik">עליי</a>
            <a href="#benefits" className="text-gray-300 hover:text-green-500 transition-colors font-rubik">יתרונות</a>
            <a href="#pricing" className="text-gray-300 hover:text-green-500 transition-colors font-rubik">מחירים</a>
            <a href="#testimonials" className="text-gray-300 hover:text-green-500 transition-colors font-rubik">חוות דעת</a>
            <a href="#faq" className="text-gray-300 hover:text-green-500 transition-colors font-rubik">שאלות נפוצות</a>
            <a href="#contact" className="text-gray-300 hover:text-green-500 transition-colors font-rubik">צור קשר</a>
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
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;