import React, { useState, useEffect, useRef } from 'react';
import { Brain, Gamepad2, Users, Sparkles, BookOpen, Trophy } from 'lucide-react';

interface Benefit {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

const Benefits: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const benefits: Benefit[] = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "עבודת צוות ותקשורת",
      description: "בפרויקטים משותפים ילדכם לומד להסביר רעיון בבירור, להקשיב לאחרים ולחלק משימות באופן הוגן. בשיעור אנחנו מתרגלים תיאום ציפיות, אחריות אישית ושפה מכבדת סביב משימה קצרה (כמו הקמת בסיס משותף). התוצאה ניכרת גם בבית ובכיתה: פחות ‘מי עושה מה’ ויותר שיתוף פעולה, יוזמה והובלת משימות קטנות בביטחון.",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "חשיבה לוגית ופתרון בעיות",
      description: "מנגנוני רדסטון ותרגולי דיבוג מלמדים את ילדכם לחשוב צעד-אחר-צעד ולקבל החלטות מושכלות. כשדלת לא נפתחת או שהחווה לא מייצרת, אנחנו מפרקים את הבעיה, בודקים אפשרויות ומיישמים פתרון. כך מתגבשת גישה של ‘מצאתי דרך’ במקום ‘נתקעתי’, והאמון העצמי להתמודד עם משימות מאתגרות הולך וגדל.",
      color: "from-purple-500 to-blue-500",
    },
    {
      icon: <Gamepad2 className="w-8 h-8" />,
      title: "ריכוז והתמדה בלמידה שמרגישה כמו משחק",
      description: "עובדים בספרינטים קצרים עם יעד ברור ותוצר מוחשי, תוך הפסקות יזומות שמונעות עומס. המודל הזה מאריך בהדרגה את טווח הקשב של ילדכם, מחדד את היכולת לסיים משימות ומייצר הרגלי עבודה יעילים. ברוב המקרים תראו רווח גם בבית-הספר: יותר מיקוד בשיעורי בית, פחות דחיינות, ועמידה בזמנים.",
      color: "from-green-500 to-teal-500",
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "ביטחון עצמי ומסוגלות",
      description: "רצף הצלחות קטנות יוצר תחושת ‘אני יכול’. משלב התכנון ועד להצגת התוצר, ילדכם חווה התקדמות ממשית ומקבל פידבק בונה שמכוון למאמץ ולתהליך—not רק לתוצאה. כך מתפתח אומץ לנסות דברים חדשים, להתגבר על תסכולים קטנים ולהביא יותר יוזמה לבית ולכיתה.",
      color: "from-indigo-500 to-purple-500",
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "אנגלית שימושית דרך המשחק",
      description: "במהלך השיעור מחפשים מידע ב‑Wiki, קוראים מדריכים קצרים וצופים בהסברים—ואז מיישמים אותם מיד במשחק. זו אנגלית פרקטית שחושפת את ילדכם לאוצר מילים טכני ולקריאה מדויקת של הוראות. כשהידע הופך לתוצר, הלמידה נטמעת, והביטחון בשימוש באנגלית עולה בלי מאמץ מיותר.",
      color: "from-blue-500 to-indigo-500",
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "יצירתיות ועיצוב עולמות",
      description: "ילדכם מתכנן ומעצב סביבות שמבטאות טעם אישי ודמיון—מהסקיצה הראשונית ועד בחירת חומרים, סימטריה וקומפוזיציה. מעבר להנאה, זהו אימון בתכנון אסתטי ובחשיבה מקורית, שמחזק גאווה בתוצר ומעודד הצגת עבודה מסודרת בפני המשפחה או הכיתה.",
      color: "from-pink-500 to-red-500",
    },
  ];

  return (
    <section id="benefits" className="py-16 bg-[#1a1a1a] scroll-mt-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-handjet text-center mb-12 text-green-500">יתרונות שיעורי מיינקראפט</h2>
        <h3 className="text-xl font-handjet text-center mb-4 text-green-400">למה לבחור בשיעורים פרטיים במיינקראפט?</h3>
        <p className="text-gray-300 leading-relaxed text-justify max-w-prose mx-auto mb-10">
          במסגרת שיעור פרטי אחד-על-אחד, מיינקראפט הופך מזמן מסך לעבודה ממוקדת עם מטרות ברורות ותוצרים מוחשיים. דרך פרויקטים קטנים וצעד-אחר-צעד, ילדכם מתרגל לתכנן, להתמיד, לפתור בעיות ולהציג את העבודה שלו בגאווה. עבורכם כהורים זה אומר תהליך מדיד ושקוף: רואים את ההתקדמות, מבינים מה תרגלנו בכל מפגש, ומקבלים הרגלי למידה שנשארים גם אחרי שהמחשב נכבה.
        </p>
        
        <div 
          ref={sectionRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className={`minecraft-card transition-all duration-700 transform ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="p-6">
                <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${benefit.color} flex items-center justify-center mb-4`}>
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-handjet mb-2 text-green-500">{benefit.title}</h3>
                <p className="text-gray-300">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;