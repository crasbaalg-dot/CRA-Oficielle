/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../components/LanguageContext';
import { localDb } from '../services/db';
import { FirstAidTopic } from '../types';
import { HeartPulse, ShieldAlert, PhoneCall, CheckCircle, ChevronDown, ChevronUp, BookOpen, Clock } from 'lucide-react';

export default function FirstAid() {
  const { language } = useLanguage();
  const [topics, setTopics] = useState<FirstAidTopic[]>([]);
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopics = async () => {
      const data = await localDb.getFirstAidTopics();
      setTopics(data);
      if (data.length > 0) {
        setExpandedTopicId(data[0].id);
      }
    };
    fetchTopics();
  }, []);

  const toggleTopic = (id: string) => {
    setExpandedTopicId(expandedTopicId === id ? null : id);
  };

  return (
    <div className="font-sans text-gray-800 bg-white min-h-[80vh]">
      
      {/* Banner */}
      <section className="bg-red-600 text-white py-16 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-red-900 to-red-950"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-3xl sm:text-4xl font-black font-sans tracking-tight">
            {language === 'ar' ? 'بوابة التثقيف والإسعاف الجماهيري' : 'Guide Pratique des Gestes de Secours'}
          </h1>
          <p className="text-sm text-red-100 max-w-2xl mx-auto mt-2 font-medium font-sans">
            {language === 'ar' 
              ? 'تعلم خطوات الإسعافات الأولية الأساسية لإنقاذ الأرواح. فالدقائق الأولى تصنع الفارق الحقيقي في الحالات الطارئة.' 
              : 'Enseignements cliniques simplifiés pour le grand public. Apprenez à stabiliser une victime avant l\'arrivée des secours.'}
          </p>
        </div>
      </section>

      {/* Emergency Call Quick Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="bg-red-50 p-6 rounded-3xl border border-red-100 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center shrink-0">
              <PhoneCall size={24} className="animate-bounce" />
            </div>
            <div>
              <h4 className="text-gray-950 font-bold text-lg font-sans">
                {language === 'ar' ? 'حالة طوارئ طبية عاجلة؟' : 'Une Urgence Vitale Absolue ?'}
              </h4>
              <p className="text-xs text-gray-500 font-sans mt-0.5">
                {language === 'ar' ? 'اتصل فوراً بالحماية المدنية الجزائرية للحصول على إغاثة سريعة.' : 'Appelez immédiatement les pompiers / protection civile.'}
              </p>
            </div>
          </div>
          <a
            href="tel:14"
            className="px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold tracking-widest font-mono shrink-0 shadow-md text-center w-full sm:w-auto"
          >
            {language === 'ar' ? 'اتصل بالرقم 14' : 'Composer le 14'}
          </a>
        </div>
      </section>

      {/* Accordion List of First Aid topics */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-4">
          {topics.map((topic) => {
            const isExpanded = expandedTopicId === topic.id;
            return (
              <div 
                key={topic.id} 
                className="bg-white rounded-2xl border border-gray-150 overflow-hidden shadow-xs"
              >
                {/* Accordion header trigger */}
                <button
                  onClick={() => toggleTopic(topic.id)}
                  className="w-full flex items-center justify-between p-6 md:p-8 text-right lg:text-left cursor-pointer hover:bg-gray-50/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                      <HeartPulse size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-950 text-base sm:text-lg font-sans">
                        {language === 'ar' ? topic.titleAr : topic.titleFr}
                      </h3>
                      <p className="text-xs text-gray-400 font-sans mt-0.5">
                        {language === 'ar' ? 'توجيهات الإسعاف السريع' : 'Consignes médicales clés'}
                      </p>
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                </button>

                {/* Accordion expandable body */}
                {isExpanded && (
                  <div className="px-6 pb-8 md:px-8 border-t border-gray-100 pt-6 space-y-6">
                    <p className="text-sm text-gray-600 leading-relaxed font-sans font-normal">
                      {language === 'ar' ? topic.descriptionAr : topic.descriptionFr}
                    </p>

                    {/* Quick alert banner instructions */}
                    <div className="bg-red-50 p-4 rounded-2xl border border-red-100 flex items-start gap-3">
                      <ShieldAlert size={18} className="text-red-600 mt-0.5 shrink-0" />
                      <div>
                        <span className="text-[10px] uppercase font-black text-red-600 tracking-wider block font-mono">
                          {language === 'ar' ? 'تنبيه عاجل' : 'Alerte immédiate'}
                        </span>
                        <p className="text-xs text-red-800 font-bold mt-0.5 font-sans">
                          {language === 'ar' ? topic.emergencyInstructionsAr : topic.emergencyInstructionsFr}
                        </p>
                      </div>
                    </div>

                    {/* Step-by-step ordered list */}
                    <div className="space-y-4">
                      <h4 className="font-bold text-gray-950 text-sm tracking-wide font-sans flex items-center gap-2">
                        <BookOpen size={16} className="text-red-600" />
                        <span>{language === 'ar' ? 'خطوات الإجراء الإسعافي بالتفصيل:' : 'Marche à suivre étape par étape :'}</span>
                      </h4>
                      <ol className="space-y-3.5 pl-0">
                        {(language === 'ar' ? topic.stepsAr : topic.stepsFr).map((step, idx) => (
                          <li key={idx} className="flex gap-3 text-sm text-gray-700 font-sans leading-relaxed">
                            <span className="w-6 h-6 rounded-lg bg-red-100 text-red-700 text-xs font-bold font-mono flex items-center justify-center shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
