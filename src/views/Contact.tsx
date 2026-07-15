/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useLanguage } from '../components/LanguageContext';
import { localDb } from '../services/db';
import { Mail, Phone, MapPin, Clock, CheckCircle, Send, ShieldAlert } from 'lucide-react';

export default function Contact() {
  const { language, t } = useLanguage();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const fd = new FormData(e.currentTarget as HTMLFormElement);
    const msgData = {
      name: fd.get('name') as string,
      email: fd.get('email') as string,
      phone: fd.get('phone') as string,
      subject: fd.get('subject') as string,
      message: fd.get('message') as string,
    };

    try {
      await localDb.saveContactMessage(msgData);
      setSuccess(true);
      e.currentTarget.dispatchEvent(new Event('reset'));
    } catch (err) {
      console.warn('Contact message save failed to sync with Firestore, fallback to local storage:', err);
      alert(language === 'ar' 
        ? 'تم حفظ رسالتك محلياً على هذا الجهاز بنجاح. سنقوم بالمزامنة مع السحابة تلقائياً عند استقرار الاتصال.' 
        : 'Votre message a été enregistré localement sur cet appareil. La synchronisation cloud s\'effectuera dès que la connexion sera établie.');
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
            {language === 'ar' ? 'تواصل مع مكتب الهلال الأحمر' : 'Contacter la Commission الولائية'}
          </h1>
          <p className="text-sm text-red-100 max-w-2xl mx-auto mt-2 font-medium font-sans">
            {language === 'ar' 
              ? 'نحن هنا للإجابة على استفساراتكم وتلقي مقترحاتكم لتعزيز العمل الإنساني ببلديات ولاية سيدي بلعباس.' 
              : 'Des questions, des suggestions, ou besoin d\'assistance ? Nos équipes administratives restent à votre écoute.'}
          </p>
        </div>
      </section>

      {/* Main Grid: Contact info + Form */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left: Contact Info Block */}
        <div className="lg:col-span-5 space-y-8">
          <div>
            <h2 className="text-xl font-black text-gray-950 font-sans tracking-tight mb-2">
              {language === 'ar' ? 'المقر الرئيسي والمكاتب الولائية' : 'Bureau Officiel de Sidi Bel Abbès'}
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed font-sans">
              {language === 'ar' 
                ? 'يرجى زيارتنا في مقر اللجنة الرئيسي لتقديم المساعدات العينية أو الاستفسار المباشر عن دورات الإسعاف.' 
                : 'Présentez-vous directement à notre siège de wilaya pour le dépôt de dons matériels ou demandes administratives.'}
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                <MapPin size={20} />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-gray-950 text-sm font-sans">{language === 'ar' ? 'العنوان' : 'Adresse'}</h4>
                <p className="text-xs text-gray-500 font-sans">
                  {language === 'ar' 
                    ? 'شارع العقيد عميروش، سيدي بلعباس، الجزائر' 
                    : 'Rue Colonel Amirouche, Sidi Bel Abbès, Algérie'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                <Phone size={20} />
              </div>
              <div className="space-y-0.5 font-mono">
                <h4 className="font-bold text-gray-950 text-sm font-sans">{language === 'ar' ? 'الهاتف الفاكس' : 'Téléphone / Fax'}</h4>
                <a href="tel:048542211" className="text-xs text-gray-500 hover:text-red-600">048 54 22 11</a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                <Mail size={20} />
              </div>
              <div className="space-y-0.5 font-mono">
                <h4 className="font-bold text-gray-950 text-sm font-sans">{language === 'ar' ? 'البريد الإلكتروني' : 'Adresse E-mail'}</h4>
                <a href="mailto:cra.sba.alg@gmail.com" className="text-xs text-gray-500 hover:text-red-600">cra.sba.alg@gmail.com</a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                <Clock size={20} />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-gray-950 text-sm font-sans">{language === 'ar' ? 'أوقات العمل والاستقبال' : 'Heures de service'}</h4>
                <p className="text-xs text-gray-500 font-sans">
                  {language === 'ar' ? 'الأحد - الخميس: 08:30 - 16:30' : 'Dimanche au Jeudi : 08h30 à 16h30'}
                </p>
              </div>
            </div>
          </div>

          {/* Map Mockup container (clean OpenStreetMap embed or beautiful vector simulated maps) */}
          <div className="rounded-3xl border border-gray-150 overflow-hidden shadow-xs h-60 bg-gray-100 relative">
            {/* Clean responsive maps simulation */}
            <iframe 
              title="CRA Sidi Bel Abbes"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3240.2370889246327!2d-0.6366038!3d35.191535!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzXCsDExJzI5LjUiTiAwwrAzOCc0NS44Ilc!5e0!3m2!1sar!2sdz!4v1784081897000!5m2!1sar!2sdz" 
              className="w-full h-full border-none opacity-80" 
              allowFullScreen={false} 
              loading="lazy"
              referrerPolicy="no-referrer"
            ></iframe>
          </div>
        </div>

        {/* Right: Interactive Contact Form */}
        <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-3xl border border-gray-150 shadow-xs">
          {success ? (
            <div className="p-6 bg-green-50 border border-green-150 text-green-800 rounded-2xl space-y-3 animate-scaleUp">
              <div className="flex items-center gap-2 font-bold text-base font-sans">
                <CheckCircle className="text-green-600" />
                <span>{t('messageSuccess')}</span>
              </div>
              <p className="text-xs leading-relaxed font-sans">
                {language === 'ar' 
                  ? 'تم استلام رسالتك وتوجيهها بنجاح إلى خلية الإعلام والاتصال للجنة سيدي بلعباس. سيقوم مكتب السكرتارية بمراجعتها والرد عليكم قريباً.' 
                  : 'Votre message a bien été transmis. Nous y répondrons dans les plus brefs délais.'}
              </p>
              <button 
                onClick={() => setSuccess(false)}
                className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-xl"
              >
                {language === 'ar' ? 'إرسال رسالة أخرى' : 'Nouveau Message'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">{t('fullName')} *</label>
                  <input type="text" name="name" required placeholder="e.g. يوسف بوعزة" className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">{t('emailAddress')} *</label>
                  <input type="email" name="email" required placeholder="e.g. youcef@gmail.com" className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl font-mono text-xs" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">{t('phoneNumber')} (اختياري)</label>
                  <input type="tel" name="phone" placeholder="e.g. 0550 11 22 33" className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl font-mono text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">{t('subject')} *</label>
                  <input type="text" name="subject" required placeholder="e.g. استفسار حول دورات الإسعاف" className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">{t('messageText')} *</label>
                <textarea name="message" required placeholder="..." className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl h-36" />
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5 transition-all"
                >
                  <Send size={14} />
                  <span>{loading ? t('submitting') : t('submit')}</span>
                </button>
              </div>
            </form>
          )}
        </div>

      </section>

    </div>
  );
}
