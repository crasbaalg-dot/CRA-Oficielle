/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { LanguageProvider, useLanguage } from './components/LanguageContext';
import Header from './components/Header';
import Footer from './components/Footer';

// Public Views
import Home from './views/Home';
import About from './views/About';
import News from './views/News';
import Announcements from './views/Announcements';
import Events from './views/Events';
import FirstAid from './views/FirstAid';
import BloodDonation from './views/BloodDonation';
import Volunteer from './views/Volunteer';
import Contact from './views/Contact';

// Admin CMS Panel
import AdminLayout from './components/AdminLayout';

function RouteScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as any });
  }, [pathname]);
  return null;
}

function MainAppContent() {
  const { direction } = useLanguage();
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div 
      dir={direction} 
      className={`min-h-screen flex flex-col bg-white text-gray-800 ${
        direction === 'rtl' ? 'font-sans text-right' : 'font-sans text-left'
      }`}
    >
      <RouteScrollToTop />
      
      {/* Hide standard public header/footer on administrative endpoints */}
      {!isAdminRoute && <Header />}
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/news" element={<News />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/events" element={<Events />} />
          <Route path="/first-aid" element={<FirstAid />} />
          <Route path="/blood-donation" element={<BloodDonation />} />
          <Route path="/volunteer" element={<Volunteer />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* CMS Administration Path */}
          <Route path="/admin" element={<AdminLayout />} />
        </Routes>
      </main>

      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <Router>
        <MainAppContent />
      </Router>
    </LanguageProvider>
  );
}
