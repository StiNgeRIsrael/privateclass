import React, { useState, useEffect, useRef } from 'react';
import { Check } from 'lucide-react';
// @ts-ignore
declare const fbq: any;

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
    <section id="pricing" className="py-16 bg-[#1a1a1a] scroll-mt-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-handjet text-center mb-12 text-green-500">מחירון שיעורי מיינקראפט</h2>
        <h3 className="text-xl font-handjet text-center mb-8 text-green-400">תוכניות לימוד מותאמות אישית</h3>
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
                  href="https://wa.me/972542347000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="minecraft-button w-full text-center block mt-auto"
                  onClick={() => {
                    fbq && fbq('track', 'Contact');
                    fbq && fbq('trackCustom', 'PackageClick', {
                      value: pkg.totalPrice,
                      currency: 'ILS',
                      lessons: pkg.lessons,
                      name: pkg.name
                    });
                  }}
                >
                  התחל עכשיו
                </a>
              </div>
            </div>
          ))}
        </div>
        
        {/* הצעה מותאמת אישית */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="minecraft-card p-8 text-center border-2 border-green-500">
            <h3 className="text-2xl font-handjet mb-4 text-green-500">צרכים משהו אחר?</h3>
            <p className="text-gray-300 mb-6 text-lg">
              סשן ארוך יותר? תוכנית לתקופה מתמשכת או אפילו מפגש אישי פנים מול פנים? דברו איתנו ונבנה יחד פתרון מותאם במיוחד עבורכם
            </p>
            <a
              href="https://wa.me/972542347000"
              target="_blank"
              rel="noopener noreferrer"
              className="minecraft-button inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-handjet"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.151-.174.2-.298.3-.497.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.007-.372-.009-.571-.009-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.099 3.205 5.077 4.372.709.306 1.262.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.617h-.001a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.999-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.991c-.003 5.45-4.437 9.884-9.88 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .06 5.435.058 12.088c0 2.137.56 4.223 1.623 6.067L.057 24l6.064-1.591a11.93 11.93 0 0 0 5.929 1.515h.005c6.554 0 11.989-5.435 11.991-12.088a11.86 11.86 0 0 0-3.501-8.434"/></svg>
              דברו איתנו בוואטסאפ
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;