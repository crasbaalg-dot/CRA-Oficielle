/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from './LanguageContext';
import { Menu, X, Phone, Globe, Lock, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Header() {
  const { language, setLanguage, direction, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { key: 'home', path: '/' },
    { key: 'about', path: '/about' },
    { key: 'news', path: '/news' },
    { key: 'announcements', path: '/announcements' },
    { key: 'events', path: '/events' },
    { key: 'firstAid', path: '/first-aid' },
    { key: 'bloodDonation', path: '/blood-donation' },
    { key: 'volunteer', path: '/volunteer' },
    { key: 'contact', path: '/contact' },
  ];

  const handleLinkClick = () => {
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentLangLabel = language === 'ar' ? 'Français' : 'العربية';
  const nextLang: 'ar' | 'fr' = language === 'ar' ? 'fr' : 'ar';

  return (
    <>
      {/* Top Banner (Emergency Contact info) */}
      <div className="bg-[#E02424] text-white py-2 px-4 text-xs font-mono flex justify-between items-center z-50 relative">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Phone size={14} className="animate-pulse" />
            <span className="font-sans font-medium">
              {language === 'ar' ? 'خط الطوارئ للجنة الولائية: ' : 'Ligne d\'urgence CRA : '}
              <a href="tel:048541111" className="underline hover:text-gray-100 font-mono font-bold">048 54 11 11</a>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-400 inline-block animate-ping"></span>
              <span className="text-[10px] uppercase font-sans tracking-wide">
                {language === 'ar' ? 'المكتب الولائي نشط' : 'Bureau de Wilaya Actif'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header
        id="app-header"
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-gray-100 py-3' 
            : 'bg-white py-5 border-b border-gray-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Institution Logo */}
          <Link to="/" onClick={handleLinkClick} className="flex items-center gap-3 group">
            {/* SVG Red Crescent Logo */}
            <div className="relative w-12 h-12 flex items-center justify-center bg-red-50 rounded-full group-hover:scale-105 transition-transform duration-300">
              <svg 
                viewBox="0 0 100 100" 
                className="w-10 h-10 text-red-600 fill-current"
                aria-hidden="true"
              >
                {/* Beautiful Red Crescent geometry facing right (West) for Red Crescent */}
                <path d="M75,50 C75,69.33 59.33,85 40,85 C29.41,85 20.03,80.3 13.68,72.84 C21.13,76.51 29.56,78.5 38.5,78.5 C60.32,78.5 78,60.82 78,39 C78,28.2 73.68,18.42 66.68,11.28 C71.9,16.51 75,23.7 75,31.5 C75,31.7 75,31.9 75,32.1 L75,50 Z" />
              </svg>
            </div>
            <div className="flex flex-col text-left">
              <h1 className="text-sm sm:text-base font-bold text-gray-900 leading-tight tracking-tight font-sans">
                {language === 'ar' ? 'الهلال الأحمر الجزائري' : 'Croissant-Rouge Algérien'}
              </h1>
              <p className="text-[10px] sm:text-xs text-red-600 font-semibold uppercase tracking-wider font-mono">
                {language === 'ar' ? 'اللجنة الولائية - سيدي بلعباس' : 'Comité de Sidi Bel Abbès'}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.key}
                  to={item.path}
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    isActive 
                      ? 'text-red-600 bg-red-50 font-bold' 
                      : 'text-gray-700 hover:text-red-600 hover:bg-gray-50'
                  }`}
                >
                  {t(item.key)}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(nextLang)}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-all duration-200 cursor-pointer"
              aria-label="Switch Language"
            >
              <Globe size={14} className="text-gray-400" />
              <span>{currentLangLabel}</span>
            </button>

            {/* Volunteer Portal Button */}
            <Link
              to="/volunteer"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-bold shadow-md hover:bg-red-700 hover:shadow-lg transition-all duration-300"
            >
              {language === 'ar' ? 'تطوع الآن' : 'Rejoindre'}
            </Link>
          </div>

          {/* Mobile Hamburguer Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            {/* Quick Lang Switch */}
            <button
              onClick={() => setLanguage(nextLang)}
              className="p-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50"
            >
              {language === 'ar' ? 'FR' : 'عربي'}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-gray-50 rounded-lg transition-colors"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Drawer Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[104px] z-30 bg-white border-b border-gray-200 shadow-xl max-h-[calc(100vh-104px)] overflow-y-auto block lg:hidden"
          >
            <div className="px-4 pt-4 pb-6 space-y-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.key}
                    to={item.path}
                    onClick={handleLinkClick}
                    className={`block px-4 py-3 rounded-lg text-base font-semibold transition-colors ${
                      isActive 
                        ? 'text-red-600 bg-red-50' 
                        : 'text-gray-700 hover:text-red-600 hover:bg-gray-50'
                    }`}
                  >
                    {t(item.key)}
                  </Link>
                );
              })}
              <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
                <Link
                  to="/volunteer"
                  onClick={handleLinkClick}
                  className="w-full text-center py-3 bg-red-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-red-700"
                >
                  {language === 'ar' ? 'طلب انضمام كمتطوع' : 'Devenir Bénévole'}
                </Link>
                
                {/* Hidden Lock for Admin Access */}
                <Link
                  to="/admin"
                  onClick={handleLinkClick}
                  className="flex items-center justify-center gap-1.5 text-xs text-gray-400 hover:text-red-600 py-1 transition-colors"
                >
                  <Lock size={12} />
                  <span>{language === 'ar' ? 'بوابة الإدارة (المشرفين)' : 'Portail Administratif'}</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
