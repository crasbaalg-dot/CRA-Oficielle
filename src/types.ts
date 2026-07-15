/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MultilingualString {
  ar: string;
  fr: string;
}

export type Language = 'ar' | 'fr';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: 'super_admin' | 'admin' | 'editor' | 'volunteer_manager' | 'viewer';
  createdAt: string;
  status: 'active' | 'disabled';
}

export interface NewsItem {
  id: string;
  titleAr: string;
  titleFr: string;
  contentAr: string;
  contentFr: string;
  summaryAr: string;
  summaryFr: string;
  categoryAr: string;
  categoryFr: string;
  image: string;
  date: string;
  views: number;
  isPinned: boolean;
  isDraft: boolean;
}

export interface AnnouncementItem {
  id: string;
  titleAr: string;
  titleFr: string;
  contentAr: string;
  contentFr: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  date: string;
  expiryDate?: string;
  isPinned: boolean;
  attachmentUrl?: string;
}

export interface Member {
  id: string;
  nameAr: string;
  nameFr: string;
  roleAr: string;
  roleFr: string;
  bioAr: string;
  bioFr: string;
  image: string;
  email?: string;
  phone?: string;
  displayOrder: number;
}

export interface FirstAidTopic {
  id: string;
  titleAr: string;
  titleFr: string;
  descriptionAr: string;
  descriptionFr: string;
  stepsAr: string[]; // Arabic steps
  stepsFr: string[]; // French steps
  emergencyInstructionsAr: string;
  emergencyInstructionsFr: string;
  icon: string; // Lucide icon name
  videoUrl?: string;
}

export interface BloodCampaign {
  id: string;
  titleAr: string;
  titleFr: string;
  locationAr: string;
  locationFr: string;
  date: string;
  time: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  collectedUnits?: number;
  descriptionAr: string;
  descriptionFr: string;
}

export interface VolunteerApplication {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: string;
  bloodType: string;
  profession: string;
  skillsAr?: string;
  skillsFr?: string;
  appliedDate: string;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  date: string;
  isRead: boolean;
}

export interface InstitutionStats {
  volunteersCount: number;
  bloodUnitsCount: number;
  firstAidTrainedCount: number;
  campaignsCount: number;
}

export interface Settings {
  siteNameAr: string;
  siteNameFr: string;
  phone: string;
  emergencyPhone: string;
  email: string;
  addressAr: string;
  addressFr: string;
  workingHoursAr: string;
  workingHoursFr: string;
  facebookUrl?: string;
  twitterUrl?: string;
  youtubeUrl?: string;
  instagramUrl?: string;
}
