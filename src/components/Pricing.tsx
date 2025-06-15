import React, { useState, useEffect, useRef } from 'react';
import { Check } from 'lucide-react';

interface PricingPackage {
  name: string;
  price: number;
  totalPrice: number;
  lessons: number;
  features: string[];
  recommended?: boolean;
}

const Pricing: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
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
  }, []);

  const packages: PricingPackage[] = [
    {
      name: "שיעור בודד",
      price: 180,
      totalPrice: 180,
      lessons: 1,
      features: [
        "שיעור פרטי אחד",
        "התאמה אישית לרמה",
        "נושא אחד לבחירה",
        "ליווי צמוד",
        "תמיכה בין השיעורים",
        "שיפור אנגלית תוך כדי",
      ],
    },
    {
      name: "חבילת 3 שיעורים",
      price: 160,
      totalPrice: 480,
      lessons: 3,
      features: [
        "שלושה שיעורים פרטיים",
        "התאמה אישית לרמה",
        "נושאים מגוונים",
        "ליווי צמוד",
        "תמיכה בין השיעורים",
        "שיפור אנגלית תוך כדי",
      ],
    },
    {
      name: "חבילת 5 שיעורים",
      price: 140,
      totalPrice: 700,
      lessons: 5,
      features: [
        "חמישה שיעורים פרטיים",
        "התאמה אישית לרמה",
        "נושאים מגוונים",
        "ליווי צמוד",
        "תמיכה בין השיעורים",
        "שיפור אנגלית תוך כדי",
      ],
      recommended: true,
    },
  ];

  return (
    <section id="pricing" className="py-16 bg-[#1a1a1a]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-handjet text-center mb-12 text-green-500">תוכניות לימוד</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packages.map((pkg, index) => (
            <div
              key={index}
              ref={cardRef}
              className={`minecraft-card transition-all duration-700 transform ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              } ${pkg.recommended ? 'border-2 border-green-500 scale-105 z-10' : ''}`}
            >
              {pkg.recommended && (
                <div className="absolute -top-4 right-4 bg-green-500 text-white px-4 py-1 rounded-full text-sm font-handjet">
                  מומלץ
                </div>
              )}
              <div className="p-6 h-full flex flex-col">
                <h3 className="text-2xl font-handjet mb-4 text-green-500">{pkg.name}</h3>
                <div className="mb-6">
                  <div className="flex items-baseline justify-end">
                    <span className="text-4xl font-handjet text-gray-200">{pkg.price}₪</span>
                    <span className="text-gray-400 mr-2">לשיעור</span>
                  </div>
                  <div className="text-right mt-2">
                    <span className="text-gray-300">סה"כ: </span>
                    <span className="text-xl font-handjet text-green-500">{pkg.totalPrice}₪</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-8 flex-grow">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-300">
                      <Check className="w-5 h-5 text-green-500 ml-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="#contact"
                  className="minecraft-button w-full text-center block mt-auto"
                >
                  התחל עכשיו
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;