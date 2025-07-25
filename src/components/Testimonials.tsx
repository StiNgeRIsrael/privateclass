import React from 'react';
import { User } from 'lucide-react';

const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="relative py-20 bg-[#1a1a1a]">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-handjet text-green-500 text-center mb-12">חוות דעת על שיעורי מיינקראפט</h2>
        <h3 className="text-xl font-handjet text-center mb-8 text-green-400">מה אומרים על השיעורים הפרטיים?</h3>
        
        <div className="max-w-3xl mx-auto">
          <div className="minecraft-card p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-green-500" />
              </div>
              <div className="mr-4">
                <h4 className="font-handjet text-green-500">אליזבת', אמא של דניאל בן ה-12</h4>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed">
              מצאתי את סטינגר אחרי חיפושים רבים אחרי מורה פרטי לילד שלי בנושא של מודים למיינקראפט. מצאתי את האתר הפרלמנטום וקבעתי שיעור נסיון. כבר באותו שיעור סטינגר נתן לו את הדרך להתקין mods תוך הסבר התהליך בצורה ברורה. אהבתי את הדרך בה התחבר לדניאל ודיבר איתו בגובה העיניים. השיעור היה ממוקד ומלמד אז קבענו סדרה שבה דניאל הכיר איך להתחבר לשרתים שונים וטריקים של משחק. הוא מאוד נהנה מהשיעורים ואף ביקש שאקח עוד סדרת שיעורים נוספת כמתנה ליום הולדת 8.
              אני מעריכה שסטינגר פתח כזה שרות שמאוד מקל על העניין להורים ולילדים ועוזר להכנס לדברים יותר מורכבים בעולם המיינקראפט.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials; 