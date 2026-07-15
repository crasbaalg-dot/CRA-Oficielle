/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';

interface LanguageContextProps {
  language: Language;
  direction: 'rtl' | 'ltr';
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

const dictionary: Record<string, { ar: string; fr: string }> = {
  // Navigation
  home: { ar: "الرئيسية", fr: "Accueil" },
  about: { ar: "عن الهلال الأحمر", fr: "À Propos" },
  presidentMessage: { ar: "كلمة الرئيس", fr: "Message du Président" },
  news: { ar: "الأخبار", fr: "Actualités" },
  announcements: { ar: "الإعلانات والمستجدات", fr: "Annonces" },
  events: { ar: "الفعاليات", fr: "Événements" },
  firstAid: { ar: "الإسعافات الأولية", fr: "Secourisme" },
  bloodDonation: { ar: "التبرع بالدم", fr: "Don de Sang" },
  volunteer: { ar: "التطوع", fr: "Bénévolat" },
  contact: { ar: "اتصل بنا", fr: "Contact" },
  dashboard: { ar: "لوحة التحكم", fr: "Tableau de Bord" },
  logout: { ar: "تسجيل الخروج", fr: "Déconnexion" },
  login: { ar: "تسجيل الدخول", fr: "Connexion" },

  // General buttons / Labels
  readMore: { ar: "اقرأ المزيد", fr: "Lire la suite" },
  applyNow: { ar: "سجل الآن", fr: "Postuler maintenant" },
  emergencyNum: { ar: "رقم الطوارئ", fr: "Numéro d'Urgence" },
  emergencyCall: { ar: "اتصال طارئ", fr: "Appel d'Urgence" },
  sidiBelAbbes: { ar: "سيدي بلعباس", fr: "Sidi Bel Abbès" },
  algerianRedCrescent: { ar: "الهلال الأحمر الجزائري", fr: "Croissant-Rouge Algérien" },
  wilayaCommittee: { ar: "اللجنة الولائية لولاية سيدي بلعباس", fr: "Comité de Wilaya de Sidi Bel Abbès" },
  humanitarianAction: { ar: "العمل الإنساني", fr: "Action Humanitaire" },
  statsVolunteers: { ar: "المتطوعون النشطون", fr: "Bénévoles Actifs" },
  statsBloodUnits: { ar: "وحدات الدم المجمعة", fr: "Poches de Sang Collectées" },
  statsTrained: { ar: "المكونون في الإسعاف", fr: "Formés au Secourisme" },
  statsCampaigns: { ar: "الحملات الإنسانية", fr: "Campagnes Menées" },
  
  // Footer
  footerDesc: {
    ar: "الهلال الأحمر الجزائري جمعية إنسانية تطوعية مستقلة مساعدة للسلطات العمومية، تهدف لتخفيف المعاناة البشرية في كل الظروف.",
    fr: "Le Croissant-Rouge Algérien est une organisation humanitaire bénévole, auxiliaire des pouvoirs publics, dédiée à soulager la souffrance humaine."
  },
  quickLinks: { ar: "روابط سريعة", fr: "Liens Rapides" },
  rightsReserved: { ar: "جميع الحقوق محفوظة. الهلال الأحمر الجزائري - سيدي بلعباس", fr: "Tous droits réservés. Croissant-Rouge Algérien - Sidi Bel Abbès" },
  
  // Sections on Home
  latestNewsTitle: { ar: "آخر الأخبار والمستجدات", fr: "Dernières Actualités" },
  newsSubtitle: { ar: "تابع تغطيتنا الميدانية وأنشطتنا الإنسانية المستمرة في ولاية سيدي بلعباس", fr: "Suivez nos interventions sur le terrain et nos actions humanitaires continues" },
  latestAnnTitle: { ar: "إعلانات هامة وعاجلة", fr: "Annonces Importantes" },
  annSubtitle: { ar: "تنبيهات وبلاغات عاجلة تهم مواطني ومتطوعي الولاية", fr: "Alertes et communiqués urgents pour les citoyens et bénévoles" },
  callToActionVolunteer: { ar: "اصنع فرقاً في حياة الآخرين، انضم إلينا اليوم كمتطوع", fr: "Faites la différence, rejoignez-nous aujourd'hui en tant que bénévole" },
  volunteerBtn: { ar: "انضم كمتطوع", fr: "Devenir Bénévole" },
  donateBloodBtn: { ar: "تبرع بالدم الآن", fr: "Donner son Sang" },

  // Forms
  fullName: { ar: "الاسم الكامل", fr: "Nom Complet" },
  emailAddress: { ar: "البريد الإلكتروني", fr: "Adresse E-mail" },
  phoneNumber: { ar: "رقم الهاتف", fr: "Numéro de Téléphone" },
  subject: { ar: "الموضوع", fr: "Sujet" },
  messageText: { ar: "رسالتك", fr: "Votre message" },
  submit: { ar: "إرسال", fr: "Envoyer" },
  submitting: { ar: "جاري الإرسال...", fr: "Envoi en cours..." },
  birthDate: { ar: "تاريخ الميلاد", fr: "Date de Naissance" },
  gender: { ar: "الجنس", fr: "Genre" },
  bloodType: { ar: "فصيلة الدم", fr: "Groupe Sanguin" },
  profession: { ar: "المهنة / الدراسة", fr: "Profession / Études" },
  skills: { ar: "المهارات أو الخبرات السابقة إن وجدت", fr: "Compétences ou expériences (facultatif)" },
  male: { ar: "ذكر", fr: "Homme" },
  female: { ar: "أنثى", fr: "Femme" },
  maleLong: { ar: "ذكر", fr: "Masculin" },
  femaleLong: { ar: "أنثى", fr: "Féminin" },

  // Messages
  messageSuccess: { ar: "تم إرسال رسالتك بنجاح! شكراً لتواصلك معنا.", fr: "Message envoyé avec succès ! Merci de nous avoir contactés." },
  volunteerSuccess: { ar: "تم تسجيل طلب التطوع بنجاح! سيتصل بك منسق المتطوعين قريباً.", fr: "Candidature enregistrée ! Notre coordinateur vous contactera très bientôt." },
  errorFillFields: { ar: "الرجاء ملء جميع الحقول المطلوبة بشكل صحيح.", fr: "Veuillez remplir tous les champs obligatoires correctement." }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('cra_sba_lang');
    return (saved === 'ar' || saved === 'fr') ? saved : 'ar';
  });

  const direction = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    localStorage.setItem('cra_sba_lang', language);
    document.documentElement.lang = language;
    document.documentElement.dir = direction;
  }, [language, direction]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    const translation = dictionary[key];
    if (!translation) return key;
    return translation[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, direction, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
