/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from './LanguageContext';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Facebook, 
  Twitter, 
  Youtube, 
  Instagram, 
  ShieldCheck,
  Heart,
  ExternalLink
} from 'lucide-react';

export default function Footer() {
  const { language, t } = useLanguage();

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickLinks = [
    { key: 'home', path: '/' },
    { key: 'about', path: '/about' },
    { key: 'news', path: '/news' },
    { key: 'announcements', path: '/announcements' },
    { key: 'events', path: '/events' },
    { key: 'firstAid', path: '/first-aid' },
    { key: 'bloodDonation', path: '/blood-donation' },
    { key: 'volunteer', path: '/volunteer' },
    { key: 'contact', path: '/contact' }
  ];

  return (
    <footer className="bg-gray-950 text-gray-200 pt-16 pb-8 border-t-4 border-red-600 relative overflow-hidden">
      {/* Visual background accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-900/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-950/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Logo & Org Description */}
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center bg-red-600 rounded-full">
                <svg viewBox="0 0 100 100" className="w-8 h-8 text-white fill-current">
                  <path d="M75,50 C75,69.33 59.33,85 40,85 C29.41,85 20.03,80.3 13.68,72.84 C21.13,76.51 29.56,78.5 38.5,78.5 C60.32,78.5 78,60.82 78,39 C78,28.2 73.68,18.42 66.68,11.28 C71.9,16.51 75,23.7 75,31.5 C75,31.7 75,31.9 75,32.1 L75,50 Z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-white text-base font-sans tracking-wide">
                  {language === 'ar' ? 'الهلال الأحمر الجزائري' : 'Croissant-Rouge Algérien'}
                </h3>
                <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider font-mono">
                  {language === 'ar' ? 'لجنة ولاية سيدي بلعباس' : 'Comité de Sidi Bel Abbès'}
                </p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed font-sans font-normal">
              {t('footerDesc')}
            </p>
            {/* Social handles */}
            <div className="flex items-center gap-3 pt-2">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-gray-900 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-600 transition-colors" aria-label="Facebook">
                <Facebook size={16} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-gray-900 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-600 transition-colors" aria-label="Twitter">
                <Twitter size={16} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-gray-900 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-600 transition-colors" aria-label="YouTube">
                <Youtube size={16} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-gray-900 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-600 transition-colors" aria-label="Instagram">
                <Instagram size={16} />
              </a>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="space-y-5">
            <h4 className="text-white font-bold text-sm tracking-widest uppercase border-b border-gray-900 pb-3 font-sans">
              {t('quickLinks')}
            </h4>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
              {quickLinks.map((link) => (
                <li key={link.key}>
                  <Link
                    to={link.path}
                    onClick={handleBackToTop}
                    className="text-gray-400 hover:text-white hover:underline transition-all duration-150 inline-block"
                  >
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Local Contact Information */}
          <div className="space-y-5">
            <h4 className="text-white font-bold text-sm tracking-widest uppercase border-b border-gray-900 pb-3 font-sans">
              {language === 'ar' ? 'معلومات الاتصال' : 'Coordonnées'}
            </h4>
            <ul className="space-y-3.5 text-sm text-gray-400 font-sans">
              <li className="flex items-start gap-2.5">
                <MapPin size={16} className="text-red-500 mt-1 shrink-0" />
                <span>
                  {language === 'ar' 
                    ? 'شارع العقيد عميروش، سيدي بلعباس، الجزائر' 
                    : 'Rue Colonel Amirouche, Sidi Bel Abbès, Algérie'}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={16} className="text-red-500 shrink-0" />
                <a href="tel:048542211" className="hover:text-white font-mono">048 54 22 11</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={16} className="text-red-500 shrink-0" />
                <a href="mailto:cra.sba.alg@gmail.com" className="hover:text-white font-mono">cra.sba.alg@gmail.com</a>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock size={16} className="text-red-500 mt-0.5 shrink-0" />
                <span className="text-xs">
                  {language === 'ar' ? 'الأحد - الخميس: 08:30 - 16:30' : 'Dimanche - Jeudi : 08h30 - 16h30'}
                </span>
              </li>
            </ul>
          </div>

          {/* Emergency / Call-to-action Block */}
          <div className="space-y-5 bg-gray-900/50 p-5 rounded-2xl border border-gray-900">
            <h4 className="text-white font-bold text-sm tracking-widest uppercase font-sans">
              {language === 'ar' ? 'الأرقام الاستعجالية' : 'Numéros d\'Urgence'}
            </h4>
            <div className="space-y-3">
              <div className="bg-red-950/40 p-3.5 rounded-xl border border-red-900/40">
                <p className="text-[10px] text-red-400 uppercase font-bold tracking-wider font-mono">
                  {language === 'ar' ? 'الحماية المدنية' : 'Protection Civile'}
                </p>
                <a href="tel:14" className="text-2xl font-bold text-red-500 hover:text-red-400 font-mono tracking-widest block mt-0.5">14</a>
              </div>
              <div className="bg-gray-900 p-3.5 rounded-xl border border-gray-800">
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider font-mono">
                  {language === 'ar' ? 'الشرطة الوطنية' : 'Sûreté Nationale'}
                </p>
                <a href="tel:1548" className="text-xl font-bold text-white hover:text-gray-200 font-mono tracking-wider block mt-0.5">1548</a>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Bottom Bar */}
        <div className="border-t border-gray-900 pt-8 mt-4 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 font-sans">
          <p className="text-center md:text-left mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} {t('rightsReserved')}
          </p>
          <div className="flex items-center gap-6">
            <Link 
              to="/admin" 
              className="flex items-center gap-1 hover:text-red-500 transition-colors py-1 px-2 hover:bg-gray-900 rounded"
              title="Portail Administration"
            >
              <ShieldCheck size={14} />
              <span>{language === 'ar' ? 'بوابة الإشراف' : 'Accès CMS'}</span>
            </Link>
            <div className="flex items-center gap-1 text-gray-600">
              <Heart size={10} className="fill-red-600 text-red-600 animate-pulse" />
              <span>Sidi Bel Abbès</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
