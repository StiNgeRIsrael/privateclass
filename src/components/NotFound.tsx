import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#1a1a1a] pt-20 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="minecraft-card p-8">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>
          </div>
          
          <h1 className="text-4xl font-handjet text-red-500 mb-4">404</h1>
          <h2 className="text-2xl font-handjet text-green-500 mb-4">דף לא נמצא</h2>
          
          <p className="text-gray-300 mb-8 leading-relaxed">
            הדף שחיפשת לא קיים או הועבר למיקום אחר.
            <br />
            אנא בדוק את הכתובת או חזור לדף הראשי.
          </p>
          
          <Link 
            to="/" 
            className="minecraft-button flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            <Home size={20} />
            חזרה לדף הראשי
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
