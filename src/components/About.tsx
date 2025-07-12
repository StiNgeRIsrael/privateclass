import React from 'react';
import { Clock, Star, Trophy } from 'lucide-react';

const About: React.FC = () => {
  return (
    <section id="about" className="relative py-20 bg-[#1a1a1a]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Image with Frame */}
          <div className="relative order-2 md:order-1">
            <div className="absolute inset-0 bg-green-500/10 rounded-lg transform -rotate-3"></div>
            <div className="relative">
              <img 
                src="https://vzge.me/bust/1024/ParlaGames" 
                alt="סטינגר ישראל - יוטיובר מוביל ומורה פרטי למיינקראפט, שיעורים פרטיים במיינקראפט לילדים" 
                className="w-full h-auto rounded-lg transform rotate-3 scale-x-[-1]"
              />
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-6 order-1 md:order-2">
            <h2 className="text-3xl font-handjet text-green-500 mb-4">מורה פרטי למיינקראפט - מי אני?</h2>
            <h3 className="text-xl font-handjet text-green-400 mb-4">יוטיובר מוביל עם ניסיון של 10+ שנים</h3>
            <p className="text-gray-300 leading-relaxed">
              אני סטינגר, שחקן מיינקראפט מנוסה עם למעלה מ-10 שנות ניסיון במשחק. אני מאמין בכל ליבי שהמשחק הוא כלי למידה מדהים, שמאפשר לילדים ללמוד בדרך חווייתית ומהנה.
            </p>
            <p className="text-gray-300 leading-relaxed">
              דרך מיינקראפט, התלמידים מפתחים כישורים חברתיים, משפרים את יכולת הדיבור והתקשורת, ולומדים לעבוד בשיתוף פעולה. הלמידה החווייתית מאפשרת להם להבין מושגים מורכבים בצורה טבעית וזורמת, תוך כדי הנאה אמיתית מהתהליך.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About; 