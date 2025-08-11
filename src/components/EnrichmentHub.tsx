import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { ENRICHMENT_LINKS } from '../data/enrichmentLinks';

const EnrichmentHub: React.FC = () => {
  return (
    <section className="bg-[#111] text-gray-200 py-16 border-t border-green-700/30 scroll-mt-20" id="enrichment">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-handjet text-green-500 mb-6 text-center">העשרה</h2>
        <p className="text-center text-gray-400 max-w-2xl mx-auto mb-10 font-rubik">
          תכנים משלימים ומעמיקים לנושא. הקלקה תפתח עמוד עם פירוט מלא.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ENRICHMENT_LINKS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="group block rounded-xl bg-[#1b1b1b] hover:bg-[#202020] transition-colors border border-green-700/30 hover:border-green-500/60 p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg md:text-xl font-rubik text-white mb-1">{item.label}</h3>
                  {item.description && (
                    <p className="text-sm text-gray-400 font-rubik">{item.description}</p>
                  )}
                </div>
                <ChevronLeft className="w-5 h-5 text-gray-400 group-hover:text-green-400 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EnrichmentHub;


