import React from 'react';
import { Mail, Phone, MapPin, Send, Instagram, Youtube, MessageCircle } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-16 bg-[#1a1a1a]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-handjet text-center mb-12 text-green-500">צור קשר - שיעורי מיינקראפט</h2>
        <h3 className="text-xl font-handjet text-center mb-8 text-green-400">קבל שיעור ניסיון או שאל שאלות</h3>

        <div className="max-w-4xl mx-auto">
          <div className="minecraft-card p-8 text-center">
            <h3 className="text-2xl font-handjet mb-6 text-green-500">בואו נדבר!</h3>
            
            <p className="text-gray-300 mb-8">
              יש לכם שאלות או רוצים לקבוע שיעור? צרו איתי קשר דרך אחד הערוצים הבאים:
            </p>

            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <a
                href="https://wa.me/972542347000"
                target="_blank"
                rel="noopener noreferrer"
                className="minecraft-button flex items-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                וואטסאפ
              </a>
            </div>

            <div className="flex justify-center gap-4 mb-10">
              <a
                href="https://instagram.com/stingerisrael"
                target="_blank"
                rel="noopener noreferrer"
                className="relative w-14 h-14 rounded-full shadow-lg flex items-center justify-center overflow-hidden group transition-all duration-300 ease-in-out hover:transform hover:scale-110 hover:shadow-xl"
                style={{ backgroundColor: 'rgb(228, 64, 95)' }}
              >
                <Instagram className="w-6 h-6 text-white/90 transition-all duration-300 group-hover:text-white group-hover:scale-110" />
              </a>

              <a
                href="https://tiktok.com/@stingeril"
                target="_blank"
                rel="noopener noreferrer"
                className="relative w-14 h-14 rounded-full shadow-lg flex items-center justify-center overflow-hidden group transition-all duration-300 ease-in-out hover:transform hover:scale-110 hover:shadow-xl"
                style={{ backgroundColor: 'rgb(0, 0, 0)' }}
              >
                <svg className="w-6 h-6 text-white/90 transition-all duration-300 group-hover:text-white group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>

              <a
                href="https://youtube.com/@סטינגר"
                target="_blank"
                rel="noopener noreferrer"
                className="relative w-14 h-14 rounded-full shadow-lg flex items-center justify-center overflow-hidden group transition-all duration-300 ease-in-out hover:transform hover:scale-110 hover:shadow-xl"
                style={{ backgroundColor: 'rgb(255, 0, 0)' }}
              >
                <Youtube className="w-6 h-6 text-white/90 transition-all duration-300 group-hover:text-white group-hover:scale-110" />
              </a>

              <a
                href="https://whatsapp.com/channel/0029VajqUL25kg79bdWKVS0z"
                target="_blank"
                rel="noopener noreferrer"
                className="relative w-14 h-14 rounded-full shadow-lg flex items-center justify-center overflow-hidden group transition-all duration-300 ease-in-out hover:transform hover:scale-110 hover:shadow-xl"
                style={{ backgroundColor: 'rgb(37, 211, 102)' }}
              >
                <MessageCircle className="w-6 h-6 text-white/90 transition-all duration-300 group-hover:text-white group-hover:scale-110" />
              </a>

              <a
                href="https://stingerisrael.co.il/discord"
                target="_blank"
                rel="noopener noreferrer"
                className="relative w-14 h-14 rounded-full shadow-lg flex items-center justify-center overflow-hidden group transition-all duration-300 ease-in-out hover:transform hover:scale-110 hover:shadow-xl"
                style={{ backgroundColor: 'rgb(114, 137, 218)' }}
              >
                <svg className="w-6 h-6 text-white/90 transition-all duration-300 group-hover:text-white group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </a>
            </div>

            <div className="text-gray-300">
              <p className="mb-2">שעות פעילות: בעיקר בשעות הערב</p>
              <p>טלפון: 054-2347000</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
