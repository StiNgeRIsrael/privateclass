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
      icon: <Brain className="w-8 h-8" />,
      title: "למידה חווייתית",
      description: "למידה דרך התנסות מעשית במשחק, המאפשרת הבנה עמוקה וטובה יותר של המושגים",
      color: "from-purple-500 to-blue-500",
    },
    {
      icon: <Gamepad2 className="w-8 h-8" />,
      title: "פיתוח מיומנויות",
      description: "פיתוח יכולות חשיבה, פתרון בעיות ותכנון דרך משחק מהנה ומאתגר",
      color: "from-green-500 to-teal-500",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "למידה חברתית",
      description: "פיתוח כישורים חברתיים ותקשורתיים דרך שיתוף פעולה בפרויקטים משותפים",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "יצירתיות",
      description: "עידוד חשיבה יצירתית וחדשנית דרך בנייה חופשית ופרויקטים אישיים",
      color: "from-pink-500 to-red-500",
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "שיפור אנגלית",
      description: "למידת אנגלית באופן טבעי דרך משחק, שיחה והתנסות מעשית",
      color: "from-blue-500 to-indigo-500",
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "הצלחה והעצמה",
      description: "חיזוק הביטחון העצמי והמוטיבציה דרך הישגים והצלחות במשחק",
      color: "from-indigo-500 to-purple-500",
    },
  ];

  return (
    <section id="benefits" className="py-16 bg-[#1a1a1a]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-handjet text-center mb-12 text-green-500">יתרונות שיעורי מיינקראפט</h2>
        <h3 className="text-xl font-handjet text-center mb-8 text-green-400">למה לבחור בשיעורים פרטיים במיינקראפט?</h3>
        
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