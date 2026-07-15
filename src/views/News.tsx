/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../components/LanguageContext';
import { localDb } from '../services/db';
import { NewsItem } from '../types';
import { Search, Eye, Calendar, ArrowLeft, Share2, Printer, Sparkles } from 'lucide-react';

export default function News() {
  const { language, t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const articleId = searchParams.get('id');

  const [news, setNews] = useState<NewsItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeArticle, setActiveArticle] = useState<NewsItem | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      const data = await localDb.getNews();
      setNews(data.filter(n => !n.isDraft));
    };
    fetchNews();
  }, []);

  useEffect(() => {
    if (articleId && news.length > 0) {
      const found = news.find(n => n.id === articleId);
      if (found) {
        setActiveArticle(found);
        // Increment authentic views
        localDb.incrementNewsViews(found.id);
      }
    } else {
      setActiveArticle(null);
    }
  }, [articleId, news]);

  const handleArticleClick = (id: string) => {
    setSearchParams({ id });
  };

  const handleBackToList = () => {
    setSearchParams({});
  };

  // Categories extracted dynamically
  const categories = ['all', ...Array.from(new Set(news.map(n => language === 'ar' ? n.categoryAr : n.categoryFr)))];

  const filteredNews = news.filter(item => {
    const matchesSearch = item.titleAr.includes(searchTerm) || item.titleFr.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
      (language === 'ar' ? item.categoryAr : item.categoryFr) === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleShare = (title: string) => {
    if (navigator.share) {
      navigator.share({
        title,
        url: window.location.href
      }).catch(console.error);
    } else {
      alert(language === 'ar' ? 'تم نسخ رابط المقال الإخباري لدفتر الحافظة!' : 'Lien copié dans le presse-papier !');
    }
  };

  // PRINT CURRENT ARTICLE FUNCTION
  const handlePrint = () => {
    window.print();
  };

  if (activeArticle) {
    // Beautiful institutional Article Detail View (Printable)
    return (
      <article className="max-w-4xl mx-auto px-4 py-12 font-sans text-gray-800 animate-fadeIn" id="news-article-printable">
        
        {/* Navigation back and Share tools */}
        <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4 print:hidden">
          <button
            onClick={handleBackToList}
            className="flex items-center gap-1.5 text-sm font-bold text-red-600 hover:text-red-700 cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>{language === 'ar' ? 'العودة لجميع الأخبار' : 'Retour aux actualités'}</span>
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleShare(language === 'ar' ? activeArticle.titleAr : activeArticle.titleFr)}
              className="p-2 border border-gray-200 text-gray-600 hover:text-red-600 rounded-xl cursor-pointer"
              title="Share"
            >
              <Share2 size={16} />
            </button>
            <button
              onClick={handlePrint}
              className="p-2 border border-gray-200 text-gray-600 hover:text-red-600 rounded-xl cursor-pointer"
              title="Print Article"
            >
              <Printer size={16} />
            </button>
          </div>
        </div>

        {/* Content Details Block */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-bold uppercase">
              {language === 'ar' ? activeArticle.categoryAr : activeArticle.categoryFr}
            </span>
            <span className="text-gray-400 font-mono text-xs flex items-center gap-1">
              <Calendar size={12} /> {activeArticle.date}
            </span>
            <span className="text-gray-400 font-mono text-xs flex items-center gap-1">
              <Eye size={12} /> {activeArticle.views} {language === 'ar' ? 'مشاهدة' : 'vues'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-950 leading-tight tracking-tight font-sans">
            {language === 'ar' ? activeArticle.titleAr : activeArticle.titleFr}
          </h1>

          <p className="text-base text-gray-600 font-medium italic border-r-4 border-red-500 pr-4 pl-4 py-1 leading-relaxed bg-gray-50/50 font-sans">
            {language === 'ar' ? activeArticle.summaryAr : activeArticle.summaryFr}
          </p>

          <div className="aspect-video bg-gray-100 rounded-3xl overflow-hidden shadow-xs relative">
            <img 
              src={activeArticle.image} 
              alt={language === 'ar' ? activeArticle.titleAr : activeArticle.titleFr} 
              className="w-full h-full object-cover"
            />
          </div>

          <div className="text-sm sm:text-base text-gray-800 leading-loose whitespace-pre-wrap font-sans font-normal pt-4">
            {language === 'ar' ? activeArticle.contentAr : activeArticle.contentFr}
          </div>
        </div>
      </article>
    );
  }

  // News List Grid
  return (
    <div className="font-sans text-gray-800 bg-white min-h-[80vh]">
      
      {/* Banner */}
      <section className="bg-red-600 text-white py-16 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-3xl sm:text-4xl font-black font-sans tracking-tight">
            {language === 'ar' ? 'أخبار وتغطية الميدان' : 'Espace Presse & Actualités'}
          </h1>
          <p className="text-sm text-red-100 max-w-2xl mx-auto mt-2 font-medium font-sans">
            {language === 'ar' 
              ? 'متابعة حية وشاملة لأبرز مشاريع وتدخلات الهلال الأحمر الجزائري بلجنة ولاية سيدي بلعباس.' 
              : 'Découvrez nos reportages et actualités terrain à travers les communes de Sidi Bel Abbès.'}
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and filter toolbar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-12 border-b border-gray-100 pb-6">
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder={language === 'ar' ? 'بحث في عناوين المقالات...' : 'Rechercher un mot-clé...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-xl text-xs"
            />
          </div>

          {/* Dynamic categories selector tabs */}
          <div className="flex flex-wrap gap-1.5 w-full md:w-auto overflow-x-auto justify-start md:justify-end">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all shrink-0 cursor-pointer ${
                  selectedCategory === cat 
                    ? 'bg-red-600 text-white shadow-sm' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat === 'all' ? (language === 'ar' ? 'الكل' : 'Tous') : cat}
              </button>
            ))}
          </div>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNews.map((item) => (
            <article key={item.id} className="bg-white rounded-3xl border border-gray-100 shadow-xs hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between">
              <div>
                <div className="relative aspect-video bg-gray-100 overflow-hidden">
                  <img src={item.image} alt={language === 'ar' ? item.titleAr : item.titleFr} className="w-full h-full object-cover" />
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
              <div className="p-6 pt-0 flex justify-between items-center border-t border-gray-50 mt-4">
                <button
                  onClick={() => handleArticleClick(item.id)}
                  className="text-red-600 font-bold text-xs flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <span>{t('readMore')}</span>
                  <ArrowLeft size={12} className="rotate-180" />
                </button>
                <span className="text-[10px] font-mono text-gray-400 flex items-center gap-1"><Eye size={10} /> {item.views}</span>
              </div>
            </article>
          ))}

          {filteredNews.length === 0 && (
            <div className="col-span-full text-center py-20 text-gray-400 text-sm font-sans">
              {language === 'ar' ? 'لا توجد أخبار مطابقة لمعايير البحث حالياً.' : 'Aucun article ne correspond à votre recherche.'}
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
