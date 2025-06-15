import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  delay: number;
}

const FAQ: React.FC = () => {
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

  const faqs: FAQItem[] = [
    {
      question: "מה כולל שיעור פרטי במיינקראפט?",
      answer: "כל שיעור נמשך 60 דקות וכולל למידה מעשית דרך המשחק, התאמה אישית לרמה של התלמיד, ליווי צמוד, ותמיכה בין השיעורים. השיעורים מתמקדים בפיתוח מיומנויות חשיבה, יצירתיות, ושיתוף פעולה, תוך שיפור האנגלית באופן טבעי.",
      delay: 0,
    },
    {
      question: "איך מתאימים את השיעור לרמה של התלמיד?",
      answer: "בשיעור הראשון נערוך שיחה מקדימה להבנת הצרכים והיעדים, ונבנה תוכנית לימודים מותאמת אישית. התוכנית מתעדכנת באופן שוטף בהתאם להתקדמות ודרך הלמידה האופטימלית לכל תלמיד.",
      delay: 100,
    },
    {
      question: "האם צריך ידע מוקדם במיינקראפט?",
      answer: "לא, השיעורים מתאימים לכל הרמות - ממתחילים ועד מתקדמים. אנחנו מתחילים מהבסיס ומתקדמים בקצב המתאים לכל תלמיד.",
      delay: 200,
    },
    {
      question: "איך מתבצעים השיעורים?",
      answer: "השיעורים מתבצעים באופן מקוון, דרך פלטפורמה ייעודית. כל מה שצריך הוא מחשב עם חיבור לאינטרנט, מיקרופון, והתקנת מיינקראפט.",
      delay: 300,
    },
    {
      question: "מתי מתקיימים השיעורים?",
      answer: "השיעורים מתקיימים בעיקר בשעות הערב, בהתאם ללוח הזמנים של התלמיד והמורה. ניתן לתאם שיעורים גם בסופי שבוע.",
      delay: 400,
    },
    {
      question: "האם אפשר לקבוע שיעור ניסיון?",
      answer: "כן, אנחנו מציעים שיעור ניסיון ראשון במחיר מיוחד. זה הזדמנות מצוינת להכיר את השיטה ולהתנסות בלמידה דרך משחק.",
      delay: 500,
    }
  ];

  return (
    <section id="faq" className="py-16 bg-[#1a1a1a] overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-handjet text-center mb-12 text-green-500">שאלות נפוצות</h2>
        
        <div 
          ref={sectionRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto"
        >
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`minecraft-card transition-all duration-700 transform hover:scale-105 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
              style={{ 
                transitionDelay: `${faq.delay}ms`,
                transform: `rotate(${Math.random() * 4 - 2}deg)`
              }}
            >
              <div className="p-6">
                <h3 className="text-xl font-handjet mb-4 text-green-500">{faq.question}</h3>
                <p className="text-gray-300">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a 
            href="https://wa.me/972542347000" 
            target="_blank"
            rel="noopener noreferrer"
            className="minecraft-button inline-flex items-center"
          >
            יש לך שאלה נוספת? צור קשר בוואטסאפ
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQ;