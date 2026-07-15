/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from './LanguageContext';
import { 
  Newspaper, 
  Megaphone, 
  Users, 
  HeartPulse, 
  Droplet, 
  ClipboardList, 
  Inbox, 
  Sliders, 
  Lock, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  TrendingUp, 
  LogOut, 
  Search,
  Eye,
  Check,
  Calendar,
  Sparkles,
  RefreshCw,
  Home
} from 'lucide-react';
import { localDb } from '../services/db';
import { 
  NewsItem, 
  AnnouncementItem, 
  Member, 
  FirstAidTopic, 
  BloodCampaign, 
  VolunteerApplication, 
  ContactMessage, 
  InstitutionStats, 
  Settings 
} from '../types';

export default function AdminLayout() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('cra_sba_admin_logged') === 'true';
  });
  const [loginEmail, setLoginEmail] = useState('cra.sba.alg@gmail.com');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<'stats' | 'news' | 'announcements' | 'members' | 'first-aid' | 'blood' | 'volunteers' | 'messages' | 'settings'>('stats');

  // Database States
  const [stats, setStats] = useState<InstitutionStats | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [firstAid, setFirstAid] = useState<FirstAidTopic[]>([]);
  const [bloodCampaigns, setBloodCampaigns] = useState<BloodCampaign[]>([]);
  const [volunteers, setVolunteers] = useState<VolunteerApplication[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  // Search filter
  const [searchTerm, setSearchTerm] = useState('');

  // Editing Modals States
  const [newsModal, setNewsModal] = useState<{ isOpen: boolean; isEdit: boolean; data: any }>({ isOpen: false, isEdit: false, data: null });
  const [annModal, setAnnModal] = useState<{ isOpen: boolean; isEdit: boolean; data: any }>({ isOpen: false, isEdit: false, data: null });
  const [memberModal, setMemberModal] = useState<{ isOpen: boolean; isEdit: boolean; data: any }>({ isOpen: false, isEdit: false, data: null });
  const [campModal, setCampModal] = useState<{ isOpen: boolean; isEdit: boolean; data: any }>({ isOpen: false, isEdit: false, data: null });
  const [faModal, setFaModal] = useState<{ isOpen: boolean; isEdit: boolean; data: any }>({ isOpen: false, isEdit: false, data: null });

  // Load All CMS Data
  const loadCmsData = async () => {
    try {
      const s = await localDb.getStats();
      const set = await localDb.getSettings();
      const n = await localDb.getNews();
      const a = await localDb.getAnnouncements();
      const m = await localDb.getMembers();
      const f = await localDb.getFirstAidTopics();
      const b = await localDb.getBloodCampaigns();
      const v = await localDb.getVolunteerApplications();
      const msg = await localDb.getContactMessages();

      setStats(s);
      setSettings(set);
      setNews(n);
      setAnnouncements(a);
      setMembers(m);
      setFirstAid(f);
      setBloodCampaigns(b);
      setVolunteers(v);
      setMessages(msg);
    } catch (e) {
      console.error('Failed to load CMS values:', e);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadCmsData();
    }
  }, [isAuthenticated]);

  // Auth Submit
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginEmail === 'cra.sba.alg@gmail.com' && loginPassword === 'CRA-SBA-2026') {
      setIsAuthenticated(true);
      setLoginError('');
      localStorage.setItem('cra_sba_admin_logged', 'true');
    } else {
      setLoginError(
        language === 'ar' 
          ? 'خطأ في البريد الإلكتروني أو كلمة المرور الافتراضية (CRA-SBA-2026)' 
          : 'Email ou mot de passe par défaut incorrect (CRA-SBA-2026).'
      );
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('cra_sba_admin_logged');
    navigate('/');
  };

  // Delete Action Handlers
  const handleDeleteNews = async (id: string) => {
    if (confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا الخبر؟' : 'Confirmer la suppression de cet article ?')) {
      await localDb.deleteNewsItem(id);
      loadCmsData();
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا الإعلان؟' : 'Confirmer la suppression de cette annonce ?')) {
      await localDb.deleteAnnouncement(id);
      loadCmsData();
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا العضو؟' : 'Confirmer la suppression de ce membre ?')) {
      await localDb.deleteMember(id);
      loadCmsData();
    }
  };

  const handleDeleteCampaign = async (id: string) => {
    if (confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذه الحملة؟' : 'Confirmer la suppression de cette campagne ?')) {
      await localDb.deleteBloodCampaign(id);
      loadCmsData();
    }
  };

  const handleDeleteTopic = async (id: string) => {
    if (confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا الموضوع الإسعافي؟' : 'Confirmer la suppression ?')) {
      await localDb.deleteFirstAidTopic(id);
      loadCmsData();
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (confirm(language === 'ar' ? 'هل تريد حذف هذه الرسالة؟' : 'Supprimer ce message ?')) {
      await localDb.deleteContactMessage(id);
      loadCmsData();
    }
  };

  // Save Modal Action Handlers
  const handleSaveNews = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget as HTMLFormElement);
    const itemData = {
      titleAr: fd.get('titleAr') as string,
      titleFr: fd.get('titleFr') as string,
      summaryAr: fd.get('summaryAr') as string,
      summaryFr: fd.get('summaryFr') as string,
      contentAr: fd.get('contentAr') as string,
      contentFr: fd.get('contentFr') as string,
      categoryAr: fd.get('categoryAr') as string,
      categoryFr: fd.get('categoryFr') as string,
      image: (fd.get('image') as string) || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=600&auto=format&fit=crop',
      date: (fd.get('date') as string) || new Date().toISOString().split('T')[0],
      isPinned: fd.get('isPinned') === 'on',
      isDraft: fd.get('isDraft') === 'on',
      views: newsModal.isEdit ? newsModal.data.views : 0
    };

    await localDb.saveNewsItem(newsModal.isEdit ? { ...itemData, id: newsModal.data.id } : itemData);
    setNewsModal({ isOpen: false, isEdit: false, data: null });
    loadCmsData();
  };

  const handleSaveAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget as HTMLFormElement);
    const itemData = {
      titleAr: fd.get('titleAr') as string,
      titleFr: fd.get('titleFr') as string,
      contentAr: fd.get('contentAr') as string,
      contentFr: fd.get('contentFr') as string,
      priority: (fd.get('priority') as any) || 'medium',
      date: (fd.get('date') as string) || new Date().toISOString().split('T')[0],
      isPinned: fd.get('isPinned') === 'on'
    };

    await localDb.saveAnnouncement(annModal.isEdit ? { ...itemData, id: annModal.data.id } : itemData);
    setAnnModal({ isOpen: false, isEdit: false, data: null });
    loadCmsData();
  };

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget as HTMLFormElement);
    const itemData = {
      nameAr: fd.get('nameAr') as string,
      nameFr: fd.get('nameFr') as string,
      roleAr: fd.get('roleAr') as string,
      roleFr: fd.get('roleFr') as string,
      bioAr: fd.get('bioAr') as string,
      bioFr: fd.get('bioFr') as string,
      image: (fd.get('image') as string) || 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=400&auto=format&fit=crop',
      email: fd.get('email') as string,
      phone: fd.get('phone') as string,
      displayOrder: parseInt(fd.get('displayOrder') as string) || 1
    };

    await localDb.saveMember(memberModal.isEdit ? { ...itemData, id: memberModal.data.id } : itemData);
    setMemberModal({ isOpen: false, isEdit: false, data: null });
    loadCmsData();
  };

  const handleSaveCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget as HTMLFormElement);
    const itemData = {
      titleAr: fd.get('titleAr') as string,
      titleFr: fd.get('titleFr') as string,
      locationAr: fd.get('locationAr') as string,
      locationFr: fd.get('locationFr') as string,
      date: (fd.get('date') as string) || new Date().toISOString().split('T')[0],
      time: (fd.get('time') as string) || '09:00 - 16:00',
      status: (fd.get('status') as any) || 'upcoming',
      descriptionAr: fd.get('descriptionAr') as string,
      descriptionFr: fd.get('descriptionFr') as string,
      collectedUnits: parseInt(fd.get('collectedUnits') as string) || 0
    };

    await localDb.saveBloodCampaign(campModal.isEdit ? { ...itemData, id: campModal.data.id } : itemData);
    setCampModal({ isOpen: false, isEdit: false, data: null });
    loadCmsData();
  };

  const handleSaveFirstAid = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget as HTMLFormElement);
    const stepsAr = (fd.get('stepsAr') as string).split('\n').filter(s => s.trim() !== '');
    const stepsFr = (fd.get('stepsFr') as string).split('\n').filter(s => s.trim() !== '');
    
    const itemData = {
      titleAr: fd.get('titleAr') as string,
      titleFr: fd.get('titleFr') as string,
      descriptionAr: fd.get('descriptionAr') as string,
      descriptionFr: fd.get('descriptionFr') as string,
      emergencyInstructionsAr: fd.get('emergencyInstructionsAr') as string,
      emergencyInstructionsFr: fd.get('emergencyInstructionsFr') as string,
      stepsAr,
      stepsFr,
      icon: (fd.get('icon') as string) || 'HeartPulse'
    };

    await localDb.saveFirstAidTopic(faModal.isEdit ? { ...itemData, id: faModal.data.id } : itemData);
    setFaModal({ isOpen: false, isEdit: false, data: null });
    loadCmsData();
  };

  // Update Stats & Settings directly
  const handleUpdateStats = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget as HTMLFormElement);
    const updatedStats: Partial<InstitutionStats> = {
      volunteersCount: parseInt(fd.get('volunteersCount') as string) || 0,
      bloodUnitsCount: parseInt(fd.get('bloodUnitsCount') as string) || 0,
      firstAidTrainedCount: parseInt(fd.get('firstAidTrainedCount') as string) || 0,
      campaignsCount: parseInt(fd.get('campaignsCount') as string) || 0,
    };
    await localDb.updateStats(updatedStats);
    alert(language === 'ar' ? 'تم حفظ الإحصائيات بنجاح!' : 'Statistiques mises à jour !');
    loadCmsData();
  };

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget as HTMLFormElement);
    const updatedSettings: Partial<Settings> = {
      siteNameAr: fd.get('siteNameAr') as string,
      siteNameFr: fd.get('siteNameFr') as string,
      phone: fd.get('phone') as string,
      emergencyPhone: fd.get('emergencyPhone') as string,
      email: fd.get('email') as string,
      addressAr: fd.get('addressAr') as string,
      addressFr: fd.get('addressFr') as string,
      workingHoursAr: fd.get('workingHoursAr') as string,
      workingHoursFr: fd.get('workingHoursFr') as string,
      facebookUrl: fd.get('facebookUrl') as string,
      twitterUrl: fd.get('twitterUrl') as string,
      youtubeUrl: fd.get('youtubeUrl') as string,
      instagramUrl: fd.get('instagramUrl') as string,
    };
    await localDb.updateSettings(updatedSettings);
    alert(language === 'ar' ? 'تم حفظ إعدادات الموقع بنجاح!' : 'Paramètres du site enregistrés !');
    loadCmsData();
  };

  // Volunteer Status Updater
  const handleApproveVolunteer = async (id: string, action: 'approved' | 'rejected') => {
    await localDb.updateVolunteerStatus(id, action);
    loadCmsData();
  };

  const handleMarkMessageRead = async (id: string) => {
    await localDb.markMessageAsRead(id);
    loadCmsData();
  };

  if (!isAuthenticated) {
    // Elegant login viewport for administrators
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <div className="w-16 h-16 flex items-center justify-center bg-red-100 rounded-full">
              <Lock className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-2xl font-extrabold text-gray-950">
            {language === 'ar' ? 'بوابة إدارة الموقع الرسمي' : 'Portail de Gestion Officiel'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-500 font-medium">
            {language === 'ar' 
              ? 'الهلال الأحمر الجزائري - سيدي بلعباس' 
              : 'Croissant-Rouge Algérien - Sidi Bel Abbès'}
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-xl rounded-2xl border border-gray-100 sm:px-10">
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                  {language === 'ar' ? 'البريد الإلكتروني للإدارة' : 'E-mail Administratif'}
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="appearance-none block w-full px-3.5 py-2.5 border border-gray-300 rounded-xl shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                  {language === 'ar' ? 'كلمة المرور' : 'Mot de passe'}
                </label>
                <div className="mt-1">
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="CRA-SBA-2026"
                    className="appearance-none block w-full px-3.5 py-2.5 border border-gray-300 rounded-xl shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                <p className="mt-1.5 text-xs text-gray-400">
                  {language === 'ar' ? 'كلمة المرور الافتراضية للمراجعة: CRA-SBA-2026' : 'Mot de passe d\'évaluation : CRA-SBA-2026'}
                </p>
              </div>

              {loginError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-medium">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-red-600 hover:bg-red-700 transition-colors"
              >
                {language === 'ar' ? 'تسجيل الدخول الآمن' : 'Se Connecter'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard Admin UI Viewport
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row font-sans">
      
      {/* CMS Left/Right Sidebar (Depending on Lang direction) */}
      <aside className="w-full lg:w-72 bg-gray-900 text-gray-200 flex flex-col shrink-0">
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-red-500 animate-pulse" />
            <div>
              <h3 className="font-bold text-white text-sm">CRA - SBA</h3>
              <span className="text-[10px] text-gray-400 font-mono tracking-widest uppercase">Admin System</span>
            </div>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
            title="Public Website"
          >
            <Home size={16} />
          </button>
        </div>

        {/* Sidebar Navigation Links */}
        <nav className="p-4 flex-1 space-y-1.5">
          <button
            onClick={() => setActiveTab('stats')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'stats' ? 'bg-red-600 text-white shadow' : 'hover:bg-gray-800 text-gray-300'
            }`}
          >
            <TrendingUp size={18} />
            <span>{language === 'ar' ? 'الإحصائيات والملخص' : 'Statistiques & Résumé'}</span>
          </button>

          <button
            onClick={() => setActiveTab('news')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'news' ? 'bg-red-600 text-white shadow' : 'hover:bg-gray-800 text-gray-300'
            }`}
          >
            <Newspaper size={18} />
            <span>{language === 'ar' ? 'إدارة الأخبار والمقالات' : 'Gérer les Actualités'}</span>
            <span className="ml-auto text-xs bg-gray-800 px-2 py-0.5 rounded-full font-mono text-gray-400">{news.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('announcements')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'announcements' ? 'bg-red-600 text-white shadow' : 'hover:bg-gray-800 text-gray-300'
            }`}
          >
            <Megaphone size={18} />
            <span>{language === 'ar' ? 'الإعلانات والإنذارات' : 'Alertes & Communiqués'}</span>
            <span className="ml-auto text-xs bg-gray-800 px-2 py-0.5 rounded-full font-mono text-gray-400">{announcements.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('members')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'members' ? 'bg-red-600 text-white shadow' : 'hover:bg-gray-800 text-gray-300'
            }`}
          >
            <Users size={18} />
            <span>{language === 'ar' ? 'هيكل وأعضاء اللجنة' : 'Membres du Comité'}</span>
            <span className="ml-auto text-xs bg-gray-800 px-2 py-0.5 rounded-full font-mono text-gray-400">{members.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('blood')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'blood' ? 'bg-red-600 text-white shadow' : 'hover:bg-gray-800 text-gray-300'
            }`}
          >
            <Droplet size={18} />
            <span>{language === 'ar' ? 'حملات التبرع بالدم' : 'Collectes de Sang'}</span>
            <span className="ml-auto text-xs bg-gray-800 px-2 py-0.5 rounded-full font-mono text-gray-400">{bloodCampaigns.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('first-aid')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'first-aid' ? 'bg-red-600 text-white shadow' : 'hover:bg-gray-800 text-gray-300'
            }`}
          >
            <HeartPulse size={18} />
            <span>{language === 'ar' ? 'التوجيهات والدروس الإسعافية' : 'Dossiers Secourisme'}</span>
            <span className="ml-auto text-xs bg-gray-800 px-2 py-0.5 rounded-full font-mono text-gray-400">{firstAid.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('volunteers')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'volunteers' ? 'bg-red-600 text-white shadow' : 'hover:bg-gray-800 text-gray-300'
            }`}
          >
            <ClipboardList size={18} />
            <span>{language === 'ar' ? 'طلبات متطوعي الولاية' : 'Candidatures Bénévoles'}</span>
            <span className={`ml-auto text-xs px-2 py-0.5 rounded-full font-mono ${
              volunteers.filter(v => v.status === 'pending').length > 0 ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-800 text-gray-400'
            }`}>
              {volunteers.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'messages' ? 'bg-red-600 text-white shadow' : 'hover:bg-gray-800 text-gray-300'
            }`}
          >
            <Inbox size={18} />
            <span>{language === 'ar' ? 'صندوق رسائل المواطنين' : 'Messages Reçus'}</span>
            <span className={`ml-auto text-xs px-2 py-0.5 rounded-full font-mono ${
              messages.filter(m => !m.isRead).length > 0 ? 'bg-amber-500 text-white' : 'bg-gray-800 text-gray-400'
            }`}>
              {messages.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'settings' ? 'bg-red-600 text-white shadow' : 'hover:bg-gray-800 text-gray-300'
            }`}
          >
            <Sliders size={18} />
            <span>{language === 'ar' ? 'إعدادات الموقع المتقدمة' : 'Configuration Générale'}</span>
          </button>
        </nav>

        {/* User profile / Logout */}
        <div className="p-4 border-t border-gray-800 bg-gray-950/40">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 bg-red-600 text-white font-bold text-sm rounded-full flex items-center justify-center">
              CRA
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-white leading-tight">cra.sba.alg@gmail.com</p>
              <span className="text-[10px] text-gray-500 uppercase font-bold">Super Admin</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-gray-800 hover:bg-red-600 hover:text-white text-gray-300 font-bold text-xs rounded-xl transition-all duration-200 cursor-pointer"
          >
            <LogOut size={14} />
            <span>{language === 'ar' ? 'تسجيل الخروج الآمن' : 'Déconnexion'}</span>
          </button>
        </div>
      </aside>

      {/* Main Panel Content Container */}
      <main className="flex-1 p-6 md:p-10 max-w-full overflow-x-hidden">
        
        {/* Top Header Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-black text-gray-950 font-sans tracking-tight">
              {activeTab === 'stats' && (language === 'ar' ? 'نظرة عامة على نشاطات اللجنة الولائية' : 'Vue globale du Comité de Wilaya')}
              {activeTab === 'news' && (language === 'ar' ? 'إدارة الأخبار والمقالات المنشورة' : 'Gestion des Actualités')}
              {activeTab === 'announcements' && (language === 'ar' ? 'الإعلانات والإنذارات العاجلة' : 'Gestion des Communiqués & Alertes')}
              {activeTab === 'members' && (language === 'ar' ? 'هيكل وأعضاء اللجنة الولائية بسيدي بلعباس' : 'Héritage et Structure des Membres')}
              {activeTab === 'blood' && (language === 'ar' ? 'برنامج حملات التبرع بالدم' : 'Donneurs & Collectes de Sang')}
              {activeTab === 'first-aid' && (language === 'ar' ? 'المكتبة التعليمية للإسعافات الأولية' : 'Portail de Secourisme')}
              {activeTab === 'volunteers' && (language === 'ar' ? 'طلبات الانضمام لمتطوعي الولاية' : 'Candidatures Bénévoles')}
              {activeTab === 'messages' && (language === 'ar' ? 'رسائل المواطنين والشركاء' : 'Messages reçus')}
              {activeTab === 'settings' && (language === 'ar' ? 'إعدادات وبيانات الاتصال للجنة' : 'Configuration du Site')}
            </h2>
            <p className="text-sm text-gray-500 font-medium">
              {language === 'ar' ? 'تحكم في محتوى الموقع وتواصل مع المجتمع بنقرة زر.' : 'Pilotez l\'intégralité du site sans compétences techniques de programmation.'}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={loadCmsData}
              className="p-2.5 border border-gray-200 rounded-xl bg-white text-gray-600 hover:text-red-600 transition-colors cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>

        {/* TAB 1: STATISTICS & METRICS */}
        {activeTab === 'stats' && stats && (
          <div className="space-y-8 animate-fadeIn">
            {/* Quick Metrics Form */}
            <form onSubmit={handleUpdateStats} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-950 mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
                <Sparkles className="text-amber-500 w-5 h-5 animate-pulse" />
                <span>{language === 'ar' ? 'تعديل أرقام وإحصائيات الهلال الأحمر لولاية سيدي بلعباس' : 'Modifier les indicateurs clés officiels'}</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">{language === 'ar' ? 'المتطوعون النشطون' : 'Bénévoles Actifs'}</label>
                  <input type="number" name="volunteersCount" defaultValue={stats.volunteersCount} required className="w-full px-3.5 py-2 border border-gray-300 rounded-xl" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">{language === 'ar' ? 'أكياس الدم المجمعة' : 'Poches de Sang'}</label>
                  <input type="number" name="bloodUnitsCount" defaultValue={stats.bloodUnitsCount} required className="w-full px-3.5 py-2 border border-gray-300 rounded-xl" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">{language === 'ar' ? 'مسعفين تم تدريبهم' : 'Trained Secouristes'}</label>
                  <input type="number" name="firstAidTrainedCount" defaultValue={stats.firstAidTrainedCount} required className="w-full px-3.5 py-2 border border-gray-300 rounded-xl" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">{language === 'ar' ? 'حملات إنسانية منفذة' : 'Campagnes Menées'}</label>
                  <input type="number" name="campaignsCount" defaultValue={stats.campaignsCount} required className="w-full px-3.5 py-2 border border-gray-300 rounded-xl" />
                </div>
              </div>
              <button type="submit" className="px-5 py-2 bg-red-600 text-white font-bold text-xs rounded-xl hover:bg-red-700 cursor-pointer">
                {language === 'ar' ? 'حفظ الأرقام الجديدة' : 'Mettre à jour'}
              </button>
            </form>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-red-50 p-6 rounded-2xl border border-red-100 flex items-center justify-between">
                <div>
                  <p className="text-xs text-red-600 font-bold uppercase tracking-wider">{language === 'ar' ? 'المتطوعون' : 'Bénévoles'}</p>
                  <h4 className="text-3xl font-black text-red-950 mt-1">{stats.volunteersCount}</h4>
                </div>
                <ClipboardList className="w-10 h-10 text-red-600/40" />
              </div>
              <div className="bg-red-50 p-6 rounded-2xl border border-red-100 flex items-center justify-between">
                <div>
                  <p className="text-xs text-red-600 font-bold uppercase tracking-wider">{language === 'ar' ? 'أكياس الدم' : 'Don de Sang'}</p>
                  <h4 className="text-3xl font-black text-red-950 mt-1">{stats.bloodUnitsCount}</h4>
                </div>
                <Droplet className="w-10 h-10 text-red-600/40" />
              </div>
              <div className="bg-red-50 p-6 rounded-2xl border border-red-100 flex items-center justify-between">
                <div>
                  <p className="text-xs text-red-600 font-bold uppercase tracking-wider">{language === 'ar' ? 'المسعفين' : 'Secouristes Formés'}</p>
                  <h4 className="text-3xl font-black text-red-950 mt-1">{stats.firstAidTrainedCount}</h4>
                </div>
                <HeartPulse className="w-10 h-10 text-red-600/40" />
              </div>
              <div className="bg-red-50 p-6 rounded-2xl border border-red-100 flex items-center justify-between">
                <div>
                  <p className="text-xs text-red-600 font-bold uppercase tracking-wider">{language === 'ar' ? 'الحملات الإنسانية' : 'Campagnes'}</p>
                  <h4 className="text-3xl font-black text-red-950 mt-1">{stats.campaignsCount}</h4>
                </div>
                <TrendingUp className="w-10 h-10 text-red-600/40" />
              </div>
            </div>

            {/* Platform Quick Start Instructions */}
            <div className="p-6 bg-gray-900 text-gray-200 rounded-2xl border border-gray-800">
              <h3 className="text-lg font-bold text-white mb-2">{language === 'ar' ? 'دليل إدارة المحتوى المتقدم' : 'Guide Pratique Administration'}</h3>
              <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                {language === 'ar' 
                  ? 'يرجى العلم أن هذه المنصة تدعم لغتين (العربية والفرنسية). لضمان مظهر احترافي ومثالي للموقع، احرص على ملء بيانات العناوين والقصص الإخبارية بكلتا اللغتين عند إضافة أو تعديل المقالات، الإعلانات، أو الأعضاء.'
                  : 'Ce CMS est intégralement bilingue (Arabe & Français). Afin de préserver la qualité de la mise en page institutionnelle, veillez à toujours saisir les titres et contenus dans les deux langues.'}
              </p>
              <div className="flex gap-4">
                <button onClick={() => setActiveTab('news')} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold cursor-pointer">
                  {language === 'ar' ? 'أضف خبراً جديداً' : 'Créer une actualité'}
                </button>
                <button onClick={() => setActiveTab('volunteers')} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl text-xs font-bold cursor-pointer">
                  {language === 'ar' ? 'معالجة طلبات التطوع' : 'Voir les candidatures'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: NEWS MANAGEMENT */}
        {activeTab === 'news' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder={language === 'ar' ? 'بحث في العناوين...' : 'Rechercher par titre...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 border border-gray-300 rounded-xl text-sm"
                />
              </div>
              <button
                onClick={() => setNewsModal({ isOpen: true, isEdit: false, data: null })}
                className="ml-4 px-4 py-1.5 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 flex items-center gap-1 cursor-pointer"
              >
                <Plus size={16} />
                <span>{language === 'ar' ? 'إضافة خبر' : 'Nouveau'}</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-100 text-sm">
                <thead className="bg-gray-50 text-xs font-bold uppercase tracking-wider text-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left">{language === 'ar' ? 'العنوان (عربي)' : 'Titre (Ar)'}</th>
                    <th className="px-6 py-4 text-left">{language === 'ar' ? 'العنوان (فرنسي)' : 'Titre (Fr)'}</th>
                    <th className="px-6 py-4 text-left">{language === 'ar' ? 'الفئة' : 'Catégorie'}</th>
                    <th className="px-6 py-4 text-left">{language === 'ar' ? 'التاريخ' : 'Date'}</th>
                    <th className="px-6 py-4 text-left">{language === 'ar' ? 'المشاهدات' : 'Vues'}</th>
                    <th className="px-6 py-4 text-center">{language === 'ar' ? 'إجراءات' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-800">
                  {news.filter(n => n.titleAr.includes(searchTerm) || n.titleFr.toLowerCase().includes(searchTerm.toLowerCase())).map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 max-w-xs truncate font-medium text-gray-950 font-sans">{item.titleAr}</td>
                      <td className="px-6 py-4 max-w-xs truncate font-sans">{item.titleFr}</td>
                      <td className="px-6 py-4 font-bold text-xs"><span className="px-2 py-0.5 bg-red-50 text-red-600 rounded">{item.categoryAr}</span></td>
                      <td className="px-6 py-4 font-mono text-xs">{item.date}</td>
                      <td className="px-6 py-4 font-mono text-xs">{item.views}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => setNewsModal({ isOpen: true, isEdit: true, data: item })} className="p-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-red-600 rounded cursor-pointer" title="Edit">
                            <Edit size={14} />
                          </button>
                          <button onClick={() => handleDeleteNews(item.id)} className="p-1.5 bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded cursor-pointer" title="Delete">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ANNOUNCEMENTS MANAGEMENT */}
        {activeTab === 'announcements' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder={language === 'ar' ? 'بحث في الإعلانات...' : 'Rechercher...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 border border-gray-300 rounded-xl text-sm"
                />
              </div>
              <button
                onClick={() => setAnnModal({ isOpen: true, isEdit: false, data: null })}
                className="ml-4 px-4 py-1.5 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 flex items-center gap-1 cursor-pointer"
              >
                <Plus size={16} />
                <span>{language === 'ar' ? 'إضافة إعلان' : 'Nouvelle Annonce'}</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-100 text-sm">
                <thead className="bg-gray-50 text-xs font-bold uppercase tracking-wider text-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left">{language === 'ar' ? 'عنوان الإعلان (Ar)' : 'Titre (Ar)'}</th>
                    <th className="px-6 py-4 text-left">{language === 'ar' ? 'عنوان الإعلان (Fr)' : 'Titre (Fr)'}</th>
                    <th className="px-6 py-4 text-left">{language === 'ar' ? 'الأولوية' : 'Priorité'}</th>
                    <th className="px-6 py-4 text-left">{language === 'ar' ? 'التاريخ' : 'Date'}</th>
                    <th className="px-6 py-4 text-center">{language === 'ar' ? 'إجراءات' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-800">
                  {announcements.filter(a => a.titleAr.includes(searchTerm) || a.titleFr.toLowerCase().includes(searchTerm.toLowerCase())).map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 max-w-xs truncate font-medium text-gray-950 font-sans">{item.titleAr}</td>
                      <td className="px-6 py-4 max-w-xs truncate font-sans">{item.titleFr}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                          item.priority === 'high' || item.priority === 'critical' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {item.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs">{item.date}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => setAnnModal({ isOpen: true, isEdit: true, data: item })} className="p-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-red-600 rounded cursor-pointer">
                            <Edit size={14} />
                          </button>
                          <button onClick={() => handleDeleteAnnouncement(item.id)} className="p-1.5 bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded cursor-pointer">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: MEMBERS */}
        {activeTab === 'members' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-sm font-bold text-gray-700">{language === 'ar' ? 'ترتيب وفرز أعضاء اللجنة ومكتب سيدي بلعباس الرئيسي' : 'Membres actifs du Comité'}</h3>
              <button
                onClick={() => setMemberModal({ isOpen: true, isEdit: false, data: null })}
                className="px-4 py-1.5 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 flex items-center gap-1 cursor-pointer"
              >
                <Plus size={16} />
                <span>{language === 'ar' ? 'إضافة عضو' : 'Nouveau Membre'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {members.map((m) => (
                <div key={m.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between">
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <img src={m.image} alt={m.nameFr} className="w-14 h-14 rounded-full object-cover border-2 border-red-100 shrink-0" />
                      <div>
                        <h4 className="font-bold text-gray-950 font-sans">{m.nameAr}</h4>
                        <p className="text-xs text-red-600 font-semibold">{m.roleAr}</p>
                        <p className="text-[10px] text-gray-400 font-sans">{m.nameFr}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed font-sans">{m.bioAr}</p>
                  </div>
                  <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex justify-between items-center text-xs">
                    <span className="font-mono text-gray-400">Order: {m.displayOrder}</span>
                    <div className="flex gap-2">
                      <button onClick={() => setMemberModal({ isOpen: true, isEdit: true, data: m })} className="p-1.5 bg-white border border-gray-200 text-gray-600 hover:text-red-600 rounded cursor-pointer">
                        <Edit size={12} />
                      </button>
                      <button onClick={() => handleDeleteMember(m.id)} className="p-1.5 bg-white border border-gray-200 text-gray-600 hover:text-red-600 rounded cursor-pointer">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: BLOOD CAMPAIGNS */}
        {activeTab === 'blood' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-sm font-bold text-gray-700">{language === 'ar' ? 'حملات التبرع وتزويد بنك دم مستشفى عبد القادر حساني' : 'Planification des Campagnes de Don de Sang'}</h3>
              <button
                onClick={() => setCampModal({ isOpen: true, isEdit: false, data: null })}
                className="px-4 py-1.5 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 flex items-center gap-1 cursor-pointer"
              >
                <Plus size={16} />
                <span>{language === 'ar' ? 'إضافة حملة' : 'Nouvelle Collecte'}</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-100 text-sm">
                <thead className="bg-gray-50 text-xs font-bold uppercase tracking-wider text-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left">{language === 'ar' ? 'عنوان الحملة (Ar)' : 'Campagne (Ar)'}</th>
                    <th className="px-6 py-4 text-left">{language === 'ar' ? 'الموقع' : 'Lieu'}</th>
                    <th className="px-6 py-4 text-left">{language === 'ar' ? 'التاريخ والوقت' : 'Date & Heure'}</th>
                    <th className="px-6 py-4 text-left">{language === 'ar' ? 'الحالة' : 'Statut'}</th>
                    <th className="px-6 py-4 text-left">{language === 'ar' ? 'الوحدات المجمعة' : 'Unités'}</th>
                    <th className="px-6 py-4 text-center">{language === 'ar' ? 'إجراءات' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-800">
                  {bloodCampaigns.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 max-w-xs truncate font-medium text-gray-950 font-sans">{item.titleAr}</td>
                      <td className="px-6 py-4 font-sans">{item.locationAr}</td>
                      <td className="px-6 py-4 text-xs font-sans">
                        <div className="font-bold">{item.date}</div>
                        <div className="text-gray-400 text-[10px]">{item.time}</div>
                      </td>
                      <td className="px-6 py-4 text-xs">
                        <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase ${
                          item.status === 'upcoming' ? 'bg-amber-50 text-amber-600' :
                          item.status === 'ongoing' ? 'bg-green-50 text-green-600 animate-pulse' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-red-600 font-bold">{item.collectedUnits || 0}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => setCampModal({ isOpen: true, isEdit: true, data: item })} className="p-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-red-600 rounded cursor-pointer">
                            <Edit size={14} />
                          </button>
                          <button onClick={() => handleDeleteCampaign(item.id)} className="p-1.5 bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded cursor-pointer">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: FIRST AID EDUCATION */}
        {activeTab === 'first-aid' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-sm font-bold text-gray-700">{language === 'ar' ? 'إدارة دروس الإسعافات الأولية وإنقاذ الأرواح' : 'Secourisme - Gestion des fiches éducatives'}</h3>
              <button
                onClick={() => setFaModal({ isOpen: true, isEdit: false, data: null })}
                className="px-4 py-1.5 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 flex items-center gap-1 cursor-pointer"
              >
                <Plus size={16} />
                <span>{language === 'ar' ? 'موضوع جديد' : 'Nouveau Dossier'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {firstAid.map((topic) => (
                <div key={topic.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-3 border-b border-gray-50 pb-3">
                      <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600">
                        <HeartPulse size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-950 font-sans">{topic.titleAr}</h4>
                        <p className="text-[10px] text-gray-400 font-sans">{topic.titleFr}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-3 mb-4 leading-relaxed font-sans">{topic.descriptionAr}</p>
                    <div className="p-3 bg-red-50 rounded-xl border border-red-100 text-xs text-red-800 font-sans">
                      <span className="font-bold">{language === 'ar' ? 'تعليمات الطوارئ: ' : 'Urgence : '}</span>
                      {topic.emergencyInstructionsAr}
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-50 flex justify-between items-center text-xs">
                    <span className="text-gray-400 font-sans">{topic.stepsAr.length} {language === 'ar' ? 'خطوات إسعافية' : 'étapes clés'}</span>
                    <div className="flex gap-2">
                      <button onClick={() => setFaModal({ isOpen: true, isEdit: true, data: topic })} className="p-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-red-600 rounded cursor-pointer">
                        <Edit size={14} />
                      </button>
                      <button onClick={() => handleDeleteTopic(topic.id)} className="p-1.5 bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded cursor-pointer">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: VOLUNTEERS APPLICATIONS */}
        {activeTab === 'volunteers' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-100 text-sm">
                <thead className="bg-gray-50 text-xs font-bold uppercase tracking-wider text-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left">{language === 'ar' ? 'الاسم والاتصال' : 'Nom & Contact'}</th>
                    <th className="px-6 py-4 text-left">{language === 'ar' ? 'فصيلة الدم والمهنة' : 'Groupe & Profession'}</th>
                    <th className="px-6 py-4 text-left">{language === 'ar' ? 'الخبرات والمهارات' : 'Compétences'}</th>
                    <th className="px-6 py-4 text-left">{language === 'ar' ? 'التاريخ' : 'Date de demande'}</th>
                    <th className="px-6 py-4 text-left">{language === 'ar' ? 'الحالة' : 'Statut'}</th>
                    <th className="px-6 py-4 text-center">{language === 'ar' ? 'إجراءات' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-800">
                  {volunteers.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-sans">
                        <div className="font-bold text-gray-950">{item.fullName}</div>
                        <div className="text-gray-400 text-xs">{item.phone}</div>
                        <div className="text-gray-400 text-[10px] font-mono">{item.email}</div>
                      </td>
                      <td className="px-6 py-4 text-xs font-sans">
                        <div className="font-bold text-red-600">{language === 'ar' ? 'الفصيلة: ' : 'Sang: '} {item.bloodType}</div>
                        <div className="text-gray-500 mt-0.5">{item.profession}</div>
                      </td>
                      <td className="px-6 py-4 text-xs max-w-xs truncate font-sans" title={item.skillsAr || item.skillsFr}>
                        {item.skillsAr || item.skillsFr || '—'}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs">{item.appliedDate}</td>
                      <td className="px-6 py-4 text-xs">
                        <span className={`px-2 py-0.5 rounded font-bold uppercase ${
                          item.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                          item.status === 'approved' ? 'bg-green-50 text-green-600' :
                          'bg-red-50 text-red-600'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-1.5">
                          {item.status === 'pending' && (
                            <>
                              <button 
                                onClick={() => handleApproveVolunteer(item.id, 'approved')} 
                                className="px-2 py-1 bg-green-50 hover:bg-green-100 text-green-600 rounded text-xs font-bold cursor-pointer"
                              >
                                {language === 'ar' ? 'موافقة' : 'Approuver'}
                              </button>
                              <button 
                                onClick={() => handleApproveVolunteer(item.id, 'rejected')} 
                                className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded text-xs font-bold cursor-pointer"
                              >
                                {language === 'ar' ? 'رفض' : 'Rejeter'}
                              </button>
                            </>
                          )}
                          {item.status !== 'pending' && (
                            <span className="text-gray-400 text-xs">—</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {volunteers.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-400 text-sm font-sans">
                        {language === 'ar' ? 'لا توجد طلبات تطوع جديدة حالياً.' : 'Aucune demande d\'adhésion en attente.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 8: CONTACT MESSAGES */}
        {activeTab === 'messages' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-100 text-sm">
                <thead className="bg-gray-50 text-xs font-bold uppercase tracking-wider text-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left">{language === 'ar' ? 'المرسل والاتصال' : 'Expéditeur'}</th>
                    <th className="px-6 py-4 text-left">{language === 'ar' ? 'الموضوع والرسالة' : 'Sujet & Message'}</th>
                    <th className="px-6 py-4 text-left">{language === 'ar' ? 'التاريخ' : 'Date'}</th>
                    <th className="px-6 py-4 text-left">{language === 'ar' ? 'مقروءة' : 'État'}</th>
                    <th className="px-6 py-4 text-center">{language === 'ar' ? 'إجراءات' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-800">
                  {messages.map((item) => (
                    <tr key={item.id} className={`hover:bg-gray-50 ${!item.isRead ? 'bg-amber-50/20' : ''}`}>
                      <td className="px-6 py-4 font-sans">
                        <div className="font-bold text-gray-950">{item.name}</div>
                        <div className="text-gray-400 text-xs">{item.phone || '—'}</div>
                        <div className="text-gray-400 text-[10px] font-mono">{item.email}</div>
                      </td>
                      <td className="px-6 py-4 font-sans">
                        <div className="font-bold text-gray-900">{item.subject}</div>
                        <p className="text-xs text-gray-500 mt-1 max-w-md break-all whitespace-pre-wrap">{item.message}</p>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs shrink-0 whitespace-nowrap">{item.date}</td>
                      <td className="px-6 py-4 text-xs">
                        {item.isRead ? (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded font-bold uppercase">READ</span>
                        ) : (
                          <span className="px-2 py-0.5 bg-amber-500 text-white rounded font-bold uppercase animate-pulse">NEW</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-1.5">
                          {!item.isRead && (
                            <button 
                              onClick={() => handleMarkMessageRead(item.id)} 
                              className="p-1.5 bg-white border border-gray-200 hover:bg-gray-100 text-gray-600 hover:text-green-600 rounded cursor-pointer"
                              title="Mark as Read"
                            >
                              <Check size={14} />
                            </button>
                          )}
                          <button 
                            onClick={() => handleDeleteMessage(item.id)} 
                            className="p-1.5 bg-white border border-gray-200 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {messages.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-400 text-sm font-sans">
                        {language === 'ar' ? 'صندوق الوارد فارغ حالياً.' : 'Aucun message reçu.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 9: SETTINGS MANAGEMENT */}
        {activeTab === 'settings' && settings && (
          <form onSubmit={handleUpdateSettings} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6 animate-fadeIn max-w-4xl">
            <h3 className="text-lg font-bold text-gray-950 border-b border-gray-100 pb-3 mb-4">
              {language === 'ar' ? 'بيانات الاتصال والمعلومات العامة للموقع الرسمي' : 'Informations Générales du Site'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">اسم الموقع (Ar)</label>
                <input type="text" name="siteNameAr" defaultValue={settings.siteNameAr} required className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Nom du Site (Fr)</label>
                <input type="text" name="siteNameFr" defaultValue={settings.siteNameFr} required className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">الهاتف الرئيسي</label>
                <input type="text" name="phone" defaultValue={settings.phone} required className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl font-mono" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">هاتف الطوارئ</label>
                <input type="text" name="emergencyPhone" defaultValue={settings.emergencyPhone} required className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl font-mono text-red-600 font-bold" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">البريد الإلكتروني للجنة</label>
                <input type="email" name="email" defaultValue={settings.email} required className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl font-mono" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">العنوان بالعربية</label>
                <input type="text" name="addressAr" defaultValue={settings.addressAr} required className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Adresse en Français</label>
                <input type="text" name="addressFr" defaultValue={settings.addressFr} required className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">أوقات العمل (Ar)</label>
                <input type="text" name="workingHoursAr" defaultValue={settings.workingHoursAr} required className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Horaires de Travail (Fr)</label>
                <input type="text" name="workingHoursFr" defaultValue={settings.workingHoursFr} required className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl" />
              </div>
            </div>

            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 pt-4 border-t border-gray-100">
              {language === 'ar' ? 'روابط مواقع التواصل الاجتماعي' : 'Réseaux Sociaux'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Facebook</label>
                <input type="url" name="facebookUrl" defaultValue={settings.facebookUrl} className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl font-mono text-xs" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Twitter / X</label>
                <input type="url" name="twitterUrl" defaultValue={settings.twitterUrl} className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl font-mono text-xs" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">YouTube</label>
                <input type="url" name="youtubeUrl" defaultValue={settings.youtubeUrl} className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl font-mono text-xs" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Instagram</label>
                <input type="url" name="instagramUrl" defaultValue={settings.instagramUrl} className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl font-mono text-xs" />
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100">
              <button type="submit" className="px-6 py-3 bg-red-600 text-white font-bold text-xs rounded-xl shadow hover:bg-red-700 cursor-pointer">
                {language === 'ar' ? 'حفظ التغييرات وإعادة التهيئة' : 'Enregistrer la Configuration'}
              </button>
            </div>
          </form>
        )}

      </main>

      {/* --- MODALS OVERLAYS FOR CMS CRUD OPERATIONS --- */}

      {/* 1. NEWS MODAL */}
      {newsModal.isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl p-6 md:p-8 max-h-[90vh] overflow-y-auto border border-gray-100 shadow-2xl animate-scaleUp">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
              <h3 className="text-lg font-black text-gray-950 font-sans">
                {newsModal.isEdit ? (language === 'ar' ? 'تعديل مقال إخباري' : 'Modifier un article') : (language === 'ar' ? 'إضافة مقال إخباري جديد' : 'Créer un article')}
              </h3>
              <button onClick={() => setNewsModal({ isOpen: false, isEdit: false, data: null })} className="text-gray-400 hover:text-red-600 p-1.5">
                <XCircle size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSaveNews} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">العنوان بالعربية *</label>
                  <input type="text" name="titleAr" required defaultValue={newsModal.isEdit ? newsModal.data.titleAr : ''} className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl font-sans" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Titre en Français *</label>
                  <input type="text" name="titleFr" required defaultValue={newsModal.isEdit ? newsModal.data.titleFr : ''} className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl font-sans" />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">ملخص الخبر بالعربية *</label>
                  <textarea name="summaryAr" required defaultValue={newsModal.isEdit ? newsModal.data.summaryAr : ''} className="w-full px-3.5 py-2 border border-gray-300 rounded-xl font-sans h-20" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Résumé en Français *</label>
                  <textarea name="summaryFr" required defaultValue={newsModal.isEdit ? newsModal.data.summaryFr : ''} className="w-full px-3.5 py-2 border border-gray-300 rounded-xl font-sans h-20" />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">نص ومحتوى الخبر الكامل بالعربية *</label>
                  <textarea name="contentAr" required defaultValue={newsModal.isEdit ? newsModal.data.contentAr : ''} className="w-full px-3.5 py-2 border border-gray-300 rounded-xl font-sans h-44" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Contenu Complet en Français *</label>
                  <textarea name="contentFr" required defaultValue={newsModal.isEdit ? newsModal.data.contentFr : ''} className="w-full px-3.5 py-2 border border-gray-300 rounded-xl font-sans h-44" />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">رابط الصورة الإيضاحية</label>
                  <input type="url" name="image" defaultValue={newsModal.isEdit ? newsModal.data.image : ''} placeholder="https://images.unsplash.com/photo-..." className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl font-mono text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">تاريخ النشر</label>
                  <input type="date" name="date" defaultValue={newsModal.isEdit ? newsModal.data.date : new Date().toISOString().split('T')[0]} className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl" />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">فئة الخبر (Ar) *</label>
                  <input type="text" name="categoryAr" required defaultValue={newsModal.isEdit ? newsModal.data.categoryAr : 'مساعدات إنسانية'} className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Catégorie (Fr) *</label>
                  <input type="text" name="categoryFr" required defaultValue={newsModal.isEdit ? newsModal.data.categoryFr : 'Aide Humanitaire'} className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl" />
                </div>
              </div>

              {/* Status and Pin */}
              <div className="flex items-center gap-6 pt-4 border-t border-gray-100">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 cursor-pointer">
                  <input type="checkbox" name="isPinned" defaultChecked={newsModal.isEdit ? newsModal.data.isPinned : false} className="rounded text-red-600 focus:ring-red-500 w-4 h-4" />
                  <span>تثبيت في أعلى الصفحة الرئيسية (Pin to Home)</span>
                </label>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 cursor-pointer">
                  <input type="checkbox" name="isDraft" defaultChecked={newsModal.isEdit ? newsModal.data.isDraft : false} className="rounded text-red-600 focus:ring-red-500 w-4 h-4" />
                  <span>حفظ كمسودة غير منشورة (Save as Draft)</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                <button type="button" onClick={() => setNewsModal({ isOpen: false, isEdit: false, data: null })} className="px-5 py-2 border border-gray-200 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-50 cursor-pointer">
                  إلغاء
                </button>
                <button type="submit" className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold cursor-pointer shadow-md">
                  حفظ ونشر الآن
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. ANNOUNCEMENT MODAL */}
      {annModal.isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl p-6 md:p-8 max-h-[90vh] overflow-y-auto border border-gray-100 shadow-2xl">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
              <h3 className="text-lg font-black text-gray-950 font-sans">
                {annModal.isEdit ? 'تعديل الإعلان العاجل' : 'إضافة إعلان أو تنبيه جديد'}
              </h3>
              <button onClick={() => setAnnModal({ isOpen: false, isEdit: false, data: null })} className="text-gray-400 hover:text-red-600 p-1.5">
                <XCircle size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSaveAnnouncement} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">عنوان التنبيه بالعربية *</label>
                    <input type="text" name="titleAr" required defaultValue={annModal.isEdit ? annModal.data.titleAr : ''} className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Titre de l'alerte en Français *</label>
                    <input type="text" name="titleFr" required defaultValue={annModal.isEdit ? annModal.data.titleFr : ''} className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">تفاصيل الإعلان بالعربية *</label>
                    <textarea name="contentAr" required defaultValue={annModal.isEdit ? annModal.data.contentAr : ''} className="w-full px-3.5 py-2 border border-gray-300 rounded-xl h-36" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Contenu complet en Français *</label>
                    <textarea name="contentFr" required defaultValue={annModal.isEdit ? annModal.data.contentFr : ''} className="w-full px-3.5 py-2 border border-gray-300 rounded-xl h-36" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">مستوى الأولوية (Priority)</label>
                    <select name="priority" defaultValue={annModal.isEdit ? annModal.data.priority : 'medium'} className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl">
                      <option value="low">Low (عادي)</option>
                      <option value="medium">Medium (متوسط)</option>
                      <option value="high">High (هام)</option>
                      <option value="critical">Critical (عاجل جداً)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">تاريخ النشر</label>
                    <input type="date" name="date" defaultValue={annModal.isEdit ? annModal.data.date : new Date().toISOString().split('T')[0]} className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                <button type="button" onClick={() => setAnnModal({ isOpen: false, isEdit: false, data: null })} className="px-5 py-2 border border-gray-200 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-50">
                  إلغاء
                </button>
                <button type="submit" className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md">
                  حفظ الإعلان
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. MEMBER MODAL */}
      {memberModal.isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl p-6 md:p-8 max-h-[90vh] overflow-y-auto border border-gray-100 shadow-2xl">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
              <h3 className="text-lg font-black text-gray-950 font-sans">
                {memberModal.isEdit ? 'تعديل بيانات العضو' : 'إضافة عضو جديد للهيكل الإداري'}
              </h3>
              <button onClick={() => setMemberModal({ isOpen: false, isEdit: false, data: null })} className="text-gray-400 hover:text-red-600 p-1.5">
                <XCircle size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSaveMember} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">الاسم الكامل بالعربية *</label>
                  <input type="text" name="nameAr" required defaultValue={memberModal.isEdit ? memberModal.data.nameAr : ''} className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Nom Complet en Français *</label>
                  <input type="text" name="nameFr" required defaultValue={memberModal.isEdit ? memberModal.data.nameFr : ''} className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl" />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">المنصب والمسؤولية بالعربية *</label>
                  <input type="text" name="roleAr" required defaultValue={memberModal.isEdit ? memberModal.data.roleAr : ''} className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Fonction en Français *</label>
                  <input type="text" name="roleFr" required defaultValue={memberModal.isEdit ? memberModal.data.roleFr : ''} className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl" />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">سيرة مختصرة بالعربية *</label>
                  <textarea name="bioAr" required defaultValue={memberModal.isEdit ? memberModal.data.bioAr : ''} className="w-full px-3.5 py-2 border border-gray-300 rounded-xl h-24" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Biographie en Français *</label>
                  <textarea name="bioFr" required defaultValue={memberModal.isEdit ? memberModal.data.bioFr : ''} className="w-full px-3.5 py-2 border border-gray-300 rounded-xl h-24" />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">رابط صورة الملف الشخصي</label>
                  <input type="url" name="image" defaultValue={memberModal.isEdit ? memberModal.data.image : ''} placeholder="https://images.unsplash.com/..." className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl font-mono text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">ترتيب العرض (الرقم الأصغر يظهر أولاً)</label>
                  <input type="number" name="displayOrder" defaultValue={memberModal.isEdit ? memberModal.data.displayOrder : 1} required className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl" />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">البريد الإلكتروني المهني</label>
                  <input type="email" name="email" defaultValue={memberModal.isEdit ? memberModal.data.email : ''} className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl font-mono" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">الهاتف (اختياري)</label>
                  <input type="text" name="phone" defaultValue={memberModal.isEdit ? memberModal.data.phone : ''} className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl font-mono" />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                <button type="button" onClick={() => setMemberModal({ isOpen: false, isEdit: false, data: null })} className="px-5 py-2 border border-gray-200 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-50">
                  إلغاء
                </button>
                <button type="submit" className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md">
                  حفظ العضو
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. BLOOD CAMPAIGN MODAL */}
      {campModal.isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl p-6 md:p-8 max-h-[90vh] overflow-y-auto border border-gray-100 shadow-2xl">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
              <h3 className="text-lg font-black text-gray-950 font-sans">
                {campModal.isEdit ? 'تعديل حملة التبرع بالدم' : 'إضافة حملة تبرع جديدة'}
              </h3>
              <button onClick={() => setCampModal({ isOpen: false, isEdit: false, data: null })} className="text-gray-400 hover:text-red-600 p-1.5">
                <XCircle size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSaveCampaign} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">عنوان الحملة بالعربية *</label>
                  <input type="text" name="titleAr" required defaultValue={campModal.isEdit ? campModal.data.titleAr : ''} className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Titre de la campagne (Fr) *</label>
                  <input type="text" name="titleFr" required defaultValue={campModal.isEdit ? campModal.data.titleFr : ''} className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl" />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">مقر ومكان التجمع بالعربية *</label>
                  <input type="text" name="locationAr" required defaultValue={campModal.isEdit ? campModal.data.locationAr : ''} className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Lieu de collecte (Fr) *</label>
                  <input type="text" name="locationFr" required defaultValue={campModal.isEdit ? campModal.data.locationFr : ''} className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl" />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">تاريخ الحملة *</label>
                  <input type="date" name="date" required defaultValue={campModal.isEdit ? campModal.data.date : new Date().toISOString().split('T')[0]} className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">توقيت وساعات الاستقبال *</label>
                  <input type="text" name="time" required defaultValue={campModal.isEdit ? campModal.data.time : '08:30 - 17:00'} className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl font-mono" />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">حالة الحملة</label>
                  <select name="status" defaultValue={campModal.isEdit ? campModal.data.status : 'upcoming'} className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl">
                    <option value="upcoming">Upcoming (قادمة)</option>
                    <option value="ongoing">Ongoing (جارية الآن)</option>
                    <option value="completed">Completed (مكتملة)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">عدد وحدات الدم المجمعة حتى الآن</label>
                  <input type="number" name="collectedUnits" defaultValue={campModal.isEdit ? campModal.data.collectedUnits : 0} className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl" />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">شرح ووصف الحملة (Ar)</label>
                  <textarea name="descriptionAr" defaultValue={campModal.isEdit ? campModal.data.descriptionAr : ''} className="w-full px-3.5 py-2 border border-gray-300 rounded-xl h-24" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Description (Fr)</label>
                  <textarea name="descriptionFr" defaultValue={campModal.isEdit ? campModal.data.descriptionFr : ''} className="w-full px-3.5 py-2 border border-gray-300 rounded-xl h-24" />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                <button type="button" onClick={() => setCampModal({ isOpen: false, isEdit: false, data: null })} className="px-5 py-2 border border-gray-200 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-50">
                  إلغاء
                </button>
                <button type="submit" className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md">
                  حفظ الحملة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. FIRST AID TOPIC MODAL */}
      {faModal.isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl p-6 md:p-8 max-h-[90vh] overflow-y-auto border border-gray-100 shadow-2xl">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
              <h3 className="text-lg font-black text-gray-950 font-sans">
                {faModal.isEdit ? 'تعديل الموضوع الإسعافي' : 'إضافة درس إسعافي جديد'}
              </h3>
              <button onClick={() => setFaModal({ isOpen: false, isEdit: false, data: null })} className="text-gray-400 hover:text-red-600 p-1.5">
                <XCircle size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSaveFirstAid} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">اسم الحالة الإسعافية بالعربية *</label>
                  <input type="text" name="titleAr" required defaultValue={faModal.isEdit ? faModal.data.titleAr : ''} className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Titre de la fiche en Français *</label>
                  <input type="text" name="titleFr" required defaultValue={faModal.isEdit ? faModal.data.titleFr : ''} className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl" />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">شرح عام بالعربية *</label>
                  <textarea name="descriptionAr" required defaultValue={faModal.isEdit ? faModal.data.descriptionAr : ''} className="w-full px-3.5 py-2 border border-gray-300 rounded-xl h-24" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Description en Français *</label>
                  <textarea name="descriptionFr" required defaultValue={faModal.isEdit ? faModal.data.descriptionFr : ''} className="w-full px-3.5 py-2 border border-gray-300 rounded-xl h-24" />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">تعليمات الطوارئ السريعة (Ar) *</label>
                  <input type="text" name="emergencyInstructionsAr" required defaultValue={faModal.isEdit ? faModal.data.emergencyInstructionsAr : ''} placeholder="اتصل بالرقم 14 فوراً..." className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Consignes d'urgence rapides (Fr) *</label>
                  <input type="text" name="emergencyInstructionsFr" required defaultValue={faModal.isEdit ? faModal.data.emergencyInstructionsFr : ''} placeholder="Appelez le 14 immédiatement..." className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl" />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">الخطوات الإسعافية بالعربية (خطوة في كل سطر) *</label>
                  <textarea name="stepsAr" required defaultValue={faModal.isEdit ? faModal.data.stepsAr.join('\n') : ''} placeholder="الخطوة الأولى&#10;الخطوة الثانية&#10;الخطوة الثالثة" className="w-full px-3.5 py-2 border border-gray-300 rounded-xl h-28" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Étapes de Secours en Français (Une étape par ligne) *</label>
                  <textarea name="stepsFr" required defaultValue={faModal.isEdit ? faModal.data.stepsFr.join('\n') : ''} placeholder="Première étape&#10;Deuxième étape&#10;Troisième étape" className="w-full px-3.5 py-2 border border-gray-300 rounded-xl h-28" />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">أيقونة توضيحية (اسم الأيقونة)</label>
                  <input type="text" name="icon" defaultValue={faModal.isEdit ? faModal.data.icon : 'HeartPulse'} placeholder="HeartPulse, Droplet, ShieldAlert" className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl" />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                <button type="button" onClick={() => setFaModal({ isOpen: false, isEdit: false, data: null })} className="px-5 py-2 border border-gray-200 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-50">
                  إلغاء
                </button>
                <button type="submit" className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md">
                  حفظ الدرس
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
