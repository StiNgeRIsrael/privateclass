import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const WHATSAPP_BASE = 'https://wa.me/972542347000?text=';

const CheckoutResult: React.FC = () => {
  const [search] = useSearchParams();
  const status = search.get('status');
  const [customerData, setCustomerData] = useState<any>(null);

  useEffect(() => {
    // קריאת פרטי הלקוח מה-localStorage
    const storedData = localStorage.getItem('customerData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setCustomerData(parsedData);
      } catch (error) {
        console.error('שגיאה בקריאת פרטי הלקוח:', error);
      }
    }
  }, []);

  if (status === 'cancel') {
    return (
      <div dir="rtl" className="min-h-screen bg-[#1a1a1a] pt-28">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-handjet text-red-500 mb-4">התשלום בוטל</h1>
          <p className="text-gray-300 mb-6">אפשר לחזור למסלולים ולנסות שוב, או ליצור קשר בוואטסאפ.</p>
          <div className="flex gap-3 justify-center">
            <a href="/class/checkout" className="minecraft-button">חזרה למסלולים</a>
            <a href="https://wa.me/972542347000" className="minecraft-button bg-transparent text-green-500">וואטסאפ</a>
          </div>
        </div>
      </div>
    );
  }

  // דף התודה הסופי אחרי אישור התשלום
  return (
    <div dir="rtl" className="min-h-screen bg-[#1a1a1a] pt-28">
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="minecraft-card max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-8 h-8 bg-green-500 text-black rounded-full font-bold text-lg mb-4">3</div>
          <h1 className="text-4xl font-handjet text-green-500 mb-6">תודה שרכשתם! 🎉</h1>
          <p className="text-xl text-gray-200 mb-8 leading-relaxed">
            אנא צרו איתנו קשר בוואטסאפ בצירוף שמכם כדי לתאם את השיעור הבא שלכם
          </p>
          {customerData && (
            <div className="bg-[#2a2a2a] p-4 rounded mb-6 text-right">
              <p className="text-gray-300 mb-2">פרטי הרכישה:</p>
              <p className="text-green-400 font-semibold">{customerData.planName} - {customerData.planAmount} ₪</p>
              {customerData.parentName && (
                <p className="text-gray-300 text-sm">שם: {customerData.parentName}</p>
              )}
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href={`${WHATSAPP_BASE}${encodeURIComponent('שלום! רכשתי שיעור/ים ואשמח לתאם את השיעור הבא. שמי: ')}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="minecraft-button text-lg px-8 py-4 bg-green-600 hover:bg-green-700"
            >
              📱 פתח וואטסאפ לתיאום שיעור
            </a>
          </div>
          <p className="text-sm text-gray-400 mt-6">
            מספר הטלפון שלנו: 054-234-7000
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutResult;


