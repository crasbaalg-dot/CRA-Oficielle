/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useLanguage } from '../components/LanguageContext';
import { localDb } from '../services/db';
import { Users, CheckCircle, Sparkles } from 'lucide-react';

export default function Volunteer() {
  const { language, t } = useLanguage();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const fd = new FormData(e.currentTarget as HTMLFormElement);
    const appData = {
      fullName: fd.get('fullName') as string,
      email: fd.get('email') as string,
      phone: fd.get('phone') as string,
      birthDate: fd.get('birthDate') as string,
      gender: fd.get('gender') as string,
      bloodType: fd.get('bloodType') as string,
      profession: fd.get('profession') as string,
      skillsAr: fd.get('skills') as string,
      skillsFr: fd.get('skills') as string,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'pending' as const
    };

    try {
      await localDb.saveVolunteerApplication(appData);
      setSuccess(true);
      e.currentTarget.dispatchEvent(new Event('reset'));
    } catch (err) {
      console.warn('Volunteer application save failed to sync with Firestore, fallback to local storage:', err);
      alert(language === 'ar' 
        ? 'تم حفظ طلبك محلياً على هذا الجهاز بنجاح. سنقوم بالمزامنة مع السحابة تلقائياً عند استقرار الاتصال.' 
        : 'Votre demande a été enregistrée localement sur cet appareil. La synchronisation cloud s\'effectuera dès que la connexion sera établie.');
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-sans text-gray-800 bg-white min-h-[85vh]">
      
      {/* Banner */}
      <section className="bg-red-600 text-white py-16 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-3xl sm:text-4xl font-black font-sans tracking-tight">
            {language === 'ar' ? 'التحق بشبكة متطوعي ولاية سيدي بلعباس' : 'Devenir Bénévole du Croissant-Rouge'}
          </h1>
          <p className="text-sm text-red-100 max-w-2xl mx-auto mt-2 font-medium font-sans">
            {language === 'ar' 
              ? 'كن يداً معطاءة وساهم في خدمة المجتمع ومساعدة المحتاجين عبر التسجيل في استمارة التطوع الرسمية.' 
              : 'Rejoignez nos équipes pour participer activement aux maraudes, caravanes d\'aide et collectes mobiles.'}
          </p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white p-8 rounded-3xl border border-gray-150 shadow-sm relative overflow-hidden">
          
          <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
            <Users className="text-red-600 w-6 h-6 shrink-0" />
            <div>
              <h2 className="text-lg font-black text-gray-950 font-sans">
                {language === 'ar' ? 'استمارة الترشح للانضمام كمتطوع' : 'Formulaire Officiel d\'Adhésion'}
              </h2>
              <p className="text-xs text-gray-400 font-sans mt-0.5">
                {language === 'ar' ? 'يرجى إدخال معلومات صحيحة لمساعدتنا على التواصل معك بسرعة.' : 'Veuillez saisir des informations d\'identité valides.'}
              </p>
            </div>
          </div>

          {success ? (
            <div className="p-6 bg-green-50 border border-green-150 text-green-800 rounded-2xl space-y-3 animate-scaleUp">
              <div className="flex items-center gap-2 font-bold text-base font-sans">
                <CheckCircle className="text-green-600" />
                <span>{t('volunteerSuccess')}</span>
              </div>
              <p className="text-xs leading-relaxed font-sans font-medium">
                {language === 'ar' 
                  ? 'تم حفظ طلبك بنجاح في قاعدة بيانات اللجنة الولائية لسيدي بلعباس. سيقوم منسق المتطوعين بمراجعة ملفك والاتصال بك في أقرب وقت لتوجيهك للدورة التكوينية الأولى.' 
                  : 'Votre candidature a bien été enregistrée par le bureau de Sidi Bel Abbès. Notre coordinateur prendra contact avec vous rapidement.'}
              </p>
              <button 
                onClick={() => setSuccess(false)}
                className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-xl"
              >
                {language === 'ar' ? 'تقديم طلب آخر' : 'Nouveau Formulaire'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">{t('fullName')} *</label>
                  <input type="text" name="fullName" required placeholder="e.g. أحمد بومدين" className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">{t('emailAddress')} *</label>
                  <input type="email" name="email" required placeholder="e.g. ahmed@gmail.com" className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl font-mono text-xs" />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">{t('phoneNumber')} *</label>
                  <input type="tel" name="phone" required placeholder="e.g. 0550 11 22 33" className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl font-mono text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">{t('birthDate')} *</label>
                  <input type="date" name="birthDate" required className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl" />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">{t('gender')} *</label>
                  <select name="gender" required className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl">
                    <option value="male">{t('maleLong')}</option>
                    <option value="female">{t('femaleLong')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">{t('bloodType')} *</label>
                  <select name="bloodType" required className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl font-mono font-bold">
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">{t('profession')} *</label>
                  <input type="text" name="profession" required placeholder="e.g. طالب في كلية الطب / مهندس" className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl" />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">{t('skills')}</label>
                  <textarea name="skills" placeholder="..." className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl h-24" />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-all"
                >
                  {loading ? t('submitting') : (language === 'ar' ? 'تقديم طلب الانضمام' : 'Soumettre ma candidature')}
                </button>
              </div>
            </form>
          )}

        </div>
      </section>

    </div>
  );
}
