import React, { useEffect, useState } from 'react';
import { CheckCircle, Heart, Star, Trophy } from 'lucide-react';
import { sendToWebhook } from '../data/database';

const CheckoutResult: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [webhookSent, setWebhookSent] = useState(false);

  useEffect(() => {
    // שליחת וובהוק אוטומטית
    const sendWebhook = async () => {
      try {
        // קבלת הנתונים מ-localStorage
        const customerData = JSON.parse(localStorage.getItem('customerData') || '{}');
        const paymentData = JSON.parse(localStorage.getItem('paymentData') || '{}');
        
        if (customerData.parent_name && paymentData.plan_name) {
          await sendToWebhook(customerData, paymentData);
          setWebhookSent(true);
          
          // ניקוי localStorage
          localStorage.removeItem('customerData');
          localStorage.removeItem('paymentData');
        }
      } catch (error) {
        console.error('שגיאה בשליחת וובהוק:', error);
      } finally {
        setIsLoading(false);
      }
    };

    sendWebhook();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-gray-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-white text-xl">מעבד את התשלום שלך...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-gray-900 to-blue-900 py-20">
      <div className="max-w-4xl mx-auto px-4">
        {/* כרטיס תודה ראשי */}
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-12 border border-gray-600/50 shadow-2xl text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mb-8 shadow-lg">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-5xl font-bold text-white mb-4">תודה לך! 🎉</h1>
          <p className="text-2xl text-gray-300 mb-8">
            התשלום שלך התקבל בהצלחה
          </p>
          
          {webhookSent && (
            <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-6 mb-8">
              <div className="flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-400 mr-3" />
                <span className="text-green-300 text-lg">
                  הפרטים שלך נשלחו בהצלחה! נציג יצור איתך קשר בקרוב
                </span>
              </div>
            </div>
          )}
        </div>

        {/* כרטיסי מידע */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-gray-600/30 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full mb-4">
              <Heart className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">השיעור הראשון</h3>
            <p className="text-gray-300">
              נציג יצור איתך קשר תוך 24 שעות לתאם את השיעור הראשון
            </p>
          </div>

          <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-gray-600/30 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
              <Star className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">הכנה לשיעור</h3>
            <p className="text-gray-300">
              וודא שהילד/ה מוכן/ה לשיעור עם מיינקראפט פתוח
            </p>
          </div>

          <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-gray-600/30 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500/20 rounded-full mb-4">
              <Trophy className="w-8 h-8 text-yellow-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">התקדמות</h3>
            <p className="text-gray-300">
              אחרי כל שיעור תקבל דוח התקדמות מפורט
            </p>
          </div>
        </div>

        {/* כפתור חזרה לאתר */}
        <div className="text-center">
          <a
            href="/"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg"
          >
            חזרה לאתר הראשי
          </a>
        </div>
      </div>
    </div>
  );
};

export default CheckoutResult;


