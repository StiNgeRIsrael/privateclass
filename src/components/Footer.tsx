import React from 'react';
import { Mail, Phone, MapPin, Instagram, Youtube, MessageCircle } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1a1a1a] text-gray-300 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-handjet text-green-500 mb-4">סטינגר ישראל</h3>
            <p className="text-sm">
              שיעורים פרטיים במיינקראפט עם יוטיובר מוביל. למידה חווייתית, שיפור אנגלית ופיתוח כישורים דיגיטליים בשיעור אחד על אחד.
            </p>
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <a href="https://instagram.com/stingerisrael" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-500 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://youtube.com/@סטינגר" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-500 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="https://wa.me/972542347000" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-500 transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-handjet text-green-500 mb-4">קישורים מהירים</h3>
            <ul className="space-y-2">
              <li>
                <a href="#about" className="text-gray-400 hover:text-green-500 transition-colors">עליי</a>
              </li>
              <li>
                <a href="#benefits" className="text-gray-400 hover:text-green-500 transition-colors">יתרונות</a>
              </li>
              <li>
                <a href="#pricing" className="text-gray-400 hover:text-green-500 transition-colors">מחירים</a>
              </li>
              <li>
                <a href="#faq" className="text-gray-400 hover:text-green-500 transition-colors">שאלות נפוצות</a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-handjet text-green-500 mb-4">צור קשר</h3>
            <div className="space-y-2">
              <p className="flex items-center text-gray-400">
                <Phone className="w-5 h-5 ml-2" />
                054-2347000
              </p>
              <p className="text-sm text-gray-500">שעות פעילות: בעיקר בשעות הערב</p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} סטינגר ישראל. כל הזכויות שמורות.
            </p>
            <div className="flex items-center space-x-4 rtl:space-x-reverse text-sm text-gray-500">
              <span>אתר נעשה באמצעות</span>
              <a 
                href="https://marketing.stingerisrael.co.il" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-green-500 hover:text-green-400 transition-colors"
              >
                סטינגר שיווק
              </a>
            </div>
          </div>

          {/* SEO Content */}
          <div className="mt-8 text-xs text-gray-600 space-y-2">
            <p>
              שיעורים פרטיים במיינקראפט עם יוטיובר מוביל בישראל. למידה חווייתית דרך משחק, שיפור אנגלית ופיתוח כישורים דיגיטליים. שיעורים מותאמים אישית, אחד על אחד, עם מורה מנוסה עם למעלה מ-10 שנות ניסיון. מורה פרטי למיינקראפט לילדים, שיעורי מיינקראפט אונליין, לימוד מיינקראפט דרך משחק.
            </p>
            <p>
              מיינקראפט | שיעורים פרטיים | לימוד אנגלית | למידה חווייתית | יוטיובר | שיעורים אונליין | מורה פרטי למיינקראפט | שיעורי מיינקראפט | לימוד דרך משחק | מיינקראפט לילדים | שיעורי מיינקראפט ישראל | מורה מיינקראפט | מיינקראפט חינוכי | שיעורים פרטיים מיינקראפט
            </p>
            <p>
              שיעורי מיינקראפט פרטיים עם סטינגר ישראל - מורה מנוסה עם 10+ שנות ניסיון. שיעורים מותאמים אישית לילדים מגיל 6-14, למידה חווייתית דרך משחק, שיפור אנגלית טבעי, ופיתוח כישורים דיגיטליים וחברתיים. שיעורים אונליין דרך דיסקורד, זמנים גמישים, מחירים משתלמים.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;