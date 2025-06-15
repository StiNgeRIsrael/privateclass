import React from 'react';

const StingerProfile: React.FC = () => {
  return (
    <section id="stinger" className="py-16 relative bg-[#1a1a1a]">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-handjet text-center mb-12 text-green-500">
          אריאל "סטינגר"
        </h2>
        
        <div className="minecraft-card max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-48 h-48 relative">
              <img 
                src="https://stingerisrael.co.il/picture_library/YouTuber.webp" 
                alt="סטינגר" 
                className="w-full h-full object-cover minecraft-border"
              />
              <div className="absolute -bottom-2 -right-2 bg-green-500 text-white px-4 py-1 font-handjet text-sm">
                יוטיובר
              </div>
            </div>
            
            <div className="flex-1 text-right">
              <h3 className="text-2xl font-handjet text-green-500 mb-4">
                על סטינגר
              </h3>
              <p className="text-gray-300 mb-4 leading-relaxed">
                אריאל "סטינגר" הוא יוטיובר מוביל בתחום המיינקראפט בישראל, עם ניסיון של שנים בהדרכת שחקנים צעירים.
                דרך השיעורים הפרטיים שלו, הוא מלמד את התלמידים לא רק איך לשחק, אלא גם איך לפתח חשיבה אסטרטגית,
                עבודת צוות, ופתרון בעיות - כל זאת תוך הנאה והתקדמות משמעותית במשחק.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="minecraft-card p-4 text-center">
                  <div className="text-green-500 font-handjet text-sm mb-2">ניסיון</div>
                  <div className="text-2xl font-handjet">5+ שנים</div>
                </div>
                <div className="minecraft-card p-4 text-center">
                  <div className="text-green-500 font-handjet text-sm mb-2">תלמידים</div>
                  <div className="text-2xl font-handjet">1000+</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Recommendation */}
        <div className="minecraft-card max-w-4xl mx-auto mt-8">
          <div className="text-center mb-4">
            <h3 className="text-2xl font-handjet text-green-500">המלצה מובילה</h3>
          </div>
          <div className="text-right">
            <p className="text-gray-300 mb-4 leading-relaxed">
              "מצאתי את סטינגר אחרי חיפושים רבים אחרי מורה פרטי לילד שלי בנושא של מודים למיינקראפט. מצאתי את האתר הפרלמנטום וקבעתי שיעור נסיון. כבר באותו שיעור סטינגר נתן לו את הדרך להתקין mods תוך הסבר התהליך בצורה ברורה. אהבתי את הדרך בה התחבר לדניאל ודיבר איתו בגובה העיניים. השיעור היה ממוקד ומלמד אז קבענו סדרה שבה דניאל הכיר איך להתחבר לשרתים שונים וטריקים של משחק. הוא מאוד נהנה מהשיעורים ואף ביקש שאקח עוד סדרת שיעורים נוספת כמתנה ליום הולדת 8.
              אני מעריכה שסטינגר פתח כזה שרות שמאוד מקל על העניין להורים ולילדים ועוזר להכנס לדברים יותר מורכבים בעולם המיינקראפט."
            </p>
            <div className="text-green-500 font-handjet">
              אליזבת', אמא של דניאל
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StingerProfile; 