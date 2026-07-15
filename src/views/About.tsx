/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../components/LanguageContext';
import { localDb } from '../services/db';
import { Member } from '../types';
import { Sparkles, Shield, Heart, Award, ArrowRight, BookOpen } from 'lucide-react';

export default function About() {
  const { language } = useLanguage();
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    const fetchMembers = async () => {
      const data = await localDb.getMembers();
      setMembers(data);
    };
    fetchMembers();
  }, []);

  const fundamentalPrinciples = [
    {
      titleAr: "الإنسانية (Humanité)",
      descAr: "ولدت الرغبة في تقديم المساعدة دون تمييز للجرحى في ساحة المعركة، للحيلولة دون المعاناة الإنسانية وتخفيفها.",
      titleFr: "L'Humanité",
      descFr: "Né du souci de porter secours sans discrimination aux blessés sur les champs de bataille, de prévenir et d'alléger en toutes circonstances les souffrances humaines."
    },
    {
      titleAr: "عدم التحيز (Impartialité)",
      descAr: "لا تمييز على أساس الجنسية أو العرق أو المعتقدات الدينية أو الطبقة أو الآراء السياسية.",
      titleFr: "L'Impartialité",
      descFr: "Il ne fait aucune distinction de nationalité, de race, de religion, de condition sociale ou d'appartenance politique."
    },
    {
      titleAr: "الحياد (Neutralité)",
      descAr: "امتناع الحركة عن المشاركة في الأعمال العدائية أو الجدال في أي وقت.",
      titleFr: "La Neutralité",
      descFr: "Afin de garder la confiance de tous, le Mouvement s'abstient de prendre part aux hostilités."
    },
    {
      titleAr: "الاستقلال (Indépendance)",
      descAr: "الحركة مستقلة والمساعدات تخضع دائماً للقوانين والمبادئ الإنسانية الخاصة بنا.",
      titleFr: "L'Indépendance",
      descFr: "Le Mouvement est indépendant. Les Sociétés nationales, auxiliaires des pouvoirs publics."
    },
    {
      titleAr: "الخدمة التطوعية (Volontariat)",
      descAr: "حركة إغاثة تطوعية لا تبغي الكسب المالي بأي شكل من الأشكال.",
      titleFr: "Le Volontariat",
      descFr: "Il s'agit d'un mouvement de secours volontaire et désintéressé."
    }
  ];

  return (
    <div className="font-sans text-gray-800 bg-white">
      
      {/* Page Title & Banner */}
      <section className="bg-red-600 text-white py-16 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-red-900 to-red-950"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-3xl sm:text-4xl font-black font-sans tracking-tight">
            {language === 'ar' ? 'من نحن وقيمنا الإنسانية' : 'Notre Identité & Nos Valeurs'}
          </h1>
          <p className="text-sm sm:text-base text-red-100 max-w-2xl mx-auto mt-2 font-medium font-sans">
            {language === 'ar' 
              ? 'تاريخ حافل بالتضامن والإغاثة الإنسانية في ولاية سيدي بلعباس والجزائر منذ عام 1956.' 
              : 'Une histoire de solidarité humanitaire au service de Sidi Bel Abbès et de la nation algérienne depuis 1956.'}
          </p>
        </div>
      </section>

      {/* 1. PRESIDENT'S MESSAGE SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gray-50 rounded-3xl p-8 md:p-12 border border-gray-100 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-4 shrink-0 justify-center flex">
            <div className="relative">
              <div className="absolute inset-0 bg-red-600 rounded-2xl transform rotate-3 scale-102"></div>
              <img 
                src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=500&auto=format&fit=crop" 
                alt="Dr. Abdelkader Benaissa" 
                className="relative rounded-2xl w-full max-w-sm object-cover aspect-[4/5] shadow-lg"
              />
            </div>
          </div>
          <div className="lg:col-span-8 space-y-4">
            <span className="text-xs font-black uppercase tracking-wider text-red-600 font-mono">
              {language === 'ar' ? 'رسالة ترحيبية' : 'Message Officiel'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-950 font-sans tracking-tight">
              {language === 'ar' ? 'كلمة رئيس اللجنة الولائية' : 'Mot du Président du Comité de Wilaya'}
            </h2>
            
            <div className="space-y-4 text-sm text-gray-600 leading-relaxed font-sans font-normal">
              <p className="font-semibold text-gray-800">
                {language === 'ar' 
                  ? 'باسم كافة متطوعي ومنتسبي الهلال الأحمر الجزائري لولاية سيدي بلعباس، نرحب بكم في بوابتنا الرقمية.' 
                  : 'Au nom de tous les bénévoles et membres du Croissant-Rouge Algérien de la wilaya de Sidi Bel Abbès, je vous souhaite la bienvenue.'}
              </p>
              <p>
                {language === 'ar' 
                  ? 'إن مهمتنا الأساسية كانت وستظل دوماً الوقوف إلى جانب الفئات الهشة والمحتاجة وتأمين الدعم الاجتماعي، الطبي، والنفسي للمواطنين في كامل تراب ولايتنا الـ 52 بلدية. لقد أثبت متطوعونا المرة تلو الأخرى شجاعتهم وحبهم للعمل الخيري وتواجدهم الفوري في الصفوف الأولى أثناء الطوارئ والكوارث وحملات التبرع بالدم.'
                  : 'Notre mission fondamentale demeure d\'accompagner les populations vulnérables et d\'apporter un soutien médico-social et d\'urgence à travers les 52 communes de notre wilaya. Nos bénévoles font preuve d\'un dévouement exemplaire, intervenant lors des urgences, des campagnes de don de sang et des opérations de solidarité hivernale ou du mois sacré du Ramadan.'}
              </p>
              <p>
                {language === 'ar' 
                  ? 'ندعو كافة المواطنين والشباب والطلبة للانضمام إلى شبكتنا الولائية للمساهمة معاً في بناء غدٍ أكثر إنسانية وتضامناً.'
                  : 'Nous invitons chaque citoyen, étudiant ou professionnel à se joindre à nos équipes pour continuer de faire vivre l\'esprit humanitaire.'}
              </p>
            </div>
            
            <div className="pt-4 border-t border-gray-100 flex flex-col">
              <span className="text-base font-black text-gray-900 font-sans">
                {language === 'ar' ? 'د. عبد القادر بن عيسى' : 'Dr. Abdelkader Benaissa'}
              </span>
              <span className="text-xs text-gray-400 font-mono">
                {language === 'ar' ? 'رئيس لجنة ولاية سيدي بلعباس' : 'Président du Comité de Wilaya de Sidi Bel Abbès'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HISTORY & VISION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-gray-100">
        <div className="space-y-4">
          <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
            <BookOpen size={20} />
          </div>
          <h3 className="text-xl font-bold text-gray-950 font-sans">
            {language === 'ar' ? 'تاريخ الهلال الأحمر الجزائري' : 'Histoire et Naissance de l\'Institution'}
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed font-sans">
            {language === 'ar' 
              ? 'تأسس الهلال الأحمر الجزائري في 11 ديسمبر 1956 أثناء ثورة التحرير المجيدة للاستجابة للاحتياجات الطبية والإنسانية لضحايا الحرب، وباشر نشاطه على المستوى الدولي لتقديم الدعم والتعريف بالقضية الوطنية الإنسانية عالمياً. حظي باعتراف رسمي من اللجنة الدولية للصليب الأحمر والهلال الأحمر في عام 1963.' 
              : 'Fondé le 11 décembre 1956 pendant la guerre de libération nationale, le Croissant-Rouge Algérien est né pour répondre aux urgences humanitaires et médicales des victimes. Reconnu officiellement par le Comité International de la Croix-Rouge (CICR) en 1963, il est depuis un acteur de référence internationale.'}
          </p>
        </div>

        <div className="space-y-4">
          <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
            <Award size={20} />
          </div>
          <h3 className="text-xl font-bold text-gray-950 font-sans">
            {language === 'ar' ? 'مهمتنا ورؤيتنا المستقبلية' : 'Notre Vision & Objectifs Stratégiques'}
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed font-sans">
            {language === 'ar' 
              ? 'نطمح لبناء قدرة صمود مجتمعية متميزة عبر ولاية سيدي بلعباس وتوسيع شبكة المسعفين التطوعية في كل حي وقرية، مع توفير أرقى أنواع الاستجابة الإنسانية وتأطير التبرع الطوعي بالدم وفق أعلى مستويات الشفافية والموثوقية وبث روح التآزر الاجتماعي.' 
              : 'Nous aspirons à renforcer la résilience communautaire à Sidi Bel Abbès en formant un réseau de secouristes dans chaque quartier et village, tout en modernisant l\'organisation des bénévoles et l\'assistance logistique aux familles les plus démunies.'}
          </p>
        </div>
      </section>

      {/* 3. CORE HUMANITARIAN PRINCIPLES (GRID) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-950 font-sans">
              {language === 'ar' ? 'المبادئ الأساسية للحركة الدولية الإنسانية' : 'Nos Principes Fondamentaux de Secours'}
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 font-sans mt-1">
              {language === 'ar' ? 'المبادئ السبعة السامية التي توجه كل متطوعينا في الميدان.' : 'Les lignes directrices éthiques régissant chacune de nos actions.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {fundamentalPrinciples.map((p, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition-shadow">
                <div className="w-9 h-9 rounded-full bg-red-50 text-red-600 flex items-center justify-center font-bold text-xs font-mono mb-4">
                  0{idx + 1}
                </div>
                <h4 className="font-bold text-gray-950 text-base font-sans mb-2">
                  {language === 'ar' ? p.titleAr : p.titleFr}
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed font-sans">
                  {language === 'ar' ? p.descAr : p.descFr}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. EXECUTIVE COMMITTEE MEMBERS GALLERY */}
      {members.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-black uppercase tracking-wider text-red-600 font-mono">
              {language === 'ar' ? 'الهيكل البشري للجنة' : 'L\'Équipe Administrative'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-950 font-sans mt-1">
              {language === 'ar' ? 'أعضاء مكتب ولاية سيدي بلعباس' : 'Membres du Bureau Exécutif'}
            </h2>
            <p className="text-xs text-gray-400 mt-1 font-sans">
              {language === 'ar' ? 'قادة ومسؤولين يكرسون جهودهم لتسيير العمل الإنساني بالولاية.' : 'Des coordinateurs professionnels encadrant les différentes divisions.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
            {members.map((m) => (
              <div key={m.id} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between items-center text-center">
                <img src={m.image} alt={m.nameFr} className="w-24 h-24 rounded-full object-cover border-4 border-red-50 mb-4" />
                <div className="space-y-1">
                  <h4 className="font-bold text-gray-950 text-lg font-sans">{language === 'ar' ? m.nameAr : m.nameFr}</h4>
                  <p className="text-xs text-red-600 font-bold uppercase tracking-wider">{language === 'ar' ? m.roleAr : m.roleFr}</p>
                </div>
                <p className="text-xs text-gray-500 font-sans mt-3 line-clamp-3 leading-relaxed">
                  {language === 'ar' ? m.bioAr : m.bioFr}
                </p>
                {(m.email || m.phone) && (
                  <div className="pt-4 mt-4 border-t border-gray-50 w-full text-[10px] text-gray-400 font-mono space-y-0.5">
                    {m.email && <div className="truncate">{m.email}</div>}
                    {m.phone && <div>{m.phone}</div>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
