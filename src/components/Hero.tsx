import React from 'react';
import { Clock, Star } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative py-20 bg-[#1a1a1a]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-handjet text-green-500 mb-4">
                שיעורים פרטיים במיינקראפט
              </h1>
              <p className="text-xl text-gray-300 mb-6">
                למידה חווייתית דרך משחק, שיפור אנגלית ופיתוח כישורים דיגיטליים
              </p>
            </div>

            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-green-500 ml-2" />
                <span className="text-gray-300 font-rubik">10+ שנות ניסיון</span>
              </div>
              <div className="flex items-center">
                <Star className="w-5 h-5 text-green-500 ml-2" />
                <span className="text-gray-300 font-rubik">למידה חווייתית</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#pricing"
                className="minecraft-button bg-green-500 text-white px-8 py-3 rounded-lg text-center font-handjet text-lg hover:bg-green-600 transition-colors"
              >
                קבע שיעור
              </a>
              <a
                href="#about"
                className="minecraft-button bg-transparent border-2 border-green-500 text-green-500 px-8 py-3 rounded-lg text-center font-handjet text-lg hover:bg-green-500/10 transition-colors"
              >
                קרא עוד
              </a>
            </div>
          </div>

          {/* Image with Frame */}
          <div className="relative">
            <div className="absolute inset-0 bg-green-500/10 rounded-lg transform rotate-3"></div>
            <div className="relative">
              <img 
                src="https://stingerisrael.co.il/picture_library/YouTuber.webp" 
                alt="סטינגר - מורה למיינקראפט" 
                className="w-full h-auto rounded-lg transform -rotate-3"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;