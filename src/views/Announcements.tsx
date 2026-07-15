/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../components/LanguageContext';
import { localDb } from '../services/db';
import { AnnouncementItem } from '../types';
import { Megaphone, AlertCircle, Calendar, Printer, Search } from 'lucide-react';

export default function Announcements() {
  const { language } = useLanguage();
  const [anns, setAnns] = useState<AnnouncementItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAnns = async () => {
      const data = await localDb.getAnnouncements();
      setAnns(data);
    };
    fetchAnns();
  }, []);

  const filtered = anns.filter(a => 
    a.titleAr.includes(searchTerm) || 
    a.titleFr.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="font-sans text-gray-800 bg-white min-h-[80vh]">
      
      {/* Banner */}
      <section className="bg-amber-500 text-white py-16 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-3xl sm:text-4xl font-black font-sans tracking-tight">
            {language === 'ar' ? 'البلاغات والإعلانات الرسمية' : 'Communiqués & Alertes Officielles'}
          </h1>
          <p className="text-sm text-amber-50 max-w-2xl mx-auto mt-2 font-medium font-sans">
            {language === 'ar' 
              ? 'تابع التنبيهات، نداءات الاستغاثة الطارئة، وإعلانات حملات التضامن الصادرة عن اللجنة الولائية بسيدي بلعباس.' 
              : 'Retrouvez tous les communiqués administratifs, les convocations de bénévoles et les alertes d\'urgence.'}
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 relative max-w-sm">
          <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder={language === 'ar' ? 'البحث في البلاغات...' : 'Rechercher un communiqué...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-xl text-xs"
          />
        </div>

        <div className="space-y-6">
          {filtered.map((item) => {
            const isUrgent = item.priority === 'high' || item.priority === 'critical';
            return (
              <div 
                key={item.id} 
                className={`p-6 md:p-8 rounded-3xl border transition-all duration-200 flex flex-col justify-between ${
                  isUrgent 
                    ? 'bg-red-50/40 border-red-100 shadow-xs' 
                    : 'bg-white border-gray-100 shadow-xs'
                }`}
              >
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      isUrgent ? 'bg-red-600 text-white animate-pulse' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {item.priority === 'critical' ? (language === 'ar' ? 'عاجل جداً' : 'Critique') :
                       item.priority === 'high' ? (language === 'ar' ? 'هام' : 'Urgent') :
                       (language === 'ar' ? 'إعلان عادي' : 'Standard')}
                    </span>
                    <span className="text-gray-400 font-mono text-xs flex items-center gap-1">
                      <Calendar size={12} /> {item.date}
                    </span>
                  </div>

                  <h3 className="font-bold text-gray-950 text-base sm:text-lg lg:text-xl font-sans mb-3 leading-snug">
                    {language === 'ar' ? item.titleAr : item.titleFr}
                  </h3>

                  <p className="text-sm text-gray-600 leading-relaxed font-sans whitespace-pre-wrap">
                    {language === 'ar' ? item.contentAr : item.contentFr}
                  </p>
                </div>

                <div className="border-t border-gray-100/60 pt-4 mt-6 flex justify-between items-center">
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-600 font-bold transition-colors cursor-pointer"
                  >
                    <Printer size={12} />
                    <span>{language === 'ar' ? 'نسخة قابلة للطباعة' : 'Version imprimable'}</span>
                  </button>
                  <span className="text-[10px] text-gray-400 font-mono">ID: {item.id}</span>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center py-20 text-gray-400 text-sm font-sans">
              {language === 'ar' ? 'لا توجد إعلانات منشورة مطابقة للبحث حالياً.' : 'Aucun communiqué trouvé.'}
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
