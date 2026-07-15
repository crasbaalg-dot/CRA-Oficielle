/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../components/LanguageContext';
import { localDb } from '../services/db';
import { BloodCampaign } from '../types';
import { Calendar, Clock, MapPin, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export default function Events() {
  const { language } = useLanguage();
  const [camps, setCamps] = useState<BloodCampaign[]>([]);

  useEffect(() => {
    const fetchCamps = async () => {
      const data = await localDb.getBloodCampaigns();
      setCamps(data);
    };
    fetchCamps();
  }, []);

  return (
    <div className="font-sans text-gray-800 bg-white min-h-[80vh]">
      
      {/* Banner */}
      <section className="bg-red-600 text-white py-16 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-3xl sm:text-4xl font-black font-sans tracking-tight">
            {language === 'ar' ? 'الفعاليات والأجندة الإنسانية' : 'Agenda des Événements & Activités'}
          </h1>
          <p className="text-sm text-red-100 max-w-2xl mx-auto mt-2 font-medium font-sans">
            {language === 'ar' 
              ? 'تاريخ ومواقع حملات التبرع بالدم، الدورات التكوينية، والقوافل الطبية القادمة للجنة سيدي بلعباس.' 
              : 'Découvrez les dates et lieux de nos prochaines interventions de solidarité et d\'urgence.'}
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Dynamic event list divided into upcoming and completed */}
        <div className="space-y-12">
          
          <div>
            <h2 className="text-2xl font-black text-gray-950 font-sans border-b border-gray-100 pb-3 mb-8 flex items-center gap-2">
              <Sparkles className="text-red-500 animate-pulse w-5 h-5" />
              <span>{language === 'ar' ? 'الفعاليات المجدولة القادمة' : 'Prochains Événements de la Semaine'}</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {camps.filter(c => c.status !== 'completed').map((event) => (
                <div key={event.id} className="bg-white p-6 md:p-8 rounded-3xl border border-red-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="space-y-4">
                    <span className="px-2.5 py-0.5 bg-red-50 text-red-600 text-[10px] font-bold uppercase rounded-md tracking-wider inline-block">
                      {event.status === 'ongoing' ? (language === 'ar' ? 'نشط الآن' : 'En Cours') : (language === 'ar' ? 'قريباً جداً' : 'Planifié')}
                    </span>
                    <h3 className="text-lg font-bold text-gray-950 font-sans leading-snug">{language === 'ar' ? event.titleAr : event.titleFr}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed font-sans">{language === 'ar' ? event.descriptionAr : event.descriptionFr}</p>
                    
                    <div className="space-y-2 text-xs text-gray-600 font-sans">
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-red-500 shrink-0" />
                        <span>{language === 'ar' ? event.locationAr : event.locationFr}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-red-500 shrink-0" />
                        <span className="font-mono">{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-red-500 shrink-0" />
                        <span className="font-mono">{event.time}</span>
                      </div>
                    </div>
                  </div>
                  <div className="pt-6 border-t border-gray-50 mt-6 flex justify-between items-center text-[10px] text-gray-400 font-mono">
                    <span>ID: {event.id}</span>
                    <span className="text-red-600 font-bold uppercase tracking-wider">{language === 'ar' ? 'التحق بنا كمتطوع' : 'Bénévole requis'}</span>
                  </div>
                </div>
              ))}
              {camps.filter(c => c.status !== 'completed').length === 0 && (
                <p className="text-gray-400 text-sm font-sans col-span-2">
                  {language === 'ar' ? 'لا توجد فعاليات مجدولة حالياً.' : 'Aucun événement programmé actuellement.'}
                </p>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-black text-gray-950 font-sans border-b border-gray-100 pb-3 mb-8 flex items-center gap-2">
              <CheckCircle2 className="text-gray-400 w-5 h-5" />
              <span>{language === 'ar' ? 'فعاليات تمت بنجاح' : 'Activités Clôturées'}</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {camps.filter(c => c.status === 'completed').map((event) => (
                <div key={event.id} className="bg-gray-50 p-6 rounded-3xl border border-gray-150 flex flex-col justify-between opacity-80">
                  <div className="space-y-3">
                    <span className="px-2.5 py-0.5 bg-gray-200 text-gray-600 text-[10px] font-bold uppercase rounded-md tracking-wider inline-block">
                      {language === 'ar' ? 'مكتملة' : 'Terminé'}
                    </span>
                    <h3 className="text-base font-bold text-gray-950 font-sans">{language === 'ar' ? event.titleAr : event.titleFr}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed font-sans">{language === 'ar' ? event.descriptionAr : event.descriptionFr}</p>
                    {event.collectedUnits && (
                      <div className="p-2.5 bg-red-50 text-red-700 text-xs font-bold rounded-xl border border-red-100 max-w-xs font-sans">
                        {language === 'ar' ? `النتيجة: تم جمع ${event.collectedUnits} كيس دم` : `Bilan : ${event.collectedUnits} poches de sang collectées`}
                      </div>
                    )}
                  </div>
                  <div className="pt-4 border-t border-gray-200 mt-4 text-[10px] text-gray-400 font-mono flex justify-between">
                    <span>{event.date}</span>
                    <span>{event.locationAr}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </section>

    </div>
  );
}
