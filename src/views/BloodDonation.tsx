/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../components/LanguageContext';
import { localDb } from '../services/db';
import { BloodCampaign } from '../types';
import { Droplet, Check, X, Calendar, MapPin, Sparkles, HelpCircle } from 'lucide-react';

export default function BloodDonation() {
  const { language } = useLanguage();
  const [camps, setCamps] = useState<BloodCampaign[]>([]);

  // Eligibility Checker State
  const [age, setAge] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [hasDiseases, setHasDiseases] = useState<string>('');
  const [isPregnant, setIsPregnant] = useState<string>('');
  const [checkerResult, setCheckerResult] = useState<string>('');
  const [checkerStatus, setCheckerStatus] = useState<'success' | 'danger' | 'info'>('info');

  useEffect(() => {
    const fetchCamps = async () => {
      const data = await localDb.getBloodCampaigns();
      setCamps(data.filter(c => c.status !== 'completed'));
    };
    fetchCamps();
  }, []);

  const handleCheckEligibility = (e: React.FormEvent) => {
    e.preventDefault();
    const ageNum = parseInt(age);
    const weightNum = parseInt(weight);

    if (isNaN(ageNum) || isNaN(weightNum)) {
      setCheckerResult(language === 'ar' ? 'الرجاء إدخال السن والوزن بأرقام صحيحة.' : 'Veuillez saisir des valeurs valides.');
      setCheckerStatus('info');
      return;
    }

    if (ageNum < 18 || ageNum > 65) {
      setCheckerResult(
        language === 'ar' 
          ? 'المتبرع بالدم يجب أن يتراوح سنه بين 18 و 65 سنة.' 
          : 'L\'âge requis pour faire un don de sang doit se situer entre 18 et 65 ans.'
      );
      setCheckerStatus('danger');
      return;
    }

    if (weightNum < 50) {
      setCheckerResult(
        language === 'ar' 
          ? 'الوزن الأدنى المقبول للتبرع هو 50 كغ للتأكد من سلامتك.' 
          : 'Le poids minimal autorisé pour un don de sang est de 50 kg.'
      );
      setCheckerStatus('danger');
      return;
    }

    if (hasDiseases === 'yes') {
      setCheckerResult(
        language === 'ar' 
          ? 'نعتذر، نظراً للمؤشرات الصحية والأمراض المزمنة، يرجى استشارة الطبيب المشرف قبل التبرع.' 
          : 'Certaines conditions médicales ou maladies chroniques exigent une consultation préalable.'
      );
      setCheckerStatus('danger');
      return;
    }

    if (isPregnant === 'yes') {
      setCheckerResult(
        language === 'ar' 
          ? 'لا ينصح بالتبرع بالدم أثناء الحمل أو الرضاعة لسلامة الأم والطفل.' 
          : 'Le don est contre-indiqué durant la grossesse et l\'allaitement.'
      );
      setCheckerStatus('danger');
      return;
    }

    setCheckerResult(
      language === 'ar' 
        ? 'تهانينا! تبدو مؤشراتك الأولية مطابقة لمعايير التبرع بالدم. سنكون سعداء باستقبالك في قوافلنا المقبلة.' 
        : 'Félicitations ! Vos indicateurs sont favorables. Nous vous attendons avec plaisir lors de notre prochaine campagne.'
    );
    setCheckerStatus('success');
  };

  return (
    <div className="font-sans text-gray-800 bg-white min-h-[80vh]">
      
      {/* Banner */}
      <section className="bg-red-600 text-white py-16 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-3xl sm:text-4xl font-black font-sans tracking-tight flex items-center justify-center gap-2">
            <Droplet className="fill-white" />
            <span>{language === 'ar' ? 'البوابة الرسمية للتبرع بالدم' : 'Portail du Don de Sang'}</span>
          </h1>
          <p className="text-sm text-red-100 max-w-2xl mx-auto mt-2 font-medium font-sans">
            {language === 'ar' 
              ? 'إنقاذ الأرواح يبدأ بقطرة دم. تعرف على شروط التبرع، وافحص أهليتك للمشاركة في حملات لجنة ولاية سيدي بلعباس.' 
              : 'Une seule de vos poches de sang peut sauver trois vies. Participez à nos collectes de sang à Sidi Bel Abbès.'}
          </p>
        </div>
      </section>

      {/* Grid: Eligibility Checker + Campaign lists */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left/Right Column: Eligibility test form */}
        <div className="lg:col-span-7 bg-gray-50 p-6 md:p-8 rounded-3xl border border-gray-150 shadow-xs">
          <div className="flex items-center gap-2 mb-6">
            <HelpCircle className="text-red-600 w-5 h-5" />
            <h2 className="text-lg font-black text-gray-950 font-sans">
              {language === 'ar' ? 'فحص أهليتك للتبرع بالدم (اختبار تفاعلي)' : 'Test d\'Éligibilité en Ligne'}
            </h2>
          </div>

          <form onSubmit={handleCheckEligibility} className="space-y-5 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">{language === 'ar' ? 'عمرك بالسنوات' : 'Votre Âge'}</label>
                <input 
                  type="number" 
                  required 
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="e.g. 25" 
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-xl font-mono text-sm bg-white" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">{language === 'ar' ? 'وزنك بالكيلوغرام' : 'Votre Poids (kg)'}</label>
                <input 
                  type="number" 
                  required 
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="e.g. 70" 
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-xl font-mono text-sm bg-white" 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                {language === 'ar' ? 'هل تعاني من أي أمراض مزمنة أو تتناول أدوية حالياً؟' : 'Avez-vous des maladies chroniques ou prenez-vous des médicaments ?'}
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="radio" name="hasDiseases" required value="yes" onChange={(e) => setHasDiseases(e.target.value)} className="text-red-600" />
                  <span>{language === 'ar' ? 'نعم' : 'Oui'}</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="radio" name="hasDiseases" required value="no" onChange={(e) => setHasDiseases(e.target.value)} className="text-red-600" />
                  <span>{language === 'ar' ? 'لا' : 'Non'}</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                {language === 'ar' ? 'هل توجد حالة حمل أو رضاعة حالية؟ (للإناث)' : 'Êtes-vous enceinte ou allaitez-vous ?'}
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="radio" name="isPregnant" required value="yes" onChange={(e) => setIsPregnant(e.target.value)} className="text-red-600" />
                  <span>{language === 'ar' ? 'نعم' : 'Oui'}</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="radio" name="isPregnant" required value="no" onChange={(e) => setIsPregnant(e.target.value)} className="text-red-600" />
                  <span>{language === 'ar' ? 'لا / لا ينطبق' : 'Non / Non applicable'}</span>
                </label>
              </div>
            </div>

            <button type="submit" className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer uppercase tracking-wider transition-all">
              {language === 'ar' ? 'فحص المؤشرات الإسعافية' : 'Analyser mon éligibilité'}
            </button>
          </form>

          {/* Checker feedback response */}
          {checkerResult && (
            <div className={`mt-6 p-4 rounded-2xl border text-xs font-sans leading-relaxed ${
              checkerStatus === 'success' ? 'bg-green-50 border-green-100 text-green-800' :
              checkerStatus === 'danger' ? 'bg-red-50 border-red-100 text-red-800' :
              'bg-blue-50 border-blue-100 text-blue-800'
            }`}>
              <div className="flex gap-2 items-start">
                <span className="font-bold text-sm shrink-0">
                  {checkerStatus === 'success' ? <Check size={16} /> : <X size={16} />}
                </span>
                <p>{checkerResult}</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Upcoming Blood drives campaigns */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center gap-2">
            <Calendar className="text-red-600 w-5 h-5" />
            <h2 className="text-lg font-black text-gray-950 font-sans">
              {language === 'ar' ? 'برنامج قوافل التبرع بالدم القريبة' : 'Planning des Collectes Mobiles'}
            </h2>
          </div>

          <div className="space-y-4">
            {camps.map((camp) => (
              <div key={camp.id} className="bg-white p-5 rounded-2xl border border-gray-150 shadow-xs flex flex-col justify-between">
                <div>
                  <span className="px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-bold rounded uppercase inline-block mb-2">
                    {language === 'ar' ? 'مفتوحة للاستقبال' : 'Ouvert'}
                  </span>
                  <h4 className="font-bold text-gray-950 text-sm sm:text-base font-sans line-clamp-2">{language === 'ar' ? camp.titleAr : camp.titleFr}</h4>
                  <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-gray-500 font-mono mt-3">
                    <span className="flex items-center gap-1"><MapPin size={12} className="text-red-500" /> {language === 'ar' ? camp.locationAr : camp.locationFr}</span>
                    <span className="flex items-center gap-1"><Calendar size={12} className="text-red-500" /> {camp.date}</span>
                  </div>
                </div>
              </div>
            ))}
            {camps.length === 0 && (
              <p className="text-gray-400 text-xs font-sans">
                {language === 'ar' ? 'لا توجد حملات تبرع معلنة حالياً. يرجى مراجعة صفحة الإعلانات بانتظام.' : 'Aucune collecte mobile planifiée pour les prochains jours.'}
              </p>
            )}
          </div>
        </div>

      </section>

    </div>
  );
}
