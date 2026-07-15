/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../components/LanguageContext';
import { localDb } from '../services/db';
import { NewsItem, AnnouncementItem, BloodCampaign, InstitutionStats } from '../types';
import { 
  Heart, 
  ArrowRight, 
  Megaphone, 
  Calendar, 
  Droplet, 
  Users, 
  Clock, 
  Sparkles,
  PhoneCall,
  Activity,
  HeartPulse
} from 'lucide-react';
import { motion } from 'motion/react';

export default function Home() {
  const { language, t } = useLanguage();
  const [stats, setStats] = useState<InstitutionStats | null>(null);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [campaigns, setCampaigns] = useState<BloodCampaign[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const s = await localDb.getStats();
      const n = await localDb.getNews();
      const a = await localDb.getAnnouncements();
      const c = await localDb.getBloodCampaigns();
      setStats(s);
      // Get only published & top 3
      setNews(n.filter(item => !item.isDraft).slice(0, 3));
      setAnnouncements(a.slice(0, 2));
      setCampaigns(c.filter(camp => camp.status === 'upcoming').slice(0, 2));
    };
    fetchData();
  }, []);

  return (
    <div className="font-sans text-gray-800 bg-white">
      
      {/* 1. HERO BANNER SECTION */}
      <section className="relative min-h-[85vh] flex items-center bg-gray-950 text-white overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
        {/* Immersive background photo layer with opacity */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1600&auto=format&fit=crop" 
            alt="Humanitarian volunteer" 
            className="w-full h-full object-cover opacity-25 object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/90 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-8 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/25 border border-red-500/30 rounded-full text-red-500 text-xs font-bold uppercase tracking-wider">
              <Sparkles size={12} className="animate-pulse" />
              <span>{language === 'ar' ? 'الموقع الرسمي للجنة الولائية' : 'Site Officiel du Comité de Wilaya'}</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight max-w-4xl text-white">
              {language === 'ar' 
                ? 'الهلال الأحمر الجزائري - لجنة ولاية سيدي بلعباس' 
                : 'Croissant-Rouge Algérien - Sidi Bel Abbès'}
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl font-sans leading-relaxed">
              {language === 'ar' 
                ? 'نعمل بلا كلل لتقديم المساعدة الإنسانية، دعم الفئات الهشة، تدريب المسعفين وتأمين مخزون الدم بالولاية استجابةً للقيم الإنسانية النبيلة.'
                : 'Engagés quotidiennement pour soutenir les populations fragiles, former aux gestes de premiers secours et mobiliser les donateurs de sang à travers toute la wilaya.'}
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                to="/volunteer"
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {t('volunteerBtn')}
              </Link>
              <Link
                to="/about"
                className="px-6 py-3 border border-gray-700 hover:border-gray-500 hover:bg-white/5 text-white rounded-xl text-sm font-bold transition-all"
              >
                {language === 'ar' ? 'تعرف على لجنتنا' : 'Notre Mission'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. URGENT ANNOUNCEMENTS & TICKER */}
      {announcements.length > 0 && (
        <section className="bg-amber-50 border-y border-amber-200 py-4 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-500 text-white rounded-xl shrink-0">
                <Megaphone size={18} className="animate-bounce" />
              </div>
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-amber-800 font-mono">
                  {language === 'ar' ? 'تنبيه إنساني هام' : 'Communiqué Urgent'}
                </span>
                <p className="text-sm font-bold text-gray-900 mt-0.5">
                  {language === 'ar' ? announcements[0].titleAr : announcements[0].titleFr}
                </p>
              </div>
            </div>
            <Link
              to="/announcements"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shrink-0 transition-colors"
            >
              {language === 'ar' ? 'عرض التفاصيل' : 'Consulter'}
            </Link>
          </div>
        </section>
      )}

      {/* 3. CORE HUMANITARIAN SERVICES */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-black text-gray-950 font-sans tracking-tight">
            {language === 'ar' ? 'الركائز الإنسانية الأساسية لنشاطنا' : 'Nos Piliers Majeurs d\'Intervention'}
          </h2>
          <p className="text-gray-500 text-sm mt-2 font-medium">
            {language === 'ar' 
              ? 'نقدم خدمات رقمية وتدريبية مستمرة لخدمة مواطني ولاية سيدي بلعباس وتخفيف المعاناة البشرية.' 
              : 'Des actions de proximité concrètes pour bâtir une communauté solidaire et résiliente.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Service 1: Volunteer */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-950 mb-3 font-sans">
                {language === 'ar' ? 'الشبكة الولائية للتطوع' : 'Jeunesse & Volontariat'}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed font-sans mb-6">
                {language === 'ar' 
                  ? 'انضم إلى عائلتنا الكبرى من المتطوعين بسيدي بلعباس للمساهمة في قوافل الإغاثة، وموائد الإفطار، والنشاطات التضامنية المختلفة.' 
                  : 'Devenez acteur du changement. Rejoignez notre réseau de bénévoles pour participer aux caravanes de secours et actions de solidarité.'}
              </p>
            </div>
            <Link to="/volunteer" className="text-red-600 text-xs font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
              <span>{language === 'ar' ? 'سجل طلب التطوع' : 'Formulaire d\'Adhésion'}</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Service 2: Blood Donation */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                <Droplet size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-950 mb-3 font-sans">
                {language === 'ar' ? 'بنك الدم الإنساني' : 'Collecte de Sang'}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed font-sans mb-6">
                {language === 'ar' 
                  ? 'ندعم بنك الدم لمستشفى عبد القادر حساني بانتظام عبر تنظيم حملات دورية ومستمرة بمشاركة المواطنين لإنقاذ حياة المرضى.' 
                  : 'Approvisionnez les banques de sang des hôpitaux de la wilaya. Suivez le calendrier de nos collectes mobiles et découvrez l\'éligibilité.'}
              </p>
            </div>
            <Link to="/blood-donation" className="text-red-600 text-xs font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
              <span>{language === 'ar' ? 'مواعيد التبرع بالدم' : 'Consulter l\'Éligibilité'}</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Service 3: First Aid */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                <HeartPulse size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-950 mb-3 font-sans">
                {language === 'ar' ? 'التعليم والتكوين الإسعافي' : 'Formations Secourisme'}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed font-sans mb-6">
                {language === 'ar' 
                  ? 'تعلم الخطوات الإسعافية الأساسية التي تنقذ الأرواح. نوفر مكتبة رقمية تفاعلية للجمهور العريض ودورات تدريبية معتمدة.' 
                  : 'Découvrez les gestes qui sauvent à travers nos guides illustrés pas-à-pas et inscrivez-vous à nos prochaines sessions certifiantes.'}
              </p>
            </div>
            <Link to="/first-aid" className="text-red-600 text-xs font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
              <span>{language === 'ar' ? 'تعلم الإسعافات الآن' : 'Fiches Techniques'}</span>
              <ArrowRight size={14} />
            </Link>
          </div>

        </div>
      </section>

      {/* 4. KEY OFFICIAL METRICS */}
      {stats && (
        <section className="bg-gray-950 text-white py-16 px-4 sm:px-6 lg:px-8 border-y border-red-600">
          <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <h4 className="text-4xl sm:text-5xl font-black text-red-500 font-mono tracking-tight">{stats.volunteersCount}+</h4>
              <p className="text-xs sm:text-sm text-gray-400 font-sans mt-2">{t('statsVolunteers')}</p>
            </div>
            <div>
              <h4 className="text-4xl sm:text-5xl font-black text-red-500 font-mono tracking-tight">{stats.bloodUnitsCount}+</h4>
              <p className="text-xs sm:text-sm text-gray-400 font-sans mt-2">{t('statsBloodUnits')}</p>
            </div>
            <div>
              <h4 className="text-4xl sm:text-5xl font-black text-red-500 font-mono tracking-tight">{stats.firstAidTrainedCount}+</h4>
              <p className="text-xs sm:text-sm text-gray-400 font-sans mt-2">{t('statsTrained')}</p>
            </div>
            <div>
              <h4 className="text-4xl sm:text-5xl font-black text-red-500 font-mono tracking-tight">{stats.campaignsCount}+</h4>
              <p className="text-xs sm:text-sm text-gray-400 font-sans mt-2">{t('statsCampaigns')}</p>
            </div>
          </div>
        </section>
      )}

      {/* 5. LATEST NEWS GALLERY */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-black text-gray-950 font-sans tracking-tight">
                {t('latestNewsTitle')}
              </h2>
              <p className="text-sm text-gray-500 mt-1.5 font-medium font-sans">
                {t('newsSubtitle')}
              </p>
            </div>
            <Link
              to="/news"
              className="inline-flex items-center gap-1 text-red-600 font-bold text-sm hover:underline"
            >
              <span>{language === 'ar' ? 'عرض جميع الأخبار' : 'Toutes les actualités'}</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item) => (
              <article key={item.id} className="bg-white rounded-3xl border border-gray-100 shadow-xs hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="relative aspect-video bg-gray-100 overflow-hidden">
                    <img src={item.image} alt={language === 'ar' ? item.titleAr : item.titleFr} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                    <span className="absolute top-4 left-4 px-2.5 py-1 bg-red-600 text-white text-[10px] font-bold uppercase rounded-lg">
                      {language === 'ar' ? item.categoryAr : item.categoryFr}
                    </span>
                  </div>
                  <div className="p-6 space-y-3">
                    <span className="text-[10px] text-gray-400 font-mono font-bold block">{item.date}</span>
                    <h3 className="font-bold text-gray-950 text-base sm:text-lg line-clamp-2 leading-snug font-sans">
                      {language === 'ar' ? item.titleAr : item.titleFr}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed font-sans">
                      {language === 'ar' ? item.summaryAr : item.summaryFr}
                    </p>
                  </div>
                </div>
                <div className="p-6 pt-0">
                  <Link
                    to={`/news?id=${item.id}`}
                    className="text-red-600 font-bold text-xs flex items-center gap-1 hover:underline"
                  >
                    <span>{t('readMore')}</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 6. URGENT BLOOD DONATION ALERT & CALENDAR PREVIEW */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white max-w-7xl mx-auto">
        <div className="bg-red-50 rounded-3xl p-8 md:p-12 border border-red-100 flex flex-col lg:flex-row gap-10 items-center justify-between">
          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-600 text-xs font-bold uppercase rounded-full">
              <Droplet size={14} className="fill-red-600 text-red-600" />
              <span>{language === 'ar' ? 'حملات التبرع بالدم القادمة' : 'Appels au don de sang'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-950 font-sans tracking-tight">
              {language === 'ar' ? 'ساهم بإنقاذ الأرواح في سيدي بلعباس' : 'Chaque don de sang sauve trois vies'}
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed font-sans">
              {language === 'ar' 
                ? 'تنظم اللجنة الولائية باستمرار قوافل لجمع الدم لفائدة المرضى في مختلف مستشفيات وعيادات الولاية. تبرع بسيط ينقذ حياة إنسان.' 
                : 'Suivez le planning de nos collectes mobiles de sang organisées en collaboration avec les CHU de la wilaya de Sidi Bel Abbès.'}
            </p>
            {campaigns.length > 0 && (
              <div className="bg-white p-4 rounded-2xl border border-red-100 space-y-2 mt-4 max-w-xl">
                <span className="text-[10px] text-gray-400 font-bold uppercase block">{language === 'ar' ? 'الحملة المقبلة والمؤكدة:' : 'Prochaine Collecte Planifiée :'}</span>
                <h4 className="text-sm font-bold text-gray-950 font-sans">
                  {language === 'ar' ? campaigns[0].titleAr : campaigns[0].titleFr}
                </h4>
                <div className="flex flex-wrap gap-4 text-xs text-gray-500 font-mono pt-1">
                  <span className="flex items-center gap-1"><Calendar size={12} /> {campaigns[0].date}</span>
                  <span className="flex items-center gap-1"><Clock size={12} /> {campaigns[0].time}</span>
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto shrink-0">
            <Link
              to="/blood-donation"
              className="px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg text-center transition-all"
            >
              {language === 'ar' ? 'جدول حملات التبرع' : 'Calendrier Collecte'}
            </Link>
            <Link
              to="/volunteer"
              className="px-6 py-3.5 bg-white border border-red-200 hover:border-red-400 text-red-600 rounded-xl text-xs font-bold text-center transition-all"
            >
              {language === 'ar' ? 'سجل كمتطوع للحملة' : 'Aider en tant que Bénévole'}
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
