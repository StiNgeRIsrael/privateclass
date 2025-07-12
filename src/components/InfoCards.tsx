import React, { useEffect, useRef } from 'react';
import { User, Compass, Clock, Calendar } from 'lucide-react';

interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

const InfoCard: React.FC<InfoCardProps> = ({ icon, title, description, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('opacity-100', 'translate-y-0');
          }, index * 100);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, [index]);

  return (
    <div
      ref={cardRef}
      className="minecraft-card transition-all duration-700 opacity-0 translate-y-10 transform hover:shadow-xl hover:-translate-y-1 text-right"
    >
      <div className="text-green-500 mb-4">{icon}</div>
      <h3 className="text-xl font-handjet mb-3 text-green-500">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );
};

const InfoCards: React.FC = () => {
  const infoCards = [
    {
      icon: <User size={40} />,
      title: "למי?",
      description:
        "השיעור מיועד לילדים מגיל 6 ועד 14, אך בתכלס, ילדים מתחת שמוגדרים מתקדמים, או ילדים מעל שעדיין מעוניינים בשירות, יכולים כולם להנות מן השיעור הפרטי.",
    },
    {
      icon: <Compass size={40} />,
      title: "איפה?",
      description:
        "שיעור בגיימינג מבוצע בפלטפורמת הדיבור של הגיימרים: \"דיסקורד\". הפלטפורמה הינה חינמית לגמרי, נוחה ולגמרי מותאמת לצרכי השיעור. השיעור יתקיים בשרת הדיסקורד של הפרלמנטום",
    },
    {
      icon: <Clock size={40} />,
      title: "מתי?",
      description:
        "השיעור מתקיים בזמנים גמישים, בהתאם ללוח הזמנים של התלמיד. ניתן לקבוע שיעור בשעות אחר הצהריים, בערב או בסוף שבוע, כך שתוכל למצוא את הזמן הנוח ביותר עבורך ועבור ילדך.",
    },
    {
      icon: <Calendar size={40} />,
      title: "מה?",
      description:
        "התוכן של השיעור מותאם אישית לכל שחקן, כך שהילד שלך יקבל חווית למידה שמתאימה לרמה ולתחומי העניין שלו; בין אם זה בבניית מבנים מורכבים, הבנה של מכניקות המשחק או שיפור באסטרטגיות משחק.",
    },
  ];

  return (
    <section id="info" className="py-16 bg-[#1a1a1a]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-handjet text-center mb-12 text-green-500">שיעורי מיינקראפט - מידע על השיעור הפרטי</h2>
        <h3 className="text-xl font-handjet text-center mb-8 text-green-400">איך מתנהלים שיעורי מיינקראפט אונליין?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {infoCards.map((card, index) => (
            <InfoCard
              key={index}
              icon={card.icon}
              title={card.title}
              description={card.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default InfoCards;